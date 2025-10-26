import mysql from 'mysql2/promise'

// Use connection URL if available (for Vercel), otherwise use individual env vars
const pool = process.env.DATABASE_URL
  ? mysql.createPool(process.env.DATABASE_URL)
  : mysql.createPool({
      host: process.env.MYSQLHOST || process.env.DB_HOST,
      port: process.env.MYSQLPORT || process.env.DB_PORT,
      user: process.env.MYSQLUSER || process.env.DB_USER,
      password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD,
      database: process.env.MYSQLDATABASE || process.env.DB_NAME,
    });

console.log('Database configured using:', process.env.DATABASE_URL ? 'CONNECTION_URL' : 'INDIVIDUAL_ENV_VARS');

// testing to make sure connection works between node.js server and MySQL database
async function testConnection() {
  try {
    const connection = await pool.getConnection()
    console.log('Connected to MySQL database')
    connection.release()
  } catch (err) {
    console.error('Error connecting to database:', err)
  }
}

testConnection();

export default pool;
