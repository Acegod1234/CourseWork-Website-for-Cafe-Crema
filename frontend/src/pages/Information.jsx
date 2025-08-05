import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';

export default function Information() {
  const { user } = useAuth();
  const isAdmin = user && user.role === 'admin';
  const location = useLocation();
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetch('/api/staff')
      .then(res => res.json())
      .then(data => {
        setStaff(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load staff.');
        setLoading(false);
      });
  }, []);

  // Open add modal if navigated with openAdd state
  useEffect(() => {
    if (isAdmin && location.state && location.state.openAdd) {
      setShowAddModal(true);
      window.history.replaceState({}, document.title);
    }
  }, [isAdmin, location.state]);

  // Add form state (UI only for now)
  const [addForm, setAddForm] = useState({
    name: '',
    position: '',
  });
  const [addImageFile, setAddImageFile] = useState(null);
  const handleAddFormChange = e => {
    setAddForm({ ...addForm, [e.target.name]: e.target.value });
  };
  const handleAddImageChange = e => {
    setAddImageFile(e.target.files[0]);
  };
  const handleAddSubmit = e => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(addForm).forEach(([key, value]) => formData.append(key, value));
    if (addImageFile) formData.append('photo', addImageFile);
    // TODO: Backend integration
    alert('Add staff: ' + JSON.stringify(addForm) + (addImageFile ? `, Photo: ${addImageFile.name}` : ''));
    setShowAddModal(false);
    setAddForm({ name: '', position: '' });
    setAddImageFile(null);
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
      {/* Add Modal */}
      {showAddModal && isAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800" onClick={() => setShowAddModal(false)}>&times;</button>
            <h3 className="text-xl font-bold mb-4">Add New Staff</h3>
            <form onSubmit={handleAddSubmit} className="space-y-3" encType="multipart/form-data">
              <input name="name" value={addForm.name} onChange={handleAddFormChange} placeholder="Name" className="w-full border rounded px-3 py-2" required />
              <input name="position" value={addForm.position} onChange={handleAddFormChange} placeholder="Position" className="w-full border rounded px-3 py-2" required />
              <input type="file" accept="image/*" onChange={handleAddImageChange} className="w-full border rounded px-3 py-2" />
              <button type="submit" className="w-full bg-amber-600 text-white py-2 rounded hover:bg-amber-700">Add Staff</button>
            </form>
          </div>
        </div>
      )}
      <h2 className="text-3xl font-bold text-amber-800 mb-6 text-center">Meet Our Staff</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {staff.map(member => (
          <div key={member.id} className="bg-white rounded shadow p-6 flex flex-col items-center">
            <img
              src={member.photo_url || 'https://via.placeholder.com/150'}
              alt={member.name}
              className="w-24 h-24 rounded-full mb-4 object-cover"
            />
            <span className="font-bold text-lg">{member.name}</span>
            <span className="text-amber-700 font-semibold">{member.position}</span>
          </div>
        ))}
      </div>
    </div>
  );
} 