#!/usr/bin/env ts-node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mysql = __importStar(require("mysql2/promise"));
const pg = __importStar(require("pg"));
const dotenv = __importStar(require("dotenv"));
const path = __importStar(require("path"));
dotenv.config({ path: path.resolve(process.cwd(), '.development.env') });
class DataMigrator {
    mysqlConfig;
    pgConfig;
    mysqlConnection = null;
    pgPool = null;
    constructor(mysqlConfig, pgConfig) {
        this.mysqlConfig = mysqlConfig;
        this.pgConfig = pgConfig;
    }
    async connect() {
        this.mysqlConnection = await mysql.createConnection(this.mysqlConfig);
        this.pgPool = new pg.Pool(this.pgConfig);
        console.log('✅ Connected to both databases');
    }
    async disconnect() {
        if (this.mysqlConnection) {
            await this.mysqlConnection.end();
        }
        if (this.pgPool) {
            await this.pgPool.end();
        }
    }
    async getTables() {
        const [rows] = await this.mysqlConnection.query('SHOW TABLES');
        return rows.map((row) => Object.values(row)[0]);
    }
    async getTableInfo(tableName) {
        const [rows] = await this.mysqlConnection.query(`DESCRIBE \`${tableName}\``);
        const [fkRows] = await this.mysqlConnection.query(`SELECT 
        COLUMN_NAME as columnName,
        REFERENCED_TABLE_NAME as referencedTableName,
        REFERENCED_COLUMN_NAME as referencedColumnName
      FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = ?
        AND REFERENCED_TABLE_NAME IS NOT NULL`, [tableName]);
        const foreignKeys = fkRows.map((fk) => ({
            columnName: fk.columnName || fk.COLUMN_NAME,
            referencedTableName: fk.referencedTableName || fk.REFERENCED_TABLE_NAME,
            referencedColumnName: fk.referencedColumnName || fk.REFERENCED_COLUMN_NAME,
        }));
        return {
            tableName,
            columns: rows,
            foreignKeys,
        };
    }
    convertValue(value, mysqlType) {
        if (value === null || value === undefined) {
            return null;
        }
        const type = mysqlType.toLowerCase();
        if ((type.includes('tinyint(1)') || type.includes('bool')) &&
            !type.includes('unsigned')) {
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
        if (type.includes('timestamp') || type.includes('datetime')) {
            if (value instanceof Date) {
                return value;
            }
            if (typeof value === 'string') {
                return new Date(value);
            }
        }
        if (type.includes('date') &&
            !type.includes('time') &&
            !type.includes('stamp')) {
            if (value instanceof Date) {
                return value;
            }
            if (typeof value === 'string') {
                return value.split(' ')[0];
            }
        }
        if (type.includes('json')) {
            if (typeof value === 'string') {
                try {
                    return JSON.parse(value);
                }
                catch {
                    return value;
                }
            }
            if (typeof value === 'object' && value !== null) {
                return value;
            }
            return value;
        }
        if (type.includes('char') &&
            typeof value === 'string' &&
            value.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
            return value;
        }
        return value;
    }
    async getMigrationOrder(tables) {
        const tableInfoMap = new Map();
        const dependencies = new Map();
        for (const table of tables) {
            const info = await this.getTableInfo(table);
            tableInfoMap.set(table, info);
            dependencies.set(table, new Set());
        }
        for (const [table, info] of tableInfoMap) {
            for (const fk of info.foreignKeys) {
                if (tables.includes(fk.referencedTableName)) {
                    dependencies.get(table).add(fk.referencedTableName);
                }
            }
        }
        const ordered = [];
        const visited = new Set();
        const visiting = new Set();
        const visit = (table) => {
            if (visited.has(table))
                return;
            if (visiting.has(table)) {
                console.warn(`⚠️  Circular dependency detected involving table: ${table}`);
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
    async migrateTable(tableName, schema) {
        const tableInfo = await this.getTableInfo(tableName);
        const pgSchema = schema || 'public';
        const pgTableName = schema ? `${pgSchema}.${tableName}` : tableName;
        console.log(`\n📊 Migrating table: ${tableName} (→ ${pgTableName})`);
        const tableExists = await this.pgPool.query(`SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = $1 AND table_name = $2
      )`, [pgSchema, tableName]);
        if (!tableExists.rows[0].exists) {
            console.log(`  ⚠️  Table ${pgTableName} does not exist in PostgreSQL. Skipping...`);
            return 0;
        }
        const pgColumns = await this.pgPool.query(`SELECT column_name 
       FROM information_schema.columns 
       WHERE table_schema = $1 AND table_name = $2 
       ORDER BY ordinal_position`, [pgSchema, tableName]);
        const pgColumnNames = pgColumns.rows.map((row) => row.column_name);
        if (pgColumnNames.length === 0) {
            console.log(`  ⚠️  No columns found in PostgreSQL table`);
            return 0;
        }
        const [mysqlRows] = await this.mysqlConnection.query(`SELECT * FROM \`${tableName}\``);
        if (mysqlRows.length === 0) {
            console.log(`  ℹ️  No data to migrate`);
            return 0;
        }
        console.log(`  📦 Found ${mysqlRows.length} rows`);
        const columnMapping = new Map();
        let hasAutoIncrementId = false;
        let idColumnName = 'id';
        const autoIncrementCol = tableInfo.columns.find((col) => col.Extra.includes('auto_increment'));
        if (autoIncrementCol) {
            hasAutoIncrementId = true;
            idColumnName = autoIncrementCol.Field;
        }
        for (const mysqlCol of tableInfo.columns) {
            const pgCol = pgColumnNames.find((pg) => pg.toLowerCase() === mysqlCol.Field.toLowerCase());
            if (pgCol) {
                columnMapping.set(mysqlCol.Field, pgCol);
            }
            else {
                const camelCase = mysqlCol.Field.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
                const pgColCamel = pgColumnNames.find((pg) => pg.toLowerCase() === camelCase.toLowerCase());
                if (pgColCamel) {
                    columnMapping.set(mysqlCol.Field, pgColCamel);
                }
                else {
                    console.warn(`  ⚠️  Column ${mysqlCol.Field} from MySQL not found in PostgreSQL`);
                }
            }
        }
        const columnsToMigrate = Array.from(columnMapping.keys());
        const pgColumnsToUse = columnsToMigrate.map((mysql) => columnMapping.get(mysql));
        if (columnsToMigrate.length === 0) {
            console.log(`  ⚠️  No matching columns to migrate`);
            return 0;
        }
        const placeholders = pgColumnsToUse.map((_, i) => `$${i + 1}`).join(', ');
        const columnNames = pgColumnsToUse.map((col) => `"${col}"`).join(', ');
        const conflictClause = hasAutoIncrementId && pgColumnsToUse.includes(idColumnName)
            ? `ON CONFLICT ("${idColumnName}") DO NOTHING`
            : `ON CONFLICT DO NOTHING`;
        const insertQuery = `INSERT INTO ${pgTableName} (${columnNames}) VALUES (${placeholders}) ${conflictClause}`;
        let inserted = 0;
        let errors = 0;
        const batchSize = 100;
        const rows = mysqlRows;
        for (let i = 0; i < rows.length; i += batchSize) {
            const batch = rows.slice(i, i + batchSize);
            for (const row of batch) {
                try {
                    const values = columnsToMigrate.map((mysqlCol) => {
                        const colInfo = tableInfo.columns.find((c) => c.Field === mysqlCol);
                        const converted = this.convertValue(row[mysqlCol], colInfo.Type);
                        return converted;
                    });
                    await this.pgPool.query(insertQuery, values);
                    inserted++;
                }
                catch (error) {
                    errors++;
                    if (errors <= 5) {
                        console.error(`  ❌ Error inserting row (${errors}/${errors > 5 ? 'many' : '5'}): ${error.message}`);
                        if (error.detail) {
                            console.error(`     Detail: ${error.detail}`);
                        }
                    }
                }
            }
            process.stdout.write(`\r  ⏳ Progress: ${Math.min(i + batchSize, rows.length)}/${rows.length} rows processed`);
        }
        console.log(`\n  ✅ Completed: ${inserted} inserted, ${errors} errors`);
        if (hasAutoIncrementId && inserted > 0) {
            try {
                const sequenceQuery = schema
                    ? `SELECT sequencename FROM pg_sequences WHERE schemaname = $1 AND sequencename LIKE $2`
                    : `SELECT sequencename FROM pg_sequences WHERE schemaname = 'public' AND sequencename LIKE $1`;
                const sequenceParams = schema
                    ? [schema, `%${tableName}_${idColumnName}%`]
                    : [`%${tableName}_${idColumnName}%`];
                const seqResult = await this.pgPool.query(sequenceQuery, sequenceParams);
                if (seqResult.rows.length > 0) {
                    const sequenceName = schema
                        ? `${schema}.${seqResult.rows[0].sequencename}`
                        : seqResult.rows[0].sequencename;
                    const maxIdResult = await this.pgPool.query(`SELECT MAX("${idColumnName}") as max_id FROM ${pgTableName}`);
                    const maxId = maxIdResult.rows[0]?.max_id;
                    if (maxId) {
                        await this.pgPool.query(`SELECT setval($1, $2, true)`, [
                            sequenceName,
                            maxId,
                        ]);
                        console.log(`  🔄 Updated sequence ${sequenceName} to ${maxId}`);
                    }
                }
                else {
                    console.warn(`  ⚠️  Sequence not found for ${tableName}.${idColumnName}`);
                }
            }
            catch (seqError) {
                console.warn(`  ⚠️  Could not update sequence: ${seqError?.message || 'Unknown error'}`);
            }
        }
        return inserted;
    }
    async migrate(tables, schemas) {
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
async function main() {
    const args = process.argv.slice(2);
    const mysqlConfig = {
        host: process.env.MYSQL_HOST || process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.MYSQL_PORT || process.env.DB_PORT || '3306', 10),
        user: process.env.MYSQL_USERNAME || process.env.DB_USERNAME || 'root',
        password: process.env.MYSQL_PASSWORD || process.env.DB_PASSWORD || '',
        database: process.env.MYSQL_DATABASE || process.env.DB_DATABASE || '',
    };
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
    const tables = args.filter((arg) => !arg.startsWith('--'));
    const schemasMap = new Map();
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
    }
    catch (error) {
        console.error('❌ Error:', error?.message || 'Unknown error');
        if (error?.code === 'ECONNREFUSED') {
            console.error('   Could not connect to database. Please check your connection settings.');
        }
        process.exit(1);
    }
    finally {
        await migrator.disconnect();
    }
}
main().catch((error) => {
    console.error('Unhandled error:', error);
    process.exit(1);
});
//# sourceMappingURL=migrate-data.js.map