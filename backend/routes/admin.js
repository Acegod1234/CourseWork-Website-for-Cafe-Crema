import express from 'express';
import pool from '../config/db.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Multer setup for staff
const staffStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), 'backend', 'uploads', 'staff'));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + '-' + file.fieldname + ext);
  }
});
const staffUpload = multer({ storage: staffStorage });

// Multer setup for specials
const specialsStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), 'backend', 'uploads', 'specials'));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + '-' + file.fieldname + ext);
  }
});
const specialsUpload = multer({ storage: specialsStorage });

// Multer setup for menu items
const menuStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), 'backend', 'uploads', 'menu'));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + '-' + file.fieldname + ext);
  }
});
const menuUpload = multer({ storage: menuStorage });

// Add menu item
router.post('/menu', authenticateToken, requireAdmin, menuUpload.single('image'), async (req, res) => {
  try {
    const { name, category, description, price, type, is_bestseller, is_spicy, has_gluten, is_hot } = req.body;
    let image_url = req.body.image_url;
    if (req.file) {
      image_url = `/uploads/menu/${req.file.filename}`;
    }
    await pool.query(
      'INSERT INTO menu_items (name, category, description, price, type, image_url, is_bestseller, is_spicy, has_gluten, is_hot) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, category, description, price, type, image_url, is_bestseller === 'true', is_spicy === 'true', has_gluten === 'true', is_hot === 'true']
    );
    res.json({ message: 'Menu item added successfully' });
  } catch (err) {
    console.error('Error adding menu item:', err);
    res.status(500).json({ message: 'Failed to add menu item', error: err.message });
  }
});

// Update menu item
router.put('/menu/:id', authenticateToken, requireAdmin, menuUpload.single('image'), async (req, res) => {
  try {
    const { name, category, description, price, type, is_bestseller, is_spicy, has_gluten, is_hot } = req.body;
    let image_url = req.body.image_url;
    
    // Get existing image_url
    const [existing] = await pool.query('SELECT image_url FROM menu_items WHERE id=?', [req.params.id]);
    if (req.file) {
      image_url = `/uploads/menu/${req.file.filename}`;
    } else if (existing.length > 0) {
      image_url = existing[0].image_url;
    }
    
    await pool.query(
      'UPDATE menu_items SET name=?, category=?, description=?, price=?, type=?, image_url=?, is_bestseller=?, is_spicy=?, has_gluten=?, is_hot=? WHERE id=?',
      [name, category, description, price, type, image_url, is_bestseller === 'true', is_spicy === 'true', has_gluten === 'true', is_hot === 'true', req.params.id]
    );
    res.json({ message: 'Menu item updated successfully' });
  } catch (err) {
    console.error('Error updating menu item:', err);
    res.status(500).json({ message: 'Failed to update menu item', error: err.message });
  }
});

// Delete menu item
router.delete('/menu/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    console.log('Delete menu request:', {
      itemId: req.params.id,
      userId: req.user.id,
      userRole: req.user.role,
      method: req.method,
      url: req.url
    });
    
    // Check if item exists first
    const [existing] = await pool.query('SELECT * FROM menu_items WHERE id=?', [req.params.id]);
    if (existing.length === 0) {
      console.log('Item not found for deletion:', req.params.id);
      return res.status(404).json({ message: 'Menu item not found' });
    }
    
    console.log('Found item to delete:', existing[0].name);
    
    // Delete the item
    const [result] = await pool.query('DELETE FROM menu_items WHERE id=?', [req.params.id]);
    
    console.log('Delete result:', {
      affectedRows: result.affectedRows,
      itemId: req.params.id
    });
    
    if (result.affectedRows === 0) {
      console.log('No rows affected during deletion');
      return res.status(404).json({ message: 'Menu item not found or already deleted' });
    }
    
    res.json({ message: 'Menu item deleted successfully' });
  } catch (err) {
    console.error('Error deleting menu item:', err);
    res.status(500).json({ message: 'Failed to delete menu item', error: err.message });
  }
});

