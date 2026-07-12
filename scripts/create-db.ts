import 'dotenv/config';
import { Pool } from 'pg';

async function createDatabase() {
  const url = new URL(process.env.DATABASE_URL!);
  const dbName = url.pathname.replace('/', '');

  console.log(`📦 Setting up database: ${dbName}`);

  // Connect to the default 'postgres' database to create our target database
  const adminPool = new Pool({
    host: url.hostname,
    port: Number(url.port) || 5432,
    user: url.username,
    password: url.password,
    database: 'postgres', // connect to default db first
  });

  try {
    const client = await adminPool.connect();
    
    // Check if database exists
    const result = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName]
    );

    if (result.rowCount === 0) {
      console.log(`🔨 Database '${dbName}' not found. Creating it...`);
      // Can't use parameterized queries for CREATE DATABASE
      await client.query(`CREATE DATABASE "${dbName}"`);
      console.log(`✅ Database '${dbName}' created successfully!`);
    } else {
      console.log(`✅ Database '${dbName}' already exists.`);
    }

    client.release();
  } finally {
    await adminPool.end();
  }
}

createDatabase()
  .then(() => {
    console.log('\n✅ Database setup complete. Now run:');
    console.log('   npx prisma db push');
    console.log('   npx prisma db seed\n');
  })
  .catch((err) => {
    console.error('❌ Failed to create database:', err.message);
    console.error('\nMake sure PostgreSQL is running and your DATABASE_URL credentials are correct.');
    console.error(`DATABASE_URL: ${process.env.DATABASE_URL}`);
    process.exit(1);
  });
