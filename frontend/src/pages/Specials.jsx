import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLocation } from 'react-router-dom';
import idliImg from '../assets/idli.webp';
import chickenBurritoImg from '../assets/chicken_burrito_wrap.jpg';
import thakaliKhanaImg from '../assets/thakali_khana_set.jpg';
import chickenMatkaImg from '../assets/chicken_matka_biriyani.jpg';

export default function Specials() {
  const { user } = useAuth();
  const { addItem } = useCart();
  const isAdmin = user && user.role === 'admin';
  const location = useLocation();
  const [specials, setSpecials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const fetchSpecials = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await fetch('/api/specials');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSpecials(data);
      } catch (err) {
        console.error('Error fetching specials:', err);
        setError('Failed to load specials: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSpecials();
  }, []);

  // Open add modal if navigated with openAdd state
  useEffect(() => {
    if (isAdmin && location.state && location.state.openAdd) {
      setShowAddModal(true);
      window.history.replaceState({}, document.title);
    }
  }, [isAdmin, location.state]);

  // Pre-load local images for specials
  const localImages = {
    '/src/assets/idli.webp': idliImg,
    '/src/assets/chicken_burrito_wrap.jpg': chickenBurritoImg,
    '/src/assets/thakali_khana_set.jpg': thakaliKhanaImg,
    '/src/assets/chicken_matka_biriyani.jpg': chickenMatkaImg,
  };

  // Add form state (UI only for now)
  const [addForm, setAddForm] = useState({
    item_name: '',
    description: '',
    price: '',
  });
  const [editingItem, setEditingItem] = useState(null);
  const [addImageFile, setAddImageFile] = useState(null);
  
  const handleAddFormChange = e => {
    setAddForm({ ...addForm, [e.target.name]: e.target.value });
  };
  
  const handleAddImageChange = e => {
    setAddImageFile(e.target.files[0]);
  };
  
  const handleAddSubmit = async e => {
    e.preventDefault();
    
    try {
      const formData = new FormData();
      Object.entries(addForm).forEach(([key, value]) => formData.append(key, value));
      if (addImageFile) formData.append('image', addImageFile);
      
      const url = editingItem 
        ? `/api/admin/specials/${editingItem.id}`
        : '/api/admin/specials';
      
      const method = editingItem ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Failed to save special');
      }
      
      setShowAddModal(false);
      setAddForm({ item_name: '', description: '', price: '' });
      setEditingItem(null);
      setAddImageFile(null);
      
      // Update local state immediately
      const result = await response.json();
      if (editingItem) {
        // Update existing item
        setSpecials(prevSpecials =>
          prevSpecials.map(item =>
            item.id === editingItem.id
              ? { ...item, ...addForm, image_url: result.image_url || item.image_url }
              : item
          )
        );
      } else {
        // Add new item
        setSpecials(prevSpecials => [...prevSpecials, result]);
      }
      
      alert(editingItem ? 'Special updated successfully!' : 'Special added successfully!');
    } catch (err) {
      console.error('Error saving special:', err);
      alert('Failed to save special: ' + err.message);
    }
  };
  
  const handleEdit = (item) => {
    setAddForm({
      item_name: item.item_name,
      description: item.description,
      price: item.price
    });
    setEditingItem(item);
    setShowAddModal(true);
  };
  
  const handleDelete = async (item) => {
    if (!window.confirm(`Are you sure you want to delete "${item.item_name}"?`)) return;
    
    try {
      const response = await fetch(`/api/admin/specials/${item.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete special');
      }
      
      // Refresh specials
      window.location.reload();
      alert('Special deleted successfully!');
    } catch (err) {
      console.error('Error deleting special:', err);
      alert('Failed to delete special: ' + err.message);
    }
  };

  const handleAddToCart = (special) => {
    addItem({
      id: `special-${special.id}`, // Use a prefix to distinguish from menu items
      name: special.item_name,
      price: special.price,
      description: special.description,
      image: special.image_url,
      isSpecial: true
    });
    console.log('Added special to cart:', special.item_name);
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
      {/* Add Modal */}
      {showAddModal && isAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800" onClick={() => {
              setShowAddModal(false);
              setEditingItem(null);
              setAddForm({ item_name: '', description: '', price: '' });
            }}>&times;</button>
            <h3 className="text-xl font-bold mb-4">{editingItem ? 'Edit Special' : 'Add New Special'}</h3>
            <form onSubmit={handleAddSubmit} className="space-y-3" encType="multipart/form-data">
              <input name="item_name" value={addForm.item_name} onChange={handleAddFormChange} placeholder="Name" className="w-full border rounded px-3 py-2" required />
              <textarea name="description" value={addForm.description} onChange={handleAddFormChange} placeholder="Description" className="w-full border rounded px-3 py-2" required />
              <input name="price" type="number" step="0.01" value={addForm.price} onChange={handleAddFormChange} placeholder="Price" className="w-full border rounded px-3 py-2" required />
              <input type="file" accept="image/*" onChange={handleAddImageChange} className="w-full border rounded px-3 py-2" />
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                {editingItem ? 'Update Special' : 'Add Special'}
              </button>
            </form>
          </div>
        </div>
      )}
      <h2 className="text-3xl font-bold text-amber-800 mb-6 text-center">Today's Specials</h2>
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-700 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading specials...</p>
        </div>
      )}
      {error && (
        <div className="text-center py-12">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-red-600 text-lg mb-4">Failed to load specials</p>
          <p className="text-gray-500 mb-6">
            {error.includes('fetch') || error.includes('Failed to fetch') 
              ? 'Unable to connect to the server. Please make sure the backend is running.'
              : error
            }
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-amber-700 text-white px-6 py-2 rounded-lg hover:bg-amber-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {specials.map(special => (
          <div key={special.id} className="bg-white rounded shadow p-6 flex flex-col">
            {special.image_url && (
              <img
                src={localImages[special.image_url] || special.image_url}
                alt={special.item_name}
                className="w-full h-48 object-cover rounded mb-4"
              />
            )}
            <span className="font-bold text-lg">{special.item_name}</span>
            <span className="text-gray-600 mb-2">{special.description}</span>
            <div className="flex justify-between items-center mt-auto">
              <span className="text-amber-700 font-semibold">NPR {special.price}</span>
              <button 
                onClick={() => handleAddToCart(special)}
                className="bg-amber-700 text-white px-4 py-2 rounded hover:bg-amber-800 transition-colors font-medium"
              >
                Add to Cart
              </button>
            </div>
            {isAdmin && (
              <div className="flex gap-2 mt-3">
                <button onClick={() => handleEdit(special)} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs">Edit</button>
                <button onClick={() => handleDelete(special)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs">Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 