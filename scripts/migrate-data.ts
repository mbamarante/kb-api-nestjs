#!/usr/bin/env ts-node
import * as mysql from 'mysql2/promise';
import * as pg from 'pg';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Carregar variáveis de ambiente
dotenv.config({ path: path.resolve(process.cwd(), '.development.env') });

interface ColumnInfo {
  Field: string;
  Type: string;
  Null: string;
  Key: string;
  Default: string | null;
  Extra: string;
}

interface ForeignKeyInfo {
  columnName: string;
  referencedTableName: string;
  referencedColumnName: string;
}

interface TableInfo {
  tableName: string;
  columns: ColumnInfo[];
  foreignKeys: ForeignKeyInfo[];
}

class DataMigrator {
  private mysqlConnection: mysql.Connection | null = null;
  private pgPool: pg.Pool | null = null;

  constructor(
    private mysqlConfig: mysql.ConnectionOptions,
    private pgConfig: pg.PoolConfig,
  ) {}

  async connect(): Promise<void> {
    this.mysqlConnection = await mysql.createConnection(this.mysqlConfig);
    this.pgPool = new pg.Pool(this.pgConfig);
    console.log('✅ Connected to both databases');
  }

  async disconnect(): Promise<void> {
    if (this.mysqlConnection) {
      await this.mysqlConnection.end();
    }
    if (this.pgPool) {
      await this.pgPool.end();
    }
  }

  async getTables(): Promise<string[]> {
    const [rows] = await this.mysqlConnection!.query('SHOW TABLES');
    return (rows as any[]).map((row) => Object.values(row)[0] as string);
  }

  async getTableInfo(tableName: string): Promise<TableInfo> {
    const [rows] = await this.mysqlConnection!.query(
      `DESCRIBE \`${tableName}\``,
    );

    // Buscar foreign keys
    const [fkRows] = await this.mysqlConnection!.query(
      `SELECT 
        COLUMN_NAME as columnName,
        REFERENCED_TABLE_NAME as referencedTableName,
        REFERENCED_COLUMN_NAME as referencedColumnName
      FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = ?
        AND REFERENCED_TABLE_NAME IS NOT NULL`,
      [tableName],
    );

    const foreignKeys = (fkRows as any[]).map(
      (fk: any) =>
        ({
          columnName: fk.columnName || fk.COLUMN_NAME,
          referencedTableName:
            fk.referencedTableName || fk.REFERENCED_TABLE_NAME,
          referencedColumnName:
            fk.referencedColumnName || fk.REFERENCED_COLUMN_NAME,
        }) as ForeignKeyInfo,
    );

    return {
      tableName,
      columns: rows as ColumnInfo[],
      foreignKeys,
    };
  }

  /**
   * Converte valor MySQL para formato compatível com PostgreSQL
   */
  private convertValue(value: any, mysqlType: string): any {
    if (value === null || value === undefined) {
      return null;
    }

    const type = mysqlType.toLowerCase();

    // Boolean/TinyInt(1)
    // IMPORTANTE: Se a coluna no PostgreSQL é smallint (não boolean), manter como número
    // A conversão para boolean só deve acontecer se a coluna PostgreSQL for realmente boolean
    // Por enquanto, vamos manter o valor numérico para evitar erros
    if (
      (type.includes('tinyint(1)') || type.includes('bool')) &&
      !type.includes('unsigned')
    ) {
      // Retornar como número (0 ou 1) para compatibilidade com smallint no PostgreSQL
      if (typeof value === 'number') {
        return value === 1 ? 1 : 0;
      }
      if (typeof value === 'string') {
        return value === '1' || value.toLowerCase() === 'true' ? 1 : 0;
      }
      if (typeof value === 'boolean') {
        return value ? 1 : 0;
      }
      return value ? 1 : 0;
    }

    // Timestamps/Datetime
    if (type.includes('timestamp') || type.includes('datetime')) {
      if (value instanceof Date) {
        return value;
      }
      if (typeof value === 'string') {
        // MySQL pode retornar string, converter para Date
        return new Date(value);
      }
    }

    // Date
    if (
      type.includes('date') &&
      !type.includes('time') &&
      !type.includes('stamp')
    ) {
      if (value instanceof Date) {
        return value;
      }
      if (typeof value === 'string') {
        return value.split(' ')[0]; // Pegar apenas a data
      }
    }

    // JSON
    if (type.includes('json')) {
      if (typeof value === 'string') {
        try {
          return JSON.parse(value);
        } catch {
          // Se não conseguir fazer parse, retorna como string (PostgreSQL jsonb pode aceitar)
          return value;
        }
      }
      if (typeof value === 'object' && value !== null) {
        return value; // Já é um objeto
      }
      return value;
    }

    // UUID - se o MySQL tem UUID como string, manter como string
    // O PostgreSQL vai validar se for UUID válido
    if (
      type.includes('char') &&
      typeof value === 'string' &&
      value.match(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      )
    ) {
      return value;
    }

    return value;
  }

