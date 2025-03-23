import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Home.css';

const Home = () => {
    const navigate = useNavigate();

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

    return (
        <div className="home-container">
            <motion.div
                className="content"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
            >
                <h1 className="display-3 fw-bold text-light">GameAware</h1>

                <div className="icon-container">
                    <motion.i 
                        className="bi bi-controller display-4 text-secondary"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ 
                            opacity: 1, 
                            scale: 1,
                            ...controllerAnimation.animate
                        }}
                    ></motion.i>
                </div>

                <p className="lead">
                    Understand your gaming habits and maintain a healthy balance.
                </p>
                <p className="motive">
                    Our mission is to provide you with insights into your gaming behavior and help you maintain a healthy balance between gaming and other aspects of life.
                    The assessment is based on the DSM-5 criteria (Diagnostic and Statistical Manual of Mental Disorders, Fifth Edition).
                    Answer the questions honestly to receive an accurate assessment.
                </p>
                <motion.button
                    whileHover={{ scale: 1.05 }}
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