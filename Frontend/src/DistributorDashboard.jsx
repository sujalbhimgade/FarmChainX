import React, { useState, useEffect } from 'react';
import {
  Truck, Package, MapPin, AlertTriangle, CheckCircle, Clock,
  Search, Filter, Eye, Download, Bell, Menu, LogOut, Home,
  BarChart3, Settings, Navigation, Warehouse, TrendingUp,
  Calendar, Users, User, Shield, RefreshCw, ShoppingCart,
  DollarSign, Star, Plus, Edit, Archive, Target, X, Phone,
  Mail, CreditCard, Trash2, FileText, QrCode, Upload,
  Thermometer, Droplets, Car, UserCheck, Building,
  ArrowDown, ArrowRight, Activity, TrendingDown, Building2,
  IdCardIcon
} from 'lucide-react';
import './DistributorDashboard.css';
import farmchainxLogo from './assets/farmchainxLogo.png';
import QRCode from 'react-qr-code';
import api from './conc/api';

const DistributorDashboard = () => {
  // Core State Management
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [shipments, setShipments] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [salesOrders, setSalesOrders] = useState([]);
  const [retailers, setRetailers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  // near other useState calls
  const [distributors, setDistributors] = useState([]);


  // Modal States
  const [isRetailerModalOpen, setIsRetailerModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
  const [isShipmentDetailsModalOpen, setIsShipmentDetailsModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);

  // Edit States
  const [editingRetailer, setEditingRetailer] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  const [editingInventory, setEditingInventory] = useState(null);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [selectedQRData, setSelectedQRData] = useState(null);

  // Filter States
  const [filters, setFilters] = useState({
    status: '',
    destination: '',
    search: '',
    retailer: '',
    dateRange: ''
  });

  // Form Data States
  const [retailerFormData, setRetailerFormData] = useState({
    name: '', contact: '', phone: '', email: '', location: '',
    creditLimit: '', preferredProducts: [], notes: ''
  });

  const [orderFormData, setOrderFormData] = useState({
    retailerUserId: '', products: [{ name: '', quantity: '', pricePerKg: '' }],
    deliveryDate: '', notes: '', paymentTerms: ''
  });

  const [inventoryFormData, setInventoryFormData] = useState({
    product: '', batchId: '', quantity: '', location: '', grade: '',
    pricePerKg: '', expiryDate: '', qualityChecked: true, notes: ''
  });

  const [settingsData, setSettingsData] = useState({
    companyName: 'AgriDistribute Solutions',
    location: 'Mumbai, Maharashtra',
    license: 'DIST-2024-MH-001',
    email: 'distributor@farmchainx.com',
    phone: '+91 98765 43210',
    notifications: {
      emailAlerts: true,
      smsAlerts: false,
      pushNotifications: true,
      inventoryAlerts: true,
      orderAlerts: true
    },
    warehouse: {
      address: 'Plot No. 45, Industrial Area, Andheri East, Mumbai - 400069',
      capacity: '10000',
      currentOccupancy: '6500'
    }
  });

  // Mock distributor profile
  const [distributorProfile] = useState({
    name: 'Distributor',
    company: 'AgriDistribute Solutions',
    location: 'Mumbai, Maharashtra',
    license: 'DIST-2024-MH-001',
    avatar: null
  });
  const mapShipmentToUi = s => ({
    id: s.id,
    batchId: s.batchCode,
    product: s.cropName,
    farmer: s.fromUserName || 'Farmer',     // from backend “fromUserName”
    quantity: `${s.quantityKg} kg`,
    status: (s.status || '').toLowerCase(), // CREATED/.. → created/..
    origin: s.originLocation || '-',
    destination: s.destinationLocation || '-',
    dispatchDate: s.createdAt,              // ISO → use formatDate
    expectedDelivery: s.expectedDelivery,   // ISO
    currentLocation: s.destinationLocation || '-', // no live telemetry in DTO
    temperature: s.temperatureC != null ? `${s.temperatureC}°C` : '-',
    humidity: s.humidity != null ? `${s.humidity}%` : '-',
    trackingId: s.trackingCode,
    vehicleNumber: s.vehicle || '-',
  });

  const mapInventoryToUi = item => ({
    id: item.id,
    product: item.crop?.name || item.batchCode || 'Batch',
    quantity: `${item.quantityKg || 0} kg`,
    location: item.location || '-',
    status: (item.status || 'AVAILABLE').toLowerCase(),
    grade: item.grade || '—',              // not provided by backend; placeholder
    pricePerKg: item.unitPrice || 0,
    expiryDate: item.expiryDate || null,   // not provided; keep null
    qualityChecked: true,                  // UI flag only
    supplier: item.crop?.farmer?.fullName || '—',
    receivedDate: item.createdAt,          // ISO
    batchId: item.batchCode,
    notes: item.notes || '',
  });

  const loadSalesOrders = async () => {
    try {
      const orders = await api.getSalesOrders();
      setSalesOrders(orders || []);
    } catch (e) {
      console.error('Failed to load sales orders', e);
    }
  };
  // Load data on component mount
  useEffect(() => {
    loadInitialData();
    loadStoredData();
    loadSalesOrders();

  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('distributor_shipments', JSON.stringify(shipments));
  }, [shipments]);

  useEffect(() => {
    localStorage.setItem('distributor_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('distributor_orders', JSON.stringify(salesOrders));
  }, [salesOrders]);

  useEffect(() => {
    localStorage.setItem('distributor_retailers', JSON.stringify(retailers));
  }, [retailers]);

  const loadStoredData = () => {
    const storedShipments = localStorage.getItem('distributor_shipments');
    const storedInventory = localStorage.getItem('distributor_inventory');
    const storedOrders = localStorage.getItem('distributor_orders');
    const storedRetailers = localStorage.getItem('distributor_retailers');
    const storedSettings = localStorage.getItem('distributor_settings');

    if (storedShipments) setShipments(JSON.parse(storedShipments));
    if (storedInventory) setInventory(JSON.parse(storedInventory));
    if (storedOrders) setSalesOrders(JSON.parse(storedOrders));
    if (storedRetailers) setRetailers(JSON.parse(storedRetailers));
    if (storedSettings) setSettingsData(JSON.parse(storedSettings));
  };

  const loadInitialData = async () => {
    try {
      // 1) Incoming shipments (to this distributor)
      const incoming = await api.getIncomingShipments(); // ShipmentResponse[]
      setShipments(incoming.map(mapShipmentToUi));

      // 2) Distributor inventory
      const inv = await api.getDistributorInventory(); // InventoryItem[]
      setInventory(inv.map(mapInventoryToUi));

      // loadSalesOrders
      const orders = await api.getSalesOrders();
      setSalesOrders(Array.isArray(orders) ? orders : []);
      // 3) (Optional) sales orders and retailers remain local for now
    } catch (e) {
      console.error('Distributor load error', e);
      // Keep previously stored local state as fallback
    }
  };

  // Utility Functions
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Event Handlers
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('isDistributorAuthenticated');
      localStorage.removeItem('distributorEmail');
      console.log('Distributor logged out successfully');
      window.location.href = '/login';
    }
  };

  const handleNotificationClick = () => {
    const unreadNotifications = notifications.filter(n => !n.read);
    if (unreadNotifications.length > 0) {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }
  };
  // Inside DistributorDashboard.jsx
  const handleCreateOrder = async (formData) => {
    try {
      // Basic frontend validation
      const items = (formData.products || [])
        .filter(p => (p.productId || p.batchId || p.id) && p.quantity && p.pricePerKg)
        .map(p => ({
          // Prefer productId; fall back to batchCode/id if UI uses those
          productId: p.productId ?? null,
          batchCode: p.batchId ?? p.batchCode ?? null,
          quantityKg: Number(p.quantity) || 0,
          pricePerKg: Number(p.pricePerKg) || 0,
        }));

      if (!formData.retailerUserId || items.length === 0) {
        alert('Retailer and at least one valid product are required');
        return;
      }

      const payload = {
        retailerUserId: formData.retailerUserId,
        items,
        deliveryDate: formData.deliveryDate || null,
        notes: formData.notes || '',
        paymentTerms: formData.paymentTerms || 'Net 30',
      };

      await api.createSalesOrder(payload);
      await loadSalesOrders();
      setIsOrderModalOpen(false);
      resetOrderForm && resetOrderForm();
    } catch (err) {
      console.error('Failed to create order', err);
    }
  };


  // Update order status
  const handleUpdateOrderStatus = async (orderId, nextStatus) => {
    try {
      await api.updateSalesOrderStatus(orderId, nextStatus);
      await loadSalesOrders();
    } catch (e) {
      console.error('Failed to update order status', e);
    }
  };

  // Form Reset Functions
  const resetRetailerForm = () => {
    setRetailerFormData({
      name: '', contact: '', phone: '', email: '', location: '',
      creditLimit: '', preferredProducts: [], notes: ''
    });
    setEditingRetailer(null);
  };

  const resetOrderForm = () => {
    setOrderFormData({
      retailerUserId: '', products: [{ name: '', quantity: '', pricePerKg: '' }],
      deliveryDate: '', notes: '', paymentTerms: ''
    });
    setEditingOrder(null);
  };

  const resetInventoryForm = () => {
    setInventoryFormData({
      product: '', batchId: '', quantity: '', location: '', grade: '',
      pricePerKg: '', expiryDate: '', qualityChecked: true, notes: ''
    });
    setEditingInventory(null);
  };

  // Modal Functions
  const openRetailerModal = (retailer = null) => {
    if (retailer) {
      setRetailerFormData({ ...retailer });
      setEditingRetailer(retailer);
    } else {
      resetRetailerForm();
    }
    setIsRetailerModalOpen(true);
  };

  const openOrderModal = (order = null) => {
    if (order) {
      setOrderFormData({ ...order });
      setEditingOrder(order);
    } else {
      resetOrderForm();
    }
    setIsOrderModalOpen(true);
  };

  const openInventoryModal = (item = null) => {
    if (item) {
      setInventoryFormData({ ...item });
      setEditingInventory(item);
    } else {
      resetInventoryForm();
    }
    setIsInventoryModalOpen(true);
  };

  const openShipmentDetails = (shipment) => {
    setSelectedShipment(shipment);
    setIsShipmentDetailsModalOpen(true);
  };

  const openQRModal = (data) => {
    setSelectedQRData(data);
    setIsQRModalOpen(true);
  };

  // CRUD Operations
  const saveRetailer = () => {
    if (!retailerFormData.name || !retailerFormData.contact || !retailerFormData.phone) {
      alert('Please fill in all required fields (Name, Contact, Phone)');
      return;
    }

    if (editingRetailer) {
      setRetailers(prev => prev.map(retailer =>
        retailer.id === editingRetailer.id
          ? { ...retailerFormData, id: editingRetailer.id, totalOrders: retailer.totalOrders }
          : retailer
      ));
      alert('Retailer updated successfully!');
    } else {
      const newRetailer = {
        ...retailerFormData,
        id: `RET${Date.now()}`,
        outstandingAmount: 0,
        rating: 5.0,
        lastOrderDate: null,
        totalOrders: 0
      };
      setRetailers(prev => [...prev, newRetailer]);
      alert('Retailer added successfully!');
    }
    setIsRetailerModalOpen(false);
    resetRetailerForm();
  };

  const deleteRetailer = (id) => {
    if (window.confirm('Are you sure you want to delete this retailer?')) {
      setRetailers(prev => prev.filter(retailer => retailer.id !== id));
      alert('Retailer deleted successfully!');
    }
  };

  const saveOrder = () => {
    if (!orderFormData.retailerUserId || !orderFormData.deliveryDate) {
      alert('Please fill in all required fields');
      return;
    }

    const validProducts = orderFormData.products.filter(p => p.name && p.quantity && p.pricePerKg);
    if (validProducts.length === 0) {
      alert('Please add at least one valid product');
      return;
    }

    const totalAmount = validProducts.reduce((sum, product) =>
      sum + (parseFloat(product.quantity) * parseFloat(product.pricePerKg)), 0
    );

    const retailer = retailers.find(r => r.id === orderFormData.retailerUserId);

    if (editingOrder) {
      setSalesOrders(prev => prev.map(order =>
        order.id === editingOrder.id
          ? {
            ...orderFormData,
            id: editingOrder.id,
            products: validProducts.map(p => ({ ...p, total: p.quantity * p.pricePerKg })),
            totalAmount,
            retailerName: retailer?.name || 'Unknown'
          }
          : order
      ));
      alert('Order updated successfully!');
    } else {
      const newOrder = {
        ...orderFormData,
        id: `SO${Date.now()}`,
        products: validProducts.map(p => ({ ...p, total: p.quantity * p.pricePerKg })),
        totalAmount,
        retailerName: retailer?.name || 'Unknown',
        status: 'pending-approval',
        orderDate: new Date().toISOString()
      };
      setSalesOrders(prev => [...prev, newOrder]);
      alert('Order created successfully!');
    }
    setIsOrderModalOpen(false);
    resetOrderForm();
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setSalesOrders(prev => prev.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    alert(`Order status updated to ${newStatus}!`);
  };

  const deleteOrder = (id) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      setSalesOrders(prev => prev.filter(order => order.id !== id));
      alert('Order deleted successfully!');
    }
  };

  const saveInventory = async () => {
    // require: batchCode, quantityKg, unitPrice, location
    const batchId = (inventoryFormData.batchId || '').trim();
    const qty = parseFloat((inventoryFormData.quantity || '').toString().trim());
    const price = parseFloat((inventoryFormData.pricePerKg || '').toString().trim());

    if (!batchId || Number.isNaN(qty) || qty <= 0 || Number.isNaN(price) || price <= 0) {
      alert('Please fill Batch, Quantity, Price/Kg');
      return;
    }

    try {
      await api.addDistributorInventory({
        batchCode: batchId,
        quantityKg: qty,
        unitPrice: price,
        location: (inventoryFormData.location || '').trim() || 'Warehouse',
      });
      const inv = await api.getDistributorInventory();
      setInventory(inv.map(mapInventoryToUi));
      setIsInventoryModalOpen(false);
      resetInventoryForm();
      alert('Inventory item added successfully!');
    } catch (e) {
      console.error('Add inventory failed', e);
      alert('Failed to add inventory.');
    }
  };



  const deleteInventoryItem = (id) => {
    if (window.confirm('Are you sure you want to delete this inventory item?')) {
      setInventory(prev => prev.filter(item => item.id !== id));
      alert('Inventory item deleted successfully!');
    }
  };

  const updateShipmentStatus = async (shipmentId, newStatus) => {
    try {
      await api.updateShipmentStatus(shipmentId, newStatus);
      const refreshed = await api.getIncomingShipments();
      setShipments(refreshed.map(mapShipmentToUi));
      alert(`Shipment status updated to ${newStatus}!`);
    } catch (e) {
      console.error('Update shipment status failed', e);
      alert('Failed to update shipment status.');
    }
  };


  const saveSettings = () => {
    localStorage.setItem('distributor_settings', JSON.stringify(settingsData));
    alert('Settings saved successfully!');
    setIsSettingsModalOpen(false);
  };

  // Export Functions
  const exportData = (type) => {
    let data, filename, headers;

    switch (type) {
      case 'inventory':
        data = inventory;
        filename = `inventory_export_${new Date().toISOString().split('T')[0]}.csv`;
        headers = ['Product', 'Quantity', 'Location', 'Grade', 'Price/Kg', 'Expiry Date', 'Status', 'Quality Checked'];
        break;
      case 'orders':
        data = salesOrders;
        filename = `orders_export_${new Date().toISOString().split('T')[0]}.csv`;
        headers = ['Order ID', 'Retailer', 'Total Amount', 'Status', 'Order Date', 'Delivery Date'];
        break;
      case 'retailers':
        data = retailers;
        filename = `retailers_export_${new Date().toISOString().split('T')[0]}.csv`;
        headers = ['Name', 'Contact', 'Phone', 'Location', 'Credit Limit', 'Outstanding Amount', 'Rating'];
        break;
      case 'shipments':
        data = shipments;
        filename = `shipments_export_${new Date().toISOString().split('T')[0]}.csv`;
        headers = ['Shipment ID', 'Product', 'Farmer', 'Quantity', 'Status', 'Origin', 'Destination'];
        break;
      default:
        alert('Invalid export type');
        return;
    }

    if (data.length === 0) {
      alert(`No ${type} data to export!`);
      return;
    }

    const csvContent = [
      headers.join(','),
      ...data.map(item => {
        switch (type) {
          case 'inventory':
            return [
              item.product, item.quantity, item.location, item.grade,
              item.pricePerKg, formatDate(item.expiryDate), item.status,
              item.qualityChecked ? 'Yes' : 'No'
            ].join(',');
          case 'orders':
            return [
              item.id, item.retailerName, item.totalAmount, item.status,
              formatDate(item.orderDate), formatDate(item.deliveryDate)
            ].join(',');
          case 'retailers':
            return [
              item.name, item.contact, item.phone, item.location,
              item.creditLimit, item.outstandingAmount, item.rating
            ].join(',');
          case 'shipments':
            return [
              item.id, item.product, item.farmer, item.quantity,
              item.status, item.origin, item.destination
            ].join(',');
          default:
            return '';
        }
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    alert(`${type.charAt(0).toUpperCase() + type.slice(1)} data exported successfully!`);
  };

  // Menu items
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'shipments', label: 'Inbound Shipments', icon: Truck },
    { id: 'inventory', label: 'Inventory & Quality', icon: Package },
    { id: 'sales', label: 'Sales Orders', icon: ShoppingCart },
    { id: 'retailers', label: 'Retailer Directory', icon: Users },
    { id: 'analytics', label: 'Sales Analytics', icon: BarChart3 },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  // Calculate enhanced distributor stats
  const distributorStats = {
    totalShipments: shipments.length,
    inTransit: shipments.filter(ship => ship.status === 'in-transit').length,
    delivered: shipments.filter(ship => ship.status === 'delivered').length,
    totalInventory: inventory.reduce((sum, item) => sum + parseFloat(item.quantity.replace(' kg', '') || 0), 0),
    availableForSale: inventory.filter(item => item.status === 'available' && item.qualityChecked).length,
    totalSalesOrders: salesOrders.length,
    pendingSales: salesOrders.filter(order => order.status === 'pending-approval').length,
    totalRevenue: salesOrders.reduce((sum, order) => sum + order.totalAmount, 0),
    activeRetailers: retailers.length,
    lowStockItems: inventory.filter(item => parseFloat(item.quantity.replace(' kg', '') || 0) < 1000).length,
    unreadNotifications: notifications.filter(n => !n.read).length
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'in-transit': { class: 'status-growing', icon: Clock, text: 'In Transit' },
      'delivered': { class: 'status-harvested', icon: CheckCircle, text: 'Delivered' },
      'pending': { class: 'status-planned', icon: Clock, text: 'Pending' },
      'delayed': { class: 'status-badge status-delayed', icon: AlertTriangle, text: 'Delayed' },
      'available': { class: 'status-harvested', icon: CheckCircle, text: 'Available' },
      'low-stock': { class: 'status-growing', icon: AlertTriangle, text: 'Low Stock' },
      'critical': { class: 'status-badge status-delayed', icon: AlertTriangle, text: 'Critical' },
      'out-of-stock': { class: 'status-badge status-delayed', icon: X, text: 'Out of Stock' },
      'pending-approval': { class: 'status-planned', icon: Clock, text: 'Pending Approval' },
      'confirmed': { class: 'status-growing', icon: CheckCircle, text: 'Confirmed' },
      'shipped': { class: 'status-harvested', icon: Truck, text: 'Shipped' },
      'cancelled': { class: 'status-badge status-delayed', icon: X, text: 'Cancelled' }
    };

    const config = statusConfig[status] || statusConfig['pending'];
    const IconComponent = config.icon;

    return (
      <span className={`status-badge ${config.class}`}>
        <IconComponent size={14} />
        {config.text}
      </span>
    );
  };

  const filteredShipments = shipments.filter(shipment => {
    const matchesStatus = !filters.status || shipment.status === filters.status;
    const matchesDestination = !filters.destination ||
      shipment.destination.toLowerCase().includes(filters.destination.toLowerCase());
    const matchesSearch = !filters.search ||
      shipment.product.toLowerCase().includes(filters.search.toLowerCase()) ||
      shipment.farmer.toLowerCase().includes(filters.search.toLowerCase()) ||
      shipment.id.toLowerCase().includes(filters.search.toLowerCase());

    return matchesStatus && matchesDestination && matchesSearch;
  });

  const filteredInventory = inventory.filter(item => {
    const matchesStatus = !filters.status || item.status === filters.status;
    const matchesSearch = !filters.search ||
      item.product.toLowerCase().includes(filters.search.toLowerCase()) ||
      item.location.toLowerCase().includes(filters.search.toLowerCase()) ||
      item.grade.toLowerCase().includes(filters.search.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const filteredOrders = (salesOrders || []).filter(order => {
    const matchesStatus = !filters.status || order.status === filters.status;
    const matchesRetailer = !filters.retailer || order.retailerUserId === filters.retailer;
    const matchesSearch = !filters.search ||
      order.retailerName.toLowerCase().includes(filters.search.toLowerCase()) ||
      order.id.toLowerCase().includes(filters.search.toLowerCase());

    return matchesStatus && matchesRetailer && matchesSearch;
  });

  const filteredRetailers = retailers.filter(retailer => {
    const matchesSearch = !filters.search ||
      retailer.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      retailer.contact.toLowerCase().includes(filters.search.toLowerCase()) ||
      retailer.location.toLowerCase().includes(filters.search.toLowerCase());

    return matchesSearch;
  });

  // Render Functions
  const renderDashboardContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="dashboard-content">
            {/* Stats Grid */}
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
                  <Package size={24} />
                </div>
                <div className="stat-info">
                  <div className="stat-value">{distributorStats.totalInventory.toFixed(0)} kg</div>
                  <div className="stat-label">Total Inventory</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <ShoppingCart size={24} />
                </div>
                <div className="stat-info">
                  <div className="stat-value">{distributorStats.totalSalesOrders}</div>
                  <div className="stat-label">Sales Orders</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <DollarSign size={24} />
                </div>
                <div className="stat-info">
                  <div className="stat-value">{formatCurrency(distributorStats.totalRevenue)}</div>
                  <div className="stat-label">Total Revenue</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <Users size={24} />
                </div>
                <div className="stat-info">
                  <div className="stat-value">{distributorStats.activeRetailers}</div>
                  <div className="stat-label">Active Retailers</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <AlertTriangle size={24} />
                </div>
                <div className="stat-info">
                  <div className="stat-value">{distributorStats.lowStockItems}</div>
                  <div className="stat-label">Low Stock Alerts</div>
                </div>
              </div>
            </div>

            {/* Dashboard Grid */}
            <div className="dashboard-grid">
              {/* Recent Shipments */}
              <div className="dashboard-card">
                <h3>Recent Shipments</h3>
                <div className="activity-list">
                  {shipments.slice(0, 5).map(shipment => (
                    <div key={shipment.id} className="activity-item">
                      <Truck size={20} />
                      <div className="activity-info">
                        <div>
                          <strong>{shipment.product}</strong> from {shipment.farmer}
                        </div>
                        <div>{shipment.quantity} - {getStatusBadge(shipment.status)}</div>
                      </div>
                      <div className="activity-time">
                        {formatDate(shipment.expectedDelivery)}
                      </div>
                    </div>
                  ))}
                  {shipments.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
                      No recent shipments
                    </div>
                  )}
                </div>
              </div>

              {/* Inventory Alerts */}
              <div className="dashboard-card">
                <h3>Inventory Alerts</h3>
                <div className="inventory-alerts">
                  {inventory.filter(item =>
                    parseFloat(item.quantity.replace(' kg', '') || 0) < 1000
                  ).slice(0, 5).map(item => (
                    <div key={item.id} className="alert-item">
                      <AlertTriangle className="alert-icon" size={20} />
                      <div>
                        <strong>{item.product}</strong>
                        <span>Only {item.quantity} remaining in {item.location}</span>
                      </div>
                    </div>
                  ))}
                  {distributorStats.lowStockItems === 0 && (
                    <div className="success-message">
                      <CheckCircle size={24} />
                      <div>All inventory levels are healthy</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Orders */}
              <div className="dashboard-card">
                <h3>Recent Orders</h3>
                <div className="recent-orders">
                  {salesOrders.slice(0, 5).map(order => (
                    <div key={order.id} className="order-item">
                      <div className="order-info">
                        <strong>{order.retailerName}</strong>
                        <span>{formatCurrency(order.totalAmount)} - {formatDate(order.orderDate)}</span>
                      </div>
                      <div>
                        {getStatusBadge(order.status)}
                      </div>
                    </div>
                  ))}
                  {salesOrders.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
                      No recent orders
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="dashboard-card">
                <h3>Quick Actions</h3>
                <div className="quick-actions" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <button
                    className="btn btn-primary"
                    onClick={() => openOrderModal()}
                  >
                    <Plus size={16} />
                    Create New Order
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => openInventoryModal()}
                  >
                    <Package size={16} />
                    Add Inventory Item
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => openRetailerModal()}
                  >
                    <Users size={16} />
                    Add New Retailer
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => exportData('inventory')}
                  >
                    <Download size={16} />
                    Export Inventory
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'shipments':
        return (
          <div className="dashboard-content">
            {/* Header */}
            <div className="header">
              <h1>Inbound Shipments</h1>
              <div className="header-actions">
                <button className="btn btn-secondary" onClick={() => exportData('shipments')}>
                  <Download size={16} />
                  Export Data
                </button>
                <button className="btn btn-secondary" onClick={() => setFilters({ ...filters, status: '', search: '' })}>
                  <RefreshCw size={16} />
                  Refresh
                </button>
              </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="search-filter-bar">
              <div className="search-container">
                <Search className="search-icon" size={20} />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search shipments by product, farmer, or ID..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </div>
              <select
                className="filter-select"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <option value="">All Statuses</option>
                <option value="in-transit">In Transit</option>
                <option value="delivered">Delivered</option>
                <option value="pending">Pending</option>
                <option value="delayed">Delayed</option>
              </select>
              <input
                type="text"
                className="form-input"
                placeholder="Filter by destination..."
                value={filters.destination}
                onChange={(e) => setFilters({ ...filters, destination: e.target.value })}
                style={{ minWidth: '200px' }}
              />
            </div>

            {/* Shipments Table */}
            <div className="table-section">
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th style={{ width: '180px' }}>Shipment Details</th>
                      <th style={{ width: '200px' }}>Product & Farmer</th>
                      <th style={{ width: '100px' }}>Quantity</th>
                      <th style={{ width: '160px' }}>Route</th>
                      <th style={{ width: '120px' }}>Status</th>
                      <th style={{ width: '120px' }}>Expected Delivery</th>
                      <th style={{ width: '180px' }}>Tracking</th>
                      <th style={{ width: '160px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredShipments.map(shipment => (
                      <tr key={shipment.id}>
                        <td>
                          <div className="table-cell-content">
                            <div className="primary-text">ID: {shipment.shipmentId}</div>
                            <div className="secondary-text">Batch: {shipment.batchId}</div>
                            <div className="tertiary-text">
                              <Calendar size={12} />
                              Dispatched: {formatDate(shipment.dispatchDate)}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="table-cell-content">
                            <div className="primary-text">{shipment.product}</div>
                            <div className="secondary-text">
                              <User size={12} />
                              from {shipment.farmer}
                            </div>
                            <div className="tertiary-text">
                              <Phone size={12} />
                              {shipment.farmerPhone}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="table-cell-content">
                            <div className="primary-text">{shipment.quantity}</div>
                          </div>
                        </td>
                        <td>
                          <div className="table-cell-content">
                            <div className="route-display">
                              <div className="route-point">
                                <MapPin size={12} />
                                <span>{shipment.origin}</span>
                              </div>
                              <div className="route-arrow">
                                <ArrowDown size={12} />
                              </div>
                              <div className="route-point">
                                <Target size={12} />
                                <span>{shipment.destination}</span>
                              </div>
                              {shipment.currentLocation && (
                                <div className="current-location">
                                  <Navigation size={12} />
                                  <span>At: {shipment.currentLocation}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="table-cell-content">
                            {getStatusBadge(shipment.status)}
                            {shipment.status === 'in-transit' && (
                              <div className="condition-display">
                                <div className="condition-item">
                                  <Thermometer size={12} />
                                  <span>{shipment.temperature}</span>
                                </div>
                                <div className="condition-item">
                                  <Droplets size={12} />
                                  <span>{shipment.humidity}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="table-cell-content">
                            <div className="primary-text">{formatDate(shipment.expectedDelivery)}</div>
                            {shipment.status === 'delivered' && (
                              <div className="delivery-success">
                                <CheckCircle size={12} />
                                <span>On time</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="table-cell-content">
                            {shipment.trackingId && (
                              <div className="tracking-display">
                                <div className="tracking-item">
                                  <Activity size={12} />
                                  <span>{shipment.trackingId}</span>
                                </div>
                                <div className="tracking-item">
                                  <Car size={12} />
                                  <span>{shipment.vehicleNumber}</span>
                                </div>
                                <div className="tracking-item">
                                  <UserCheck size={12} />
                                  <span>{shipment.driverName}</span>
                                </div>
                                <div className="tracking-item">
                                  <Phone size={12} />
                                  <span>{shipment.driverPhone}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn btn-small btn-secondary"
                              onClick={() => openShipmentDetails(shipment)}
                            >
                              <Eye size={14} />
                              View
                            </button>
                            <button
                              className="btn btn-small btn-secondary"
                              onClick={() => openQRModal(shipment)}
                            >
                              <QrCode size={14} />
                              QR
                            </button>
                        
                              {(shipment.status !== 'delivered') && (
                              <button
                                className="btn btn-small btn-primary"
                                onClick={() => updateShipmentStatus(shipment.id, 'DELIVERED')}
                                title="Mark as Received"
                              >
                                <CheckCircle size={14} /> Receive
                              </button>
                            )}

                  
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredShipments.length === 0 && (
                  <div className="empty-state">
                    <Truck size={48} />
                    <h3>No shipments found</h3>
                    <p>No shipments match your current filters.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'inventory':
        return (
          <div className="dashboard-content">
            {/* Header */}
            <div className="header">
              <h1>Inventory & Quality Management</h1>
              <div className="header-actions">
                <button className="btn btn-primary" onClick={() => openInventoryModal()}>
                  <Plus size={16} />
                  Add Item
                </button>
                <button className="btn btn-secondary" onClick={() => exportData('inventory')}>
                  <Download size={16} />
                  Export
                </button>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="search-filter-bar">
              <div className="search-container">
                <Search className="search-icon" size={20} />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search inventory by product, location, or grade..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </div>
              <select
                className="filter-select"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <option value="">All Status</option>
                <option value="available">Available</option>
                <option value="low-stock">Low Stock</option>
                <option value="critical">Critical</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>
            </div>

            {/* Inventory Table */}
            <div className="table-section">
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th style={{ width: '180px' }}>Product Details</th>
                      <th style={{ width: '160px' }}>Quantity & Location</th>
                      <th style={{ width: '140px' }}>Quality & Grade</th>
                      <th style={{ width: '120px' }}>Pricing</th>
                      <th style={{ width: '160px' }}>Batch & Supplier</th>
                      <th style={{ width: '120px' }}>Expiry Date</th>
                      <th style={{ width: '100px' }}>Status</th>
                      <th style={{ width: '160px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInventory.map(item => (
                      <tr key={item.id}>
                        <td>
                          <div className="table-cell-content">
                            <div className="primary-text">{item.product}</div>
                            <div className="secondary-text">ID: {item.id}</div>
                            {item.notes && (
                              <div className="tertiary-text">
                                <FileText size={12} />
                                {item.notes}
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="table-cell-content">
                            <div className="primary-text">{item.quantity}</div>
                            <div className="secondary-text">
                              <Warehouse size={12} />
                              {item.location}
                            </div>
                            <div className="tertiary-text">
                              <Calendar size={12} />
                              Received: {formatDate(item.receivedDate)}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="table-cell-content">
                            <span className="grade-badge">{item.grade}</span>
                            <div className="quality-status">
                              {item.qualityChecked ? (
                                <div className="quality-approved">
                                  <CheckCircle size={12} />
                                  <span>Quality Approved</span>
                                </div>
                              ) : (
                                <div className="quality-pending">
                                  <Clock size={12} />
                                  <span>Pending Check</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="table-cell-content">
                            <div className="primary-text">{formatCurrency(item.pricePerKg)}/kg</div>
                            <div className="secondary-text">
                              Total: {formatCurrency(
                                parseFloat(item.quantity.replace(' kg', '') || 0) * item.pricePerKg
                              )}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="table-cell-content">
                            <div className="primary-text">Batch: {item.batchId}</div>
                            <div className="secondary-text">
                              <User size={12} />
                              {item.supplier}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="table-cell-content">
                            <div className="primary-text">{formatDate(item.expiryDate)}</div>
                            {new Date(item.expiryDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) && (
                              <div className="expiry-warning">
                                <AlertTriangle size={12} />
                                <span>Expires Soon</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="table-cell-content">
                            {getStatusBadge(item.status)}
                          </div>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn btn-small btn-edit"
                              onClick={() => openInventoryModal(item)}
                            >
                              <Edit size={14} />
                              Edit
                            </button>
                            <button
                              className="btn btn-small btn-secondary"
                              onClick={() => openQRModal(item)}
                            >
                              <QrCode size={14} />
                              QR
                            </button>
                            <button
                              className="btn btn-small btn-delete"
                              onClick={() => deleteInventoryItem(item.id)}
                            >
                              <Trash2 size={14} />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredInventory.length === 0 && (
                  <div className="empty-state">
                    <Package size={48} />
                    <h3>No inventory items found</h3>
                    <p>Add your first inventory item to get started.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'sales':
        return (
          <div className="dashboard-content">
            {/* Header */}
            <div className="header">
              <h1>Sales Orders Management</h1>
              <div className="header-actions">
                <button className="btn btn-primary" onClick={() => openOrderModal()}>
                  <Plus size={16} />
                  Create Order
                </button>
                <button className="btn btn-secondary" onClick={() => exportData('orders')}>
                  <Download size={16} />
                  Export
                </button>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="search-filter-bar">
              <div className="search-container">
                <Search className="search-icon" size={20} />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search orders by retailer, order ID..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </div>
              <select
                className="filter-select"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <option value="">All Status</option>
                <option value="pending-approval">Pending Approval</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <select
                className="filter-select"
                value={filters.retailer}
                onChange={(e) => setFilters({ ...filters, retailer: e.target.value })}
              >
                <option value="">All Retailers</option>
                {retailers.map(retailer => (
                  <option key={retailer.id} value={retailer.id}>{retailer.name}</option>
                ))}
              </select>
            </div>

            {/* Orders Table */}
            <div className="table-section">
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th style={{ width: '160px' }}>Order Details</th>
                      <th style={{ width: '160px' }}>Retailer Info</th>
                      <th style={{ width: '200px' }}>Products</th>
                      <th style={{ width: '120px' }}>Amount</th>
                      <th style={{ width: '140px' }}>Dates</th>
                      <th style={{ width: '120px' }}>Status</th>
                      <th style={{ width: '100px' }}>Payment Terms</th>
                      <th style={{ width: '180px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(filteredOrders || []).map(order => (
                      <tr key={order.id}>
                        <td>
                          <div className="table-cell-content">
                            <div className="primary-text">Order #{order.id}</div>
                            <div className="secondary-text">
                              <Calendar size={12} />
                              Created: {formatDate(order.orderDate)}
                            </div>
                            {order.notes && (
                              <div className="tertiary-text">
                                <FileText size={12} />
                                {order.notes}
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="table-cell-content">
                            <div className="primary-text">{order.retailerName}</div>
                            <div className="secondary-text">ID: {order.retailerUserId}</div>
                          </div>
                        </td>
                        <td>
                          <div className="table-cell-content">
                            {(order.products || order.lines || []).map((product, index) => (
                              <div key={index} className="product-display">
                                <div className="primary-text">{product.name} ({product.quantity})</div>
                                <div className="secondary-text">@ {formatCurrency(product.pricePerKg)}/kg</div>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td>
                          <div className="table-cell-content">
                            <div className="primary-text">{formatCurrency(order.totalAmount)}</div>
                          </div>
                        </td>
                        <td>
                          <div className="table-cell-content">
                            <div className="secondary-text">
                              <strong>Order:</strong> {formatDate(order.orderDate)}
                            </div>
                            <div className="secondary-text">
                              <strong>Delivery:</strong> {formatDate(order.deliveryDate)}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="table-cell-content">
                            {getStatusBadge(order.status)}
                          </div>
                        </td>
                        <td>
                          <div className="table-cell-content">
                            <div className="primary-text">{order.paymentTerms || 'Net 30'}</div>
                          </div>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn btn-small btn-edit"
                              onClick={() => openOrderModal(order)}
                            >
                              <Edit size={14} />
                              Edit
                            </button>
                            {order.status === 'pending-approval' && (
                              <button
                                className="btn btn-small btn-primary"
                                onClick={() => handleUpdateOrderStatus(order.id, 'confirmed')}
                              >
                                <CheckCircle size={14} />
                                Approve
                              </button>
                            )}
                            {order.status === 'confirmed' && (
                              <button
                                className="btn btn-small btn-primary"
                                onClick={() => handleUpdateOrderStatus(order.id, 'shipped')}
                              >
                                <Truck size={14} />
                                Ship
                              </button>
                            )}
                            <button
                              className="btn btn-small btn-delete"
                              onClick={() => deleteOrder(order.id)}
                            >
                              <Trash2 size={14} />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredOrders.length === 0 && (
                  <div className="empty-state">
                    <ShoppingCart size={48} />
                    <h3>No sales orders found</h3>
                    <p>Create your first sales order to get started.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'retailers':
        return (
          <div className="dashboard-content">
            {/* Header */}
            <div className="header">
              <h1>Retailer Directory</h1>
              <div className="header-actions">
                <button className="btn btn-primary" onClick={() => openRetailerModal()}>
                  <Plus size={16} />
                  Add Retailer
                </button>
                <button className="btn btn-secondary" onClick={() => exportData('retailers')}>
                  <Download size={16} />
                  Export
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="search-filter-bar">
              <div className="search-container">
                <Search className="search-icon" size={20} />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search retailers by name, contact, or location..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </div>
            </div>

            {/* Retailer Grid */}
            <div className="retailer-grid">
              {filteredRetailers.map(retailer => (
                <div key={retailer.id} className="retailer-card">
                  <div className="retailer-header">
                    <h3>{retailer.name}</h3>
                    <div className="retailer-rating">
                      <Star size={16} fill="currentColor" />
                      {retailer.rating}
                    </div>
                  </div>

                  <div className="retailer-details">
                    <div className="detail-item">
                      <User size={16} />
                      <span>{retailer.contact}</span>
                    </div>
                    <div className="detail-item">
                      <Phone size={16} />
                      <span>{retailer.phone}</span>
                    </div>
                    {retailer.email && (
                      <div className="detail-item">
                        <Mail size={16} />
                        <span>{retailer.email}</span>
                      </div>
                    )}
                    <div className="detail-item">
                      <MapPin size={16} />
                      <span>{retailer.location}</span>
                    </div>
                    <div className="detail-item">
                      <CreditCard size={16} />
                      <span>Credit: {formatCurrency(retailer.creditLimit)}</span>
                    </div>
                    <div className="detail-item">
                      <DollarSign size={16} />
                      <span>Outstanding: {formatCurrency(retailer.outstandingAmount)}</span>
                    </div>
                  </div>

                  <div className="retailer-preferences">
                    <h4>Preferred Products</h4>
                    <div className="product-tags">
                      {retailer.preferredProducts.map((product, index) => (
                        <span key={index} className="product-tag">{product}</span>
                      ))}
                    </div>
                  </div>

                  <div className="retailer-details">
                    <div className="detail-item">
                      <ShoppingCart size={16} />
                      <span>Total Orders: {retailer.totalOrders}</span>
                    </div>
                    <div className="detail-item">
                      <Calendar size={16} />
                      <span>Last Order: {formatDate(retailer.lastOrderDate)}</span>
                    </div>
                  </div>

                  {retailer.notes && (
                    <div className="retailer-details">
                      <div className="detail-item">
                        <FileText size={16} />
                        <span>{retailer.notes}</span>
                      </div>
                    </div>
                  )}

                  <div className="retailer-actions">
                    <button
                      className="btn btn-small btn-primary"
                      onClick={() => {
                        setOrderFormData({ ...orderFormData, retailerUserId: retailer.id });
                        openOrderModal();
                      }}
                    >
                      <Plus size={16} />
                      New Order
                    </button>
                    <button
                      className="btn btn-small btn-edit"
                      onClick={() => openRetailerModal(retailer)}
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                    <button
                      className="btn btn-small btn-delete"
                      onClick={() => deleteRetailer(retailer.id)}
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredRetailers.length === 0 && (
              <div className="empty-state">
                <Users size={48} />
                <h3>No retailers found</h3>
                <p>Add your first retailer to start building your network.</p>
              </div>
            )}
          </div>
        );

      case 'analytics':
        return (
          <div className="analytics-placeholder">
            <BarChart3 size={64} />
            <p>Advanced Sales Analytics Coming Soon!</p>
            <span>Track revenue trends, retailer performance, and inventory analytics</span>
            <button
              className="btn btn-primary"
              style={{ marginTop: '20px' }}
              onClick={() => setIsAnalyticsModalOpen(true)}
            >
              <BarChart3 size={16} />
              View Basic Analytics
            </button>
          </div>
        );

      case 'calendar':
        return (
          <div className="calendar-placeholder">
            <Calendar size={64} />
            <p>Calendar & Scheduling Coming Soon!</p>
            <span>Schedule deliveries, track order deadlines, and manage appointments</span>
          </div>
        );

      case 'settings':
        return (
          <div className="dashboard-content">
            <div className="header">
              <h1>Settings & Configuration</h1>
              <div className="header-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => setIsSettingsModalOpen(true)}
                >
                  <Settings size={16} />
                  Manage Settings
                </button>
              </div>
            </div>

            <div className="dashboard-grid">
              <div className="dashboard-card">
                <h3>Company Information</h3>
                <div className="settings-info">
                  <div><strong>Company:</strong> {settingsData.companyName}</div>
                  <div><strong>Location:</strong> {settingsData.location}</div>
                  <div><strong>License:</strong> {settingsData.license}</div>
                  <div><strong>Email:</strong> {settingsData.email}</div>
                  <div><strong>Phone:</strong> {settingsData.phone}</div>
                </div>
              </div>

              <div className="dashboard-card">
                <h3>Warehouse Details</h3>
                <div className="settings-info">
                  <div><strong>Address:</strong> {settingsData.warehouse.address}</div>
                  <div><strong>Capacity:</strong> {settingsData.warehouse.capacity} kg</div>
                  <div><strong>Current Stock:</strong> {settingsData.warehouse.currentOccupancy} kg</div>
                  <div><strong>Utilization:</strong> {
                    ((parseFloat(settingsData.warehouse.currentOccupancy) / parseFloat(settingsData.warehouse.capacity)) * 100).toFixed(1)
                  }%</div>
                </div>
              </div>

              <div className="dashboard-card">
                <h3>Notification Preferences</h3>
                <div className="settings-info">
                  <div><strong>Email Alerts:</strong> {settingsData.notifications.emailAlerts ? '✅ Enabled' : '❌ Disabled'}</div>
                  <div><strong>SMS Alerts:</strong> {settingsData.notifications.smsAlerts ? '✅ Enabled' : '❌ Disabled'}</div>
                  <div><strong>Push Notifications:</strong> {settingsData.notifications.pushNotifications ? '✅ Enabled' : '❌ Disabled'}</div>
                  <div><strong>Inventory Alerts:</strong> {settingsData.notifications.inventoryAlerts ? '✅ Enabled' : '❌ Disabled'}</div>
                  <div><strong>Order Alerts:</strong> {settingsData.notifications.orderAlerts ? '✅ Enabled' : '❌ Disabled'}</div>
                </div>
              </div>

              <div className="dashboard-card">
                <h3>System Status</h3>
                <div className="settings-info">
                  <div><strong>Database:</strong> ✅ Connected</div>
                  <div><strong>Last Backup:</strong> {new Date().toLocaleDateString()}</div>
                  <div><strong>System Version:</strong> v2.1.0</div>
                  <div><strong>Active Sessions:</strong> 1</div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="analytics-placeholder">
            <Settings size={64} />
            <p>Section Under Development</p>
            <span>This feature is coming soon!</span>
          </div>
        );
    }
  };

  return (
    <div className="farmer-dashboard">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-section">
            <img
              src={farmchainxLogo}
              alt="FarmChainX"
              className="sidebar-logo"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <span className="logo-text">FarmChainX</span>
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
          <button className="nav-item logout-btn" onClick={handleLogout}>
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
            <button
              className="notification-btn"
              onClick={handleNotificationClick}
            >
              <Bell size={20} />
              {distributorStats.unreadNotifications > 0 && (
                <span className="notification-badge">
                  {distributorStats.unreadNotifications}
                </span>
              )}
            </button>
            <div className="profile-section">
              <div className="profile-info">
                <div className="profile-name">{distributorProfile.name}</div>
                <div className="profile-subtitle">{distributorProfile.company}</div>
              </div>
              <div className="profile-avatar">
                {distributorProfile.avatar ? (
                  <img src={distributorProfile.avatar} alt={distributorProfile.name} />
                ) : (
                  <User size={20} />
                )}
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

      {/* Modals */}

      {/* Add/Edit Retailer Modal */}
      {isRetailerModalOpen && (
        <div className="modal-overlay" onClick={() => setIsRetailerModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingRetailer ? 'Edit Retailer' : 'Add New Retailer'}</h2>
              <button
                className="close-btn"
                onClick={() => setIsRetailerModalOpen(false)}
              >
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">
                    <User size={16} />
                    Retailer Name *
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={retailerFormData.name}
                    onChange={(e) => setRetailerFormData({ ...retailerFormData, name: e.target.value })}
                    placeholder="Enter retailer business name"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <User size={16} />
                    Contact Person *
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={retailerFormData.contact}
                    onChange={(e) => setRetailerFormData({ ...retailerFormData, contact: e.target.value })}
                    placeholder="Enter contact person name"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <Phone size={16} />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    className="form-input"
                    value={retailerFormData.phone}
                    onChange={(e) => setRetailerFormData({ ...retailerFormData, phone: e.target.value })}
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <Mail size={16} />
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="form-input"
                    value={retailerFormData.email}
                    onChange={(e) => setRetailerFormData({ ...retailerFormData, email: e.target.value })}
                    placeholder="Enter email address"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <MapPin size={16} />
                    Location
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={retailerFormData.location}
                    onChange={(e) => setRetailerFormData({ ...retailerFormData, location: e.target.value })}
                    placeholder="Enter business location"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <CreditCard size={16} />
                    Credit Limit (₹)
                  </label>
                  <input
                    type="number"
                    className="form-input"
                    value={retailerFormData.creditLimit}
                    onChange={(e) => setRetailerFormData({ ...retailerFormData, creditLimit: e.target.value })}
                    placeholder="Enter credit limit"
                  />
                </div>
                <div className="form-group full-width">
                  <label className="form-label">
                    <FileText size={16} />
                    Notes
                  </label>
                  <textarea
                    className="form-textarea"
                    value={retailerFormData.notes}
                    onChange={(e) => setRetailerFormData({ ...retailerFormData, notes: e.target.value })}
                    placeholder="Add any additional notes about this retailer"
                    rows={3}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setIsRetailerModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={saveRetailer}
              >
                {editingRetailer ? 'Update Retailer' : 'Add Retailer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Order Modal */}
      {isOrderModalOpen && (
        <div className="modal-overlay" onClick={() => setIsOrderModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingOrder ? 'Edit Sales Order' : 'Create New Sales Order'}</h2>
              <button
                className="close-btn"
                onClick={() => setIsOrderModalOpen(false)}
              >
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">
                    <Users size={16} />
                    Select Retailer *
                  </label>
                  <select
                    className="form-select"
                    value={orderFormData.retailerUserId}
                    onChange={(e) => setOrderFormData({ ...orderFormData, retailerUserId: e.target.value })}
                  >
                    <option value="">Choose a retailer</option>
                    {retailers.map(retailer => (
                      <option key={retailer.id} value={retailer.id}>
                        {retailer.name} - {retailer.location}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <Calendar size={16} />
                    Delivery Date *
                  </label>
                  <input
                    type="date"
                    className="form-input"
                    value={orderFormData.deliveryDate}
                    onChange={(e) => setOrderFormData({ ...orderFormData, deliveryDate: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <CreditCard size={16} />
                    Payment Terms
                  </label>
                  <select
                    className="form-select"
                    value={orderFormData.paymentTerms}
                    onChange={(e) => setOrderFormData({ ...orderFormData, paymentTerms: e.target.value })}
                  >
                    <option value="Net 15">Net 15 Days</option>
                    <option value="Net 30">Net 30 Days</option>
                    <option value="COD">Cash on Delivery</option>
                    <option value="Advance">Advance Payment</option>
                  </select>
                </div>
                <div className="form-group full-width">
                  <label className="form-label">
                    <Package size={16} />
                    Products *
                  </label>
                  {orderFormData.products.map((product, index) => (
                    <div key={index} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '12px', marginBottom: '12px', alignItems: 'center' }}>
                      <select
                        className="form-select"
                        value={product.name}
                        onChange={(e) => {
                          const newProducts = [...orderFormData.products];
                          newProducts[index].name = e.target.value;
                          // Auto-fill price from inventory
                          const inventoryItem = inventory.find(item => item.product === e.target.value);
                          if (inventoryItem) {
                            newProducts[index].pricePerKg = inventoryItem.pricePerKg;
                          }
                          setOrderFormData({ ...orderFormData, products: newProducts });
                        }}
                      >
                        <option value="">Select Product</option>
                        {inventory.filter(item => item.status === 'available').map(item => (
                          <option key={item.id} value={item.product}>
                            {item.product} (Available: {item.quantity})
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        className="form-input"
                        placeholder="Quantity (kg)"
                        value={product.quantity}
                        onChange={(e) => {
                          const newProducts = [...orderFormData.products];
                          newProducts[index].quantity = e.target.value;
                          setOrderFormData({ ...orderFormData, products: newProducts });
                        }}
                      />
                      <input
                        type="number"
                        className="form-input"
                        placeholder="Price per kg"
                        value={product.pricePerKg}
                        onChange={(e) => {
                          const newProducts = [...orderFormData.products];
                          newProducts[index].pricePerKg = e.target.value;
                          setOrderFormData({ ...orderFormData, products: newProducts });
                        }}
                      />
                      {orderFormData.products.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-small btn-delete"
                          onClick={() => {
                            const newProducts = orderFormData.products.filter((_, i) => i !== index);
                            setOrderFormData({ ...orderFormData, products: newProducts });
                          }}
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn btn-small btn-secondary"
                    onClick={() => {
                      setOrderFormData({
                        ...orderFormData,
                        products: [...orderFormData.products, { name: '', quantity: '', pricePerKg: '' }]
                      });
                    }}
                    style={{ marginTop: '8px' }}
                  >
                    <Plus size={16} />
                    Add Product
                  </button>
                </div>
                <div className="form-group full-width">
                  <label className="form-label">
                    <FileText size={16} />
                    Order Notes
                  </label>
                  <textarea
                    className="form-textarea"
                    value={orderFormData.notes}
                    onChange={(e) => setOrderFormData({ ...orderFormData, notes: e.target.value })}
                    placeholder="Add any special instructions or notes"
                    rows={3}
                  />
                </div>
              </div>
              {/* Order Total Display */}
              <div style={{ marginTop: '20px', padding: '16px', background: '#f8fafc', borderRadius: '8px' }}>
                <strong>Order Total: {formatCurrency(
                  orderFormData.products.reduce((sum, product) =>
                    sum + (parseFloat(product.quantity || 0) * parseFloat(product.pricePerKg || 0)), 0
                  )
                )}</strong>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setIsOrderModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleCreateOrder(orderFormData)}
              >
                {editingOrder ? 'Update Order' : 'Create Order'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Inventory Modal */}
      {isInventoryModalOpen && (
        <div className="modal-overlay" onClick={() => setIsInventoryModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingInventory ? 'Edit Inventory Item' : 'Add New Inventory Item'}</h2>
              <button
                className="close-btn"
                onClick={() => setIsInventoryModalOpen(false)}
              >
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
                    className="form-input"
                    value={inventoryFormData.product}
                    onChange={(e) => setInventoryFormData({ ...inventoryFormData, product: e.target.value })}
                    placeholder="Enter product name"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Batch ID</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g., WHEAT-2025-07-B01"
                    value={inventoryFormData.batchId}
                    onChange={e => setInventoryFormData({ ...inventoryFormData, batchId: e.target.value })}
                  />

                </div>
                <div className="form-group">
                  <label className="form-label">
                    <Target size={16} />
                    Quantity (kg) *
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={inventoryFormData.quantity}
                    onChange={(e) => setInventoryFormData({ ...inventoryFormData, quantity: e.target.value })}
                    placeholder="e.g., 1000 kg"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <Warehouse size={16} />
                    Storage Location
                  </label>
                  <select
                    className="form-select"
                    value={inventoryFormData.location}
                    onChange={(e) => setInventoryFormData({ ...inventoryFormData, location: e.target.value })}
                  >
                    <option value="">Select Location</option>
                    <option value="Warehouse A">Warehouse A</option>
                    <option value="Warehouse B">Warehouse B</option>
                    <option value="Cold Storage A">Cold Storage A</option>
                    <option value="Cold Storage B">Cold Storage B</option>
                    <option value="Dry Storage">Dry Storage</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <Star size={16} />
                    Grade
                  </label>
                  <select
                    className="form-select"
                    value={inventoryFormData.grade}
                    onChange={(e) => setInventoryFormData({ ...inventoryFormData, grade: e.target.value })}
                  >
                    <option value="">Select Grade</option>
                    <option value="Grade A">Grade A</option>
                    <option value="Grade A+">Grade A+</option>
                    <option value="Grade B">Grade B</option>
                    <option value="Grade B+">Grade B+</option>
                    <option value="Grade C">Grade C</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <DollarSign size={16} />
                    Price per kg (₹) *
                  </label>
                  <input
                    type="number"
                    className="form-input"
                    value={inventoryFormData.pricePerKg}
                    onChange={(e) => setInventoryFormData({ ...inventoryFormData, pricePerKg: e.target.value })}
                    placeholder="Enter price per kg"
                    step="0.01"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <Calendar size={16} />
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    className="form-input"
                    value={inventoryFormData.expiryDate}
                    onChange={(e) => setInventoryFormData({ ...inventoryFormData, expiryDate: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="form-group full-width">
                  <label className="form-label">
                    <CheckCircle size={16} />
                    Quality Status
                  </label>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="checkbox"
                        checked={inventoryFormData.qualityChecked}
                        onChange={(e) => setInventoryFormData({ ...inventoryFormData, qualityChecked: e.target.checked })}
                      />
                      Quality Checked & Approved
                    </label>
                  </div>
                </div>
                <div className="form-group full-width">
                  <label className="form-label">
                    <FileText size={16} />
                    Notes
                  </label>
                  <textarea
                    className="form-textarea"
                    value={inventoryFormData.notes}
                    onChange={(e) => setInventoryFormData({ ...inventoryFormData, notes: e.target.value })}
                    placeholder="Add any additional notes about this inventory item"
                    rows={3}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setIsInventoryModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={saveInventory}
              >
                {editingInventory ? 'Update Item' : 'Add Item'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shipment Details Modal */}
      {isShipmentDetailsModalOpen && selectedShipment && (
        <div className="modal-overlay" onClick={() => setIsShipmentDetailsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Shipment Details - {selectedShipment.id}</h2>
              <button
                className="close-btn"
                onClick={() => setIsShipmentDetailsModalOpen(false)}
              >
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Shipment ID</label>
                  <div className="form-display">{selectedShipment.id}</div>
                </div>
                <div className="form-group">
                  <label className="form-label">Batch ID</label>
                  <div className="form-display">{selectedShipment.batchId}</div>
                </div>
                <div className="form-group">
                  <label className="form-label">Product</label>
                  <div className="form-display">{selectedShipment.product}</div>
                </div>
                <div className="form-group">
                  <label className="form-label">Quantity</label>
                  <div className="form-display">{selectedShipment.quantity}</div>
                </div>
                <div className="form-group">
                  <label className="form-label">Farmer</label>
                  <div className="form-display">{selectedShipment.farmer}</div>
                </div>
                <div className="form-group">
                  <label className="form-label">Farmer Contact</label>
                  <div className="form-display">{selectedShipment.farmerPhone}</div>
                </div>
                <div className="form-group">
                  <label className="form-label">Origin</label>
                  <div className="form-display">{selectedShipment.origin}</div>
                </div>
                <div className="form-group">
                  <label className="form-label">Destination</label>
                  <div className="form-display">{selectedShipment.destination}</div>
                </div>
                <div className="form-group">
                  <label className="form-label">Dispatch Date</label>
                  <div className="form-display">{formatDate(selectedShipment.dispatchDate)}</div>
                </div>
                <div className="form-group">
                  <label className="form-label">Expected Delivery</label>
                  <div className="form-display">{formatDate(selectedShipment.expectedDelivery)}</div>
                </div>
                <div className="form-group">
                  <label className="form-label">Current Status</label>
                  <div className="form-display">{getStatusBadge(selectedShipment.status)}</div>
                </div>
                <div className="form-group">
                  <label className="form-label">Current Location</label>
                  <div className="form-display">{selectedShipment.currentLocation}</div>
                </div>
                {selectedShipment.trackingId && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Tracking ID</label>
                      <div className="form-display">{selectedShipment.trackingId}</div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Vehicle Number</label>
                      <div className="form-display">{selectedShipment.vehicleNumber}</div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Driver Name</label>
                      <div className="form-display">{selectedShipment.driverName}</div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Driver Contact</label>
                      <div className="form-display">{selectedShipment.driverPhone}</div>
                    </div>
                  </>
                )}
                {selectedShipment.status === 'in-transit' && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Current Temperature</label>
                      <div className="form-display">{selectedShipment.temperature}</div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Current Humidity</label>
                      <div className="form-display">{selectedShipment.humidity}</div>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setIsShipmentDetailsModalOpen(false)}
              >
                Close
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  openQRModal(selectedShipment);
                  setIsShipmentDetailsModalOpen(false);
                }}
              >
                <QrCode size={16} />
                Generate QR Code
              </button>
              {selectedShipment.status === 'in-transit' && (
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    updateShipmentStatus(selectedShipment.id, 'delivered');
                    setIsShipmentDetailsModalOpen(false);
                  }}
                >
                  <CheckCircle size={16} />
                  Mark as Delivered
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {isQRModalOpen && selectedQRData && (
        <div className="modal-overlay" onClick={() => setIsQRModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h2>QR Code - {selectedQRData.id || selectedQRData.batchId}</h2>
              <button
                className="close-btn"
                onClick={() => setIsQRModalOpen(false)}
              >
                <X size={24} />
              </button>
            </div>
            <div className="modal-body" style={{ textAlign: 'center' }}>
              <div className="qr-center">
                <QRCode
                  value={JSON.stringify({
                    id: selectedQRData.id,
                    batchId: selectedQRData.batchId,
                    product: selectedQRData.product,
                    type: selectedQRData.type || 'shipment',
                    distributor: distributorProfile.company,
                    timestamp: new Date().toISOString()
                  })}
                  size={256}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <div style={{ marginTop: '20px', textAlign: 'left' }}>
                <p><strong>Item:</strong> {selectedQRData.product}</p>
                <p><strong>ID:</strong> {selectedQRData.id}</p>
                <p><strong>Batch:</strong> {selectedQRData.batchId}</p>
                <p><strong>Distributor:</strong> {distributorProfile.company}</p>
                {selectedQRData.quantity && (
                  <p><strong>Quantity:</strong> {selectedQRData.quantity}</p>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setIsQRModalOpen(false)}
              >
                Close
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  // Print QR code
                  const printWindow = window.open('', '_blank');
                  printWindow.document.write(`
                    <html>
                      <head><title>QR Code - ${selectedQRData.id}</title></head>
                      <body style="display: flex; flex-direction: column; align-items: center; padding: 20px;">
                        <h2>${selectedQRData.product}</h2>
                        <div>${document.querySelector('.qr-center').innerHTML}</div>
                        <div style="margin-top: 20px;">
                          <p><strong>ID:</strong> ${selectedQRData.id}</p>
                          <p><strong>Batch:</strong> ${selectedQRData.batchId}</p>
                          <p><strong>Distributor:</strong> ${distributorProfile.company}</p>
                          ${selectedQRData.quantity ? `<p><strong>Quantity:</strong> ${selectedQRData.quantity}</p>` : ''}
                        </div>
                      </body>
                    </html>
                  `);
                  printWindow.document.close();
                  printWindow.focus();
                  printWindow.print();
                }}
              >
                <Download size={16} />
                Print QR Code
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {isSettingsModalOpen && (
        <div className="modal-overlay" onClick={() => setIsSettingsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Settings & Configuration</h2>
              <button
                className="close-btn"
                onClick={() => setIsSettingsModalOpen(false)}
              >
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Company Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={settingsData.companyName}
                    onChange={(e) => setSettingsData({ ...settingsData, companyName: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    className="form-input"
                    value={settingsData.location}
                    onChange={(e) => setSettingsData({ ...settingsData, location: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">License Number</label>
                  <input
                    type="text"
                    className="form-input"
                    value={settingsData.license}
                    onChange={(e) => setSettingsData({ ...settingsData, license: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-input"
                    value={settingsData.email}
                    onChange={(e) => setSettingsData({ ...settingsData, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input
                    type="tel"
                    className="form-input"
                    value={settingsData.phone}
                    onChange={(e) => setSettingsData({ ...settingsData, phone: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Warehouse Capacity (kg)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={settingsData.warehouse.capacity}
                    onChange={(e) => setSettingsData({
                      ...settingsData,
                      warehouse: { ...settingsData.warehouse, capacity: e.target.value }
                    })}
                  />
                </div>
                <div className="form-group full-width">
                  <label className="form-label">Warehouse Address</label>
                  <textarea
                    className="form-textarea"
                    value={settingsData.warehouse.address}
                    onChange={(e) => setSettingsData({
                      ...settingsData,
                      warehouse: { ...settingsData.warehouse, address: e.target.value }
                    })}
                    rows={3}
                  />
                </div>
                <div className="form-group full-width">
                  <label className="form-label">Notification Preferences</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginTop: '8px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="checkbox"
                        checked={settingsData.notifications.emailAlerts}
                        onChange={(e) => setSettingsData({
                          ...settingsData,
                          notifications: { ...settingsData.notifications, emailAlerts: e.target.checked }
                        })}
                      />
                      Email Alerts
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="checkbox"
                        checked={settingsData.notifications.smsAlerts}
                        onChange={(e) => setSettingsData({
                          ...settingsData,
                          notifications: { ...settingsData.notifications, smsAlerts: e.target.checked }
                        })}
                      />
                      SMS Alerts
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="checkbox"
                        checked={settingsData.notifications.pushNotifications}
                        onChange={(e) => setSettingsData({
                          ...settingsData,
                          notifications: { ...settingsData.notifications, pushNotifications: e.target.checked }
                        })}
                      />
                      Push Notifications
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="checkbox"
                        checked={settingsData.notifications.inventoryAlerts}
                        onChange={(e) => setSettingsData({
                          ...settingsData,
                          notifications: { ...settingsData.notifications, inventoryAlerts: e.target.checked }
                        })}
                      />
                      Inventory Alerts
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="checkbox"
                        checked={settingsData.notifications.orderAlerts}
                        onChange={(e) => setSettingsData({
                          ...settingsData,
                          notifications: { ...settingsData.notifications, orderAlerts: e.target.checked }
                        })}
                      />
                      Order Alerts
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setIsSettingsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={saveSettings}
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Modal */}
      {isAnalyticsModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAnalyticsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px' }}>
            <div className="modal-header">
              <h2>Sales Analytics Dashboard</h2>
              <button
                className="close-btn"
                onClick={() => setIsAnalyticsModalOpen(false)}
              >
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <div className="analytics-grid">
                <div className="analytics-card">
                  <h4>Revenue Overview</h4>
                  <div className="analytics-stat">
                    <span className="stat-value">{formatCurrency(distributorStats.totalRevenue)}</span>
                    <span className="stat-label">Total Revenue</span>
                  </div>
                  <div className="analytics-stat">
                    <span className="stat-value">{formatCurrency(distributorStats.totalRevenue / 30)}</span>
                    <span className="stat-label">Avg Daily Revenue</span>
                  </div>
                </div>

                <div className="analytics-card">
                  <h4>Order Statistics</h4>
                  <div className="analytics-stat">
                    <span className="stat-value">{distributorStats.totalSalesOrders}</span>
                    <span className="stat-label">Total Orders</span>
                  </div>
                  <div className="analytics-stat">
                    <span className="stat-value">{distributorStats.pendingSales}</span>
                    <span className="stat-label">Pending Orders</span>
                  </div>
                </div>

                <div className="analytics-card">
                  <h4>Inventory Status</h4>
                  <div className="analytics-stat">
                    <span className="stat-value">{distributorStats.totalInventory.toFixed(0)} kg</span>
                    <span className="stat-label">Total Stock</span>
                  </div>
                  <div className="analytics-stat">
                    <span className="stat-value">{distributorStats.lowStockItems}</span>
                    <span className="stat-label">Low Stock Items</span>
                  </div>
                </div>

                <div className="analytics-card">
                  <h4>Retailer Performance</h4>
                  <div className="retailer-performance">
                    {retailers.slice(0, 5).map(retailer => (
                      <div key={retailer.id} className="performance-item">
                        <span className="retailer-name">{retailer.name}</span>
                        <span className="order-count">{retailer.totalOrders} orders</span>
                        <span className="retailer-rating">⭐ {retailer.rating}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setIsAnalyticsModalOpen(false)}
              >
                Close
              </button>
              <button
                className="btn btn-primary"
                onClick={() => exportData('analytics')}
              >
                <Download size={16} />
                Export Analytics
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DistributorDashboard;
