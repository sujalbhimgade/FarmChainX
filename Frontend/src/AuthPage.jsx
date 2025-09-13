import React, { useState } from "react";
import "./AuthPage.css";
import farmchainxLogo from "./assets/farmchainxLogo.png";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, User, Mail, Phone, Lock, Shield, ArrowRight, Check } from "lucide-react";

// import API wrappers (make sure these files exist as described)
import { signin, signup, me } from "./api/auth";

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const strongPwd = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,}$/;
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    roles: ["CONSUMER"], // backend expects uppercase role names as an array
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // special handling for role select -> uppercase single-selection array
    if (name === "roles") {
      setFormData((s) => ({ ...s, roles: [value.toUpperCase()] }));
      return;
    }
    setFormData((s) => ({ ...s, [name]: value }));
  };

  

  const handleSignIn = async (e) => {
    e.preventDefault();

    
    if (!formData.email || !formData.password) {
      alert("Please fill in all fields");
      return;
    }
    if (!strongPwd.test(formData.password)) {
      alert("Invalid password format.");
      return;
      }
    try {
      // 1) Authenticate and store tokens
      await signin(formData.email, formData.password);
      // 2) Load profile
      const profile = await me(); // { fullName, email, mobile, roles }
      const roles = profile.roles || [];


      // 3) Navigate by role
      if (roles.includes("ADMIN")) navigate("/admin");
      else if (roles.includes("FARMER")) navigate("/farmer");
      else if (roles.includes("DISTRIBUTOR")) navigate("/distributor");
      else if (roles.includes("RETAILER")) navigate("/retailer");
      else if (roles.includes("CONSUMER")) navigate("/consumer");
      else navigate("/dashboard");
    } catch (err) {
      alert(err?.response?.data?.message || "Sign in failed");
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (!strongPwd.test(formData.password)) {
    alert("Password must be 8+ chars with upper, lower, number, and special (e.g., User@124).");
     return;
     }

    try {
      await signup({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        mobile: formData.mobile,
        roles: formData.roles, // array, uppercase
      });
      alert("Registered successfully. Please sign in.");
      switchToSignIn();
    } catch (err) {
      alert(err?.response?.data?.message || "Sign up failed");
    }
  };

  const switchToSignUp = () => {
    setIsSignUp(true);
    setFormData({
      fullName: "",
      email: "",
      mobile: "",
      roles: ["CONSUMER"],
      password: "",
      confirmPassword: "",
    });
  };

  const switchToSignIn = () => {
    setIsSignUp(false);
    setFormData({
      fullName: "",
      email: "",
      mobile: "",
      roles: ["CONSUMER"],
      password: "",
      confirmPassword: "",
    });
  };

  const features = [
    "Track your crops in real-time",
    "Manage inventory efficiently",
    "Generate QR codes for products",
  ];

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className={`welcome-panel ${isSignUp ? "slide-right" : ""}`}>
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
                <p>
                  Continue your farming journey with us. Access your dashboard and manage your crops efficiently.
                </p>

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

        <div className={`form-panel ${isSignUp ? "slide-left" : ""}`}>
          <div className="form-content">
            {!isSignUp ? (

              <div className="form-container">
                <div className="form-header">
                  <h2 className="form-title">Sign In</h2>
                  <p className="form-subtitle">Access your farming dashboard</p>
                </div>

                <div className="divider">
                  <span>Sign in with email</span>
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

                  <button type="submit" className="submit-btn">
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

                <div className="divider">
                  <span>Sign up with email</span>
                </div>

                <form onSubmit={handleSignUp}>
                  <div className="form-row">
                    <div className="input-group">
                      <div className="input-wrapper">
                        <User className="input-icon" size={20} />
                        <input
                          type="text"
                          name="fullName"
                          placeholder="Full name"
                          value={formData.fullName}
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
                          name="roles"
                          value={formData.roles}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="CONSUMER">Consumer</option>
                          <option value="FARMER">Farmer</option>
                          <option value="DISTRIBUTOR">Distributor</option>
                          <option value="RETAILER">Retailer</option>
                          <option value="ADMIN">Admin</option>
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
                        />
                      </div>
                    </div>
                  </div>

                  <div className="terms-agreement">
                    <label className="checkbox-wrapper">
                      <input type="checkbox" required />
                      <span className="checkmark"></span>
                      I agree to the <Link to="/terms">Terms of Service</Link> and{" "}
                      <Link to="/privacy">Privacy Policy</Link>
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
