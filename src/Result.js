import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Result.css';

const Result = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { total_score, level } = location.state || { total_score: 0, level: "Unknown" };
    const [loading, setLoading] = useState(true);
    const [displayPercentage, setDisplayPercentage] = useState(0);

    const percentage = ((total_score / 60) * 100).toFixed(2);

    const getLevelDescription = (level) => {
        switch (level) {
            case "Low Addiction": return "You have a balanced approach to gaming. Keep it up!";
            case "Moderate Addiction": return "You might be gaming a bit too much. Take regular breaks.";
            case "High Addiction": return "Gaming is impacting your life. Time to cut down.";
            case "Severe Addiction": return "Gaming is heavily impacting your life. Seek help.";
            default: return "No specific recommendation. Please consult an expert.";
        }
    };

    useEffect(() => {
        // Simulate loading time for animation effect
        const timer = setTimeout(() => {
            setLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    // Animate percentage counter
    useEffect(() => {
        if (!loading) {
            const targetValue = parseFloat(percentage);
            const duration = 1500; // 1.5 seconds
            const increment = 10; // Update every 10ms
            const steps = duration / increment;
            const stepValue = targetValue / steps;
            let current = 0;
            
            const timer = setInterval(() => {
                current += stepValue;
                if (current >= targetValue) {
                    current = targetValue;
                    clearInterval(timer);
                }
                setDisplayPercentage(current);
            }, increment);
            
            return () => clearInterval(timer);
        }
    }, [loading, percentage]);

    // Variants for staggered animations
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

    return (
        <motion.div 
            className="result-container d-flex align-items-center justify-content-center p-4 p-md-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {loading ? (
                <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '200px' }}>
                    <div className="spinner-border text-light" style={{ width: '3rem', height: '3rem' }} role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3 loading-text text-light fs-5">Analyzing your results...</p>
                </div>
            ) : (
                <motion.div 
                    className="result-card p-4 p-md-5 w-100"
                    style={{ maxWidth: '700px' }}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ 
                        type: "spring", 
                        stiffness: 100, 
                        damping: 10, 
                        duration: 0.5 
                    }}
                >
                    <motion.div 
                        className="text-center mb-4"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.h2 className="result-title fs-1 fw-bold mb-3" variants={itemVariants}>Your Assessment Result</motion.h2>
                        <motion.i 
                            className="bi bi-controller display-4 text-secondary"
                            variants={itemVariants}
                            animate={{ 
                                rotateZ: [0, -10, 10, -5, 5, 0],
                                transition: { 
                                    duration: 1.5,
                                    delay: 0.5
                                }
                            }}
                        ></motion.i>
                    </motion.div>

                    <motion.hr 
                        className="border-secondary opacity-75" 
                        variants={itemVariants}
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                    />

                    <motion.h3 
                        className="result-score fs-2 fw-bold text-center"
                        variants={itemVariants}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                    >
                        Addiction: {displayPercentage.toFixed(1)}%
                    </motion.h3>
                    
                    <motion.h4 
                        className="result-level fs-4 fw-bold text-center mb-3"
                        variants={itemVariants}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.9 }}
                    >
                        {level}
                    </motion.h4>
                    
                    <motion.p 
                        className="text-light fs-5 lh-lg text-center"
                        variants={itemVariants}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.1 }}
                    >
                        {getLevelDescription(level)}
                    </motion.p>

                    <motion.div 
                    className="result-buttons"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                >
                        <motion.button 
                        className="result-btn result-btn-primary text-light"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate("/recommendation", { state: { level } })}
                    >
                        View Recommendations
                    </motion.button>
                    <motion.button 
                        className="result-btn result-btn-secondary text-light"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate("/select-age-group")}
                    >
                        Take Another Assessment
                    </motion.button>
                    <motion.button 
                        className="result-btn result-btn-secondary text-light"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate("/dashboard")}
                    >
                        Dashboard
                    </motion.button>
                    </motion.div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default Result;