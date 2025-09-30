import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus, Search, Filter, Edit, Trash2, Download, X, Upload, MapPin, User, Settings,
  BarChart3, Calendar, Bell, Menu, LogOut, Home, Sprout, TrendingUp, DollarSign,
  Cloud, Thermometer, Truck, Package, Send, Users, CheckCircle, Clock, AlertCircle,
  Eye, QrCode, Target, Droplets, Sun, Wind, Activity, FileText, Phone, Mail,
  Building2, CreditCard, ArrowRight, AlertTriangle, Navigation, Warehouse, Star,
  Calculator, PieChart, BookOpen, Shield, RefreshCw, Brain
} from 'lucide-react';
import './CropManagementSystem.css';
import CropHealthDetector from './CropHealthDetector';
import QRCode from 'react-qr-code';
import logo from './assets/farmchainxLogo.png';
import apiService from './conc/api';

const CropManagementSystem = () => {
  // Core State Management
  const [crops, setCrops] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [loadingCrops, setLoadingCrops] = useState(false);
  const [loadingShipments, setLoadingShipments] = useState(false);
  const [cropError, setCropError] = useState(null);
  const [shipmentError, setShipmentError] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  // near other useState calls
  const [distributors, setDistributors] = useState([]);


  // Loading states - ADDED FOR API INTEGRATION
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShipmentModalOpen, setIsShipmentModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isWeatherModalOpen, setIsWeatherModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [qrModalCrop, setQrModalCrop] = useState(null);

  // Edit States
  const [editingCrop, setEditingCrop] = useState(null);
  const [editingExpense, setEditingExpense] = useState(null);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [filters, setFilters] = useState({
    cropType: '',
    status: '',
    search: '',
    dateRange: '',
    customer: ''
  });


  // Form Data States
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    area: '',
    quantity: '',
    soilType: '',
    status: '',
    plantedDate: '',
    harvestDate: '',
    gpsCoordinates: '',
    pesticides: '',
    notes: '',
    image: '',
    pricePerKg: '',
    waterRequirement: '',
    expectedYield: ''
  });

  const [shipmentData, setShipmentData] = useState({
    cropId: '',
    distributorUserId: '',
    destinationLocation: '',
    quantity: '',
    notes: '',
    pricePerKg: ''
  });
  
  const [expenseData, setExpenseData] = useState({
    category: '',
    description: '',
    amount: '',
    date: '',
    cropId: '',
    receiptImage: null
  });

  const [customerData, setCustomerData] = useState({
    name: '',
    contact: '',
    phone: '',
    email: '',
    location: '',
    preferredCrops: [],
    notes: '',
    creditLimit: ''
  });

  // state
  const [imagePreview, setImagePreview] = useState(null);

  // helpers
  const fileToDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert('Max 10MB');
      return;
    }
    const dataUrl = await fileToDataUrl(file);
    setImagePreview(dataUrl);
    setFormData((prev) => ({ ...prev, image_url: dataUrl }));
  };


  const normalizeCrop = (c) => ({
    ...c,
    soilType: c.soilType ?? c.soil_type ?? "",
    image: c.image ?? c.image_url ?? "",
    quantity: c.quantity ?? c.quantityKg ?? 0,
    pricePerKg: c.pricePerKg ?? c.unitPrice ?? 0,
    batchId: c.batchId ?? c.batchCode ?? c.batchcode ?? "",
  });

  const normalizeShipment = (s) => {
    const statusRaw = (s.status || "").toString().toUpperCase();
    const status =
      statusRaw === "IN_TRANSIT" ? "in-transit" :
        statusRaw === "DELIVERED" ? "delivered" :
          statusRaw === "CREATED" ? "created" :
            (s.status || "");

    const quantity = s.quantity ?? s.quantityKg ?? s.totalQuantity ?? s.qty ?? 0;

    // Prefer server timestamps
    const dispatchDate = s.dispatchDate || s.dateCreated || s.createdAt || null;
    const expectedDelivery = s.expectedDelivery || s.etd || s.eta || null;

    // Names and locations
    const product = s.product || s.cropName || s.itemName || s.crop?.name || (s.items?.[0]?.cropName) || "—";
    const farmer = s.farmer || s.farmerName || s.fromName || s.fromUser?.fullName || "—";
    const farmerPhone = s.farmerPhone || s.fromPhone || s.contact || s.fromUser?.phone || "—";
    const origin = s.origin || s.source || s.fromLocation || s.originLocation || "—";
    const destination = s.destination || s.toLocation || s.destinationLocation || s.distributorName || "—";

    // IDs and codes
    const id = s.id ?? s.shipmentId ?? s.shipmentID ?? s.sid ?? "";
    const batchId = s.batchId ?? s.batchCode ?? s.batchcode ?? s.batch ?? s.crop?.batchCode ?? "";
    const shipmentId = s.shipmentId || s.shipmentId || s.awb || s.shipmentId || "";

    // Vehicle/driver/telemetry
    const vehicleNumber = s.vehicleNumber || s.vehicle || "";
    const driverName = s.driverName || s.driver || "";
    const driverPhone = s.driverPhone || "";
    const temperature = s.temperature ?? s.temp ?? "";
    const humidity = s.humidity ?? s.rh ?? "";

    const items = Array.isArray(s.items)
      ? s.items.map((it) => ({
        cropId: it.cropId ?? it.crop?.id ?? null,
        quantityKg: it.quantityKg ?? it.quantity ?? 0,
        cropName: it.cropName ?? it.crop?.name ?? "",
      }))
      : [];

    return {
      ...s,
      id,
      batchId,
      shipmentId,
      status,
      quantity,
      dispatchDate,
      expectedDelivery,
      product,
      farmer,
      farmerPhone,
      origin,
      destination,
      vehicleNumber,
      driverName,
      driverPhone,
      temperature,
      humidity,
      items,
    };
  };

  const allocatedFromShipments = (cropId, shipments) =>
    (Array.isArray(shipments) ? shipments : [])
      .filter((s) => ["CREATED", "IN_TRANSIT", "DELIVERED"].includes(s.status))
      .flatMap((s) => Array.isArray(s.items) ? s.items : [])
      .filter((it) => it.cropId === cropId)
      .reduce((sum, it) => sum + (it.quantityKg || 0), 0);

  const [weatherData, setWeatherData] = useState({
    temperature: '28°C',
    humidity: '65%',
    rainfall: '12mm',
    windSpeed: '15 km/h',
    forecast: 'Partly cloudy with chance of light rain',
    uvIndex: '6 (High)',
    soilMoisture: '45%'
  });

  const [settingsData, setSettingsData] = useState({
    farmName: 'Ujwal Farm',
    location: 'Maharashtra, India',
    totalArea: '45 acres',
    email: 'farmer@farmchainx.com',
    phone: '+91 98765 43210',
    notifications: {
      cropAlerts: true,
      weatherAlerts: true,
      shipmentUpdates: true,
      expenseReminders: true
    }
  });

  // Mock farmer profile
  const [farmerProfile] = useState({
    name: 'Farmer',
    farmName: 'Ujwal Farm',
    location: 'Maharashtra, India',
    totalArea: '45 acres',
    avatar: null
  });

  // // Mock distributors and expense categories
  // const [distributors] = useState([
  //   { id: 'DIST001', name: 'AgriDistribute Solutions', location: 'Mumbai, MH', contact: '+91 98765 12345' },
  //   { id: 'DIST002', name: 'FreshCorp Logistics', location: 'Pune, MH', contact: '+91 98765 54321' },
  //   { id: 'DIST003', name: 'GreenChain Distribution', location: 'Nashik, MH', contact: '+91 98765 67890' },
  //   { id: 'DIST004', name: 'Farm2Market Hub', location: 'Aurangabad, MH', contact: '+91 98765 09876' }
  // ]);

  const expenseCategories = [
    'Seeds & Planting', 'Fertilizers', 'Pesticides', 'Irrigation', 'Labor',
    'Equipment', 'Fuel', 'Transportation', 'Storage', 'Marketing', 'Insurance', 'Other'
  ];
  

  useEffect(() => {
    console.log('=== AUTH DEBUG ===');
    console.log('Auth token from localStorage:', localStorage.getItem('authToken'));
    console.log('Is authenticated flag:', localStorage.getItem('isAuthenticated'));
    console.log('User email:', localStorage.getItem('userEmail'));
    console.log('==================');
  }, []);

  const roles = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("userData"))?.roles || [];
    } catch {
      return [];
    }
  }, []);

  const isFarmer = roles.includes("FARMER");
  const isDistributor = roles.includes("DISTRIBUTOR");

  

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
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userEmail');
      console.log('User logged out successfully');
      window.location.href = '/login';
    }
  };

  const handleNotificationClick = () => {
    const unreadNotifications = notifications.filter(n => !n.read);
    if (unreadNotifications.length > 0) {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }
  };

  const handleStatusChange = async (shipmentId, nextStatus) => {
    try {
      await apiService.updateShipmentStatus(shipmentId, nextStatus);
      // Reload same list
      const roles = JSON.parse(localStorage.getItem("userData"))?.roles || [];
      const next = roles.includes("FARMER")
        ? await apiService.getOutgoingShipments()
        : roles.includes("DISTRIBUTOR")
          ? await apiService.getIncomingShipments()
          : [];
      setShipments((Array.isArray(next) ? next : []).map(normalizeShipment));
    } catch {
      alert("Failed to update status.");
    }
  };



  // Form Reset Functions
  const resetForm = () => {
    setFormData({
      name: '',
      type: '',
      area: '',
      quantity: '',
      soilType: '',
      status: '',
      plantedDate: '',
      harvestDate: '',
      gpsCoordinates: '',
      pesticides: '',
      notes: '',
      image: '',
      pricePerKg: '',
      waterRequirement: '',
      expectedYield: ''
    });
    setImagePreview();
    setEditingCrop(null);
  };

  const resetShipmentForm = () => {
    setShipmentData({
      cropId: '',
      distributorUserId: '',
      destinationLocation: '',
      quantity: '',
      notes: '',
      pricePerKg: ''
    });
  };

  const resetExpenseForm = () => {
    setExpenseData({
      category: '',
      description: '',
      amount: '',
      date: '',
      cropId: '',
      receiptImage: null
    });
    setEditingExpense(null);
  };

  const resetCustomerForm = () => {
    setCustomerData({
      name: '',
      contact: '',
      phone: '',
      email: '',
      location: '',
      preferredCrops: [],
      notes: '',
      creditLimit: ''
    });
    setEditingCustomer(null);
  };

  // Modal Functions
  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openModal = (crop) => {
    setFormData({ ...crop });
    setImagePreview(crop.image);
    setEditingCrop(crop);
    setIsModalOpen(true);
  };

  const openShipmentModal = () => {
    resetShipmentForm();
    setIsShipmentModalOpen(true);
  };

  const openExpenseModal = (expense = null) => {
    if (expense) {
      setExpenseData({ ...expense });
      setEditingExpense(expense);
    } else {
      resetExpenseForm();
    }
    setIsExpenseModalOpen(true);
  };

  const openCustomerModal = (customer = null) => {
    if (customer) {
      setCustomerData({ ...customer });
      setEditingCustomer(customer);
    } else {
      resetCustomerForm();
    }
    setIsCustomerModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const closeShipmentModal = () => {
    setIsShipmentModalOpen(false);
    resetShipmentForm();
  };
  
  
    const loadCrops = async () => {
      try {
        setLoading(true);
        setError(null);
        const raw = await apiService.getCrops();
        setCrops((Array.isArray(raw) ? raw : []).map(normalizeCrop));
      } catch (e) {
        setError(e.message || 'Failed to load crops');
        setCrops([]);
      } finally {
        setLoading(false);
      }
    };

    const loadShipments = async () => {
      try {
        setLoadingShipments(true);
        setShipmentError(null);
        let raw = [];
        if (isFarmer) raw = await apiService.getOutgoingShipments();
        else if (isDistributor) raw = await apiService.getIncomingShipments();
        setShipments((Array.isArray(raw) ? raw : []).map(normalizeShipment));
      } catch (e) {
        setShipmentError('Failed to load shipments.');
      } finally {
        setLoadingShipments(false);
      }
    };

  // 2) In useEffect just call it
  useEffect(() => {
    if (isFarmer) loadCrops();
    loadShipments();
  }, [isFarmer, isDistributor]);

  useEffect(() => {
    (async () => {
      try { setDistributors(await apiService.getDistributors()); } catch { }
    })();
  }, []);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await apiService.getDistributors();
        if (!cancelled) setDistributors(Array.isArray(list) ? list : []);
      } catch (e) {
        console.error('Failed to load distributors', e);
        if (!cancelled) setDistributors([]);
      }
    })();
    return () => { cancelled = true; };
  }, []);
  // 3) Keep saveCrop with full braces
  const saveCrop = async () => {
    if (!formData.name || !formData.type || !formData.status) {
      alert('Please fill in all required fields');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const payload = toBackendPayload(formData);
      if (!editingCrop) {
        await apiService.createCrop(payload);          // POST /api/crops
      } else {
        await apiService.updateCrop(editingCrop.id, payload); // PATCH /api/crops/{id}
      }
      await loadCrops();
      setIsModalOpen(false);
      // Optional toast; keep UI behavior unchanged otherwise
      alert(editingCrop ? 'Crop updated successfully!' : 'Crop added successfully!');
    } catch (e) {
      setError(e.message || 'Save failed');
      alert('Error saving crop. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  
  // Input Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Example handler replacement when user submits shipment form
  const handleCreateShipment = async (form) => {
    try {
      await apiService.createShipment({
        cropId: Number(form.cropId),
        quantityKg: Number(form.quantity ?? form.quantityKg ?? shipmentData.quantity ?? 0),
        distributorUserId: Number(form.distributorUserId),
        destinationLocation: form.destinationLocation || '',
        unitPrice: form.pricePerKg ? Number(form.pricePerKg) : null,
        notes: form.notes || ''
      });


      // Reload shipments after create
      const roles = JSON.parse(localStorage.getItem("userData"))?.roles || [];
      const next = roles.includes("FARMER")
        ? await apiService.getOutgoingShipments()
        : roles.includes("DISTRIBUTOR")
          ? await apiService.getIncomingShipments()
          : [];
      setShipments((Array.isArray(next) ? next : []).map(normalizeShipment));
    } catch (e) {
      console.error(e);
      alert("Failed to create shipment.");
    }
  };


  const handleShipmentInputChange = (e) => {
    const { name, value } = e.target;
    setShipmentData(prev => ({ ...prev, [name]: value }));
  };

  const handleExpenseInputChange = (e) => {
    const { name, value } = e.target;
    setExpenseData(prev => ({ ...prev, [name]: value }));
  };

  const handleCustomerInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerData(prev => ({ ...prev, [name]: value }));
  };



  const toBackendPayload = (data) => {
    const p = {};
    if (data.name) p.name = data.name;
    if (data.type) p.type = data.type;
    if (data.soilType) p.soil_type = data.soilType;
    if (data.area !== '' && data.area !== null) p.area = Number(data.area);
    if (data.quantity !== '' && data.quantity !== null) p.quantityKg = Number(data.quantity);
    if (data.pricePerKg !== '' && data.pricePerKg !== null) p.unitPrice = Number(data.pricePerKg);
    if (data.status) p.status = data.status;
    if (data.pesticides) p.pesticides = data.pesticides;
    if (data.notes) p.notes = data.notes;
    if (data.plantedDate) p.plantedDate = data.plantedDate;
    if (data.harvestDate) p.harvestDate = data.harvestDate;
    if (data.image_url) p.image_url = data.image_url;
    // Persist as URL only if it's http(s) and user provided a URL in the existing image field
    if (typeof data.image === 'string' && /^https?:\/\//i.test(data.image)) p.image_url = data.image;
    // Parse "lat, lng"
    if (data.gpsCoordinates && data.gpsCoordinates.includes(',')) {
      const [latRaw, lngRaw] = data.gpsCoordinates.split(',');
      const lat = parseFloat(String(latRaw).replace(/[^\d.-]/g, ''));
      const lng = parseFloat(String(lngRaw).replace(/[^\d.-]/g, ''));
      if (!Number.isNaN(lat)) p.gps_lat = lat;
      if (!Number.isNaN(lng)) p.gps_lng = lng;
    }
    return p;
  };

  

  const openEditModal = (crop) => {
    setFormData((s) => ({
      ...s,
      id: crop.id ?? null,
      name: crop.name ?? '',
      type: crop.type ?? '',
      area: crop.area ?? '',
      quantity: crop.quantityKg ?? s.quantity ?? '',
      soilType: crop.soil_type ?? s.soilType ?? '',
      status: crop.status ?? '',
      plantedDate: crop.plantedDate ?? '',
      harvestDate: crop.harvestDate ?? '',
      gpsCoordinates: (crop.gps_lat != null && crop.gps_lng != null) ? `${crop.gps_lat}, ${crop.gps_lng}` : '',
      pesticides: crop.pesticides ?? '',
      notes: crop.notes ?? '',
      // Keep existing UI field "image" for text URL if already used by UI
      image: (typeof s.image === 'string' && /^https?:\/\//i.test(s.image)) ? s.image : (crop.image_url || ''),
      pricePerKg: crop.unitPrice ?? s.pricePerKg ?? '',
      waterRequirement: s.waterRequirement ?? '',
      expectedYield: s.expectedYield ?? '',
    }));
    // inside openEditModal(crop)
    setImagePreview(crop.image_url || null);
    setFormData((s) => ({ ...s, image_url: crop.image_url || '' }));
    setEditingCrop(crop);
    setIsModalOpen(true);
  };
  // Build public showcase URL for QR
  const buildPublicUrl = (publicId) =>
    `${window.location.origin}/showcase/${encodeURIComponent(publicId)}`;

  const openQrModal = (crop) => {
    if (crop?.publicId) {
      setQrModalCrop({ ...crop, qrData: buildPublicUrl(crop.publicId) });
    } else {
      alert('No publicId found for this crop. Publish the crop to generate a QR.');
    }
  };

  const selectedDistributor = (distributors || []).find(d => String(d.id) === String(shipmentData.distributorUserId));
  const dest = selectedDistributor?.name || selectedDistributor?.fullName || `Distributor ${selectedDistributor?.id}`;

  // Replace your existing saveShipment with this version
  const saveShipment = async () => {
    // 1) Strong validation (trim + explicit checks)
    const cropId = shipmentData?.cropId;
    const distId = shipmentData?.distributorUserId;
    const qtyStr = shipmentData?.quantity;
    if (
      cropId === null || cropId === undefined || String(cropId).trim() === '' ||
      distId === null || distId === undefined || String(distId).trim() === '' ||
      qtyStr === null || qtyStr === undefined || String(qtyStr).trim() === ''
    ) {
      alert('Please fill in all required fields');
      return;
    }

    // 2) Safe lookups (coerce to the same type)
    const selectedCrop = (crops || []).find(c => String(c.id) === String(cropId));
    const selectedDistributor = (distributors || []).find(d => String(d.id) === String(distId));
    if (!selectedCrop || !selectedDistributor) {
      alert('Invalid crop or distributor selection');
      return;
    }

    // 3) Quantity and availability
    const shipmentQuantity = Number(qtyStr);
    const availableQuantity = Number(
      selectedCrop.availableQuantity ?? selectedCrop.quantity ?? 0
    );
    if (Number.isNaN(shipmentQuantity) || shipmentQuantity <= 0) {
      alert('Enter a valid quantity (kg)');
      return;
    }
    if (shipmentQuantity > availableQuantity) {
      alert(`Insufficient quantity available. Available: ${availableQuantity}kg`);
      return;
    }

    const payload = {
    cropId: Number(shipmentData.cropId),
      quantityKg: Number(shipmentData.quantity),
        distributorUserId: Number(shipmentData.distributorUserId),
          destinationLocation: dest, // auto-filled
            unitPrice: shipmentData.pricePerKg ? Number(shipmentData.pricePerKg) : null,
              notes: (shipmentData.notes || '').trim(),
};

    // 5) Local fallback object (for optimistic UI/offline)
    const newLocalShipment = {
      id: `SH${Date.now()}`,
      batchId: selectedCrop.batchId,
      cropId: selectedCrop.id,
      cropName: selectedCrop.name,
      cropType: selectedCrop.type,
      farmer: farmerProfile?.name,
      distributorUserId: selectedDistributor.id,
      distributorName: selectedDistributor.name || selectedDistributor.fullName || `Distributor ${selectedDistributor.id}`,
      quantity: shipmentQuantity,
      notes: shipmentData.notes,
      pricePerKg: shipmentData.pricePerKg || selectedCrop.pricePerKg || selectedCrop.unitPrice || 0,
      totalValue: shipmentQuantity * (shipmentData.pricePerKg || selectedCrop.pricePerKg || selectedCrop.unitPrice || 0),
      origin: farmerProfile?.location || 'Farm',
      destination: shipmentData.destinationLocation || selectedDistributor.location || '',
      status: 'pending',
      createdAt: new Date().toISOString(),
      expectedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      gpsCoordinates: selectedCrop.gpsCoordinates,
      soilType: selectedCrop.soilType,
      plantedDate: selectedCrop.plantedDate,
      harvestDate: selectedCrop.harvestDate,
      pesticides: selectedCrop.pesticides,
    };

    try {
      setLoading(true);

      // 6) Try API first
      try {
        await apiService.createShipment(payload);
        // After successful create, prefer reloading from server for canonical data
        const roles = JSON.parse(localStorage.getItem('userData'))?.roles || [];
        const refreshed = roles?.includes('FARMER')
          ? await apiService.getOutgoingShipments()
          : roles?.includes('DISTRIBUTOR')
            ? await apiService.getIncomingShipments()
            : [];
        setShipments((Array.isArray(refreshed) ? refreshed : []).map(s => s)); // or map(normalizeShipment) if you have one
      } catch (apiError) {
        console.error('API shipment creation failed, creating locally:', apiError);
        setShipments(prev => [...prev, newLocalShipment]);
      }

      // 7) Deduct quantity on the selected crop
      setCrops(prev =>
        (prev || []).map(c =>
          String(c.id) === String(selectedCrop.id)
            ? { ...c, availableQuantity: (availableQuantity - shipmentQuantity) }
            : c
        )
      );

      closeShipmentModal();
      alert('Shipment created successfully!');
    } catch (error) {
      console.error('Error creating shipment:', error);
      alert('Error creating shipment. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  const saveExpense = async () => {
    if (!expenseData.category || !expenseData.description || !expenseData.amount || !expenseData.date) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);

      if (editingExpense) {
        // Try API first, fallback to local update
        try {
          const updatedExpense = await apiService.updateExpense(editingExpense.id, expenseData);
          setExpenses(prev => prev.map(expense => expense.id === editingExpense.id ? updatedExpense : expense));
        } catch (apiError) {
          console.error('API expense update failed, updating locally:', apiError);
          setExpenses(prev => prev.map(expense => expense.id === editingExpense.id ?
            { ...expenseData, id: editingExpense.id } : expense));
        }
        alert('Expense updated successfully!');
      } else {
        // Try API first, fallback to local creation
        try {
          const newExpense = await apiService.addExpense(expenseData);
          setExpenses(prev => [...prev, newExpense]);
        } catch (apiError) {
          console.error('API expense creation failed, creating locally:', apiError);
          const newExpense = {
            ...expenseData,
            id: `EXP${Date.now()}`,
            createdAt: new Date().toISOString()
          };
          setExpenses(prev => [...prev, newExpense]);
        }
        alert('Expense added successfully!');
      }

      setIsExpenseModalOpen(false);
      resetExpenseForm();
    } catch (error) {
      console.error('Error saving expense:', error);
      alert('Error saving expense. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const saveCustomer = () => {
    if (!customerData.name || !customerData.contact || !customerData.phone) {
      alert('Please fill in all required fields');
      return;
    }

    if (editingCustomer) {
      setCustomers(prev => prev.map(customer =>
        customer.id === editingCustomer.id ? { ...customerData, id: editingCustomer.id } : customer
      ));
      alert('Customer updated successfully!');
    } else {
      const newCustomer = {
        ...customerData,
        id: `CUST${Date.now()}`,
        totalOrders: 0,
        lastOrderDate: null
      };
      setCustomers(prev => [...prev, newCustomer]);
      alert('Customer added successfully!');
    }

    setIsCustomerModalOpen(false);
    resetCustomerForm();
  };

  const deleteCrop = async (id) => {
    if (!window.confirm('Are you sure you want to delete this crop?')) return;
    try {
      setLoading(true);
      setError(null);
      await apiService.deleteCrop(id); // DELETE /api/crops/{id}
      await loadCrops();
      alert('Crop deleted successfully!');
    } catch (e) {
      setError(e.message || 'Delete failed');
      alert('Error deleting crop. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  const deleteShipment = (id) => {
    if (window.confirm('Are you sure you want to cancel this shipment?')) {
      const shipment = shipments.find(s => s.id === id);
      //&& shipment.status === 'pending'
      if (shipment && shipment.status === 'pending') {
        // Return quantity back to crop
        setCrops(prev => prev.map(crop =>
          crop.id == shipment.cropId
            ? { ...crop, availableQuantity: parseFloat(crop.availableQuantity || 0) + parseFloat(shipment.quantity) }
            : crop
        ));
      }

      setShipments(prev => prev.filter(shipment => shipment.id !== id));
      alert('Shipment cancelled successfully!');
    } else {
      alert('Cannot cancel shipped or delivered orders');
    }
  };

  const deleteExpense = (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      setExpenses(prev => prev.filter(expense => expense.id !== id));
      alert('Expense deleted successfully!');
    }
  };

  const deleteCustomer = (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      setCustomers(prev => prev.filter(customer => customer.id !== id));
      alert('Customer deleted successfully!');
    }
  };

  const saveSettings = () => {
    localStorage.setItem('farmer-settings', JSON.stringify(settingsData));
    alert('Settings saved successfully!');
    setIsSettingsModalOpen(false);
  };

  // Export Functions
  const exportData = (type) => {
    let data, filename, headers;

    switch (type) {
      case 'crops':
        data = crops;
        filename = `crops-export-${new Date().toISOString().split('T')[0]}.csv`;
        headers = ['Name', 'Type', 'Area (acres)', 'Quantity (kg)', 'Available Qty', 'Soil Type', 'Status', 'Planted Date', 'Harvest Date', 'Price/Kg', 'GPS Coordinates'];
        break;
      case 'shipments':
        data = shipments;
        filename = `shipments-export-${new Date().toISOString().split('T')[0]}.csv`;
        headers = ['Shipment ID', 'Crop', 'Distributor', 'Quantity', 'Price/Kg', 'Total Value', 'Status', 'Created Date'];
        break;
      case 'expenses':
        data = expenses;
        filename = `expenses-export-${new Date().toISOString().split('T')[0]}.csv`;
        headers = ['Category', 'Description', 'Amount', 'Date', 'Crop ID'];
        break;
      case 'customers':
        data = customers;
        filename = `customers-export-${new Date().toISOString().split('T')[0]}.csv`;
        headers = ['Name', 'Contact', 'Phone', 'Location', 'Credit Limit', 'Total Orders'];
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
          case 'crops':
            return [
              item.name, item.type, item.area, item.quantity,
              item.availableQuantity || item.quantity, item.soilType,
              item.status, formatDate(item.plantedDate),
              formatDate(item.harvestDate), item.pricePerKg || 0,
              item.gpsCoordinates || ''
            ].join(',');
          case 'shipments':
            return [
              item.id, item.cropName, item.distributorName,
              item.quantity, item.pricePerKg, item.totalValue,
              item.status, formatDate(item.createdAt)
            ].join(',');
          case 'expenses':
            return [
              item.category, item.description, item.amount,
              formatDate(item.date), item.cropId || ''
            ].join(',');
          case 'customers':
            return [
              item.name, item.contact, item.phone,
              item.location, item.creditLimit, item.totalOrders
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

  // Menu items - Enhanced with new sections
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'crops', label: 'My Crops', icon: Sprout },
    { id: 'shipments', label: 'Shipments', icon: Truck },
    { id: 'expenses', label: 'Farm Expenses', icon: Calculator },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'analytics', label: 'AI Analysis', icon: Brain },
    { id: 'weather', label: 'Weather Alerts', icon: Cloud },
    { id: 'knowledge', label: 'Knowledge Base', icon: BookOpen },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  // Calculate enhanced farmer stats
  const farmerStats = {
    totalCrops: crops.length,
    totalArea: crops.reduce((sum, crop) => sum + parseFloat(crop.area || 0), 0),
    totalProduction: crops.reduce((sum, crop) => sum + parseFloat(crop.quantity || 0), 0),
    availableStock: crops.reduce((sum, crop) => sum + parseFloat(crop.availableQuantity || crop.quantity || 0), 0),
    activeCrops: crops.filter(crop => crop.status === 'Growing' || crop.status === 'Planted').length,
    harvestedCrops: crops.filter(crop => crop.status === 'Harvested').length,
    totalShipments: shipments.length,
    pendingShipments: shipments.filter(s => s.status === 'pending').length,
    totalRevenue: shipments.reduce((sum, shipment) => sum + (shipment.totalValue || 0), 0),
    totalExpenses: expenses.reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0),
    netIncome: shipments.reduce((sum, shipment) => sum + (shipment.totalValue || 0), 0) -
      expenses.reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0),
    activeCustomers: customers.length,
    unreadNotifications: notifications.filter(n => !n.read).length
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Growing': { class: 'status-growing', icon: Sprout, text: 'Growing' },
      'Harvested': { class: 'status-harvested', icon: CheckCircle, text: 'Harvested' },
      'Planned': { class: 'status-planned', icon: Clock, text: 'Planned' },
      'Planted': { class: 'status-growing', icon: Sprout, text: 'Planted' },
      'pending': { class: 'status-planned', icon: Clock, text: 'Pending' },
      'shipped': { class: 'status-growing', icon: Truck, text: 'Shipped' },
      'in-transit': { class: 'status-growing', icon: Navigation, text: 'In Transit' },
      'delivered': { class: 'status-harvested', icon: CheckCircle, text: 'Delivered' },
      'cancelled': { class: 'status-badge status-delayed', icon: X, text: 'Cancelled' }
    };

    const config = statusConfig[status] || statusConfig['Planned'];
    const IconComponent = config.icon;

    return (
      <span className={`status-badge ${config.class}`}>
        <IconComponent size={14} />
        {config.text}
      </span>
    );
  };

  const filteredCrops = crops.filter(crop => {
    const matchesCropType = !filters.cropType || crop.type === filters.cropType;
    const matchesStatus = !filters.status || crop.status === filters.status;
    const matchesSearch = !filters.search ||
      crop.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      crop.type.toLowerCase().includes(filters.search.toLowerCase()) ||
      crop.soilType.toLowerCase().includes(filters.search.toLowerCase());

    return matchesCropType && matchesStatus && matchesSearch;
  });

  const filteredShipments = (Array.isArray(shipments) ? shipments : [])
    .map(normalizeShipment)
    .filter
(shipment => {
    const matchesStatus = !filters.status || shipment.status === filters.status;
    const matchesSearch = !filters.search ||
      shipment.cropName.toLowerCase().includes(filters.search.toLowerCase()) ||
      shipment.distributorName.toLowerCase().includes(filters.search.toLowerCase()) ||
      shipment.id.toLowerCase().includes(filters.search.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = !filters.search ||
      expense.category.toLowerCase().includes(filters.search.toLowerCase()) ||
      expense.description.toLowerCase().includes(filters.search.toLowerCase());

    return matchesSearch;
  });

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = !filters.search ||
      customer.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      customer.contact.toLowerCase().includes(filters.search.toLowerCase()) ||
      customer.location.toLowerCase().includes(filters.search.toLowerCase());

    return matchesSearch;
  });

  // Show loading or error states but still render UI
  if (loading && crops.length === 0) {
    return (
      <div className="farmer-dashboard">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <div>Loading dashboard...</div>
        </div>
      </div>
    );
  }

  // Render Functions
  const renderDashboardContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="dashboard-content">
            {/* Error message banner if API failed */}
            {error && (
              <div style={{
                padding: '12px',
                backgroundColor: '#fef2f2',
                border: '1px solid #fca5a5',
                borderRadius: '6px',
                marginBottom: '20px',
                color: '#dc2626'
              }}>
                <AlertTriangle size={16} style={{ display: 'inline', marginRight: '8px' }} />
                {error} - Showing cached data
              </div>
            )}

            {/* Stats Grid */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <Sprout size={24} />
                </div>
                <div className="stat-info">
                  <div className="stat-value">{farmerStats.totalCrops}</div>
                  <div className="stat-label">Total Crops</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <Target size={24} />
                </div>
                <div className="stat-info">
                  <div className="stat-value">{farmerStats.totalArea.toFixed(1)} acres</div>
                  <div className="stat-label">Total Farm Area</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <Package size={24} />
                </div>
                <div className="stat-info">
                  <div className="stat-value">{farmerStats.totalProduction.toFixed(0)} kg</div>
                  <div className="stat-label">Total Production</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <DollarSign size={24} />
                </div>
                <div className="stat-info">
                  <div className="stat-value">{formatCurrency(farmerStats.totalRevenue)}</div>
                  <div className="stat-label">Total Revenue</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <Calculator size={24} />
                </div>
                <div className="stat-info">
                  <div className="stat-value">{formatCurrency(farmerStats.totalExpenses)}</div>
                  <div className="stat-label">Total Expenses</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <TrendingUp size={24} />
                </div>
                <div className="stat-info">
                  <div className="stat-value">{formatCurrency(farmerStats.netIncome)}</div>
                  <div className="stat-label">Net Income</div>
                </div>
              </div>
            </div>

            {/* Dashboard Grid */}
            <div className="dashboard-grid">
              {/* Recent Crops */}
              <div className="dashboard-card">
                <h3>Recent Crops</h3>
                <div className="activity-list">
                  {crops.slice(0, 5).map(crop => (
                    <div key={crop.id} className="activity-item">
                      <Sprout size={20} />
                      <div className="activity-info">
                        <div><strong>{crop.name}</strong> - {crop.type}</div>
                        <div>{crop.area} acres - {getStatusBadge(crop.status)}</div>
                      </div>
                      <div className="activity-time">
                        {formatDate(crop.createdAt)}
                      </div>
                    </div>
                  ))}
                  {crops.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
                      No crops added yet
                    </div>
                  )}
                </div>
              </div>

              {/* Weather Info */}
              <div className="dashboard-card">
                <h3>Weather Overview</h3>
                <div className="weather-info">
                  <div className="weather-today">
                    <Cloud size={24} />
                    <div>{weatherData.temperature}</div>
                    <div style={{ fontSize: '14px', color: '#64748b' }}>{weatherData.forecast}</div>
                  </div>
                  <div className="weather-details">
                    <div className="weather-item">
                      <Droplets size={16} />
                      <span>Humidity: {weatherData.humidity}</span>
                    </div>
                    <div className="weather-item">
                      <Wind size={16} />
                      <span>Wind: {weatherData.windSpeed}</span>
                    </div>
                    <div className="weather-item">
                      <Sun size={16} />
                      <span>UV Index: {weatherData.uvIndex}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Shipments */}
              <div className="dashboard-card">
                <h3>Recent Shipments</h3>
                <div className="recent-shipments">
                  {shipments.slice(0, 5).map(shipment => (
                    <div key={shipment.id} className="shipment-item">
                      <div className="shipment-info">
                        <strong>{shipment.cropName}</strong>
                        <span>{shipment.quantity}kg to {shipment.distributorName}</span>
                      </div>
                      {getStatusBadge(shipment.status)}
                    </div>
                  ))}
                  {shipments.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
                      No shipments created yet
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="dashboard-card">
                <h3>Quick Actions</h3>
                <div className="quick-actions" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <button className="btn btn-primary" onClick={openAddModal}>
                    <Plus size={16} />
                    Add New Crop
                  </button>
                  <button className="btn btn-secondary" onClick={openShipmentModal}>
                    <Truck size={16} />
                    Create Shipment
                  </button>
                  <button className="btn btn-secondary" onClick={() => openExpenseModal()}>
                    <Calculator size={16} />
                    Add Expense
                  </button>
                  <button className="btn btn-secondary" onClick={() => exportData('crops')}>
                    <Download size={16} />
                    Export Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'crops':
        return (
          <div className="dashboard-content">
            {/* Header */}
            <div className="header">
              <h1>My Crops Management</h1>
              <div className="header-actions">
                <button className="btn btn-primary" onClick={openAddModal}>
                  <Plus size={16} />
                  Add Crop
                </button>
                <button className="btn btn-secondary" onClick={() => exportData('crops')}>
                  <Download size={16} />
                  Export
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
                  placeholder="Search crops by name, type, or soil..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </div>
              <select
                className="filter-select"
                value={filters.cropType}
                onChange={(e) => setFilters({ ...filters, cropType: e.target.value })}
              >
                <option value="">All Types</option>
                <option value="Rice">Rice</option>
                <option value="Wheat">Wheat</option>
                <option value="Vegetables">Vegetables</option>
                <option value="Fruits">Fruits</option>
                <option value="Pulses">Pulses</option>
              </select>
              <select
                className="filter-select"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <option value="">All Status</option>
                <option value="Planned">Planned</option>
                <option value="Planted">Planted</option>
                <option value="Growing">Growing</option>
                <option value="Harvested">Harvested</option>
              </select>
            </div>

            {/* Crops Table */}
            <div className="table-section">
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th style={{ width: '200px' }}>Crop Details</th>
                      <th style={{ width: '100px' }}>Type</th>
                      <th style={{ width: '80px' }}>Area</th>
                      <th style={{ width: '120px' }}>Quantity</th>
                      <th style={{ width: '120px' }}>Pesticides</th>
                      <th style={{ width: '120px' }}>Available Stock</th>
                      <th style={{ width: '100px' }}>Soil Type</th>
                      <th style={{ width: '100px' }}>Status</th>
                      <th style={{ width: '120px' }}>Planted Date</th>
                      <th style={{ width: '120px' }}>Harvest Date</th>
                      <th style={{ width: '100px' }}>Price/Kg</th>
                      <th style={{ width: '180px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCrops.map(crop => (
                      <tr key={crop.id}>
                        <td>
                          <div className="table-cell-content">
                            <div className="crop-info">
                              {crop.image ? (
                                <img src={crop.image} alt={crop.name} className="crop-image" 
                                  onError={(e) => (e.currentTarget.style.display = "none")}/>
                              ) : (
                                  <div className="crop-image-placeholder">
                                    <Sprout size={20} />
                                  </div>
                              )}
                              <div className="crop-details">
                                <div className="primary-text">{crop.name}</div>
                                <div className="secondary-text">Batch: {crop.batchId}</div>
                                {crop.notes && (
                                  <div className="tertiary-text">
                                    <FileText size={12} />
                                    {crop.notes.substring(0, 30)}{crop.notes.length > 30 ? '...' : ''}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="table-cell-content">
                            <div className="primary-text">{crop.type}</div>
                          </div>
                        </td>
                        <td>
                          <div className="table-cell-content">
                            <div className="primary-text">{crop.area} acres</div>
                          </div>
                        </td>
                        <td>
                          <div className="table-cell-content">
                            <div className="primary-text">{crop.quantity ?? 0} kg</div>
                          </div>
                        </td>
                        <td>
                          <div className="table-cell-content">
                            <div className="primary-text">{crop.pesticides || "—"}</div>
                          </div>
                        </td>
                        <td>
                          <div className="table-cell-content">
                            <div className="primary-text">{crop.availableQuantity || crop.quantity} kg</div>
                            {parseFloat(crop.availableQuantity || crop.quantity) < parseFloat(crop.quantity) * 0.2 && (
                              <div className="tertiary-text" style={{ color: '#dc2626' }}>
                                <AlertTriangle size={12} />
                                Low Stock
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="table-cell-content">
                            <div className="primary-text">{crop.soilType || "—"}</div>
                          </div>
                        </td>
                       
                        <td>
                          <div className="table-cell-content">
                            {getStatusBadge(crop.status)}
                          </div>
                        </td>
                        <td>
                          <div className="table-cell-content">
                            <div className="primary-text">{formatDate(crop.plantedDate)}</div>
                          </div>
                        </td>
                        <td>
                          <div className="table-cell-content">
                            <div className="primary-text">{formatDate(crop.harvestDate)}</div>
                          </div>
                        </td>
                        <td>
                          <div className="table-cell-content">
                            <div className="primary-text">
                              {crop.pricePerKg ? formatCurrency(crop.pricePerKg ?? 0) : '-'}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn btn-small btn-secondary"
                              onClick={() => openEditModal(crop)}
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              className="btn btn-small btn-qr"
                              onClick={() => openQrModal(crop)}
                            >
                              <QrCode size={14} />
                            </button>
                            <button
                              className="btn btn-small btn-delete"
                              onClick={() => deleteCrop(crop.id)}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredCrops.length === 0 && (
                  <div className="empty-state">
                    <Sprout size={48} />
                    <h3>No crops found</h3>
                    <p>Start by adding your first crop to track its progress.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'shipments':
        return (
          <div className="dashboard-content">
            {/* Header */}
            <div className="header">
              <h1>Shipments Management</h1>
              <div className="header-actions">
                <button className="btn btn-primary" onClick={openShipmentModal}>
                  <Plus size={16} />
                  Create Shipment
                </button>
                <button className="btn btn-secondary" onClick={() => exportData('shipments')}>
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
                  placeholder="Search shipments by crop, distributor, or ID..."
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
                <option value="pending">Pending</option>
                <option value="shipped">Shipped</option>
                <option value="in-transit">In Transit</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Shipments Table */}
            <div className="table-section">
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th style={{ width: '120px' }}>Shipment ID</th>
                      <th style={{ width: '160px' }}>Crop Details</th>
                      <th style={{ width: '120px' }}>Batch ID</th>
                      <th style={{ width: '180px' }}>Distributor</th>
                      <th style={{ width: '100px' }}>Quantity</th>
                      <th style={{ width: '100px' }}>Price/Kg</th>
                      <th style={{ width: '120px' }}>Total Value</th>
                      <th style={{ width: '160px' }}>Route</th>
                      <th style={{ width: '100px' }}>Status</th>
                      <th style={{ width: '120px' }}>Created Date</th>
                      <th style={{ width: '120px' }}>Expected Delivery</th>
                      <th style={{ width: '140px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredShipments.map(shipment => (
                      <tr key={shipment.id}>
                        <td>
                          <div className="table-cell-content">
                            <div className="primary-text">ID: {shipment.shipmentId}</div>
                          </div>
                        </td>
                        <td>
                          <div className="table-cell-content">
                            <div className="primary-text">{shipment.cropName}</div>
                            <div className="secondary-text">{shipment.cropType}</div>
                          </div>
                        </td>
                        <td>
                          <div className="table-cell-content">
                            <div className="primary-text">{shipment.batchId}</div>
                          </div>
                        </td>
                        <td>
                          <div className="table-cell-content">
                            <div className="primary-text">{shipment.distributorName}</div>
                            <div className="secondary-text">
                              <Building2 size={12} />
                              ID: {shipment.distributorUserId}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="table-cell-content">
                            <div className="primary-text">{shipment.quantity} kg</div>
                          </div>
                        </td>
                        <td>
                          <div className="table-cell-content">
                            <div className="primary-text">{formatCurrency(shipment.pricePerKg)}</div>
                          </div>
                        </td>
                        <td>
                          <div className="table-cell-content">
                            <div className="primary-text">{formatCurrency(shipment.totalValue)}</div>
                          </div>
                        </td>
                        <td>
                          <div className="table-cell-content">
                            <div className="route-display">
                              <div className="secondary-text">
                                <MapPin size={12} />
                                {/* Route cell render */}
                                {`${shipment.origin || 'Farm'} → ${shipment.destination || shipment.destinationLocation || '-'}`}

                              </div>
                              <div style={{ color: '#9ca3af', textAlign: 'center', margin: '2px 0' }}>
                                <ArrowRight size={12} />
                              </div>
                              <div className="secondary-text">
                                <Target size={12} />
                                {shipment.destination}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="table-cell-content">
                            {getStatusBadge(shipment.status)}
                          </div>
                        </td>
                        <td>
                          <div className="table-cell-content">
                            <div className="primary-text">{formatDate(shipment.createdAt)}</div>
                          </div>
                        </td>
                        <td>
                          <div className="table-cell-content">
                            <div className="primary-text">{formatDate(shipment.expectedDelivery)}</div>
                          </div>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn btn-small btn-secondary"
                              onClick={() => alert(`Shipment Details:\n${shipment.shipmentId}\n${shipment.cropName}\n${shipment.quantity}kg\n${shipment.distributorName}\n${shipment.status}\nValue: ${formatCurrency(shipment.totalValue)}`)}
                            >
                              <Eye size={14} />
                            </button>
                            
                              <button
                                className="btn btn-small btn-delete"
                                onClick={() => deleteShipment(shipment.shipmentId)}
                              >
                                <X size={14} />
                              </button>
                            
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
                    <p>Create your first shipment to start selling your crops.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'expenses':
        return (
          <div className="dashboard-content">
            {/* Header */}
            <div className="header">
              <h1>Farm Expenses Management</h1>
              <div className="header-actions">
                <button className="btn btn-primary" onClick={() => openExpenseModal()}>
                  <Plus size={16} />
                  Add Expense
                </button>
                <button className="btn btn-secondary" onClick={() => exportData('expenses')}>
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
                  placeholder="Search expenses by category or description..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </div>
            </div>

            {/* Expenses Summary */}
            <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', marginBottom: '24px' }}>
              <div className="dashboard-card">
                <h3>Total Expenses</h3>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#dc2626' }}>
                  {formatCurrency(farmerStats.totalExpenses)}
                </div>
              </div>
              <div className="dashboard-card">
                <h3>This Month</h3>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#f59e0b' }}>
                  {formatCurrency(
                    expenses.filter(exp =>
                      new Date(exp.date).getMonth() === new Date().getMonth() &&
                      new Date(exp.date).getFullYear() === new Date().getFullYear()
                    ).reduce((sum, exp) => sum + parseFloat(exp.amount), 0)
                  )}
                </div>
              </div>
              <div className="dashboard-card">
                <h3>Top Category</h3>
                <div style={{ fontSize: '18px', fontWeight: '600', color: '#3b82f6' }}>
                  {expenses.length > 0 ?
                    Object.entries(
                      expenses.reduce((acc, exp) => {
                        acc[exp.category] = (acc[exp.category] || 0) + parseFloat(exp.amount);
                        return acc;
                      }, {})
                    ).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A' : 'N/A'
                  }
                </div>
              </div>
            </div>

            {/* Expenses Table */}
            <div className="table-section">
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th style={{ width: '150px' }}>Category</th>
                      <th style={{ width: '250px' }}>Description</th>
                      <th style={{ width: '120px' }}>Amount</th>
                      <th style={{ width: '120px' }}>Date</th>
                      <th style={{ width: '150px' }}>Related Crop</th>
                      <th style={{ width: '140px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExpenses.map(expense => (
                      <tr key={expense.id}>
                        <td>
                          <div className="table-cell-content">
                            <div className="primary-text">{expense.category}</div>
                          </div>
                        </td>
                        <td>
                          <div className="table-cell-content">
                            <div className="primary-text">{expense.description}</div>
                          </div>
                        </td>
                        <td>
                          <div className="table-cell-content">
                            <div className="primary-text" style={{ color: '#dc2626', fontWeight: '600' }}>
                              {formatCurrency(expense.amount)}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="table-cell-content">
                            <div className="primary-text">{formatDate(expense.date)}</div>
                          </div>
                        </td>
                        <td>
                          <div className="table-cell-content">
                            {expense.cropId ? (
                              <div className="primary-text">
                                {crops.find(c => c.id == expense.cropId)?.name || 'Unknown Crop'}
                              </div>
                            ) : (
                              <div className="secondary-text">General</div>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn btn-small btn-edit"
                              onClick={() => openExpenseModal(expense)}
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              className="btn btn-small btn-delete"
                              onClick={() => deleteExpense(expense.id)}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredExpenses.length === 0 && (
                  <div className="empty-state">
                    <Calculator size={48} />
                    <h3>No expenses found</h3>
                    <p>Start tracking your farm expenses for better financial management.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'customers':
        return (
          <div className="dashboard-content">
            {/* Header */}
            <div className="header">
              <h1>Customer Management</h1>
              <div className="header-actions">
                <button className="btn btn-primary" onClick={() => openCustomerModal()}>
                  <Plus size={16} />
                  Add Customer
                </button>
                <button className="btn btn-secondary" onClick={() => exportData('customers')}>
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
                  placeholder="Search customers by name, contact, or location..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </div>
            </div>

            {/* Customer Grid */}
            <div className="retailer-grid">
              {filteredCustomers.map(customer => (
                <div key={customer.id} className="retailer-card">
                  <div className="retailer-header">
                    <h3>{customer.name}</h3>
                    <div className="retailer-rating">
                      <Users size={16} />
                      {customer.totalOrders} orders
                    </div>
                  </div>

                  <div className="retailer-details">
                    <div className="detail-item">
                      <User size={16} />
                      <span>{customer.contact}</span>
                    </div>
                    <div className="detail-item">
                      <Phone size={16} />
                      <span>{customer.phone}</span>
                    </div>
                    {customer.email && (
                      <div className="detail-item">
                        <Mail size={16} />
                        <span>{customer.email}</span>
                      </div>
                    )}
                    <div className="detail-item">
                      <MapPin size={16} />
                      <span>{customer.location}</span>
                    </div>
                    <div className="detail-item">
                      <CreditCard size={16} />
                      <span>Credit Limit: {formatCurrency(customer.creditLimit)}</span>
                    </div>
                  </div>

                  <div className="retailer-preferences">
                    <h4>Preferred Crops</h4>
                    <div className="product-tags">
                      {customer.preferredCrops.map((crop, index) => (
                        <span key={index} className="product-tag">{crop}</span>
                      ))}
                    </div>
                  </div>

                  <div className="retailer-details">
                    <div className="detail-item">
                      <Calendar size={16} />
                      <span>Last Order: {formatDate(customer.lastOrderDate)}</span>
                    </div>
                  </div>

                  {customer.notes && (
                    <div className="retailer-details">
                      <div className="detail-item">
                        <FileText size={16} />
                        <span>{customer.notes}</span>
                      </div>
                    </div>
                  )}

                  <div className="retailer-actions">
                    <button
                      className="btn btn-small btn-primary"
                      onClick={() => alert(`Contact ${customer.name} at ${customer.phone}`)}
                    >
                      <Phone size={16} />
                      Contact
                    </button>
                    <button
                      className="btn btn-small btn-edit"
                      onClick={() => openCustomerModal(customer)}
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                    <button
                      className="btn btn-small btn-delete"
                      onClick={() => deleteCustomer(customer.id)}
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {filteredCustomers.length === 0 && (
              <div className="empty-state">
                <Users size={48} />
                <h3>No customers found</h3>
                <p>Add your first customer to start building your network.</p>
              </div>
            )}
          </div>
        );

      case 'analytics':
        return (
          <div className="ai-analysis-section">
            <CropHealthDetector />
          </div>
        );

      case 'weather':
        return (
          <div className="dashboard-content">
            <div className="header">
              <h1>Weather Alerts</h1>
              <div className="header-actions">
                <button className="btn btn-primary" onClick={() => setIsWeatherModalOpen(true)}>
                  <Cloud size={16} />
                  Detailed Forecast
                </button>
              </div>
            </div>

            <div className="dashboard-grid">
              <div className="dashboard-card">
                <h3>Current Weather</h3>
                <div className="weather-info">
                  <div className="weather-today">
                    <Cloud size={32} />
                    <div style={{ fontSize: '28px', fontWeight: '700' }}>{weatherData.temperature}</div>
                    <div style={{ fontSize: '16px', color: '#64748b' }}>{weatherData.forecast}</div>
                  </div>
                </div>
              </div>

              <div className="dashboard-card">
                <h3>Weather Details</h3>
                <div className="weather-details">
                  <div className="weather-item">
                    <Droplets size={16} />
                    <span><strong>Humidity:</strong> {weatherData.humidity}</span>
                  </div>
                  <div className="weather-item">
                    <Wind size={16} />
                    <span><strong>Wind Speed:</strong> {weatherData.windSpeed}</span>
                  </div>
                  <div className="weather-item">
                    <Sun size={16} />
                    <span><strong>UV Index:</strong> {weatherData.uvIndex}</span>
                  </div>
                  <div className="weather-item">
                    <Droplets size={16} />
                    <span><strong>Rainfall:</strong> {weatherData.rainfall}</span>
                  </div>
                  <div className="weather-item">
                    <Sprout size={16} />
                    <span><strong>Soil Moisture:</strong> {weatherData.soilMoisture}</span>
                  </div>
                </div>
              </div>

              <div className="dashboard-card">
                <h3>Farm Alerts</h3>
                <div className="activity-list">
                  {notifications.filter(n => n.type === 'weather').map(notification => (
                    <div key={notification.id} className="activity-item">
                      <AlertCircle size={20} color="#f59e0b" />
                      <div className="activity-info">
                        <div><strong>{notification.title}</strong></div>
                        <div>{notification.message}</div>
                      </div>
                      <div className="activity-time">
                        {formatDateTime(notification.timestamp)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="dashboard-card">
                <h3>Farming Recommendations</h3>
                <div className="recommendations">
                  <div className="recommendation-item">
                    <Sprout size={16} color="#22c55e" />
                    <span>Good time for transplanting rice seedlings</span>
                  </div>
                  <div className="recommendation-item">
                    <Droplets size={16} color="#3b82f6" />
                    <span>Increase irrigation frequency due to high temperature</span>
                  </div>
                  <div className="recommendation-item">
                    <Shield size={16} color="#f59e0b" />
                    <span>Apply organic pesticides before evening</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'knowledge':
        return (
          <div className="dashboard-content">
            <div className="header">
              <h1>Knowledge Base</h1>
              <div className="header-actions">
                <button className="btn btn-secondary" onClick={() => alert('External resource links and farming guides will be available here')}>
                  <BookOpen size={16} />
                  Browse Articles
                </button>
              </div>
            </div>

            <div className="dashboard-grid">
              <div className="dashboard-card">
                <h3>Crop Cultivation Guides</h3>
                <div className="knowledge-list">
                  <div className="knowledge-item">
                    <Sprout size={16} />
                    <span>Rice Cultivation Best Practices</span>
                  </div>
                  <div className="knowledge-item">
                    <Package size={16} />
                    <span>Vegetable Farming Techniques</span>
                  </div>
                  <div className="knowledge-item">
                    <Target size={16} />
                    <span>Precision Agriculture Methods</span>
                  </div>
                </div>
              </div>

              <div className="dashboard-card">
                <h3>Pest & Disease Management</h3>
                <div className="knowledge-list">
                  <div className="knowledge-item">
                    <Shield size={16} />
                    <span>Organic Pest Control Methods</span>
                  </div>
                  <div className="knowledge-item">
                    <AlertTriangle size={16} />
                    <span>Early Disease Detection</span>
                  </div>
                  <div className="knowledge-item">
                    <Sprout size={16} />
                    <span>Integrated Pest Management</span>
                  </div>
                </div>
              </div>

              <div className="dashboard-card">
                <h3>Market Intelligence</h3>
                <div className="knowledge-list">
                  <div className="knowledge-item">
                    <TrendingUp size={16} />
                    <span>Current Market Prices</span>
                  </div>
                  <div className="knowledge-item">
                    <BarChart3 size={16} />
                    <span>Demand Forecasting</span>
                  </div>
                  <div className="knowledge-item">
                    <DollarSign size={16} />
                    <span>Export Opportunities</span>
                  </div>
                </div>
              </div>

              <div className="dashboard-card">
                <h3>Technology & Innovation</h3>
                <div className="knowledge-list">
                  <div className="knowledge-item">
                    <Activity size={16} />
                    <span>IoT in Agriculture</span>
                  </div>
                  <div className="knowledge-item">
                    <Cloud size={16} />
                    <span>Weather Monitoring Systems</span>
                  </div>
                  <div className="knowledge-item">
                    <Settings size={16} />
                    <span>Farm Automation Tools</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="dashboard-content">
            <div className="header">
              <h1>Settings & Configuration</h1>
              <div className="header-actions">
                <button className="btn btn-primary" onClick={() => setIsSettingsModalOpen(true)}>
                  <Settings size={16} />
                  Edit Settings
                </button>
              </div>
            </div>

            <div className="dashboard-grid">
              <div className="dashboard-card">
                <h3>Farm Information</h3>
                <div className="settings-info">
                  <div><strong>Farm Name:</strong> {settingsData.farmName}</div>
                  <div><strong>Location:</strong> {settingsData.location}</div>
                  <div><strong>Total Area:</strong> {settingsData.totalArea}</div>
                  <div><strong>Email:</strong> {settingsData.email}</div>
                  <div><strong>Phone:</strong> {settingsData.phone}</div>
                </div>
              </div>

              <div className="dashboard-card">
                <h3>Notification Preferences</h3>
                <div className="settings-info">
                  <div><strong>Crop Alerts:</strong> {settingsData.notifications.cropAlerts ? 'Enabled' : 'Disabled'}</div>
                  <div><strong>Weather Alerts:</strong> {settingsData.notifications.weatherAlerts ? 'Enabled' : 'Disabled'}</div>
                  <div><strong>Shipment Updates:</strong> {settingsData.notifications.shipmentUpdates ? 'Enabled' : 'Disabled'}</div>
                  <div><strong>Expense Reminders:</strong> {settingsData.notifications.expenseReminders ? 'Enabled' : 'Disabled'}</div>
                </div>
              </div>

              <div className="dashboard-card">
                <h3>System Status</h3>
                <div className="settings-info">
                  <div><strong>Database:</strong> Connected</div>
                  <div><strong>Last Sync:</strong> {new Date().toLocaleString()}</div>
                  <div><strong>Version:</strong> v2.1.0</div>
                  <div><strong>Storage Used:</strong> 65% of 1GB</div>
                </div>
              </div>

              <div className="dashboard-card">
                <h3>Quick Stats</h3>
                <div className="settings-info">
                  <div><strong>Total Crops:</strong> {farmerStats.totalCrops}</div>
                  <div><strong>Active Shipments:</strong> {farmerStats.pendingShipments}</div>
                  <div><strong>Total Revenue:</strong> {formatCurrency(farmerStats.totalRevenue)}</div>
                  <div><strong>Net Income:</strong> {formatCurrency(farmerStats.netIncome)}</div>
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
              src={logo}
              alt="FarmChainX"
              className="sidebar-logo"
              onError={(e) => { e.target.style.display = 'none'; }}
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
            <button className="notification-btn" onClick={handleNotificationClick}>
              <Bell size={20} />
              {farmerStats.unreadNotifications > 0 && (
                <span className="notification-badge">{farmerStats.unreadNotifications}</span>
              )}
            </button>
            <div className="profile-section">
              <div className="profile-info">
                <div className="profile-name">{farmerProfile.name}</div>
                <div className="profile-subtitle">{farmerProfile.farmName}</div>
              </div>
              <div className="profile-avatar">
                {farmerProfile.avatar ? (
                  <img src={farmerProfile.avatar} alt={farmerProfile.name} />
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

      {/* All the existing modals... (ADD/EDIT CROP, SHIPMENT, EXPENSE, CUSTOMER, etc.) */}
      {/* Add/Edit Crop Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingCrop ? 'Edit Crop' : 'Add New Crop'}</h2>
              <button className="close-btn" onClick={closeModal}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">
                    <Sprout size={16} />
                    Crop Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="form-input"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter crop name"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <Package size={16} />
                    Crop Type *
                  </label>
                  <select
                    name="type"
                    className="form-select"
                    value={formData.type}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Type</option>
                    <option value="Rice">Rice</option>
                    <option value="Wheat">Wheat</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Pulses">Pulses</option>
                    <option value="Cotton">Cotton</option>
                    <option value="Sugarcane">Sugarcane</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <Target size={16} />
                    Area (acres) *
                  </label>
                  <input
                    type="number"
                    name="area"
                    className="form-input"
                    value={formData.area}
                    onChange={handleInputChange}
                    placeholder="Enter area in acres"
                    step="0.1"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <Package size={16} />
                    Quantity (kg) *
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    className="form-input"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    placeholder="Enter expected/actual quantity"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <DollarSign size={16} />
                    Price per kg
                  </label>
                  <input
                    type="number"
                    name="pricePerKg"
                    className="form-input"
                    value={formData.pricePerKg}
                    onChange={handleInputChange}
                    placeholder="Enter price per kg"
                    step="0.01"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <Sprout size={16} />
                    Soil Type *
                  </label>
                  <select
                    name="soilType"
                    className="form-select"
                    value={formData.soilType}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Soil Type</option>
                    <option value="Clay">Clay</option>
                    <option value="Sandy">Sandy</option>
                    <option value="Loamy">Loamy</option>
                    <option value="Silt">Silt</option>
                    <option value="Black Cotton">Black Cotton</option>
                    <option value="Red">Red</option>
                    <option value="Alluvial">Alluvial</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <Activity size={16} />
                    Status *
                  </label>
                  <select
                    name="status"
                    className="form-select"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Status</option>
                    <option value="Planned">Planned</option>
                    <option value="Planted">Planted</option>
                    <option value="Growing">Growing</option>
                    <option value="Harvested">Harvested</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <Droplets size={16} />
                    Water Requirement
                  </label>
                  <select
                    name="waterRequirement"
                    className="form-select"
                    value={formData.waterRequirement}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Requirement</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <Calendar size={16} />
                    Planted Date
                  </label>
                  <input
                    type="date"
                    name="plantedDate"
                    className="form-input"
                    value={formData.plantedDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <Calendar size={16} />
                    Expected/Actual Harvest Date
                  </label>
                  <input
                    type="date"
                    name="harvestDate"
                    className="form-input"
                    value={formData.harvestDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <TrendingUp size={16} />
                    Expected Yield (kg/acre)
                  </label>
                  <input
                    type="text"
                    name="expectedYield"
                    className="form-input"
                    value={formData.expectedYield}
                    onChange={handleInputChange}
                    placeholder="e.g., 500 kg/acre"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <MapPin size={16} />
                    GPS Coordinates
                  </label>
                  <input
                    type="text"
                    name="gpsCoordinates"
                    className="form-input"
                    value={formData.gpsCoordinates}
                    onChange={handleInputChange}
                    placeholder="e.g., 19.0760° N, 72.8777° E"
                  />
                </div>
                <div className="form-group full-width">
                  <label className="form-label">
                    <Shield size={16} />
                    Pesticides/Fertilizers Used
                  </label>
                  <textarea
                    name="pesticides"
                    className="form-textarea"
                    value={formData.pesticides}
                    onChange={handleInputChange}
                    placeholder="Enter details about pesticides and fertilizers used"
                    rows={3}
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
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Add any additional notes about this crop"
                    rows={3}
                  />
                </div>
                <div className="form-group full-width">
                  <label className="form-label">
                    <Upload size={16} />
                    Crop Image
                  </label>
                  <div
                    className={`image-upload ${imagePreview ? 'has-image' : ''}`}
                    onClick={() => document.getElementById('image-upload').click()}
                  >
                    {imagePreview ? (
                      <img src={imagePreview} alt="Crop preview" className="image-preview" />
                    ) : (
                      <div className="upload-placeholder">
                        <Upload size={32} />
                        <p>Click to upload crop image</p>
                        <span>Supports JPG, PNG, GIF up to 10MB</span>
                      </div>
                    )}
                  </div>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleImageUpload}
                  />
                </div>

              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={saveCrop} disabled={loading}>
                {loading ? 'Saving...' : (editingCrop ? 'Update Crop' : 'Add Crop')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Shipment Modal */}
      {isShipmentModalOpen && (
        <div className="modal-overlay" onClick={closeShipmentModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Shipment</h2>
              <button className="close-btn" onClick={closeShipmentModal}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">
                    <Sprout size={16} />
                    Select Crop *
                  </label>
                  <select
                    name="cropId"
                    className="form-select"
                    value={shipmentData.cropId}
                    onChange={handleShipmentInputChange}
                  >
                    <option value="">Choose a crop</option>
                    {crops.filter(crop =>
                      crop.status === 'Harvested' &&
                      parseFloat(crop.availableQuantity || crop.quantity) > 0
                    ).map(crop => (
                      <option key={crop.id} value={crop.id}>
                        {crop.name} - Available: {crop.availableQuantity || crop.quantity}kg
                      </option>
                    ))}
                  </select>
                  {shipmentData.cropId && (
                    <div style={{ marginTop: '8px', padding: '12px', background: '#f8fafc', borderRadius: '6px' }}>
                      {(() => {
                        const selectedCrop = crops.find(c => c.id == shipmentData.cropId);
                        return selectedCrop ? (
                          <div>
                            <p><strong>Batch ID:</strong> {selectedCrop.batchId}</p>
                            <p><strong>Type:</strong> {selectedCrop.type}</p>
                            <p><strong>Available Quantity:</strong> {selectedCrop.availableQuantity || selectedCrop.quantity}kg</p>
                            <p><strong>Current Price:</strong> {selectedCrop.pricePerKg ? formatCurrency(selectedCrop.pricePerKg) : 'Not set'}</p>
                          </div>
                        ) : null;
                      })()}
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <Building2 size={16} />
                    Select Distributor *
                  </label>
                  <select
                    name="distributorUserId"
                    className="form-select"
                    value={shipmentData.distributorUserId}
                    onChange={handleShipmentInputChange}
                    required
                  >
                    <option value="">Choose a distributor</option>
                    {(distributors || []).map(d => {
                      const label = d.name || d.fullName || `Distributor ${d.id}`;
                      return (
                        <option key={d.id} value={d.id}>
                          {label}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <Package size={16} />
                    Quantity (kg) *
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    className="form-input"
                    value={shipmentData.quantity}
                    onChange={handleShipmentInputChange}
                    placeholder="Enter quantity to ship"
                    step="0.1"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <DollarSign size={16} />
                    Price per kg
                  </label>
                  <input
                    type="number"
                    name="pricePerKg"
                    className="form-input"
                    value={shipmentData.pricePerKg}
                    onChange={handleShipmentInputChange}
                    placeholder="Override default price if needed"
                    step="0.01"
                  />
                </div>
                <div className="form-group full-width">
                  <label className="form-label">
                    <FileText size={16} />
                    Shipment Notes
                  </label>
                  <textarea
                    name="notes"
                    className="form-textarea"
                    value={shipmentData.notes}
                    onChange={handleShipmentInputChange}
                    placeholder="Add any special instructions or notes for this shipment"
                    rows={3}
                  />
                </div>
              </div>
              {/* Shipment Summary */}
              {shipmentData.cropId && shipmentData.quantity && (
                <div style={{ marginTop: '20px', padding: '16px', background: '#f8fafc', borderRadius: '8px' }}>
                  <h4>Shipment Summary</h4>
                  <p><strong>Total Value:</strong> {formatCurrency(
                    parseFloat(shipmentData.quantity || 0) *
                    parseFloat(shipmentData.pricePerKg || crops.find(c => c.id == shipmentData.cropId)?.pricePerKg || 0)
                  )}</p>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeShipmentModal}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={saveShipment} disabled={loading}>
                {loading ? 'Creating...' : 'Create Shipment'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Add/Edit Expense Modal */}
      {isExpenseModalOpen && (
        <div className="modal-overlay" onClick={() => setIsExpenseModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingExpense ? 'Edit Expense' : 'Add New Expense'}</h2>
              <button className="close-btn" onClick={() => setIsExpenseModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">
                    <Calculator size={16} />
                    Category *
                  </label>
                  <select
                    name="category"
                    className="form-select"
                    value={expenseData.category}
                    onChange={handleExpenseInputChange}
                  >
                    <option value="">Select Category</option>
                    {expenseCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <DollarSign size={16} />
                    Amount (₹) *
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
                    <Calendar size={16} />
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
                    <Sprout size={16} />
                    Related Crop (Optional)
                  </label>
                  <select
                    name="cropId"
                    className="form-select"
                    value={expenseData.cropId}
                    onChange={handleExpenseInputChange}
                  >
                    <option value="">Select Crop (Optional)</option>
                    {crops.map(crop => (
                      <option key={crop.id} value={crop.id}>
                        {crop.name} - {crop.type}
                      </option>
                    ))}
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
                    placeholder="Describe the expense in detail"
                    rows={3}
                  />
                </div>
                <div className="form-group full-width">
                  <label className="form-label">
                    <Upload size={16} />
                    Receipt Image (Optional)
                  </label>
                  <div className="image-upload">
                    <div className="upload-placeholder">
                      <Upload size={24} />
                      <p>Upload receipt image</p>
                      <span>JPG, PNG up to 5MB</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setIsExpenseModalOpen(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={saveExpense} disabled={loading}>
                {loading ? 'Saving...' : (editingExpense ? 'Update Expense' : 'Add Expense')}
              </button>
            </div>
          </div>
        </div>
      )}

      

      {/* QR Code Modal */}
      {qrModalCrop && (
        <div className="modal-overlay" onClick={() => setQrModalCrop(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h2>QR Code - {qrModalCrop.name}</h2>
              <button className="close-btn" onClick={() => setQrModalCrop(null)}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body" style={{ textAlign: 'center' }}>
              <div className="qr-center">
                <QRCode
                  value={qrModalCrop?.qrData || ''}  // points to /showcase/{publicId}
                  size={256}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <div style={{ marginTop: '12px' }}>
                <small>Public link:</small>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                  <code style={{ fontSize: 12, wordBreak: 'break-all' }}>
                    {qrModalCrop?.qrData || '-'}
                  </code>
                  <button
                    className="btn btn-secondary"
                    onClick={() => navigator.clipboard.writeText(qrModalCrop?.qrData || '')}
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div style={{ marginTop: '20px', textAlign: 'left' }}>
                <p><strong>Crop:</strong> {qrModalCrop.name}</p>
                <p><strong>Type:</strong> {qrModalCrop.type}</p>
                <p><strong>Batch ID:</strong> {qrModalCrop.batchId}</p>
                <p><strong>Quantity:</strong> {qrModalCrop.quantity} kg</p>
                <p><strong>Farmer:</strong> {farmerProfile.name}</p>
                <p><strong>Location:</strong> {farmerProfile.location}</p>
                {qrModalCrop.pricePerKg && (
                  <p><strong>Price:</strong> {formatCurrency(qrModalCrop.pricePerKg)}/kg</p>
                )}
                <p><strong>Generated:</strong> {new Date().toLocaleString()}</p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setQrModalCrop(null)}>
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
    </div>
  );
};

export default CropManagementSystem;
