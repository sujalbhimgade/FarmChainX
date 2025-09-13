import React, { useState, useEffect } from 'react';
import { 
  Users, UserCheck, UserX, Shield, BarChart3, Settings, 
  FileText, Bell, Menu, LogOut, Home, Sprout, Database,
  TrendingUp, MapPin, Search, Filter, Edit, Trash2, 
  Download, Eye, CheckCircle, XCircle, AlertTriangle,
  Plus, Calendar, Cloud
} from 'lucide-react';
import './AdminDashboard.css';
import farmchainxLogo from './assets/farmchainxLogo.png';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [users, setUsers] = useState([]);
  const [crops, setCrops] = useState([]);
  const [filters, setFilters] = useState({
    userType: '',
    status: '',
    search: ''
  });

  // Mock admin profile
  const [adminProfile] = useState({
    name: 'Admin',
    role: 'System Administrator',
    location: 'FarmChainX HQ',
    avatar: null
  });

  // Mock data for demonstration
  useEffect(() => {
    // Mock users data
    setUsers([
      { id: '1', name: 'Rajesh Kumar', email: 'rajesh@email.com', role: 'farmer', status: 'active', joinDate: '2024-01-15', crops: 12 },
      { id: '2', name: 'Priya Sharma', email: 'priya@email.com', role: 'consumer', status: 'active', joinDate: '2024-02-20', crops: 0 },
      { id: '3', name: 'Amit Patel', email: 'amit@email.com', role: 'farmer', status: 'pending', joinDate: '2024-03-10', crops: 5 },
      { id: '4', name: 'Sunita Singh', email: 'sunita@email.com', role: 'farmer', status: 'suspended', joinDate: '2024-01-25', crops: 8 }
    ]);

    // Mock crops data
    setCrops([
      { id: '1', name: 'Wheat', farmer: 'Rajesh Kumar', status: 'Growing', area: '5.2', submittedDate: '2024-03-01', approved: true },
      { id: '2', name: 'Rice', farmer: 'Amit Patel', status: 'Planted', area: '3.8', submittedDate: '2024-03-05', approved: false },
      { id: '3', name: 'Cotton', farmer: 'Sunita Singh', status: 'Harvested', area: '7.1', submittedDate: '2024-02-28', approved: true }
    ]);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    console.log('Admin logged out successfully');
    // Navigate to login
  };

  // Admin menu items
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'crops', label: 'Crop Oversight', icon: Sprout },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'system', label: 'System Settings', icon: Settings },
    { id: 'support', label: 'Support & Feedback', icon: FileText }
  ];

  // Calculate admin stats
  const adminStats = {
    totalUsers: users.length,
    activeUsers: users.filter(user => user.status === 'active').length,
    pendingApprovals: users.filter(user => user.status === 'pending').length,
    totalCrops: crops.length,
    pendingCrops: crops.filter(crop => !crop.approved).length,
    activeFarms: users.filter(user => user.role === 'farmer' && user.status === 'active').length
  };

  const getUserStatusBadge = (status) => {
    const statusClass = {
      'active': 'status-growing',
      'pending': 'status-planned',
      'suspended': 'status-harvested'
    }[status] || 'status-planned';
    
    return (
      <span className={`status-badge ${statusClass}`}>
        {status}
      </span>
    );
  };

  const approveUser = (userId) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status: 'active' } : user
    ));
  };

  const suspendUser = (userId) => {
    if (window.confirm('Are you sure you want to suspend this user?')) {
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, status: 'suspended' } : user
      ));
    }
  };

  const deleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      setUsers(prev => prev.filter(user => user.id !== userId));
    }
  };

  const approveCrop = (cropId) => {
    setCrops(prev => prev.map(crop => 
      crop.id === cropId ? { ...crop, approved: true } : crop
    ));
  };

  const rejectCrop = (cropId) => {
    if (window.confirm('Are you sure you want to reject this crop entry?')) {
      setCrops(prev => prev.filter(crop => crop.id !== cropId));
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesRole = !filters.userType || user.role === filters.userType;
    const matchesStatus = !filters.status || user.status === filters.status;
    const matchesSearch = !filters.search || 
      user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      user.email.toLowerCase().includes(filters.search.toLowerCase());

    return matchesRole && matchesStatus && matchesSearch;
  });

  const renderDashboardContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="dashboard-content">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <Users size={24} />
                </div>
                <div className="stat-info">
                  <div className="stat-value">{adminStats.totalUsers}</div>
                  <div className="stat-label">Total Users</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <UserCheck size={24} />
                </div>
                <div className="stat-info">
                  <div className="stat-value">{adminStats.activeUsers}</div>
                  <div className="stat-label">Active Users</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <AlertTriangle size={24} />
                </div>
                <div className="stat-info">
                  <div className="stat-value">{adminStats.pendingApprovals}</div>
                  <div className="stat-label">Pending Approvals</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <Sprout size={24} />
                </div>
                <div className="stat-info">
                  <div className="stat-value">{adminStats.totalCrops}</div>
                  <div className="stat-label">Total Crops</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <Database size={24} />
                </div>
                <div className="stat-info">
                  <div className="stat-value">{adminStats.activeFarms}</div>
                  <div className="stat-label">Active Farms</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <FileText size={24} />
                </div>
                <div className="stat-info">
                  <div className="stat-value">{adminStats.pendingCrops}</div>
                  <div className="stat-label">Pending Reviews</div>
                </div>
              </div>
            </div>

            <div className="dashboard-grid">
              <div className="dashboard-card">
                <h3>Recent Activities</h3>
                <div className="activity-list">
                  <div className="activity-item">
                    <UserCheck size={16} />
                    <span>New farmer registration: Rajesh Kumar</span>
                    <span className="activity-time">2 hours ago</span>
                  </div>
                  <div className="activity-item">
                    <Sprout size={16} />
                    <span>Crop submission pending review</span>
                    <span className="activity-time">4 hours ago</span>
                  </div>
                  <div className="activity-item">
                    <Shield size={16} />
                    <span>System security scan completed</span>
                    <span className="activity-time">1 day ago</span>
                  </div>
                </div>
              </div>

              <div className="dashboard-card">
                <h3>System Status</h3>
                <div className="system-status">
                  <div className="status-item">
                    <CheckCircle size={16} className="status-ok" />
                    <span>Database: Online</span>
                  </div>
                  <div className="status-item">
                    <CheckCircle size={16} className="status-ok" />
                    <span>API Services: Running</span>
                  </div>
                  <div className="status-item">
                    <CheckCircle size={16} className="status-ok" />
                    <span>Backup: Up to date</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'users':
        return (
          <>
            <div className="header">
              <h1>User Management</h1>
              <div className="header-actions">
                <button className="btn btn-secondary">
                  <Download size={16} />
                  Export Users
                </button>
                <button className="btn btn-primary">
                  <Plus size={16} />
                  Add User
                </button>
              </div>
            </div>

            <div className="search-filter-bar">
              <select 
                className="filter-select"
                value={filters.userType}
                onChange={(e) => setFilters(prev => ({ ...prev, userType: e.target.value }))}
              >
                <option value="">All User Types</option>
                <option value="farmer">Farmer</option>
                <option value="consumer">Consumer</option>
                <option value="admin">Admin</option>
              </select>
              
              <select 
                className="filter-select"
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
              </select>

              <div className="search-container">
                <Search size={20} className="search-icon" />
                <input 
                  type="text"
                  className="search-input"
                  placeholder="Search users..."
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
                      <th>User</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Join Date</th>
                      <th>Crops</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id}>
                        <td>
                          <div className="crop-info">
                            <div className="crop-image-placeholder">
                              <Users size={20} />
                            </div>
                            <div className="crop-details">
                              <div className="crop-name">{user.name}</div>
                              <div className="crop-notes">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>{user.role}</td>
                        <td>{getUserStatusBadge(user.status)}</td>
                        <td>{new Date(user.joinDate).toLocaleDateString('en-IN')}</td>
                        <td>{user.crops}</td>
                        <td>
                          <div className="action-buttons">
                            <button className="btn btn-small btn-edit">
                              <Eye size={12} />
                            </button>
                            {user.status === 'pending' && (
                              <button 
                                className="btn btn-small btn-edit"
                                onClick={() => approveUser(user.id)}
                              >
                                <CheckCircle size={12} />
                              </button>
                            )}
                            {user.status === 'active' && (
                              <button 
                                className="btn btn-small btn-qr"
                                onClick={() => suspendUser(user.id)}
                              >
                                <UserX size={12} />
                              </button>
                            )}
                            <button 
                              className="btn btn-small btn-delete"
                              onClick={() => deleteUser(user.id)}
                            >
                              <Trash2 size={12} />
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

      case 'crops':
        return (
          <>
            <div className="header">
              <h1>Crop Oversight</h1>
              <div className="header-actions">
                <button className="btn btn-secondary">
                  <Download size={16} />
                  Export Crops
                </button>
              </div>
            </div>

            <div className="crops-table">
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Crop</th>
                      <th>Farmer</th>
                      <th>Status</th>
                      <th>Area</th>
                      <th>Submitted</th>
                      <th>Approval</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {crops.map((crop) => (
                      <tr key={crop.id}>
                        <td>{crop.name}</td>
                        <td>{crop.farmer}</td>
                        <td>
                          <span className="status-badge status-growing">
                            {crop.status}
                          </span>
                        </td>
                        <td>{crop.area} acres</td>
                        <td>{new Date(crop.submittedDate).toLocaleDateString('en-IN')}</td>
                        <td>
                          {crop.approved ? (
                            <CheckCircle size={16} className="status-ok" />
                          ) : (
                            <XCircle size={16} className="status-pending" />
                          )}
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button className="btn btn-small btn-edit">
                              <Eye size={12} />
                            </button>
                            {!crop.approved && (
                              <>
                                <button 
                                  className="btn btn-small btn-edit"
                                  onClick={() => approveCrop(crop.id)}
                                >
                                  <CheckCircle size={12} />
                                </button>
                                <button 
                                  className="btn btn-small btn-delete"
                                  onClick={() => rejectCrop(crop.id)}
                                >
                                  <XCircle size={12} />
                                </button>
                              </>
                            )}
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

      case 'reports':
        return (
          <div className="reports-content">
            <h2>Reports & Analytics</h2>
            <div className="analytics-placeholder">
              <BarChart3 size={64} />
              <p>Advanced analytics coming soon...</p>
              <p>Generate comprehensive reports on users, crops, and system usage.</p>
            </div>
          </div>
        );

      case 'system':
        return (
          <div className="system-content">
            <h2>System Settings</h2>
            <div className="settings-placeholder">
              <Settings size={64} />
              <p>System configuration panel coming soon...</p>
              <p>Manage application settings, integrations, and maintenance.</p>
            </div>
          </div>
        );

      case 'support':
        return (
          <div className="support-content">
            <h2>Support & Feedback</h2>
            <div className="settings-placeholder">
              <FileText size={64} />
              <p>Support dashboard coming soon...</p>
              <p>Handle user feedback, support tickets, and system alerts.</p>
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
            {!sidebarCollapsed && <span className="logo-text">FarmChainX Admin</span>}
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
              <span className="notification-badge">5</span>
            </button>
            
            <div className="profile-section">
              <div className="profile-info">
                <span className="profile-name">{adminProfile.name}</span>
                <span className="profile-subtitle">{adminProfile.role}</span>
              </div>
              <div className="profile-avatar">
                <Shield size={24} />
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

export default AdminDashboard;
