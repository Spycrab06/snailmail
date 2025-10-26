#!/usr/bin/env node

import readline from 'readline';
import { executeQuery, testConnection, closePool } from './db-config.js';

/**
 * Interactive SQL CLI
 *
 * Usage:
 *   npm run interactive
 *
 * Then type SQL queries and press Enter to execute.
 * Type 'exit' or 'quit' to exit.
 */

let queryBuffer = '';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'mysql> '
});

async function executeCurrentQuery() {
  const sql = queryBuffer.trim();

  if (!sql) {
    return;
  }

  try {
    const startTime = Date.now();
    const results = await executeQuery(sql);
    const duration = Date.now() - startTime;

    console.log();

    // Handle different result types
    if (Array.isArray(results)) {
      if (results.length === 0) {
        console.log('Empty set');
      } else {
        console.table(results);
        console.log(`${results.length} row(s) in set (${duration / 1000} sec)`);
      }
    } else if (results.affectedRows !== undefined) {
      console.log(`Query OK, ${results.affectedRows} row(s) affected (${duration / 1000} sec)`);
      if (results.insertId) {
        console.log(`Insert ID: ${results.insertId}`);
      }
      if (results.changedRows !== undefined) {
        console.log(`Changed: ${results.changedRows}`);
      }
    } else {
      console.log('Query OK');
    }
  } catch (error) {
    console.error(`\nERROR: ${error.message}`);
    if (error.errno) {
      console.error(`Error Code: ${error.errno}`);
    }
  }

  console.log();
  queryBuffer = '';
}

async function startCLI() {
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║          SnailMail Interactive SQL CLI                   ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');

  // Test connection
  const connected = await testConnection();
  if (!connected) {
    console.error('Failed to connect to database. Please check your .env configuration.');
    process.exit(1);
  }

  console.log('\n💡 Tips:');
  console.log('   - End queries with semicolon (;) to execute');
  console.log('   - Type "show tables;" to see all tables');
  console.log('   - Type "describe <table>;" to see table structure');
  console.log('   - Type "exit" or "quit" to close\n');

  rl.prompt();

  rl.on('line', async (line) => {
    const input = line.trim();

    // Check for exit commands
    if (input.toLowerCase() === 'exit' || input.toLowerCase() === 'quit') {
      console.log('\n👋 Goodbye!\n');
      await closePool();
      rl.close();
      process.exit(0);
    }

    // Check for clear command
    if (input.toLowerCase() === 'clear' || input.toLowerCase() === 'cls') {
      console.clear();
      rl.prompt();
      return;
    }

    // Check for help command
    if (input.toLowerCase() === 'help') {
      console.log('\n📚 Available Commands:');
      console.log('   exit, quit          - Exit the CLI');
      console.log('   clear, cls          - Clear the screen');
      console.log('   help                - Show this help');
      console.log('   show tables;        - List all tables');
      console.log('   show databases;     - List all databases');
      console.log('   describe <table>;   - Show table structure');
      console.log('   use <database>;     - Switch database\n');
      rl.prompt();
      return;
    }

    // Add to query buffer
    if (input) {
      queryBuffer += (queryBuffer ? ' ' : '') + input;
    }

    // Check if query is complete (ends with semicolon)
    if (queryBuffer.endsWith(';')) {
      // Remove the semicolon for execution
      queryBuffer = queryBuffer.slice(0, -1).trim();
      await executeCurrentQuery();
      rl.prompt();
    } else {
      // Multi-line query, show continuation prompt
      rl.setPrompt('    -> ');
      rl.prompt();
    }
  });

  rl.on('close', async () => {
    await closePool();
    console.log('\n👋 Session closed\n');
    process.exit(0);
  });
}

// Handle errors
process.on('uncaughtException', async (error) => {
  console.error('\n❌ Unexpected error:', error.message);
  await closePool();
  process.exit(1);
});

process.on('SIGINT', async () => {
  console.log('\n\n👋 Interrupted. Closing connections...\n');
  await closePool();
  process.exit(0);
});

// Start the CLI
startCLI();
