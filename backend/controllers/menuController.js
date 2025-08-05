import pool from '../config/db.js';

// Cache for menu items (in-memory cache)
let menuCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Get all menu items with caching
export async function getMenu(req, res) {
  try {
    // Check cache first
    const now = Date.now();
    if (menuCache && cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION) {
      return res.json(menuCache);
    }

    // Optimized query with specific columns and ordering
    const [rows] = await pool.query(`
      SELECT 
        id, name, description, price, category, type, image_url,
        is_bestseller, is_spicy, has_gluten, is_hot
      FROM menu_items 
      ORDER BY category, name
    `);
    
    // Transform the data to match frontend expectations
    const transformedItems = rows.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      type: item.type,
      image: item.image_url,
      isBestseller: !!item.is_bestseller,
      isSpicy: !!item.is_spicy,
      hasGluten: !!item.has_gluten,
      isHot: !!item.is_hot
    }));
    
    // Update cache
    menuCache = transformedItems;
    cacheTimestamp = now;
    
    res.json(transformedItems);
  } catch (err) {
    console.error('Error fetching menu items:', err);
    res.status(500).json({ message: 'Failed to fetch menu items', error: err.message });
  }
}

// Get menu items by category with optimized query
export async function getMenuByCategory(req, res) {
  try {
    const { category } = req.params;
    
    const [rows] = await pool.query(`
      SELECT 
        id, name, description, price, category, type, image_url,
        is_bestseller, is_spicy, has_gluten, is_hot
      FROM menu_items 
      WHERE category = ?
      ORDER BY name
    `, [category]);
    
    const transformedItems = rows.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      type: item.type,
      image: item.image_url,
      isBestseller: !!item.is_bestseller,
      isSpicy: !!item.is_spicy,
      hasGluten: !!item.has_gluten,
      isHot: !!item.is_hot
    }));
    
    res.json(transformedItems);
  } catch (err) {
    console.error('Error fetching menu items by category:', err);
    res.status(500).json({ message: 'Failed to fetch menu items', error: err.message });
  }
}

// Get menu items by type with optimized query
export async function getMenuByType(req, res) {
  try {
    const { type } = req.params;
    
    const [rows] = await pool.query(`
      SELECT 
        id, name, description, price, category, type, image_url,
        is_bestseller, is_spicy, has_gluten, is_hot
      FROM menu_items 
      WHERE type = ?
      ORDER BY category, name
    `, [type]);
    
    const transformedItems = rows.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      type: item.type,
      image: item.image_url,
      isBestseller: !!item.is_bestseller,
      isSpicy: !!item.is_spicy,
      hasGluten: !!item.has_gluten,
      isHot: !!item.is_hot
    }));
    
    res.json(transformedItems);
  } catch (err) {
    console.error('Error fetching menu items by type:', err);
    res.status(500).json({ message: 'Failed to fetch menu items', error: err.message });
  }
}

