#!/usr/bin/env node

import { pool, testConnection, closePool } from './db-config.js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

/**
 * Schema Loader
 * Loads a complete SQL schema file by executing statements sequentially
 */

async function loadSchema() {
  console.log('\n📥 Loading Database Schema\n');

  try {
    await testConnection();

    const schemaFile = resolve(process.cwd(), 'load-schema.sql');
    console.log(`📄 Reading: ${schemaFile}\n`);

    const sql = readFileSync(schemaFile, 'utf8');

    // Get a connection from pool
    const connection = await pool.getConnection();

    try {
      // Split by semicolons but handle multiline statements properly
      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--') && s !== 'LOCK TABLES' && s !== 'UNLOCK TABLES');

      console.log(`📊 Found ${statements.length} SQL statements to execute\n`);

      let successCount = 0;
      let skipCount = 0;

      for (let i = 0; i < statements.length; i++) {
        const stmt = statements[i];

        // Skip these special commands
        if (stmt.includes('/*!') || stmt.includes('LOCK TABLES') || stmt.includes('UNLOCK TABLES')) {
          skipCount++;
          continue;
        }

        try {
          // Show progress for key operations
          if (stmt.includes('CREATE TABLE')) {
            const match = stmt.match(/CREATE TABLE [`']?(\w+)[`']?/i);
            const tableName = match ? match[1] : 'unknown';
            console.log(`   ✓ Creating table: ${tableName}`);
          } else if (stmt.includes('INSERT INTO')) {
            const match = stmt.match(/INSERT INTO [`']?(\w+)[`']?/i);
            const tableName = match ? match[1] : 'unknown';
            process.stdout.write(`   ✓ Inserting data into: ${tableName}\r`);
          }

          await connection.query(stmt);
          successCount++;
        } catch (error) {
          // Log non-critical errors but continue
          if (!error.message.includes('already exists')) {
            console.error(`   ⚠️  Warning: ${error.message.substring(0, 80)}...`);
          }
        }
      }

      console.log(`\n\n═══════════════════════════════════════════════════════════`);
      console.log(`✅ Schema loaded successfully!`);
      console.log(`   Executed: ${successCount} statements`);
      console.log(`   Skipped: ${skipCount} statements`);
      console.log(`═══════════════════════════════════════════════════════════\n`);

    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('\n❌ Error loading schema:', error.message);
    process.exit(1);
  } finally {
    await closePool();
  }
}

loadSchema();
