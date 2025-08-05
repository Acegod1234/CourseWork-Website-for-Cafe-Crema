import bcrypt from 'bcrypt';
import pool from './config/db.js';

async function createTestUser() {
  try {
    const email = 'testuser@cafe.com';
    const password = 'test123';
    const name = 'Test User';
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Check if user already exists
    const [existingUsers] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (existingUsers.length > 0) {
      console.log('Test user already exists');
      console.log('Email:', email);
      console.log('Password:', password);
      return;
    }
    
    // Create the user
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, 'user']
    );
    
    console.log('Test user created successfully!');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('User ID:', result.insertId);
    
  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    process.exit(0);
  }
}

createTestUser();