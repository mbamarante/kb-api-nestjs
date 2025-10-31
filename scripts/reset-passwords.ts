import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { Pool } from 'pg';

// Carregar variáveis de ambiente
dotenv.config({ path: path.resolve(process.cwd(), '.development.env') });

async function resetPasswords() {
  const defaultPassword = 'password';
  const saltRounds = 10; // Padrão do bcrypt

  // Conectar ao PostgreSQL
  const pool = new Pool({
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
    const result = await pool.query(
      `UPDATE user_management.users SET password = $1`,
      [hashedPassword],
    );

    console.log(
      `\n✅ Successfully reset ${result.rowCount} user password(s) to "${defaultPassword}"`,
    );
    console.log('\n📝 Users can now login with:');
    console.log(`   Email: <user_email>`);
    console.log(`   Password: ${defaultPassword}`);
  } catch (error: any) {
    console.error('❌ Error resetting passwords:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error(
        '   Could not connect to database. Please check your connection settings.',
      );
    }
    process.exit(1);
  } finally {
    await pool.end();
  }
}

resetPasswords();
