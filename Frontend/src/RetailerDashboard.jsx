import React, { useState, useEffect } from 'react';
import {
    Home,
    Package,
    TruckIcon,
    DollarSign,
    BarChart3,
    Calendar,
    Settings,
    LogOut,
    Menu,
    Bell,
    User,
    Search,
    Plus,
    Download,
    Edit,
    Trash2,
    Eye,
    QrCode,
    CheckCircle,
    XCircle,
    Clock,
    ShoppingCart,
    Boxes,
    TrendingUp,
    AlertCircle,
    MapPin,
    Phone,
    Mail,
    Star,
    Filter,
    RefreshCw,
    X,
    FileText,
    Building2,
    Calendar as CalendarIcon,
    Save
} from 'lucide-react';
import QRCode from 'react-qr-code';
import './RetailerDashboard.css';
import logo from './assets/farmchainxLogo.png';


const RetailerDashboard = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [activeSection, setActiveSection] = useState('dashboard');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All Status');
    const [typeFilter, setTypeFilter] = useState('All Types');

    // Modal states
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isShipmentModalOpen, setIsShipmentModalOpen] = useState(false);
    const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
    const [qrModalProduct, setQrModalProduct] = useState(null);
    const [viewModalData, setViewModalData] = useState(null);
    const [editingItem, setEditingItem] = useState(null);

    // Form data states
    const [productData, setProductData] = useState({
        productName: '',
        category: '',
        supplier: '',
        currentStock: '',
        reorderLevel: '',
        unitPrice: '',
        expiryDate: '',
        batchNumber: '',
        quality: 'Premium'
    });

    const [shipmentData, setShipmentData] = useState({
        shipmentId: '',
        supplier: '',
        products: '',
        totalValue: '',
        expectedDate: '',
        receivedDate: '',
        status: 'In Transit',
        qualityCheck: 'Pending',
        receivedBy: '',
        notes: ''
    });

    const [saleData, setSaleData] = useState({
        productName: '',
        quantity: '',
        unitPrice: '',
        customerName: '',
        saleDate: '',
        paymentStatus: 'Paid',
        deliveryStatus: 'Delivered'
    });

    const [expenseData, setExpenseData] = useState({
        category: '',
        description: '',
        amount: '',
        date: '',
        supplier: '',
        paymentMethod: 'Bank Transfer',
        status: 'Paid'
    });

    // Sample data for retailer operations
    const [inventory, setInventory] = useState([
        {
            id: 1,
            productName: 'Organic Rice',
            category: 'Grains',
            supplier: 'Green Valley Farm',
            currentStock: 850,
            reorderLevel: 100,
            unitPrice: 85,
            lastRestocked: '2025-09-20',
            expiryDate: '2025-12-20',
            status: 'In Stock',
            batchNumber: 'ORG-RICE-2024-001',
            quality: 'Premium'
        },
        {
            id: 2,
            productName: 'Fresh Tomatoes',
            category: 'Vegetables',
            supplier: 'Sunshine Farms',
            currentStock: 25,
            reorderLevel: 50,
            unitPrice: 65,
            lastRestocked: '2025-09-22',
            expiryDate: '2025-09-28',
            status: 'Low Stock',
            batchNumber: 'TOMATO-2024-015',
            quality: 'Grade A'
        },
        {
            id: 3,
            productName: 'Premium Wheat',
            category: 'Grains',
            supplier: 'Golden Fields Co.',
            currentStock: 0,
            reorderLevel: 75,
            unitPrice: 72,
            lastRestocked: '2025-09-15',
            expiryDate: '2025-11-30',
            status: 'Out of Stock',
            batchNumber: 'WHT-PREM-2024-008',
            quality: 'Premium'
        }
    ]);

    const [receivedShipments, setReceivedShipments] = useState([
        {
            id: 1,
            shipmentId: 'SHP-2024-001',
            supplier: 'Green Valley Farm',
            products: [
                { name: 'Organic Rice', quantity: 500, unit: 'kg' },
                { name: 'Brown Rice', quantity: 300, unit: 'kg' }
            ],
            totalValue: 42500,
            receivedDate: '2025-09-20',
            expectedDate: '2025-09-20',
            status: 'Received',
            qualityCheck: 'Passed',
            documents: ['Invoice', 'Quality Certificate', 'Transport Receipt'],
            receivedBy: 'John Doe',
            notes: 'All products in excellent condition'
        },
        {
            id: 2,
            shipmentId: 'SHP-2024-002',
            supplier: 'Sunshine Farms',
            products: [
                { name: 'Fresh Tomatoes', quantity: 200, unit: 'kg' },
                { name: 'Bell Peppers', quantity: 150, unit: 'kg' }
            ],
            totalValue: 22750,
            receivedDate: '2025-09-22',
            expectedDate: '2025-09-21',
            status: 'Received',
            qualityCheck: 'Passed',
            documents: ['Invoice', 'Delivery Note'],
            receivedBy: 'Jane Smith',
            notes: 'Slight delay but quality maintained'
        },
        {
            id: 3,
            shipmentId: 'SHP-2024-003',
            supplier: 'Mountain Harvest',
            products: [
                { name: 'Organic Apples', quantity: 300, unit: 'kg' },
                { name: 'Fresh Carrots', quantity: 250, unit: 'kg' }
            ],
            totalValue: 38500,
            receivedDate: null,
            expectedDate: '2025-09-25',
            status: 'In Transit',
            qualityCheck: 'Pending',
            documents: ['Purchase Order'],
            receivedBy: null,
            notes: 'Expected arrival tomorrow'
        }
    ]);

    const [sales, setSales] = useState([
        {
            id: 1,
            productName: 'Organic Rice',
            quantity: 50,
            unitPrice: 95,
            totalAmount: 4750,
            customerName: 'Local Restaurant Chain',
            saleDate: '2025-09-23',
            paymentStatus: 'Paid',
            deliveryStatus: 'Delivered'
        },
        {
            id: 2,
            productName: 'Fresh Tomatoes',
            quantity: 25,
            unitPrice: 75,
            totalAmount: 1875,
            customerName: 'City Grocery Store',
            saleDate: '2025-09-22',
            paymentStatus: 'Paid',
            deliveryStatus: 'Delivered'
        }
    ]);

    const [expenses, setExpenses] = useState([
        {
            id: 1,
            category: 'Inventory Purchase',
            description: 'Organic Rice - Batch ORG-RICE-2024-001',
            amount: 42500,
            date: '2025-09-20',
            supplier: 'Green Valley Farm',
            paymentMethod: 'Bank Transfer',
            status: 'Paid'
        },
        {
            id: 2,
            category: 'Transportation',
            description: 'Delivery charges for September shipments',
            amount: 5500,
            date: '2025-09-22',
            supplier: 'FastTrack Logistics',
            paymentMethod: 'Cash',
            status: 'Paid'
        }
    ]);

    // Menu items for retailer
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Home },
        { id: 'inventory', label: 'Inventory', icon: Package },
        { id: 'shipments', label: 'Received Shipments', icon: TruckIcon },
        { id: 'sales', label: 'Sales', icon: ShoppingCart },
        { id: 'expenses', label: 'Expenses', icon: DollarSign },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'calendar', label: 'Calendar', icon: Calendar },
        { id: 'settings', label: 'Settings', icon: Settings }
    ];

    // CRUD Functions for Products/Inventory
    const addProduct = () => {
        setEditingItem(null);
        setProductData({
            productName: '',
            category: '',
            supplier: '',
            currentStock: '',
            reorderLevel: '',
            unitPrice: '',
            expiryDate: '',
            batchNumber: '',
            quality: 'Premium'
        });
        setIsProductModalOpen(true);
    };

    const editProduct = (product) => {
        setEditingItem(product);
        setProductData({
            productName: product.productName,
            category: product.category,
            supplier: product.supplier,
            currentStock: product.currentStock,
            reorderLevel: product.reorderLevel,
            unitPrice: product.unitPrice,
            expiryDate: product.expiryDate,
            batchNumber: product.batchNumber,
            quality: product.quality
        });
        setIsProductModalOpen(true);
    };

    const saveProduct = () => {
        const newProduct = {
            ...productData,
            id: editingItem ? editingItem.id : Date.now(),
            currentStock: parseInt(productData.currentStock),
            reorderLevel: parseInt(productData.reorderLevel),
            unitPrice: parseFloat(productData.unitPrice),
            lastRestocked: new Date().toISOString().split('T')[0],
            status: parseInt(productData.currentStock) > parseInt(productData.reorderLevel) ? 'In Stock' :
                parseInt(productData.currentStock) > 0 ? 'Low Stock' : 'Out of Stock'
        };

        if (editingItem) {
            setInventory(inventory.map(item => item.id === editingItem.id ? newProduct : item));
        } else {
            setInventory([...inventory, newProduct]);
        }

        setIsProductModalOpen(false);
        setEditingItem(null);
    };

    const deleteProduct = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            setInventory(inventory.filter(item => item.id !== id));
        }
    };

    // CRUD Functions for Shipments
    const addShipment = () => {
        setEditingItem(null);
        setShipmentData({
            shipmentId: '',
            supplier: '',
            products: '',
            totalValue: '',
            expectedDate: '',
            receivedDate: '',
            status: 'In Transit',
            qualityCheck: 'Pending',
            receivedBy: '',
            notes: ''
        });
        setIsShipmentModalOpen(true);
    };

    const editShipment = (shipment) => {
        setEditingItem(shipment);
        setShipmentData({
            shipmentId: shipment.shipmentId,
            supplier: shipment.supplier,
            products: shipment.products.map(p => `${p.name}: ${p.quantity} ${p.unit}`).join(', '),
            totalValue: shipment.totalValue,
            expectedDate: shipment.expectedDate,
            receivedDate: shipment.receivedDate || '',
            status: shipment.status,
            qualityCheck: shipment.qualityCheck,
            receivedBy: shipment.receivedBy || '',
            notes: shipment.notes
        });
        setIsShipmentModalOpen(true);
    };

    const saveShipment = () => {
        const newShipment = {
            ...shipmentData,
            id: editingItem ? editingItem.id : Date.now(),
            totalValue: parseFloat(shipmentData.totalValue),
            products: shipmentData.products.split(',').map(p => {
                const parts = p.trim().split(':');
                const [quantity, unit] = parts[1].trim().split(' ');
                return { name: parts[0].trim(), quantity: parseInt(quantity), unit };
            }),
            documents: editingItem ? editingItem.documents : ['Purchase Order']
        };

        if (editingItem) {
            setReceivedShipments(receivedShipments.map(item => item.id === editingItem.id ? newShipment : item));
        } else {
            setReceivedShipments([...receivedShipments, newShipment]);
        }

        setIsShipmentModalOpen(false);
        setEditingItem(null);
    };

    const deleteShipment = (id) => {
        if (window.confirm('Are you sure you want to delete this shipment record?')) {
            setReceivedShipments(receivedShipments.filter(item => item.id !== id));
        }
    };

    // CRUD Functions for Sales
    const addSale = () => {
        setEditingItem(null);
        setSaleData({
            productName: '',
            quantity: '',
            unitPrice: '',
            customerName: '',
            saleDate: '',
            paymentStatus: 'Paid',
            deliveryStatus: 'Delivered'
        });
        setIsSaleModalOpen(true);
    };

    const editSale = (sale) => {
        setEditingItem(sale);
        setSaleData({
            productName: sale.productName,
            quantity: sale.quantity,
            unitPrice: sale.unitPrice,
            customerName: sale.customerName,
            saleDate: sale.saleDate,
            paymentStatus: sale.paymentStatus,
            deliveryStatus: sale.deliveryStatus
        });
        setIsSaleModalOpen(true);
    };

    const saveSale = () => {
        const newSale = {
            ...saleData,
            id: editingItem ? editingItem.id : Date.now(),
            quantity: parseInt(saleData.quantity),
            unitPrice: parseFloat(saleData.unitPrice),
            totalAmount: parseInt(saleData.quantity) * parseFloat(saleData.unitPrice)
        };

        if (editingItem) {
            setSales(sales.map(item => item.id === editingItem.id ? newSale : item));
        } else {
            setSales([...sales, newSale]);
        }

        setIsSaleModalOpen(false);
        setEditingItem(null);
    };

    const deleteSale = (id) => {
        if (window.confirm('Are you sure you want to delete this sale record?')) {
            setSales(sales.filter(item => item.id !== id));
        }
    };

    // CRUD Functions for Expenses
    const addExpense = () => {
        setEditingItem(null);
        setExpenseData({
            category: '',
            description: '',
            amount: '',
            date: '',
            supplier: '',
            paymentMethod: 'Bank Transfer',
            status: 'Paid'
        });
        setIsExpenseModalOpen(true);
    };

    const editExpense = (expense) => {
        setEditingItem(expense);
        setExpenseData({
            category: expense.category,
            description: expense.description,
            amount: expense.amount,
            date: expense.date,
            supplier: expense.supplier,
            paymentMethod: expense.paymentMethod,
            status: expense.status
        });
        setIsExpenseModalOpen(true);
    };

    const saveExpense = () => {
        const newExpense = {
            ...expenseData,
            id: editingItem ? editingItem.id : Date.now(),
            amount: parseFloat(expenseData.amount)
        };

        if (editingItem) {
            setExpenses(expenses.map(item => item.id === editingItem.id ? newExpense : item));
        } else {
            setExpenses([...expenses, newExpense]);
        }

        setIsExpenseModalOpen(false);
        setEditingItem(null);
    };

    const deleteExpense = (id) => {
        if (window.confirm('Are you sure you want to delete this expense record?')) {
            setExpenses(expenses.filter(item => item.id !== id));
        }
    };

    // View functions
    const viewDetails = (item, type) => {
        setViewModalData({ ...item, type });
    };

    // Input change handlers
    const handleProductInputChange = (e) => {
        const { name, value } = e.target;
        setProductData(prev => ({ ...prev, [name]: value }));
    };

    const handleShipmentInputChange = (e) => {
        const { name, value } = e.target;
        setShipmentData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaleInputChange = (e) => {
        const { name, value } = e.target;
        setSaleData(prev => ({ ...prev, [name]: value }));
    };

    const handleExpenseInputChange = (e) => {
        const { name, value } = e.target;
        setExpenseData(prev => ({ ...prev, [name]: value }));
    };

    // Filter functions
    const getFilteredInventory = () => {
        return inventory.filter(item => {
            const matchesSearch = item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.supplier.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === 'All Status' || item.status === statusFilter;
            const matchesType = typeFilter === 'All Types' || item.category === typeFilter;

            return matchesSearch && matchesStatus && matchesType;
        });
    };

    const getFilteredShipments = () => {
        return receivedShipments.filter(shipment => {
            const matchesSearch = shipment.shipmentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                shipment.supplier.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === 'All Status' || shipment.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    };

    const getFilteredSales = () => {
        return sales.filter(sale => {
            const matchesSearch = sale.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                sale.customerName.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === 'All Status' || sale.paymentStatus === statusFilter;

            return matchesSearch && matchesStatus;
        });
    };

    const getFilteredExpenses = () => {
        return expenses.filter(expense => {
            const matchesSearch = expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                expense.supplier.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === 'All Status' || expense.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    };

    // Dashboard statistics
    const stats = {
        totalProducts: inventory.length,
        lowStockItems: inventory.filter(item => item.currentStock <= item.reorderLevel).length,
        totalSales: sales.reduce((sum, sale) => sum + sale.totalAmount, 0),
        pendingShipments: receivedShipments.filter(shipment => shipment.status === 'In Transit').length
    };

    // Add table scroll detection useEffect
    useEffect(() => {
        const tableContainers = document.querySelectorAll('.table-container');

        tableContainers.forEach(container => {
            const table = container.querySelector('.data-table');
            if (table && table.scrollWidth > container.clientWidth) {
                container.classList.add('scrollable');
            }

            const handleScroll = () => {
                const scrollLeft = container.scrollLeft;
                const maxScroll = container.scrollWidth - container.clientWidth;

                if (scrollLeft > 10) {
                    container.classList.add('scrolled-left');
                } else {
                    container.classList.remove('scrolled-left');
                }

                if (scrollLeft < maxScroll - 10) {
                    container.classList.add('scrolled-right');
                } else {
                    container.classList.remove('scrolled-right');
                }
            };

            container.addEventListener('scroll', handleScroll);

            return () => {
                container.removeEventListener('scroll', handleScroll);
            };
        });
    }, [inventory, receivedShipments, sales, expenses]);

    const renderDashboard = () => (
        <div className="dashboard-content">
            {/* Stats Grid */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">
                        <Package size={24} />
                    </div>
                    <div className="stat-info">
                        <div className="stat-value">{stats.totalProducts}</div>
                        <div className="stat-label">Total Products</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">
                        <AlertCircle size={24} />
                    </div>
                    <div className="stat-info">
                        <div className="stat-value">{stats.lowStockItems}</div>
                        <div className="stat-label">Low Stock Items</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">
                        <DollarSign size={24} />
                    </div>
                    <div className="stat-info">
                        <div className="stat-value">₹{stats.totalSales.toLocaleString()}</div>
                        <div className="stat-label">Total Sales</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">
                        <TruckIcon size={24} />
                    </div>
                    <div className="stat-info">
                        <div className="stat-value">{stats.pendingShipments}</div>
                        <div className="stat-label">Pending Shipments</div>
                    </div>
                </div>
            </div>

            {/* Dashboard Grid */}
            <div className="dashboard-grid">
                <div className="dashboard-card">
                    <h3>Recent Inventory Updates</h3>
                    <div className="activity-list">
                        {inventory.slice(0, 5).map(item => (
                            <div key={item.id} className="activity-item">
                                <Package size={16} />
                                <div className="activity-info">
                                    <div>{item.productName} - {item.currentStock} units</div>
                                    <div>
                                        <span>Last restocked: {item.lastRestocked}</span>
                                        <span className="activity-time">Stock Level: {item.status}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="dashboard-card">
                    <h3>Recent Shipments</h3>
                    <div className="recent-shipments">
                        {receivedShipments.slice(0, 4).map(shipment => (
                            <div key={shipment.id} className="shipment-item">
                                <div className="shipment-info">
                                    <strong>{shipment.shipmentId}</strong>
                                    <span>{shipment.supplier} - {shipment.status}</span>
                                </div>
                                <span className={`status-badge status-${shipment.status.toLowerCase().replace(' ', '-')}`}>
                                    {shipment.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="dashboard-card">
                    <h3>Quick Actions</h3>
                    <div className="quick-actions">
                        <button className="btn btn-primary" onClick={addProduct}>
                            <Plus size={16} />
                            <span>Add Product</span>
                        </button>
                        <button className="btn btn-secondary" onClick={addShipment}>
                            <TruckIcon size={16} />
                            <span>Record Shipment</span>
                        </button>
                        <button className="btn btn-secondary" onClick={addSale}>
                            <ShoppingCart size={16} />
                            <span>Record Sale</span>
                        </button>
                    </div>
                </div>

                <div className="dashboard-card">
                    <h3>Low Stock Alerts</h3>
                    <div className="recommendations">
                        {inventory.filter(item => item.currentStock <= item.reorderLevel).map(item => (
                            <div key={item.id} className="recommendation-item">
                                <AlertCircle size={16} style={{ color: '#dc2626' }} />
                                <span>{item.productName} - Only {item.currentStock} units left</span>
                            </div>
                        ))}
                        {inventory.filter(item => item.currentStock <= item.reorderLevel).length === 0 && (
                            <div className="recommendation-item">
                                <CheckCircle size={16} style={{ color: '#10b981' }} />
                                <span>All products are well stocked</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderInventory = () => (
        <div>
            <div className="header">
                <h1>Inventory Management</h1>
                <div className="header-actions">
                    <button className="btn btn-primary" onClick={addProduct}>
                        <Plus size={16} />
                        Add Product
                    </button>
                    <button className="btn btn-secondary">
                        <Download size={16} />
                        Export
                    </button>
                </div>
            </div>

            <div className="search-filter-bar">
                <div className="search-container">
                    <Search className="search-icon" size={20} />
                    <input
                        type="text"
                        placeholder="Search products by name, supplier..."
                        className="search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <select
                    className="filter-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option>All Status</option>
                    <option>In Stock</option>
                    <option>Low Stock</option>
                    <option>Out of Stock</option>
                </select>
                <select
                    className="filter-select"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                >
                    <option>All Types</option>
                    <option>Grains</option>
                    <option>Vegetables</option>
                    <option>Fruits</option>
                </select>
            </div>

            <div className="table-section">
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Product Details</th>
                                <th>Category</th>
                                <th>Supplier</th>
                                <th>Current Stock</th>
                                <th>Reorder Level</th>
                                <th>Unit Price</th>
                                <th>Status</th>
                                <th>Last Restocked</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {getFilteredInventory().map(item => (
                                <tr key={item.id}>
                                    <td>
                                        <div className="table-cell-content">
                                            <div className="crop-info">
                                                <div className="crop-image-placeholder">
                                                    <Package size={20} />
                                                </div>
                                                <div className="crop-details">
                                                    <div className="primary-text">{item.productName}</div>
                                                    <div className="secondary-text">
                                                        Batch: {item.batchNumber}
                                                    </div>
                                                    <div className="tertiary-text">
                                                        Quality: {item.quality}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{item.category}</td>
                                    <td>{item.supplier}</td>
                                    <td>{item.currentStock} units</td>
                                    <td>{item.reorderLevel} units</td>
                                    <td>₹{item.unitPrice}</td>
                                    <td>
                                        <div className="table-cell-content">
                                            <span className={`status-badge status-${item.status.toLowerCase().replace(' ', '-')}`}>
                                                {item.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td>{item.lastRestocked}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="btn btn-edit"
                                                onClick={() => editProduct(item)}
                                                data-tooltip="Edit Product"
                                                aria-label="Edit Product"
                                            >
                                                <Edit size={14} />
                                            </button>
                                            <button
                                                className="btn btn-qr"
                                                onClick={() => setQrModalProduct(item)}
                                                data-tooltip="Generate QR"
                                                aria-label="Generate QR Code"
                                            >
                                                <QrCode size={14} />
                                            </button>
                                            <button
                                                className="btn btn-delete"
                                                onClick={() => deleteProduct(item.id)}
                                                data-tooltip="Delete Product"
                                                aria-label="Delete Product"
                                            >
                                                <Trash2 size={14} />
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

    const renderShipments = () => (
        <div>
            <div className="header">
                <h1>Received Shipments</h1>
                <div className="header-actions">
                    <button className="btn btn-primary" onClick={addShipment}>
                        <Plus size={16} />
                        Record Receipt
                    </button>
                    <button className="btn btn-secondary">
                        <Download size={16} />
                        Export
                    </button>
                </div>
            </div>

            <div className="search-filter-bar">
                <div className="search-container">
                    <Search className="search-icon" size={20} />
                    <input
                        type="text"
                        placeholder="Search by shipment ID, supplier..."
                        className="search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <select
                    className="filter-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option>All Status</option>
                    <option>Received</option>
                    <option>In Transit</option>
                    <option>Delayed</option>
                </select>
            </div>

            <div className="table-section">
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Shipment Details</th>
                                <th>Supplier</th>
                                <th>Products</th>
                                <th>Total Value</th>
                                <th>Expected Date</th>
                                <th>Received Date</th>
                                <th>Status</th>
                                <th>Quality Check</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {getFilteredShipments().map(shipment => (
                                <tr key={shipment.id}>
                                    <td>
                                        <div className="table-cell-content">
                                            <div className="primary-text">{shipment.shipmentId}</div>
                                            <div className="secondary-text">
                                                Received by: {shipment.receivedBy || 'Pending'}
                                            </div>
                                            <div className="tertiary-text">
                                                {shipment.notes}
                                            </div>
                                        </div>
                                    </td>
                                    <td>{shipment.supplier}</td>
                                    <td>
                                        <div className="table-cell-content">
                                            {shipment.products.map((product, index) => (
                                                <div key={index} className="secondary-text">
                                                    {product.name}: {product.quantity} {product.unit}
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td>₹{shipment.totalValue.toLocaleString()}</td>
                                    <td>{shipment.expectedDate}</td>
                                    <td>{shipment.receivedDate || 'Pending'}</td>
                                    <td>
                                        <div className="table-cell-content">
                                            <span className={`status-badge status-${shipment.status.toLowerCase().replace(' ', '-')}`}>
                                                {shipment.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${shipment.qualityCheck === 'Passed' ? 'status-received' : 'status-pending'}`}>
                                            {shipment.qualityCheck}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="btn btn-view"
                                                onClick={() => viewDetails(shipment, 'shipment')}
                                                data-tooltip="View Details"
                                                aria-label="View Shipment Details"
                                            >
                                                <Eye size={14} />
                                            </button>
                                            <button
                                                className="btn btn-edit"
                                                onClick={() => editShipment(shipment)}
                                                data-tooltip="Edit Shipment"
                                                aria-label="Edit Shipment"
                                            >
                                                <Edit size={14} />
                                            </button>
                                            <button
                                                className="btn btn-delete"
                                                onClick={() => deleteShipment(shipment.id)}
                                                data-tooltip="Delete Record"
                                                aria-label="Delete Record"
                                            >
                                                <Trash2 size={14} />
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

    const renderSales = () => (
        <div>
            <div className="header">
                <h1>Sales Management</h1>
                <div className="header-actions">
                    <button className="btn btn-primary" onClick={addSale}>
                        <Plus size={16} />
                        Record Sale
                    </button>
                    <button className="btn btn-secondary">
                        <Download size={16} />
                        Export
                    </button>
                </div>
            </div>

            <div className="search-filter-bar">
                <div className="search-container">
                    <Search className="search-icon" size={20} />
                    <input
                        type="text"
                        placeholder="Search by product, customer..."
                        className="search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <select
                    className="filter-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option>All Status</option>
                    <option>Paid</option>
                    <option>Pending</option>
                </select>
            </div>

            <div className="table-section">
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Product Details</th>
                                <th>Customer</th>
                                <th>Quantity</th>
                                <th>Unit Price</th>
                                <th>Total Amount</th>
                                <th>Sale Date</th>
                                <th>Payment Status</th>
                                <th>Delivery Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {getFilteredSales().map(sale => (
                                <tr key={sale.id}>
                                    <td>
                                        <div className="table-cell-content">
                                            <div className="primary-text">{sale.productName}</div>
                                        </div>
                                    </td>
                                    <td>{sale.customerName}</td>
                                    <td>{sale.quantity} units</td>
                                    <td>₹{sale.unitPrice}</td>
                                    <td>₹{sale.totalAmount.toLocaleString()}</td>
                                    <td>{sale.saleDate}</td>
                                    <td>
                                        <div className="table-cell-content">
                                            <span className={`status-badge status-${sale.paymentStatus.toLowerCase()}`}>
                                                {sale.paymentStatus}
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`status-badge status-${sale.deliveryStatus.toLowerCase()}`}>
                                            {sale.deliveryStatus}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="btn btn-view"
                                                onClick={() => viewDetails(sale, 'sale')}
                                                data-tooltip="View Receipt"
                                                aria-label="View Receipt"
                                            >
                                                <Eye size={14} />
                                            </button>
                                            <button
                                                className="btn btn-edit"
                                                onClick={() => editSale(sale)}
                                                data-tooltip="Edit Sale"
                                                aria-label="Edit Sale"
                                            >
                                                <Edit size={14} />
                                            </button>
                                            <button
                                                className="btn btn-delete"
                                                onClick={() => deleteSale(sale.id)}
                                                data-tooltip="Delete Sale"
                                                aria-label="Delete Sale"
                                            >
                                                <Trash2 size={14} />
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

    const renderExpenses = () => (
        <div>
            <div className="header">
                <h1>Expense Management</h1>
                <div className="header-actions">
                    <button className="btn btn-primary" onClick={addExpense}>
                        <Plus size={16} />
                        Add Expense
                    </button>
                    <button className="btn btn-secondary">
                        <Download size={16} />
                        Export
                    </button>
                </div>
            </div>

            <div className="search-filter-bar">
                <div className="search-container">
                    <Search className="search-icon" size={20} />
                    <input
                        type="text"
                        placeholder="Search expenses..."
                        className="search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <select
                    className="filter-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option>All Status</option>
                    <option>Paid</option>
                    <option>Pending</option>
                </select>
            </div>

            <div className="table-section">
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Expense Details</th>
                                <th>Category</th>
                                <th>Supplier</th>
                                <th>Amount</th>
                                <th>Date</th>
                                <th>Payment Method</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {getFilteredExpenses().map(expense => (
                                <tr key={expense.id}>
                                    <td>
                                        <div className="table-cell-content">
                                            <div className="primary-text">{expense.description}</div>
                                        </div>
                                    </td>
                                    <td>{expense.category}</td>
                                    <td>{expense.supplier}</td>
                                    <td>₹{expense.amount.toLocaleString()}</td>
                                    <td>{expense.date}</td>
                                    <td>{expense.paymentMethod}</td>
                                    <td>
                                        <div className="table-cell-content">
                                            <span className={`status-badge status-${expense.status.toLowerCase()}`}>
                                                {expense.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="btn btn-view"
                                                onClick={() => viewDetails(expense, 'expense')}
                                                data-tooltip="View Receipt"
                                                aria-label="View Receipt"
                                            >
                                                <Eye size={14} />
                                            </button>
                                            <button
                                                className="btn btn-edit"
                                                onClick={() => editExpense(expense)}
                                                data-tooltip="Edit Expense"
                                                aria-label="Edit Expense"
                                            >
                                                <Edit size={14} />
                                            </button>
                                            <button
                                                className="btn btn-delete"
                                                onClick={() => deleteExpense(expense.id)}
                                                data-tooltip="Delete Expense"
                                                aria-label="Delete Expense"
                                            >
                                                <Trash2 size={14} />
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
            <p>Analytics Dashboard</p>
            <span>Sales trends, inventory analytics, and performance metrics will be displayed here</span>
        </div>
    );

    const renderCalendar = () => (
        <div className="calendar-placeholder">
            <Calendar size={64} />
            <p>Calendar View</p>
            <span>Shipment schedules, reorder reminders, and important dates will be shown here</span>
        </div>
    );

    const renderSettings = () => (
        <div className="dashboard-card">
            <h3>Settings</h3>
            <div className="settings-info">
                <div><strong>Store Name:</strong> FarmchainX Retail Store</div>
                <div><strong>Location:</strong> Downtown Business District</div>
                <div><strong>Contact:</strong> +91 98765 43210</div>
                <div><strong>Email:</strong> retailer@farmchainx.com</div>
                <div><strong>License:</strong> RETAIL-2024-001</div>
                <div><strong>Operating Hours:</strong> 8:00 AM - 8:00 PM</div>
            </div>
        </div>
    );

    const renderContent = () => {
        switch (activeSection) {
            case 'dashboard': return renderDashboard();
            case 'inventory': return renderInventory();
            case 'shipments': return renderShipments();
            case 'sales': return renderSales();
            case 'expenses': return renderExpenses();
            case 'analytics': return renderAnalytics();
            case 'calendar': return renderCalendar();
            case 'settings': return renderSettings();
            default: return renderDashboard();
        }
    };

    return (
        <div className="retailer-dashboard">
            {/* Sidebar */}
            <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
                <div className="sidebar-header">
                    <div className="logo-section">
                        {/* FIXED: Proper logo image integration */}
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
                        <span>Logout</span>
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
                            <span className="notification-badge">3</span>
                        </button>
                        <div className="profile-section">
                            <div className="profile-info">
                                <div className="profile-name">Retailer</div>
                                <div className="profile-subtitle">City Store Owner</div>
                            </div>
                            <div className="profile-avatar">
                                <User size={20} />
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

            {/* Product Modal */}
            {isProductModalOpen && (
                <div className="modal-overlay" onClick={() => setIsProductModalOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingItem ? 'Edit Product' : 'Add New Product'}</h2>
                            <button className="close-btn" onClick={() => setIsProductModalOpen(false)}>
                                <X size={24} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label">
                                        <Package size={16} />
                                        Product Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="productName"
                                        className="form-input"
                                        value={productData.productName}
                                        onChange={handleProductInputChange}
                                        placeholder="Enter product name"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">
                                        <FileText size={16} />
                                        Category *
                                    </label>
                                    <select
                                        name="category"
                                        className="form-select"
                                        value={productData.category}
                                        onChange={handleProductInputChange}
                                    >
                                        <option value="">Select Category</option>
                                        <option value="Grains">Grains</option>
                                        <option value="Vegetables">Vegetables</option>
                                        <option value="Fruits">Fruits</option>
                                        <option value="Pulses">Pulses</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">
                                        <Building2 size={16} />
                                        Supplier *
                                    </label>
                                    <input
                                        type="text"
                                        name="supplier"
                                        className="form-input"
                                        value={productData.supplier}
                                        onChange={handleProductInputChange}
                                        placeholder="Enter supplier name"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">
                                        <Package size={16} />
                                        Current Stock *
                                    </label>
                                    <input
                                        type="number"
                                        name="currentStock"
                                        className="form-input"
                                        value={productData.currentStock}
                                        onChange={handleProductInputChange}
                                        placeholder="Enter current stock"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">
                                        <AlertCircle size={16} />
                                        Reorder Level *
                                    </label>
                                    <input
                                        type="number"
                                        name="reorderLevel"
                                        className="form-input"
                                        value={productData.reorderLevel}
                                        onChange={handleProductInputChange}
                                        placeholder="Enter reorder level"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">
                                        <DollarSign size={16} />
                                        Unit Price *
                                    </label>
                                    <input
                                        type="number"
                                        name="unitPrice"
                                        className="form-input"
                                        value={productData.unitPrice}
                                        onChange={handleProductInputChange}
                                        placeholder="Enter unit price"
                                        step="0.01"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">
                                        <CalendarIcon size={16} />
                                        Expiry Date
                                    </label>
                                    <input
                                        type="date"
                                        name="expiryDate"
                                        className="form-input"
                                        value={productData.expiryDate}
                                        onChange={handleProductInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">
                                        <FileText size={16} />
                                        Batch Number
                                    </label>
                                    <input
                                        type="text"
                                        name="batchNumber"
                                        className="form-input"
                                        value={productData.batchNumber}
                                        onChange={handleProductInputChange}
                                        placeholder="Enter batch number"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">
                                        <Star size={16} />
                                        Quality
                                    </label>
                                    <select
                                        name="quality"
                                        className="form-select"
                                        value={productData.quality}
                                        onChange={handleProductInputChange}
                                    >
                                        <option value="Premium">Premium</option>
                                        <option value="Grade A">Grade A</option>
                                        <option value="Grade B">Grade B</option>
                                        <option value="Standard">Standard</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setIsProductModalOpen(false)}>
                                Cancel
                            </button>
                            <button className="btn btn-primary" onClick={saveProduct}>
                                <Save size={16} />
                                {editingItem ? 'Update Product' : 'Add Product'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Shipment Modal */}
            {isShipmentModalOpen && (
                <div className="modal-overlay" onClick={() => setIsShipmentModalOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingItem ? 'Edit Shipment' : 'Record New Shipment'}</h2>
                            <button className="close-btn" onClick={() => setIsShipmentModalOpen(false)}>
                                <X size={24} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label">
                                        <TruckIcon size={16} />
                                        Shipment ID *
                                    </label>
                                    <input
                                        type="text"
                                        name="shipmentId"
                                        className="form-input"
                                        value={shipmentData.shipmentId}
                                        onChange={handleShipmentInputChange}
                                        placeholder="Enter shipment ID"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">
                                        <Building2 size={16} />
                                        Supplier *
                                    </label>
                                    <input
                                        type="text"
                                        name="supplier"
                                        className="form-input"
                                        value={shipmentData.supplier}
                                        onChange={handleShipmentInputChange}
                                        placeholder="Enter supplier name"
                                    />
                                </div>
                                <div className="form-group full-width">
                                    <label className="form-label">
                                        <Package size={16} />
                                        Products *
                                    </label>
                                    <textarea
                                        name="products"
                                        className="form-textarea"
                                        value={shipmentData.products}
                                        onChange={handleShipmentInputChange}
                                        placeholder="Enter products (e.g., Organic Rice: 500 kg, Brown Rice: 300 kg)"
                                        rows={3}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">
                                        <DollarSign size={16} />
                                        Total Value *
                                    </label>
                                    <input
                                        type="number"
                                        name="totalValue"
                                        className="form-input"
                                        value={shipmentData.totalValue}
                                        onChange={handleShipmentInputChange}
                                        placeholder="Enter total value"
                                        step="0.01"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">
                                        <CalendarIcon size={16} />
                                        Expected Date *
                                    </label>
                                    <input
                                        type="date"
                                        name="expectedDate"
                                        className="form-input"
                                        value={shipmentData.expectedDate}
                                        onChange={handleShipmentInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">
                                        <CalendarIcon size={16} />
                                        Received Date
                                    </label>
                                    <input
                                        type="date"
                                        name="receivedDate"
                                        className="form-input"
                                        value={shipmentData.receivedDate}
                                        onChange={handleShipmentInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">
                                        <CheckCircle size={16} />
                                        Status
                                    </label>
                                    <select
                                        name="status"
                                        className="form-select"
                                        value={shipmentData.status}
                                        onChange={handleShipmentInputChange}
                                    >
                                        <option value="In Transit">In Transit</option>
                                        <option value="Received">Received</option>
                                        <option value="Delayed">Delayed</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">
                                        <Star size={16} />
                                        Quality Check
                                    </label>
                                    <select
                                        name="qualityCheck"
                                        className="form-select"
                                        value={shipmentData.qualityCheck}
                                        onChange={handleShipmentInputChange}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Passed">Passed</option>
                                        <option value="Failed">Failed</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">
                                        <User size={16} />
                                        Received By
                                    </label>
                                    <input
                                        type="text"
                                        name="receivedBy"
                                        className="form-input"
                                        value={shipmentData.receivedBy}
                                        onChange={handleShipmentInputChange}
                                        placeholder="Enter receiver name"
                                    />
                                </div>
                                <div className="form-group full-width">
                                    <label className="form-label">
                                        <FileText size={16} />
                                        Notes
                                    </label>
                                    <textarea
                                        name="notes"
                                        className="form-textarea"
                                        value={shipmentData.notes}
                                        onChange={handleShipmentInputChange}
                                        placeholder="Add any notes about the shipment"
                                        rows={3}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setIsShipmentModalOpen(false)}>
                                Cancel
                            </button>
                            <button className="btn btn-primary" onClick={saveShipment}>
                                <Save size={16} />
                                {editingItem ? 'Update Shipment' : 'Record Shipment'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Sale Modal */}
            {isSaleModalOpen && (
                <div className="modal-overlay" onClick={() => setIsSaleModalOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingItem ? 'Edit Sale' : 'Record New Sale'}</h2>
                            <button className="close-btn" onClick={() => setIsSaleModalOpen(false)}>
                                <X size={24} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label">
                                        <Package size={16} />
                                        Product Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="productName"
                                        className="form-input"
                                        value={saleData.productName}
                                        onChange={handleSaleInputChange}
                                        placeholder="Enter product name"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">
                                        <Package size={16} />
                                        Quantity *
                                    </label>
                                    <input
                                        type="number"
                                        name="quantity"
                                        className="form-input"
                                        value={saleData.quantity}
                                        onChange={handleSaleInputChange}
                                        placeholder="Enter quantity sold"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">
                                        <DollarSign size={16} />
                                        Unit Price *
                                    </label>
                                    <input
                                        type="number"
                                        name="unitPrice"
                                        className="form-input"
                                        value={saleData.unitPrice}
                                        onChange={handleSaleInputChange}
                                        placeholder="Enter unit price"
                                        step="0.01"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">
                                        <User size={16} />
                                        Customer Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="customerName"
                                        className="form-input"
                                        value={saleData.customerName}
                                        onChange={handleSaleInputChange}
                                        placeholder="Enter customer name"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">
                                        <CalendarIcon size={16} />
                                        Sale Date *
                                    </label>
                                    <input
                                        type="date"
                                        name="saleDate"
                                        className="form-input"
                                        value={saleData.saleDate}
                                        onChange={handleSaleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">
                                        <CheckCircle size={16} />
                                        Payment Status
                                    </label>
                                    <select
                                        name="paymentStatus"
                                        className="form-select"
                                        value={saleData.paymentStatus}
                                        onChange={handleSaleInputChange}
                                    >
                                        <option value="Paid">Paid</option>
                                        <option value="Pending">Pending</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">
                                        <TruckIcon size={16} />
                                        Delivery Status
                                    </label>
                                    <select
                                        name="deliveryStatus"
                                        className="form-select"
                                        value={saleData.deliveryStatus}
                                        onChange={handleSaleInputChange}
                                    >
                                        <option value="Delivered">Delivered</option>
                                        <option value="Pending">Pending</option>
                                        <option value="In Transit">In Transit</option>
                                    </select>
                                </div>
                            </div>
                            {saleData.quantity && saleData.unitPrice && (
                                <div style={{ marginTop: '20px', padding: '16px', background: '#f8fafc', borderRadius: '8px' }}>
                                    <h4>Sale Summary</h4>
                                    <p><strong>Total Amount:</strong> ₹{(parseFloat(saleData.quantity || 0) * parseFloat(saleData.unitPrice || 0)).toLocaleString()}</p>
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setIsSaleModalOpen(false)}>
                                Cancel
                            </button>
                            <button className="btn btn-primary" onClick={saveSale}>
                                <Save size={16} />
                                {editingItem ? 'Update Sale' : 'Record Sale'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Expense Modal */}
            {isExpenseModalOpen && (
                <div className="modal-overlay" onClick={() => setIsExpenseModalOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingItem ? 'Edit Expense' : 'Add New Expense'}</h2>
                            <button className="close-btn" onClick={() => setIsExpenseModalOpen(false)}>
                                <X size={24} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label">
                                        <FileText size={16} />
                                        Category *
                                    </label>
                                    <select
                                        name="category"
                                        className="form-select"
                                        value={expenseData.category}
                                        onChange={handleExpenseInputChange}
                                    >
                                        <option value="">Select Category</option>
                                        <option value="Inventory Purchase">Inventory Purchase</option>
                                        <option value="Transportation">Transportation</option>
                                        <option value="Utilities">Utilities</option>
                                        <option value="Equipment">Equipment</option>
                                        <option value="Maintenance">Maintenance</option>
                                        <option value="Marketing">Marketing</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">
                                        <DollarSign size={16} />
                                        Amount *
                                    </label>
                                    <input
                                        type="number"
                                        name="amount"
                                        className="form-input"
                                        value={expenseData.amount}
                                        onChange={handleExpenseInputChange}
                                        placeholder="Enter expense amount"
                                        step="0.01"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">
                                        <CalendarIcon size={16} />
                                        Date *
                                    </label>
                                    <input
                                        type="date"
                                        name="date"
                                        className="form-input"
                                        value={expenseData.date}
                                        onChange={handleExpenseInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">
                                        <Building2 size={16} />
                                        Supplier/Vendor
                                    </label>
                                    <input
                                        type="text"
                                        name="supplier"
                                        className="form-input"
                                        value={expenseData.supplier}
                                        onChange={handleExpenseInputChange}
                                        placeholder="Enter supplier/vendor name"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">
                                        <DollarSign size={16} />
                                        Payment Method
                                    </label>
                                    <select
                                        name="paymentMethod"
                                        className="form-select"
                                        value={expenseData.paymentMethod}
                                        onChange={handleExpenseInputChange}
                                    >
                                        <option value="Bank Transfer">Bank Transfer</option>
                                        <option value="Cash">Cash</option>
                                        <option value="Credit Card">Credit Card</option>
                                        <option value="Cheque">Cheque</option>
                                        <option value="UPI">UPI</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">
                                        <CheckCircle size={16} />
                                        Status
                                    </label>
                                    <select
                                        name="status"
                                        className="form-select"
                                        value={expenseData.status}
                                        onChange={handleExpenseInputChange}
                                    >
                                        <option value="Paid">Paid</option>
                                        <option value="Pending">Pending</option>
                                    </select>
                                </div>
                                <div className="form-group full-width">
                                    <label className="form-label">
                                        <FileText size={16} />
                                        Description *
                                    </label>
                                    <textarea
                                        name="description"
                                        className="form-textarea"
                                        value={expenseData.description}
                                        onChange={handleExpenseInputChange}
                                        placeholder="Enter detailed description of the expense"
                                        rows={3}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setIsExpenseModalOpen(false)}>
                                Cancel
                            </button>
                            <button className="btn btn-primary" onClick={saveExpense}>
                                <Save size={16} />
                                {editingItem ? 'Update Expense' : 'Add Expense'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* QR Code Modal */}
            {qrModalProduct && (
                <div className="modal-overlay" onClick={() => setQrModalProduct(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                        <div className="modal-header">
                            <h2>QR Code - {qrModalProduct.productName}</h2>
                            <button className="close-btn" onClick={() => setQrModalProduct(null)}>
                                <X size={24} />
                            </button>
                        </div>
                        <div className="modal-body" style={{ textAlign: 'center' }}>
                            <div className="qr-center">
                                <QRCode
                                    value={JSON.stringify({
                                        id: qrModalProduct.id,
                                        productName: qrModalProduct.productName,
                                        category: qrModalProduct.category,
                                        supplier: qrModalProduct.supplier,
                                        batchNumber: qrModalProduct.batchNumber,
                                        quality: qrModalProduct.quality,
                                        unitPrice: qrModalProduct.unitPrice,
                                        expiryDate: qrModalProduct.expiryDate,
                                        retailer: 'FarmchainX Retail Store',
                                        timestamp: new Date().toISOString()
                                    })}
                                    size={256}
                                    level="H"
                                    includeMargin={true}
                                />
                            </div>
                            <div style={{ marginTop: '20px', textAlign: 'left' }}>
                                <p><strong>Product:</strong> {qrModalProduct.productName}</p>
                                <p><strong>Category:</strong> {qrModalProduct.category}</p>
                                <p><strong>Batch:</strong> {qrModalProduct.batchNumber}</p>
                                <p><strong>Quality:</strong> {qrModalProduct.quality}</p>
                                <p><strong>Supplier:</strong> {qrModalProduct.supplier}</p>
                                <p><strong>Price:</strong> ₹{qrModalProduct.unitPrice}/unit</p>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setQrModalProduct(null)}>
                                Close
                            </button>
                            <button className="btn btn-primary" onClick={() => window.print()}>
                                <Download size={16} />
                                Print QR Code
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Details Modal */}
            {viewModalData && (
                <div className="modal-overlay" onClick={() => setViewModalData(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>
                                {viewModalData.type === 'shipment' && `Shipment Details - ${viewModalData.shipmentId}`}
                                {viewModalData.type === 'sale' && `Sale Receipt - ${viewModalData.productName}`}
                                {viewModalData.type === 'expense' && `Expense Details - ${viewModalData.category}`}
                            </h2>
                            <button className="close-btn" onClick={() => setViewModalData(null)}>
                                <X size={24} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="view-details">
                                {viewModalData.type === 'shipment' && (
                                    <>
                                        <div className="detail-row">
                                            <strong>Shipment ID:</strong> {viewModalData.shipmentId}
                                        </div>
                                        <div className="detail-row">
                                            <strong>Supplier:</strong> {viewModalData.supplier}
                                        </div>
                                        <div className="detail-row">
                                            <strong>Total Value:</strong> ₹{viewModalData.totalValue.toLocaleString()}
                                        </div>
                                        <div className="detail-row">
                                            <strong>Expected Date:</strong> {viewModalData.expectedDate}
                                        </div>
                                        <div className="detail-row">
                                            <strong>Received Date:</strong> {viewModalData.receivedDate || 'Pending'}
                                        </div>
                                        <div className="detail-row">
                                            <strong>Status:</strong>
                                            <span className={`status-badge status-${viewModalData.status.toLowerCase().replace(' ', '-')}`}>
                                                {viewModalData.status}
                                            </span>
                                        </div>
                                        <div className="detail-row">
                                            <strong>Quality Check:</strong>
                                            <span className={`status-badge ${viewModalData.qualityCheck === 'Passed' ? 'status-received' : 'status-pending'}`}>
                                                {viewModalData.qualityCheck}
                                            </span>
                                        </div>
                                        <div className="detail-row">
                                            <strong>Received By:</strong> {viewModalData.receivedBy || 'N/A'}
                                        </div>
                                        <div className="detail-row">
                                            <strong>Products:</strong>
                                            <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                                                {viewModalData.products.map((product, index) => (
                                                    <li key={index}>{product.name}: {product.quantity} {product.unit}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="detail-row">
                                            <strong>Documents:</strong>
                                            <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                                                {viewModalData.documents.map((doc, index) => (
                                                    <li key={index}>{doc}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="detail-row">
                                            <strong>Notes:</strong> {viewModalData.notes}
                                        </div>
                                    </>
                                )}

                                {viewModalData.type === 'sale' && (
                                    <>
                                        <div className="detail-row">
                                            <strong>Product:</strong> {viewModalData.productName}
                                        </div>
                                        <div className="detail-row">
                                            <strong>Customer:</strong> {viewModalData.customerName}
                                        </div>
                                        <div className="detail-row">
                                            <strong>Quantity:</strong> {viewModalData.quantity} units
                                        </div>
                                        <div className="detail-row">
                                            <strong>Unit Price:</strong> ₹{viewModalData.unitPrice}
                                        </div>
                                        <div className="detail-row">
                                            <strong>Total Amount:</strong> ₹{viewModalData.totalAmount.toLocaleString()}
                                        </div>
                                        <div className="detail-row">
                                            <strong>Sale Date:</strong> {viewModalData.saleDate}
                                        </div>
                                        <div className="detail-row">
                                            <strong>Payment Status:</strong>
                                            <span className={`status-badge status-${viewModalData.paymentStatus.toLowerCase()}`}>
                                                {viewModalData.paymentStatus}
                                            </span>
                                        </div>
                                        <div className="detail-row">
                                            <strong>Delivery Status:</strong>
                                            <span className={`status-badge status-${viewModalData.deliveryStatus.toLowerCase()}`}>
                                                {viewModalData.deliveryStatus}
                                            </span>
                                        </div>
                                    </>
                                )}

                                {viewModalData.type === 'expense' && (
                                    <>
                                        <div className="detail-row">
                                            <strong>Category:</strong> {viewModalData.category}
                                        </div>
                                        <div className="detail-row">
                                            <strong>Description:</strong> {viewModalData.description}
                                        </div>
                                        <div className="detail-row">
                                            <strong>Amount:</strong> ₹{viewModalData.amount.toLocaleString()}
                                        </div>
                                        <div className="detail-row">
                                            <strong>Date:</strong> {viewModalData.date}
                                        </div>
                                        <div className="detail-row">
                                            <strong>Supplier/Vendor:</strong> {viewModalData.supplier}
                                        </div>
                                        <div className="detail-row">
                                            <strong>Payment Method:</strong> {viewModalData.paymentMethod}
                                        </div>
                                        <div className="detail-row">
                                            <strong>Status:</strong>
                                            <span className={`status-badge status-${viewModalData.status.toLowerCase()}`}>
                                                {viewModalData.status}
                                            </span>
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
                                Print Details
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RetailerDashboard;
