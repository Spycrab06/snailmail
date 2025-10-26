#!/usr/bin/env node

import { executeQuery, testConnection, closePool } from './db-config.js';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

/**
 * Database Seeder
 *
 * Usage:
 *   npm run seed                    - Run default seed file
 *   npm run seed -- seeds/users.sql - Run specific seed file
 */

const SEEDS_DIR = resolve(process.cwd(), 'seeds');
const DEFAULT_SEED = resolve(SEEDS_DIR, 'seed.sql');

async function runSeed(filePath) {
  console.log('\n🌱 Database Seeder\n');

  await testConnection();

  if (!existsSync(filePath)) {
    console.error(`❌ Seed file not found: ${filePath}`);
    console.log('\n💡 Create a seed file at:');
    console.log(`   ${filePath}\n`);
    process.exit(1);
  }

  console.log(`📄 Reading seed file: ${filePath}\n`);

  const sql = readFileSync(filePath, 'utf8');

  // Split by semicolons and execute each statement
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  console.log(`📊 Found ${statements.length} SQL statement(s)\n`);

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    try {
      console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`);
      const result = await executeQuery(statement);

      if (result.affectedRows !== undefined) {
        console.log(`   ✅ Affected ${result.affectedRows} row(s)`);
      } else {
        console.log(`   ✅ Success`);
      }

      successCount++;
    } catch (error) {
      errorCount++;
      console.error(`   ❌ Error: ${error.message}`);
    }
  }

  console.log('\n' + '═'.repeat(60));
  console.log(`✅ Successfully executed: ${successCount}/${statements.length}`);
  if (errorCount > 0) {
    console.log(`❌ Errors: ${errorCount}`);
  }
  console.log('═'.repeat(60) + '\n');
}

async function main() {
  const args = process.argv.slice(2);
  const seedFile = args[0] ? resolve(process.cwd(), args[0]) : DEFAULT_SEED;

  try {
    await runSeed(seedFile);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    await closePool();
  }
}

main();
