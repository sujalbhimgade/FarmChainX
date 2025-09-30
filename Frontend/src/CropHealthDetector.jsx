import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
    Camera,
    Upload,
    X,
    CheckCircle,
    AlertTriangle,
    Scan,
    RotateCcw,
    Leaf,
    TrendingUp,
    AlertCircle,
    Zap,
    Video,
    Square,
    Clock,
    Star,
    Package,
    Calendar,
    Thermometer
} from 'lucide-react';
import './CropHealthDetector.css';

const CropHealthDetector = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [stream, setStream] = useState(null);

    const fileInputRef = useRef(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const API_URL = 'http://localhost:5000';

    const handleFileSelect = useCallback((file) => {
        if (file && file.type.startsWith('image/')) {
            setSelectedImage(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            setResults(null);
            setError(null);

            if (isCameraActive) {
                stopCamera();
            }
        } else {
            setError('Please select a valid image file (JPG, PNG, WEBP)');
        }
    }, [isCameraActive]);

    const startCamera = async () => {
        try {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }

            const constraints = {
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: { ideal: 'environment' }
                },
                audio: false
            };

            const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);

            setStream(mediaStream);
            setIsCameraActive(true);
            setSelectedImage(null);
            setPreviewUrl(null);
            setResults(null);
            setError(null);

            setTimeout(() => {
                if (videoRef.current && mediaStream) {
                    videoRef.current.srcObject = mediaStream;

                    videoRef.current.onloadedmetadata = () => {
                        videoRef.current.play().catch(err => {
                            console.error('Video playback error:', err);
                            setError('Failed to start video playback');
                        });
                    };
                }
            }, 100);

        } catch (err) {
            console.error('Camera access error:', err);
            let errorMessage = 'Unable to access camera. ';

            if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                errorMessage += 'Please allow camera permissions in your browser settings.';
            } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
                errorMessage += 'No camera device found on this system.';
            } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
                errorMessage += 'Camera is already in use by another application.';
            } else {
                errorMessage += 'Please check your camera and try again.';
            }

            setError(errorMessage);
            setIsCameraActive(false);
            setStream(null);
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => {
                track.stop();
            });
            setStream(null);
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        setIsCameraActive(false);
    };

    const capturePhoto = () => {
        if (!videoRef.current || !canvasRef.current || !stream) {
            setError('Camera not ready. Please try again.');
            return;
        }

        try {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            if (video.readyState !== video.HAVE_ENOUGH_DATA) {
                setError('Video not ready. Please wait a moment and try again.');
                return;
            }

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            if (canvas.width === 0 || canvas.height === 0) {
                setError('Invalid video dimensions. Please restart camera.');
                return;
            }

            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            canvas.toBlob((blob) => {
                if (blob) {
                    const timestamp = new Date().getTime();
                    const file = new File([blob], `camera-capture-${timestamp}.jpg`, {
                        type: 'image/jpeg',
                        lastModified: timestamp
                    });

                    console.log('Photo captured:', file.size, 'bytes');
                    handleFileSelect(file);
                    stopCamera();
                } else {
                    setError('Failed to capture photo. Please try again.');
                }
            }, 'image/jpeg', 0.92);

        } catch (err) {
            console.error('Capture error:', err);
            setError('Failed to capture photo. Please try again.');
        }
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileSelect(files[0]);
        }
    };

    const handleFileInputChange = (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            handleFileSelect(files[0]);
        }
    };

    const analyzeImage = async () => {
        if (!selectedImage) return;

        setIsAnalyzing(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('image', selectedImage);

            console.log('Sending image for analysis:', selectedImage.name, selectedImage.size);

            const response = await fetch(`${API_URL}/api/ai/ripeness`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Analysis failed (${response.status}): ${errorText}`);
            }

            const data = await response.json();
            console.log('Analysis results:', data);

            // Transform backend response to expected format
            const transformedData = {
                predictions: data.raw?.predictions || [],
                summary: data.summary,
                model_id: data.model_id
            };

            setResults(transformedData);

        } catch (err) {
            console.error('Analysis error:', err);
            setError(err.message || 'Failed to analyze image. Please check your connection and try again.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const resetAnalysis = () => {
        setSelectedImage(null);
        setPreviewUrl(null);
        setResults(null);
        setError(null);
        if (isCameraActive) {
            stopCamera();
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Agriculturally accurate data based on ripeness and confidence
    const getDetailedAnalysis = () => {
        if (!results || !results.predictions || results.predictions.length === 0) {
            return null;
        }

        const predictions = results.predictions;
        const highestConfidence = Math.max(...predictions.map(p => p.confidence));
        const bestPrediction = predictions.find(p => p.confidence === highestConfidence);
        const confidence = Math.round(highestConfidence * 100);

        if (!bestPrediction) return null;

        const className = bestPrediction.class.toLowerCase();
        let status, qualityGrade, harvestWindow, shelfLife, storageTemp, storageHumidity, marketReady;

        // Determine ripeness status
        if (className.includes('ripe') && !className.includes('unripe') && !className.includes('overripe')) {
            status = 'ripe';
        } else if (className.includes('unripe') || className.includes('green') || className.includes('immature')) {
            status = 'unripe';
        } else if (className.includes('overripe') || className.includes('rotten') || className.includes('spoiled')) {
            status = 'overripe';
        } else {
            status = 'unknown';
        }

        // Quality grade based on confidence
        if (confidence >= 90) qualityGrade = 'A+';
        else if (confidence >= 80) qualityGrade = 'A';
        else if (confidence >= 70) qualityGrade = 'B+';
        else if (confidence >= 60) qualityGrade = 'B';
        else qualityGrade = 'C';

        // Harvest timing, storage, and market readiness
        if (status === 'ripe') {
            if (confidence >= 85) {
                harvestWindow = '24-48 hours';
                shelfLife = '5-7 days';
                marketReady = true;
            } else if (confidence >= 70) {
                harvestWindow = '48-72 hours';
                shelfLife = '4-6 days';
                marketReady = true;
            } else {
                harvestWindow = '2-4 days';
                shelfLife = '3-5 days';
                marketReady = true;
            }
            storageTemp = '10-15°C';
            storageHumidity = '85-90%';

        } else if (status === 'unripe') {
            if (confidence >= 80) {
                harvestWindow = '5-7 days';
                shelfLife = 'Monitor daily';
                marketReady = false;
            } else {
                harvestWindow = '7-10 days';
                shelfLife = 'Check in 3 days';
                marketReady = false;
            }
            storageTemp = '12-18°C';
            storageHumidity = '80-85%';

        } else if (status === 'overripe') {
            harvestWindow = 'Immediate';
            shelfLife = '12-24 hours';
            marketReady = false;
            storageTemp = '8-12°C';
            storageHumidity = '85-90%';

        } else {
            harvestWindow = 'Unable to determine';
            shelfLife = 'N/A';
            marketReady = false;
            storageTemp = '10-15°C';
            storageHumidity = '85-90%';
        }

        return {
            status,
            confidence,
            qualityGrade,
            harvestWindow,
            shelfLife,
            storageTemp,
            storageHumidity,
            marketReady,
            detectedClass: bestPrediction.class,
            totalDetections: predictions.length
        };
    };

    const analysis = getDetailedAnalysis();

    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [stream, previewUrl]);

    return (
        <div className="crop-health-detector">
            {/* Header */}
            <div className="detector-header">
                <div className="header-left">
                    <div className="header-icon">
                        <Zap size={20} />
                    </div>
                    <div>
                        <h3>AI Crop Health Analysis</h3>
                        <p>Upload or capture crop images for instant ripeness detection</p>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="detector-grid">
                {/* Upload/Camera Section */}
                <div className="upload-section">
                    {!isCameraActive ? (
                        <div
                            className={`upload-zone ${isDragOver ? 'drag-over' : ''} ${selectedImage ? 'has-image' : ''}`}
                            onDragEnter={handleDragEnter}
                            onDragLeave={handleDragLeave}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            onClick={() => !selectedImage && fileInputRef.current?.click()}
                        >
                            {!selectedImage ? (
                                <div className="upload-content">
                                    <Camera size={32} />
                                    <h4>Upload or Capture Image</h4>
                                    <p>Drop image here, click to browse, or use camera</p>
                                    <span className="file-types">JPG, PNG, WEBP</span>
                                </div>
                            ) : (
                                <div className="image-preview">
                                    <img src={previewUrl} alt="Selected crop" />
                                    <button className="remove-btn" onClick={(e) => {
                                        e.stopPropagation();
                                        resetAnalysis();
                                    }}>
                                        <X size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="camera-container">
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="camera-video"
                            />
                            <div className="camera-overlay">
                                <div className="camera-frame">
                                    <div className="corner top-left"></div>
                                    <div className="corner top-right"></div>
                                    <div className="corner bottom-left"></div>
                                    <div className="corner bottom-right"></div>
                                </div>
                                <div className="camera-controls">
                                    <button
                                        className="capture-btn"
                                        onClick={capturePhoto}
                                        disabled={!stream}
                                    >
                                        <Camera size={24} />
                                    </button>
                                    <button className="stop-camera-btn" onClick={stopCamera}>
                                        <Square size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileInputChange}
                        style={{ display: 'none' }}
                    />

                    <canvas ref={canvasRef} style={{ display: 'none' }} />

                    {!isCameraActive && (
                        <div className="input-options">
                            <button className="option-btn" onClick={() => fileInputRef.current?.click()}>
                                <Upload size={16} />
                                Upload Image
                            </button>
                            <button className="option-btn camera-btn" onClick={startCamera}>
                                <Video size={16} />
                                Use Camera
                            </button>
                        </div>
                    )}

                    {selectedImage && !isCameraActive && (
                        <div className="action-buttons">
                            <button
                                className="btn-primary"
                                onClick={analyzeImage}
                                disabled={isAnalyzing}
                            >
                                {isAnalyzing ? (
                                    <>
                                        <div className="spinner"></div>
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        <Scan size={16} />
                                        Analyze Crop
                                    </>
                                )}
                            </button>
                            <button className="btn-secondary" onClick={resetAnalysis}>
                                <RotateCcw size={16} />
                                Reset
                            </button>
                        </div>
                    )}
                </div>

                {/* Results Section */}
                <div className="results-section">
                    {error && (
                        <div className="error-card">
                            <AlertTriangle size={16} />
                            <span>{error}</span>
                        </div>
                    )}

                    {analysis ? (
                        <div className="results-content">
                            {/* Primary Status Card */}
                            <div className={`primary-status-card ${analysis.status}`}>
                                <div className="status-header">
                                    <div className="status-icon">
                                        {analysis.status === 'ripe' && <CheckCircle size={24} />}
                                        {analysis.status === 'unripe' && <TrendingUp size={24} />}
                                        {analysis.status === 'overripe' && <AlertTriangle size={24} />}
                                        {analysis.status === 'unknown' && <AlertCircle size={24} />}
                                    </div>
                                    <div className="status-info">
                                        <h4>{analysis.detectedClass}</h4>
                                        <div className="status-badges">
                                            <span className="grade-badge">Grade {analysis.qualityGrade}</span>
                                            <span className={`market-badge ${analysis.marketReady ? 'ready' : 'not-ready'}`}>
                                                {analysis.marketReady ? '✓ Market Ready' : '⚠ Not Ready'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="confidence-bar">
                                    <div className="confidence-header">
                                        <span>AI Confidence</span>
                                        <span className="confidence-value">{analysis.confidence}%</span>
                                    </div>
                                    <div className="progress-bar">
                                        <div
                                            className={`progress-fill ${analysis.confidence >= 80 ? 'high' : analysis.confidence >= 60 ? 'medium' : 'low'}`}
                                            style={{ width: `${analysis.confidence}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            {/* Key Metrics Grid */}
                            <div className="metrics-grid">
                                <div className="metric-card">
                                    <div className="metric-icon timing">
                                        <Clock size={18} />
                                    </div>
                                    <div className="metric-content">
                                        <span className="metric-label">Harvest Window</span>
                                        <span className="metric-value">{analysis.harvestWindow}</span>
                                    </div>
                                </div>

                                <div className="metric-card">
                                    <div className="metric-icon quality">
                                        <Star size={18} />
                                    </div>
                                    <div className="metric-content">
                                        <span className="metric-label">Quality Grade</span>
                                        <span className="metric-value">{analysis.qualityGrade}</span>
                                    </div>
                                </div>

                                <div className="metric-card">
                                    <div className="metric-icon shelf">
                                        <Calendar size={18} />
                                    </div>
                                    <div className="metric-content">
                                        <span className="metric-label">Expected Shelf Life</span>
                                        <span className="metric-value">{analysis.shelfLife}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Storage Recommendations */}
                            <div className="storage-recommendations">
                                <h5><Package size={16} /> Storage Guidelines</h5>
                                <div className="storage-grid">
                                    <div className="storage-item">
                                        <Thermometer size={16} />
                                        <div>
                                            <span className="storage-label">Temperature</span>
                                            <span className="storage-value">{analysis.storageTemp}</span>
                                        </div>
                                    </div>
                                    <div className="storage-item">
                                        <Leaf size={16} />
                                        <div>
                                            <span className="storage-label">Humidity</span>
                                            <span className="storage-value">{analysis.storageHumidity}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Recommendations */}
                            <div className="action-recommendations">
                                <h5>Recommended Actions</h5>
                                <div className={`action-card ${analysis.status}`}>
                                    <div className="action-icon">
                                        <Leaf size={18} />
                                    </div>
                                    <div className="action-text">
                                        {analysis.status === 'ripe' && analysis.confidence >= 85 && (
                                            <p><strong>Peak Ripeness Detected:</strong> Ideal time for harvest to ensure maximum quality and market value. Store immediately at recommended temperature after harvest.</p>
                                        )}
                                        {analysis.status === 'ripe' && analysis.confidence < 85 && (
                                            <p><strong>Approaching Peak:</strong> Crop is ripe but monitor closely. Harvest within the recommended window for optimal quality.</p>
                                        )}
                                        {analysis.status === 'unripe' && (
                                            <p><strong>Still Developing:</strong> Crop needs more time to reach optimal ripeness. Continue monitoring and re-scan in {analysis.confidence >= 80 ? '3-4 days' : '5-7 days'}. Maintain proper field conditions.</p>
                                        )}
                                        {analysis.status === 'overripe' && (
                                            <p><strong>Past Prime:</strong> Quality is declining. Harvest immediately if not already done. Best suited for processing or immediate local sale. Avoid long-distance transport.</p>
                                        )}
                                        {analysis.status === 'unknown' && (
                                            <p><strong>Analysis Uncertain:</strong> Unable to determine ripeness accurately. Try retaking the image with better lighting, clearer focus, and closer view of the crop.</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Additional Detections */}
                            {analysis.totalDetections > 1 && results.predictions && (
                                <div className="additional-detections">
                                    <h5>All Detections ({analysis.totalDetections} items)</h5>
                                    <div className="detections-list">
                                        {results.predictions.map((pred, index) => (
                                            <div key={index} className="detection-item">
                                                <span className="detection-name">{pred.class}</span>
                                                <span className="detection-confidence">{Math.round(pred.confidence * 100)}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : !selectedImage && !isCameraActive && (
                        <div className="empty-state">
                            <Zap size={32} />
                            <h4>AI-Powered Crop Analysis</h4>
                            <p>Upload an image or use your camera to get instant, accurate ripeness detection powered by advanced AI technology.</p>
                            <div className="empty-state-features">
                                <div className="feature-item">
                                    <CheckCircle size={16} />
                                    <span>Accurate ripeness detection</span>
                                </div>
                                <div className="feature-item">
                                    <CheckCircle size={16} />
                                    <span>Harvest timing guidance</span>
                                </div>
                                <div className="feature-item">
                                    <CheckCircle size={16} />
                                    <span>Storage recommendations</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CropHealthDetector;
