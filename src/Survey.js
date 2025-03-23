import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Survey.css";

const Survey = ({ ageGroup }) => {
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [responses, setResponses] = useState({});
    const [warning, setWarning] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://127.0.0.1:5000/gaming/questions/${ageGroup}`)
            .then((res) => setQuestions(res.data))
            .catch((err) => console.error("Error fetching questions:", err.response?.data || err.message));
    }, [ageGroup]);

    const handleSelect = (questionId, score) => {
        setResponses({ ...responses, [questionId]: score });
        setWarning('');
    };

    const handleNext = () => {
        if (responses[questions[currentIndex]?.id] === undefined) {
            setWarning('Please select an option before proceeding.');
        } else {
            setCurrentIndex((prev) => prev + 1);
        }
    };

    const handleBack = () => {
        setCurrentIndex((prev) => prev - 1);
    };

    const handleSubmit = () => {
        setIsSubmitting(true);
        
        const totalScore = Object.values(responses).reduce((acc, score) => acc + score, 0);
        const surveyData = {
            ageGroup,
            responses: Object.entries(responses).map(([id, score]) => ({ question_id: id, score })),
            totalScore,
            date: new Date().toISOString(),
        };

        // Add artificial delay for transition animation
        setTimeout(() => {
            axios.post("http://127.0.0.1:5000/submit", surveyData)
                .then((res) => {
                    // Create page exit animation
                    const pageExitAnimation = async () => {
                        await new Promise(resolve => setTimeout(resolve, 500)); // Wait for animation
                        navigate("/result", { 
                            state: res.data
                        });
                    };
                    pageExitAnimation();
                })
                .catch((err) => {
                    console.error("Submission error:", err.response?.data || err.message);
                    setIsSubmitting(false);
                });
        }, 500);
    };

    return (
        <div className="survey-container d-flex align-items-center justify-content-center p-3 p-md-5">
            {questions.length > 0 && currentIndex < questions.length ? (
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 50, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -50, scale: 0.9 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="survey-card p-4 p-md-5 text-center w-100 position-relative"
                        style={{ maxWidth: '700px' }}
                    >
                        <div className="text-center mb-4">
                            <h2 className="card-title fs-1 fw-bold mb-3">Game Addiction Assessment</h2>
                            <i className="bi bi-controller display-4 text-secondary"></i>
                        </div>

                        <hr className="border-secondary opacity-75 mb-4" />

                        <p className="fs-4 mb-4 text-light">{questions[currentIndex].question}</p>

                        <div className="d-flex flex-column gap-3">
                            {questions[currentIndex].answers.map((a) => (
                                <button
                                    key={a.id}
                                    className={`option-btn rounded-3 py-3 px-3 fs-5 text-light text-center ${responses[questions[currentIndex].id] === a.score ? "selected" : ""}`}
                                    onClick={() => handleSelect(questions[currentIndex].id, a.score)}
                                >
                                    {a.text}
                                </button>
                            ))}
                        </div>

                        {warning && <div className="text-danger fs-6 mt-3">{warning}</div>}

                        <div className="d-flex justify-content-between mt-4">
                            <button
                                className="nav-btn rounded-pill py-3 px-4 fs-5 fw-semibold text-white border-0"
                                disabled={currentIndex === 0 || isSubmitting}
                                onClick={handleBack}
                            >
                                Back
                            </button>
                            {currentIndex === questions.length - 1 ? (
                                <button 
                                    className="nav-btn rounded-pill py-3 px-4 fs-5 fw-semibold text-white border-0" 
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Submitting...
                                        </>
                                    ) : (
                                        "Submit"
                                    )}
                                </button>
                            ) : (
                                <button className="nav-btn rounded-pill py-3 px-4 fs-5 fw-semibold text-white border-0" onClick={handleNext}>Next</button>
                            )}
                        </div>
                        
                        {isSubmitting && (
                            <motion.div 
                                className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                                style={{
                                    background: 'rgba(28, 36, 47, 0.95)',
                                    borderRadius: '20px',
                                    zIndex: 10
                                }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="text-center">
                                    <div className="spinner-grow text-light" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <p className="mt-3 fs-5 text-light pulsing-text">Calculating your results...</p>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                </AnimatePresence>
            ) : (
                <div className="d-flex justify-content-center">
                    <div className="spinner-border text-light" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <span className="ms-3 text-light">Loading questions...</span>
                </div>
            )}
        </div>
    );
};

export default Survey;