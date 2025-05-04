import React, { useState } from 'react';
import API from '../api';
import { toast } from 'react-toastify';

const AddGoal = ({ onAdd }) => {
  const [form, setForm] = useState({ title: '', targetAmount: '', deadline: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/goals', form);
      onAdd(data);
      setForm({ title: '', targetAmount: '', deadline: '' });
      toast.success(`Goal "${form.title}" created!`);
    } catch (err) {
      toast.error("Failed to create goal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-goal-container">
      <h3>Create a New Savings Goal</h3>
      <form onSubmit={handleSubmit} className="goal-form">
        <div className="form-row">
          <div className="form-group">
            <label>Goal Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g., New Laptop"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Target Amount ($)</label>
            <input
              name="targetAmount"
              type="number"
              min="1"
              step="0.01"
              value={form.targetAmount}
              onChange={handleChange}
              placeholder="e.g., 1000"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Target Date (Optional)</label>
            <input
              name="deadline"
              type="date"
              value={form.deadline}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Goal'}
        </button>
      </form>
    </div>
  );
};

export default AddGoal;
