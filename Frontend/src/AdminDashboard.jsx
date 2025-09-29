import React, { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  Activity,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  Settings,
  Database,
  Bell,
  Menu,
  LogOut,
  Home,
  FileText,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  UserCheck,
  UserX,
  Ban,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  RefreshCw,
  Lock,
  Unlock,
  BarChart3,
  Flag,
  X,
  Save,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User
} from 'lucide-react';
import logo from './assets/farmchainxLogo.png';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Modal states
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isSystemConfigModalOpen, setIsSystemConfigModalOpen] = useState(false);
  const [viewModalData, setViewModalData] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  // Filter states
  const [filters, setFilters] = useState({
    userType: '',
    status: '',
    search: ''
  });

  // Form data states
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    role: 'farmer',
    phone: '',
    location: '',
    status: 'pending'
  });

  const [systemConfig, setSystemConfig] = useState({
    configKey: '',
    configValue: '',
    category: 'platform',
    description: ''
  });

  // ==================== REAL ADMIN DATA ====================

  // User Management - Core admin responsibility
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Rajesh Kumar',
      email: 'rajesh.farmer@email.com',
      role: 'Farmer',
      status: 'active',
      registrationDate: '2024-01-15',
      lastLogin: '2024-03-20',
      phone: '+91 98765 43210',
      location: 'Punjab, India',
      isVerified: true,
      totalTransactions: 45,
      flaggedReports: 0,
      accountValue: 125000
    },
    {
      id: 2,
      name: 'Priya Retailers Pvt Ltd',
      email: 'contact@priyaretailers.com',
      role: 'Retailer',
      status: 'active',
      registrationDate: '2024-02-20',
      lastLogin: '2024-03-19',
      phone: '+91 87654 32109',
      location: 'Delhi, India',
      isVerified: true,
      totalTransactions: 127,
      flaggedReports: 1,
      accountValue: 890000
    },
    {
      id: 3,
      name: 'Amit Distribution Co.',
      email: 'amit@distribution.com',
      role: 'Distributor',
      status: 'suspended',
      registrationDate: '2024-03-10',
      lastLogin: '2024-03-15',
      phone: '+91 76543 21098',
      location: 'Gujarat, India',
      isVerified: false,
      totalTransactions: 23,
      flaggedReports: 3,
      accountValue: 45000,
      suspensionReason: 'Multiple quality complaints'
    }
  ]);

  // System Issues/Reports - What admins actually monitor
  const [systemIssues, setSystemIssues] = useState([
    {
      id: 1,
      type: 'payment_failure',
      title: 'Payment Gateway Error',
      description: 'Multiple users reporting payment failures during checkout',
      severity: 'high',
      status: 'investigating',
      reportedBy: 'System Monitor',
      createdAt: '2024-03-20 14:30',
      affectedUsers: 23
    },
    {
      id: 2,
      type: 'quality_dispute',
      title: 'Quality Dispute - Batch #ORG2024001',
      description: 'Retailer claims received organic wheat does not meet quality standards',
      severity: 'medium',
      status: 'pending_review',
      reportedBy: 'Priya Retailers Pvt Ltd',
      createdAt: '2024-03-19 09:15',
      affectedUsers: 2
    },
    {
      id: 3,
      type: 'fraud_alert',
      title: 'Suspicious Activity - Multiple Accounts',
      description: 'Same IP registering multiple farmer accounts with similar details',
      severity: 'high',
      status: 'requires_action',
      reportedBy: 'Security System',
      createdAt: '2024-03-18 16:45',
      affectedUsers: 5
    }
  ]);

  // Platform Configuration - Real admin settings
  const [platformConfigs, setPlatformConfigs] = useState([
    {
      id: 1,
      configKey: 'platform_commission_rate',
      configValue: '2.5',
      category: 'financial',
      description: 'Platform commission percentage on transactions',
      lastModified: '2024-03-15',
      modifiedBy: 'Admin'
    },
    {
      id: 2,
      configKey: 'min_order_value',
      configValue: '500',
      category: 'business_rules',
      description: 'Minimum order value in INR for transactions',
      lastModified: '2024-03-10',
      modifiedBy: 'Admin'
    },
    {
      id: 3,
      configKey: 'verification_requirements',
      configValue: 'true',
      category: 'security',
      description: 'Require document verification for new accounts',
      lastModified: '2024-03-08',
      modifiedBy: 'Admin'
    },
    {
      id: 4,
      configKey: 'auto_dispute_escalation_hours',
      configValue: '48',
      category: 'support',
      description: 'Hours before unresolved disputes are auto-escalated',
      lastModified: '2024-03-05',
      modifiedBy: 'Admin'
    }
  ]);

  // Menu items - Only what admins need
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: Home },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'issues', label: 'Issues & Reports', icon: AlertTriangle },
    { id: 'system', label: 'System Configuration', icon: Settings },
    { id: 'analytics', label: 'Platform Analytics', icon: BarChart3 },
    { id: 'audit', label: 'Audit Logs', icon: FileText }
  ];

  // ==================== REAL ADMIN FUNCTIONS ====================

  // User Management Functions
  const suspendUser = (userId, reason) => {
    if (window.confirm(`Suspend user account?\nReason: ${reason}`)) {
      setUsers(prev => prev.map(user =>
        user.id === userId
          ? { ...user, status: 'suspended', suspensionReason: reason }
          : user
      ));
    }
  };

  const reactivateUser = (userId) => {
    if (window.confirm('Reactivate this user account?')) {
      setUsers(prev => prev.map(user =>
        user.id === userId
          ? { ...user, status: 'active', suspensionReason: null }
          : user
      ));
    }
  };

  const verifyUser = (userId) => {
    setUsers(prev => prev.map(user =>
      user.id === userId ? { ...user, isVerified: true } : user
    ));
  };

  const flagUser = (userId) => {
    setUsers(prev => prev.map(user =>
      user.id === userId
        ? { ...user, flaggedReports: user.flaggedReports + 1 }
        : user
    ));
  };

  // Issue Management Functions
  const updateIssueStatus = (issueId, newStatus) => {
    setSystemIssues(prev => prev.map(issue =>
      issue.id === issueId ? { ...issue, status: newStatus } : issue
    ));
  };

  const escalateIssue = (issueId) => {
    setSystemIssues(prev => prev.map(issue =>
      issue.id === issueId
        ? { ...issue, severity: 'critical', status: 'escalated' }
        : issue
    ));
  };

  const resolveIssue = (issueId) => {
    if (window.confirm('Mark this issue as resolved?')) {
      setSystemIssues(prev => prev.map(issue =>
        issue.id === issueId ? { ...issue, status: 'resolved' } : issue
      ));
    }
  };

  // System Configuration Functions
  const updateSystemConfig = (configId, newValue) => {
    setPlatformConfigs(prev => prev.map(config =>
      config.id === configId
        ? {
          ...config,
          configValue: newValue,
          lastModified: new Date().toISOString().split('T')[0],
          modifiedBy: 'Admin'
        }
        : config
    ));
  };

  // Filter functions
  const filteredUsers = users.filter(user => {
    const matchesRole = !filters.userType || user.role === filters.userType;
    const matchesStatus = !filters.status || user.status === filters.status;
    const matchesSearch = !filters.search ||
      user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      user.email.toLowerCase().includes(filters.search.toLowerCase());

    return matchesRole && matchesStatus && matchesSearch;
  });

  // Real admin statistics
  const adminStats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === 'active').length,
    suspendedUsers: users.filter(u => u.status === 'suspended').length,
    unverifiedUsers: users.filter(u => !u.isVerified).length,
    criticalIssues: systemIssues.filter(i => i.severity === 'high' || i.severity === 'critical').length,
    pendingIssues: systemIssues.filter(i => i.status !== 'resolved').length,
    totalTransactions: users.reduce((sum, u) => sum + u.totalTransactions, 0),
    platformRevenue: users.reduce((sum, u) => sum + (u.accountValue * 0.025), 0) // 2.5% commission
  };

  // Input handlers
  const handleUserInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleSystemConfigChange = (e) => {
    const { name, value } = e.target;
    setSystemConfig(prev => ({ ...prev, [name]: value }));
  };

  // View details function
  const viewDetails = (item, type) => {
    setViewModalData({ ...item, type });
  };

  // Status badge helper
  const getStatusBadge = (status) => {
    const statusMap = {
      'active': 'status-in-stock',
      'suspended': 'status-out-of-stock',
      'pending': 'status-pending',
      'investigating': 'status-pending',
      'resolved': 'status-in-stock',
      'requires_action': 'status-out-of-stock',
      'high': 'status-out-of-stock',
      'medium': 'status-pending',
      'low': 'status-in-stock',
      'critical': 'status-out-of-stock'
    };

    return <span className={`status-badge ${statusMap[status] || 'status-pending'}`}>{status}</span>;
  };

  const renderDashboard = () => (
    <div className="dashboard-content">
      {/* Real Admin Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Users size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{adminStats.totalUsers}</div>
            <div className="stat-label">Total Platform Users</div>
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
            <div className="stat-value">{adminStats.criticalIssues}</div>
            <div className="stat-label">Critical Issues</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Ban size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{adminStats.suspendedUsers}</div>
            <div className="stat-label">Suspended Accounts</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Shield size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{adminStats.unverifiedUsers}</div>
            <div className="stat-label">Pending Verification</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Activity size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{adminStats.totalTransactions}</div>
            <div className="stat-label">Total Transactions</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <DollarSign size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">₹{(adminStats.platformRevenue / 1000).toFixed(0)}K</div>
            <div className="stat-label">Platform Revenue</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FileText size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{adminStats.pendingIssues}</div>
            <div className="stat-label">Pending Issues</div>
          </div>
        </div>
      </div>

      {/* Real Admin Dashboard Grid */}
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Recent Critical Issues</h3>
          <div className="activity-list">
            {systemIssues.filter(issue => issue.severity === 'high' || issue.severity === 'critical').slice(0, 4).map(issue => (
              <div key={issue.id} className="activity-item">
                <AlertTriangle size={16} style={{ color: '#dc2626' }} />
                <div className="activity-info">
                  <div>{issue.title}</div>
                  <div>
                    <span>Reported by: {issue.reportedBy}</span>
                    <span className="activity-time">{issue.createdAt}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-card">
          <h3>User Account Alerts</h3>
          <div className="recent-shipments">
            {users.filter(user => user.status === 'suspended' || !user.isVerified || user.flaggedReports > 0).slice(0, 4).map(user => (
              <div key={user.id} className="shipment-item">
                <div className="shipment-info">
                  <strong>{user.name}</strong>
                  <span>
                    {user.status === 'suspended' ? 'Suspended Account' :
                      !user.isVerified ? 'Unverified Account' :
                        user.flaggedReports > 0 ? `${user.flaggedReports} Reports` : ''}
                  </span>
                </div>
                {getStatusBadge(user.status)}
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-card">
          <h3>Platform Health</h3>
          <div className="system-status">
            <div className="status-item">
              <CheckCircle size={16} className="status-ok" />
              <span>Database: Online</span>
            </div>
            <div className="status-item">
              <CheckCircle size={16} className="status-ok" />
              <span>Payment Gateway: Active</span>
            </div>
            <div className="status-item">
              <CheckCircle size={16} className="status-ok" />
              <span>API Services: Running</span>
            </div>
            <div className="status-item">
              <AlertTriangle size={16} className="status-pending" />
              <span>Storage: 78% Used</span>
            </div>
            <div className="status-item">
              <CheckCircle size={16} className="status-ok" />
              <span>Security: All Clear</span>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <h3>Quick Admin Actions</h3>
          <div className="quick-actions">
            <button className="btn btn-primary" onClick={() => setActiveSection('users')}>
              <Users size={16} />
              <span>Manage Users</span>
            </button>
            <button className="btn btn-secondary" onClick={() => setActiveSection('issues')}>
              <AlertTriangle size={16} />
              <span>Review Issues</span>
            </button>
            <button className="btn btn-secondary" onClick={() => setActiveSection('system')}>
              <Settings size={16} />
              <span>System Config</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div>
      <div className="header">
        <h1>User Account Management</h1>
        <div className="header-actions">
          <button className="btn btn-secondary">
            <Download size={16} />
            Export User Data
          </button>
          <button className="btn btn-secondary">
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      <div className="search-filter-bar">
        <div className="search-container">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Search users by name or email..."
            className="search-input"
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          />
        </div>
        <select
          className="filter-select"
          value={filters.userType}
          onChange={(e) => setFilters(prev => ({ ...prev, userType: e.target.value }))}
        >
          <option value="">All User Types</option>
          <option value="farmer">Farmers</option>
          <option value="retailer">Retailers</option>
          <option value="distributor">Distributors</option>
        </select>
        <select
          className="filter-select"
          value={filters.status}
          onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      <div className="table-section">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>User Details</th>
                <th>Role</th>
                <th>Status</th>
                <th>Verification</th>
                <th>Transactions</th>
                <th>Reports</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>
                    <div className="table-cell-content">
                      <div className="crop-info">
                        <div className="crop-image-placeholder">
                          <User size={20} />
                        </div>
                        <div className="crop-details">
                          <div className="primary-text">{user.name}</div>
                          <div className="secondary-text">{user.email}</div>
                          <div className="tertiary-text">{user.location}</div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{user.role}</td>
                  <td>
                    <div className="table-cell-content">
                      {getStatusBadge(user.status)}
                    </div>
                  </td>
                  <td>
                    {user.isVerified ? (
                      <CheckCircle size={16} className="status-ok" />
                    ) : (
                      <XCircle size={16} className="status-pending" />
                    )}
                  </td>
                  <td>{user.totalTransactions}</td>
                  <td>
                    {user.flaggedReports > 0 ? (
                      <span className="status-badge status-out-of-stock">{user.flaggedReports}</span>
                    ) : (
                      <span className="status-badge status-in-stock">0</span>
                    )}
                  </td>
                  <td>{new Date(user.lastLogin).toLocaleDateString('en-IN')}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn btn-view"
                        onClick={() => viewDetails(user, 'user')}
                        data-tooltip="View Details"
                        aria-label="View User Details"
                      >
                        <Eye size={14} />
                      </button>
                      {!user.isVerified && (
                        <button
                          className="btn btn-qr"
                          onClick={() => verifyUser(user.id)}
                          data-tooltip="Verify User"
                          aria-label="Verify User"
                        >
                          <CheckCircle size={14} />
                        </button>
                      )}
                      {user.status === 'active' ? (
                        <button
                          className="btn btn-delete"
                          onClick={() => suspendUser(user.id, 'Admin review required')}
                          data-tooltip="Suspend User"
                          aria-label="Suspend User"
                        >
                          <Ban size={14} />
                        </button>
                      ) : user.status === 'suspended' ? (
                        <button
                          className="btn btn-edit"
                          onClick={() => reactivateUser(user.id)}
                          data-tooltip="Reactivate User"
                          aria-label="Reactivate User"
                        >
                          <Unlock size={14} />
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderIssues = () => (
    <div>
      <div className="header">
        <h1>Platform Issues & Reports</h1>
        <div className="header-actions">
          <button className="btn btn-secondary">
            <Download size={16} />
            Export Reports
          </button>
        </div>
      </div>

      <div className="table-section">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Issue Details</th>
                <th>Type</th>
                <th>Severity</th>
                <th>Status</th>
                <th>Reported By</th>
                <th>Affected Users</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {systemIssues.map(issue => (
                <tr key={issue.id}>
                  <td>
                    <div className="table-cell-content">
                      <div className="primary-text">{issue.title}</div>
                      <div className="secondary-text">{issue.description}</div>
                    </div>
                  </td>
                  <td>{issue.type.replace('_', ' ')}</td>
                  <td>
                    <div className="table-cell-content">
                      {getStatusBadge(issue.severity)}
                    </div>
                  </td>
                  <td>
                    <div className="table-cell-content">
                      {getStatusBadge(issue.status)}
                    </div>
                  </td>
                  <td>{issue.reportedBy}</td>
                  <td>{issue.affectedUsers}</td>
                  <td>{issue.createdAt}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn btn-view"
                        onClick={() => viewDetails(issue, 'issue')}
                        data-tooltip="View Details"
                        aria-label="View Issue Details"
                      >
                        <Eye size={14} />
                      </button>
                      {issue.status !== 'resolved' && (
                        <button
                          className="btn btn-qr"
                          onClick={() => resolveIssue(issue.id)}
                          data-tooltip="Mark Resolved"
                          aria-label="Mark as Resolved"
                        >
                          <CheckCircle size={14} />
                        </button>
                      )}
                      {issue.severity !== 'critical' && (
                        <button
                          className="btn btn-delete"
                          onClick={() => escalateIssue(issue.id)}
                          data-tooltip="Escalate Issue"
                          aria-label="Escalate Issue"
                        >
                          <Flag size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSystemConfig = () => (
    <div>
      <div className="header">
        <h1>Platform Configuration</h1>
        <div className="header-actions">
          <button className="btn btn-secondary">
            <Download size={16} />
            Export Config
          </button>
        </div>
      </div>

      <div className="table-section">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Configuration</th>
                <th>Category</th>
                <th>Current Value</th>
                <th>Last Modified</th>
                <th>Modified By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {platformConfigs.map(config => (
                <tr key={config.id}>
                  <td>
                    <div className="table-cell-content">
                      <div className="primary-text">{config.configKey.replace(/_/g, ' ')}</div>
                      <div className="secondary-text">{config.description}</div>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge status-${config.category}`}>
                      {config.category.replace('_', ' ')}
                    </span>
                  </td>
                  <td>{config.configValue}</td>
                  <td>{config.lastModified}</td>
                  <td>{config.modifiedBy}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn btn-edit"
                        onClick={() => {
                          const newValue = prompt(`Update ${config.configKey}:`, config.configValue);
                          if (newValue && newValue !== config.configValue) {
                            updateSystemConfig(config.id, newValue);
                          }
                        }}
                        data-tooltip="Edit Config"
                        aria-label="Edit Configuration"
                      >
                        <Edit size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="analytics-placeholder">
      <BarChart3 size={64} />
      <p>Platform Analytics Dashboard</p>
      <span>User growth, transaction volumes, revenue trends, and platform performance metrics</span>
    </div>
  );

  const renderAuditLogs = () => (
    <div className="analytics-placeholder">
      <FileText size={64} />
      <p>System Audit Logs</p>
      <span>Admin actions, system changes, security events, and compliance reporting</span>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard': return renderDashboard();
      case 'users': return renderUsers();
      case 'issues': return renderIssues();
      case 'system': return renderSystemConfig();
      case 'analytics': return renderAnalytics();
      case 'audit': return renderAuditLogs();
      default: return renderDashboard();
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-section">
            <img src={logo} alt="FarmChainX Logo" className="sidebar-logo" />
            <div className="logo-text">FarmChainX</div>
          </div>
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            <Menu size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map(item => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => setActiveSection(item.id)}
              >
                <IconComponent size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item logout-btn">
            <LogOut size={20} />
            <span>Admin Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Header */}
        <div className="top-header">
          <div className="header-left">
            <h1>{menuItems.find(item => item.id === activeSection)?.label || 'Admin Dashboard'}</h1>
          </div>
          <div className="header-right">
            <button className="notification-btn">
              <Bell size={20} />
              <span className="notification-badge">{adminStats.criticalIssues}</span>
            </button>
            <div className="profile-section">
              <div className="profile-info">
                <div className="profile-name">Platform Admin</div>
                <div className="profile-subtitle">System Administrator</div>
              </div>
              <div className="profile-avatar">
                <Shield size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="content-area">
          <div className="container">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* View Details Modal */}
      {viewModalData && (
        <div className="modal-overlay" onClick={() => setViewModalData(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {viewModalData.type === 'user' && `User Account Details - ${viewModalData.name}`}
                {viewModalData.type === 'issue' && `Issue Report - ${viewModalData.title}`}
              </h2>
              <button className="close-btn" onClick={() => setViewModalData(null)}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <div className="view-details">
                {viewModalData.type === 'user' && (
                  <>
                    <div className="detail-row">
                      <strong>Name:</strong> {viewModalData.name}
                    </div>
                    <div className="detail-row">
                      <strong>Email:</strong> {viewModalData.email}
                    </div>
                    <div className="detail-row">
                      <strong>Phone:</strong> {viewModalData.phone}
                    </div>
                    <div className="detail-row">
                      <strong>Role:</strong> {viewModalData.role}
                    </div>
                    <div className="detail-row">
                      <strong>Status:</strong> {getStatusBadge(viewModalData.status)}
                    </div>
                    <div className="detail-row">
                      <strong>Location:</strong> {viewModalData.location}
                    </div>
                    <div className="detail-row">
                      <strong>Registration:</strong> {new Date(viewModalData.registrationDate).toLocaleDateString('en-IN')}
                    </div>
                    <div className="detail-row">
                      <strong>Last Login:</strong> {new Date(viewModalData.lastLogin).toLocaleDateString('en-IN')}
                    </div>
                    <div className="detail-row">
                      <strong>Verified:</strong> {viewModalData.isVerified ? 'Yes' : 'No'}
                    </div>
                    <div className="detail-row">
                      <strong>Total Transactions:</strong> {viewModalData.totalTransactions}
                    </div>
                    <div className="detail-row">
                      <strong>Account Value:</strong> ₹{viewModalData.accountValue.toLocaleString()}
                    </div>
                    <div className="detail-row">
                      <strong>Flagged Reports:</strong> {viewModalData.flaggedReports}
                    </div>
                    {viewModalData.suspensionReason && (
                      <div className="detail-row">
                        <strong>Suspension Reason:</strong> {viewModalData.suspensionReason}
                      </div>
                    )}
                  </>
                )}

                {viewModalData.type === 'issue' && (
                  <>
                    <div className="detail-row">
                      <strong>Issue Type:</strong> {viewModalData.type.replace('_', ' ')}
                    </div>
                    <div className="detail-row">
                      <strong>Title:</strong> {viewModalData.title}
                    </div>
                    <div className="detail-row">
                      <strong>Description:</strong> {viewModalData.description}
                    </div>
                    <div className="detail-row">
                      <strong>Severity:</strong> {getStatusBadge(viewModalData.severity)}
                    </div>
                    <div className="detail-row">
                      <strong>Status:</strong> {getStatusBadge(viewModalData.status)}
                    </div>
                    <div className="detail-row">
                      <strong>Reported By:</strong> {viewModalData.reportedBy}
                    </div>
                    <div className="detail-row">
                      <strong>Affected Users:</strong> {viewModalData.affectedUsers}
                    </div>
                    <div className="detail-row">
                      <strong>Created At:</strong> {viewModalData.createdAt}
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setViewModalData(null)}>
                Close
              </button>
              <button className="btn btn-primary" onClick={() => window.print()}>
                <Download size={16} />
                Print Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
