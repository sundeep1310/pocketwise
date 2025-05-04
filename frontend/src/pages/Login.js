import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../api';
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/auth/login', { email, password });
      login(data);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      toast.error('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="auth-page" style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Fixed Navbar */}
      <div style={{ 
        width: '100%', 
        backgroundColor: '#6200ea',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto',
          padding: '1rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <i className="fas fa-wallet me-2 text-white"></i>
            <span style={{ 
              fontWeight: '600', 
              fontSize: '1.5rem', 
              color: 'white',
              letterSpacing: '-0.5px' 
            }}>PocketWise</span>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link 
              to="/login" 
              style={{
                padding: '0.5rem 1.5rem',
                borderRadius: '0.25rem',
                backgroundColor: 'white',
                color: '#6200ea',
                border: 'none',
                fontWeight: '500',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
              className="btn"
            >
              Login
            </Link>
            <Link 
              to="/register" 
              style={{
                padding: '0.5rem 1.5rem',
                borderRadius: '0.25rem',
                backgroundColor: 'transparent',
                color: 'white',
                border: '1px solid white',
                fontWeight: '500',
                textDecoration: 'none',
                transition: 'all 0.3s ease'
              }}
              className="btn"
            >
              Register
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-fluid" style={{ flex: 1, display: 'flex', padding: 0 }}>
        <div className="row w-100 g-0">
          {/* Left Section - Form */}
          <div className="col-md-5 bg-white p-4">
            <div className="p-3">
              <h1 className="text-purple mb-2">Welcome Back!</h1>
              <p className="mb-4">Sign in to manage your pocket money</p>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="fas fa-envelope"></i>
                    </span>
                    <input
                      type="email"
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="form-label">Password</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="fas fa-lock"></i>
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                    />
                    <button 
                      type="button" 
                      className="input-group-text"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  className="btn w-100 mb-3"
                  style={{ backgroundColor: '#6200ea', color: 'white' }}
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign In"}
                </button>
                
                <p className="text-center mb-0">
                  Don't have an account? <Link to="/register" style={{ color: '#6200ea' }}>Register here</Link>
                </p>
              </form>
            </div>
          </div>
          
          {/* Right Section - Features */}
          <div className="col-md-7 p-4" style={{ backgroundColor: '#6200ea', color: 'white' }}>
            <div className="p-3">
              <h2 className="text-center mb-5">PocketWise Features</h2>
              
              <div className="row g-4">
                <div className="col-sm-6 text-center">
                  <div className="mb-3">
                    <i className="fas fa-chart-line fa-2x"></i>
                  </div>
                  <h5>Track Expenses</h5>
                  <p>Monitor where your money goes with detailed categorization</p>
                </div>
                
                <div className="col-sm-6 text-center">
                  <div className="mb-3">
                    <i className="fas fa-piggy-bank fa-2x"></i>
                  </div>
                  <h5>Set Savings Goals</h5>
                  <p>Save for what matters with visual progress tracking</p>
                </div>
                
                <div className="col-sm-6 text-center">
                  <div className="mb-3">
                    <i className="fas fa-bell fa-2x"></i>
                  </div>
                  <h5>Budget Alerts</h5>
                  <p>Get notified when you're approaching your spending limits</p>
                </div>
                
                <div className="col-sm-6 text-center">
                  <div className="mb-3">
                    <i className="fas fa-file-export fa-2x"></i>
                  </div>
                  <h5>Export Reports</h5>
                  <p>Generate financial reports to share or analyze</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;