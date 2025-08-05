import pool from '../config/db.js';

export async function getStaff(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM staff');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
} 