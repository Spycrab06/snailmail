#!/usr/bin/env node

import { pool, testConnection, closePool } from './db-config.js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

/**
 * Import SQL Dump File
 *
 * This script can handle large SQL dump files with multiple statements
 * Usage: node --env-file ../server/.env import-dump.js <filename>
 */

async function importDump() {
  console.log('\n📥 SQL Dump Importer\n');

  try {
    // Get filename from command line
    const filename = process.argv[2] || 'custom-query.sql';
    const filePath = resolve(process.cwd(), filename);

    console.log(`📄 Reading: ${filename}\n`);

    let sql;
    try {
      sql = readFileSync(filePath, 'utf8');
    } catch (error) {
      console.error(`❌ Error reading file: ${error.message}`);
      console.log('\n💡 Usage: node --env-file ../server/.env import-dump.js <filename.sql>');
      console.log('   Example: node --env-file ../server/.env import-dump.js custom-query.sql\n');
      process.exit(1);
    }

    await testConnection();

    const connection = await pool.getConnection();

    try {
      console.log('🔄 Processing SQL statements...\n');

      // Remove MySQL dump comments and directives
      sql = sql.replace(/\/\*![0-9]{5}.*?\*\/;?/gs, ''); // Remove version-specific comments
      sql = sql.replace(/\/\*.*?\*\//gs, ''); // Remove multi-line comments
      sql = sql.replace(/^--.*$/gm, ''); // Remove single-line comments
      sql = sql.replace(/LOCK TABLES.*?UNLOCK TABLES;/gs, ''); // Remove LOCK TABLES

      // Split by semicolons but keep them
      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 10); // Filter out empty or very short statements

      console.log(`📊 Found ${statements.length} SQL statement(s) to execute\n`);

      let successCount = 0;
      let errorCount = 0;
      let skipCount = 0;

      for (let i = 0; i < statements.length; i++) {
        const stmt = statements[i];

        // Show progress for CREATE TABLE and INSERT
        if (stmt.toUpperCase().includes('CREATE TABLE')) {
          const match = stmt.match(/CREATE TABLE [`']?(\w+)[`']?/i);
          const tableName = match ? match[1] : 'unknown';
          process.stdout.write(`   ⏳ Creating table: ${tableName}...`);
        } else if (stmt.toUpperCase().includes('DROP TABLE')) {
          const match = stmt.match(/DROP TABLE.*?[`']?(\w+)[`']?/i);
          const tableName = match ? match[1] : 'unknown';
          process.stdout.write(`   ⏳ Dropping table: ${tableName}...`);
        } else if (stmt.toUpperCase().includes('INSERT INTO')) {
          const match = stmt.match(/INSERT INTO [`']?(\w+)[`']?/i);
          const tableName = match ? match[1] : 'unknown';
          process.stdout.write(`   ⏳ Inserting into: ${tableName}...`);
        } else {
          process.stdout.write(`   ⏳ Executing statement ${i + 1}/${statements.length}...`);
        }

        try {
          await connection.query(stmt);
          console.log(' ✅');
          successCount++;
        } catch (error) {
          // Some errors are acceptable (like "table already exists")
          if (error.message.includes('already exists') ||
              error.message.includes('Unknown table') ||
              error.message.includes('Duplicate')) {
            console.log(' ⚠️  (skipped)');
            skipCount++;
          } else {
            console.log(' ❌');
            console.error(`      Error: ${error.message.substring(0, 100)}`);
            errorCount++;
          }
        }
      }

      console.log('\n' + '═'.repeat(60));
      console.log('📊 Import Summary:');
      console.log(`   ✅ Successful: ${successCount}`);
      console.log(`   ⚠️  Skipped: ${skipCount}`);
      console.log(`   ❌ Errors: ${errorCount}`);
      console.log('═'.repeat(60) + '\n');

      if (errorCount === 0) {
        console.log('✅ Import completed successfully!\n');
      } else {
        console.log('⚠️  Import completed with some errors. Check the output above.\n');
      }

    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
    process.exit(1);
  } finally {
    await closePool();
  }
}

importDump();
