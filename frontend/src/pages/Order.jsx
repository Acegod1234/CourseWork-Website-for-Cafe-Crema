import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Order() {
  const [menu, setMenu] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, token } = useAuth();
  const { items: cartItems, updateQuantity, removeItem, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/menu')
      .then(res => res.json())
      .then(data => setMenu(data))
      .catch(() => setError('Failed to load menu.'));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    if (cartItems.length === 0) {
      setError('Please add items to your cart first.');
      setLoading(false);
      return;
    }
    
    const orderItems = cartItems.map(item => ({
      id: item.isSpecial ? null : item.id, // Special items don't have menu IDs
      name: item.name,
      qty: item.qty,
      price: item.price,
      isSpecial: item.isSpecial || false
    }));
    
    const total_price = getTotalPrice();
    
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ user_id: user.id, order_items: orderItems, total_price })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Order failed');
      
      // Navigate to payment page with order data
      navigate('/payment', {
        state: {
          orderData: {
            orderId: data.orderId || Date.now(),
            items: cartItems,
            totalAmount: total_price
          }
        }
      });
      
      // Clear cart after successful order creation
      clearCart();
      
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        <h2 className="text-3xl font-bold text-amber-800 mb-6 text-center">Your Cart</h2>
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🛒</div>
          <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
          <p className="text-gray-400 mb-6">Add some delicious items from our menu or specials!</p>
          <div className="space-x-4">
            <button 
              onClick={() => navigate('/menu')}
              className="bg-amber-700 text-white px-6 py-2 rounded-lg hover:bg-amber-800 transition-colors"
            >
              Browse Menu
            </button>
            <button 
              onClick={() => navigate('/specials')}
              className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors"
            >
              View Specials
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
      <h2 className="text-3xl font-bold text-amber-800 mb-6 text-center">Your Cart</h2>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="space-y-4">
            {cartItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 border-b border-gray-200 last:border-b-0">
                <div className="flex items-center space-x-4">
                  {item.image && (
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}
                  <div>
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                    <p className="text-amber-700 font-medium">${item.price}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.qty - 1)}
                      className="w-8 h-8 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-semibold">{item.qty}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.qty + 1)}
                      className="w-8 h-8 bg-amber-700 text-white rounded-full hover:bg-amber-800 transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold">Total:</span>
              <span className="text-2xl font-bold text-amber-700">${getTotalPrice().toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <button
            onClick={clearCart}
            className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Clear Cart
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-amber-700 text-white px-8 py-3 rounded-lg hover:bg-amber-800 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            {loading ? 'Processing...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
} 