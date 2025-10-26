#!/usr/bin/env node

import { executeQuery, executeTransaction, testConnection, closePool } from './db-config.js';
import { readdirSync, readFileSync, mkdirSync, writeFileSync } from 'fs';
import { resolve, join } from 'path';

/**
 * Database Migration Runner
 *
 * Usage:
 *   npm run migrate           - Run all pending migrations
 *   npm run migrate -- up     - Run all pending migrations
 *   npm run migrate -- create "create users table" - Create new migration file
 */

const MIGRATIONS_DIR = resolve(process.cwd(), 'migrations');

// Create migrations table if it doesn't exist
async function createMigrationsTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS migrations (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL UNIQUE,
      executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  await executeQuery(sql);
}

// Get list of executed migrations
async function getExecutedMigrations() {
  try {
    const results = await executeQuery('SELECT name FROM migrations ORDER BY id');
    return results.map(row => row.name);
  } catch (error) {
    return [];
  }
}

// Get list of migration files
function getMigrationFiles() {
  try {
    const files = readdirSync(MIGRATIONS_DIR);
    return files
      .filter(file => file.endsWith('.sql'))
      .sort();
  } catch (error) {
    console.log(`📁 No migrations directory found. Creating: ${MIGRATIONS_DIR}`);
    return [];
  }
}

// Run a single migration
async function runMigration(filename) {
  const filePath = join(MIGRATIONS_DIR, filename);
  const sql = readFileSync(filePath, 'utf8');

  console.log(`\n📝 Running migration: ${filename}`);
  console.log('─'.repeat(60));

  try {
    // Split by semicolons and execute each statement
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    for (const statement of statements) {
      await executeQuery(statement);
    }

    // Record migration as executed
    await executeQuery(
      'INSERT INTO migrations (name) VALUES (?)',
      [filename]
    );

    console.log(`✅ Migration completed: ${filename}`);
    return true;
  } catch (error) {
    console.error(`❌ Migration failed: ${filename}`);
    console.error(`Error: ${error.message}`);
    return false;
  }
}

// Run all pending migrations
async function runPendingMigrations() {
  console.log('\n🔄 Database Migration Runner\n');

  await testConnection();
  await createMigrationsTable();

  const executed = await getExecutedMigrations();
  const available = getMigrationFiles();

  if (available.length === 0) {
    console.log('📭 No migration files found in /database/migrations/');
    console.log('\n💡 Create a migration with:');
    console.log('   npm run migrate -- create "migration name"\n');
    return;
  }

  const pending = available.filter(file => !executed.includes(file));

  if (pending.length === 0) {
    console.log('✅ All migrations are up to date!');
    console.log(`📊 Total migrations: ${available.length}`);
    return;
  }

  console.log(`📋 Found ${pending.length} pending migration(s):\n`);
  pending.forEach((file, index) => {
    console.log(`   ${index + 1}. ${file}`);
  });

  console.log();

  let successCount = 0;
  for (const file of pending) {
    const success = await runMigration(file);
    if (success) {
      successCount++;
    } else {
      console.log('\n⚠️  Migration failed. Stopping here to prevent issues.\n');
      break;
    }
  }

  console.log('\n' + '═'.repeat(60));
  console.log(`✅ Successfully ran ${successCount}/${pending.length} migration(s)`);
  console.log('═'.repeat(60) + '\n');
}

// Create a new migration file
function createMigration(name) {
  const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace('T', '-').split('.')[0];
  const filename = `${timestamp}-${name.toLowerCase().replace(/\s+/g, '-')}.sql`;
  const filePath = join(MIGRATIONS_DIR, filename);

  const template = `-- Migration: ${name}
-- Created: ${new Date().toISOString()}

-- Write your SQL migration here
-- Example:

-- CREATE TABLE example (
--   id INT PRIMARY KEY AUTO_INCREMENT,
--   name VARCHAR(255) NOT NULL,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

`;

  mkdirSync(MIGRATIONS_DIR, { recursive: true });
  writeFileSync(filePath, template);

  console.log(`\n✅ Created migration file: ${filename}`);
  console.log(`📁 Location: ${filePath}\n`);
  console.log('💡 Edit this file to add your SQL, then run:');
  console.log('   npm run migrate\n');
}

// Show migration status
async function showStatus() {
  console.log('\n📊 Migration Status\n');

  await testConnection();
  await createMigrationsTable();

  const executed = await getExecutedMigrations();
  const available = getMigrationFiles();
  const pending = available.filter(file => !executed.includes(file));

  console.log(`Total migrations: ${available.length}`);
  console.log(`Executed: ${executed.length}`);
  console.log(`Pending: ${pending.length}\n`);

  if (executed.length > 0) {
    console.log('✅ Executed migrations:');
    executed.forEach((name, index) => {
      console.log(`   ${index + 1}. ${name}`);
    });
    console.log();
  }

  if (pending.length > 0) {
    console.log('⏳ Pending migrations:');
    pending.forEach((name, index) => {
      console.log(`   ${index + 1}. ${name}`);
    });
    console.log();
  }
}

// Main function
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'up';

  try {
    if (command === 'create') {
      const name = args.slice(1).join(' ');
      if (!name) {
        console.error('❌ Error: Please provide a migration name');
        console.log('Example: npm run migrate -- create "create users table"\n');
        process.exit(1);
      }
      createMigration(name);
    } else if (command === 'status') {
      await showStatus();
    } else if (command === 'up') {
      await runPendingMigrations();
    } else {
      console.log('\n📚 Migration Commands:\n');
      console.log('  npm run migrate              - Run pending migrations');
      console.log('  npm run migrate -- status    - Show migration status');
      console.log('  npm run migrate -- create "name" - Create new migration\n');
    }
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    await closePool();
  }
}

main();
