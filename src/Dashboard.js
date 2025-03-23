import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [resultHistory, setResultHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    useEffect(() => {
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
                
                // Check if this result is already in history to avoid duplicates
                const resultExists = parsedResults.some(
                    result => result.timestamp === parsedLastResult.timestamp
                );
                
                if (!resultExists) {
                    parsedResults = [...parsedResults, parsedLastResult];
                    // Save updated history back to localStorage
                    localStorage.setItem('assessmentResults', JSON.stringify(parsedResults));
                }
            }
            
            // If no results at all, create sample data
            if (parsedResults.length === 0) {
                parsedResults = [
                    { timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), percentage: 45, level: "Moderate Addiction" },
                    { timestamp: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), percentage: 38, level: "Low Addiction" },
                    { timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), percentage: 52, level: "Moderate Addiction" },
                ];
            }
            
            // Sort by date
            parsedResults.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
            
            setResultHistory(parsedResults);
            setLoading(false);
        }, 800);
        
        return () => clearTimeout(timer);
    }, []);

    // Function to clear all assessment data
    const clearAllData = () => {
        // Remove data from localStorage
        localStorage.removeItem('assessmentResults');
        localStorage.removeItem('lastAssessmentResult');
        
        // Update state to reflect cleared data
        setResultHistory([]);
        setShowConfirmModal(false);
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

    // Reference lines for addiction levels
    const levelReferenceLines = [
        { y: 30, stroke: "#4caf50", label: "Low" },
        { y: 50, stroke: "#ff9800", label: "Moderate" },
        { y: 70, stroke: "#f44336", label: "High" },
    ];

    // Confirmation Modal Component
    const ConfirmationModal = () => (
        <div className="modal-backdrop position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ background: 'rgba(0,0,0,0.7)', zIndex: 1050 }}>
            <motion.div 
                className="modal-content bg-dark text-light p-4 rounded-4 border border-secondary"
                style={{ maxWidth: '400px', width: '90%' }}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100 }}
            >
                <div className="text-center mb-3">
                    <i className="bi bi-exclamation-triangle text-warning display-4"></i>
                </div>
                <h3 className="text-center mb-3">Clear All Data?</h3>
                <p className="text-center mb-4">
                    This will permanently delete all your assessment history and cannot be undone.
                </p>
                <div className="d-flex justify-content-center gap-3">
                    <motion.button 
                        className="btn btn-outline-light px-4 py-2"
                        onClick={() => setShowConfirmModal(false)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Cancel
                    </motion.button>
                    <motion.button 
                        className="btn btn-danger px-4 py-2"
                        onClick={clearAllData}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Clear Data
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );

    return (
        <motion.div 
            className="dashboard-container d-flex flex-column align-items-center p-4 p-md-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {showConfirmModal && <ConfirmationModal />}
            
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
                    style={{ maxWidth: '1000px' }}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div className="text-center mb-4" variants={itemVariants}>
                        <h2 className="dashboard-title fs-1 fw-bold mb-3">Gaming Addiction Dashboard</h2>
                        <p className="text-light fs-5">Track your gaming addiction levels over time</p>
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
                            {resultHistory.length > 0 && (
                                <motion.button 
                                    className="btn btn-outline-danger btn-sm"
                                    onClick={() => setShowConfirmModal(true)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <i className="bi bi-trash me-1"></i>
                                    Clear All Data
                                </motion.button>
                            )}
                        </div>
                        
                        {resultHistory.length > 0 ? (
                            <div style={{ height: '400px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart
                                        data={chartData}
                                        margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                                        <XAxis 
                                            dataKey="date" 
                                            stroke="#ccc"
                                            angle={-45}
                                            textAnchor="end"
                                            height={70}
                                        />
                                        <YAxis 
                                            stroke="#ccc"
                                            domain={[0, 100]} 
                                            label={{ 
                                                value: 'Addiction Level (%)', 
                                                angle: -90, 
                                                position: 'insideLeft',
                                                style: { fill: '#ccc' }
                                            }} 
                                        />
                                        <Tooltip 
                                            contentStyle={{ 
                                                backgroundColor: '#343a40', 
                                                border: 'none',
                                                borderRadius: '4px',
                                                color: '#fff'
                                            }}
                                            itemStyle={{ color: '#fff' }}
                                            formatter={(value, name) => [`${value}%`, 'Addiction Level']}
                                            labelFormatter={(label) => `Date: ${label}`}
                                        />
                                        
                                        {/* Reference lines for addiction levels */}
                                        {levelReferenceLines.map((line, index) => (
                                            <ReferenceLine 
                                                key={index}
                                                y={line.y} 
                                                stroke={line.stroke} 
                                                strokeDasharray="3 3"
                                                label={{ 
                                                    value: line.label, 
                                                    position: 'insideRight', 
                                                    style: { fill: line.stroke } 
                                                }} 
                                            />
                                        ))}
                                        
                                        <Line
                                            type="monotone"
                                            dataKey="percentage"
                                            stroke="#2196f3"
                                            strokeWidth={3}
                                            dot={{ 
                                                r: 6,
                                                strokeWidth: 2, 
                                                fill: '#121212',
                                                stroke: (entry) => getLevelColor(entry.level) 
                                            }}
                                            activeDot={{ 
                                                r: 8,
                                                strokeWidth: 2, 
                                                fill: '#fff',
                                                stroke: (entry) => getLevelColor(entry.level) 
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

                    <motion.div className="d-flex justify-content-center mt-4 gap-3 flex-wrap" variants={itemVariants}>
                        <motion.button 
                            className="dashboard-btn rounded-pill py-3 px-4 fs-5 fw-semibold border-0 text-white"
                            onClick={() => navigate("/select-age-group")}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <i className="bi bi-clipboard-check me-2"></i>
                            Take New Assessment
                        </motion.button>
                        
                        <motion.button 
                            className="dashboard-btn rounded-pill py-3 px-4 fs-5 fw-semibold border-0 text-white"
                            onClick={goToRecommendation}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <i className="bi bi-lightbulb-fill me-2"></i>
                            View Recommendations
                        </motion.button>
                    </motion.div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default Dashboard;