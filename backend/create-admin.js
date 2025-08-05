import bcrypt from 'bcrypt';
import pool from './config/db.js';

async function createAdmin() {
  try {
    console.log('Creating admin user...');
    
    const adminEmail = 'admin@cafecrema.com';
    const adminPassword = 'admin123';
    const adminName = 'Admin User';
    
    // Check if admin already exists
    const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [adminEmail]);
    if (existing.length > 0) {
      console.log('✅ Admin user already exists');
      console.log('Email: admin@cafecrema.com');
      console.log('Password: admin123');
      console.log('Role: admin');
      process.exit(0);
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    // Insert admin user
    await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [adminName, adminEmail, hashedPassword, 'admin']
    );
    
    console.log('✅ Admin user created successfully!');
    console.log('Email: admin@cafecrema.com');
    console.log('Password: admin123');
    console.log('Role: admin');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    process.exit(1);
  }
}

createAdmin(); 