import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./SelectAgeGroup.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const SelectAgeGroup = ({ setAgeGroup }) => {
    const navigate = useNavigate();
    const [age, setAge] = useState("");
    const [warning, setWarning] = useState("");

    // Clear warning when age is changed
    useEffect(() => {
        if (age !== "") setWarning("");
    }, [age]);

    // Age group determination logic
    const handleContinue = () => {
        if (age === "" || age < 15 || age > 90) {
            setWarning("Please enter a valid age (15 - 90) before proceeding.");
            return;
        }
        
        // Determine age group and navigate
        const ageGroup = 
            age >= 15 && age <= 20 ? "15-20" :
            age >= 21 && age <= 30 ? "21-30" :
            age >= 31 && age <= 50 ? "31-50" : "51+";
            
        setAgeGroup(ageGroup);
        navigate("/survey");
    };

    // Animation variants with faster speeds
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { 
                duration: 0.4, // Faster overall animation
                when: "beforeChildren",
                staggerChildren: 0.1 // Reduced stagger time
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { 
            y: 0, 
            opacity: 1,
            transition: { duration: 0.3, ease: "easeOut" } // Faster item animation
        }
    };

    return (
        <div className="select-age-container">
            <motion.div
                className="select-age-card"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div className="text-center mb-4" variants={itemVariants}>
                    <h2 className="select-age-title">Enter Your Age</h2>
                    <motion.i
                    className="bi bi-controller display-4 text-secondary"
                    initial={{ opacity: 0, rotate: -180 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    transition={{ duration: 1 }}
                ></motion.i>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <input
                        type="number"
                        min="15"
                        max="90"
                        className="age-input form-control mt-3"
                        placeholder="Enter age (15-90)"
                        value={age}
                        onChange={(e) => setAge(e.target.value ? parseInt(e.target.value) : "")}
                    />
                </motion.div>

                {warning && (
                    <motion.div 
                        className="warning mt-3"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }} // Faster warning animation
                    >
                        {warning}
                    </motion.div>
                )}

                <motion.div 
                    className="d-flex justify-content-center mt-4"
                    variants={itemVariants}
                >
                    <motion.button
                        className="age-btn"
                        onClick={handleContinue}
                        whileHover={{ scale: 1.05, transition: { duration: 0.2 } }} // Faster hover
                        whileTap={{ scale: 0.95, transition: { duration: 0.1 } }} // Faster tap
                    >
                        Continue
                    </motion.button>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default SelectAgeGroup;