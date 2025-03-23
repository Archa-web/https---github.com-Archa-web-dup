import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

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
            ease: [0.45, 0.05, 0.55, 0.95],
            times: [0, 0.2, 0.4, 0.6, 0.8, 1]
        }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Remove error as soon as the field is valid
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      if (name === "fullName") {
        if (value.trim() && /^[a-zA-Z\s]*$/.test(value)) {
          delete newErrors.fullName;
        } else {
          newErrors.fullName = "Full Name must contain only letters and spaces";
        }
      }
      if (name === "email" && value.includes("@")) delete newErrors.email;
      if (name === "username" && value.trim()) delete newErrors.username;
      if (name === "password" && validatePassword(value)) delete newErrors.password;
      if (name === "confirmPassword" && value === formData.password) delete newErrors.confirmPassword;
      return newErrors;
    });
  };

  // Function to validate password complexity
  const validatePassword = (password) => {
    return (
      password.length >= 6 &&
      /[A-Z]/.test(password) &&  // At least one uppercase
      /[\W_]/.test(password)     // At least one special character
    );
  };

  // Full Form Validation before submission
  const validateForm = () => {
    let errors = {};
    if (!formData.fullName.trim()) errors.fullName = "Full Name is required";
    if (!formData.email.includes("@")) errors.email = "Valid email is required";
    if (!formData.username.trim()) errors.username = "Username is required";
    if (!validatePassword(formData.password)) 
      errors.password = "Password must be at least 6 characters, include one uppercase and one special character";
    if (formData.password !== formData.confirmPassword) 
      errors.confirmPassword = "Passwords do not match";

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await fetch("http://127.0.0.1:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (response.status === 400) {
        setErrors(data.errors || {});
      } else {
        setShowSuccessPopup(true);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="home-container d-flex flex-column align-items-center justify-content-center">
      <div className="d-flex flex-column align-items-center justify-content-center w-100">
        {/* Registration form that now includes the GameAware heading, icon, and message */}
        <motion.form
          className="register-box text-light p-4 shadow rounded bg-white"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
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
          
          {/* Title and message inside the box */}
          <motion.div
            className="text-center mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="fw-bold text-light" style={{ fontSize: "2rem" }}>Create an Account</h2>
            <p className="text-light">Sign up now to be a part of our healthy gaming community</p>
          </motion.div>
          
          {errors.general && <p className="text-danger">{errors.general}</p>}
          
          {/* First row - Full Name and Username side by side */}
          <div className="row">
            <motion.div
              className="col-md-6 mb-3"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <label className="form-label text-light">Full Name</label>
              <input type="text" className="form-control" name="fullName" placeholder="Enter your full name" onChange={handleChange} />
              {errors.fullName && <p className="text-danger">{errors.fullName}</p>}
            </motion.div>
            
            <motion.div
              className="col-md-6 mb-3"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <label className="form-label">Username</label>
              <input type="text" className="form-control" name="username" placeholder="Choose a username" onChange={handleChange} />
              {errors.username && <p className="text-danger">{errors.username}</p>}
            </motion.div>
          </div>

          {/* Email in its own row */}
          <motion.div
            className="mb-3"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <label className="form-label">Email</label>
            <input type="email" className="form-control" name="email" placeholder="Enter your email" onChange={handleChange} />
            {errors.email && <p className="text-danger">{errors.email}</p>}
          </motion.div>

          {/* Second row - Password and Confirm Password side by side */}
          <div className="row">
            <motion.div
              className="col-md-6 mb-3"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <label className="form-label">Password</label>
              <input type="password" className="form-control" name="password" placeholder="Enter a password" onChange={handleChange} />
              {errors.password && <p className="text-danger">{errors.password}</p>}
            </motion.div>

            <motion.div
              className="col-md-6 mb-3"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <label className="form-label">Confirm Password</label>
              <input type="password" className="form-control" name="confirmPassword" placeholder="Confirm your password" onChange={handleChange} />
              {errors.confirmPassword && <p className="text-danger">{errors.confirmPassword}</p>}
            </motion.div>
          </div>

          {/* Centered button container */}
          <div className="text-center mt-4">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-lg btn-primary"
            >
              Sign Up
            </motion.button>
          </div>
        </motion.form>
      </div>

      {/* Success Popup Modal */}
      <AnimatePresence>
        {showSuccessPopup && (
          <motion.div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <motion.div
                className="modal-content"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
              >
                <div className="modal-header">
                  <h5 className="modal-title text-light">Registration Successful!</h5>
                </div>
                <div className="modal-body text-light">
                  <p>Your account has been created successfully.</p>
                </div>
                <div className="modal-footer">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn btn-lg btn-primary mt-4"
                    onClick={() => navigate("/login")}
                  >
                    Continue to Login
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Register;