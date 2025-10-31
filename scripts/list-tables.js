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
const dotenv = __importStar(require("dotenv"));
const path = __importStar(require("path"));
dotenv.config({ path: path.resolve(process.cwd(), '.development.env') });
async function listTables() {
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
        console.error('   Also set: MYSQL_HOST (or DB_HOST), MYSQL_PORT (or DB_PORT),');
        console.error('            MYSQL_USERNAME (or DB_USERNAME), MYSQL_PASSWORD (or DB_PASSWORD)');
        process.exit(1);
    }
    try {
        const connection = await mysql.createConnection(mysqlConfig);
        const [rows] = await connection.query('SHOW TABLES');
        const tables = rows.map((row) => Object.values(row)[0]);
        console.log(`\n📊 Tables in MySQL database "${mysqlConfig.database}":\n`);
        if (tables.length === 0) {
            console.log('  No tables found.');
        }
        else {
            tables.forEach((table, index) => {
                console.log(`  ${index + 1}. ${table}`);
            });
            console.log(`\n💡 To generate PostgreSQL-compatible resources for a table, run:`);
            console.log(`   npm run generate:resource -- ${tables[0]}`);
            console.log(`\n   Note: Resources will be generated for PostgreSQL, even though`);
            console.log(`   the source structure is read from MySQL.`);
        }
        await connection.end();
    }
    catch (error) {
        console.error('❌ Error:', error?.message || 'Unknown error');
        if (error?.code === 'ECONNREFUSED') {
            console.error('   Could not connect to database. Please check your connection settings.');
        }
        process.exit(1);
    }
}
listTables().catch((error) => {
    console.error('Unhandled error:', error);
    process.exit(1);
});
//# sourceMappingURL=list-tables.js.map