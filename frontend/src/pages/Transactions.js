import React, { useState, useEffect } from 'react';
import API from '../api';
import { toast } from 'react-toastify';
import { Container, Row, Col, Card, Form, Button, InputGroup } from 'react-bootstrap';

const Transactions = () => {
  const [form, setForm] = useState({
    type: 'income',
    amount: '',
    category: '',
    note: '',
    location: ''
  });
  const [photo, setPhoto] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ type: 'all', search: '' });
  const [currency, setCurrency] = useState(localStorage.getItem('currency') || 'USD');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [transactionsRes, categoriesRes] = await Promise.all([
        API.get('/transactions'),
        API.get('/categories')
      ]);
      setTransactions(transactionsRes.data);
      setCategories(categoriesRes.data);
    } catch (err) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
    localStorage.setItem('currency', e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.category) {
      toast.error("Please select a category");
      return;
    }
    
    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => formData.append(key, form[key]));
      if (photo) formData.append('photo', photo);
      
      const { data } = await API.post('/transactions', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setTransactions([data, ...transactions]);
      setForm({
        type: 'income',
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
    }
  };

  const filteredTransactions = transactions.filter(tx => {
    if (filter.type !== 'all' && tx.type !== filter.type) return false;
    if (filter.search && !tx.category.toLowerCase().includes(filter.search.toLowerCase()) && 
        !tx.note?.toLowerCase().includes(filter.search.toLowerCase())) return false;
    return true;
  });

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
          <h2 className="text-primary">Transactions</h2>
          <p className="text-muted">Manage your income and expenses</p>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Currency:</Form.Label>
            <Form.Select 
              value={currency} 
              onChange={handleCurrencyChange}
              style={{ maxWidth: '150px' }}
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="JPY">JPY (¥)</option>
              <option value="INR">INR (₹)</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <Card className="shadow-sm border-0 mb-4">
        <Card.Body>
          <h5 className="mb-4">Add New Transaction</h5>
          <Form onSubmit={handleSubmit}>
            <div className="transaction-type-selector mb-4">
              <button 
                type="button"
                className={`type-btn ${form.type === 'income' ? 'active income' : ''}`}
                onClick={() => setForm({...form, type: 'income'})}
              >
                <i className="fas fa-plus-circle me-2"></i> Income
              </button>
              <button 
                type="button"
                className={`type-btn ${form.type === 'expense' ? 'active expense' : ''}`}
                onClick={() => setForm({...form, type: 'expense'})}
              >
                <i className="fas fa-minus-circle me-2"></i> Expense
              </button>
            </div>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Amount</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>{getCurrencySymbol(currency)}</InputGroup.Text>
                    <Form.Control
                      type="number"
                      name="amount"
                      value={form.amount}
                      onChange={handleChange}
                      placeholder="Enter amount"
                      required
                      min="0.01"
                      step="0.01"
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat.name}>{cat.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Note (Optional)</Form.Label>
                  <Form.Control
                    type="text"
                    name="note"
                    value={form.note}
                    onChange={handleChange}
                    placeholder="Add a note"
                  />
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Location (Optional)</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="Add location"
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-4">
              <Form.Label>Receipt Photo (Optional)</Form.Label>
              <Form.Control
                id="receipt-photo"
                type="file"
                accept="image/*"
                onChange={e => setPhoto(e.target.files[0])}
              />
            </Form.Group>
            
            <Button 
              type="submit" 
              className={`submit-btn w-100 ${form.type}`}
            >
              Add {form.type === 'income' ? 'Income' : 'Expense'}
            </Button>
          </Form>
        </Card.Body>
      </Card>

      <Card className="shadow-sm border-0 mb-4">
        <Card.Body>
          <h5 className="mb-3">Filter Transactions</h5>
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Type:</Form.Label>
                <Form.Select 
                  value={filter.type} 
                  onChange={(e) => setFilter({...filter, type: e.target.value})}
                >
                  <option value="all">All</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </Form.Select>
              </Form.Group>
            </Col>
            
            <Col md={8}>
              <Form.Group className="mb-3">
                <Form.Label>Search:</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Search category or note" 
                  value={filter.search}
                  onChange={(e) => setFilter({...filter, search: e.target.value})}
                />
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {loading ? (
        <div className="text-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading transactions...</span>
          </div>
        </div>
      ) : filteredTransactions.length > 0 ? (
        <div>
          {filteredTransactions.map(tx => (
            <Card key={tx._id} className={`transaction-item shadow-sm mb-3 ${tx.type}`}>
              <Card.Body>
                <div className="d-flex align-items-center">
                  <div className="transaction-icon me-3">
                    <i className={tx.type === 'income' ? 'fas fa-arrow-down' : 'fas fa-arrow-up'}></i>
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-center">
                      <h6 className="mb-0">{tx.category}</h6>
                      <h5 className={`mb-0 text-${tx.type}`}>
                        {getCurrencySymbol(currency)}{parseFloat(tx.amount).toFixed(2)}
                      </h5>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">{new Date(tx.date).toLocaleDateString()}</small>
                      {tx.note && <small className="text-muted">{tx.note}</small>}
                    </div>
                  </div>
                </div>
                {tx.photo && (
                  <div className="mt-3">
                    <img 
                      src={`http://localhost:5000/uploads/${tx.photo}`} 
                      alt="Receipt" 
                      className="img-fluid rounded"
                      style={{ maxHeight: '200px' }}
                    />
                  </div>
                )}
              </Card.Body>
            </Card>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <i className="fas fa-receipt"></i>
          <p>No transactions found.</p>
        </div>
      )}
    </Container>
  );
};

export default Transactions;