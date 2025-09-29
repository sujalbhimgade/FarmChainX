import React, { useState, useEffect } from 'react';
import { ArrowLeft, Package, Truck, ShoppingCart, CheckCircle, Clock, MapPin, QrCode, RefreshCw } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';
import './Traceability.css';

const Traceability = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [currentUserRole, setCurrentUserRole] = useState('Farmer');
  const [journey, setJourney] = useState([]);
  const [showQR, setShowQR] = useState(false);

  // Simple role flow
  const roles = ['Farmer', 'Distributor', 'Retailer', 'Consumer'];

  const roleConfig = {
    Farmer: { icon: Package, color: '#10b981', label: 'Farm' },
    Distributor: { icon: Truck, color: '#3b82f6', label: 'Transport' },
    Retailer: { icon: ShoppingCart, color: '#f59e0b', label: 'Store' },
    Consumer: { icon: CheckCircle, color: '#8b5cf6', label: 'Purchase' }
  };

  useEffect(() => {
    // Generate simple journey data
    const journeyData = roles.map((role, index) => ({
      id: index + 1,
      role,
      status: index === 0 ? 'completed' : index === 1 ? 'active' : 'pending',
      batchId: productId || 'BATCH123',
      product: 'Organic Tomatoes',
      quantity: `${500 - index * 10} kg`,
      location: getLocation(role),
      date: index === 0 ? '2025-09-01' : index === 1 ? '2025-09-03' : null,
      canUpdate: role === currentUserRole && index <= 1
    }));
    setJourney(journeyData);
  }, [productId, currentUserRole]);

  const getLocation = (role) => {
    const locations = {
      Farmer: 'Maharashtra, India',
      Distributor: 'Mumbai Hub',
      Retailer: 'Delhi Store',
      Consumer: 'End Customer'
    };
    return locations[role];
  };

  const updateStatus = (stepId) => {
    setJourney(prev => prev.map(item => {
      if (item.id === stepId) {
        return { ...item, status: 'completed', date: new Date().toISOString().split('T')[0] };
      }
      if (item.id === stepId + 1) {
        return { ...item, status: 'active' };
      }
      return item;
    }));
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'completed': return 'step-completed';
      case 'active': return 'step-active';
      default: return 'step-pending';
    }
  };

  const completedSteps = journey.filter(step => step.status === 'completed').length;
  const progressPercent = (completedSteps / journey.length) * 100;

  return (
    <div className="trace-page">
      {/* Header */}
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          Back
        </button>

        <div className="header-info">
          <h1>Supply Chain Journey</h1>
          <p>Batch: {productId || 'BATCH123'} • Organic Tomatoes</p>
        </div>

        <div className="header-actions">
          <button className="btn btn-outline" onClick={() => setShowQR(true)}>
            <QrCode size={16} />
            QR Code
          </button>
          <button className="btn btn-outline">
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-section">
        <div className="progress-header">
          <span>Journey Progress</span>
          <span>{completedSteps} of {journey.length} stages completed</span>
        </div>
        <div className="progress-track">
          <div className="progress-bar" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>

      {/* Timeline */}
      <div className="timeline-container">
        <div className="timeline-track">
          {journey.map((step, index) => {
            const RoleIcon = roleConfig[step.role].icon;
            const isLast = index === journey.length - 1;

            return (
              <div key={step.id} className={`timeline-step ${getStatusClass(step.status)}`}>
                {/* Timeline Dot */}
                <div className="timeline-dot">
                  <div className="dot-inner">
                    <RoleIcon size={20} />
                  </div>
                  {!isLast && <div className="timeline-line"></div>}
                </div>

                {/* Content Card */}
                <div className="step-card">
                  <div className="card-header">
                    <div>
                      <h3>{step.role}</h3>
                      <span className={`status-badge ${step.status}`}>
                        {step.status === 'completed' && <CheckCircle size={12} />}
                        {step.status === 'active' && <Clock size={12} />}
                        {step.status === 'pending' && <Clock size={12} />}
                        {step.status.charAt(0).toUpperCase() + step.status.slice(1)}
                      </span>
                    </div>

                    {step.canUpdate && step.status === 'active' && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => updateStatus(step.id)}
                      >
                        Mark Complete
                      </button>
                    )}
                  </div>

                  <div className="card-details">
                    <div className="detail-row">
                      <span className="label">Product:</span>
                      <span>{step.product}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Quantity:</span>
                      <span>{step.quantity}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Location:</span>
                      <span className="location">
                        <MapPin size={12} />
                        {step.location}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Date:</span>
                      <span>{step.date || 'Pending'}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* QR Modal */}
      {showQR && (
        <div className="modal-overlay" onClick={() => setShowQR(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <h2>Product QR Code</h2>
            <div className="qr-wrapper">
              <QRCode value={`${window.location.origin}/traceability/${productId}`} size={150} />
            </div>
            <p>Scan to view journey</p>
            <button className="btn btn-primary" onClick={() => setShowQR(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Traceability;
