import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Login.css"; // Custom styles

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
        <div className="container-fluid d-flex flex-column align-items-center justify-content-center">
            <header className="d-flex justify-content-between w-100 p-3">
                <h4 className="mb-5 fw-bold">Game Addiction Control</h4>
            </header>
            <div className="d-flex justify-content-center align-items-center w-100">
                <div className="register-info me-5">
                    <h2 className="fw-bold">Login</h2>
                    <p>Sign in now to be a part of our healthy gaming community</p>
                </div>
                <form className="login-box p-4 shadow rounded bg-white" onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="form-label">Email or Username</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter your email or username"
                            name="usernameOrEmail"
                            value={formData.usernameOrEmail}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Enter your password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="text-start mb-3">
                        <a href="#" className="text-decoration-none">Forgot password?</a>
                    </div>
                    <div className="d-flex justify-content-between">
                        <button type="button" className="btn btn-outline-dark w-45" onClick={() => navigate("/register")}>
                            Sign Up
                        </button>
                        <button type="submit" className="btn btn-dark w-45">Log In</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
