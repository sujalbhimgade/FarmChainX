import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Phone, Lock, Shield, ArrowRight, Check } from 'lucide-react';
import './AuthPage.css';
import farmchainxLogo from './assets/farmchainxLogo.png';
import apiService from './conc/api'; // ✅ Fixed import path

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const strongPwd = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,}$/;

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    roles: ['CONSUMER'],
    password: '',
    confirmPassword: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (error) setError(null);

    if (name === 'roles') {
      setFormData(s => ({ ...s, roles: [value.toUpperCase()] }));
      return;
    }
    setFormData(s => ({ ...s, [name]: value }));
  };

  const handleSignIn = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      // Handle backend AuthResponse format
      const authResponse = await apiService.login(formData.email, formData.password);
      if (authResponse.accessToken) { // backend uses 'accessToken'
        localStorage.setItem('authToken', authResponse.accessToken);
        localStorage.setItem('isAuthenticated', 'true');
      }

      let profile = authResponse.user || authResponse;

      if (!profile.roles) {
        try {
          profile = await apiService.getProfile();
        } catch (profileError) {
          console.error('Profile fetch failed:', profileError);
          profile = { roles: ['CONSUMER'], id: 'user1', name: formData.email };
        }
      }

      localStorage.setItem('userData', JSON.stringify({
        id: profile.id || 'user1',
        name: profile.fullName || profile.name || 'User',
        email: profile.email || formData.email,
        mobile: profile.mobile || '',
        roles: profile.roles || ['CONSUMER'],
        farmName: profile.farmName || '',
        location: profile.location || ''
      }));

      const roles = profile.roles || ['CONSUMER'];

      if (roles.includes('ADMIN')) {
        navigate('/admin');
      } else if (roles.includes('FARMER')) {
        navigate('/farmer');
      } else if (roles.includes('DISTRIBUTOR')) {
        navigate('/distributor');
      } else if (roles.includes('RETAILER')) {
        navigate('/retailer');
      } else {
        navigate('/farmer');
      }

    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid email or password. Please try again.');

      if (err.message.includes('HTTP error') || err.message.includes('Failed to fetch')) {
        const demoConfirm = window.confirm(
          'Backend server unavailable. Would you like to access the demo version?'
        );

        if (demoConfirm) {
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('userData', JSON.stringify({
            id: 'demo-user',
            name: 'Demo User',
            email: formData.email,
            roles: ['FARMER'],
            farmName: 'Demo Farm',
            location: 'Demo Location'
          }));
          navigate('/farmer');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.mobile || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!strongPwd.test(formData.password)) {
      setError('Password must be 8+ chars with upper, lower, number, and special character.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await apiService.register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        mobile: formData.mobile,
        roles: formData.roles,
      });

      alert('Registration successful! Please sign in.');
      switchToSignIn();

    } catch (err) {
      console.error('Registration error:', err);
      setError('Registration failed. Please try again.');

      if (err.message.includes('HTTP error') || err.message.includes('Failed to fetch')) {
        const demoConfirm = window.confirm(
          'Backend server unavailable. Would you like to register for demo access?'
        );

        if (demoConfirm) {
          alert('Demo registration successful! Please sign in.');
          switchToSignIn();
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const switchToSignUp = () => {
    setIsSignUp(true);
    setError(null);
    setFormData({
      fullName: '',
      email: '',
      mobile: '',
      roles: ['CONSUMER'],
      password: '',
      confirmPassword: '',
    });
  };

  const switchToSignIn = () => {
    setIsSignUp(false);
    setError(null);
    setFormData({
      fullName: '',
      email: '',
      mobile: '',
      roles: ['CONSUMER'],
      password: '',
      confirmPassword: '',
    });
  };

  const features = [
    'Track your crops in real-time',
    'Manage inventory efficiently',
    'Generate QR codes for products',
  ];

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        {/* Welcome Panel */}
        <div className={`welcome-panel ${isSignUp ? 'slide-right' : ''}`}>
          <div className="welcome-content">
            <div className="brand-section">
              <div className="brand-logo">
                <div className="logo-container">
                  <img src={farmchainxLogo} alt="FarmChainX Logo" />
                </div>
                <div className="brand-name">FarmChainX</div>
              </div>
              <div className="brand-tagline">Smart Farming Management Platform</div>
            </div>

            <div className="welcome-info">
              <h2>{isSignUp ? 'Start your smart farming journey today' : 'Continue your farming journey with us'}</h2>
              <p>
                {isSignUp
                  ? 'Get access to powerful tools and insights for modern agriculture.'
                  : 'Access your dashboard and manage your crops efficiently.'}
              </p>

              <div className="feature-list">
                {features.map((feature, index) => (
                  <div key={index} className="feature-item">
                    <Check size={14} />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <button className="switch-btn" onClick={isSignUp ? switchToSignIn : switchToSignUp}>
                <span>{isSignUp ? 'Already have an account?' : 'New to FarmChainX?'}</span>
                <strong>{isSignUp ? 'Sign In' : 'Join Now'}</strong>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Form Panel */}
        <div className={`form-panel ${isSignUp ? 'slide-left' : ''}`}>
          <div className="form-content">
            <div className="form-container">
              <div className="form-header">
                <h1 className="form-title">
                  {isSignUp ? 'Create Account' : 'Welcome Back'}
                </h1>
                <p className="form-subtitle">
                  {isSignUp
                    ? 'Join the smart farming revolution'
                    : 'Access your farming dashboard'}
                </p>
              </div>

              {error && (
                <div style={{
                  padding: '12px',
                  backgroundColor: '#fee2e2',
                  border: '1px solid #fca5a5',
                  borderRadius: '8px',
                  color: '#dc2626',
                  fontSize: '14px',
                  marginBottom: '16px',
                  textAlign: 'center'
                }}>
                  {error}
                </div>
              )}

              <form onSubmit={isSignUp ? handleSignUp : handleSignIn}>
                {isSignUp && (
                  <>
                    <div className="form-row">
                      <div className="input-group">
                        <div className="input-wrapper">
                          <User size={18} className="input-icon" />
                          <input
                            type="text"
                            name="fullName"
                            placeholder="Full Name"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="input-group">
                        <div className="input-wrapper">
                          <Phone size={18} className="input-icon" />
                          <input
                            type="tel"
                            name="mobile"
                            placeholder="Mobile Number"
                            value={formData.mobile}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="input-group">
                      <div className="input-wrapper">
                        <Shield size={18} className="input-icon" />
                        <select
                          name="roles"
                          value={formData.roles[0]?.toLowerCase() || 'consumer'}
                          onChange={(e) => handleInputChange({
                            target: { name: 'roles', value: e.target.value }
                          })}
                          required
                        >
                          <option value="consumer">Consumer</option>
                          <option value="farmer">Farmer</option>
                          <option value="distributor">Distributor</option>
                          <option value="retailer">Retailer</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}

                <div className="input-group">
                  <div className="input-wrapper">
                    <Mail size={18} className="input-icon" />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="input-group">
                  <div className="input-wrapper">
                    <Lock size={18} className="input-icon" />
                    <input
                      type={showPassword ? 'text' : 'password'}
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
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {isSignUp && (
                  <div className="input-group">
                    <div className="input-wrapper">
                      <Lock size={18} className="input-icon" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                )}

                {!isSignUp && (
                  <div className="form-options">
                    <label className="checkbox-wrapper">
                      <input type="checkbox" />
                      <span>Remember me</span>
                    </label>
                    <Link to="/forgot-password" className="forgot-link">
                      Forgot password?
                    </Link>
                  </div>
                )}

                {isSignUp && (
                  <div className="terms-agreement">
                    <label className="checkbox-wrapper">
                      <input type="checkbox" required />
                      <span>
                        I agree to the{' '}
                        <Link to="/terms">Terms of Service</Link> and{' '}
                        <Link to="/privacy">Privacy Policy</Link>
                      </span>
                    </label>
                  </div>
                )}

                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? (
                    <>
                      <div style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid #ffffff',
                        borderTop: '2px solid transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        marginRight: '8px'
                      }}></div>
                      {isSignUp ? 'Creating Account...' : 'Signing In...'}
                    </>
                  ) : (
                    <>
                      {isSignUp ? 'Create Account' : 'Sign In'}
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-footer">
        <div>© 2025 FarmChainX. All rights reserved.</div>
        <div className="footer-links">
          <Link to="/help">Help</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
