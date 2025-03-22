import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import 'bootstrap/dist/css/bootstrap.min.css';

const Dashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [totalScore, setTotalScore] = useState(0);
    const [level, setLevel] = useState("Unknown");

    useEffect(() => {
        const fetchSurveyResult = async () => {
            try {
                const response = await fetch('/submit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ responses: location.state?.responses || [] })
                });
                const data = await response.json();
                if (response.ok) {
                    setTotalScore(data.total_score);
                    setLevel(data.level);
                } else {
                    console.error("Error fetching survey result:", data.error);
                }
            } catch (error) {
                console.error("Error submitting survey:", error);
            }
        };

        if (location.state?.responses) {
            fetchSurveyResult();
        }
    }, [location.state]);

    const maxScore = 60;
    const percentage = ((totalScore / maxScore) * 100).toFixed(2);

    return (
        <div className="container-fluid vh-100 d-flex flex-column align-items-center justify-content-center bg-dark text-light">
            <h1 className="mb-4">Welcome to Game Aware Dashboard</h1>
            <p>Explore your personalized gaming experience</p>
            <h3 className="text-light">Addiction Level: {percentage}%</h3>
            <h4 className="text-light">{level}</h4>
            <div className="d-flex gap-3">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn btn-lg btn-primary mt-4"
                    onClick={() => navigate('/select-age-group')}
                >
                    Select Age Group
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn btn-lg btn-danger mt-4"
                    onClick={() => navigate('/home')}
                >
                    Logout
                </motion.button>
            </div>
        </div>
    );
};

export default Dashboard;
