import { Routes, Route } from 'react-router-dom';
import './App.css';
import LandingPage from './LandingPage';
import AuthPage from './AuthPage';
import CropManagementSystem from './CropManagementSystem';
import AdminDashboard from './AdminDashboard';
import DistributorDashboard from './DistributorDashboard';
import RetailerDashboard from './RetailerDashboard';
import ConsumerDashboard from './ConsumerDashboard';
import CropShowcase from './CropShowcase';


function App() {
  return (
     <Routes>
       
      <Route path="/" element={<LandingPage />} />
      <Route path="/AuthPage" element={<AuthPage />} />
      <Route path="/Farmer" element={<CropManagementSystem />} />
      <Route path="/CropShowcase" element={<CropShowcase />} />
      <Route path="/Farmer" element={<CropManagementSystem />} />
      <Route path="/admin" element={<AdminDashboard/>} />
      <Route path="/distributor" element={<DistributorDashboard/>} />
      <Route path="/Retailer" element={<RetailerDashboard />} />
      <Route path="/consumer" element={<ConsumerDashboard/>} />
     </Routes>
  );
}

export default App;
