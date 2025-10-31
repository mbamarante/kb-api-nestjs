#!/usr/bin/env ts-node
import * as mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Carregar variáveis de ambiente do arquivo .development.env
dotenv.config({ path: path.resolve(process.cwd(), '.development.env') });

async function listTables() {
  // MySQL connection config (para ler a estrutura do banco antigo)
  const mysqlConfig = {
    host: process.env.MYSQL_HOST || process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.MYSQL_PORT || process.env.DB_PORT || '3306', 10),
    user: process.env.MYSQL_USERNAME || process.env.DB_USERNAME || 'root',
    password: process.env.MYSQL_PASSWORD || process.env.DB_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || process.env.DB_DATABASE || '',
  };

  if (!mysqlConfig.database) {
    console.error('❌ Error: Database name is required');
    console.error('   Set MYSQL_DATABASE or DB_DATABASE environment variable');
    console.error(
      '   Also set: MYSQL_HOST (or DB_HOST), MYSQL_PORT (or DB_PORT),',
    );
    console.error(
      '            MYSQL_USERNAME (or DB_USERNAME), MYSQL_PASSWORD (or DB_PASSWORD)',
    );
    process.exit(1);
  }

  try {
    const connection = await mysql.createConnection(mysqlConfig);
    const [rows] = await connection.query('SHOW TABLES');
    const tables = (rows as any[]).map(
      (row) => Object.values(row)[0] as string,
    );

    console.log(`\n📊 Tables in MySQL database "${mysqlConfig.database}":\n`);
    if (tables.length === 0) {
      console.log('  No tables found.');
    } else {
      tables.forEach((table, index) => {
        console.log(`  ${index + 1}. ${table}`);
      });
      console.log(
        `\n💡 To generate PostgreSQL-compatible resources for a table, run:`,
      );
      console.log(`   npm run generate:resource -- ${tables[0]}`);
      console.log(
        `\n   Note: Resources will be generated for PostgreSQL, even though`,
      );
      console.log(`   the source structure is read from MySQL.`);
    }

    await connection.end();
  } catch (error: any) {
    console.error('❌ Error:', error?.message || 'Unknown error');
    if (error?.code === 'ECONNREFUSED') {
      console.error(
        '   Could not connect to database. Please check your connection settings.',
      );
    }
    process.exit(1);
  }
}

listTables().catch((error) => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
