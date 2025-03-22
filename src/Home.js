import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Home.css';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            <motion.div
                className="content"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
            >
                <h1 className="display-3 fw-bold text-light">GameAware</h1>
                <i className="bi bi-controller display-4 text-secondary"></i>
                <p className="lead text-secondary">
                    Understand your gaming habits and maintain a healthy balance.
                </p>
                <p className="motive text-light">
                    Our mission is to provide you with insights into your gaming behavior and help you maintain a healthy balance between gaming and other aspects of life.
                    The assessment is based on the DSM-5 criteria (Diagnostic and Statistical Manual of Mental Disorders, Fifth Edition).
                    Answer the questions honestly to receive an accurate assessment.
                </p>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn btn-lg btn-primary mt-4"
                    onClick={() => navigate("/login")}
                >
                    Start Assessment
                </motion.button>
            </motion.div>
        </div>
    );
};

export default Home;