  /**
   * Determina a ordem de migração baseada em foreign keys
   */
  async getMigrationOrder(tables: string[]): Promise<string[]> {
    const tableInfoMap = new Map<string, TableInfo>();
    const dependencies = new Map<string, Set<string>>();

    // Coletar informações de todas as tabelas
    for (const table of tables) {
      const info = await this.getTableInfo(table);
      tableInfoMap.set(table, info);
      dependencies.set(table, new Set());
    }

    // Construir grafo de dependências
    for (const [table, info] of tableInfoMap) {
      for (const fk of info.foreignKeys) {
        if (tables.includes(fk.referencedTableName)) {
          dependencies.get(table)!.add(fk.referencedTableName);
        }
      }
    }

    // Topological sort
    const ordered: string[] = [];
    const visited = new Set<string>();
    const visiting = new Set<string>();

    const visit = (table: string) => {
      if (visited.has(table)) return;
      if (visiting.has(table)) {
        console.warn(
          `⚠️  Circular dependency detected involving table: ${table}`,
        );
        return;
      }

      visiting.add(table);
      for (const dep of dependencies.get(table) || []) {
        visit(dep);
      }
      visiting.delete(table);
      visited.add(table);
      ordered.push(table);
    };

    for (const table of tables) {
      visit(table);
    }

    return ordered;
  }

