import React, { useState } from 'react';
import './AuthPage.css';
import farmchainxLogo from './assets/farmchainxLogo.png';
import { Link, useNavigate} from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Phone, Lock, Shield, ArrowRight, Check } from 'lucide-react';

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    role: 'consumer',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // const handleSignIn = (e) => {
  //   e.preventDefault();
  //   console.log('Sign in attempt:', { email: formData.email, password: formData.password });
  // };

  const handleSignIn = (e) => {
    e.preventDefault();
    
    
    if (!formData.email || !formData.password) {
      alert('Please fill in all fields');
      return;
    }
    
   
    console.log('Login successful for:', formData.email);
    
    
    navigate('/dashboard');
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    console.log('Sign up attempt:', formData);
  };

  const switchToSignUp = () => {
    setIsSignUp(true);
    setFormData({
      name: '',
      email: '',
      mobile: '',
      role: 'consumer',
      password: '',
      confirmPassword: ''
    });
  };

  const switchToSignIn = () => {
    setIsSignUp(false);
    setFormData({
      name: '',
      email: '',
      mobile: '',
      role: 'consumer',
      password: '',
      confirmPassword: ''
    });
  };

  const features = [
    "Track your crops in real-time",
    "Manage inventory efficiently",
    "Generate QR codes for products"
  ];

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        
       
        <div className={`welcome-panel ${isSignUp ? 'slide-right' : ''}`}>
          <div className="welcome-content">
            <div className="brand-section">
              <div className="brand-logo">
                <div className="logo-icon">
                  <img src={farmchainxLogo} alt="FarmChainX logo" />
                </div>
                <span className="brand-name">FarmChainX</span>
              </div>
              <p className="brand-tagline">Smart Farming Management Platform</p>
            </div>
            
            {!isSignUp ? (
              <div className="welcome-info">
                <h2>Welcome Back!</h2>
                <p>Continue your farming journey with us. Access your dashboard and manage your crops efficiently.</p>
                
                <div className="feature-list">
                  {features.map((feature, index) => (
                    <div key={index} className="feature-item">
                      <Check size={16} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                
                <button className="switch-btn" onClick={switchToSignUp}>
                  <span>New to FarmChainX?</span>
                  <strong>SIGN UP</strong>
                  <ArrowRight size={16} />
                </button>
              </div>
            ) : (
              <div className="welcome-info">
                <h2>Join FarmChainX!</h2>
                <p>Start your smart farming journey today. Get access to powerful tools and insights.</p>
                
                <div className="feature-list">
                  {features.map((feature, index) => (
                    <div key={index} className="feature-item">
                      <Check size={16} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                
                <button className="switch-btn" onClick={switchToSignIn}>
                  <span>Already have an account?</span>
                  <strong>SIGN IN</strong>
                  <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>

        
        <div className={`form-panel ${isSignUp ? 'slide-left' : ''}`}>
          <div className="form-content">
            {!isSignUp ? (
              
              <div className="form-container">
                <div className="form-header">
                  <h2 className="form-title">Sign In</h2>
                  <p className="form-subtitle">Access your farming dashboard</p>
                </div>
                
                <div className="social-login">
                  <button className="social-btn google">
                    <svg width="20" height="20" viewBox="0 0 24 24">
                      <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </button>
                </div>
                
                <div className="divider">
                  <span>or sign in with email</span>
                </div>
                
                <form onSubmit={handleSignIn}>
                  <div className="input-group">
                    <div className="input-wrapper">
                      <Mail className="input-icon" size={20} />
                      <input
                        type="email"
                        name="email"
                        placeholder="Email address"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="input-group">
                    <div className="input-wrapper">
                      <Lock className="input-icon" size={20} />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="form-options">
                    <label className="checkbox-wrapper">
                      <input type="checkbox" />
                      <span className="checkmark"></span>
                      Remember me
                    </label>
                    <Link to="/forgot-password" className="forgot-link">
                      Forgot Password?
                    </Link>
                  </div>
                  
                  
                    <button type="submit" className="submit-btn" onClick={handleSignIn}>
                      Sign In 
                      <ArrowRight size={16} />
                    </button>
                 
                </form>
              </div>
            ) : (
              
              <div className="form-container">
                <div className="form-header">
                  <h2 className="form-title">Create Account</h2>
                  <p className="form-subtitle">Join the smart farming revolution</p>
                </div>
                
                <div className="social-login">
                  <button className="social-btn google">
                    <svg width="20" height="20" viewBox="0 0 24 24">
                      <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Sign up with Google
                  </button>
                </div>
                
                <div className="divider">
                  <span>or create account with email</span>
                </div>
                
                <form onSubmit={handleSignUp}>
                  <div className="form-row">
                    <div className="input-group">
                      <div className="input-wrapper">
                        <User className="input-icon" size={20} />
                        <input
                          type="text"
                          name="name"
                          placeholder="Full name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="input-group">
                      <div className="input-wrapper">
                        <Mail className="input-icon" size={20} />
                        <input
                          type="email"
                          name="email"
                          placeholder="Email address"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="input-group">
                      <div className="input-wrapper">
                        <Phone className="input-icon" size={20} />
                        <input
                          type="tel"
                          name="mobile"
                          placeholder="Mobile number"
                          value={formData.mobile}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="input-group">
                      <div className="input-wrapper">
                        <Shield className="input-icon" size={20} />
                        <select
                          name="role"
                          value={formData.role}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="consumer">Consumer</option>
                          <option value="farmer">Farmer</option>
                          <option value="distributor">Distributor</option>
                          <option value="retailer">Retailer</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="input-group">
                      <div className="input-wrapper">
                        <Lock className="input-icon" size={20} />
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="Password"
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                        />
                        <button
                          type="button"
                          className="password-toggle"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>
                    
                    <div className="input-group">
                      <div className="input-wrapper">
                        <Lock className="input-icon" size={20} />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          placeholder="Confirm password"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          required
                        />
                        <button
                          type="button"
                          className="password-toggle"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="terms-agreement">
                    <label className="checkbox-wrapper">
                      <input type="checkbox" required />
                      <span className="checkmark"></span>
                      I agree to the <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>
                    </label>
                  </div>
                  
                  <button type="submit" className="submit-btn">
                    Create Account
                    <ArrowRight size={16} />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
      
     
      <div className="auth-footer">
        <p>&copy; 2025 FarmChainX. All rights reserved.</p>
        <div className="footer-links">
          <Link to="/help">Help</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/about">About</Link>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
