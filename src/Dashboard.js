import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";

const Dashboard = () => {
    const navigate = useNavigate();

    return (
        <motion.div
            className="container-fluid vh-100 d-flex flex-column justify-content-center align-items-center text-light"
            style={{ backgroundImage: 'linear-gradient(to right, #1c1c1c, #2c3e50)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
            <motion.h1
                className="fw-bold mb-3"
                style={{ fontSize: "2.5rem" }}
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                Welcome to Game Aware Dashboard
            </motion.h1>
            <motion.p
                className="mb-4"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                Explore resources and manage your gaming habits wisely.
            </motion.p>

            <div className="d-flex gap-3">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn btn-lg btn-primary"
                    onClick={() => navigate("/select-age-group")}
                >
                    Take Assessment
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn btn-lg btn-primary"
                    onClick={() => navigate("/login")}
                >
                    Logout
                </motion.button>
            </div>
        </motion.div>
    );
};

export default Dashboard;