  async migrateTable(tableName: string, schema?: string): Promise<number> {
    const tableInfo = await this.getTableInfo(tableName);
    const pgSchema = schema || 'public';
    const pgTableName = schema ? `${pgSchema}.${tableName}` : tableName;

    console.log(`\n📊 Migrating table: ${tableName} (→ ${pgTableName})`);

    // Verificar se tabela existe no PostgreSQL
    const tableExists = await this.pgPool!.query(
      `SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = $1 AND table_name = $2
      )`,
      [pgSchema, tableName],
    );

    if (!tableExists.rows[0].exists) {
      console.log(
        `  ⚠️  Table ${pgTableName} does not exist in PostgreSQL. Skipping...`,
      );
      return 0;
    }

    // Buscar nomes das colunas no PostgreSQL
    const pgColumns = await this.pgPool!.query(
      `SELECT column_name 
       FROM information_schema.columns 
       WHERE table_schema = $1 AND table_name = $2 
       ORDER BY ordinal_position`,
      [pgSchema, tableName],
    );

    const pgColumnNames = pgColumns.rows.map((row) => row.column_name);

    if (pgColumnNames.length === 0) {
      console.log(`  ⚠️  No columns found in PostgreSQL table`);
      return 0;
    }

    // Buscar dados do MySQL
    const [mysqlRows] = await this.mysqlConnection!.query(
      `SELECT * FROM \`${tableName}\``,
    );

    if ((mysqlRows as any[]).length === 0) {
      console.log(`  ℹ️  No data to migrate`);
      return 0;
    }

    console.log(`  📦 Found ${(mysqlRows as any[]).length} rows`);

    // Mapear colunas MySQL → PostgreSQL
    // Criar mapeamento: MySQL snake_case pode mapear para PostgreSQL snake_case ou camelCase
    const columnMapping = new Map<string, string>();
    let hasAutoIncrementId = false;
    let idColumnName = 'id';

    // Identificar coluna ID auto_increment
    const autoIncrementCol = tableInfo.columns.find((col) =>
      col.Extra.includes('auto_increment'),
    );
    if (autoIncrementCol) {
      hasAutoIncrementId = true;
      idColumnName = autoIncrementCol.Field;
    }

    // Mapear todas as colunas (incluindo auto_increment para manter IDs originais)
    for (const mysqlCol of tableInfo.columns) {
      // Tentar encontrar coluna com mesmo nome (case-insensitive)
      const pgCol = pgColumnNames.find(
        (pg) => pg.toLowerCase() === mysqlCol.Field.toLowerCase(),
      );

      if (pgCol) {
        columnMapping.set(mysqlCol.Field, pgCol);
      } else {
        // Se não encontrar, converter snake_case para camelCase e procurar
        const camelCase = mysqlCol.Field.replace(/_([a-z])/g, (_, letter) =>
          letter.toUpperCase(),
        );
        const pgColCamel = pgColumnNames.find(
          (pg) => pg.toLowerCase() === camelCase.toLowerCase(),
        );

        if (pgColCamel) {
          columnMapping.set(mysqlCol.Field, pgColCamel);
        } else {
          // Se não encontrar, avisar mas não fazer mapeamento automático
          // O nome deve ser mantido igual ao MySQL
          console.warn(
            `  ⚠️  Column ${mysqlCol.Field} from MySQL not found in PostgreSQL`,
          );
        }
      }
    }

    // Filtrar apenas colunas que existem em ambos
    const columnsToMigrate = Array.from(columnMapping.keys());
    const pgColumnsToUse = columnsToMigrate.map(
      (mysql) => columnMapping.get(mysql)!,
    );

    if (columnsToMigrate.length === 0) {
      console.log(`  ⚠️  No matching columns to migrate`);
      return 0;
    }

    // Preparar query de inserção
    const placeholders = pgColumnsToUse.map((_, i) => `$${i + 1}`).join(', ');
    const columnNames = pgColumnsToUse.map((col) => `"${col}"`).join(', ');

    // Se estamos inserindo IDs manualmente, usar ON CONFLICT para evitar duplicatas
    // Caso contrário, deixar o PostgreSQL gerar os IDs
    const conflictClause =
      hasAutoIncrementId && pgColumnsToUse.includes(idColumnName)
        ? `ON CONFLICT ("${idColumnName}") DO NOTHING`
        : `ON CONFLICT DO NOTHING`;

    const insertQuery = `INSERT INTO ${pgTableName} (${columnNames}) VALUES (${placeholders}) ${conflictClause}`;

    let inserted = 0;
    let errors = 0;

    // Inserir dados em lotes
    const batchSize = 100;
    const rows = mysqlRows as any[];

    for (let i = 0; i < rows.length; i += batchSize) {
      const batch = rows.slice(i, i + batchSize);

      for (const row of batch) {
        try {
          const values = columnsToMigrate.map((mysqlCol) => {
            const colInfo = tableInfo.columns.find(
              (c) => c.Field === mysqlCol,
            )!;
            const converted = this.convertValue(row[mysqlCol], colInfo.Type);
            return converted;
          });

          await this.pgPool!.query(insertQuery, values);
          inserted++;
        } catch (error: any) {
          errors++;
          if (errors <= 5) {
            // Mostrar apenas os primeiros 5 erros com mais detalhes
            console.error(
              `  ❌ Error inserting row (${errors}/${errors > 5 ? 'many' : '5'}): ${error.message}`,
            );
            if (error.detail) {
              console.error(`     Detail: ${error.detail}`);
            }
          }
        }
      }

      process.stdout.write(
        `\r  ⏳ Progress: ${Math.min(i + batchSize, rows.length)}/${rows.length} rows processed`,
      );
    }

    console.log(`\n  ✅ Completed: ${inserted} inserted, ${errors} errors`);

    // Se inserimos IDs manualmente, atualizar a sequência do PostgreSQL
    if (hasAutoIncrementId && inserted > 0) {
      try {
        // Buscar o nome real da sequência no PostgreSQL
        const sequenceQuery = schema
          ? `SELECT sequencename FROM pg_sequences WHERE schemaname = $1 AND sequencename LIKE $2`
          : `SELECT sequencename FROM pg_sequences WHERE schemaname = 'public' AND sequencename LIKE $1`;

        const sequenceParams = schema
          ? [schema, `%${tableName}_${idColumnName}%`]
          : [`%${tableName}_${idColumnName}%`];

        const seqResult = await this.pgPool!.query(
          sequenceQuery,
          sequenceParams,
        );

        if (seqResult.rows.length > 0) {
          const sequenceName = schema
            ? `${schema}.${seqResult.rows[0].sequencename}`
            : seqResult.rows[0].sequencename;

          // Buscar o maior ID inserido
          const maxIdResult = await this.pgPool!.query(
            `SELECT MAX("${idColumnName}") as max_id FROM ${pgTableName}`,
          );
          const maxId = maxIdResult.rows[0]?.max_id;

          if (maxId) {
            // Atualizar a sequência para o próximo valor
            await this.pgPool!.query(`SELECT setval($1, $2, true)`, [
              sequenceName,
              maxId,
            ]);
            console.log(`  🔄 Updated sequence ${sequenceName} to ${maxId}`);
          }
        } else {
          console.warn(
            `  ⚠️  Sequence not found for ${tableName}.${idColumnName}`,
          );
        }
      } catch (seqError: any) {
        console.warn(
          `  ⚠️  Could not update sequence: ${seqError?.message || 'Unknown error'}`,
        );
      }
    }

    return inserted;
  }

