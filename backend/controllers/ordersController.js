import pool from '../config/db.js';

export async function placeOrder(req, res) {
  const { user_id, order_items, total_price } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO orders (user_id, order_items, total_price, status) VALUES (?, ?, ?, ?)',
      [user_id, JSON.stringify(order_items), total_price, 'pending']
    );
    res.status(201).json({
      message: 'Order placed successfully',
      orderId: result.insertId
    });
  } catch (err) {
    console.error('Error placing order:', err);
    res.status(500).json({ message: err.message });
  }
}

export async function processPayment(req, res) {
  const { orderId } = req.params;
  const { paymentMethod, paymentDetails } = req.body;
  
  try {
    // Update order status to preparing after successful payment
    await pool.query(
      'UPDATE orders SET status = ? WHERE id = ?',
      ['preparing', orderId]
    );
    
    // In a real application, you would:
    // 1. Process the actual payment with payment gateway
    // 2. Store payment details in a separate payments table
    // 3. Handle payment failures and rollbacks
    
    res.status(200).json({
      message: 'Payment processed successfully',
      orderId: orderId,
      status: 'preparing'
    });
  } catch (err) {
    console.error('Error processing payment:', err);
    res.status(500).json({ message: 'Payment processing failed' });
  }
}

export async function getOrdersByUser(req, res) {
  const userId = req.user.id;
  
  try {
    const [orders] = await pool.query(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY order_date DESC',
      [userId]
    );
    
    res.status(200).json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ message: err.message });
  }
}

export async function getOrderById(req, res) {
  const { orderId } = req.params;
  const userId = req.user.id;
  
  try {
    const [orders] = await pool.query(
      'SELECT * FROM orders WHERE id = ? AND user_id = ?',
      [orderId, userId]
    );
    
    if (orders.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.status(200).json(orders[0]);
  } catch (err) {
    console.error('Error fetching order:', err);
    res.status(500).json({ message: err.message });
  }
}