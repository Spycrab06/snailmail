#!/usr/bin/env node

import { pool, testConnection, closePool } from './db-config.js';

async function loadSampleData() {
  console.log('\n📥 Loading Sample Data\n');

  try {
    await testConnection();

    const connection = await pool.getConnection();

    try {
      // Insert authentication first (required by foreign keys)
      console.log('🔐 Inserting authentication...');
      await connection.query(`
        INSERT INTO authentication (auth_id, email, password) VALUES
        (1, 'OscarTheGrouch@email.com', 'pass1234'),
        (5, 'jane.doe@example.com', 'password123'),
        (8, 'luffy@onepiece.com', 'onepieceisreal'),
        (9, 'montyPython@grail.com', 'tisbutascratch'),
        (11, 'shrek@swamp.com', 'password123'),
        (12, 'bossbaby@pixar.com', 'boss')
        ON DUPLICATE KEY UPDATE auth_id=auth_id
      `);
      console.log('   ✅ Authentication loaded');

      // Insert addresses
      console.log('📍 Inserting addresses...');
      await connection.query(`
        INSERT INTO address (address_id, street_name, city_name, state_name, zip_code, created_by, updated_by) VALUES
        (1, 'Sesame Street', 'New York City', 'NY', '12345', NULL, NULL),
        (3, '123 Main St', 'Houston', 'TX', '77004', 5, 5),
        (6, 'Laugh Tale', 'Grand Line', 'OP', '12345', 8, 8),
        (7, 'Epping Forest', 'Camelot', 'GL', '93472', 9, 9),
        (8, 'Shrek Swamp', 'Lordship of Duloc', 'FL', '94375', NULL, NULL),
        (9, 'Royal Oak', 'Toledo', 'OH', '55533', NULL, NULL)
        ON DUPLICATE KEY UPDATE address_id=address_id
      `);
      console.log('   ✅ Addresses loaded');

      // Insert customers
      console.log('👥 Inserting customers...');
      await connection.query(`
        INSERT INTO customer (customer_id, first_name, middle_name, last_name, address_id, phone_number, auth_id, account_type, birth_date) VALUES
        (1, 'Oscar', NULL, 'Bruno', 1, NULL, 1, 'individual', '1969-06-01'),
        (2, 'Jane', 'A', 'Doe', 3, '8325557890', 5, 'individual', NULL),
        (4, 'Luffy', 'D', 'Monkey', 6, NULL, 8, 'prime', NULL),
        (5, 'Monty', NULL, 'Python', 7, '1234412341', 9, 'business', NULL)
        ON DUPLICATE KEY UPDATE customer_id=customer_id
      `);
      console.log('   ✅ Customers loaded');

      // Insert employees
      console.log('👔 Inserting employees...');
      await connection.query(`
        INSERT INTO employee (employee_id, first_name, middle_name, last_name, account_type, address_id, phone_number, birth_date, salary, ethnicity, employee_ssn, auth_id) VALUES
        (1, 'Shrek', NULL, 'Ogre', 'clerk', 8, '3335551234', '1990-05-15', 50000.00, 'Ogre', '123-45-6789', 11),
        (2, 'Theodore', NULL, 'Templeton', 'manager', 9, NULL, NULL, 1000000.00, NULL, '134-43-3497', 12)
        ON DUPLICATE KEY UPDATE employee_id=employee_id
      `);
      console.log('   ✅ Employees loaded');

      console.log('\n✅ All sample data loaded successfully!\n');

    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('\n❌ Error loading data:', error.message);
    process.exit(1);
  } finally {
    await closePool();
  }
}

loadSampleData();