// Get single menu item by ID with optimized query
export async function getMenuItem(req, res) {
  try {
    const { id } = req.params;
    
    const [rows] = await pool.query(`
      SELECT 
        id, name, description, price, category, type, image_url,
        is_bestseller, is_spicy, has_gluten, is_hot
      FROM menu_items 
      WHERE id = ?
    `, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    
    const item = rows[0];
    const transformedItem = {
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      type: item.type,
      image: item.image_url,
      isBestseller: !!item.is_bestseller,
      isSpicy: !!item.is_spicy,
      hasGluten: !!item.has_gluten,
      isHot: !!item.is_hot
    };
    
    res.json(transformedItem);
  } catch (err) {
    console.error('Error fetching menu item:', err);
    res.status(500).json({ message: 'Failed to fetch menu item', error: err.message });
  }
}

// Create new menu item (Admin only) with cache invalidation
export async function createMenuItem(req, res) {
  try {
    const {
      name,
      description,
      price,
      category,
      type,
      is_bestseller = false,
      is_spicy = false,
      has_gluten = false,
      is_hot = false
    } = req.body;
    let image_url = req.body.image_url;
    if (req.file) {
      // Save relative path for frontend use
      image_url = `/uploads/menu/${req.file.filename}`;
    }
    // Validate required fields
    if (!name || !price || !category || !type) {
      return res.status(400).json({ message: 'Name, price, category, and type are required' });
    }
    const [result] = await pool.query(`
      INSERT INTO menu_items (name, description, price, category, type, image_url, is_bestseller, is_spicy, has_gluten, is_hot)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [name, description, price, category, type, image_url, is_bestseller, is_spicy, has_gluten, is_hot]);
    // Invalidate cache
    menuCache = null;
    cacheTimestamp = null;
    const newItemId = result.insertId;
    const [newItem] = await pool.query('SELECT * FROM menu_items WHERE id = ?', [newItemId]);
    res.status(201).json({
      message: 'Menu item created successfully',
      item: newItem[0]
    });
  } catch (err) {
    console.error('Error creating menu item:', err);
    res.status(500).json({ message: 'Failed to create menu item', error: err.message });
  }
}

// Update menu item (Admin only) with cache invalidation
export async function updateMenuItem(req, res) {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      price,
      category,
      type,
      is_bestseller,
      is_spicy,
      has_gluten,
      is_hot
    } = req.body;
    // Get existing image_url
    let image_url = req.body.image_url;
    const [existing] = await pool.query('SELECT image_url FROM menu_items WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    if (req.file) {
      image_url = `/uploads/menu/${req.file.filename}`;
    } else {
      image_url = existing[0].image_url;
    }
    const [result] = await pool.query(`
      UPDATE menu_items 
      SET name = ?, description = ?, price = ?, category = ?, type = ?, 
          image_url = ?, is_bestseller = ?, is_spicy = ?, has_gluten = ?, is_hot = ?
      WHERE id = ?
    `, [name, description, price, category, type, image_url, is_bestseller, is_spicy, has_gluten, is_hot, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    // Invalidate cache
    menuCache = null;
    cacheTimestamp = null;
    res.json({ message: 'Menu item updated successfully' });
  } catch (err) {
    console.error('Error updating menu item:', err);
    res.status(500).json({ message: 'Failed to update menu item', error: err.message });
  }
}

// Delete menu item (Admin only) with cache invalidation
export async function deleteMenuItem(req, res) {
  try {
    const { id } = req.params;
    
    const [result] = await pool.query('DELETE FROM menu_items WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    
    // Invalidate cache
    menuCache = null;
    cacheTimestamp = null;
    
    res.json({ message: 'Menu item deleted successfully' });
  } catch (err) {
    console.error('Error deleting menu item:', err);
    res.status(500).json({ message: 'Failed to delete menu item', error: err.message });
  }
}

// Get menu categories with caching
let categoriesCache = null;
let categoriesCacheTimestamp = null;

export async function getMenuCategories(req, res) {
  try {
    // Check cache first
    const now = Date.now();
    if (categoriesCache && categoriesCacheTimestamp && (now - categoriesCacheTimestamp) < CACHE_DURATION) {
      return res.json(categoriesCache);
    }
    
    const [rows] = await pool.query('SELECT DISTINCT category FROM menu_items ORDER BY category');
    const categories = rows.map(row => row.category);
    
    // Update cache
    categoriesCache = categories;
    categoriesCacheTimestamp = now;
    
    res.json(categories);
  } catch (err) {
    console.error('Error fetching menu categories:', err);
    res.status(500).json({ message: 'Failed to fetch menu categories', error: err.message });
  }
}

// Get bestsellers with caching
let bestsellersCache = null;
let bestsellersCacheTimestamp = null;

export async function getBestsellers(req, res) {
  try {
    // Check cache first
    const now = Date.now();
    if (bestsellersCache && bestsellersCacheTimestamp && (now - bestsellersCacheTimestamp) < CACHE_DURATION) {
      return res.json(bestsellersCache);
    }
    
    const [rows] = await pool.query(`
      SELECT 
        id, name, description, price, category, type, image_url,
        is_bestseller, is_spicy, has_gluten, is_hot
      FROM menu_items 
      WHERE is_bestseller = TRUE
      ORDER BY category, name
    `);
    
    const transformedItems = rows.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      type: item.type,
      image: item.image_url,
      isBestseller: !!item.is_bestseller,
      isSpicy: !!item.is_spicy,
      hasGluten: !!item.has_gluten,
      isHot: !!item.is_hot
    }));
    
    // Update cache
    bestsellersCache = transformedItems;
    bestsellersCacheTimestamp = now;
    
    res.json(transformedItems);
  } catch (err) {
    console.error('Error fetching bestsellers:', err);
    res.status(500).json({ message: 'Failed to fetch bestsellers', error: err.message });
  }
}

// Clear all caches (for admin use)
export async function clearCache(req, res) {
  try {
    menuCache = null;
    cacheTimestamp = null;
    categoriesCache = null;
    categoriesCacheTimestamp = null;
    bestsellersCache = null;
    bestsellersCacheTimestamp = null;
    
    res.json({ message: 'Cache cleared successfully' });
  } catch (err) {
    console.error('Error clearing cache:', err);
    res.status(500).json({ message: 'Failed to clear cache', error: err.message });
  }
} 