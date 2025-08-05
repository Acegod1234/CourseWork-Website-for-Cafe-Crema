import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import pool from './config/db.js';

async function testToken() {
  try {
    console.log('Testing JWT token validation...');
    
    // Test admin user login
    const adminEmail = 'admin@cafecrema.com';
    const adminPassword = 'admin123';
    
    // Get admin user
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [adminEmail]);
    if (users.length === 0) {
      console.log('❌ Admin user not found');
      return;
    }
    
    const user = users[0];
    console.log('✅ Admin user found:', user.name, user.role);
    
    // Verify password
    const match = await bcrypt.compare(adminPassword, user.password);
    if (!match) {
      console.log('❌ Password verification failed');
      return;
    }
    console.log('✅ Password verification successful');
    
    // Create JWT token
    const jwtSecret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
    const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, jwtSecret, { expiresIn: '1d' });
    console.log('✅ JWT token created:', token.substring(0, 50) + '...');
    
    // Verify token
    const decoded = jwt.verify(token, jwtSecret);
    console.log('✅ JWT token verified:', decoded);
    
    // Test middleware logic
    const authHeader = `Bearer ${token}`;
    const tokenFromHeader = authHeader && authHeader.split(' ')[1];
    console.log('✅ Token extracted from header:', tokenFromHeader ? 'Success' : 'Failed');
    
    if (tokenFromHeader) {
      jwt.verify(tokenFromHeader, jwtSecret, (err, user) => {
        if (err) {
          console.log('❌ Token verification failed:', err.message);
        } else {
          console.log('✅ Token verification successful:', user);
          console.log('✅ User role:', user.role);
          console.log('✅ Is admin:', user.role === 'admin');
        }
      });
    }
    
    console.log('🎉 Token validation test completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Token test failed:', error.message);
    process.exit(1);
  }
}

testToken(); 