  async migrate(
    tables?: string[],
    schemas?: Map<string, string>,
  ): Promise<void> {
    const allTables = tables || (await this.getTables());
    const orderedTables = await this.getMigrationOrder(allTables);

    console.log(`\n🚀 Starting data migration`);
    console.log(`   Source: MySQL (${this.mysqlConfig.database})`);
    console.log(`   Target: PostgreSQL (${this.pgConfig.database})`);
    console.log(`   Tables: ${orderedTables.length}`);

    let totalInserted = 0;

    for (const table of orderedTables) {
      const schema = schemas?.get(table);
      const inserted = await this.migrateTable(table, schema);
      totalInserted += inserted;
    }

    console.log(`\n✨ Migration completed!`);
    console.log(`   Total rows inserted: ${totalInserted}`);
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);

  // MySQL config (source)
  const mysqlConfig = {
    host: process.env.MYSQL_HOST || process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.MYSQL_PORT || process.env.DB_PORT || '3306', 10),
    user: process.env.MYSQL_USERNAME || process.env.DB_USERNAME || 'root',
    password: process.env.MYSQL_PASSWORD || process.env.DB_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || process.env.DB_DATABASE || '',
  };

  // PostgreSQL config (target)
  const pgConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'kb',
  };

  if (!mysqlConfig.database) {
    console.error('❌ Error: MySQL database name is required');
    console.error('   Set MYSQL_DATABASE or DB_DATABASE environment variable');
    process.exit(1);
  }

  if (!pgConfig.database) {
    console.error('❌ Error: PostgreSQL database name is required');
    console.error('   Set DB_DATABASE environment variable');
    process.exit(1);
  }

  // Opção de especificar tabelas específicas
  const tables = args.filter((arg) => !arg.startsWith('--'));
  const schemasMap = new Map<string, string>();

  // Parse schema mappings: --schema=users:accounts
  args
    .filter((arg) => arg.startsWith('--schema='))
    .forEach((arg) => {
      const [, mapping] = arg.split('=');
      const [table, schema] = mapping.split(':');
      if (table && schema) {
        schemasMap.set(table, schema);
      }
    });

  const migrator = new DataMigrator(mysqlConfig, pgConfig);

  try {
    await migrator.connect();
    await migrator.migrate(tables.length > 0 ? tables : undefined, schemasMap);
  } catch (error: any) {
    console.error('❌ Error:', error?.message || 'Unknown error');
    if (error?.code === 'ECONNREFUSED') {
      console.error(
        '   Could not connect to database. Please check your connection settings.',
      );
    }
    process.exit(1);
  } finally {
    await migrator.disconnect();
  }
}

main().catch((error) => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
