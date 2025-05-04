import React, { useState, useEffect } from 'react';
import API from '../api';
import { toast } from 'react-toastify';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';

const Goals = () => {
  const [form, setForm] = useState({ title: '', targetAmount: '', deadline: '' });
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingAmount, setSavingAmount] = useState({});
  const [currency] = useState(localStorage.getItem('currency') || 'USD');

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/goals');
      setGoals(data);
    } catch (err) {
      toast.error("Failed to load goals");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/goals', form);
      setGoals([...goals, data]);
      setForm({ title: '', targetAmount: '', deadline: '' });
      toast.success(`Goal "${form.title}" created successfully!`);
    } catch (err) {
      toast.error("Failed to create goal");
    }
  };

  const handleSavingChange = (goalId, value) => {
    setSavingAmount({ ...savingAmount, [goalId]: value });
  };

  const handleSave = async (goalId) => {
    try {
      const amount = savingAmount[goalId];
      if (!amount || isNaN(amount) || amount <= 0) {
        toast.error("Please enter a valid amount");
        return;
      }
      
      await API.post(`/goals/${goalId}/save`, { amount });
      toast.success("Amount saved successfully!");
      fetchGoals();
      setSavingAmount({ ...savingAmount, [goalId]: '' });
    } catch (err) {
      toast.error("Failed to save amount");
    }
  };

  const getCurrencySymbol = (currencyCode) => {
    switch(currencyCode) {
      case 'USD': return '$';
      case 'EUR': return '€';
      case 'GBP': return '£';
      case 'JPY': return '¥';
      case 'INR': return '₹';
      default: return '$';
    }
  };

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h2 className="text-primary">Savings Goals</h2>
          <p className="text-muted">Track your progress towards financial goals</p>
        </Col>
      </Row>

      <Card className="mb-4">
        <Card.Body>
          <h5 className="mb-3">Create a New Savings Goal</h5>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Goal Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g., New Laptop"
                    required
                  />
                </Form.Group>
              </Col>
              
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Target Amount</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text">{getCurrencySymbol(currency)}</span>
                    <Form.Control
                      type="number"
                      name="targetAmount"
                      value={form.targetAmount}
                      onChange={handleChange}
                      placeholder="e.g., 1000"
                      required
                      min="1"
                      step="1"
                    />
                  </div>
                </Form.Group>
              </Col>
              
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Target Date (Optional)</Form.Label>
                  <Form.Control
                    type="date"
                    name="deadline"
                    value={form.deadline}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Button type="submit" className="create-btn">Create Goal</Button>
          </Form>
        </Card.Body>
      </Card>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading goals...</span>
          </div>
        </div>
      ) : goals.length > 0 ? (
        <Row>
          {goals.map(goal => (
            <Col lg={4} key={goal._id}>
              <Card className="goal-card">
                <Card.Body>
                  <h5 className="mb-3">{goal.title}</h5>
                  <div className="mb-2">
                    <div className="d-flex justify-content-between mb-1">
                      <small>Target:</small>
                      <small className="fw-bold">{getCurrencySymbol(currency)}{goal.targetAmount}</small>
                    </div>
                    <div className="d-flex justify-content-between mb-1">
                      <small>Saved:</small>
                      <small className="fw-bold">{getCurrencySymbol(currency)}{goal.savedAmount}</small>
                    </div>
                    {goal.deadline && (
                      <div className="d-flex justify-content-between mb-1">
                        <small>Deadline:</small>
                        <small className="fw-bold">{new Date(goal.deadline).toLocaleDateString()}</small>
                      </div>
                    )}
                  </div>
                  
                  <div className="progress mb-2" style={{ height: '10px' }}>
                    <div 
                      className="progress-bar" 
                      style={{ 
                        width: `${(goal.savedAmount / goal.targetAmount) * 100}%`,
                        background: 'linear-gradient(to right, var(--primary-light), var(--primary))'
                      }}
                    ></div>
                  </div>
                  <small className="text-end d-block mb-2">
                    {Math.round((goal.savedAmount / goal.targetAmount) * 100)}% complete
                  </small>
                  
                  <div className="input-group mt-3">
                    <Form.Control
                      type="number"
                      placeholder="Amount to save"
                      value={savingAmount[goal._id] || ''}
                      onChange={(e) => handleSavingChange(goal._id, e.target.value)}
                    />
                    <Button 
                      onClick={() => handleSave(goal._id)}
                      className="save-btn"
                    >
                      Save
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <div className="empty-state">
          <i className="fas fa-bullseye"></i>
          <p>You don't have any savings goals yet. Create one to get started!</p>
        </div>
      )}
    </Container>
  );
};

export default Goals;