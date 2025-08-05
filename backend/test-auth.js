import bcrypt from 'bcrypt';
import pool from './config/db.js';

async function testAuth() {
  try {
    console.log('Testing authentication system...');
    
    // Test 1: Create a test user
    const testEmail = 'test@example.com';
    const testPassword = 'test123';
    const testName = 'Test User';
    
    // Check if test user exists
    const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [testEmail]);
    if (existing.length > 0) {
      console.log('✅ Test user already exists');
    } else {
      // Create test user
      const hashedPassword = await bcrypt.hash(testPassword, 10);
      await pool.query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [testName, testEmail, hashedPassword, 'user']
      );
      console.log('✅ Test user created successfully');
    }
    
    // Test 2: Verify password hashing works
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [testEmail]);
    const user = users[0];
    const passwordMatch = await bcrypt.compare(testPassword, user.password);
    
    if (passwordMatch) {
      console.log('✅ Password hashing and verification works');
    } else {
      console.log('❌ Password verification failed');
    }
    
    // Test 3: Check admin user
    const [adminUsers] = await pool.query('SELECT * FROM users WHERE role = ?', ['admin']);
    console.log(`✅ Found ${adminUsers.length} admin user(s)`);
    
    // Test 4: Check total users
    const [allUsers] = await pool.query('SELECT COUNT(*) as count FROM users');
    console.log(`✅ Total users in database: ${allUsers[0].count}`);
    
    console.log('🎉 Authentication system test completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Authentication test failed:', error.message);
    process.exit(1);
  }
}

testAuth(); 