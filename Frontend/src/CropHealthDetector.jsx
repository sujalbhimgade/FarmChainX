import React, { useState, useRef, useCallback } from 'react';
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
    Square
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
            setPreviewUrl(URL.createObjectURL(file));
            setResults(null);
            setError(null);
            // Stop camera if active
            if (isCameraActive) {
                stopCamera();
            }
        }
    }, [isCameraActive]);

    // Update the startCamera function
    const startCamera = async () => {
        try {
            // Stop any existing stream first
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }

            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: { ideal: 'environment' } // Use back camera on mobile
                },
                audio: false // Explicitly disable audio
            });

            setStream(mediaStream);
            setIsCameraActive(true);
            setSelectedImage(null);
            setPreviewUrl(null);
            setResults(null);
            setError(null);

            // Wait for video element to be ready
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;

                // Add event listener to ensure video starts playing
                videoRef.current.onloadedmetadata = () => {
                    videoRef.current.play().catch(err => {
                        console.error('Error playing video:', err);
                        setError('Failed to start camera playback');
                    });
                };
            }
        } catch (err) {
            console.error('Error accessing camera:', err);
            let errorMessage = 'Unable to access camera. ';

            if (err.name === 'NotAllowedError') {
                errorMessage += 'Please allow camera access and try again.';
            } else if (err.name === 'NotFoundError') {
                errorMessage += 'No camera found on this device.';
            } else if (err.name === 'NotReadableError') {
                errorMessage += 'Camera is being used by another application.';
            } else {
                errorMessage += 'Please check permissions and try again.';
            }

            setError(errorMessage);
            setIsCameraActive(false);
        }
    };


    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        setIsCameraActive(false);
    };

    const capturePhoto = () => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw the video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert canvas to blob
        canvas.toBlob((blob) => {
            if (blob) {
                const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
                handleFileSelect(file);
                stopCamera();
            }
        }, 'image/jpeg', 0.8);
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
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

            const response = await fetch(`${API_URL}/api/ai/ripeness`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Analysis failed: ${response.statusText}`);
            }

            const data = await response.json();
            setResults(data);
        } catch (err) {
            console.error('Analysis error:', err);
            setError(err.message || 'Failed to analyze image. Please try again.');
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

    const getRipenessAnalysis = () => {
        if (!results || !results.predictions || results.predictions.length === 0) {
            return { status: 'unknown', confidence: 0, message: 'No fruits detected' };
        }

        const predictions = results.predictions;
        const highestConfidence = Math.max(...predictions.map(p => p.confidence));
        const bestPrediction = predictions.find(p => p.confidence === highestConfidence);

        if (bestPrediction) {
            const className = bestPrediction.class.toLowerCase();
            let status = 'unknown';
            let message = '';

            if (className.includes('ripe') || className.includes('mature')) {
                status = 'ripe';
                message = 'Ready for harvest';
            } else if (className.includes('unripe') || className.includes('green')) {
                status = 'unripe';
                message = 'Needs more time';
            } else if (className.includes('overripe') || className.includes('rotten')) {
                status = 'overripe';
                message = 'Past optimal time';
            }

            return {
                status,
                confidence: Math.round(highestConfidence * 100),
                message,
                detectedClass: bestPrediction.class
            };
        }

        return { status: 'unknown', confidence: 0, message: 'Unable to determine' };
    };

    const analysis = results ? getRipenessAnalysis() : null;

    // Cleanup on unmount
    React.useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [stream]);

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
                {/* Upload Section */}
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
                                    <button className="remove-btn" onClick={resetAnalysis}>
                                        <X size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        // Camera View
                        <div className="camera-container">
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="camera-video"
                            />
                            <div className="camera-overlay">
                                <div className="camera-frame"></div>
                                <div className="camera-controls">
                                    <button className="capture-btn" onClick={capturePhoto}>
                                        <Camera size={24} />
                                    </button>
                                    <button className="stop-camera-btn" onClick={stopCamera}>
                                        <Square size={20} />
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

                    {/* Hidden canvas for photo capture */}
                    <canvas ref={canvasRef} style={{ display: 'none' }} />

                    {/* Action Buttons */}
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
                                        Analyze
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

                    {results && analysis ? (
                        <div className="results-content">
                            {/* Main Result */}
                            <div className={`result-card ${analysis.status}`}>
                                <div className="result-icon">
                                    {analysis.status === 'ripe' && <CheckCircle size={20} />}
                                    {analysis.status === 'unripe' && <TrendingUp size={20} />}
                                    {analysis.status === 'overripe' && <AlertTriangle size={20} />}
                                    {analysis.status === 'unknown' && <AlertCircle size={20} />}
                                </div>
                                <div className="result-info">
                                    <h4>{analysis.message}</h4>
                                    <p>{analysis.detectedClass}</p>
                                    <div className="confidence">
                                        <span>Confidence: {analysis.confidence}%</span>
                                        <div className="progress-bar">
                                            <div
                                                className="progress-fill"
                                                style={{ width: `${analysis.confidence}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Predictions */}
                            {results.predictions && results.predictions.length > 1 && (
                                <div className="additional-results">
                                    <h5>All Detections ({results.predictions.length})</h5>
                                    <div className="predictions-grid">
                                        {results.predictions.map((prediction, index) => (
                                            <div key={index} className="prediction-item">
                                                <span className="prediction-class">{prediction.class}</span>
                                                <span className="prediction-confidence">
                                                    {Math.round(prediction.confidence * 100)}%
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Quick Recommendations */}
                            <div className="recommendations">
                                <h5>Recommendation</h5>
                                <div className={`recommendation-card ${analysis.status}`}>
                                    <Leaf size={16} />
                                    <span>
                                        {analysis.status === 'ripe' && 'Harvest immediately for best quality'}
                                        {analysis.status === 'unripe' && 'Monitor and wait 3-7 days before harvesting'}
                                        {analysis.status === 'overripe' && 'Use for processing or check other fruits'}
                                        {analysis.status === 'unknown' && 'Consider retaking image with better lighting'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : !selectedImage && !isCameraActive && (
                        <div className="empty-state">
                            <Zap size={32} />
                            <h4>AI Analysis Ready</h4>
                            <p>Upload an image or use camera to get instant crop health insights powered by advanced AI.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CropHealthDetector;
