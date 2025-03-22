import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "bootstrap-icons/font/bootstrap-icons.css";
import "animate.css";
import './Recommendation.css';

const Recommendation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { level } = location.state || { level: "Unknown" };

  const recommendations = {
    "Low Addiction": {
      advice: "Maintain a healthy balance.",
      details: "You have a balanced approach to gaming. Keep enjoying, but balance it with work, social life, and physical activities.",
      youtube: "https://youtu.be/gZOcLix4PGc?si=dmSW7hhv2PxfGQpk",
      doctor: {
        name: "Dr. John Doe",
        phone: "(123) 456-7890",
        email: "john.doe@example.com",
      },
    },
    "Moderate Addiction": {
      advice: "Consider setting boundaries.",
      details: "Gaming may be taking up more of your time than it should. Set clear time limits and prioritize other activities.",
      youtube: "https://www.youtube.com/embed/example2",
      doctor: {
        name: "Dr. Jane Smith",
        phone: "(987) 654-3210",
        email: "jane.smith@example.com",
      },
    },
    "High Addiction": {
      advice: "Reduce screen time and seek balance.",
      details: "Your gaming is significantly impacting other parts of your life. Start reducing screen time and explore alternative hobbies.",
      youtube: "https://youtu.be/VzL2A5l-eVU?si=aR2Z3Gs5sBLSGG63",
      doctor: {
        name: "Dr. Emily Johnson",
        phone: "(555) 123-4567",
        email: "emily.johnson@example.com",
      },
    },
    "Severe Addiction": {
      advice: "Seek professional help immediately.",
      details: "Your gaming habits are seriously impacting your daily life. Please seek professional help to regain balance.",
      youtube: "https://www.youtube.com/embed/example4",
      doctor: {
        name: "Dr. Michael Brown",
        phone: "(444) 987-6543",
        email: "michael.brown@example.com",
      },
    },
  };

  const recommendation = recommendations[level] || {
    advice: "No specific recommendation available.",
    details: "We couldn't determine a specific recommendation. Please consult a professional.",
    youtube: "",
    doctor: null,
  };

  return (
    <motion.div
      className="recommendation-container animate__animated animate__fadeIn"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.div
        className="recommendation-card"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Heading with Controller Icon */}
        <motion.div
          className="text-center mb-4"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h2 className="section-title">Recommendation for {level}</h2>
          <motion.i
            className="bi bi-controller display-4 text-secondary"
            initial={{ opacity: 0, rotate: -180 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ duration: 1 }}
          ></motion.i>
        </motion.div>

        <motion.h4
          className="section-subtitle"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <i className="bi bi-lightbulb-fill text-warning me-2"></i>Advice
        </motion.h4>
        <motion.p
          className="section-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          {recommendation.advice}
        </motion.p>

        <motion.h4
          className="section-subtitle"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <i className="bi bi-info-circle-fill text-primary me-2"></i>Details
        </motion.h4>
        <motion.p
          className="section-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          {recommendation.details}
        </motion.p>

        {/* YouTube Video */}
        {recommendation.youtube && (
          <>
            <motion.h4
              className="section-subtitle"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
            >
              <i className="bi bi-youtube text-danger me-2"></i>Helpful Video
            </motion.h4>
            <motion.div
              className="video-wrapper"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <iframe
                src={recommendation.youtube.includes("embed") ? recommendation.youtube : recommendation.youtube.replace("watch?v=", "embed/")}
                title="Recommendation Video"
                allowFullScreen
              ></iframe>
            </motion.div>
          </>
        )}

        {/* Doctor Info */}
        {recommendation.doctor && (
          <>
            <motion.h4
              className="section-subtitle"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
            >
              <i className="bi bi-person-badge-fill text-success me-2"></i>Contact a Specialist
            </motion.h4>
            <motion.div
              className="contact-box"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <p className="fw-bold mb-2">{recommendation.doctor.name}</p>
              <p className="mb-1">
                <i className="bi bi-telephone-fill text-primary me-2"></i>
                <a href={`tel:${recommendation.doctor.phone}`} className="text-decoration-none text-white fw-bold">
                  {recommendation.doctor.phone}
                </a>
              </p>
              <p>
                <i className="bi bi-envelope-fill text-primary me-2"></i>
                <a href={`mailto:${recommendation.doctor.email}`} className="text-decoration-none text-white fw-bold">
                  {recommendation.doctor.email}
                </a>
              </p>
            </motion.div>
          </>
        )}

        {/* Navigation Buttons */}
        <motion.div
          className="d-flex justify-content-center gap-3 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <motion.button
            className="recommendation-btn recommendation-btn-outline"
            onClick={() => navigate("/")}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <i className="bi bi-house-door-fill me-2"></i>Home
          </motion.button>
          <motion.button
            className="recommendation-btn recommendation-btn-primary"
            onClick={() => window.history.back()}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <i className="bi bi-arrow-left-circle-fill me-2"></i>Go Back
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Recommendation;