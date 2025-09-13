import React, { useState, useEffect } from 'react';
import { 
  QrCode, ShoppingCart, Star, History, Search, Bell, Menu, LogOut, 
  Home, Shield, Eye, BookOpen, Award, MapPin, Calendar, Users, 
  Settings, Download, User, Package, TrendingUp, CheckCircle,
  AlertCircle, Info, Heart, Share2, Camera
} from 'lucide-react';
import './ConsumerDashboard.css';
import farmchainxLogo from './assets/farmchainxLogo.png';

const ConsumerDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [scannedProducts, setScannedProducts] = useState([]);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [qrScannerActive, setQrScannerActive] = useState(false);

  // Mock consumer profile
  const [consumerProfile] = useState({
    name: 'Consumer',
    email: 'consumer@example.com',
    location: 'Mumbai, Maharashtra',
    joinDate: '2024-01-15',
    avatar: null
  });

  // Mock data for demonstration
  useEffect(() => {
    // Mock scanned products data
    setScannedProducts([
      { 
        id: 'BATCH-2024-001', 
        productName: 'Organic Wheat',
        farmer: 'Rajesh Kumar',
        farmLocation: 'Nashik, MH',
        harvestDate: '2024-02-15',
        pesticidesUsed: 'Organic only - No synthetic chemicals',
        certifications: ['Organic', 'Non-GMO'],
        quality: 'Grade A',
        scanDate: '2024-03-01',
        rating: 4.8,
        reviews: 24,
        nutritionScore: 85,
        image: null
      },
      { 
        id: 'BATCH-2024-002', 
        productName: 'Fresh Tomatoes',
        farmer: 'Priya Sharma',
        farmLocation: 'Aurangabad, MH',
        harvestDate: '2024-02-28',
        pesticidesUsed: 'IPM compliant - Minimal use',
        certifications: ['Fresh', 'Locally Grown'],
        quality: 'Premium',
        scanDate: '2024-03-02',
        rating: 4.5,
        reviews: 18,
        nutritionScore: 92,
        image: null
      },
      { 
        id: 'BATCH-2024-003', 
        productName: 'Basmati Rice',
        farmer: 'Amit Patel',
        farmLocation: 'Nagpur, MH',
        harvestDate: '2024-01-20',
        pesticidesUsed: 'Certified organic practices',
        certifications: ['Organic', 'Export Quality'],
        quality: 'Premium',
        scanDate: '2024-02-25',
        rating: 4.9,
        reviews: 32,
        nutritionScore: 78,
        image: null
      }
    ]);

    // Mock purchase history
    setPurchaseHistory([
      { id: 'PUR001', product: 'Organic Wheat', quantity: '5 kg', date: '2024-03-01', price: '₹275', status: 'delivered' },
      { id: 'PUR002', product: 'Fresh Tomatoes', quantity: '2 kg', date: '2024-03-02', price: '₹120', status: 'delivered' },
      { id: 'PUR003', product: 'Basmati Rice', quantity: '10 kg', date: '2024-02-25', price: '₹850', status: 'shipped' }
    ]);

    // Mock favorite products
    setFavoriteProducts([
      { id: 'FAV001', product: 'Organic Wheat', farmer: 'Rajesh Kumar' },
      { id: 'FAV002', product: 'Basmati Rice', farmer: 'Amit Patel' }
    ]);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isConsumerAuthenticated');
    console.log('Consumer logged out successfully');
    // Navigate to login
  };

  // Consumer menu items
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'scan', label: 'QR Scanner', icon: QrCode },
    { id: 'products', label: 'Verified Products', icon: Shield },
    { id: 'history', label: 'Purchase History', icon: History },
    { id: 'favorites', label: 'My Favorites', icon: Heart },
    { id: 'education', label: 'Learn & Tips', icon: BookOpen },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  // Calculate consumer stats
  const consumerStats = {
    totalScans: scannedProducts.length,
    verifiedProducts: scannedProducts.filter(p => p.certifications.length > 0).length,
    totalPurchases: purchaseHistory.length,
    favoriteProducts: favoriteProducts.length,
    avgRating: scannedProducts.reduce((sum, p) => sum + p.rating, 0) / scannedProducts.length || 0,
    organicProducts: scannedProducts.filter(p => p.certifications.includes('Organic')).length
  };

  const getCertificationBadge = (cert) => {
    const certClass = {
      'Organic': 'cert-organic',
      'Non-GMO': 'cert-non-gmo',
      'Fresh': 'cert-fresh',
      'Locally Grown': 'cert-local',
      'Export Quality': 'cert-premium'
    }[cert] || 'cert-default';
    
    return (
      <span className={`cert-badge ${certClass}`}>
        <Award size={12} />
        {cert}
      </span>
    );
  };

  const getQualityBadge = (quality) => {
    const qualityClass = {
      'Grade A': 'quality-a',
      'Premium': 'quality-premium',
      'Standard': 'quality-standard'
    }[quality] || 'quality-standard';
    
    return (
      <span className={`quality-badge ${qualityClass}`}>
        {quality}
      </span>
    );
  };

  const getPurchaseStatusBadge = (status) => {
    const statusClass = {
      'delivered': 'status-delivered',
      'shipped': 'status-shipped',
      'processing': 'status-processing'
    }[status] || 'status-processing';
    
    return (
      <span className={`status-badge ${statusClass}`}>
        {status}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const handleQRScan = () => {
    setQrScannerActive(true);
    // Simulate QR scan after 2 seconds
    setTimeout(() => {
      setQrScannerActive(false);
      // Add mock scanned product
      const newProduct = {
        id: 'BATCH-2024-' + String(Date.now()).slice(-3),
        productName: 'Fresh Spinach',
        farmer: 'Sunita Singh',
        farmLocation: 'Solapur, MH',
        harvestDate: '2024-03-05',
        pesticidesUsed: 'Organic certified',
        certifications: ['Organic', 'Fresh'],
        quality: 'Premium',
        scanDate: new Date().toISOString().split('T')[0],
        rating: 4.7,
        reviews: 15,
        nutritionScore: 95,
        image: null
      };
      setScannedProducts(prev => [newProduct, ...prev]);
      setActiveSection('products');
    }, 2000);
  };

  const renderDashboardContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="dashboard-content">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <QrCode size={24} />
                </div>
                <div className="stat-info">
                  <div className="stat-value">{consumerStats.totalScans}</div>
                  <div className="stat-label">Products Scanned</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <Shield size={24} />
                </div>
                <div className="stat-info">
                  <div className="stat-value">{consumerStats.verifiedProducts}</div>
                  <div className="stat-label">Verified Products</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <ShoppingCart size={24} />
                </div>
                <div className="stat-info">
                  <div className="stat-value">{consumerStats.totalPurchases}</div>
                  <div className="stat-label">Total Purchases</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <Heart size={24} />
                </div>
                <div className="stat-info">
                  <div className="stat-value">{consumerStats.favoriteProducts}</div>
                  <div className="stat-label">Favorite Products</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <Star size={24} />
                </div>
                <div className="stat-info">
                  <div className="stat-value">{consumerStats.avgRating.toFixed(1)}</div>
                  <div className="stat-label">Average Rating</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <Award size={24} />
                </div>
                <div className="stat-info">
                  <div className="stat-value">{consumerStats.organicProducts}</div>
                  <div className="stat-label">Organic Products</div>
                </div>
              </div>
            </div>

            <div className="dashboard-grid">
              <div className="dashboard-card">
                <h3>Recent Scans</h3>
                <div className="activity-list">
                  {scannedProducts.slice(0, 3).map(product => (
                    <div key={product.id} className="activity-item">
                      <QrCode size={16} />
                      <span>Verified {product.productName} from {product.farmer}</span>
                      <span className="activity-time">{formatDate(product.scanDate)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="dashboard-card">
                <h3>Quick Actions</h3>
                <div className="quick-actions">
                  <button className="quick-action-btn" onClick={handleQRScan}>
                    <QrCode size={20} />
                    <span>Scan Product</span>
                  </button>
                  <button className="quick-action-btn" onClick={() => setActiveSection('history')}>
                    <History size={20} />
                    <span>View History</span>
                  </button>
                  <button className="quick-action-btn" onClick={() => setActiveSection('favorites')}>
                    <Heart size={20} />
                    <span>My Favorites</span>
                  </button>
                  <button className="quick-action-btn" onClick={() => setActiveSection('education')}>
                    <BookOpen size={20} />
                    <span>Learn More</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'scan':
        return (
          <div className="scanner-content">
            <div className="header">
              <h1>QR Code Scanner</h1>
            </div>
            
            <div className="scanner-container">
              {qrScannerActive ? (
                <div className="scanner-active">
                  <div className="scanner-frame">
                    <div className="scanning-animation"></div>
                    <p>Scanning QR Code...</p>
                  </div>
                </div>
              ) : (
                <div className="scanner-inactive">
                  <QrCode size={80} />
                  <h3>Scan Product QR Code</h3>
                  <p>Point your camera at the QR code on any agricultural product to verify its authenticity and view detailed information.</p>
                  <button className="btn btn-primary scanner-btn" onClick={handleQRScan}>
                    <Camera size={20} />
                    Start Scanning
                  </button>
                </div>
              )}
            </div>
          </div>
        );

      case 'products':
        return (
          <>
            <div className="header">
              <h1>Verified Products</h1>
              <div className="header-actions">
                <button className="btn btn-secondary">
                  <Download size={16} />
                  Export Report
                </button>
              </div>
            </div>

            <div className="products-grid">
              {scannedProducts.map((product) => (
                <div key={product.id} className="product-card">
                  <div className="product-header">
                    <div className="product-image-placeholder">
                      <Package size={40} />
                    </div>
                    <div className="product-info">
                      <h3>{product.productName}</h3>
                      <p className="farmer-name">by {product.farmer}</p>
                      <div className="rating">
                        <Star size={16} fill="currentColor" />
                        <span>{product.rating}</span>
                        <span className="reviews">({product.reviews} reviews)</span>
                      </div>
                    </div>
                  </div>

                  <div className="product-details">
                    <div className="detail-item">
                      <MapPin size={14} />
                      <span>{product.farmLocation}</span>
                    </div>
                    <div className="detail-item">
                      <Calendar size={14} />
                      <span>Harvested: {formatDate(product.harvestDate)}</span>
                    </div>
                    <div className="detail-item">
                      <Shield size={14} />
                      <span>{product.pesticidesUsed}</span>
                    </div>
                  </div>

                  <div className="certifications">
                    {product.certifications.map(cert => getCertificationBadge(cert))}
                    {getQualityBadge(product.quality)}
                  </div>

                  <div className="nutrition-score">
                    <div className="score-label">Nutrition Score</div>
                    <div className="score-bar">
                      <div 
                        className="score-fill" 
                        style={{width: `${product.nutritionScore}%`}}
                      ></div>
                    </div>
                    <div className="score-value">{product.nutritionScore}/100</div>
                  </div>

                  <div className="product-actions">
                    <button className="btn btn-small btn-edit">
                      <Eye size={12} />
                      Details
                    </button>
                    <button className="btn btn-small btn-qr">
                      <Heart size={12} />
                      Favorite
                    </button>
                    <button className="btn btn-small btn-secondary">
                      <Share2 size={12} />
                      Share
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        );

      case 'history':
        return (
          <>
            <div className="header">
              <h1>Purchase History</h1>
              <div className="header-actions">
                <button className="btn btn-secondary">
                  <Download size={16} />
                  Download Invoice
                </button>
              </div>
            </div>

            <div className="crops-table">
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>Date</th>
                      <th>Price</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchaseHistory.map((purchase) => (
                      <tr key={purchase.id}>
                        <td>{purchase.id}</td>
                        <td>{purchase.product}</td>
                        <td>{purchase.quantity}</td>
                        <td>{formatDate(purchase.date)}</td>
                        <td>{purchase.price}</td>
                        <td>{getPurchaseStatusBadge(purchase.status)}</td>
                        <td>
                          <div className="action-buttons">
                            <button className="btn btn-small btn-edit">
                              <Eye size={12} />
                            </button>
                            <button className="btn btn-small btn-secondary">
                              <Download size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        );

      case 'favorites':
        return (
          <>
            <div className="header">
              <h1>My Favorites</h1>
            </div>

            <div className="favorites-grid">
              {favoriteProducts.map((fav) => (
                <div key={fav.id} className="favorite-item">
                  <Heart size={20} fill="currentColor" className="favorite-icon" />
                  <div className="favorite-info">
                    <h3>{fav.product}</h3>
                    <p>by {fav.farmer}</p>
                  </div>
                  <button className="btn btn-small btn-primary">
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </>
        );

      case 'education':
        return (
          <div className="education-content">
            <h2>Learn & Tips</h2>
            <div className="education-placeholder">
              <BookOpen size={64} />
              <p>Educational content coming soon...</p>
              <p>Learn about organic farming, nutrition facts, and sustainable agriculture.</p>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="settings-content">
            <h2>Settings</h2>
            <div className="settings-placeholder">
              <Settings size={64} />
              <p>Settings panel coming soon...</p>
              <p>Customize notifications, preferences, and privacy settings.</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="farmer-dashboard">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-section">
            <img src={farmchainxLogo} alt="FarmChainX" className="sidebar-logo" />
            {!sidebarCollapsed && <span className="logo-text">FarmChainX Consumer</span>}
          </div>
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            <Menu size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => setActiveSection(item.id)}
            >
              <item.icon size={20} />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Header */}
        <div className="top-header">
          <div className="header-left">
            <h1>{menuItems.find(item => item.id === activeSection)?.label || 'Dashboard'}</h1>
          </div>
          
          <div className="header-right">
            <button className="notification-btn">
              <Bell size={20} />
              <span className="notification-badge">2</span>
            </button>
            
            <div className="profile-section">
              <div className="profile-info">
                <span className="profile-name">{consumerProfile.name}</span>
                <span className="profile-subtitle">Verified Consumer</span>
              </div>
              <div className="profile-avatar">
                <User size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="content-area">
          <div className="container">
            {renderDashboardContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsumerDashboard;
