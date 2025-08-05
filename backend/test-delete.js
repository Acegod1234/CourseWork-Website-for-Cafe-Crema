import pool from './config/db.js';

async function testDelete() {
  try {
    console.log('Testing database delete operations...');
    
    // Check current menu items
    const [menuItems] = await pool.query('SELECT id, name FROM menu_items ORDER BY id');
    console.log('Current menu items:', menuItems);
    
    // Check if Chicken Momo exists
    const [chickenMomo] = await pool.query('SELECT id, name FROM menu_items WHERE name LIKE "%Chicken Momo%"');
    console.log('Chicken Momo items:', chickenMomo);
    
    // Test delete operation
    if (chickenMomo.length > 0) {
      const itemId = chickenMomo[0].id;
      console.log(`Testing delete for item ID: ${itemId}`);
      
      const [result] = await pool.query('DELETE FROM menu_items WHERE id=?', [itemId]);
      console.log('Delete result:', {
        affectedRows: result.affectedRows,
        itemId: itemId
      });
      
      // Check if item was actually deleted
      const [checkItem] = await pool.query('SELECT id, name FROM menu_items WHERE id=?', [itemId]);
      console.log('Item after deletion:', checkItem);
      
      if (checkItem.length === 0) {
        console.log('✅ Item successfully deleted from database');
      } else {
        console.log('❌ Item still exists in database');
      }
    } else {
      console.log('No Chicken Momo items found to test deletion');
    }
    
    // Show final menu items
    const [finalItems] = await pool.query('SELECT id, name FROM menu_items ORDER BY id');
    console.log('Final menu items:', finalItems);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Delete test failed:', error.message);
    process.exit(1);
  }
}

testDelete(); 