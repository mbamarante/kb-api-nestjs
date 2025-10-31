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
const bcrypt = __importStar(require("bcryptjs"));
const dotenv = __importStar(require("dotenv"));
const path = __importStar(require("path"));
const pg_1 = require("pg");
dotenv.config({ path: path.resolve(process.cwd(), '.development.env') });
async function resetPasswords() {
    const defaultPassword = 'password';
    const saltRounds = 10;
    const pool = new pg_1.Pool({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        user: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_DATABASE || 'kb',
    });
    try {
        console.log('🔄 Generating password hash...');
        const hashedPassword = await bcrypt.hash(defaultPassword, saltRounds);
        console.log('✅ Hash generated:', hashedPassword.substring(0, 30) + '...');
        console.log('\n🔄 Resetting passwords in database...');
        const result = await pool.query(`UPDATE accounts.users SET password = $1`, [
            hashedPassword,
        ]);
        console.log(`\n✅ Successfully reset ${result.rowCount} user password(s) to "${defaultPassword}"`);
        console.log('\n📝 Users can now login with:');
        console.log(`   Email: <user_email>`);
        console.log(`   Password: ${defaultPassword}`);
    }
    catch (error) {
        console.error('❌ Error resetting passwords:', error.message);
        if (error.code === 'ECONNREFUSED') {
            console.error('   Could not connect to database. Please check your connection settings.');
        }
        process.exit(1);
    }
    finally {
        await pool.end();
    }
}
resetPasswords();
//# sourceMappingURL=reset-passwords.js.map