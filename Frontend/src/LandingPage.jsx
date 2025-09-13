import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowRight, Play, Check, Star, Users, Shield, Leaf,
    Truck, BarChart3, MapPin, Phone, Mail, Menu, X,
    ChevronDown, Package, Zap, Globe
} from 'lucide-react';
import './LandingPage.css';

const LandingPage = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeAccordion, setActiveAccordion] = useState(null);
    const [isVisible, setIsVisible] = useState({});

    useEffect(() => {
        
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
                    }
                });
            },
            { threshold: 0.1 }
        );

        document.querySelectorAll('[data-animate]').forEach((el) => {
            observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    const features = [
        {
            icon: Shield,
            title: "Complete Traceability",
            description: "Track your crops from farm to table with blockchain-powered transparency"
        },
        {
            icon: BarChart3,
            title: "Smart Analytics",
            description: "Get insights into crop performance, market trends, and supply chain efficiency"
        },
        {
            icon: Leaf,
            title: "Sustainability Focus",
            description: "Promote eco-friendly farming practices with detailed environmental tracking"
        },
        {
            icon: Users,
            title: "Multi-Stakeholder Platform",
            description: "Connect farmers, distributors, retailers, and consumers on one unified platform"
        },
        {
            icon: Zap,
            title: "Real-time Updates",
            description: "Instant notifications and live tracking throughout the entire supply chain"
        },
        {
            icon: Globe,
            title: "Global Standards",
            description: "Comply with international food safety and quality certification standards"
        }
    ];

    const testimonials = [
        {
            name: "Rajesh Kumar",
            role: "Organic Farmer",
            location: "Maharashtra",
            rating: 5,
            comment: "FarmChainX helped me connect directly with consumers and get better prices for my organic tomatoes. The traceability feature builds trust with my customers."
        },
        {
            name: "Priya Distributors",
            role: "Supply Chain Manager",
            location: "Mumbai",
            rating: 5,
            comment: "Managing inventory and tracking shipments has become so much easier. Real-time updates help us ensure fresh produce reaches retailers on time."
        },
        {
            name: "Fresh Market Store",
            role: "Retail Chain",
            location: "Delhi",
            rating: 5,
            comment: "Our customers love knowing exactly where their food comes from. The QR code system is brilliant for building consumer confidence."
        }
    ];

    const stats = [
        { number: "10,000+", label: "Farmers Connected" },
        { number: "50+", label: "Supply Chains Tracked" },
        { number: "1M+", label: "Products Traced" },
        { number: "95%", label: "Customer Satisfaction" }
    ];

    const accordionData = [
        {
            question: "How does crop traceability work?",
            answer: "Our platform uses blockchain technology to create an immutable record of your crop's journey. From planting to harvest to consumer purchase, every step is documented with timestamps, locations, and quality data."
        },
        {
            question: "Is the platform suitable for small-scale farmers?",
            answer: "Absolutely! We've designed FarmChainX to be user-friendly for farmers of all sizes. Our mobile app works on basic smartphones, and we offer affordable pricing plans."
        },
        {
            question: "How do consumers access crop information?",
            answer: "Consumers can simply scan the QR code on the product packaging using their smartphone camera. This instantly shows them the complete journey of their food."
        },
        {
            question: "What kind of support do you provide?",
            answer: "We offer comprehensive support including setup assistance, training sessions, 24/7 technical support, and regular webinars to help you maximize the platform's benefits."
        }
    ];

    const handleGetStarted = () => {
        navigate('/AuthPage');
    };

    return (
        <div className="landing-page">
            {/* Navigation */}
            <nav className="navbar">
                <div className="nav-container">
                    <div className="nav-brand">
                        <Leaf className="brand-icon" />
                        <span className="brand-text">FarmChainX</span>
                    </div>

                    <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
                        <a href="#home" className="nav-link">Home</a>
                        <a href="#features" className="nav-link">Features</a>
                        <a href="#testimonials" className="nav-link">Reviews</a>
                        <a href="#contact" className="nav-link">Contact</a>
                        <button className="btn btn-primary nav-cta" onClick={handleGetStarted}>
                            Get Started
                        </button>
                    </div>

                    <button
                        className="nav-toggle"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section id="home" className="hero-section" data-animate>
                <div className="hero-container">
                    <div className="hero-content">
                        <div className="hero-badge">
                            <Shield size={16} />
                            <span>Trusted by 10,000+ Farmers</span>
                        </div>

                        <h1 className="hero-title">
                            Transparent Agriculture
                            <span className="gradient-text"> From Farm to Fork</span>
                        </h1>

                        <p className="hero-description">
                            Connect your entire supply chain with blockchain-powered traceability.
                            Build trust, ensure quality, and get better prices for your crops with
                            complete transparency from seed to shelf.
                        </p>

                        <div className="hero-actions">
                            <button className="btn btn-primary btn-large" onClick={handleGetStarted}>
                                <Leaf size={20} />
                                Start Growing Smart
                                <ArrowRight size={20} />
                            </button>

                            <button className="btn btn-outline btn-large">
                                <Play size={20} />
                                Watch Demo
                            </button>
                        </div>

                        <div className="hero-stats">
                            {stats.map((stat, index) => (
                                <div key={index} className="stat-item">
                                    <span className="stat-number">{stat.number}</span>
                                    <span className="stat-label">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

            

                           

                           
                        
                    
                </div>
            </section>

            {/* Features Section - White Background */}
            <section id="features" className="features-section white-section" data-animate>
                <div className="container">
                    <div className="section-header">
                        <h2>Why Choose FarmChainX?</h2>
                        <p>Comprehensive solution for modern agricultural supply chain management</p>
                    </div>

                    <div className="features-grid">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div
                                    key={index}
                                    className={`feature-card ${isVisible.features ? 'animate-in' : ''}`}
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className="feature-icon">
                                        <Icon size={24} />
                                    </div>
                                    <h3>{feature.title}</h3>
                                    <p>{feature.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* How It Works Section - Light Gray Background */}
            <section className="how-it-works-section gray-section" data-animate>
                <div className="container">
                    <div className="section-header">
                        <h2>How FarmChainX Works</h2>
                        <p>Simple steps to transform your agricultural business</p>
                    </div>

                    <div className="steps-timeline">
                        <div className="step-item">
                            <div className="step-number">01</div>
                            <div className="step-content">
                                <h3>Register Your Farm</h3>
                                <p>Create your account and add your farm details, crops, and certifications to get started.</p>
                            </div>
                        </div>

                        <div className="step-item">
                            <div className="step-number">02</div>
                            <div className="step-content">
                                <h3>Track Your Crops</h3>
                                <p>Log farming activities, harvest data, and quality metrics throughout the growing cycle.</p>
                            </div>
                        </div>

                        <div className="step-item">
                            <div className="step-number">03</div>
                            <div className="step-content">
                                <h3>Generate QR Codes</h3>
                                <p>Create unique QR codes for each batch that contain the complete supply chain journey.</p>
                            </div>
                        </div>

                        <div className="step-item">
                            <div className="step-number">04</div>
                            <div className="step-content">
                                <h3>Build Consumer Trust</h3>
                                <p>Consumers scan QR codes to see transparency, building trust and commanding premium prices.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section - White Background */}
            <section id="testimonials" className="testimonials-section white-section" data-animate>
                <div className="container">
                    <div className="section-header">
                        <h2>Trusted by Agricultural Leaders</h2>
                        <p>See what our community is saying about FarmChainX</p>
                    </div>

                    <div className="testimonials-grid">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="testimonial-card">
                                <div className="testimonial-rating">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} size={16} className="star filled" />
                                    ))}
                                </div>

                                <p className="testimonial-comment">"{testimonial.comment}"</p>

                                <div className="testimonial-author">
                                    <div className="author-avatar"></div>
                                    <div>
                                        <h4>{testimonial.name}</h4>
                                        <span>{testimonial.role}</span>
                                        <div className="author-location">
                                            <MapPin size={12} />
                                            {testimonial.location}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section - Light Gray Background */}
            <section className="faq-section gray-section" data-animate>
                <div className="container">
                    <div className="section-header">
                        <h2>Frequently Asked Questions</h2>
                        <p>Everything you need to know about FarmChainX</p>
                    </div>

                    <div className="faq-accordion">
                        {accordionData.map((item, index) => (
                            <div key={index} className="accordion-item">
                                <button
                                    className="accordion-trigger"
                                    onClick={() => setActiveAccordion(activeAccordion === index ? null : index)}
                                >
                                    <span>{item.question}</span>
                                    <ChevronDown
                                        size={20}
                                        className={`accordion-icon ${activeAccordion === index ? 'active' : ''}`}
                                    />
                                </button>

                                <div className={`accordion-content ${activeAccordion === index ? 'active' : ''}`}>
                                    <p>{item.answer}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section" data-animate>
                <div className="container">
                    <div className="cta-content">
                        <h2>Ready to Transform Your Agricultural Business?</h2>
                        <p>Join thousands of farmers who are already building trust and increasing profits with complete supply chain transparency.</p>

                        <div className="cta-actions">
                            <button className="btn btn-primary btn-large" onClick={handleGetStarted}>
                                Get Started Free
                                <ArrowRight size={20} />
                            </button>
                            <span className="cta-note">
                                <Check size={16} />
                                No credit card required • 14-day free trial
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer id="contact" className="footer">
                <div className="container">
                    <div className="footer-content">
                        <div className="footer-section">
                            <div className="footer-brand">
                                <Leaf className="brand-icon" />
                                <span className="brand-text">FarmChainX</span>
                            </div>
                            <p>Transforming agriculture with transparent supply chain solutions. Building trust from farm to fork.</p>

                            <div className="contact-info">
                                <div className="contact-item">
                                    <Phone size={16} />
                                    <span>+91 98765 43210</span>
                                </div>
                                <div className="contact-item">
                                    <Mail size={16} />
                                    <span>hello@farmchainx.com</span>
                                </div>
                                <div className="contact-item">
                                    <MapPin size={16} />
                                    <span>Mumbai, Maharashtra, India</span>
                                </div>
                            </div>
                        </div>

                        <div className="footer-section">
                            <h4>Product</h4>
                            <ul>
                                <li><a href="#features">Features</a></li>
                                <li><a href="#testimonials">Reviews</a></li>
                                <li><a href="#">API Documentation</a></li>
                                <li><a href="#">Mobile App</a></li>
                            </ul>
                        </div>

                        <div className="footer-section">
                            <h4>Company</h4>
                            <ul>
                                <li><a href="#">About Us</a></li>
                                <li><a href="#">Careers</a></li>
                                <li><a href="#">Blog</a></li>
                                <li><a href="#">Press Kit</a></li>
                            </ul>
                        </div>

                        <div className="footer-section">
                            <h4>Support</h4>
                            <ul>
                                <li><a href="#">Help Center</a></li>
                                <li><a href="#">Community</a></li>
                                <li><a href="#">Privacy Policy</a></li>
                                <li><a href="#">Terms of Service</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="footer-bottom">
                        <p>&copy; 2025 FarmChainX. All rights reserved.</p>
                        <div className="social-links">
                            <a href="#" aria-label="Twitter">🐦</a>
                            <a href="#" aria-label="LinkedIn">💼</a>
                            <a href="#" aria-label="Facebook">📘</a>
                            <a href="#" aria-label="Instagram">📷</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
