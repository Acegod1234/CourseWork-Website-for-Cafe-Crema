import pool from '../config/db.js';

export async function getSpecials(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM specials');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
} 