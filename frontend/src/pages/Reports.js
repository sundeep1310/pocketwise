import React, { useState } from 'react';
import { toast } from 'react-toastify';
import API from '../api';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';

const Reports = () => {
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState(localStorage.getItem('currency') || 'USD');

  const handleChange = (e) => {
    setDateRange({ ...dateRange, [e.target.name]: e.target.value });
  };

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
    localStorage.setItem('currency', e.target.value);
  };

  const downloadPDF = async () => {
    setLoading(true);
    try {
      const res = await API.get('/reports/pdf', {
        responseType: 'blob',
        params: { ...dateRange, currency }
      });
      
      const blob = new Blob([res.data], { type: 'application/pdf' });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `pocketwise-report-${new Date().toISOString().slice(0, 10)}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      
      toast.success('PDF report downloaded successfully!');
    } catch (err) {
      toast.error('Failed to download PDF report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h2 className="text-primary">Reports</h2>
          <p className="text-muted">Generate and download financial reports</p>
        </Col>
      </Row>

      <Card className="mb-4">
        <Card.Body>
          <h5 className="mb-3">Filter by Date Range</h5>
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Start Date</Form.Label>
                <Form.Control
                  type="date"
                  name="startDate"
                  value={dateRange.startDate}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>End Date</Form.Label>
                <Form.Control
                  type="date"
                  name="endDate"
                  value={dateRange.endDate}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Currency</Form.Label>
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
        </Card.Body>
      </Card>

      <Card className="report-card">
        <Card.Body>
          <Row className="align-items-center">
            <Col md={2} className="text-center">
              <div className="report-icon mb-3 mb-md-0 mx-auto">
                <i className="fas fa-file-pdf"></i>
              </div>
            </Col>
            <Col md={10}>
              <h5 className="mb-2">PDF Report</h5>
              <p className="text-muted mb-3">Generate a printable financial report with all your transactions, income, expenses, and savings goals.</p>
              <Button 
                onClick={downloadPDF}
                disabled={loading}
                className="download-btn"
              >
                {loading ? 'Generating...' : 'Download PDF Report'}
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Reports;