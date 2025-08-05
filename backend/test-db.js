import pool from './config/db.js';

async function testConnection() {
  try {
    console.log('Testing database connection...');
    const [rows] = await pool.query('SELECT 1 as test');
    console.log('Database connection successful!', rows);
    
    // Test menu items
    const [menuItems] = await pool.query('SELECT COUNT(*) as count FROM menu_items');
    console.log('Menu items count:', menuItems[0].count);
    
    // Test specials
    const [specials] = await pool.query('SELECT COUNT(*) as count FROM specials');
    console.log('Specials count:', specials[0].count);
    
    process.exit(0);
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
}

testConnection(); 