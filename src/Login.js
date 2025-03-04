import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Login.css"; // Custom styles
import "animate.css";


const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        usernameOrEmail: "",
        password: "",
    });

    // Handle input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle login form submission
    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:5000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                Swal.fire({
                    icon: "success",
                    title: "Login Successful!",
                    text: "Welcome to the gaming community!",
                    showConfirmButton: true,
                    confirmButtonText: "Continue",
                }).then(() => {
                    navigate("/dashboard"); // Redirect after success
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Login Failed",
                    text: data.error || "Invalid username/email or password",
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Something went wrong. Please try again later.",
            });
        }
    };

    return (
        <div className="container-fluid vh-100 bg-light animate__animated animate__fadeIn position-relative animate__slower animate__delay-1s">
            <header className="position-absolute top-0 start-0 m-4 animate__animated animate__bounceInLeft animate__delay-2s">
                <h1 className="fw-bold text-dark">Game Addiction Control</h1>
            </header>
            <div className="d-flex flex-row align-items-center justify-content-center h-100">
                <div className="me-5 animate__animated animate__fadeInLeft animate__slow animate__delay-1s">
                    <h2 className="fw-bold">Login</h2>
                    <p className="animate__animated animate__pulse animate__infinite">Sign In now to be a part of our healthy gaming community</p>
                </div>
                <div className="card p-4 shadow-lg rounded bg-white text-dark animate__animated animate__fadeInRight animate__slow animate__delay-1s" style={{ width: "25rem" }}>
                    <form onSubmit={handleLogin}>
                        <div className="mb-3 animate__animated animate__zoomIn animate__delay-1s">
                            <label className="form-label fw-bold" style={{ fontSize: "1.4rem" }}>Email/Username</label>
                            <input
                                type="text"
                                className="form-control animate__animated animate__pulse animate__infinite"
                                placeholder="Enter your email or username"
                                name="usernameOrEmail"
                                value={formData.usernameOrEmail}
                            onChange={handleChange}
                            required
                            />
                        </div>
                        <div className="mb-3 animate__animated animate__zoomIn animate__delay-1s">
                            <label className="form-label fw-bold">Password</label>
                            <input
                                type="password"
                                className="form-control animate__animated animate__pulse animate__infinite"
                                placeholder="Enter your password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="text-start mb-3 animate__animated animate__fadeIn animate__delay-2s">
                            <a href="#" className="text-decoration-none text-primary">Forgot password?</a>
                        </div>
                        <div className="d-flex gap-2 animate__animated animate__fadeInUp animate__delay-2s">
                            <button type="button" className="btn btn-outline-dark animate__animated animate__rubberBand animate__delay-3s" onClick={() => navigate("/register")}>
                                Sign Up</button>
                            <button type="submit" className="btn btn-dark animate__animated animate__tada animate__delay-3s">Log In</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
