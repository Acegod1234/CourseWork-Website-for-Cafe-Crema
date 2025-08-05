import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLocation } from 'react-router-dom';
import margheritaPizza from '../assets/margherita_pizza.jpeg';
import vegBurger from '../assets/veg_burger.jpeg';
import vegSandwich from '../assets/veg_sandwich.webp';
import vegMomo from '../assets/veg_momo.jpg';
import vegRoll from '../assets/veg_roll.jpg';
import fries from '../assets/fries.jpeg';
import nacho from '../assets/nacho.jpg';
import napolitanPizza from '../assets/napolitan_pizza.jpg';
import chickenSandwich from '../assets/chicken_sandiwch.jpeg';
import chickenBurger from '../assets/chicken_burger.jpeg';
import chickenRoll from '../assets/chicken_roll.jpg';
import chickenMomo from '../assets/momo.jpg';
import americanPizza from '../assets/american_pizza.jpg';
import macchiato from '../assets/macchiato.webp';
import espresso from '../assets/espresso.webp';
import mocha from '../assets/mocha.png';
import cappuccino from '../assets/cappuccino.jpg';
import americano from '../assets/americano.jpeg';
import latte from '../assets/latte.jpg';

// Pre-load local images for faster access (only images that actually exist)
const localImages = {
  '/src/assets/margherita_pizza.jpeg': margheritaPizza,
  '/src/assets/veg_burger.jpeg': vegBurger,
  '/src/assets/veg_sandwich.webp': vegSandwich,
  '/src/assets/veg_momo.jpg': vegMomo,
  '/src/assets/veg_roll.jpg': vegRoll,
  '/src/assets/fries.jpeg': fries,
  '/src/assets/nacho.jpg': nacho,
  '/src/assets/napolitan_pizza.jpg': napolitanPizza,
  '/src/assets/chicken_sandiwch.jpeg': chickenSandwich,
  '/src/assets/chicken_burger.jpeg': chickenBurger,
  '/src/assets/chicken_roll.jpg': chickenRoll,
  '/src/assets/momo.jpg': chickenMomo,
  '/src/assets/american_pizza.jpg': americanPizza,
  '/src/assets/macchiato.webp': macchiato,
  '/src/assets/espresso.webp': espresso,
  '/src/assets/mocha.png': mocha,
  '/src/assets/cappuccino.jpg': cappuccino,
  '/src/assets/americano.jpeg': americano,
  '/src/assets/latte.jpg': latte,
};

// Memoized Menu Item Component for better performance
const MenuItem = ({ item, isAdmin, onEdit, onDelete }) => {
  const { addItem } = useCart();
  
  const handleAddToOrder = useCallback(() => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      description: item.description,
      image: item.image
    });
    // Show success message (you could add a toast notification here)
    console.log('Added to cart:', item.name);
  }, [addItem, item]);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Item Image */}
      <div className="relative h-48 sm:h-56 overflow-hidden">
        <img 
          src={item.image} 
          alt={item.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
          {item.isBestseller && (
            <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-md">
              ⭐ Bestseller
            </span>
          )}
          {item.isSpicy && (
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-md">
              🔥 Spicy
            </span>
          )}
          {item.hasGluten && (
            <span className="bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-md">
              🌾 Gluten
            </span>
          )}
          {item.isHot && (
            <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-md">
              🔥 Hot
            </span>
          )}
          {item.type === 'beverages' && !item.isHot && (
            <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-md">
              ❄️ Cold
            </span>
          )}
        </div>
      </div>
      
      {/* Item Details */}
      <div className="p-4 md:p-6">
        <h4 className="text-lg md:text-xl font-bold text-gray-800 mb-2 line-clamp-1">{item.name}</h4>
        <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2">{item.description}</p>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <span className="text-xl md:text-2xl font-bold text-amber-700">${item.price}</span>
          <button 
            onClick={handleAddToOrder}
            className="w-full sm:w-auto bg-amber-700 text-white px-4 py-2 rounded-lg hover:bg-amber-800 transition-colors duration-300 font-medium text-sm md:text-base"
          >
            Add to Cart
          </button>
        </div>
        {isAdmin && (
          <div className="flex gap-2 mt-3">
            <button onClick={() => onEdit(item)} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs">Edit</button>
            <button onClick={() => onDelete(item)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs">Delete</button>
          </div>
        )}
      </div>
    </div>
  );
};

// Memoized Filter Button Component
const FilterButton = ({ filter, currentFilter, onClick, children, className = '' }) => {
  const isActive = filter === currentFilter;
  
  return (
    <button
      onClick={onClick}
      className={`w-full sm:w-auto px-6 py-3 rounded-lg font-medium transition-all duration-300 ${className} ${
        isActive
          ? 'shadow-lg transform scale-105'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow-md'
      }`}
    >
      {children}
    </button>
  );
};

