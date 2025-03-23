import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [resultHistory, setResultHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [username, setUsername] = useState('');
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    // Enhanced controller animation configuration
    const controllerAnimation = {
        animate: {
            rotate: [0, -4, 2, -2, 4, 0],
            y: [0, -5, 2, -3, 1, 0],
            scale: [1, 1.05, 1.02, 1.07, 1.03, 1],
            transition: {
                duration: 3.5,
                repeat: Infinity,
                repeatType: "loop",
                ease: [0.45, 0.05, 0.55, 0.95], // Custom easing for more natural movement
                times: [0, 0.2, 0.4, 0.6, 0.8, 1] // Control timing of keyframes
            }
        }
    };

    useEffect(() => {
        // Get username from localStorage
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        } else {
            // Redirect to login if no username is found
            navigate('/login');
            return;
        }

        // Simulate loading data from local storage or a database
        const timer = setTimeout(() => {
            // Try to get previous results from localStorage
            const storedResults = localStorage.getItem('assessmentResults');
            let parsedResults = storedResults ? JSON.parse(storedResults) : [];
            
            // Get the most recent result if available (from Result.js)
            const lastResult = localStorage.getItem('lastAssessmentResult');
            if (lastResult) {
                const parsedLastResult = JSON.parse(lastResult);
                
                // Add timestamp if not present
                if (!parsedLastResult.timestamp) {
                    parsedLastResult.timestamp = new Date().toISOString();
                }
                
                // Add a unique ID if not present
                if (!parsedLastResult.id) {
                    parsedLastResult.id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
                }
                
                // Check if this result is already in history using the ID or a combination of timestamp and percentage
                const resultExists = parsedResults.some(result => 
                    (result.id && result.id === parsedLastResult.id) || 
                    (result.timestamp === parsedLastResult.timestamp && 
                     result.percentage === parsedLastResult.percentage)
                );
                
                if (!resultExists) {
                    parsedResults = [...parsedResults, parsedLastResult];
                    // Save updated history back to localStorage
                    localStorage.setItem('assessmentResults', JSON.stringify(parsedResults));
                    
                    // Save to user-specific storage as well
                    saveUserData(storedUsername, parsedResults, parsedLastResult);
                }
                
                // Clear the lastAssessmentResult after adding it to history
                localStorage.removeItem('lastAssessmentResult');
            }
            
            // Sort by date if there are results
            if (parsedResults.length > 0) {
                parsedResults.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
            }
            
            setResultHistory(parsedResults);
            setLoading(false);
        }, 800);
        
        return () => clearTimeout(timer);
    }, [navigate]);
    
    // Save user-specific data
    const saveUserData = (username, assessmentResults, lastAssessmentResult = null) => {
        const allUserData = JSON.parse(localStorage.getItem('allUsersData') || '{}');
        
        allUserData[username] = {
            assessmentResults: assessmentResults,
            lastAssessmentResult: lastAssessmentResult
        };
        
        localStorage.setItem('allUsersData', JSON.stringify(allUserData));
    };

    // Function to clear all assessment data
    const clearAllData = () => {
        // Remove data from localStorage
        localStorage.removeItem('assessmentResults');
        localStorage.removeItem('lastAssessmentResult');
        
        // Update user's data in allUsersData
        const allUserData = JSON.parse(localStorage.getItem('allUsersData') || '{}');
        if (allUserData[username]) {
            allUserData[username] = {
                assessmentResults: [],
                lastAssessmentResult: null
            };
            localStorage.setItem('allUsersData', JSON.stringify(allUserData));
        }
        
        // Update state to reflect cleared data
        setResultHistory([]);
        setShowConfirmModal(false);
    };

    // Function to handle logout
    const handleLogout = () => {
        // First save current user's data before logging out
        if (username) {
            saveUserData(username, resultHistory, 
                resultHistory.length > 0 ? resultHistory[resultHistory.length - 1] : null);
        }
        
        // Clear current session data
        localStorage.removeItem('assessmentResults');
        localStorage.removeItem('lastAssessmentResult');
        localStorage.removeItem('username');
        
        // Navigate to login page
        navigate('/login');
    };

    // Format the data for the chart
    const chartData = resultHistory.map(result => ({
        date: new Date(result.timestamp).toLocaleDateString(),
        percentage: parseFloat(result.percentage),
        level: result.level
    }));

    // Function to determine level color
    const getLevelColor = (level) => {
        switch (level) {
            case "Low Addiction": return "#4caf50";
            case "Moderate Addiction": return "#ff9800";
            case "High Addiction": return "#f44336";
            case "Severe Addiction": return "#9c27b0";
            default: return "#2196f3";
        }
    };

    // Get the last result for the summary
    const lastResult = resultHistory.length > 0 ? resultHistory[resultHistory.length - 1] : null;

    // Navigate to recommendation page with level data
    const goToRecommendation = () => {
        if (lastResult && lastResult.level) {
            navigate("/recommendation", { state: { level: lastResult.level } });
        } else {
            // Default to Moderate if no level exists
            navigate("/recommendation", { state: { level: "Moderate Addiction" } });
        }
    };

    // Variants for animations
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100 }
        }
    };

    // Reference lines for addiction levels - updated with consistent styling and proper spacing
    const levelReferenceLines = [
        { y: 25, stroke: "#4caf50", label: "Low", opacity: 0.7 },
        { y: 50, stroke: "#ff9800", label: "Moderate", opacity: 0.7 },
        { y: 75, stroke: "#f44336", label: "High", opacity: 0.7 },
        { y: 90, stroke: "#9c27b0", label: "Severe", opacity: 0.7 }
    ];

    // Updated confirmation modal component with blue theme
    const ConfirmationModal = ({ 
        isOpen, 
        onClose, 
        onConfirm, 
        title, 
        message, 
        icon, 
        confirmText
    }) => (
        isOpen && (
            <motion.div 
                className="modal-backdrop position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
                style={{ background: 'rgba(20, 30, 48, 0.7)', zIndex: 1050 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
            >
                <motion.div 
                    className="modal-content p-4 rounded-4"
                    style={{ maxWidth: '400px', width: '90%' }}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 100 }}
                >
                    <div className="text-center mb-3">
                        <i className={`bi ${icon} modal-icon display-4`}></i>
                    </div>
                    <h3 className="text-center mb-3 text-light">{title}</h3>
                    <p className="text-center mb-4 text-light">{message}</p>
                    <div className="d-flex justify-content-center gap-3">
                        <motion.button 
                            className="btn modal-btn modal-btn-cancel px-4 py-2 text-light"
                            onClick={onClose}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Cancel
                        </motion.button>
                        <motion.button 
                            className="btn modal-btn modal-btn-confirm px-4 py-2 text-light"
                            onClick={onConfirm}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {confirmText}
                        </motion.button>
                    </div>
                </motion.div>
            </motion.div>
        )
    );

    return (
        <div className="dashboard-container">
            <AnimatePresence>
                <ConfirmationModal 
                    isOpen={showConfirmModal}
                    onClose={() => setShowConfirmModal(false)}
                    onConfirm={clearAllData}
                    title="Clear All Data?"
                    message="This will permanently delete all your assessment history and cannot be undone."
                    icon="bi-exclamation-triangle"
                    confirmText="Clear Data"
                />
            </AnimatePresence>
            
            <AnimatePresence>
                <ConfirmationModal 
                    isOpen={showLogoutConfirm}
                    onClose={() => setShowLogoutConfirm(false)}
                    onConfirm={handleLogout}
                    title="Logout"
                    message="Are you sure you want to logout?"
                    icon="bi-box-arrow-right"
                    confirmText="Logout"
                />
            </AnimatePresence>
            
            <motion.div
                className="content-box"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
            >
                {loading ? (
                    <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '200px' }}>
                        <div className="spinner-border text-light" style={{ width: '3rem', height: '3rem' }} role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-3 loading-text text-light fs-5">Loading your dashboard...</p>
                    </div>
                ) : (
                    <motion.div 
                        className="dashboard-content w-100"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div className="dashboard-header" variants={itemVariants}>
                            <div className="d-flex align-items-center">
                                <h2 className="dashboard-title fs-1 fw-bold mb-0">Gaming Addiction Dashboard</h2>
                                <motion.i 
                                    className="bi bi-controller text-secondary ms-3 fs-2"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ 
                                        opacity: 1, 
                                        scale: 1,
                                        ...controllerAnimation.animate
                                    }}
                                ></motion.i>
                            </div>
                            
                            {/* Updated and enlarged user profile component */}
                            <motion.div 
                                className="user-profile"
                                whileHover={{ scale: 1.02 }}
                            >
                                <div className="user-avatar">
                                    <i className="bi bi-person-fill text-light"></i>
                                </div>
                                <span className="user-name">{username || 'User'}</span>
                                <div className="user-actions">
                                    {resultHistory.length > 0 && (
                                        <motion.button
                                            className="btn-action btn-clear"
                                            onClick={() => setShowConfirmModal(true)}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                            title="Clear All Data"
                                        >
                                            <i className="bi bi-trash"></i>
                                        </motion.button>
                                    )}
                                    <motion.button
                                        className="btn-action btn-logout"
                                        onClick={() => setShowLogoutConfirm(true)}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        title="Logout"
                                    >
                                        <i className="bi bi-box-arrow-right"></i>
                                    </motion.button>
                                </div>
                            </motion.div>
                        </motion.div>

                        {lastResult && (
                            <motion.div 
                                className="last-result-card p-4 mb-4 rounded"
                                variants={itemVariants}
                            >
                                <div className="d-flex justify-content-between align-items-center flex-wrap">
                                    <div>
                                        <h3 className="fs-4 mb-2">Latest Assessment</h3>
                                        <p className="fs-5 mb-1">
                                            <span className="text-secondary">Date: </span>
                                            {new Date(lastResult.timestamp).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="text-end">
                                        <h4 className="fs-3 fw-bold" style={{ color: getLevelColor(lastResult.level) }}>
                                            {lastResult.percentage}% 
                                        </h4>
                                        <p className="fs-5 fw-semibold" style={{ color: getLevelColor(lastResult.level) }}>
                                            {lastResult.level}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        <motion.div 
                            className="chart-card p-4 mb-4 rounded"
                            variants={itemVariants}
                        >
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h3 className="fs-4 mb-0">Addiction Progress Over Time</h3>
                            </div>
                            
                            {resultHistory.length > 0 ? (
                                <div style={{ height: '400px' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart
                                            data={chartData}
                                            margin={{ top: 20, right: 40, left: 20, bottom: 50 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                                            <XAxis 
                                                dataKey="date" 
                                                stroke="#aaa"
                                                tick={{ fill: '#aaa', fontSize: 12 }}
                                                angle={-45}
                                                textAnchor="end"
                                                height={70}
                                                tickMargin={10}
                                            />
                                            <YAxis 
                                                stroke="#aaa"
                                                domain={[0, 100]} 
                                                tickCount={6}
                                                tick={{ fill: '#aaa', fontSize: 12 }}
                                                label={{ 
                                                    value: 'Addiction Level (%)', 
                                                    angle: -90, 
                                                    position: 'insideLeft',
                                                    style: { fill: '#aaa', fontSize: 13 },
                                                    offset: -5
                                                }} 
                                            />
                                            <Tooltip 
                                                contentStyle={{ 
                                                    backgroundColor: 'rgba(45, 55, 72, 0.95)', 
                                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                                    borderRadius: '8px',
                                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
                                                    color: '#fff',
                                                    padding: '12px'
                                                }}
                                                itemStyle={{ color: '#fff', fontSize: 14 }}
                                                formatter={(value, name) => [`${value}%`, 'Addiction Level']}
                                                labelFormatter={(label) => `Date: ${label}`}
                                                cursor={{ stroke: 'rgba(255, 255, 255, 0.5)', strokeWidth: 1 }}
                                            />
                                            
                                            {/* Reference lines for addiction levels */}
                                            {levelReferenceLines.map((line, index) => (
                                                <ReferenceLine 
                                                    key={index}
                                                    y={line.y} 
                                                    stroke={line.stroke} 
                                                    strokeOpacity={line.opacity}
                                                    strokeDasharray="3 3"
                                                    label={{ 
                                                        value: line.label, 
                                                        position: 'right', 
                                                        offset: 10,
                                                        fill: line.stroke,
                                                        fontSize: 12
                                                    }} 
                                                />
                                            ))}
                                            
                                            <Line
                                                type="monotone"
                                                dataKey="percentage"
                                                stroke="#2196f3"
                                                strokeWidth={3}
                                                activeDot={{ 
                                                    r: 8,
                                                    fill: '#212b36',
                                                    stroke: (entry) => getLevelColor(entry.level),
                                                    strokeWidth: 3 
                                                }}
                                                dot={{ 
                                                    r: 6,
                                                    fill: '#121212',
                                                    stroke: (entry) => getLevelColor(entry.level),
                                                    strokeWidth: 2
                                                }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <div className="d-flex flex-column align-items-center justify-content-center py-5">
                                    <i className="bi bi-bar-chart text-secondary display-4 mb-3"></i>
                                    <p className="text-center fs-5">No assessment data available</p>
                                    <p className="text-center text-secondary">Take an assessment to see your results here</p>
                                </div>
                            )}
                        </motion.div>

                        <motion.div 
                            className={`d-flex ${resultHistory.length === 0 ? 'justify-content-center' : 'justify-content-center gap-3'} mt-4 flex-wrap`} 
                            variants={itemVariants}
                        >
                            <motion.button 
                                className="dashboard-btn rounded-pill py-3 px-4 fs-5 fw-semibold border-0 text-white"
                                onClick={() => navigate("/select-age-group")}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <i className="bi bi-clipboard-check me-2"></i>
                                Take New Assessment
                            </motion.button>
                            
                            {resultHistory.length > 0 && (
                                <motion.button 
                                    className="dashboard-btn rounded-pill py-3 px-4 fs-5 fw-semibold border-0 text-white"
                                    onClick={goToRecommendation}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <i className="bi bi-lightbulb-fill me-2"></i>
                                    View Recommendations
                                </motion.button>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default Dashboard;