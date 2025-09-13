import React, { useState, useEffect } from 'react';
import {
    Store, Package, TrendingUp, ShoppingCart, Users, BarChart3,
    DollarSign, AlertTriangle, Eye, Search, Filter, Download,
    Bell, Menu, LogOut, Home, Settings, Calendar, Truck,
    Star, MapPin, User, CheckCircle, Clock, RefreshCw,
    Plus, Edit, Trash2, QrCode, Tags, Target
} from 'lucide-react';
import './RetailerDashboard.css';
import farmchainxLogo from './assets/farmchainxLogo.png';

const RetailerDashboard = () => {
    const [activeSection, setActiveSection] = useState('dashboard');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [inventory, setInventory] = useState([]);
    const [sales, setSales] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [filters, setFilters] = useState({
        category: '',
        status: '',
        search: ''
    });

    // Mock retailer profile
    const [retailerProfile] = useState({
        name: 'Retailer',
        storeName: 'Fresh Market Store',
        location: 'Mumbai, Maharashtra',
        license: 'RET-2024-MH-001',
        storeType: 'Organic Store',
        avatar: null
    });

    // Mock data for demonstration
    useEffect(() => {
        // Mock inventory data
        setInventory([
            {
                id: 'INV001',
                product: 'Organic Wheat',
                category: 'Grains',
                supplier: 'Rajesh Kumar',
                quantity: 150,
                unit: 'kg',
                costPrice: 45,
                sellingPrice: 55,
                expiryDate: '2024-06-15',
                batchId: 'BATCH-2024-001',
                status: 'in-stock',
                lastRestocked: '2024-03-01',
                sold: 50,
                rating: 4.8
            },
            {
                id: 'INV002',
                product: 'Fresh Tomatoes',
                category: 'Vegetables',
                supplier: 'Priya Sharma',
                quantity: 25,
                unit: 'kg',
                costPrice: 40,
                sellingPrice: 60,
                expiryDate: '2024-03-10',
                batchId: 'BATCH-2024-002',
                status: 'low-stock',
                lastRestocked: '2024-03-05',
                sold: 75,
                rating: 4.5
            },
            {
                id: 'INV003',
                product: 'Basmati Rice',
                category: 'Grains',
                supplier: 'Amit Patel',
                quantity: 200,
                unit: 'kg',
                costPrice: 80,
                sellingPrice: 95,
                expiryDate: '2024-08-20',
                batchId: 'BATCH-2024-003',
                status: 'in-stock',
                lastRestocked: '2024-02-28',
                sold: 120,
                rating: 4.9
            },
            {
                id: 'INV004',
                product: 'Organic Spinach',
                category: 'Vegetables',
                supplier: 'Sunita Singh',
                quantity: 5,
                unit: 'kg',
                costPrice: 35,
                sellingPrice: 50,
                expiryDate: '2024-03-08',
                batchId: 'BATCH-2024-004',
                status: 'critical',
                lastRestocked: '2024-03-06',
                sold: 15,
                rating: 4.7
            }
        ]);

        // Mock sales data
        setSales([
            { id: 'SAL001', product: 'Organic Wheat', quantity: '5 kg', customer: 'Raj Patel', amount: '₹275', date: '2024-03-07', status: 'completed' },
            { id: 'SAL002', product: 'Fresh Tomatoes', quantity: '2 kg', customer: 'Meera Shah', amount: '₹120', date: '2024-03-07', status: 'completed' },
            { id: 'SAL003', product: 'Basmati Rice', quantity: '10 kg', customer: 'Anil Kumar', amount: '₹950', date: '2024-03-06', status: 'pending' },
            { id: 'SAL004', product: 'Organic Spinach', quantity: '1 kg', customer: 'Riya Sharma', amount: '₹50', date: '2024-03-06', status: 'completed' }
        ]);

        // Mock suppliers data
        setSuppliers([
            { id: 'SUP001', name: 'Rajesh Kumar', location: 'Nashik, MH', products: 3, rating: 4.8, lastDelivery: '2024-03-01' },
            { id: 'SUP002', name: 'Priya Sharma', location: 'Aurangabad, MH', products: 2, rating: 4.5, lastDelivery: '2024-03-05' },
            { id: 'SUP003', name: 'Amit Patel', location: 'Nagpur, MH', products: 1, rating: 4.9, lastDelivery: '2024-02-28' }
        ]);

        // Mock customers data
        setCustomers([
            { id: 'CUS001', name: 'Raj Patel', totalPurchases: 15, totalAmount: '₹4,250', lastVisit: '2024-03-07', status: 'regular' },
            { id: 'CUS002', name: 'Meera Shah', totalPurchases: 8, totalAmount: '₹2,100', lastVisit: '2024-03-07', status: 'new' },
            { id: 'CUS003', name: 'Anil Kumar', totalPurchases: 22, totalAmount: '₹6,800', lastVisit: '2024-03-06', status: 'vip' }
        ]);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('isRetailerAuthenticated');
        console.log('Retailer logged out successfully');
        // Navigate to login
    };

    // Retailer menu items
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Home },
        { id: 'inventory', label: 'Inventory', icon: Package },
        { id: 'sales', label: 'Sales & Orders', icon: ShoppingCart },
        { id: 'suppliers', label: 'Suppliers', icon: Truck },
        { id: 'customers', label: 'Customers', icon: Users },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'settings', label: 'Settings', icon: Settings }
    ];

    // Calculate retailer stats
    const retailerStats = {
        totalProducts: inventory.length,
        totalRevenue: sales.reduce((sum, sale) => sum + parseInt(sale.amount.replace(/[₹,]/g, '')), 0),
        lowStockItems: inventory.filter(item => item.status === 'low-stock' || item.status === 'critical').length,
        totalCustomers: customers.length,
        todaySales: sales.filter(sale => sale.date === '2024-03-07').length,
        avgRating: inventory.reduce((sum, item) => sum + item.rating, 0) / inventory.length || 0
    };

    const getStockStatusBadge = (status, quantity) => {
        const statusClass = {
            'in-stock': 'status-in-stock',
            'low-stock': 'status-low-stock',
            'critical': 'status-critical',
            'out-of-stock': 'status-out-of-stock'
        }[status] || 'status-in-stock';

        const statusIcon = {
            'in-stock': <CheckCircle size={12} />,
            'low-stock': <AlertTriangle size={12} />,
            'critical': <AlertTriangle size={12} />,
            'out-of-stock': <Clock size={12} />
        }[status];

        return (
            <span className={`status-badge ${statusClass}`} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                {statusIcon}
                {status.replace('-', ' ')} ({quantity})
            </span>
        );
    };

    const getSalesStatusBadge = (status) => {
        const statusClass = {
            'completed': 'status-completed',
            'pending': 'status-pending',
            'cancelled': 'status-cancelled'
        }[status] || 'status-pending';

        return (
            <span className={`status-badge ${statusClass}`}>
                {status}
            </span>
        );
    };

    const getCustomerStatusBadge = (status) => {
        const statusClass = {
            'vip': 'status-vip',
            'regular': 'status-regular',
            'new': 'status-new'
        }[status] || 'status-regular';

        return (
            <span className={`status-badge ${statusClass}`}>
                {status.toUpperCase()}
            </span>
        );
    };

    const filteredInventory = inventory.filter(item => {
        const matchesCategory = !filters.category || item.category === filters.category;
        const matchesStatus = !filters.status || item.status === filters.status;
        const matchesSearch = !filters.search ||
            item.product.toLowerCase().includes(filters.search.toLowerCase()) ||
            item.supplier.toLowerCase().includes(filters.search.toLowerCase());

        return matchesCategory && matchesStatus && matchesSearch;
    });

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-IN');
    };

    const formatCurrency = (amount) => {
        return `₹${amount.toLocaleString('en-IN')}`;
    };

    const renderDashboardContent = () => {
        switch (activeSection) {
            case 'dashboard':
                return (
                    <div className="dashboard-content">
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon">
                                    <Package size={24} />
                                </div>
                                <div className="stat-info">
                                    <div className="stat-value">{retailerStats.totalProducts}</div>
                                    <div className="stat-label">Total Products</div>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon">
                                    <DollarSign size={24} />
                                </div>
                                <div className="stat-info">
                                    <div className="stat-value">{formatCurrency(retailerStats.totalRevenue)}</div>
                                    <div className="stat-label">Total Revenue</div>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon">
                                    <AlertTriangle size={24} />
                                </div>
                                <div className="stat-info">
                                    <div className="stat-value">{retailerStats.lowStockItems}</div>
                                    <div className="stat-label">Low Stock Alerts</div>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon">
                                    <Users size={24} />
                                </div>
                                <div className="stat-info">
                                    <div className="stat-value">{retailerStats.totalCustomers}</div>
                                    <div className="stat-label">Total Customers</div>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon">
                                    <ShoppingCart size={24} />
                                </div>
                                <div className="stat-info">
                                    <div className="stat-value">{retailerStats.todaySales}</div>
                                    <div className="stat-label">Today's Sales</div>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon">
                                    <Star size={24} />
                                </div>
                                <div className="stat-info">
                                    <div className="stat-value">{retailerStats.avgRating.toFixed(1)}</div>
                                    <div className="stat-label">Avg Product Rating</div>
                                </div>
                            </div>
                        </div>

                        <div className="dashboard-grid">
                            <div className="dashboard-card">
                                <h3>Recent Sales</h3>
                                <div className="activity-list">
                                    {sales.slice(0, 3).map(sale => (
                                        <div key={sale.id} className="activity-item">
                                            <ShoppingCart size={16} />
                                            <span>{sale.product} sold to {sale.customer}</span>
                                            <span className="activity-time">{sale.amount}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="dashboard-card">
                                <h3>Low Stock Alerts</h3>
                                <div className="alert-list">
                                    {inventory.filter(item => item.status === 'low-stock' || item.status === 'critical').map(item => (
                                        <div key={item.id} className="alert-item">
                                            <AlertTriangle size={16} className="alert-icon" />
                                            <div className="alert-info">
                                                <div className="alert-product">{item.product}</div>
                                                <div className="alert-quantity">{item.quantity} {item.unit} remaining</div>
                                            </div>
                                            <button className="btn btn-small btn-primary">Restock</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
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
                                <button className="btn btn-primary">
                                    <Plus size={16} />
                                    Add Product
                                </button>
                            </div>
                        </div>

                        <div className="search-filter-bar">
                            <select
                                className="filter-select"
                                value={filters.category}
                                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                            >
                                <option value="">All Categories</option>
                                <option value="Grains">Grains</option>
                                <option value="Vegetables">Vegetables</option>
                                <option value="Fruits">Fruits</option>
                                <option value="Dairy">Dairy</option>
                            </select>

                            <select
                                className="filter-select"
                                value={filters.status}
                                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                            >
                                <option value="">All Stock Status</option>
                                <option value="in-stock">In Stock</option>
                                <option value="low-stock">Low Stock</option>
                                <option value="critical">Critical</option>
                                <option value="out-of-stock">Out of Stock</option>
                            </select>

                            <div className="search-container">
                                <Search size={20} className="search-icon" />
                                <input
                                    type="text"
                                    className="search-input"
                                    placeholder="Search products..."
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
                                            <th>Product</th>
                                            <th>Category</th>
                                            <th>Supplier</th>
                                            <th>Stock Status</th>
                                            <th>Cost Price</th>
                                            <th>Selling Price</th>
                                            <th>Margin</th>
                                            <th>Rating</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredInventory.map((item) => (
                                            <tr key={item.id}>
                                                <td>
                                                    <div className="product-info">
                                                        <div className="product-name">{item.product}</div>
                                                        <div className="product-details">Batch: {item.batchId}</div>
                                                    </div>
                                                </td>
                                                <td>{item.category}</td>
                                                <td>{item.supplier}</td>
                                                <td>{getStockStatusBadge(item.status, `${item.quantity} ${item.unit}`)}</td>
                                                <td>{formatCurrency(item.costPrice)}</td>
                                                <td>{formatCurrency(item.sellingPrice)}</td>
                                                <td>
                                                    <span className="margin-profit">
                                                        {formatCurrency(item.sellingPrice - item.costPrice)}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="rating">
                                                        <Star size={14} fill="currentColor" />
                                                        <span>{item.rating}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="action-buttons">
                                                        <button className="btn btn-small btn-edit">
                                                            <Eye size={12} />
                                                        </button>
                                                        <button className="btn btn-small btn-qr">
                                                            <QrCode size={12} />
                                                        </button>
                                                        <button className="btn btn-small btn-secondary">
                                                            <Edit size={12} />
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

            case 'sales':
                return (
                    <>
                        <div className="header">
                            <h1>Sales & Orders</h1>
                            <div className="header-actions">
                                <button className="btn btn-secondary">
                                    <Download size={16} />
                                    Export Sales
                                </button>
                                <button className="btn btn-primary">
                                    <Plus size={16} />
                                    New Sale
                                </button>
                            </div>
                        </div>

                        <div className="crops-table">
                            <div className="table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Sale ID</th>
                                            <th>Product</th>
                                            <th>Customer</th>
                                            <th>Quantity</th>
                                            <th>Amount</th>
                                            <th>Date</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sales.map((sale) => (
                                            <tr key={sale.id}>
                                                <td>{sale.id}</td>
                                                <td>{sale.product}</td>
                                                <td>{sale.customer}</td>
                                                <td>{sale.quantity}</td>
                                                <td>{sale.amount}</td>
                                                <td>{formatDate(sale.date)}</td>
                                                <td>{getSalesStatusBadge(sale.status)}</td>
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

            case 'suppliers':
                return (
                    <>
                        <div className="header">
                            <h1>Supplier Management</h1>
                            <div className="header-actions">
                                <button className="btn btn-primary">
                                    <Plus size={16} />
                                    Add Supplier
                                </button>
                            </div>
                        </div>

                        <div className="suppliers-grid">
                            {suppliers.map((supplier) => (
                                <div key={supplier.id} className="supplier-card">
                                    <div className="supplier-header">
                                        <div className="supplier-avatar">
                                            <User size={24} />
                                        </div>
                                        <div className="supplier-info">
                                            <h3>{supplier.name}</h3>
                                            <p className="supplier-location">
                                                <MapPin size={14} />
                                                {supplier.location}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="supplier-stats">
                                        <div className="supplier-stat">
                                            <span className="stat-label">Products</span>
                                            <span className="stat-value">{supplier.products}</span>
                                        </div>
                                        <div className="supplier-stat">
                                            <span className="stat-label">Rating</span>
                                            <span className="stat-value">
                                                <Star size={14} fill="currentColor" />
                                                {supplier.rating}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="supplier-footer">
                                        <span className="last-delivery">Last delivery: {formatDate(supplier.lastDelivery)}</span>
                                        <div className="supplier-actions">
                                            <button className="btn btn-small btn-edit">Contact</button>
                                            <button className="btn btn-small btn-secondary">View Products</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                );

            case 'customers':
                return (
                    <>
                        <div className="header">
                            <h1>Customer Management</h1>
                            <div className="header-actions">
                                <button className="btn btn-secondary">
                                    <Download size={16} />
                                    Export Customers
                                </button>
                            </div>
                        </div>

                        <div className="crops-table">
                            <div className="table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Customer</th>
                                            <th>Total Purchases</th>
                                            <th>Total Amount</th>
                                            <th>Last Visit</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {customers.map((customer) => (
                                            <tr key={customer.id}>
                                                <td>
                                                    <div className="customer-info">
                                                        <div className="customer-avatar">
                                                            <User size={20} />
                                                        </div>
                                                        <div className="customer-name">{customer.name}</div>
                                                    </div>
                                                </td>
                                                <td>{customer.totalPurchases}</td>
                                                <td>{customer.totalAmount}</td>
                                                <td>{formatDate(customer.lastVisit)}</td>
                                                <td>{getCustomerStatusBadge(customer.status)}</td>
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

            case 'analytics':
                return (
                    <div className="analytics-content">
                        <h2>Sales Analytics</h2>
                        <div className="analytics-placeholder">
                            <BarChart3 size={64} />
                            <p>Advanced analytics coming soon...</p>
                            <p>Track sales performance, customer behavior, and inventory trends.</p>
                        </div>
                    </div>
                );

            case 'settings':
                return (
                    <div className="settings-content">
                        <h2>Store Settings</h2>
                        <div className="settings-placeholder">
                            <Settings size={64} />
                            <p>Settings panel coming soon...</p>
                            <p>Configure store preferences, pricing, and notifications.</p>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="farmer-dashboard">
            <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
                <div className="sidebar-header">
                    <div className="logo-section">
                        <img src={farmchainxLogo} alt="FarmChainX" className="sidebar-logo" />
                        {!sidebarCollapsed && <span className="logo-text">FarmChainX Retail</span>}
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

            
            <div className="main-content">
                
                <div className="top-header">
                    <div className="header-left">
                        <h1>{menuItems.find(item => item.id === activeSection)?.label || 'Dashboard'}</h1>
                    </div>

                    <div className="header-right">
                        <button className="notification-btn">
                            <Bell size={20} />
                            <span className="notification-badge">6</span>
                        </button>

                        <div className="profile-section">
                            <div className="profile-info">
                                <span className="profile-name">{retailerProfile.name}</span>
                                <span className="profile-subtitle">{retailerProfile.storeName}</span>
                            </div>
                            <div className="profile-avatar">
                                <Store size={24} />
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="content-area">
                    <div className="container">
                        {renderDashboardContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RetailerDashboard;