export default function Menu() {
  const { user } = useAuth();
  const isAdmin = user && user.role === 'admin';
  const location = useLocation();
  const [filter, setFilter] = useState('all');
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Open add modal if navigated with openAdd state
  useEffect(() => {
    if (isAdmin && location.state && location.state.openAdd) {
      setShowAddModal(true);
      // Remove openAdd from history so it doesn't reopen on back/refresh
      window.history.replaceState({}, document.title);
    }
  }, [isAdmin, location.state]);

  // Memoized fetch function
  const fetchMenuItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/menu', {
        headers: {
          'Cache-Control': 'max-age=300' // 5 minutes cache
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Map local images to the fetched data
      const itemsWithImages = data.map(item => ({
        ...item,
        image: localImages[item.image] || item.image
      }));
      
      setMenuItems(itemsWithImages);
    } catch (err) {
      console.error('Error fetching menu items:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMenuItems();
  }, [fetchMenuItems]);

  // Memoized filtered and grouped items
  const { grouped } = useMemo(() => {
    const filtered = filter === 'all' 
      ? menuItems 
      : menuItems.filter(item => item.type === filter);

    const grouped = filtered.reduce((acc, item) => {
      acc[item.category] = acc[item.category] || [];
      acc[item.category].push(item);
      return acc;
    }, {});

    return { grouped };
  }, [menuItems, filter]);

  // Memoized filter button handlers
  const handleFilterChange = useCallback((newFilter) => {
    setFilter(newFilter);
  }, []);

  // Add handlers for edit/delete (to be implemented)
  const handleEdit = (item) => {
    setAddForm({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      type: item.type,
      is_bestseller: item.isBestseller,
      is_spicy: item.isSpicy,
      has_gluten: item.hasGluten,
      is_hot: item.isHot
    });
    setEditingItem(item);
    setShowAddModal(true);
  };
  
  const handleDelete = async (item) => {
    if (!window.confirm(`Are you sure you want to delete "${item.name}"?`)) return;
    
    try {
      const response = await fetch(`/api/admin/menu/${item.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete item');
      }
      
      // Remove from local state immediately
      setMenuItems(prevItems => prevItems.filter(menuItem => menuItem.id !== item.id));
      alert('Item deleted successfully!');
    } catch (err) {
      console.error('Error deleting item:', err);
      alert('Failed to delete item: ' + err.message);
    }
  };

  // Add form state (UI only for now)
  const [addForm, setAddForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    type: 'veg',
    is_bestseller: false,
    is_spicy: false,
    has_gluten: false,
    is_hot: false
  });
  const [editingItem, setEditingItem] = useState(null);
  const [addImageFile, setAddImageFile] = useState(null);
  
  const handleAddFormChange = e => {
    const { name, value, type, checked } = e.target;
    setAddForm({ 
      ...addForm, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };
  
  const handleAddImageChange = e => {
    setAddImageFile(e.target.files[0]);
  };
  
  const handleAddSubmit = async e => {
    e.preventDefault();
    
    try {
      const formData = new FormData();
      Object.entries(addForm).forEach(([key, value]) => {
        formData.append(key, value);
      });
      if (addImageFile) formData.append('image', addImageFile);
      
      const url = editingItem 
        ? `/api/admin/menu/${editingItem.id}`
        : '/api/admin/menu';
      
      const method = editingItem ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Failed to save item');
      }
      
      setShowAddModal(false);
      setAddForm({ 
        name: '', 
        description: '', 
        price: '', 
        category: '', 
        type: 'veg',
        is_bestseller: false,
        is_spicy: false,
        has_gluten: false,
        is_hot: false
      });
      setEditingItem(null);
      setAddImageFile(null);
      
      // Update local state immediately
      if (editingItem) {
        // Update existing item
        setMenuItems(prevItems =>
          prevItems.map(item =>
            item.id === editingItem.id
              ? { ...item, ...addForm, image: addImageFile ? URL.createObjectURL(addImageFile) : item.image }
              : item
          )
        );
      } else {
        // Add new item (we'll need the response to get the ID)
        const result = await response.json();
        setMenuItems(prevItems => [...prevItems, { ...result, image: localImages[result.image] || result.image }]);
      }
      
      alert(editingItem ? 'Item updated successfully!' : 'Item added successfully!');
    } catch (err) {
      console.error('Error saving item:', err);
      alert('Failed to save item: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-700 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading menu items...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-red-600 text-lg mb-4">Failed to load menu items</p>
          <p className="text-gray-500 mb-6">
            {error.includes('fetch') || error.includes('Failed to fetch') 
              ? 'Unable to connect to the server. Please make sure the backend is running.'
              : error
            }
          </p>
          <button 
            onClick={fetchMenuItems}
            className="bg-amber-700 text-white px-6 py-2 rounded-lg hover:bg-amber-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      {/* Add Modal */}
      {showAddModal && isAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800" onClick={() => {
              setShowAddModal(false);
              setEditingItem(null);
              setAddForm({ name: '', description: '', price: '', category: '', type: 'veg', is_bestseller: false, is_spicy: false, has_gluten: false, is_hot: false });
            }}>&times;</button>
            <h3 className="text-xl font-bold mb-4">{editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}</h3>
            <form onSubmit={handleAddSubmit} className="space-y-3" encType="multipart/form-data">
              <input name="name" value={addForm.name} onChange={handleAddFormChange} placeholder="Name" className="w-full border rounded px-3 py-2" required />
              <textarea name="description" value={addForm.description} onChange={handleAddFormChange} placeholder="Description" className="w-full border rounded px-3 py-2" required />
              <input name="price" type="number" step="0.01" value={addForm.price} onChange={handleAddFormChange} placeholder="Price" className="w-full border rounded px-3 py-2" required />
              <input name="category" value={addForm.category} onChange={handleAddFormChange} placeholder="Category" className="w-full border rounded px-3 py-2" required />
              <select name="type" value={addForm.type} onChange={handleAddFormChange} className="w-full border rounded px-3 py-2">
                <option value="veg">Vegetarian</option>
                <option value="non-veg">Non-Vegetarian</option>
                <option value="beverages">Beverages</option>
              </select>
              
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" name="is_bestseller" checked={addForm.is_bestseller} onChange={handleAddFormChange} className="mr-2" />
                  Bestseller
                </label>
                <label className="flex items-center">
                  <input type="checkbox" name="is_spicy" checked={addForm.is_spicy} onChange={handleAddFormChange} className="mr-2" />
                  Spicy
                </label>
                <label className="flex items-center">
                  <input type="checkbox" name="has_gluten" checked={addForm.has_gluten} onChange={handleAddFormChange} className="mr-2" />
                  Contains Gluten
                </label>
                <label className="flex items-center">
                  <input type="checkbox" name="is_hot" checked={addForm.is_hot} onChange={handleAddFormChange} className="mr-2" />
                  Hot (for beverages)
                </label>
              </div>
              
              <input type="file" accept="image/*" onChange={handleAddImageChange} className="w-full border rounded px-3 py-2" />
              <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
                {editingItem ? 'Update Item' : 'Add Item'}
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Header with filter */}
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-amber-800 text-center mb-6">
          Our Menu
        </h2>
        {/* Filter Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
          <FilterButton 
            filter="all" 
            currentFilter={filter} 
            onClick={() => handleFilterChange('all')}
            className="bg-amber-700 text-white"
          >
            All Items
          </FilterButton>
          <FilterButton 
            filter="veg" 
            currentFilter={filter} 
            onClick={() => handleFilterChange('veg')}
            className="bg-green-600 text-white"
          >
            Vegetarian
          </FilterButton>
          <FilterButton 
            filter="non-veg" 
            currentFilter={filter} 
            onClick={() => handleFilterChange('non-veg')}
            className="bg-red-600 text-white"
          >
            Non-Vegetarian
          </FilterButton>
          <FilterButton 
            filter="beverages" 
            currentFilter={filter} 
            onClick={() => handleFilterChange('beverages')}
            className="bg-teal-500 text-white hover:bg-teal-600"
          >
            Beverages
          </FilterButton>
        </div>
      </div>

      {/* Menu Items */}
      {Object.keys(grouped).map(category => (
        <div key={category} className="mb-12">
          <h3 className="text-xl md:text-2xl font-bold text-amber-700 mb-6 border-b-2 border-amber-200 pb-2">
            {category}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {grouped[category].map(item => (
              <MenuItem key={item.id} item={item} isAdmin={isAdmin} onEdit={handleEdit} onDelete={handleDelete} />
            ))}
          </div>
        </div>
      ))}

      {/* Empty State */}
      {Object.keys(grouped).length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🍽️</div>
          <p className="text-gray-500 text-lg">No items found for the selected filter.</p>
          <button 
            onClick={() => handleFilterChange('all')}
            className="mt-4 bg-amber-700 text-white px-6 py-2 rounded-lg hover:bg-amber-800 transition-colors"
          >
            View All Items
          </button>
        </div>
      )}
    </div>
  );
} 