import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Survey.css";

const Survey = ({ ageGroup }) => {
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [responses, setResponses] = useState({});
    const [warning, setWarning] = useState('');
    const [animation, setAnimation] = useState("slide-in-right");
    const navigate = useNavigate();

    useEffect(() => {
        if (ageGroup) {
            axios.get(`http://127.0.0.1:5000/gaming/questions/${ageGroup}`)
                .then((res) => {
                    console.log("Questions fetched:", res.data);
                    setQuestions(res.data);
                })
                .catch((err) => console.error("Error fetching questions:", err.response?.data || err.message));
        }
    }, [ageGroup]);

    const handleSelect = (questionId, score) => {
        setResponses({ ...responses, [questionId]: score });
        setWarning('');
    };

    const handleNext = () => {
        if (responses[questions[currentIndex]?.id] === undefined) {
            setWarning('Please select an option before proceeding.');
        } else {
            setAnimation("slide-out-left");
            setTimeout(() => {
                setCurrentIndex((prev) => prev + 1);
                setAnimation("slide-in-right");
            }, 300);
        }
    };

    const handleBack = () => {
        setAnimation("slide-out-right");
        setTimeout(() => {
            setCurrentIndex((prev) => prev - 1);
            setAnimation("slide-in-left");
        }, 300);
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
            .then((res) => navigate("/result", { state: res.data }))
            .catch((err) => console.error("Submission error:", err.response?.data || err.message));
    };

    return (
        <div className="container d-flex flex-column align-items-center justify-content-center vh-100">
            {questions.length > 0 && currentIndex < questions.length ? (
                <div className={`card text-center p-5 shadow-lg w-75 border-light animate__animated ${animation}`}>
                    <div className="card-body">
                        <h2 className="card-title mb-4 fw-bold">Game Addiction Assessment</h2>
                        <hr className="border-white opacity-50" />
                        <h4 className="mb-4">{questions[currentIndex].question}</h4>

                        <div className="d-grid gap-3">
                            {questions[currentIndex].answers.map((a) => (
                                <button
                                    key={a.id}
                                    className={`btn btn-lg fw-bold py-3 survey-button ${
                                        responses[questions[currentIndex].id] === a.score ? "btn-selected btn-inverted" : "btn-outline-light"
                                    }`}
                                    onClick={() => handleSelect(questions[currentIndex].id, a.score)}
                                >
                                    {a.text}
                                </button>
                            ))}
                        </div>

                        {warning && <div className="warning mt-3" aria-live="polite">{warning}</div>}

                        <div className="d-flex justify-content-between mt-4">
                            <button className="btn nav-button px-4 py-2" disabled={currentIndex === 0} onClick={handleBack}>
                                Back
                            </button>
                            {currentIndex === questions.length - 1 ? (
                                <button className="btn nav-button px-4 py-2" onClick={handleSubmit}>Submit</button>
                            ) : (
                                <button className="btn nav-button px-4 py-2" onClick={handleNext}>
                                    Next
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <h4>Loading questions...</h4>
            )}
        </div>
    );
};

export default Survey;
