#!/usr/bin/env node

import { executeQuery, testConnection, closePool } from './db-config.js';

/**
 * Database Reset Script
 * Drops all existing tables and migrations
 *
 * Usage:
 *   node --env-file ../server/.env reset-database.js
 */

async function resetDatabase() {
  console.log('\n⚠️  DATABASE RESET SCRIPT\n');
  console.log('This will DROP ALL TABLES and CLEAR ALL DATA!\n');

  try {
    await testConnection();

    console.log('\n🗑️  Dropping all tables...\n');

    // Disable foreign key checks to drop tables in any order
    await executeQuery('SET FOREIGN_KEY_CHECKS = 0');

    // Get all tables
    const tables = await executeQuery('SHOW TABLES');
    const tableNames = tables.map(row => Object.values(row)[0]);

    if (tableNames.length === 0) {
      console.log('📭 No tables found. Database is already empty.\n');
    } else {
      console.log(`Found ${tableNames.length} table(s) to drop:\n`);

      for (const tableName of tableNames) {
        console.log(`   Dropping: ${tableName}`);
        await executeQuery(`DROP TABLE IF EXISTS \`${tableName}\``);
      }

      console.log('\n✅ All tables dropped successfully!\n');
    }

    // Re-enable foreign key checks
    await executeQuery('SET FOREIGN_KEY_CHECKS = 1');

    console.log('═'.repeat(60));
    console.log('✅ Database has been reset!');
    console.log('═'.repeat(60));
    console.log('\n💡 Next step: Run migrations to create new schema');
    console.log('   cd database && npm run migrate\n');

  } catch (error) {
    console.error('\n❌ Error resetting database:', error.message);
    process.exit(1);
  } finally {
    await closePool();
  }
}

resetDatabase();
