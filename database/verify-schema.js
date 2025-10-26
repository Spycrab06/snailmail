#!/usr/bin/env node

import { executeQuery, testConnection, closePool } from './db-config.js';

async function verify() {
  console.log('\n🔍 Verifying Database Schema\n');

  try {
    await testConnection();

    // Show all tables
    console.log('📋 Tables:');
    const tables = await executeQuery('SHOW TABLES');
    tables.forEach(t => console.log(`   ✓ ${Object.values(t)[0]}`));

    // Count records in each table
    console.log('\n📊 Record counts:');
    for (const table of tables) {
      const tableName = Object.values(table)[0];
      const [result] = await executeQuery(`SELECT COUNT(*) as count FROM \`${tableName}\``);
      console.log(`   ${tableName}: ${result.count} rows`);
    }

    // Show sample customers
    console.log('\n👥 Sample Customers:');
    const customers = await executeQuery('SELECT first_name, last_name, account_type FROM customer LIMIT 5');
    customers.forEach(c => console.log(`   - ${c.first_name} ${c.last_name} (${c.account_type})`));

    // Show sample employees
    console.log('\n👔 Sample Employees:');
    const employees = await executeQuery('SELECT first_name, last_name, account_type FROM employee LIMIT 5');
    employees.forEach(e => console.log(`   - ${e.first_name} ${e.last_name} (${e.account_type})`));

    console.log('\n✅ Database schema verified successfully!\n');

  } catch (error) {
    console.error('\n❌ Verification failed:', error.message);
    process.exit(1);
  } finally {
    await closePool();
  }
}

verify();
