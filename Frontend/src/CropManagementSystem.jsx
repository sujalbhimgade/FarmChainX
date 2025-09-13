import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Filter, Edit, Trash2, Download, X, Upload, MapPin,
  User, Settings, BarChart3, Calendar, Bell, Menu, LogOut, Home,
  Sprout, TrendingUp, DollarSign, Cloud, Thermometer
} from 'lucide-react';
import './CropManagementSystem.css';
import QRCode from 'react-qr-code';
import farmchainxLogo from './assets/farmchainxLogo.png';

const CropManagementSystem = () => {
  const [crops, setCrops] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCrop, setEditingCrop] = useState(null);
  const [qrModalCrop, setQrModalCrop] = useState(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [filters, setFilters] = useState({
    cropType: '',
    status: '',
    search: ''
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    area: '',
    soilType: '',
    status: '',
    plantedDate: '',
    harvestDate: '',
    gpsCoordinates: '',
    pesticides: '',
    notes: '',
    image: null
  });

  
  const [farmerProfile] = useState({
    name: 'Farmer',
    farmName: 'Ujwal Farm',
    location: 'Maharashtra, India',
    totalArea: '45 acres',
    avatar: null
  });

  useEffect(() => {
    const storedCrops = localStorage.getItem('crops');
    if (storedCrops) {
      setCrops(JSON.parse(storedCrops));
    } else {
      fetch('/crops.json')
        .then(res => res.json())
        .then(data => setCrops(data))
        .catch(err => console.error('Failed to load crops JSON', err));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('crops', JSON.stringify(crops));
  }, [crops]);

  
  const resetForm = () => {
    setFormData({
      name: '',
      type: '',
      area: '',
      soilType: '',
      status: '',
      plantedDate: '',
      harvestDate: '',
      gpsCoordinates: '',
      pesticides: '',
      notes: '',
      image: null
    });
    setImagePreview(null);
    setEditingCrop(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (crop) => {
    setFormData({ ...crop });
    setImagePreview(crop.image);
    setEditingCrop(crop);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };
   const handleLogout = () => {
  
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    
    
    console.log('User logged out successfully');
    
   
    navigate('/auth');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('File size too large. Please select an image under 10MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target.result;
        setImagePreview(imageData);
        setFormData(prev => ({
          ...prev,
          image: imageData
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const saveCrop = () => {
    if (!formData.name || !formData.type || !formData.area || !formData.soilType || !formData.status) {
      alert('Please fill in all required fields');
      return;
    }

    if (editingCrop) {
      setCrops(prev => prev.map(crop => 
        crop.id === editingCrop.id ? { ...formData, id: editingCrop.id } : crop
      ));
    } else {
      const newCrop = {
        ...formData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      setCrops(prev => [...prev, newCrop]);
    }

    closeModal();
  };

  const deleteCrop = (id) => {
    if (window.confirm('Are you sure you want to delete this crop?')) {
      setCrops(prev => prev.filter(crop => crop.id !== id));
    }
  };

  const exportData = () => {
    if (crops.length === 0) {
      alert('No crops to export!');
      return;
    }

    const csvContent = [
      ['Name', 'Type', 'Area (acres)', 'Soil Type', 'Status', 'Planted Date', 'Harvest Date', 'GPS Coordinates', 'Pesticides', 'Notes'].join(','),
      ...crops.map(crop => [
        crop.name,
        crop.type,
        crop.area,
        crop.soilType,
        crop.status,
        crop.plantedDate || '',
        crop.harvestDate || '',
        crop.gpsCoordinates || '',
        `"${(crop.pesticides || '').replace(/"/g, '""')}"`,
        `"${(crop.notes || '').replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `crops_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
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

  const getStatusBadge = (status) => {
    const statusClass = {
      'Growing': 'status-growing',
      'Harvested': 'status-harvested',
      'Planned': 'status-planned',
      'Planted': 'status-growing'
    }[status] || 'status-planned';
    
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

  const handlePrint = () => {
    const qrElement = document.querySelector("#printableQR svg");
    if (!qrElement) return;

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(qrElement);
    const svgData = "data:image/svg+xml;base64," + btoa(svgString);

    const printWindow = window.open("", "_blank", "width=400,height=600");
    printWindow.document.write(`
      <html>
        <head>
          <title>Print QR</title>
          <style>
            body { text-align: center; font-family: Arial; margin-top: 50px; }
            img { width: 200px; height: 200px; }
            p { margin-top: 10px; font-size: 16px; font-weight: bold; }
          </style>
        </head>
        <body>
          <img src="${svgData}" />
          <p>${qrModalCrop.name}</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const dashboardStats = {
    totalCrops: crops.length,
    totalArea: crops.reduce((sum, crop) => sum + parseFloat(crop.area || 0), 0),
    activeCrops: crops.filter(crop => crop.status === 'Growing' || crop.status === 'Planted').length,
    harvestedCrops: crops.filter(crop => crop.status === 'Harvested').length
  };

  
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'crops', label: 'My Crops', icon: Sprout },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'weather', label: 'Weather', icon: Cloud },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const renderDashboardContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="dashboard-content">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <Sprout size={24} />
                </div>
                <div className="stat-info">
                  <div className="stat-value">{dashboardStats.totalCrops}</div>
                  <div className="stat-label">Total Crops</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <TrendingUp size={24} />
                </div>
                <div className="stat-info">
                  <div className="stat-value">{dashboardStats.totalArea}</div>
                  <div className="stat-label">Total Area (acres)</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <Calendar size={24} />
                </div>
                <div className="stat-info">
                  <div className="stat-value">{dashboardStats.activeCrops}</div>
                  <div className="stat-label">Active Crops</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <DollarSign size={24} />
                </div>
                <div className="stat-info">
                  <div className="stat-value">{dashboardStats.harvestedCrops}</div>
                  <div className="stat-label">Harvested</div>
                </div>
              </div>
            </div>

            <div className="dashboard-grid">
              <div className="dashboard-card">
                <h3>Recent Activities</h3>
                <div className="activity-list">
                  <div className="activity-item">
                    <Sprout size={16} />
                    <span>Wheat crop planted in Field A</span>
                    <span className="activity-time">2 days ago</span>
                  </div>
                  <div className="activity-item">
                    <Calendar size={16} />
                    <span>Rice harvest scheduled for next week</span>
                    <span className="activity-time">1 week ago</span>
                  </div>
                  <div className="activity-item">
                    <Cloud size={16} />
                    <span>Weather alert: Heavy rain expected</span>
                    <span className="activity-time">3 days ago</span>
                  </div>
                </div>
              </div>

              <div className="dashboard-card">
                <h3>Weather Forecast</h3>
                <div className="weather-info">
                  <div className="weather-today">
                    <Thermometer size={20} />
                    <span>28°C</span>
                    <span>Partly Cloudy</span>
                  </div>
                  <div className="weather-details">
                    <div>Humidity: 65%</div>
                    <div>Wind: 12 km/h</div>
                    <div>Precipitation: 10%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'crops':
        return renderCropsTable();

      case 'analytics':
        return (
          <div className="analytics-content">
            <h2>Analytics Dashboard</h2>
            <div className="analytics-placeholder">
              <BarChart3 size={64} />
              <p>Analytics features coming soon...</p>
              <p>Track crop performance, yield predictions, and farming insights.</p>
            </div>
          </div>
        );

      case 'calendar':
        return (
          <div className="calendar-content">
            <h2>Farming Calendar</h2>
            <div className="calendar-placeholder">
              <Calendar size={64} />
              <p>Calendar features coming soon...</p>
              <p>Schedule planting, harvesting, and maintenance activities.</p>
            </div>
          </div>
        );

      case 'weather':
        return (
          <div className="weather-content">
            <h2>Weather Information</h2>
            <div className="weather-placeholder">
              <Cloud size={64} />
              <p>Detailed weather information coming soon...</p>
              <p>Get forecasts, alerts, and farming recommendations.</p>
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
              <p>Customize your dashboard, notifications, and preferences.</p>
            </div>
          </div>
        );

      default:
        return renderCropsTable();
    }
  };

  const renderCropsTable = () => (
    <>
      <div className="header">
        <h1>My Crops</h1>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={exportData}>
            <Download size={16} />
            Export
          </button>
          <button className="btn btn-primary" onClick={openAddModal}>
            <Plus size={16} />
            Add Crop
          </button>
        </div>
      </div>

      <div className="search-filter-bar">
        <select 
          className="filter-select"
          value={filters.cropType}
          onChange={(e) => setFilters(prev => ({ ...prev, cropType: e.target.value }))}
        >
          <option value="">All Crop Types</option>
          <option value="Cereal">Cereal</option>
          <option value="Vegetable">Vegetable</option>
          <option value="Fruit">Fruit</option>
        </select>
        
        <select 
          className="filter-select"
          value={filters.status}
          onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
        >
          <option value="">All Status</option>
          <option value="Planted">Planted</option>
          <option value="Growing">Growing</option>
          <option value="Harvested">Harvested</option>
          <option value="Planned">Planned</option>
        </select>

        <div className="search-container">
          <Search size={20} className="search-icon" />
          <input 
            type="text"
            className="search-input"
            placeholder="Search crops..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          />
        </div>
      </div>

      <div className="crops-table">
        {filteredCrops.length === 0 ? (
          <div className="empty-state">
            <h3>No crops found</h3>
            <p>Start by adding your first crop to track its progress.</p>
            <button className="btn btn-primary" onClick={openAddModal}>
              Add Your First Crop
            </button>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Crop</th>
                  <th>Type</th>
                  <th>Soil Type</th>
                  <th>Status</th>
                  <th>Pesticides</th>
                  <th>Planted Date</th>
                  <th>Harvest Date</th>
                  <th>Location</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCrops.map((crop) => (
                  <tr key={crop.id}>
                    <td>
                      <div className="crop-info">
                        {crop.image ? (
                          <img 
                            src={crop.image} 
                            alt={crop.name} 
                            className="crop-image"
                          />
                        ) : (
                          <div className="crop-image-placeholder">
                            No Image
                          </div>
                        )}
                        <div className="crop-details">
                          <div className="crop-name">{crop.name}</div>
                          {crop.notes && (
                            <div className="crop-notes">
                              {crop.notes.substring(0, 50)}{crop.notes.length > 50 ? '...' : ''}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>{crop.type}</td>
                    <td>{crop.soilType}</td>
                    <td>{getStatusBadge(crop.status)}</td>
                    <td>{crop.pesticides || '-'}</td>
                    <td>{formatDate(crop.plantedDate)}</td>
                    <td>{formatDate(crop.harvestDate)}</td>
                    <td>
                      {crop.gpsCoordinates ? (
                        <div className="gps-location">
                          <MapPin size={14} />
                          {crop.gpsCoordinates}
                        </div>
                      ) : '-'}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn btn-small btn-edit"
                          onClick={() => openEditModal(crop)}
                        >
                          <Edit size={12} />
                          
                        </button>
                        <button 
                          className="btn btn-small btn-delete"
                          onClick={() => deleteCrop(crop.id)}
                        >
                          <Trash2 size={12} />
                          
                        </button>

                        <button  
                        className="btn btn-small btn-qr"
                        onClick={() => setQrModalCrop(crop)}
                        >
                       <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                       <rect width="5" height="5" x="3" y="3" rx="1"/>
                       <rect width="5" height="5" x="16" y="3" rx="1"/>
                       <rect width="5" height="5" x="3" y="16" rx="1"/>
                       <path d="M21 16h-3a2 2 0 0 0-2 2v3"/>
                       <path d="M21 21v.01"/>
                       <path d="M12 7v3a2 2 0 0 1-2 2H7"/>
                       <path d="M3 12h.01"/>
                       <path d="M12 3h.01"/>
                       <path d="M12 16v.01"/>
                       <path d="M16 12h1"/>
                       <path d="M21 12v.01"/>
                       <path d="M12 21v-1"/>
                       </svg>
                       </button>

                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );

  return (
    <div className="farmer-dashboard">
    
      <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-section">
            <img src={farmchainxLogo} alt="FarmChainX" className="sidebar-logo" />
            {!sidebarCollapsed && <span className="logo-text">FarmChainX</span>}
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
              <span className="notification-badge">3</span>
            </button>
            
            <div className="profile-section">
              <div className="profile-info">
                <span className="profile-name">{farmerProfile.name}</span>
                <span className="profile-subtitle">{farmerProfile.farmName}</span>
              </div>
              <div className="profile-avatar">
                {farmerProfile.avatar ? (
                  <img src={farmerProfile.avatar} alt="Profile" />
                ) : (
                  <User size={24} />
                )}
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

      {isModalOpen && (
  <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
    <div className="modal-content">
      <div className="modal-header">
        <h2>{editingCrop ? 'Edit Crop' : 'Add New Crop'}</h2>
        <button className="close-btn" onClick={closeModal}>
          <X size={24} />
        </button>
      </div>

      <div className="modal-body">
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Crop Name *</label>
            <input 
              type="text" 
              className="form-input"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Crop Type *</label>
            <select 
              className="form-select"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Crop Type</option>
              <option value="Cereal">Cereal</option>
              <option value="Vegetable">Vegetable</option>
              <option value="Fruit">Fruit</option>
              <option value="Cotton">Cotton</option>
              <option value="Sugarcane">Sugarcane</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Area (acres) *</label>
            <input 
              type="number" 
              className="form-input"
              name="area"
              value={formData.area}
              onChange={handleInputChange}
              step="0.1" 
              min="0" 
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Soil Type *</label>
            <select 
              className="form-select"
              name="soilType"
              value={formData.soilType}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Soil Type</option>
              <option value="Clay">Clay</option>
              <option value="Sandy">Sandy</option>
              <option value="Loam">Loam</option>
              <option value="Silt">Silt</option>
              <option value="Peaty">Peaty</option>
              <option value="Chalky">Chalky</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Status *</label>
            <select 
              className="form-select"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Status</option>
              <option value="Planned">Planned</option>
              <option value="Planted">Planted</option>
              <option value="Growing">Growing</option>
              <option value="Harvested">Harvested</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Planted Date</label>
            <input 
              type="date" 
              className="form-input"
              name="plantedDate"
              value={formData.plantedDate}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Expected Harvest Date</label>
            <input 
              type="date" 
              className="form-input"
              name="harvestDate"
              value={formData.harvestDate}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">GPS Coordinates</label>
            <input 
              type="text" 
              className="form-input"
              name="gpsCoordinates"
              value={formData.gpsCoordinates}
              onChange={handleInputChange}
              placeholder="e.g., 21.1458, 79.0882"
            />
          </div>

          <div className="form-group full-width">
            <label className="form-label">Pesticides Used</label>
            <textarea 
              className="form-textarea"
              name="pesticides"
              value={formData.pesticides}
              onChange={handleInputChange}
              placeholder="List any pesticides, fertilizers, or treatments used..."
            />
          </div>

          <div className="form-group full-width">
            <label className="form-label">Additional Notes</label>
            <textarea 
              className="form-textarea"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Any additional information about this crop..."
            />
          </div>

          <div className="form-group full-width">
            <label className="form-label">Crop Image</label>
            <div 
              className={`image-upload ${imagePreview ? 'has-image' : ''}`}
              onClick={() => document.getElementById('imageInput').click()}
            >
              <input 
                type="file" 
                id="imageInput" 
                accept="image/*" 
                style={{ display: 'none' }} 
                onChange={handleImageUpload}
              />
              {imagePreview ? (
                <img 
                  src={imagePreview} 
                  alt="Crop preview" 
                  className="image-preview"
                />
              ) : (
                <div className="upload-placeholder">
                  <Upload size={48} />
                  <p>Click to upload crop image</p>
                  <span>Supports: JPG, PNG, GIF up to 10MB</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
            
      <div className="modal-footer">
        <button className="btn btn-secondary" onClick={closeModal}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={saveCrop}>
          {editingCrop ? 'Update Crop' : 'Save Crop'}
        </button>
      </div>
    </div>
  </div>
)}


      {qrModalCrop && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setQrModalCrop(null)}>
          <div className="modal-content">
            <div className="modal-header">
              <h2>QR Code for {qrModalCrop.name}</h2>
              <button className="close-btn" onClick={() => setQrModalCrop(null)}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body" style={{ textAlign: "center" }}>
              <div id="printableQR">
                <QRCode value={`http://localhost:5178/crop/${qrModalCrop.id}`} size={200} />
                <p>{qrModalCrop.name}</p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={handlePrint}>Print</button>
              <button className="btn btn-primary" onClick={() => setQrModalCrop(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CropManagementSystem;
