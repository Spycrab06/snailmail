import pool from '../config/database.js';
import { getJSONRequestBody } from '../utils/getJSONRequestBody.js';
import { badClientRequest, badServerRequest } from '../utils/badRequest.js';

// Controller to execute arbitrary SQL queries
// WARNING: This should be protected/restricted in production!
export const executeQueryController = async (req, res) => {
  let query;

  // Parse request body
  try {
    const body = await getJSONRequestBody(req);
    query = body.query;

    if (!query || typeof query !== 'string') {
      return badClientRequest(res, 'Query is required and must be a string');
    }

    // Basic validation - prevent multiple statements
    if (query.includes(';') && query.trim().split(';').filter(s => s.trim()).length > 1) {
      return badClientRequest(res, 'Multiple statements not allowed');
    }

  } catch (err) {
    return badClientRequest(res, err.message || 'Invalid JSON body');
  }

  let connection;
  try {
    connection = await pool.getConnection();

    const startTime = Date.now();
    const [results] = await connection.execute(query);
    const executionTime = Date.now() - startTime;

    console.log(`Query executed in ${executionTime}ms:`, query.substring(0, 100));

    // Respond with success
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      success: true,
      results: results,
      executionTime: executionTime,
      rowCount: Array.isArray(results) ? results.length : null
    }));

  } catch (error) {
    console.error('Query execution failed:', error.message);

    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      success: false,
      error: error.message || 'Query execution failed',
      sqlMessage: error.sqlMessage || null,
      errno: error.errno || null
    }));

  } finally {
    if (connection) connection.release();
  }
};
