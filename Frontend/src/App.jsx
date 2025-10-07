import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';

import LandingPage from './LandingPage';
import AuthPage from './AuthPage';
import CropManagementSystem from './CropManagementSystem';
import AdminDashboard from './AdminDashboard';
import DistributorDashboard from './DistributorDashboard';
import RetailerDashboard from './RetailerDashboard';
import CropShowcase from './CropShowcase';
import AIChatbot from './AIChatbot';
import CropHealthDetector from './CropHealthDetector';

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('userData');
    
  }, [navigate]);

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/AuthPage" element={<AuthPage />} />
        <Route path="/farmer" element={<CropManagementSystem />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/distributor" element={<DistributorDashboard />} />
        <Route path="/retailer" element={<RetailerDashboard />} />
        <Route path="/showcase/:cropId" element={<CropShowcase />} />
        <Route path="/crop-health" element={<CropHealthDetector />} />
      </Routes>
      <AIChatbot />
    </>
  );
}

export default App;
