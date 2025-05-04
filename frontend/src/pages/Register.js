import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../api';
import { toast } from 'react-toastify';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleChange = e => setForm({
    ...form,
    [e.target.name]: e.target.value
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const { data } = await API.post('/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password
      });
      login(data);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="auth-page">
      {/* Fixed Navbar */}
      <nav className="navbar-override" style={{ backgroundColor: '#6200ea' }}>
        <div>
          <div className="d-flex align-items-center">
            <i className="fas fa-wallet text-white" style={{ marginRight: '0.5rem' }}></i>
            <span className="text-white fs-4 fw-bold">PocketWise</span>
          </div>
          <div className="navbar-buttons">
            <Link to="/login" className="navbar-button btn-outline-light">
              Login
            </Link>
            <Link to="/register" className="navbar-button btn-light">
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* Rest of your content stays the same */}
      <div className="container-fluid" style={{ flex: 1, display: 'flex', padding: 0 }}>
        <div className="row w-100 g-0">
          {/* Left Section - Features */}
          <div className="col-md-7 p-4" style={{ backgroundColor: '#6200ea', color: 'white' }}>
            <div className="p-3">
              <h2 className="text-center mb-5">Join PocketWise Today</h2>
              
              <div className="row">
                <div className="col-md-10 mx-auto">
                  <div className="d-flex align-items-start mb-4">
                    <div className="me-3">
                      <i className="fas fa-shield-alt fa-lg"></i>
                    </div>
                    <div>
                      <h5>Secure & Private</h5>
                      <p>Your financial data stays private and secure</p>
                    </div>
                  </div>
                  
                  <div className="d-flex align-items-start mb-4">
                    <div className="me-3">
                      <i className="fas fa-mobile-alt fa-lg"></i>
                    </div>
                    <div>
                      <h5>Mobile Friendly</h5>
                      <p>Access your finances anywhere, anytime</p>
                    </div>
                  </div>
                  
                  <div className="d-flex align-items-start mb-4">
                    <div className="me-3">
                      <i className="fas fa-trophy fa-lg"></i>
                    </div>
                    <div>
                      <h5>Achievement Badges</h5>
                      <p>Earn badges as you develop good financial habits</p>
                    </div>
                  </div>
                  
                  <div className="d-flex align-items-start mb-4">
                    <div className="me-3">
                      <i className="fas fa-camera fa-lg"></i>
                    </div>
                    <div>
                      <h5>Receipt Uploads</h5>
                      <p>Capture and store receipts for better tracking</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Section - Form */}
          <div className="col-md-5 bg-white p-4">
            <div className="p-3">
              <h1 className="text-purple mb-2">Create Your Account</h1>
              <p className="mb-4">Start managing your finances smarter</p>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="fas fa-user"></i>
                    </span>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="fas fa-envelope"></i>
                    </span>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="fas fa-lock"></i>
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      className="form-control"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="••••••••"
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
                
                <div className="mb-4">
                  <label className="form-label">Confirm Password</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="fas fa-check-circle"></i>
                    </span>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      className="form-control"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      required
                    />
                    <button 
                      type="button" 
                      className="input-group-text"
                      onClick={toggleConfirmPasswordVisibility}
                    >
                      {showConfirmPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  className="btn w-100 mb-3"
                  style={{ backgroundColor: '#6200ea', color: 'white' }}
                  disabled={loading}
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </button>
                
                <p className="text-center mb-0">
                  Already have an account? <Link to="/login" style={{ color: '#6200ea' }}>Sign in</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;