import pool from './config/db.js';

async function testAPI() {
  try {
    console.log('Testing database connection and API endpoints...');
    
    // Test database connection
    const [testResult] = await pool.query('SELECT 1 as test');
    console.log('✅ Database connection successful');
    
    // Test menu items
    const [menuItems] = await pool.query('SELECT COUNT(*) as count FROM menu_items');
    console.log(`✅ Menu items count: ${menuItems[0].count}`);
    
    // Test specials
    const [specials] = await pool.query('SELECT COUNT(*) as count FROM specials');
    console.log(`✅ Specials count: ${specials[0].count}`);
    
    // Test users table
    const [users] = await pool.query('SELECT COUNT(*) as count FROM users');
    console.log(`✅ Users count: ${users[0].count}`);
    
    // Test sample menu items
    const [sampleMenu] = await pool.query('SELECT name, price FROM menu_items LIMIT 3');
    console.log('✅ Sample menu items:', sampleMenu);
    
    // Test sample specials
    const [sampleSpecials] = await pool.query('SELECT item_name, price FROM specials LIMIT 2');
    console.log('✅ Sample specials:', sampleSpecials);
    
    console.log('🎉 All tests passed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

testAPI(); 