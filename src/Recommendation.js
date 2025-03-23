import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "animate.css";
import './Recommendation.css';
import ChatBot from "./ChatBot";

const Recommendation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { level } = location.state || { level: "Unknown" };
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [appointmentData, setAppointmentData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    concerns: ""
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const recommendations = {
    "Low Addiction": {
      advice: "Maintain a healthy balance.",
      details: "You have a balanced approach to gaming. Keep enjoying, but balance it with work, social life, and physical activities.",
      youtube: "https://youtu.be/gZOcLix4PGc?si=dmSW7hhv2PxfGQpk",
      doctor: {
        name: "Dr. John Doe",
        phone: "(123) 456-7890",
        email: "john.doe@example.com",
        specialty: "Behavioral Psychology",
        experience: "10+ years of experience in digital wellness",
        approach: "Focuses on balanced technology use and healthy habits",
        availability: "Mon-Fri, 9am-5pm",
        languages: ["English", "Spanish"],
        location: "123 Wellness Drive, Suite 101, Los Angeles, CA",
        insurance: ["Blue Cross", "Aetna", "Cigna"]
      },
    },
    "Moderate Addiction": {
      advice: "Consider setting boundaries.",
      details: "Gaming may be taking up more of your time than it should. Set clear time limits and prioritize other activities.",
      youtube: "https://youtu.be/gZOcLix4PGc?si=KmP7VrfuPslbprBF",
      doctor: {
        name: "Dr. Jane Smith",
        phone: "(987) 654-3210",
        email: "jane.smith@example.com",
        specialty: "Addiction Counseling",
        experience: "15+ years specializing in technology addiction",
        approach: "Cognitive-behavioral therapy with focus on building healthy habits",
        availability: "Tue-Sat, 10am-6pm",
        languages: ["English", "French"],
        location: "456 Wellness Parkway, New York, NY",
        insurance: ["UnitedHealthcare", "Kaiser", "Medicare"]
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
        specialty: "Digital Addiction Therapy",
        experience: "12+ years focused on gaming and internet addiction",
        approach: "Holistic approach combining therapy, lifestyle changes, and family involvement",
        availability: "Mon-Thu, 8am-7pm",
        languages: ["English", "Mandarin"],
        location: "789 Recovery Center, Chicago, IL",
        insurance: ["Blue Shield", "Humana", "Medicaid"]
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
        specialty: "Clinical Psychology, Addiction Specialist",
        experience: "20+ years treating severe behavioral addictions",
        approach: "Intensive intervention strategies with ongoing support systems",
        availability: "Available for emergency consultations 24/7",
        languages: ["English", "German", "Portuguese"],
        location: "321 Healing Path, Houston, TX",
        insurance: ["All major insurance plans accepted"]
      },
    },
  };

  const recommendation = recommendations[level] || {
    advice: "No specific recommendation available.",
    details: "We couldn't determine a specific recommendation. Please consult a professional.",
    youtube: "",
    doctor: null,
  };

  // Improved function to format YouTube URL for embedding
  const formatYoutubeUrl = (url) => {
    if (!url) return "";
    
    // Already in embed format
    if (url.includes("embed")) return url;
    
    // Handle youtu.be format
    if (url.includes("youtu.be")) {
      // Extract video ID from youtu.be URL format
      const videoId = url.split("youtu.be/")[1].split("?")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    // Handle standard youtube.com format
    if (url.includes("youtube.com/watch")) {
      return url.replace("watch?v=", "embed/").split("&")[0];
    }
    
    // Return original if we can't parse it
    return url;
  };

  // Handle iframe error
  const handleIframeError = (e) => {
    console.error("YouTube iframe failed to load:", e);
    e.target.style.display = "none";
    const errorMsg = document.createElement("div");
    errorMsg.className = "alert alert-danger my-3 text-center";
    errorMsg.innerText = "Video failed to load. Please check your internet connection or try again later.";
    e.target.parentNode.appendChild(errorMsg);
  };

  // Handle appointment form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAppointmentData({
      ...appointmentData,
      [name]: value
    });
  };

  // Handle appointment form submission
  const handleAppointmentSubmit = (e) => {
    e.preventDefault();
    console.log("Appointment requested:", appointmentData);
    // In a real app, you would send this data to your backend
    setFormSubmitted(true);
    setTimeout(() => {
      setShowAppointmentForm(false);
      setFormSubmitted(false);
      setAppointmentData({
        name: "",
        email: "",
        phone: "",
        date: "",
        time: "",
        concerns: ""
      });
    }, 3000);
  };

  // Generate hours of operation display
  const renderAvailability = (availability) => {
    if (!availability) return "Contact for availability";
    return availability;
  };

  React.useEffect(() => {
    // Ensure the page starts at the top
    window.scrollTo(0, 0);
    
    const sections = document.querySelectorAll('.animated-section');
    sections.forEach((section, index) => {
      section.style.animationDelay = `${0.2 * (index + 1)}s`;
    });
  }, []);

  return (
    <div className="recommendation-container">
      <div className="recommendation-card container p-4 p-md-5 my-3 mx-auto" style={{ maxWidth: "900px" }}>
        {/* Header Section */}
        <div className="text-center mb-4">
          <h2 className="section-title display-5 mb-2">Recommendation for {level}</h2>
          <i className="bi bi-controller fs-1 animated-icon text-secondary"></i>
        </div>

        {/* Advice Section */}
        <div className="animated-section mb-4">
          <h4 className="section-subtitle d-flex align-items-center gap-2 fs-3 mb-3">
            <i className="bi bi-lightbulb-fill text-warning"></i>
            Advice
          </h4>
          <p className="section-text fs-5">{recommendation.advice}</p>
        </div>

        {/* Details Section */}
        <div className="animated-section mb-4">
          <h4 className="section-subtitle d-flex align-items-center gap-2 fs-3 mb-3">
            <i className="bi bi-info-circle-fill text-primary"></i>
            Details
          </h4>
          <p className="section-text fs-5">{recommendation.details}</p>
        </div>

        {/* YouTube Video Section */}
        {recommendation.youtube && (
          <div className="animated-section mb-4">
            <h4 className="section-subtitle d-flex align-items-center gap-2 fs-3 mb-3">
              <i className="bi bi-youtube text-danger"></i>
              Helpful Video
            </h4>
            <div className="video-wrapper mx-auto" style={{ maxWidth: "700px" }}>
              <iframe
                src={formatYoutubeUrl(recommendation.youtube)}
                title="Recommendation Video"
                className="border-0"
                allowFullScreen
                onError={handleIframeError}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              ></iframe>
            </div>
          </div>
        )}

        {/* Enhanced Doctor Info Section */}
        {recommendation.doctor && (
          <div className="animated-section mb-4">
            <h4 className="section-subtitle d-flex align-items-center gap-2 fs-3 mb-3">
              <i className="bi bi-person-badge-fill text-success"></i>
              Contact a Specialist
            </h4>
            <div className="contact-box p-4">
              {/* Specialist Profile */}
              <div className="row mb-4">
                <div className="col-md-4 mb-3 mb-md-0">
                  <div className="d-flex flex-column align-items-center text-center">
                    <div className="specialist-avatar mb-3" style={{ width: "120px", height: "120px", borderRadius: "50%", background: "rgba(75, 107, 183, 0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <i className="bi bi-person-fill text-primary" style={{ fontSize: "3rem" }}></i>
                    </div>
                    <h5 className="fw-bold">{recommendation.doctor.name}</h5>
                    <p className="badge bg-primary mb-2">{recommendation.doctor.specialty}</p>
                    <div className="specialist-rating mb-2">
                      <i className="bi bi-star-fill text-warning"></i>
                      <i className="bi bi-star-fill text-warning"></i>
                      <i className="bi bi-star-fill text-warning"></i>
                      <i className="bi bi-star-fill text-warning"></i>
                      <i className="bi bi-star-half text-warning"></i>
                      <span className="ms-1 text-white">(4.5)</span>
                    </div>
                  </div>
                </div>
                <div className="col-md-8">
                  <div className="specialist-details">
                    <h5 className="text-secondary mb-3">Specialist Information</h5>
                    <p className="mb-2"><i className="bi bi-briefcase-fill text-primary me-2"></i> <strong>Experience:</strong> {recommendation.doctor.experience}</p>
                    <p className="mb-2"><i className="bi bi-journals text-primary me-2"></i> <strong>Approach:</strong> {recommendation.doctor.approach}</p>
                    <p className="mb-2"><i className="bi bi-clock-fill text-primary me-2"></i> <strong>Availability:</strong> {renderAvailability(recommendation.doctor.availability)}</p>
                    <p className="mb-2"><i className="bi bi-translate text-primary me-2"></i> <strong>Languages:</strong> {recommendation.doctor.languages ? recommendation.doctor.languages.join(", ") : "English"}</p>
                    <p className="mb-2"><i className="bi bi-geo-alt-fill text-primary me-2"></i> <strong>Location:</strong> {recommendation.doctor.location || "Location information unavailable"}</p>
                    <p className="mb-2"><i className="bi bi-shield-check text-primary me-2"></i> <strong>Insurance:</strong> {Array.isArray(recommendation.doctor.insurance) ? recommendation.doctor.insurance.join(", ") : recommendation.doctor.insurance || "Contact for insurance details"}</p>
                  </div>
                </div>
              </div>

              {/* Contact Methods */}
              <div className="contact-methods p-3 mb-4" style={{ background: "rgba(20, 30, 48, 0.5)", borderRadius: "10px" }}>
                <h5 className="text-secondary mb-3">Contact Methods</h5>
                <div className="row">
                  <div className="col-md-4 mb-3 mb-md-0">
                    <div className="contact-method-card p-3 text-center h-100" style={{ background: "rgba(20, 30, 48, 0.7)", borderRadius: "8px" }}>
                      <i className="bi bi-telephone-fill text-primary fs-2 mb-3"></i>
                      <h6 className="fw-bold mb-2"style={{fontSize: "2rem"}}>Phone</h6>
                      <a href={`tel:${recommendation.doctor.phone}`} className="d-block text-decoration-none text-white fw-bold"style={{fontSize: "1rem"}}>
                        {recommendation.doctor.phone}
                      </a>
                      <p className="small text-secondary mt-2 mb-0">Best for urgent inquiries</p>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3 mb-md-0">
                    <div className="contact-method-card p-3 text-center h-100" style={{ background: "rgba(20, 30, 48, 0.7)", borderRadius: "8px" }}>
                      <i className="bi bi-envelope-fill text-primary fs-2 mb-3"></i>
                      <h6 className="fw-bold mb-2"style={{fontSize: "2rem"}}>Email</h6>
                      <a href={`mailto:${recommendation.doctor.email}`} className="d-block text-decoration-none text-white fw-bold"style={{fontSize: "1rem"}}>
                        {recommendation.doctor.email}
                      </a>
                      <p className="small text-secondary mt-2 mb-0">For detailed inquiries</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="contact-method-card p-3 text-center h-100" style={{ background: "rgba(20, 30, 48, 0.7)", borderRadius: "8px" }}>
                      <i className="bi bi-calendar-check-fill text-primary fs-2 mb-3"></i>
                      <h6 className="fw-bold mb-2"style={{fontSize: "2rem"}}>Online Booking</h6>
                      <button 
                        onClick={() => setShowAppointmentForm(true)} 
                        className="btn btn-primary btn-sm"
                        style={{ background: "linear-gradient(to right, #4b6cb7, #182848)", border: "none", fontSize: "1rem" }}
                      >
                        Schedule a Visit
                      </button>
                      <p className="small text-secondary mt-2 mb-0">Quick appointment setup</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* What to Expect */}
              <div className="what-to-expect p-3" style={{ background: "rgba(20, 30, 48, 0.5)", borderRadius: "10px" }}>
                <h5 className="text-secondary mb-3">What to Expect</h5>
                <div className="row">
                  <div className="col-md-4 mb-3 mb-md-0">
                    <div className="expectation-card p-3 text-center" style={{ background: "rgba(20, 30, 48, 0.7)", borderRadius: "8px", height: "100%" }}>
                      <i className="bi bi-1-circle-fill text-primary fs-2 mb-2"></i>
                      <h6 className="fw-bold" style={{fontSize: "2rem"}}>Initial Consultation</h6>
                      <p className="small">A 45-minute assessment to understand your gaming habits and personal goals.</p>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3 mb-md-0">
                    <div className="expectation-card p-3 text-center" style={{ background: "rgba(20, 30, 48, 0.7)", borderRadius: "8px", height: "100%" }}>
                      <i className="bi bi-2-circle-fill text-primary fs-2 mb-2"></i>
                      <h6 className="fw-bold"style={{fontSize: "2rem"}}>Personalized Plan</h6>
                      <p className="small">Development of a customized strategy to address your specific situation.</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="expectation-card p-3 text-center" style={{ background: "rgba(20, 30, 48, 0.7)", borderRadius: "8px", height: "100%" }}>
                      <i className="bi bi-3-circle-fill text-primary fs-2 mb-2"></i>
                      <h6 className="fw-bold"style={{fontSize: "2rem"}}>Ongoing Support</h6>
                      <p className="small">Regular follow-ups to track progress and adjust strategies as needed.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Appointment Form Modal */}
        {showAppointmentForm && (
          <div className="appointment-modal" style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.8)", zIndex: 1050, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div className="modal-content p-4" style={{ background: "rgba(28, 36, 47, 0.95)", borderRadius: "15px", width: "90%", maxWidth: "600px", maxHeight: "90vh", overflow: "auto" }}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="section-subtitle m-0">Schedule an Appointment</h4>
                <button className="btn btn-close btn-close-white" onClick={() => setShowAppointmentForm(false)}></button>
              </div>
              
              {formSubmitted ? (
                <div className="text-center p-4">
                  <i className="bi bi-check-circle-fill text-success fs-1 mb-3"></i>
                  <h5 className="fw-bold">Appointment Request Sent!</h5>
                  <p>We've received your request for an appointment with {recommendation.doctor.name}.</p>
                  <p>You will receive a confirmation email shortly at {appointmentData.email}.</p>
                </div>
              ) : (
                <form onSubmit={handleAppointmentSubmit}>
                  <div className="row mb-3">
                    <div className="col-md-6 mb-3 mb-md-0">
                      <label className="form-label">Full Name</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        name="name" 
                        value={appointmentData.name} 
                        onChange={handleInputChange} 
                        required 
                        style={{ background: "rgba(20, 30, 48, 0.7)", color: "white", border: "1px solid #3b4754" }}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Email Address</label>
                      <input 
                        type="email" 
                        className="form-control" 
                        name="email" 
                        value={appointmentData.email} 
                        onChange={handleInputChange} 
                        required 
                        style={{ background: "rgba(20, 30, 48, 0.7)", color: "white", border: "1px solid #3b4754" }}
                      />
                    </div>
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-md-6 mb-3 mb-md-0">
                      <label className="form-label">Phone Number</label>
                      <input 
                        type="tel" 
                        className="form-control" 
                        name="phone" 
                        value={appointmentData.phone} 
                        onChange={handleInputChange} 
                        required 
                        style={{ background: "rgba(20, 30, 48, 0.7)", color: "white", border: "1px solid #3b4754" }}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Preferred Date</label>
                      <input 
                        type="date" 
                        className="form-control" 
                        name="date" 
                        value={appointmentData.date} 
                        onChange={handleInputChange} 
                        required 
                        style={{ background: "rgba(20, 30, 48, 0.7)", color: "white", border: "1px solid #3b4754" }}
                      />
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Preferred Time</label>
                    <select 
                      className="form-select" 
                      name="time" 
                      value={appointmentData.time} 
                      onChange={handleInputChange} 
                      required 
                      style={{ background: "rgba(20, 30, 48, 0.7)", color: "white", border: "1px solid #3b4754" }}
                    >
                      <option value="">Select a time</option>
                      <option value="9:00 AM">9:00 AM</option>
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="11:00 AM">11:00 AM</option>
                      <option value="1:00 PM">1:00 PM</option>
                      <option value="2:00 PM">2:00 PM</option>
                      <option value="3:00 PM">3:00 PM</option>
                      <option value="4:00 PM">4:00 PM</option>
                    </select>
                  </div>
                  
                  <div className="mb-4">
                    <label className="form-label">Specific Concerns (Optional)</label>
                    <textarea 
                      className="form-control" 
                      name="concerns" 
                      value={appointmentData.concerns} 
                      onChange={handleInputChange} 
                      rows="3" 
                      style={{ background: "rgba(20, 30, 48, 0.7)", color: "white", border: "1px solid #3b4754" }}
                      placeholder="Please share any specific concerns or questions you'd like to discuss..."
                    ></textarea>
                  </div>
                  
                  <div className="d-flex justify-content-center">
                    <button 
                      type="submit" 
                      className="recommendation-btn recommendation-btn-primary d-flex align-items-center gap-2"
                    >
                      <i className="bi bi-calendar-check"></i>
                      Confirm Appointment
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Navigation Buttons - Updated with Dashboard button */}
        <div className="d-flex justify-content-center gap-3 mt-4 flex-wrap">
          <button className="recommendation-btn recommendation-btn-outline d-flex align-items-center gap-2" onClick={() => navigate("/")}>
            <i className="bi bi-house-door-fill"></i>
            Home
          </button>
          <button className="recommendation-btn recommendation-btn-primary d-flex align-items-center gap-2" onClick={() => navigate("/dashboard")}>
            <i className="bi bi-graph-up"></i>
            Dashboard
          </button>
          <button className="recommendation-btn recommendation-btn-outline d-flex align-items-center gap-2" onClick={() => window.history.back()}>
            <i className="bi bi-arrow-left-circle-fill"></i>
            Go Back
          </button>
        </div>
      </div>
      
      {/* ChatBot component in original position */}
      <div className="chatbot-container">
        <ChatBot level={level} doctor={recommendation.doctor} />
      </div>
    </div>
  );
};

export default Recommendation;