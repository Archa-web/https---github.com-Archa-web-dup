import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SelectAgeGroup.css";
import { motion } from 'framer-motion';

const SelectAgeGroup = ({ setAgeGroup }) => {
    const navigate = useNavigate();
    const [age, setAge] = useState("");
    const [warning, setWarning] = useState("");

    useEffect(() => {
        if (age !== "") setWarning("");
    }, [age]);

    const determineAgeGroup = (age) => {
        if (age >= 15 && age <= 20) return "15-20";
        if (age >= 21 && age <= 30) return "21-30";
        if (age >= 31 && age <= 50) return "31-50";
        return "51+";
    };

    const handleNext = () => {
        if (age === "") {
            setWarning("Please enter your age before proceeding.");
        } else if (age < 15) {
            setWarning("Age must be 15 or older to proceed.");
        } else if (age < 0) {
            setWarning("Age cannot be negative.");
        } else if (age > 90){
            setWarning("Age cannot be greater than 90.");
        } else {
            const selectedAgeGroup = determineAgeGroup(age);
            setAgeGroup(selectedAgeGroup);
            navigate("/Survey");
        }
    };

    return (
        <motion.div
            className="container-fluid d-flex flex-column align-items-center justify-content-center vh-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
            <motion.div
                className="age-box card p-5 shadow-lg w-50 text-center"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <motion.h1
                    className="title text-light fw-bold"
                    style={{ fontSize: "3rem" }}
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    Game Aware
                </motion.h1>
                <motion.i
                    className="bi bi-controller display-4 text-secondary"
                    initial={{ opacity: 0, rotate: -180 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    transition={{ duration: 1 }}
                ></motion.i>
                <motion.h2
                    className="mb-4 text-light fw-bold"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1 }}
                >
                    Enter Your Age
                </motion.h2>
                <motion.p
                    className="text-light"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                >
                    Please enter your age:
                </motion.p>

                {/* Age Input Field */}
                <motion.input
                    type="number"
                    min="0"
                    className="form-control text-center"
                    value={age}
                    onChange={(e) => setAge(e.target.value ? parseInt(e.target.value) : "")}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1 }}
                />

                {/* Display Real-Time Age Group */}
                {age >= 15 && (
                    <motion.p
                        className="text-light mt-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                   
                    >
                        Age Group: <strong className="text-warning">{determineAgeGroup(age)}</strong>
                    </motion.p>
                )}

                {/* Warning Message */}
                {warning && (
                    <motion.div
                        className="warning mt-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 1 }}
                    >
                        {warning}
                    </motion.div>
                )}

                {/* Action Buttons */}
                <motion.div
                    className="d-flex justify-content-center mt-4 gap-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1.5 }}
                >
                    <motion.button
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn btn-lg btn-primary mt-4"
                        onClick={() => navigate(-1)}
                    >
                        Back
                    </motion.button>
                    <motion.button
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn btn-lg btn-primary mt-4"
                        onClick={handleNext}
                    >
                        Next
                    </motion.button>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default SelectAgeGroup;