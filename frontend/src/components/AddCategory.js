import React, { useState, useEffect } from 'react';
import API from '../api';
import { toast } from 'react-toastify';

const AddCategory = () => {
  const [name, setName] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setFetchLoading(true);
        const res = await API.get('/categories');
        setCategories(res.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
        toast.error("Couldn't load categories");
      } finally {
        setFetchLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setLoading(true);
    try {
      const { data } = await API.post('/categories', { name });
      setCategories([...categories, data]);
      setName('');
      toast.success(`Category "${name}" added successfully!`);
    } catch (err) {
      console.error("Error adding category:", err);
      toast.error("Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-category-container">
      <h3>Add New Category</h3>
      <form onSubmit={handleSubmit} className="category-form">
        <div className="input-group">
          <input 
            value={name} 
            onChange={e => setName(e.target.value)} 
            placeholder="New Category Name" 
            required 
          />
          <button 
            type="submit" 
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Category'}
          </button>
        </div>
      </form>
      
      <div className="categories-container">
        <h4>Your Categories</h4>
        {fetchLoading ? (
          <p>Loading categories...</p>
        ) : categories.length > 0 ? (
          <div className="categories-grid">
            {categories.map(cat => (
              <div key={cat._id} className="category-tag">
                <i className="fas fa-tag"></i>
                <span>{cat.name}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-data">No categories yet. Add your first category!</p>
        )}
      </div>
    </div>
  );
};

export default AddCategory;