// Add staff
router.post('/staff', authenticateToken, requireAdmin, staffUpload.single('photo'), async (req, res) => {
  try {
    const { name, position } = req.body;
    let photo_url = req.body.photo_url;
    if (req.file) {
      photo_url = `/uploads/staff/${req.file.filename}`;
    }
    await pool.query(
      'INSERT INTO staff (name, position, photo_url) VALUES (?, ?, ?)',
      [name, position, photo_url]
    );
    res.json({ message: 'Staff added successfully' });
  } catch (err) {
    console.error('Error adding staff:', err);
    res.status(500).json({ message: 'Failed to add staff', error: err.message });
  }
});

// Update staff
router.put('/staff/:id', authenticateToken, requireAdmin, staffUpload.single('photo'), async (req, res) => {
  try {
    const { name, position } = req.body;
    let photo_url = req.body.photo_url;
    
    // Get existing photo_url
    const [existing] = await pool.query('SELECT photo_url FROM staff WHERE id=?', [req.params.id]);
    if (req.file) {
      photo_url = `/uploads/staff/${req.file.filename}`;
    } else if (existing.length > 0) {
      photo_url = existing[0].photo_url;
    }
    
    await pool.query(
      'UPDATE staff SET name=?, position=?, photo_url=? WHERE id=?',
      [name, position, photo_url, req.params.id]
    );
    res.json({ message: 'Staff updated successfully' });
  } catch (err) {
    console.error('Error updating staff:', err);
    res.status(500).json({ message: 'Failed to update staff', error: err.message });
  }
});

// Delete staff
router.delete('/staff/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    await pool.query('DELETE FROM staff WHERE id=?', [req.params.id]);
    res.json({ message: 'Staff deleted successfully' });
  } catch (err) {
    console.error('Error deleting staff:', err);
    res.status(500).json({ message: 'Failed to delete staff', error: err.message });
  }
});

// Add special
router.post('/specials', authenticateToken, requireAdmin, specialsUpload.single('image'), async (req, res) => {
  try {
    const { item_name, description, price } = req.body;
    let image_url = req.body.image_url;
    if (req.file) {
      image_url = `/uploads/specials/${req.file.filename}`;
    }
    await pool.query(
      'INSERT INTO specials (item_name, description, price, image_url) VALUES (?, ?, ?, ?)',
      [item_name, description, price, image_url]
    );
    res.json({ message: 'Special added successfully' });
  } catch (err) {
    console.error('Error adding special:', err);
    res.status(500).json({ message: 'Failed to add special', error: err.message });
  }
});

// Update special
router.put('/specials/:id', authenticateToken, requireAdmin, specialsUpload.single('image'), async (req, res) => {
  try {
    const { item_name, description, price } = req.body;
    let image_url = req.body.image_url;
    
    // Get existing image_url
    const [existing] = await pool.query('SELECT image_url FROM specials WHERE id=?', [req.params.id]);
    if (req.file) {
      image_url = `/uploads/specials/${req.file.filename}`;
    } else if (existing.length > 0) {
      image_url = existing[0].image_url;
    }
    
    await pool.query(
      'UPDATE specials SET item_name=?, description=?, price=?, image_url=? WHERE id=?',
      [item_name, description, price, image_url, req.params.id]
    );
    res.json({ message: 'Special updated successfully' });
  } catch (err) {
    console.error('Error updating special:', err);
    res.status(500).json({ message: 'Failed to update special', error: err.message });
  }
});

// Delete special
router.delete('/specials/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    await pool.query('DELETE FROM specials WHERE id=?', [req.params.id]);
    res.json({ message: 'Special deleted successfully' });
  } catch (err) {
    console.error('Error deleting special:', err);
    res.status(500).json({ message: 'Failed to delete special', error: err.message });
  }
});

export default router; 