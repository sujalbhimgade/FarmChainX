import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Camera, Bot, User, ChevronDown, Sparkles, Leaf, Cloud, Brain, BarChart3, Image as ImageIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown'; // Add this import
import logo from './assets/farmchainxLogo.png';
import './AIChatbot.css';

const AIChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputMessage, setInputMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    const AI_BACKEND_URL = 'http://localhost:5000';

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleImageSelect = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setSelectedImage(file);
        }
    };

    const handleSendMessage = async () => {
        if (!inputMessage.trim() && !selectedImage) return;

        const newMessage = {
            text: inputMessage,
            sender: 'user',
            timestamp: new Date().toLocaleTimeString(),
            image: selectedImage
        };

        setMessages(prev => [...prev, newMessage]);
        setInputMessage('');
        setSelectedImage(null);
        setIsLoading(true);

        try {
            let response;
            if (selectedImage) {
                const formData = new FormData();
                formData.append('image', selectedImage);
                response = await fetch(`${AI_BACKEND_URL}/crop-health`, {
                    method: 'POST',
                    body: formData
                });
            } else {
                const res = await fetch(`${AI_BACKEND_URL}/chat`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: inputMessage })
                });
                const data = await res.json();
                if (!res.ok) {
                    const errText = data?.error?.message || data?.message || `HTTP ${res.status}`;
                    throw new Error(errText);
                }
                const botMessage = {
                    text: data.reply || 'Response received',
                    sender: 'bot',
                    timestamp: new Date().toLocaleTimeString()
                };
                setMessages(prev => [...prev, botMessage]);
                setIsLoading(false);
                return;
            }

        } catch (error) {
            console.error('Chat error:', error);
            const errorMessage = {
                text: `Sorry, I couldn't process your request. Please check if the AI backend is running on ${AI_BACKEND_URL}`,
                sender: 'bot',
                timestamp: new Date().toLocaleTimeString()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const onKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    if (!isOpen) {
        return (
            <div className="ai-chatbot-launcher" onClick={() => setIsOpen(true)}>
                <div className="launcher-pulse"></div>
                <div className="launcher-content">
                    <div className="launcher-icon">
                        <MessageCircle size={20} />
                    </div>
                    <span className="launcher-text">FarmchainX AI</span>
                </div>
            </div>
        );
    }

    return (
        <div className="chatbot-container">
            <div className="chatbot-header">
                <div className="header-left">
                    <div className="bot-avatar">
                        <img src={logo} alt="FarmchainX AI" className="avatar-logo" />
                    </div>
                    <div className="header-info">
                        <h3>FarmchainX AI Assistant</h3>
                        <div className="status-indicator">
                            <div className="status-dot"></div>
                            <span>Online</span>
                        </div>
                    </div>
                </div>
                <div className="header-actions">
                    <button className="header-btn" onClick={() => setIsOpen(false)}>
                        <ChevronDown size={18} />
                    </button>
                </div>
            </div>

            <div className="chat-messages">
                {messages.length === 0 ? (
                    <div className="welcome-screen">
                        <div className="welcome-header">
                            <div className="welcome-avatar">
                                <img src={logo} alt="FarmchainX AI" className="welcome-logo" />
                            </div>
                            <div className="welcome-content">
                                <h2 className="welcome-title">Welcome to FarmchainX AI!</h2>
                                <p className="welcome-subtitle">I'm here to help with your agricultural needs. Ask me about:</p>
                            </div>
                        </div>
                        <div className="quick-actions">
                            <div className="quick-action-item">
                                <Leaf className="quick-action-icon" size={20} />
                                <span>Crop management & farming tips</span>
                            </div>
                            <div className="quick-action-item">
                                <BarChart3 className="quick-action-icon" size={20} />
                                <span>Market analysis & pricing</span>
                            </div>
                            <div className="quick-action-item">
                                <Camera className="quick-action-icon" size={20} />
                                <span>Crop health analysis from images</span>
                            </div>
                            <div className="quick-action-item">
                                <Cloud className="quick-action-icon" size={20} />
                                <span>Weather & seasonal advice</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    messages.map((message, index) => (
                        <div key={index} className={`message ${message.sender}`}>
                            <div className="message-avatar">
                                {message.sender === 'bot' ? (
                                    <img src={logo} alt="Bot" className="avatar-logo" />
                                ) : (
                                    <div className="user-avatar">
                                        <User size={18} />
                                    </div>
                                )}
                            </div>
                            <div className="message-content">
                                <div className="message-bubble">
                                    {message.image && (
                                        <div className="message-image">
                                            <img src={URL.createObjectURL(message.image)} alt="Uploaded" />
                                        </div>
                                    )}
                                    {/* UPDATED: Use ReactMarkdown for bot messages */}
                                    <div className="message-text">
                                        {message.sender === 'bot' ? (
                                            <ReactMarkdown
                                                components={{
                                                    // Custom components for better styling
                                                    p: ({ children }) => <p style={{ margin: '0 0 8px 0', lineHeight: '1.5' }}>{children}</p>,
                                                    strong: ({ children }) => <strong style={{ fontWeight: '600', color: 'inherit' }}>{children}</strong>,
                                                    ul: ({ children }) => <ul style={{ margin: '8px 0', paddingLeft: '18px' }}>{children}</ul>,
                                                    ol: ({ children }) => <ol style={{ margin: '8px 0', paddingLeft: '18px' }}>{children}</ol>,
                                                    li: ({ children }) => <li style={{ margin: '4px 0' }}>{children}</li>,
                                                }}
                                            >
                                                {message.text}
                                            </ReactMarkdown>
                                        ) : (
                                            message.text
                                        )}
                                    </div>
                                    <div className="message-time">{message.timestamp}</div>
                                </div>
                            </div>
                        </div>
                    ))
                )}

                {isLoading && (
                    <div className="message bot">
                        <div className="message-avatar">
                            <img src={logo} alt="Bot" className="avatar-logo" />
                        </div>
                        <div className="message-content">
                            <div className="message-bubble loading">
                                <div className="typing-indicator">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                                <div className="loading-text">Thinking...</div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="chat-input">
                {selectedImage && (
                    <div className="image-preview">
                        <div className="preview-content">
                            <img src={URL.createObjectURL(selectedImage)} alt="Preview" />
                            <div className="preview-info">
                                <div className="preview-name">{selectedImage.name}</div>
                                <div className="preview-size">{(selectedImage.size / 1024).toFixed(1)} KB</div>
                            </div>
                        </div>
                        <button className="remove-image" onClick={() => setSelectedImage(null)}>
                            <X size={16} />
                        </button>
                    </div>
                )}

                <div className="input-container">
                    <button className="input-action-btn" onClick={() => fileInputRef.current?.click()}>
                        <Camera size={18} />
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        style={{ display: 'none' }}
                    />
                    <div className="message-input-wrapper">
                        <textarea
                            className="message-input"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={onKeyPress}
                            placeholder="Ask me anything about farming..."
                            rows="1"
                        />
                    </div>
                    <button
                        className="send-btn"
                        onClick={handleSendMessage}
                        disabled={isLoading || (!inputMessage.trim() && !selectedImage)}
                    >
                        {isLoading ? (
                            <div className="sending-spinner">⏳</div>
                        ) : (
                            <Send size={18} />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AIChatbot;
