import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Login.css";
import { Link } from "react-router-dom";
import { motion } from 'framer-motion';
import "animate.css";

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        usernameOrEmail: "",
        password: "",
    });
    const [errors, setErrors] = useState({});

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
        <div className="container-fluid vh-100 animate__animated animate__fadeIn position-relative animate__slower animate__delay-0.5s" >
            <header className="position-absolute top-0 start-0 m-4 animate__animated animate__bounceInLeft animate__delay-2s">
                <h1 className="fw-bold text-light" style={{ fontSize: "2.8rem" }}>Game Aware</h1>
            </header>
            <div className="d-flex flex-row align-items-center justify-content-center h-100">
                <div className="me-5 animate__animated animate__fadeInLeft animate__slow animate__delay-1s">
                    <h2 className="fw-bold text-light " style={{ fontSize: "2.5rem" }}>Login</h2>
                    <p className="animate__animated text-light animate__pulse animate__infinite">Sign in now to be a part of our healthy gaming community</p>
                </div>
                <div className="login-box card-1 p-4 shadow-lg rounded text-light animate__animated animate__fadeInRight animate__slow animate__delay-1s" style={{ width: "30rem"}}>
                    <form className="form-login" onSubmit={handleLogin}>
                        <div className="mb-3 animate__animated animate__zoomIn animate__delay-1s">
                            <label className="form-label fw-bold" style={{ fontSize: "1.4rem" }}>Email/Username</label>
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
                            <label className="form-label fw-bold" style={{ fontSize: "1.4rem" }}>Password</label>
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
                        <div className="text-start mb-3 animate__animated animate__fadeIn animate__delay-2s">
                            <Link to="/email-input" className="text-decoration-none text-primary">Forgot password?</Link>
                        </div>
                        <div className="d-flex gap-2 animate__animated animate__fadeInUp animate__delay-2s">
                            <motion.button
                                type="button"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="btn btn-lg btn-primary mt-4"
                                onClick={() => navigate("/register")}
                            >
                                Sign Up
                            </motion.button>
                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="btn btn-lg btn-primary mt-4"
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