#!/usr/bin/env node

import { testConnection, executeQuery, closePool } from './db-config.js';

/**
 * Test Database Connection
 *
 * Usage:
 *   npm run test-connection
 */

async function runTests() {
  console.log('\n🔍 Testing Database Connection\n');
  console.log('═'.repeat(60));

  try {
    // Test 1: Basic connection
    console.log('\n1️⃣  Testing basic connection...');
    const connected = await testConnection();

    if (!connected) {
      console.error('❌ Connection test failed');
      process.exit(1);
    }

    // Test 2: Show databases
    console.log('\n2️⃣  Fetching database list...');
    const databases = await executeQuery('SHOW DATABASES');
    console.log(`   ✅ Found ${databases.length} database(s)`);

    // Test 3: Show current database
    console.log('\n3️⃣  Checking current database...');
    const currentDb = await executeQuery('SELECT DATABASE() as current_db');
    console.log(`   ✅ Current database: ${currentDb[0].current_db}`);

    // Test 4: Show tables
    console.log('\n4️⃣  Fetching tables in current database...');
    const tables = await executeQuery('SHOW TABLES');

    if (tables.length === 0) {
      console.log('   📭 No tables found (database is empty)');
    } else {
      console.log(`   ✅ Found ${tables.length} table(s):`);
      tables.forEach((table, index) => {
        const tableName = Object.values(table)[0];
        console.log(`      ${index + 1}. ${tableName}`);
      });
    }

    // Test 5: Show MySQL version
    console.log('\n5️⃣  Checking MySQL version...');
    const version = await executeQuery('SELECT VERSION() as version');
    console.log(`   ✅ MySQL version: ${version[0].version}`);

    // Test 6: Show server status
    console.log('\n6️⃣  Checking server status...');
    const status = await executeQuery('SHOW STATUS LIKE "Uptime"');
    const uptime = parseInt(status[0].Value);
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    console.log(`   ✅ Server uptime: ${hours}h ${minutes}m`);

    console.log('\n' + '═'.repeat(60));
    console.log('✅ All connection tests passed!');
    console.log('═'.repeat(60) + '\n');

    // Display connection info
    console.log('📋 Connection Details:');
    console.log(`   Host: ${process.env.DB_HOST}`);
    console.log(`   Port: ${process.env.DB_PORT}`);
    console.log(`   User: ${process.env.DB_USER}`);
    console.log(`   Database: ${process.env.DB_NAME}`);
    console.log();

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error('\n💡 Troubleshooting:');
    console.error('   1. Check that Railway database is running');
    console.error('   2. Verify .env file exists in /server directory');
    console.error('   3. Confirm DB credentials are correct');
    console.error('   4. Check network connectivity\n');
    process.exit(1);
  } finally {
    await closePool();
  }
}

runTests();
