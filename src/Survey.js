import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Survey.css";

const Survey = ({ ageGroup }) => {
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [responses, setResponses] = useState({});
    const [warning, setWarning] = useState('');
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
        const totalScore = Object.values(responses).reduce((acc, score) => acc + score, 0);
        const surveyData = {
            ageGroup,
            responses: Object.entries(responses).map(([id, score]) => ({ question_id: id, score })),
            totalScore,
            date: new Date().toISOString(),
        };
    
        axios.post("http://127.0.0.1:5000/submit", surveyData)
            .then((res) => {
                // Apply exit animation before navigating
                navigate("/result", { state: res.data });
            })
            .catch((err) => console.error("Submission error:", err.response?.data || err.message));
    };
    

    return (
        <div className="survey-container">
            {questions.length > 0 && currentIndex < questions.length ? (
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 50, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -50, scale: 0.9 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="survey-card"
                    >
                        <h2 className="card-title">Game Addiction Assessment</h2>
                        <p className="question-text">{questions[currentIndex].question}</p>
                        <div className="options-container">
                            {questions[currentIndex].answers.map((a) => (
                                <button
                                    key={a.id}
                                    className={`option-btn ${responses[questions[currentIndex].id] === a.score ? "selected" : ""}`}
                                    onClick={() => handleSelect(questions[currentIndex].id, a.score)}
                                >
                                    {a.text}
                                </button>
                            ))}
                        </div>
                        {warning && <div className="warning">{warning}</div>}
                        <div className="navigation">
                            <button
                                className="btn btn-secondary"
                                disabled={currentIndex === 0}
                                onClick={handleBack}
                            >
                                Back
                            </button>
                            {currentIndex === questions.length - 1 ? (
                                <button className="btn btn-secondary" onClick={handleSubmit}>Submit</button>
                            ) : (
                                <button className="btn btn-secondary" onClick={handleNext}>Next</button>
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>
            ) : (
                <h4>Loading questions...</h4>
            )}
        </div>
    );
};

export default Survey;