import mysql from 'mysql2/promise';

// Database configuration using environment variables
const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create connection pool
export const pool = mysql.createPool(dbConfig);

// Get single connection
export async function getConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connected to MySQL database');
    return connection;
  } catch (error) {
    console.error('❌ Error connecting to database:', error.message);
    throw error;
  }
}

// Test database connection
export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connection successful!');
    console.log(`📊 Connected to: ${process.env.DB_NAME} @ ${process.env.DB_HOST}:${process.env.DB_PORT}`);
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

// Execute a single query
export async function executeQuery(sql, params = []) {
  const connection = await pool.getConnection();
  try {
    const [results] = await connection.execute(sql, params);
    return results;
  } catch (error) {
    console.error('❌ Query error:', error.message);
    throw error;
  } finally {
    connection.release();
  }
}

// Execute multiple queries in a transaction
export async function executeTransaction(queries) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const results = [];
    for (const { sql, params } of queries) {
      const [result] = await connection.execute(sql, params);
      results.push(result);
    }

    await connection.commit();
    console.log('✅ Transaction committed successfully');
    return results;
  } catch (error) {
    await connection.rollback();
    console.error('❌ Transaction rolled back:', error.message);
    throw error;
  } finally {
    connection.release();
  }
}

// Close all connections
export async function closePool() {
  await pool.end();
  console.log('✅ Database connections closed');
}

export default pool;
