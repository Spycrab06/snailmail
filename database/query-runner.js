#!/usr/bin/env node

import { executeQuery, testConnection, closePool } from './db-config.js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

/**
 * SQL Query Runner
 *
 * Usage:
 *   npm run query -- "SELECT * FROM users"
 *   npm run query -- --file queries/get-users.sql
 *   npm run query -- --file migrations/001-create-tables.sql
 */

async function runQuery() {
  try {
    // Test connection first
    await testConnection();

    // Get query from command line arguments
    const args = process.argv.slice(2);

    if (args.length === 0) {
      console.log('\n📝 SQL Query Runner\n');
      console.log('Usage:');
      console.log('  npm run query -- "SELECT * FROM users"');
      console.log('  npm run query -- --file queries/example.sql');
      console.log('  npm run query -- --file migrations/001-create-tables.sql\n');
      process.exit(0);
    }

    let sql;
    let querySource;

    // Check if reading from file
    if (args[0] === '--file' || args[0] === '-f') {
      if (!args[1]) {
        console.error('❌ Error: Please provide a file path');
        console.log('Example: npm run query -- --file queries/example.sql');
        process.exit(1);
      }

      const filePath = resolve(process.cwd(), args[1]);
      querySource = filePath;

      try {
        sql = readFileSync(filePath, 'utf8');
        console.log(`\n📄 Reading query from: ${args[1]}\n`);
      } catch (error) {
        console.error(`❌ Error reading file: ${error.message}`);
        process.exit(1);
      }
    } else {
      // Query provided directly as argument
      sql = args.join(' ');
      querySource = 'command line';
      console.log(`\n💻 Executing query from command line\n`);
    }

    // Display the query
    console.log('📋 Query:');
    console.log('─'.repeat(50));
    console.log(sql.trim());
    console.log('─'.repeat(50));
    console.log();

    // Execute the query
    const startTime = Date.now();
    const results = await executeQuery(sql);
    const duration = Date.now() - startTime;

    // Display results
    console.log('✅ Query executed successfully!');
    console.log(`⏱️  Duration: ${duration}ms\n`);

    // Handle different result types
    if (Array.isArray(results)) {
      if (results.length === 0) {
        console.log('📭 No results returned');
      } else {
        console.log(`📊 Results: ${results.length} row(s)\n`);
        console.table(results);
      }
    } else if (results.affectedRows !== undefined) {
      console.log('📝 Query Results:');
      console.log(`   Affected rows: ${results.affectedRows}`);
      if (results.insertId) {
        console.log(`   Insert ID: ${results.insertId}`);
      }
      if (results.changedRows !== undefined) {
        console.log(`   Changed rows: ${results.changedRows}`);
      }
    } else {
      console.log('✅ Query completed');
      console.log(results);
    }

  } catch (error) {
    console.error('\n❌ Error executing query:');
    console.error(error.message);
    if (error.sql) {
      console.error('\nSQL:', error.sql);
    }
    process.exit(1);
  } finally {
    await closePool();
  }
}

// Run the query
runQuery();
