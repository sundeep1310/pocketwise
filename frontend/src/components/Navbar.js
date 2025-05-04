import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';

const Navigation = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  
  return (
    <Navbar className="navbar" expand="lg" variant="dark">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <i className="fas fa-wallet me-2"></i>
          PocketWise
        </Navbar.Brand>
        
        {user && (
          <>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link 
                  as={Link} 
                  to="/" 
                  active={location.pathname === '/'}
                >
                  Dashboard
                </Nav.Link>
                <Nav.Link 
                  as={Link} 
                  to="/transactions" 
                  active={location.pathname === '/transactions'}
                >
                  Transactions
                </Nav.Link>
                <Nav.Link 
                  as={Link} 
                  to="/goals" 
                  active={location.pathname === '/goals'}
                >
                  Goals
                </Nav.Link>
                <Nav.Link 
                  as={Link} 
                  to="/categories" 
                  active={location.pathname === '/categories'}
                >
                  Categories
                </Nav.Link>
                <Nav.Link 
                  as={Link} 
                  to="/reports" 
                  active={location.pathname === '/reports'}
                >
                  Reports
                </Nav.Link>
              </Nav>
              
              <div className="user-info">
                <div className="avatar">{user.name.charAt(0)}</div>
                <span className="user-name">{user.name}</span>
                <Button 
                  onClick={logout} 
                  className="logout-btn"
                >
                  <i className="fas fa-sign-out-alt me-2"></i>
                  Logout
                </Button>
              </div>
            </Navbar.Collapse>
          </>
        )}
        
        {!user && (
          <Navbar.Collapse className="justify-content-end">
            <Nav>
              <Nav.Link as={Link} to="/login">Login</Nav.Link>
              <Nav.Link as={Link} to="/register">Register</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        )}
      </Container>
    </Navbar>
  );
};

export default Navigation;