import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const { user, token } = useAuth();
  const isAdmin = user && user.role === 'admin';

  // Debug logging
  console.log('AdminDashboard Debug:', {
    user: user,
    token: token ? 'Token exists' : 'No token',
    isAdmin: isAdmin,
    userRole: user?.role
  });

  // Data state for all entities
  const [menuItems, setMenuItems] = useState([]);
  const [menuLoading, setMenuLoading] = useState(true);
  const [menuError, setMenuError] = useState('');
  const [specials, setSpecials] = useState([]);
  const [specialsLoading, setSpecialsLoading] = useState(true);
  const [specialsError, setSpecialsError] = useState('');
  const [staff, setStaff] = useState([]);
  const [staffLoading, setStaffLoading] = useState(true);
  const [staffError, setStaffError] = useState('');

  // UI state
  const [section, setSection] = useState(null); // 'add', 'edit', 'delete'
  const [entity, setEntity] = useState(null); // 'menu', 'specials', 'staff'

  // Add/Edit form state for each entity
  const [addMenuForm, setAddMenuForm] = useState({ 
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
  const [addMenuImage, setAddMenuImage] = useState(null);
  const [editMenuItem, setEditMenuItem] = useState(null);
  const [editMenuForm, setEditMenuForm] = useState({ 
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
  const [editMenuImage, setEditMenuImage] = useState(null);

  const [addSpecialForm, setAddSpecialForm] = useState({ item_name: '', description: '', price: '' });
  const [addSpecialImage, setAddSpecialImage] = useState(null);
  const [editSpecial, setEditSpecial] = useState(null);
  const [editSpecialForm, setEditSpecialForm] = useState({ item_name: '', description: '', price: '' });
  const [editSpecialImage, setEditSpecialImage] = useState(null);

  const [addStaffForm, setAddStaffForm] = useState({ name: '', position: '' });
  const [addStaffImage, setAddStaffImage] = useState(null);
  const [editStaff, setEditStaff] = useState(null);
  const [editStaffForm, setEditStaffForm] = useState({ name: '', position: '' });
  const [editStaffImage, setEditStaffImage] = useState(null);

  // Fetch data for all entities
  useEffect(() => {
    if (isAdmin) {
      setMenuLoading(true);
      fetch('/api/menu')
        .then(res => res.json())
        .then(data => { setMenuItems(data); setMenuLoading(false); })
        .catch(() => { setMenuError('Failed to load menu items.'); setMenuLoading(false); });
      setSpecialsLoading(true);
      fetch('/api/specials')
        .then(res => res.json())
        .then(data => { setSpecials(data); setSpecialsLoading(false); })
        .catch(() => { setSpecialsError('Failed to load specials.'); setSpecialsLoading(false); });
      setStaffLoading(true);
      fetch('/api/staff')
        .then(res => res.json())
        .then(data => { setStaff(data); setStaffLoading(false); })
        .catch(() => { setStaffError('Failed to load staff.'); setStaffLoading(false); });
    }
  }, [isAdmin]);

  // Handlers for Menu
  const handleAddMenuFormChange = e => {
    const { name, value, type, checked } = e.target;
    setAddMenuForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleAddMenuImageChange = e => setAddMenuImage(e.target.files[0]);
  
  const handleAddMenuSubmit = async e => {
    e.preventDefault();
    console.log('Adding menu item:', addMenuForm);
    
    const formData = new FormData();
    Object.entries(addMenuForm).forEach(([key, value]) => {
      if (typeof value === 'boolean') {
        formData.append(key, value.toString());
      } else {
        formData.append(key, value);
      }
    });
    if (addMenuImage) formData.append('image', addMenuImage);
    
    try {
      const res = await fetch('/api/admin/menu', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      
      console.log('Add menu response status:', res.status);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Add menu error:', errorText);
        throw new Error(`Failed to add menu item: ${res.status} ${res.statusText}`);
      }
      
      const result = await res.json();
      console.log('Add menu success:', result);
      
      setAddMenuForm({ 
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
      setAddMenuImage(null);
      
      // Add new item to local state immediately
      setMenuItems(prevItems => [...prevItems, result]);
      alert('Menu item added successfully!');
    } catch (err) {
      console.error('Add menu error:', err);
      alert(err.message);
    }
  };
  
  const openEditMenu = item => { 
    console.log('Opening edit for item:', item);
    setEditMenuItem(item); 
    setEditMenuForm({ 
      name: item.name, 
      description: item.description, 
      price: item.price, 
      category: item.category, 
      type: item.type,
      is_bestseller: item.is_bestseller || false,
      is_spicy: item.is_spicy || false,
      has_gluten: item.has_gluten || false,
      is_hot: item.is_hot || false
    }); 
    setEditMenuImage(null); 
  };
  
  const handleEditMenuFormChange = e => {
    const { name, value, type, checked } = e.target;
    setEditMenuForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleEditMenuImageChange = e => setEditMenuImage(e.target.files[0]);
  
  const handleEditMenuSubmit = async e => {
    e.preventDefault();
    if (!editMenuItem) return;
    
    console.log('Editing menu item:', editMenuForm);
    
    const formData = new FormData();
    Object.entries(editMenuForm).forEach(([key, value]) => {
      if (typeof value === 'boolean') {
        formData.append(key, value.toString());
      } else {
        formData.append(key, value);
      }
    });
    if (editMenuImage) formData.append('image', editMenuImage);
    
    try {
      const res = await fetch(`/api/admin/menu/${editMenuItem.id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      
      console.log('Edit menu response status:', res.status);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Edit menu error:', errorText);
        throw new Error(`Failed to update menu item: ${res.status} ${res.statusText}`);
      }
      
      const result = await res.json();
      console.log('Edit menu success:', result);
      
      setEditMenuItem(null);
      setEditMenuForm({ 
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
      setEditMenuImage(null);
      
      // Update local state immediately instead of reloading
      setMenuItems(prevItems =>
        prevItems.map(item =>
          item.id === editMenuItem.id
            ? { ...item, ...editMenuForm, image_url: result.image_url || item.image_url }
            : item
        )
      );
      alert('Menu item updated successfully!');
    } catch (err) {
      console.error('Edit menu error:', err);
      alert(err.message);
    }
  };
  
  const handleEditMenuCancel = () => setEditMenuItem(null);
  
  const handleDeleteMenu = async item => {
    if (!window.confirm(`Delete menu: ${item.name}?`)) return;
    
    console.log('Delete Debug:', {
      itemId: item.id,
      itemName: item.name,
      token: token ? 'Token exists' : 'No token',
      userRole: user?.role,
      isAdmin: isAdmin
    });
    
    try {
      const res = await fetch(`/api/admin/menu/${item.id}`, { 
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Delete Response:', {
        status: res.status,
        statusText: res.statusText,
        ok: res.ok
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        console.log('Delete Error Response:', errorText);
        throw new Error(`Failed to delete menu item: ${res.status} ${res.statusText}`);
      }
      
      const responseData = await res.json();
      console.log('Delete Success Response:', responseData);
      
      // Remove the item from the local state immediately
      setMenuItems(prevItems => prevItems.filter(menuItem => menuItem.id !== item.id));
      
      alert('Menu item deleted successfully!');
    } catch (err) {
      console.error('Delete Error:', err);
      alert(err.message);
    }
  };

  // Handlers for Specials
  const handleAddSpecialFormChange = e => setAddSpecialForm({ ...addSpecialForm, [e.target.name]: e.target.value });
  const handleAddSpecialImageChange = e => setAddSpecialImage(e.target.files[0]);
  const handleAddSpecialSubmit = async e => {
    e.preventDefault();
    console.log('Adding special:', addSpecialForm);
    
    const formData = new FormData();
    Object.entries(addSpecialForm).forEach(([key, value]) => formData.append(key, value));
    if (addSpecialImage) formData.append('image', addSpecialImage);
    
    try {
      const res = await fetch('/api/admin/specials', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      
      console.log('Add special response status:', res.status);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Add special error:', errorText);
        throw new Error(`Failed to add special: ${res.status} ${res.statusText}`);
      }
      
      const result = await res.json();
      console.log('Add special success:', result);
      
      setAddSpecialForm({ item_name: '', description: '', price: '' });
      setAddSpecialImage(null);
      
      // Add new special to local state immediately
      setSpecials(prevSpecials => [...prevSpecials, result]);
      alert('Special added successfully!');
    } catch (err) {
      console.error('Add special error:', err);
      alert(err.message);
    }
  };
  
  const openEditSpecial = item => { 
    console.log('Opening edit for special:', item);
    setEditSpecial(item); 
    setEditSpecialForm({ 
      item_name: item.item_name, 
      description: item.description, 
      price: item.price 
    }); 
    setEditSpecialImage(null); 
  };
  
  const handleEditSpecialFormChange = e => setEditSpecialForm({ ...editSpecialForm, [e.target.name]: e.target.value });
  const handleEditSpecialImageChange = e => setEditSpecialImage(e.target.files[0]);
  
  const handleEditSpecialSubmit = async e => {
    e.preventDefault();
    if (!editSpecial) return;
    
    console.log('Editing special:', editSpecialForm);
    
    const formData = new FormData();
    Object.entries(editSpecialForm).forEach(([key, value]) => formData.append(key, value));
    if (editSpecialImage) formData.append('image', editSpecialImage);
    
    try {
      const res = await fetch(`/api/admin/specials/${editSpecial.id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      
      console.log('Edit special response status:', res.status);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Edit special error:', errorText);
        throw new Error(`Failed to update special: ${res.status} ${res.statusText}`);
      }
      
      const result = await res.json();
      console.log('Edit special success:', result);
      
      setEditSpecial(null);
      setEditSpecialForm({ item_name: '', description: '', price: '' });
      setEditSpecialImage(null);
      
      // Update local state immediately instead of reloading
      setSpecials(prevSpecials =>
        prevSpecials.map(item =>
          item.id === editSpecial.id
            ? { ...item, ...editSpecialForm, image_url: result.image_url || item.image_url }
            : item
        )
      );
      alert('Special updated successfully!');
    } catch (err) {
      console.error('Edit special error:', err);
      alert(err.message);
    }
  };
  
  const handleEditSpecialCancel = () => setEditSpecial(null);
  
  const handleDeleteSpecial = async item => {
    if (!window.confirm(`Delete special: ${item.item_name}?`)) return;
    try {
      const res = await fetch(`/api/admin/specials/${item.id}`, { 
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete special');
      // Reload specials
      const data = await fetch('/api/specials').then(r => r.json());
      setSpecials(data);
      alert('Special deleted successfully!');
    } catch (err) {
      alert(err.message);
    }
  };

  // Handlers for Staff
  const handleAddStaffFormChange = e => setAddStaffForm({ ...addStaffForm, [e.target.name]: e.target.value });
  const handleAddStaffImageChange = e => setAddStaffImage(e.target.files[0]);
  const handleAddStaffSubmit = async e => {
    e.preventDefault();
    console.log('Adding staff:', addStaffForm);
    
    const formData = new FormData();
    Object.entries(addStaffForm).forEach(([key, value]) => formData.append(key, value));
    if (addStaffImage) formData.append('photo', addStaffImage);
    
    try {
      const res = await fetch('/api/admin/staff', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      
      console.log('Add staff response status:', res.status);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Add staff error:', errorText);
        throw new Error(`Failed to add staff: ${res.status} ${res.statusText}`);
      }
      
      const result = await res.json();
      console.log('Add staff success:', result);
      
      setAddStaffForm({ name: '', position: '' });
      setAddStaffImage(null);
      
      // Add new staff to local state immediately
      setStaff(prevStaff => [...prevStaff, result]);
      alert('Staff added successfully!');
    } catch (err) {
      console.error('Add staff error:', err);
      alert(err.message);
    }
  };
  
  const openEditStaff = member => { 
    console.log('Opening edit for staff:', member);
    setEditStaff(member); 
    setEditStaffForm({ 
      name: member.name, 
      position: member.position 
    }); 
    setEditStaffImage(null); 
  };
  
  const handleEditStaffFormChange = e => setEditStaffForm({ ...editStaffForm, [e.target.name]: e.target.value });
  const handleEditStaffImageChange = e => setEditStaffImage(e.target.files[0]);
  
  const handleEditStaffSubmit = async e => {
    e.preventDefault();
    if (!editStaff) return;
    
    console.log('Editing staff:', editStaffForm);
    
    const formData = new FormData();
    Object.entries(editStaffForm).forEach(([key, value]) => formData.append(key, value));
    if (editStaffImage) formData.append('photo', editStaffImage);
    
    try {
      const res = await fetch(`/api/admin/staff/${editStaff.id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      
      console.log('Edit staff response status:', res.status);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Edit staff error:', errorText);
        throw new Error(`Failed to update staff: ${res.status} ${res.statusText}`);
      }
      
      const result = await res.json();
      console.log('Edit staff success:', result);
      
      setEditStaff(null);
      setEditStaffForm({ name: '', position: '' });
      setEditStaffImage(null);
      
      // Update local state immediately instead of reloading
      setStaff(prevStaff =>
        prevStaff.map(member =>
          member.id === editStaff.id
            ? { ...member, ...editStaffForm, photo_url: result.photo_url || member.photo_url }
            : member
        )
      );
      alert('Staff updated successfully!');
    } catch (err) {
      console.error('Edit staff error:', err);
      alert(err.message);
    }
  };
  
  const handleEditStaffCancel = () => setEditStaff(null);
  
  const handleDeleteStaff = async member => {
    if (!window.confirm(`Delete staff: ${member.name}?`)) return;
    try {
      const res = await fetch(`/api/admin/staff/${member.id}`, { 
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete staff');
      // Reload staff
      const data = await fetch('/api/staff').then(r => r.json());
      setStaff(data);
      alert('Staff deleted successfully!');
    } catch (err) {
      alert(err.message);
    }
  };

  if (!isAdmin) return <div className="w-full bg-white px-4 sm:px-6 lg:px-8 py-6 text-center">Admin access only.</div>;

  // Helper to render the correct form/list/modal
  function renderEntitySection() {
    if (!entity) {
      return (
        <div className="space-y-3">
          <button onClick={() => setEntity('menu')} className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 font-semibold">{section === 'add' ? 'Add' : section === 'edit' ? 'Edit' : 'Delete'} item for Menu</button>
          <button onClick={() => setEntity('specials')} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-semibold">{section === 'add' ? 'Add' : section === 'edit' ? 'Edit' : 'Delete'} item for Specials</button>
          <button onClick={() => setEntity('staff')} className="w-full bg-amber-600 text-white py-2 rounded hover:bg-amber-700 font-semibold">{section === 'add' ? 'Add' : section === 'edit' ? 'Edit' : 'Delete'} item for Staff</button>
        </div>
      );
    }
    if (section === 'add') {
      if (entity === 'menu') {
        return (
          <form onSubmit={handleAddMenuSubmit} className="space-y-3 mt-6" encType="multipart/form-data">
            <input name="name" value={addMenuForm.name} onChange={handleAddMenuFormChange} placeholder="Name" className="w-full border rounded px-3 py-2" required />
            <textarea name="description" value={addMenuForm.description} onChange={handleAddMenuFormChange} placeholder="Description" className="w-full border rounded px-3 py-2" required />
            <input name="price" value={addMenuForm.price} onChange={handleAddMenuFormChange} placeholder="Price" className="w-full border rounded px-3 py-2" required />
            <input name="category" value={addMenuForm.category} onChange={handleAddMenuFormChange} placeholder="Category" className="w-full border rounded px-3 py-2" required />
            <select name="type" value={addMenuForm.type} onChange={handleAddMenuFormChange} className="w-full border rounded px-3 py-2">
              <option value="veg">Vegetarian</option>
              <option value="non-veg">Non-Vegetarian</option>
              <option value="beverages">Beverages</option>
            </select>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" name="is_bestseller" checked={addMenuForm.is_bestseller} onChange={handleAddMenuFormChange} className="mr-2" />
                Best Seller
              </label>
              <label className="flex items-center">
                <input type="checkbox" name="is_spicy" checked={addMenuForm.is_spicy} onChange={handleAddMenuFormChange} className="mr-2" />
                Spicy
              </label>
              <label className="flex items-center">
                <input type="checkbox" name="has_gluten" checked={addMenuForm.has_gluten} onChange={handleAddMenuFormChange} className="mr-2" />
                Contains Gluten
              </label>
              <label className="flex items-center">
                <input type="checkbox" name="is_hot" checked={addMenuForm.is_hot} onChange={handleAddMenuFormChange} className="mr-2" />
                Hot Item
              </label>
            </div>
            <input type="file" accept="image/*" onChange={handleAddMenuImageChange} className="w-full border rounded px-3 py-2" />
            <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">Add Menu Item</button>
          </form>
        );
      } else if (entity === 'specials') {
        return (
          <form onSubmit={handleAddSpecialSubmit} className="space-y-3 mt-6" encType="multipart/form-data">
            <input name="item_name" value={addSpecialForm.item_name} onChange={handleAddSpecialFormChange} placeholder="Name" className="w-full border rounded px-3 py-2" required />
            <textarea name="description" value={addSpecialForm.description} onChange={handleAddSpecialFormChange} placeholder="Description" className="w-full border rounded px-3 py-2" required />
            <input name="price" value={addSpecialForm.price} onChange={handleAddSpecialFormChange} placeholder="Price" className="w-full border rounded px-3 py-2" required />
            <input type="file" accept="image/*" onChange={handleAddSpecialImageChange} className="w-full border rounded px-3 py-2" />
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Add Special</button>
          </form>
        );
      } else if (entity === 'staff') {
        return (
          <form onSubmit={handleAddStaffSubmit} className="space-y-3 mt-6" encType="multipart/form-data">
            <input name="name" value={addStaffForm.name} onChange={handleAddStaffFormChange} placeholder="Name" className="w-full border rounded px-3 py-2" required />
            <input name="position" value={addStaffForm.position} onChange={handleAddStaffFormChange} placeholder="Position" className="w-full border rounded px-3 py-2" required />
            <input type="file" accept="image/*" onChange={handleAddStaffImageChange} className="w-full border rounded px-3 py-2" />
            <button type="submit" className="w-full bg-amber-600 text-white py-2 rounded hover:bg-amber-700">Add Staff</button>
          </form>
        );
      }
    }
    if (section === 'edit') {
      if (entity === 'menu') {
        return (
          <div className="mt-6">
            {menuLoading ? <div>Loading...</div> : menuError ? <div className="text-red-600">{menuError}</div> : (
              <div className="space-y-4">
                {menuItems.map(item => (
                  <div key={item.id} className="flex items-center gap-4 bg-gray-50 rounded p-3">
                    <span className="flex-1 font-semibold">{item.name}</span>
                    <button onClick={() => openEditMenu(item)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-xs">Edit</button>
                  </div>
                ))}
              </div>
            )}
            {/* Edit Modal */}
            {editMenuItem && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
                  <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800" onClick={handleEditMenuCancel}>&times;</button>
                  <h3 className="text-xl font-bold mb-4">Edit Menu Item</h3>
                  <form onSubmit={handleEditMenuSubmit} className="space-y-3" encType="multipart/form-data">
                    <input name="name" value={editMenuForm.name} onChange={handleEditMenuFormChange} placeholder="Name" className="w-full border rounded px-3 py-2" required />
                    <textarea name="description" value={editMenuForm.description} onChange={handleEditMenuFormChange} placeholder="Description" className="w-full border rounded px-3 py-2" required />
                    <input name="price" value={editMenuForm.price} onChange={handleEditMenuFormChange} placeholder="Price" className="w-full border rounded px-3 py-2" required />
                    <input name="category" value={editMenuForm.category} onChange={handleEditMenuFormChange} placeholder="Category" className="w-full border rounded px-3 py-2" required />
                    <select name="type" value={editMenuForm.type} onChange={handleEditMenuFormChange} className="w-full border rounded px-3 py-2">
                      <option value="veg">Vegetarian</option>
                      <option value="non-veg">Non-Vegetarian</option>
                      <option value="beverages">Beverages</option>
                    </select>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" name="is_bestseller" checked={editMenuForm.is_bestseller} onChange={handleEditMenuFormChange} className="mr-2" />
                        Best Seller
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" name="is_spicy" checked={editMenuForm.is_spicy} onChange={handleEditMenuFormChange} className="mr-2" />
                        Spicy
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" name="has_gluten" checked={editMenuForm.has_gluten} onChange={handleEditMenuFormChange} className="mr-2" />
                        Contains Gluten
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" name="is_hot" checked={editMenuForm.is_hot} onChange={handleEditMenuFormChange} className="mr-2" />
                        Hot Item
                      </label>
                    </div>
                    <input type="file" accept="image/*" onChange={handleEditMenuImageChange} className="w-full border rounded px-3 py-2" />
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Save Changes</button>
                  </form>
                </div>
              </div>
            )}
          </div>
        );
      } else if (entity === 'specials') {
        return (
          <div className="mt-6">
            {specialsLoading ? <div>Loading...</div> : specialsError ? <div className="text-red-600">{specialsError}</div> : (
              <div className="space-y-4">
                {specials.map(item => (
                  <div key={item.id} className="flex items-center gap-4 bg-gray-50 rounded p-3">
                    <span className="flex-1 font-semibold">{item.item_name}</span>
                    <button onClick={() => openEditSpecial(item)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-xs">Edit</button>
                  </div>
                ))}
              </div>
            )}
            {/* Edit Modal */}
            {editSpecial && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
                  <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800" onClick={handleEditSpecialCancel}>&times;</button>
                  <h3 className="text-xl font-bold mb-4">Edit Special</h3>
                  <form onSubmit={handleEditSpecialSubmit} className="space-y-3" encType="multipart/form-data">
                    <input name="item_name" value={editSpecialForm.item_name} onChange={handleEditSpecialFormChange} placeholder="Name" className="w-full border rounded px-3 py-2" required />
                    <textarea name="description" value={editSpecialForm.description} onChange={handleEditSpecialFormChange} placeholder="Description" className="w-full border rounded px-3 py-2" required />
                    <input name="price" value={editSpecialForm.price} onChange={handleEditSpecialFormChange} placeholder="Price" className="w-full border rounded px-3 py-2" required />
                    <input type="file" accept="image/*" onChange={handleEditSpecialImageChange} className="w-full border rounded px-3 py-2" />
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Save Changes</button>
                  </form>
                </div>
              </div>
            )}
          </div>
        );
      } else if (entity === 'staff') {
        return (
          <div className="mt-6">
            {staffLoading ? <div>Loading...</div> : staffError ? <div className="text-red-600">{staffError}</div> : (
              <div className="space-y-4">
                {staff.map(member => (
                  <div key={member.id} className="flex items-center gap-4 bg-gray-50 rounded p-3">
                    <span className="flex-1 font-semibold">{member.name}</span>
                    <button onClick={() => openEditStaff(member)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-xs">Edit</button>
                  </div>
                ))}
              </div>
            )}
            {/* Edit Modal */}
            {editStaff && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
                  <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800" onClick={handleEditStaffCancel}>&times;</button>
                  <h3 className="text-xl font-bold mb-4">Edit Staff</h3>
                  <form onSubmit={handleEditStaffSubmit} className="space-y-3" encType="multipart/form-data">
                    <input name="name" value={editStaffForm.name} onChange={handleEditStaffFormChange} placeholder="Name" className="w-full border rounded px-3 py-2" required />
                    <input name="position" value={editStaffForm.position} onChange={handleEditStaffFormChange} placeholder="Position" className="w-full border rounded px-3 py-2" required />
                    <input type="file" accept="image/*" onChange={handleEditStaffImageChange} className="w-full border rounded px-3 py-2" />
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Save Changes</button>
                  </form>
                </div>
              </div>
            )}
          </div>
        );
      }
    }
    if (section === 'delete' && entity) {
      if (entity === 'menu') {
        return (
          <div className="mt-6">
            {menuLoading ? <div>Loading...</div> : menuError ? <div className="text-red-600">{menuError}</div> : (
              <div className="space-y-4">
                {menuItems.map(item => (
                  <div key={item.id} className="flex items-center gap-4 bg-gray-50 rounded p-3">
                    <span className="flex-1 font-semibold">{item.name}</span>
                    <button onClick={() => handleDeleteMenu(item)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs">Delete</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      } else if (entity === 'specials') {
        return (
          <div className="mt-6">
            {specialsLoading ? <div>Loading...</div> : specialsError ? <div className="text-red-600">{specialsError}</div> : (
              <div className="space-y-4">
                {specials.map(item => (
                  <div key={item.id} className="flex items-center gap-4 bg-gray-50 rounded p-3">
                    <span className="flex-1 font-semibold">{item.item_name}</span>
                    <button onClick={() => handleDeleteSpecial(item)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs">Delete</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      } else if (entity === 'staff') {
        return (
          <div className="mt-6">
            {staffLoading ? <div>Loading...</div> : staffError ? <div className="text-red-600">{staffError}</div> : (
              <div className="space-y-4">
                {staff.map(member => (
                  <div key={member.id} className="flex items-center gap-4 bg-gray-50 rounded p-3">
                    <span className="flex-1 font-semibold">{member.name}</span>
                    <button onClick={() => handleDeleteStaff(member)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs">Delete</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      }
    }
    return null;
  }

  return (
    <div className="w-full bg-white px-4 sm:px-6 lg:px-8 py-6">
      <h2 className="text-3xl font-bold text-amber-800 mb-6 text-center">Admin Dashboard</h2>
      {/* Section Tabs */}
      <div className="flex flex-col gap-4 mb-8">
        <div>
          <button onClick={() => { setSection('add'); setEntity(null); }} className={`px-4 py-2 rounded font-semibold w-full text-left ${section === 'add' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}>Add</button>
          {section === 'add' && (
            <div className="pl-4 pt-2">{renderEntitySection()}</div>
          )}
        </div>
        <div>
          <button onClick={() => { setSection('edit'); setEntity(null); }} className={`px-4 py-2 rounded font-semibold w-full text-left ${section === 'edit' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>Edit</button>
          {section === 'edit' && (
            <div className="pl-4 pt-2">{renderEntitySection()}</div>
          )}
        </div>
        <div>
          <button onClick={() => { setSection('delete'); setEntity(null); }} className={`px-4 py-2 rounded font-semibold w-full text-left ${section === 'delete' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'}`}>Delete</button>
          {section === 'delete' && (
            <div className="pl-4 pt-2">{renderEntitySection()}</div>
          )}
        </div>
      </div>
    </div>
  );
} 