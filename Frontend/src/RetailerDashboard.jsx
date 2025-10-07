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
import api from './conc/api';


const RetailerDashboard = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [activeSection, setActiveSection] = useState('dashboard');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All Status');
    const [typeFilter, setTypeFilter] = useState('All Types');
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isShipmentModalOpen, setIsShipmentModalOpen] = useState(false);
    const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
    const [qrModalProduct, setQrModalProduct] = useState(null);
    const [viewModalData, setViewModalData] = useState(null);
    const [editingItem, setEditingItem] = useState(null);
    const [apiUnavailable, setApiUnavailable] = useState({ inventory: false, shipments: false });

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
        batchCode: '',
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

    const [inventory, setInventory] = useState([]);
    const [receivedShipments, setReceivedShipments] = useState([]);
    const [sales, setSales] = useState([]);
    const [expenses, setExpenses] = useState([]);

    // ADD near other handlers
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
            quality: 'Premium',
        });
        setIsProductModalOpen(true);
    };

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
            notes: '',
        });
        setIsShipmentModalOpen(true);
    };

    const addSale = () => {
        setEditingItem(null);
        setSaleData({
            productName: '',
            batchCode: '',
            quantity: '',
            unitPrice: '',
            customerName: '',
            saleDate: '',
            paymentStatus: 'Paid',
            deliveryStatus: 'Delivered',
        });
        setIsSaleModalOpen(true);
    };

    const viewDetails = (item, type) => {
        setViewModalData({ ...item, type });
    };
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

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Home },
        { id: 'inventory', label: 'Inventory', icon: Package },
        { id: 'shipments', label: 'Received Shipments', icon: TruckIcon },
        { id: 'sales', label: 'Sales', icon: ShoppingCart },
        //{ id: 'expenses', label: 'Expenses', icon: DollarSign },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        // { id: 'calendar', label: 'Calendar', icon: Calendar },
        { id: 'settings', label: 'Settings', icon: Settings }
    ];


    // handleCreateProduct
    const handleCreateProduct = async () => {
        const payload = {
            productName: productData.productName?.trim(),
            category: productData.category || null,
            supplier: productData.supplier || null,
            currentStock: Number(productData.currentStock || 0),
            reorderLevel: Number(productData.reorderLevel || 0),
            unitPrice: Number(productData.unitPrice || 0),
            expiryDate: productData.expiryDate || null,
            batchCode: productData.batchNumber || null,
            quality: productData.quality || null,
            notes: productData.notes || null,
        };

        try {
            const saved = await api.addInventory(payload);
            const row = {
                id: saved?.id ?? Date.now(),
                productName: saved?.productName ?? payload.productName,
                category: saved?.category ?? '-',
                supplier: saved?.supplier ?? '-',
                currentStock: Number(saved?.currentStock ?? payload.currentStock ?? 0),
                reorderLevel: Number(saved?.reorderLevel ?? payload.reorderLevel ?? 0),
                unitPrice: Number(saved?.unitPrice ?? payload.unitPrice ?? 0),
                lastRestocked: saved?.lastRestocked ?? new Date().toISOString().slice(0, 10),
                expiryDate: saved?.expiryDate ?? payload.expiryDate ?? '-',
                status:
                    (Number(saved?.currentStock ?? payload.currentStock ?? 0) <= 0)
                        ? 'Out of Stock'
                        : (Number(saved?.currentStock ?? payload.currentStock ?? 0) <= Number(saved?.reorderLevel ?? payload.reorderLevel ?? 0)
                            ? 'Low Stock'
                            : 'In Stock'),
                batchNumber: saved?.batchCode ?? payload.batchCode ?? payload.batchNumber ?? '-',
                quality: saved?.quality ?? payload.quality ?? 'Standard',
                notes: saved?.notes ?? '',
            };
            setInventory(prev => [row, ...prev]);
            setIsProductModalOpen(false);
            setEditingItem(null);
        } catch (e) {
            console.error('Failed to create inventory item', e);
        }
    };


    const handleRecordShipment = async () => {
  const text = String(shipmentData.shipmentId || '').trim();
  const resolvedId = /^\d+$/.test(text)
    ? Number(text)
    : (receivedShipments.find(x => String(x.shipmentId) === text)?.id);

  if (!resolvedId || Number.isNaN(resolvedId)) {
    alert('Enter a valid shipment id (numeric or SH- code that matches the list).');
    return;
  }

  const ack = await api.retailerReceiveShipment({
    shipmentId: resolvedId,
    currentLocation: shipmentData.currentLocation || 'Retailer Warehouse',
    temperatureC: shipmentData.temperatureC ? Number(shipmentData.temperatureC) : 0,
    humidity: shipmentData.humidity ? Number(shipmentData.humidity) : 0,
  });

  setReceivedShipments(prev => {
    const idx = prev.findIndex(s => s.id === resolvedId || String(s.shipmentId) === String(text));
    if (idx >= 0) {
      const copy = [...prev];
      copy[idx] = {
        ...copy[idx],
        status: 'Received',
        receivedDate: new Date().toISOString().slice(0, 10),
      };
      return copy;
    }
    return [{
      id: resolvedId,
      shipmentId: text || String(resolvedId),
      supplier: shipmentData.supplier || '-',
      products: [],
      totalValue: 0,
      expectedDate: '-',
      receivedDate: new Date().toISOString().slice(0, 10),
      status: 'Received',
      qualityCheck: 'Passed',
      receivedBy: shipmentData.receivedBy || '',
      notes: '',
      documents: [],
    }, ...prev];
  });

  setIsShipmentModalOpen(false);
  setEditingItem(null);
};





    const handleCreateSale = async () => {
        const qty = Number(saleData.quantity || 0);
        const price = Number(saleData.unitPrice || 0);
        const batchCode = String(saleData.batchCode || '').trim();
        if (!batchCode || qty <= 0 || price <= 0) {
            alert('Batch code, quantity, and unit price are required.');
            return;
        }
        const payload = { batchCode, quantityKg: qty, totalAmount: qty * price, productName: saleData.productName || null };

        try {
            const saved = await api.addSale(payload);
            const q = Number(saved?.quantityKg ?? qty);
            const total = Number(saved?.totalAmount ?? qty * price);
            const unit = price || (q > 0 ? Number((total / q).toFixed(2)) : null);

            const row = {
                id: saved?.id ?? Date.now(),
                productName: saved?.productName ?? saved?.batchCode ?? saleData.productName ?? batchCode,
                batchCode: saved?.batchCode ?? batchCode,
                quantity: q,
                unitPrice: unit,
                totalAmount: total,
                customerName: saleData.customerName || '',
                saleDate: saved?.createdAt ?? new Date().toISOString(),
                paymentStatus: saved?.paymentStatus ?? 'Paid',
                deliveryStatus: saved?.deliveryStatus ?? 'Delivered',
            };
            setSales(prev => [row, ...prev]);
            setIsSaleModalOpen(false);
            setEditingItem(null);
        } catch (e) {
            console.error('Failed to record sale', e);
        }
    };

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
    const stats = {
        totalProducts: inventory.length,
        lowStockItems: inventory.filter(item => item.currentStock <= item.reorderLevel).length,
        totalSales: sales.reduce((sum, sale) => sum + sale.totalAmount, 0),
        pendingShipments: receivedShipments.filter(shipment => shipment.status === 'In Transit').length
    };

    const loadRetailSales = async () => {
        const list = await api.request('/retailer/sales', { method: 'GET' });
        const rows = (Array.isArray(list) ? list : []).map(s => ({
            id: s.id,
            productName: s.productName || s.batchCode,  // prefer name
            batchCode: s.batchCode,
            quantity: s.quantityKg,
            unitPrice: null,
            totalAmount: s.totalAmount,
            customerName: '',
            saleDate: s.createdAt,
            paymentStatus: 'Paid',
            deliveryStatus: 'Delivered',
        }));
        setSales(rows);
    };

    // // Fetch retailer inventory
    // const loadInventory = async () => {
    //     try {
    //         const items = await api.request('/retailer/inventory', { method: 'GET' });
    //         const rows = (Array.isArray(items) ? items : []).map(it => ({
    //             id: it.id,
    //             productName: it.productName || it.product,        // prefer name
    //             category: it.category || '-',
    //             supplier: it.supplier || '-',
    //             currentStock: it.currentStock ?? it.availableQuantity ?? 0,
    //             reorderLevel: it.reorderLevel ?? 0,
    //             unitPrice: it.unitPrice ?? null,
    //             lastRestocked: it.lastRestocked || it.receivedDate || '-',
    //             expiryDate: it.expiryDate || '-',
    //             status: it.status || (Number(it.currentStock ?? 0) <= 0 ? 'Out of Stock' : (Number(it.currentStock ?? 0) <= Number(it.reorderLevel ?? 0) ? 'Low Stock' : 'In Stock')),
    //             batchNumber: it.batchCode || it.batchId || '-',
    //             quality: it.quality || it.grade || 'Standard',
    //             notes: it.notes || '',
    //         }));
    //         setInventory(rows);
    //     } catch (e) {
    //         console.error('Failed to load inventory', e);
    //     }
    // };

    // // Fetch shipments received
    // const loadShipments = async () => {
    //     try {
    //         const list = await api.request('/retailer/shipments', { method: 'GET' });
    //         const rows = (Array.isArray(list) ? list : []).map(s => ({
    //             id: s.id,
    //             shipmentId: s.shipmentId || s.id,
    //             supplier: s.distributorName || s.supplier || '-',
    //             products: s.products || [],           // assume backend returns array of {name,quantity,unit}
    //             totalValue: s.totalValue ?? s.totalAmount ?? 0,
    //             expectedDate: s.expectedDelivery || s.expectedDate || '-',
    //             receivedDate: s.receivedDate || null,
    //             status: s.status || (s.receivedDate ? 'Received' : 'In Transit'),
    //             qualityCheck: s.qualityCheck || 'Pending',
    //             receivedBy: s.receivedBy || '',
    //             notes: s.notes || '',
    //             documents: s.documents || [],
    //         }));
    //         setReceivedShipments(rows);
    //     } catch (e) {
    //         console.error('Failed to load shipments', e);
    //     }
    // 

    // RetailerDashboard.jsx

    // Add these if missing, and call in useEffect once.
    const loadInventory = async () => {
        try {
            const items = await api.getInventory();
            const rows = (Array.isArray(items) ? items : []).map(it => ({
                id: it.id,
                productName: it.productName || it.product || '-',
                category: it.category || '-',
                supplier: it.supplier || '-',
                currentStock: it.currentStock ?? it.availableQuantity ?? 0,
                reorderLevel: it.reorderLevel ?? 0,
                unitPrice: it.unitPrice ?? null,
                lastRestocked: it.lastRestocked || it.receivedDate || '-',
                expiryDate: it.expiryDate || '-',
                status: it.status || (Number(it.currentStock ?? 0) <= 0 ? 'Out of Stock' :
                    (Number(it.currentStock ?? 0) <= Number(it.reorderLevel ?? 0) ? 'Low Stock' : 'In Stock')),
                batchNumber: it.batchCode || it.batchId || '-',
                quality: it.quality || it.grade || 'Standard',
                notes: it.notes || '',
            }));
            setInventory(rows);
        } catch (e) {
            console.error('Failed to load inventory', e);
        }
    };

    const loadShipments = async () => {
        try {
            const list = await api.getShipments();
            const rows = (Array.isArray(list) ? list : []).map(s => ({
                id: s.id,
                shipmentId: s.shipmentId || s.id,
                supplier: s.distributorName || s.supplier || '-',
                products: s.products || [],
                totalValue: s.totalValue ?? s.totalAmount ?? 0,
                expectedDate: s.expectedDelivery || s.expectedDate || '-',
                receivedDate: s.receivedDate || null,
                status: s.status || (s.receivedDate ? 'Received' : 'In Transit'),
                qualityCheck: s.qualityCheck || 'Pending',
                receivedBy: s.receivedBy || '',
                notes: s.notes || '',
                documents: s.documents || [],
            }));
            setReceivedShipments(rows);
        } catch (e) {
            console.error('Failed to load shipments', e);
        }
    };

    const loadSales = async () => {
        try {
            const list = await api.getSales();
            const rows = (Array.isArray(list) ? list : []).map(s => {
                const q = Number(s.quantityKg ?? s.quantity ?? 0);
                const total = Number(s.totalAmount ?? 0);
                const unit = s.unitPrice ?? (q > 0 && isFinite(total / q) ? Number((total / q).toFixed(2)) : null);
                return {
                    id: s.id,
                    productName: s.productName || s.batchCode || '-',
                    batchCode: s.batchCode || null,
                    quantity: q,
                    unitPrice: unit,
                    totalAmount: total,
                    customerName: s.customerName || '',
                    saleDate: s.createdAt || s.saleDate || '-',
                    paymentStatus: s.paymentStatus || 'Paid',
                    deliveryStatus: s.deliveryStatus || 'Delivered',
                };
            });
            setSales(rows);
        } catch (e) {
            console.error('Failed to load sales', e);
        }
    };

    useEffect(() => { loadInventory(); loadShipments(); loadSales(); }, []);


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

            { }
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
            { }
            <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
                <div className="sidebar-header">
                    <div className="logo-section">
                        { }
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

            { }
            <div className="main-content">
                { }
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

                { }
                <div className="content-area">
                    <div className="container">
                        {renderContent()}
                    </div>
                </div>
            </div>

            { }
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
                            <button className="btn btn-primary" onClick={handleCreateProduct}>
                                <Save size={16} />
                                {editingItem ? 'Update Product' : 'Add Product'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            { }
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
                            <button className="btn btn-primary" onClick={handleRecordShipment}>
                                <Save size={16} />
                                {editingItem ? 'Update Shipment' : 'Record Shipment'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            { }
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
                                        Batch Code*
                                    </label>
                                    <input
                                        name="batchCode"
                                        className="form-input"
                                        placeholder="Enter Batch Code "
                                        value={saleData.batchCode || ''}
                                        onChange={handleSaleInputChange}
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
                            <button className="btn btn-primary" onClick={handleCreateSale}>
                                <Save size={16} />
                                {editingItem ? 'Update Sale' : 'Record Sale'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            { }
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

            { }
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

            { }
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
