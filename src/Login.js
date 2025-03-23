import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Login.css";
import { motion } from 'framer-motion';
import "animate.css";

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        usernameOrEmail: "",
        password: "",
    });
    const [errors, setErrors] = useState({});

    // Enhanced controller animation configuration (copied from Home.js)
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

    // Function to validate input fields
    const validateForm = () => {
        let errors = {};
        if (!formData.usernameOrEmail.trim()) errors.usernameOrEmail = "Username or Email is required";
        if (!formData.password.trim()) errors.password = "Password is required";

        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Remove error as soon as the field is valid
        setErrors((prevErrors) => {
            const newErrors = { ...prevErrors };
            if (name === "usernameOrEmail" && value.trim()) delete newErrors.usernameOrEmail;
            if (name === "password" && value.trim()) delete newErrors.password;
            return newErrors;
        });
    };

    // Handle login form submission
    const handleLogin = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const response = await fetch("http://localhost:5000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                // Get the current user's username
                const username = data.username;
                
                // Store username in localStorage for dashboard display
                localStorage.setItem('username', username);
                
                // Load user-specific data from localStorage
                const allUserData = JSON.parse(localStorage.getItem('allUsersData') || '{}');
                
                // Get this user's specific data if it exists
                const userData = allUserData[username] || {
                    assessmentResults: [],
                    lastAssessmentResult: null
                };
                
                // Set the user's data for the dashboard to use
                localStorage.setItem('assessmentResults', JSON.stringify(userData.assessmentResults || []));
                if (userData.lastAssessmentResult) {
                    localStorage.setItem('lastAssessmentResult', JSON.stringify(userData.lastAssessmentResult));
                } else {
                    localStorage.removeItem('lastAssessmentResult');
                }
                
                Swal.fire({
                    title: "Login Successful!",
                    text: "Welcome to the gaming community!",
                    confirmButtonText: "Continue",
                    customClass: {
                        popup: 'gradient-background',
                        confirmButton: 'btn btn-lg btn-primary mt-4'
                    }
                }).then(() => {
                    navigate('/dashboard');
                });
            } else {
                setErrors(data.errors || {});
                Swal.fire({
                    icon: "error",
                    title: "Login Failed",
                    text: data.error || "Invalid username/email or password",
                    customClass: {
                        popup: 'gradient-background'
                    }
                });
            }
        } catch (error) {
            console.error("Error during login:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Something went wrong. Please try again later.",
                customClass: {
                    popup: 'gradient-background'
                }
            });
        }
    };

    return (
        <div className="home-container animate__animated animate__fadeIn position-relative animate__slower animate__delay-0.5s">
            <div className="d-flex flex-column align-items-center justify-content-center h-100">
                {/* Login box that now includes the title, game controller icon, and message */}
                <div className="login-box card-1 p-4 shadow-lg rounded text-light animate__animated animate__fadeInUp animate__slow animate__delay-1s" style={{ width: "30rem"}}>
                    {/* GameAware heading and controller icon */}
                    <div className="text-center mb-4">
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
                    </div>
                    
                    {/* Login title and message */}
                    <div className="text-center mb-4 animate__animated animate__fadeInDown animate__slow">
                        <h2 className="fw-bold text-light" style={{ fontSize: "2rem" }}>Login</h2>
                        <p className="animate__animated text-light animate__pulse animate__infinite">
                            Sign in now to be a part of our healthy gaming community
                        </p>
                    </div>
                    
                    <form className="form-login" onSubmit={handleLogin}>
                        <div className="mb-3 animate__animated animate__zoomIn animate__delay-1s">
                            <label className="form-label fw-bold" style={{ fontSize: "1.2rem" }}>Email/Username</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter your email or username"
                                name="usernameOrEmail"
                                value={formData.usernameOrEmail}
                                onChange={handleChange}
                            />
                            {errors.usernameOrEmail && <p className="text-danger">{errors.usernameOrEmail}</p>}
                        </div>
                        <div className="mb-3 animate__animated animate__zoomIn animate__delay-1s">
                            <label className="form-label fw-bold" style={{ fontSize: "1.2rem" }}>Password</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Enter your password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                            {errors.password && <p className="text-danger">{errors.password}</p>}
                        </div>
                        <div className="d-flex justify-content-between animate__animated animate__fadeInUp animate__delay-2s">
                            <motion.button
                                type="button"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="btn btn-primary mt-4 w-100 me-2"
                                onClick={() => navigate("/register")}
                            >
                                Sign Up
                            </motion.button>
                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="btn btn-primary mt-4 w-100 ms-2"
                            >
                                Login
                            </motion.button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;