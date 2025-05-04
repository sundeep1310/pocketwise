import React, { useState, useEffect } from 'react';
import API from '../api';
import { toast } from 'react-toastify';

const AddTransaction = ({ onAdd }) => {
  const [form, setForm] = useState({
    type: 'expense',
    amount: '',
    category: '',
    note: '',
    location: ''
  });
  const [photo, setPhoto] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await API.get('/categories');
        setCategories(data);
      } catch (err) {
        toast.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    
    if (!form.category) {
      toast.error("Please select a category");
      return;
    }
    
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => formData.append(key, form[key]));
      if (photo) formData.append('photo', photo);
      
      const { data } = await API.post('/transactions', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      onAdd(data);
      setForm({
        type: 'expense',
        amount: '',
        category: '',
        note: '',
        location: ''
      });
      setPhoto(null);
      
      // Reset file input
      const fileInput = document.getElementById('receipt-photo');
      if (fileInput) fileInput.value = '';
      
      toast.success(`${form.type === 'income' ? 'Income' : 'Expense'} added successfully!`);
    } catch (err) {
      toast.error("Failed to add transaction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-transaction">
      <h3>Add New Transaction</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="transaction-type-selector">
          <button 
            type="button"
            className={`type-btn ${form.type === 'income' ? 'active income' : ''}`}
            onClick={() => setForm({...form, type: 'income'})}
          >
            <i className="fas fa-plus-circle"></i> Income
          </button>
          <button 
            type="button"
            className={`type-btn ${form.type === 'expense' ? 'active expense' : ''}`}
            onClick={() => setForm({...form, type: 'expense'})}
          >
            <i className="fas fa-minus-circle"></i> Expense
          </button>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Amount ($)</label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="Enter amount"
              required
              min="0.01"
              step="0.01"
            />
          </div>
          
          <div className="form-group">
            <label>Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Note (Optional)</label>
            <input
              type="text"
              name="note"
              value={form.note}
              onChange={handleChange}
              placeholder="Add a note"
            />
          </div>
          
          <div className="form-group">
            <label>Location (Optional)</label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Add location"
            />
          </div>
        </div>
        
        <div className="form-group">
          <label>Receipt Photo (Optional)</label>
          <input
            id="receipt-photo"
            type="file"
            accept="image/*"
            onChange={e => setPhoto(e.target.files[0])}
          />
        </div>
        
        <button 
          type="submit" 
          className={`submit-btn ${form.type}`}
          disabled={loading}
        >
          {loading ? 'Adding...' : `Add ${form.type === 'income' ? 'Income' : 'Expense'}`}
        </button>
      </form>
    </div>
  );
};

export default AddTransaction;
