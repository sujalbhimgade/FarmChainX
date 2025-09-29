import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import './CropShowcase.css';
import apiService from './conc/api';

const CropShowcase = () => {
    const { cropId } = useParams();
    const [searchParams] = useSearchParams();
    const [cropData, setCropData] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const publicId =
            cropId ||
            searchParams.get('publicId') ||
            searchParams.get('id') ||
            searchParams.get('crop_id');
        if (publicId) {
            loadPublic(publicId);
        } else {
            loadDefaultData();
        }
    }, [cropId, searchParams]);

    const loadPublic = async (publicId) => {
        try {
            const dto = await apiService.getPublicCrop(publicId);
            // Map backend DTO -> component data model
            const mapped = {
                name: dto.title || '—',
                variety: dto.type || '—',
                farmer: dto.farmName || '—',
                image: dto.image_url || '../src/assets/wheat.jpg',
                planting_date: dto.plantedDate || '—',
                harvest_date: dto.harvestDate || '—',
                growth_stage: dto.currentStage || '—',
                certification: dto.certification || '—',
                quality_score: dto.qualityScore ?? 0,
                temperature: dto.temperature || '—',
                humidity: dto.humidity || '—',
                location: dto.contactAddress || '—',
                phone: dto.contactPhone || '—',
                email: dto.contactEmail || '—',
                batch_id: dto.batchCode || '—',
                supply_chain: {
                    farmer: { name: dto.farmName || '—', date: dto.plantedDate || '—', location: dto.contactAddress || '—', status: (dto.progress?.farmer ? 'completed' : 'pending') },
                    distributor: { name: '—', date: '—', location: dto.currentHolder || '—', status: (dto.progress?.distributor ? 'completed' : 'pending') },
                    retailer: { name: '—', date: '—', location: '—', status: (dto.progress?.retailer ? 'completed' : 'pending') },
                    consumer: { date: '—', status: (dto.progress?.consumer ? 'completed' : 'pending') },
                },
                journey: dto.journey || [],
            };
            setCropData(mapped);
        } catch (e) {
            console.error('Error loading public crop:', e);
            loadDefaultData();
        } finally {
            setLoading(false);
        }
    };
   
    const loadDefaultData = () => {
        const defaultData = {
            name: "Organic Tomatoes",
            variety: "Cherry Tomato - Roma Variety",
            farmer: "Green Valley Organic Farms",
            image: "../src/assets/wheat.jpg",
            planting_date: "Mar 15, 2025",
            harvest_date: "Jul 20, 2025",
            growth_stage: "Mature",
            certification: "Organic",
            quality_score: 95,
            temperature: "22-28°C",
            humidity: "65-75%",
            location: "Green Valley, Karnataka, India",
            phone: "+91 98765 43210",
            email: "info@greenvalleyfarm.com",
            batch_id: "TOM-GVF-072125",
            supply_chain: {
                farmer: {
                    name: "Green Valley Organic Farms",
                    date: "Mar 15, 2025",
                    location: "Karnataka, India",
                    status: "completed"
                },
                distributor: {
                    name: "Fresh Harvest Logistics",
                    date: "Jul 22, 2025",
                    location: "Bangalore Hub",
                    status: "completed"
                },
                retailer: {
                    name: "Organic Market Plus",
                    date: "Jul 23, 2025",
                    location: "MG Road Store",
                    status: "completed"
                },
                consumer: {
                    date: "Jul 24, 2025",
                    status: "current"
                }
            }
        };
        setCropData(defaultData);
        setLoading(false);
    };

    const handleContactClick = (type, value) => {
        if (type === 'phone') {
            window.location.href = `tel:${value}`;
        } else if (type === 'email') {
            window.location.href = `mailto:${value}`;
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading crop information...</p>
            </div>
        );
    }

    if (!cropData) {
        return (
            <div className="error-container">
                <h2>Crop information not found</h2>
                <p>Please try scanning the QR code again.</p>
            </div>
        );
    }

    return (
        <div className="crop-showcase-container">
          
            <header className="showcase-header">
                <div className="header-content">
                    <div className="logo-section">
                        <i className="fas fa-seedling"></i>
                        <h1>FarmChainX</h1>
                    </div>
                    <div className="scan-status">
                        <i className="fas fa-qrcode"></i>
                        <span>Verified</span>
                    </div>
                </div>
            </header>

           
            <div className="main-content">
               
                <div className="crop-card">
                    <div className="crop-image-section">
                        <img src={cropData.image} alt={cropData.name} />
                        <div className="quality-badge">
                            <span>{cropData.quality_score}</span>
                            <small>Quality Score</small>
                        </div>
                    </div>
                    <div className="crop-details">
                        <h2>{cropData.name}</h2>
                        <p className="variety">{cropData.variety}</p>
                        <div className="farmer-tag">
                            <i className="fas fa-farm"></i>
                            <span>{cropData.farmer}</span>
                        </div>
                        <div className="batch-info">
                            <span>Batch: {cropData.batch_id}</span>
                        </div>
                    </div>
                </div>

              
                <div className="stats-grid">
                    <div className="stat-item">
                        <i className="fas fa-calendar"></i>
                        <div>
                            <h4>Planted</h4>
                            <p>{cropData.planting_date}</p>
                        </div>
                    </div>
                    <div className="stat-item">
                        <i className="fas fa-clock"></i>
                        <div>
                            <h4>Harvested</h4>
                            <p>{cropData.harvest_date}</p>
                        </div>
                    </div>
                    <div className="stat-item">
                        <i className="fas fa-leaf"></i>
                        <div>
                            <h4>Stage</h4>
                            <p>{cropData.growth_stage}</p>
                        </div>
                    </div>
                    <div className="stat-item">
                        <i className="fas fa-certificate"></i>
                        <div>
                            <h4>Certified</h4>
                            <p>{cropData.certification}</p>
                        </div>
                    </div>
                </div>

               
                <div className="info-tabs">
                    <div className="tab-nav">
                        <button
                            className={activeTab === 'overview' ? 'active' : ''}
                            onClick={() => setActiveTab('overview')}
                        >
                            <i className="fas fa-info-circle"></i>
                            Overview
                        </button>
                        {/* <button
                            className={activeTab === 'quality' ? 'active' : ''}
                            onClick={() => setActiveTab('quality')}
                        >
                            <i className="fas fa-award"></i>
                            Quality
                        </button> */}
                        {/* <button
                            className={activeTab === 'environment' ? 'active' : ''}
                            onClick={() => setActiveTab('environment')}
                        >
                            <i className="fas fa-globe"></i>
                            Environment
                        </button> */}
                    </div>

                    <div className="tab-content">
                        {activeTab === 'overview' && (
                            <div className="overview-content">
                                <div className="info-row">
                                    <div className="info-card">
                                        <i className="fas fa-tint"></i>
                                        <div>
                                            <h5>Irrigation</h5>
                                            <p>Drip System</p>
                                        </div>
                                    </div>
                                    <div className="info-card">
                                        <i className="fas fa-flask"></i>
                                        <div>
                                            <h5>Fertilizer</h5>
                                            <p>Organic Compost</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="info-row">
                                    <div className="info-card">
                                        <i className="fas fa-shield-alt"></i>
                                        <div>
                                            <h5>Pest Control</h5>
                                            <p>Natural Neem</p>
                                        </div>
                                    </div>
                                    <div className="info-card">
                                        <i className="fas fa-seedling"></i>
                                        <div>
                                            <h5>Seeds</h5>
                                            <p>Certified Organic</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="timeline-compact">
                                    <div className="timeline-step">
                                        <i className="fas fa-user-tie"></i>
                                        <span>Farmer</span>
                                    </div>
                                    <div className="timeline-line"></div>  
                                    <div className="timeline-step">
                                        <i className="fas fa-truck"></i>
                                        <span>Distributor</span>
                                    </div>
                                    <div className="timeline-line"></div>  
                                    <div className="timeline-step">
                                        <i className="fas fa-store"></i>
                                        <span>Retailer</span>
                                    </div>
                                    <div className="timeline-line"></div>  
                                    <div className="timeline-step active">
                                        <i className="fas fa-shopping-cart"></i>
                                        <span>Consumer</span>
                                    </div>
                                </div>


                            </div>
                        )}

                        {/* {activeTab === 'quality' && (
                            <div className="quality-content">
                                <div className="quality-metrics">
                                    <div className="metric">
                                        <div className="progress-ring">
                                            <div className="progress-value">92%</div>
                                        </div>
                                        <span>Nutrition</span>
                                    </div>
                                    <div className="metric">
                                        <div className="progress-ring">
                                            <div className="progress-value">98%</div>
                                        </div>
                                        <span>Freshness</span>
                                    </div>
                                    <div className="metric">
                                        <div className="progress-ring">
                                            <div className="progress-value">100%</div>
                                        </div>
                                        <span>Safety</span>
                                    </div>
                                </div>
                                <div className="certifications">
                                    <div className="cert-badge">
                                        <i className="fas fa-leaf"></i>
                                        <span>USDA Organic</span>
                                    </div>
                                    <div className="cert-badge">
                                        <i className="fas fa-check-double"></i>
                                        <span>ISO 22000</span>
                                    </div>
                                    <div className="cert-badge">
                                        <i className="fas fa-shield-alt"></i>
                                        <span>HACCP</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'environment' && (
                            <div className="environment-content">
                                <div className="env-stats">
                                    <div className="env-stat">
                                        <i className="fas fa-thermometer-half"></i>
                                        <div>
                                            <h5>{cropData.temperature}</h5>
                                            <p>Temperature</p>
                                        </div>
                                    </div>
                                    <div className="env-stat">
                                        <i className="fas fa-tint"></i>
                                        <div>
                                            <h5>{cropData.humidity}</h5>
                                            <p>Humidity</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="sustainability">
                                    <h5>Sustainability Practices</h5>
                                    <div className="practice-tags">
                                        <span><i className="fas fa-recycle"></i> Water Conservation</span>
                                        <span><i className="fas fa-leaf"></i> Carbon Neutral</span>
                                        <span><i className="fas fa-heart"></i> Biodiversity</span>
                                    </div>
                                </div>
                            </div>
                        )} */}
                    </div>
                </div>

               
                <div className="contact-card">
                    <h4>Farm Contact</h4>
                    <div className="contact-info">
                        <div className="contact-item">
                            <i className="fas fa-map-marker-alt"></i>
                            <span>{cropData.location}</span>
                        </div>
                        <div
                            className="contact-item clickable"
                            onClick={() => handleContactClick('phone', cropData.phone)}
                        >
                            <i className="fas fa-phone"></i>
                            <span>{cropData.phone}</span>
                        </div>
                        <div
                            className="contact-item clickable"
                            onClick={() => handleContactClick('email', cropData.email)}
                        >
                            <i className="fas fa-envelope"></i>
                            <span>{cropData.email}</span>
                        </div>
                    </div>
                </div>
            </div>

            
            <footer className="footer">
                <p>&copy; 2025 FarmChainX - Transparent Agriculture</p>
            </footer>
        </div>
    );
};

export default CropShowcase;