import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  const year = new Date().getFullYear();
  
  const handleNavClick = (e) => {
    e.preventDefault();
    // You can implement actual navigation logic here if needed
  };
  
  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col md={3} className="mb-4 mb-md-0">
            <h4>PocketWise</h4>
            <p className="text-white-50">Your student pocket money manager</p>
          </Col>
          
          <Col md={3} className="mb-4 mb-md-0">
            <h4>Quick Links</h4>
            <ul className="list-unstyled">
              <li><Link to="/" className="text-white-50">Dashboard</Link></li>
              <li><Link to="/transactions" className="text-white-50">Transactions</Link></li>
              <li><Link to="/goals" className="text-white-50">Savings Goals</Link></li>
              <li><Link to="/categories" className="text-white-50">Categories</Link></li>
              <li><Link to="/reports" className="text-white-50">Reports</Link></li>
            </ul>
          </Col>
          
          <Col md={3} className="mb-4 mb-md-0">
            <h4>Resources</h4>
            <ul className="list-unstyled">
              <li><button className="btn btn-link text-white-50 p-0" onClick={handleNavClick}>Help Center</button></li>
              <li><button className="btn btn-link text-white-50 p-0" onClick={handleNavClick}>Budgeting Tips</button></li>
              <li><button className="btn btn-link text-white-50 p-0" onClick={handleNavClick}>Student Finance</button></li>
              <li><button className="btn btn-link text-white-50 p-0" onClick={handleNavClick}>Privacy Policy</button></li>
              <li><button className="btn btn-link text-white-50 p-0" onClick={handleNavClick}>Terms of Service</button></li>
            </ul>
          </Col>
          
          <Col md={3}>
            <h4>Connect With Us</h4>
            <div className="mb-3">
              <button className="btn btn-link text-white p-2" onClick={handleNavClick}>
                <i className="fab fa-facebook fa-lg"></i>
              </button>
              <button className="btn btn-link text-white p-2" onClick={handleNavClick}>
                <i className="fab fa-twitter fa-lg"></i>
              </button>
              <button className="btn btn-link text-white p-2" onClick={handleNavClick}>
                <i className="fab fa-instagram fa-lg"></i>
              </button>
              <button className="btn btn-link text-white p-2" onClick={handleNavClick}>
                <i className="fab fa-linkedin fa-lg"></i>
              </button>
            </div>
            <p className="text-white-50">Email: support@pocketwise.com</p>
            <p className="text-white-50">© {year} PocketWise. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;