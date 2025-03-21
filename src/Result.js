import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Result.css';

const Result = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { total_score, level } = location.state || { total_score: 0, level: "Unknown" };

    const maxScore = 60;
    const percentage = ((total_score / maxScore) * 100).toFixed(2);

    const getLevelDescription = (level) => {
        switch (level) {
            case "Low Addiction":
                return "You have a balanced approach to gaming. Keep it up!";
            case "Moderate Addiction":
                return "You might be gaming a bit too much. Try to take regular breaks.";
            case "High Addiction":
                return "Gaming is affecting other areas of your life. It's time to cut down.";
            case "Severe Addiction":
                return "Gaming is heavily impacting your daily life. Seeking help is recommended.";
            default:
                return "We couldn't determine a specific recommendation. Please consult an expert.";
        }
    };

    return (
        <motion.div 
            className="result-container"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <motion.div 
                className="result-card"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <motion.h2 
                    className="result-title"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    Your Assessment Result
                </motion.h2>
                
                <hr className="border-secondary opacity-75"/>
                
                <motion.div 
                    className="mb-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    <h3 className="result-score">Addiction: {percentage}%</h3>
                    <h4 className="result-level">{level}</h4>
                    <p className="result-description">{getLevelDescription(level)}</p>
                </motion.div>

                <motion.div 
                    className="result-buttons"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                >
                    <motion.button 
                        className="result-btn result-btn-primary"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate("/recommendation", { state: { level } })}
                    >
                        View Recommendations
                    </motion.button>
                    <motion.button 
                        className="result-btn result-btn-secondary"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate("/select-age-group")}
                    >
                        Take Another Assessment
                    </motion.button>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default Result;