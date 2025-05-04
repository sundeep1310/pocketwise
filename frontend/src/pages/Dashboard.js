import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import NotificationBar from '../components/NotificationBar';
import { toast } from 'react-toastify';
import { Container, Row, Col, Card, Form } from 'react-bootstrap';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [data, setData] = useState({ transactions: [], goals: [] });
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState(localStorage.getItem('currency') || 'USD');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [transactionsRes, goalsRes] = await Promise.all([
          API.get('/transactions'),
          API.get('/goals')
        ]);
        setData({
          transactions: transactionsRes.data,
          goals: goalsRes.data
        });
      } catch (err) {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle currency change
  const handleCurrencyChange = (e) => {
    const newCurrency = e.target.value;
    setCurrency(newCurrency);
    localStorage.setItem('currency', newCurrency);
  };

  // Get currency symbol
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

  // Data calculations
  const income = data.transactions.filter(t => t.type === 'income')
    .reduce((a, b) => a + (parseFloat(b.amount) || 0), 0);
  const expenses = data.transactions.filter(t => t.type === 'expense')
    .reduce((a, b) => a + (parseFloat(b.amount) || 0), 0);
  const balance = income - expenses;

  // Category data
  const expenseCategories = {};
  data.transactions.filter(t => t.type === 'expense').forEach(t => {
    expenseCategories[t.category] = (expenseCategories[t.category] || 0) + parseFloat(t.amount || 0);
  });

  if (loading) {
    return (
      <Container className="mt-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="dashboard">
      <NotificationBar />
      
      <Row className="mb-4">
        <Col md={9}>
          <Card className="welcome-banner border-0">
            <Card.Body>
              <h2>Welcome to PocketWise!</h2>
              <p>Your personal pocket money manager</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="d-flex align-items-end">
          <Form.Group className="w-100">
            <Form.Label>Currency:</Form.Label>
            <Form.Select 
              value={currency} 
              onChange={handleCurrencyChange}
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
      
      <Row className="mb-4">
        <Col md={4}>
          <Card className="summary-card balance">
            <Card.Body className="d-flex align-items-center">
              <div className="summary-icon">
                <i className="fas fa-wallet"></i>
              </div>
              <div className="ms-3">
                <h6 className="mb-1">Current Balance</h6>
                <h4 className="mb-0">{getCurrencySymbol(currency)}{balance.toFixed(2)}</h4>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="summary-card income">
            <Card.Body className="d-flex align-items-center">
              <div className="summary-icon">
                <i className="fas fa-arrow-down"></i>
              </div>
              <div className="ms-3">
                <h6 className="mb-1">Total Income</h6>
                <h4 className="mb-0">{getCurrencySymbol(currency)}{income.toFixed(2)}</h4>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="summary-card expense">
            <Card.Body className="d-flex align-items-center">
              <div className="summary-icon">
                <i className="fas fa-arrow-up"></i>
              </div>
              <div className="ms-3">
                <h6 className="mb-1">Total Expenses</h6>
                <h4 className="mb-0">{getCurrencySymbol(currency)}{expenses.toFixed(2)}</h4>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row>
        <Col lg={6}>
          <Card className="mb-4">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Recent Transactions</h5>
                <Link to="/transactions" className="text-primary">View All</Link>
              </div>
              
              {data.transactions.length > 0 ? (
                <div>
                  {data.transactions.slice(0, 5).map(tx => (
                    <div key={tx._id} className={`transaction-item`}>
                      <div className="d-flex align-items-center">
                        <div className="transaction-icon">
                          <i className={tx.type === 'income' ? 'fas fa-arrow-down' : 'fas fa-arrow-up'}></i>
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <div className="d-flex justify-content-between">
                            <h6 className="mb-0">{tx.category}</h6>
                            <h6 className={`mb-0 text-${tx.type}`}>
                              {getCurrencySymbol(currency)}{parseFloat(tx.amount).toFixed(2)}
                            </h6>
                          </div>
                          <div className="d-flex justify-content-between">
                            <small className="text-muted">{new Date(tx.date).toLocaleDateString()}</small>
                            {tx.note && <small className="text-muted">{tx.note}</small>}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <i className="fas fa-receipt"></i>
                  <p>No transactions yet</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={6}>
          <Card className="mb-4">
            <Card.Body>
              <h5 className="mb-3">Expense Breakdown</h5>
              {Object.keys(expenseCategories).length > 0 ? (
                <div style={{ height: '300px' }}>
                  <Pie
                    data={{
                      labels: Object.keys(expenseCategories),
                      datasets: [{
                        data: Object.values(expenseCategories),
                        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']
                      }]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'right',
                          labels: {
                            boxWidth: 15,
                            font: {
                              size: 12
                            }
                          }
                        }
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="empty-state">
                  <i className="fas fa-chart-pie"></i>
                  <p>No expense data to display</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Savings Goals</h5>
            <Link to="/goals" className="text-primary">View All</Link>
          </div>
          
          {data.goals.length > 0 ? (
            <Row>
              {data.goals.map(goal => (
                <Col md={4} key={goal._id}>
                  <Card className="goal-card">
                    <Card.Body>
                      <h6 className="mb-3">{goal.title}</h6>
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
                      <small className="text-end d-block">
                        {Math.round((goal.savedAmount / goal.targetAmount) * 100)}% complete
                      </small>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <div className="empty-state">
              <i className="fas fa-bullseye"></i>
              <p>No savings goals yet</p>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Dashboard;