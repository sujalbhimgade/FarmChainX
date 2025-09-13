import React, { useState, useEffect } from 'react';
import { 
  Truck, Package, MapPin, AlertTriangle, CheckCircle, Clock, 
  Search, Filter, Eye, Download, Bell, Menu, LogOut, Home,
  BarChart3, Settings, Navigation, Warehouse, TrendingUp,
  Calendar, Users, User, Shield, RefreshCw
} from 'lucide-react';
import './DistributorDashboard.css';
import farmchainxLogo from './assets/farmchainxLogo.png';

const DistributorDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [shipments, setShipments] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [filters, setFilters] = useState({
    status: '',
    destination: '',
    search: ''
  });

  // Mock distributor profile
  const [distributorProfile] = useState({
    name: 'Distributor',
    company: 'AgriDistribute Solutions',
    location: 'Mumbai, Maharashtra',
    license: 'DIST-2024-MH-001',
    avatar: null
  });

  // Mock data for demonstration
  useEffect(() => {
    // Mock shipments data
    setShipments([
      { 
        id: 'SH001', 
        batchId: 'BATCH-2024-001', 
        product: 'Organic Wheat', 
        farmer: 'Rajesh Kumar',
        quantity: '500 kg',
        status: 'in-transit', 
        origin: 'Nashik, MH',
        destination: 'Mumbai, MH',
        dispatchDate: '2024-03-01',
        expectedDelivery: '2024-03-03',
        currentLocation: 'Pune, MH',
        temperature: '22°C',
        humidity: '65%'
      },
      { 
        id: 'SH002', 
        batchId: 'BATCH-2024-002', 
        product: 'Fresh Tomatoes', 
        farmer: 'Priya Sharma',
        quantity: '200 kg',
        status: 'delivered', 
        origin: 'Aurangabad, MH',
        destination: 'Pune, MH',
        dispatchDate: '2024-02-28',
        expectedDelivery: '2024-03-01',
        currentLocation: 'Pune, MH',
        temperature: '18°C',
        humidity: '70%'
      },
      { 
        id: 'SH003', 
        batchId: 'BATCH-2024-003', 
        product: 'Rice', 
        farmer: 'Amit Patel',
        quantity: '1000 kg',
        status: 'pending', 
        origin: 'Nagpur, MH',
        destination: 'Thane, MH',
        dispatchDate: '2024-03-05',
        expectedDelivery: '2024-03-07',
        currentLocation: 'Nagpur, MH',
        temperature: '25°C',
        humidity: '60%'
      },
      { 
        id: 'SH004', 
        batchId: 'BATCH-2024-004', 
        product: 'Cotton', 
        farmer: 'Sunita Singh',
        quantity: '750 kg',
        status: 'delayed', 
        origin: 'Solapur, MH',
        destination: 'Mumbai, MH',
        dispatchDate: '2024-02-25',
        expectedDelivery: '2024-02-28',
        currentLocation: 'Satara, MH',
        temperature: '28°C',
        humidity: '55%'
      }
    ]);

    // Mock inventory data
    setInventory([
      { id: 'INV001', product: 'Organic Wheat', quantity: '2500 kg', location: 'Warehouse A', status: 'available' },
      { id: 'INV002', product: 'Fresh Tomatoes', quantity: '800 kg', location: 'Cold Storage B', status: 'low-stock' },
      { id: 'INV003', product: 'Rice', quantity: '5000 kg', location: 'Warehouse C', status: 'available' },
      { id: 'INV004', product: 'Cotton', quantity: '100 kg', location: 'Warehouse A', status: 'critical' }
    ]);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isDistributorAuthenticated');
    console.log('Distributor logged out successfully');
    // Navigate to login
  };

  // Distributor menu items
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'shipments', label: 'Shipment Tracking', icon: Truck },
    { id: 'inventory', label: 'Inventory Management', icon: Package },
    { id: 'logistics', label: 'Logistics Hub', icon: Navigation },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  // Calculate distributor stats
  const distributorStats = {
    totalShipments: shipments.length,
    inTransit: shipments.filter(ship => ship.status === 'in-transit').length,
    delivered: shipments.filter(ship => ship.status === 'delivered').length,
    delayed: shipments.filter(ship => ship.status === 'delayed').length,
    totalInventory: inventory.reduce((sum, item) => sum + parseInt(item.quantity), 0),
    lowStock: inventory.filter(item => item.status === 'low-stock' || item.status === 'critical').length
  };

  const getShipmentStatusBadge = (status) => {
    const statusClass = {
      'in-transit': 'status-growing',
      'delivered': 'status-harvested', 
      'pending': 'status-planned',
      'delayed': 'status-badge status-delayed'
    }[status] || 'status-planned';
    
    const statusIcon = {
      'in-transit': <Truck size={12} />,
      'delivered': <CheckCircle size={12} />,
      'pending': <Clock size={12} />,
      'delayed': <AlertTriangle size={12} />
    }[status];

    return (
      <span className={`status-badge ${statusClass}`} style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
        {statusIcon}
        {status.replace('-', ' ')}
      </span>
    );
  };

  const getInventoryStatusBadge = (status) => {
    const statusClass = {
      'available': 'status-growing',
      'low-stock': 'status-planned',
      'critical': 'status-delayed'
    }[status] || 'status-growing';
    
    return (
      <span className={`status-badge ${statusClass}`}>
        {status.replace('-', ' ')}
      </span>
    );
  };

  const filteredShipments = shipments.filter(shipment => {
    const matchesStatus = !filters.status || shipment.status === filters.status;
    const matchesDestination = !filters.destination || shipment.destination.toLowerCase().includes(filters.destination.toLowerCase());
    const matchesSearch = !filters.search || 
      shipment.product.toLowerCase().includes(filters.search.toLowerCase()) ||
      shipment.batchId.toLowerCase().includes(filters.search.toLowerCase()) ||
      shipment.farmer.toLowerCase().includes(filters.search.toLowerCase());

    return matchesStatus && matchesDestination && matchesSearch;
  });

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const renderDashboardContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="dashboard-content">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <Truck size={24} />
                </div>
                <div className="stat-info">
                  <div className="stat-value">{distributorStats.totalShipments}</div>
                  <div className="stat-label">Total Shipments</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <Navigation size={24} />
                </div>
                <div className="stat-info">
                  <div className="stat-value">{distributorStats.inTransit}</div>
                  <div className="stat-label">In Transit</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <CheckCircle size={24} />
                </div>
                <div className="stat-info">
                  <div className="stat-value">{distributorStats.delivered}</div>
                  <div className="stat-label">Delivered</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <AlertTriangle size={24} />
                </div>
                <div className="stat-info">
                  <div className="stat-value">{distributorStats.delayed}</div>
                  <div className="stat-label">Delayed</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <Package size={24} />
                </div>
                <div className="stat-info">
                  <div className="stat-value">{distributorStats.totalInventory}</div>
                  <div className="stat-label">Total Inventory (kg)</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <Warehouse size={24} />
                </div>
                <div className="stat-info">
                  <div className="stat-value">{distributorStats.lowStock}</div>
                  <div className="stat-label">Low Stock Alerts</div>
                </div>
              </div>
            </div>

            <div className="dashboard-grid">
              <div className="dashboard-card">
                <h3>Recent Shipment Activities</h3>
                <div className="activity-list">
                  <div className="activity-item">
                    <Truck size={16} />
                    <span>Wheat shipment SH001 departed from Nashik</span>
                    <span className="activity-time">2 hours ago</span>
                  </div>
                  <div className="activity-item">
                    <CheckCircle size={16} />
                    <span>Tomatoes batch delivered to Pune retailer</span>
                    <span className="activity-time">4 hours ago</span>
                  </div>
                  <div className="activity-item">
                    <AlertTriangle size={16} />
                    <span>Cotton shipment delayed due to weather</span>
                    <span className="activity-time">1 day ago</span>
                  </div>
                </div>
              </div>

              <div className="dashboard-card">
                <h3>Logistics Overview</h3>
                <div className="logistics-overview">
                  <div className="logistics-item">
                    <MapPin size={16} />
                    <div>
                      <div className="logistics-label">Active Routes</div>
                      <div className="logistics-value">12</div>
                    </div>
                  </div>
                  <div className="logistics-item">
                    <Truck size={16} />
                    <div>
                      <div className="logistics-label">Fleet Vehicles</div>
                      <div className="logistics-value">8</div>
                    </div>
                  </div>
                  <div className="logistics-item">
                    <Warehouse size={16} />
                    <div>
                      <div className="logistics-label">Warehouses</div>
                      <div className="logistics-value">3</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'shipments':
        return (
          <>
            <div className="header">
              <h1>Shipment Tracking</h1>
              <div className="header-actions">
                <button className="btn btn-secondary">
                  <Download size={16} />
                  Export Report
                </button>
                <button className="btn btn-primary">
                  <RefreshCw size={16} />
                  Refresh Tracking
                </button>
              </div>
            </div>

            <div className="search-filter-bar">
              <select 
                className="filter-select"
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-transit">In Transit</option>
                <option value="delivered">Delivered</option>
                <option value="delayed">Delayed</option>
              </select>
              
              <input 
                type="text"
                className="filter-select"
                placeholder="Filter by destination..."
                value={filters.destination}
                onChange={(e) => setFilters(prev => ({ ...prev, destination: e.target.value }))}
              />

              <div className="search-container">
                <Search size={20} className="search-icon" />
                <input 
                  type="text"
                  className="search-input"
                  placeholder="Search shipments..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                />
              </div>
            </div>

            <div className="crops-table">
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Shipment ID</th>
                      <th>Product</th>
                      <th>Batch ID</th>
                      <th>Farmer</th>
                      <th>Quantity</th>
                      <th>Route</th>
                      <th>Status</th>
                      <th>Expected Delivery</th>
                      <th>Conditions</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredShipments.map((shipment) => (
                      <tr key={shipment.id}>
                        <td>
                          <div className="crop-details">
                            <div className="crop-name">{shipment.id}</div>
                          </div>
                        </td>
                        <td>{shipment.product}</td>
                        <td>{shipment.batchId}</td>
                        <td>{shipment.farmer}</td>
                        <td>{shipment.quantity}</td>
                        <td>
                          <div className="route-info">
                            <div>{shipment.origin}</div>
                            <div style={{fontSize: '12px', color: '#64748b'}}>→ {shipment.destination}</div>
                          </div>
                        </td>
                        <td>{getShipmentStatusBadge(shipment.status)}</td>
                        <td>{formatDate(shipment.expectedDelivery)}</td>
                        <td>
                          <div className="conditions-info">
                            <div style={{fontSize: '12px'}}>{shipment.temperature}</div>
                            <div style={{fontSize: '12px', color: '#64748b'}}>{shipment.humidity}</div>
                          </div>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button className="btn btn-small btn-edit">
                              <Eye size={12} />
                            </button>
                            <button className="btn btn-small btn-qr">
                              <MapPin size={12} />
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

      case 'inventory':
        return (
          <>
            <div className="header">
              <h1>Inventory Management</h1>
              <div className="header-actions">
                <button className="btn btn-secondary">
                  <Download size={16} />
                  Export Inventory
                </button>
              </div>
            </div>

            <div className="crops-table">
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>Location</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventory.map((item) => (
                      <tr key={item.id}>
                        <td>{item.product}</td>
                        <td>{item.quantity}</td>
                        <td>{item.location}</td>
                        <td>{getInventoryStatusBadge(item.status)}</td>
                        <td>
                          <div className="action-buttons">
                            <button className="btn btn-small btn-edit">
                              <Eye size={12} />
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

      case 'logistics':
        return (
          <div className="logistics-content">
            <h2>Logistics Hub</h2>
            <div className="analytics-placeholder">
              <Navigation size={64} />
              <p>Advanced logistics management coming soon...</p>
              <p>Route optimization, fleet management, and real-time GPS tracking.</p>
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className="analytics-content">
            <h2>Distribution Analytics</h2>
            <div className="analytics-placeholder">
              <BarChart3 size={64} />
              <p>Analytics dashboard coming soon...</p>
              <p>Track delivery performance, route efficiency, and customer satisfaction.</p>
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
              <p>Configure notifications, preferences, and system integrations.</p>
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
            {!sidebarCollapsed && <span className="logo-text">FarmChainX Dist</span>}
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
              <span className="notification-badge">4</span>
            </button>
            
            <div className="profile-section">
              <div className="profile-info">
                <span className="profile-name">{distributorProfile.name}</span>
                <span className="profile-subtitle">{distributorProfile.company}</span>
              </div>
              <div className="profile-avatar">
                <Truck size={24} />
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

export default DistributorDashboard;
