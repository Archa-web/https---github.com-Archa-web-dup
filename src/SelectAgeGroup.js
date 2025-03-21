import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SelectAgeGroup.css";

const SelectAgeGroup = ({ setAgeGroup }) => {
    const navigate = useNavigate();
    const [age, setAge] = useState("");
    const [warning, setWarning] = useState("");

    useEffect(() => {
        if (age !== "") setWarning("");
    }, [age]);

    const determineAgeGroup = (age) => {
        if (age >= 15 && age <= 20) return "15-20";
        if (age >= 21 && age <= 30) return "21-30";
        if (age >= 31 && age <= 50) return "31-50";
        return "51+";
    };

    const handleNext = () => {
        if (age === "") {
            setWarning("Please enter your age before proceeding.");
        } else if (age < 15) {
            setWarning("Age must be 15 or older to proceed.");
        } else if (age < 0) {
            setWarning("Age cannot be negative.");
        } else if (age > 90){
            setWarning("Age cannot be greater than 90.");
        } else {
            const selectedAgeGroup = determineAgeGroup(age);
            setAgeGroup(selectedAgeGroup);
            navigate("/Survey");
        }
    };

    return (
        <div className="container d-flex flex-column align-items-center justify-content-center vh-100">
            <div className="card p-5 shadow-lg w-50 text-center">
                <h2 className="mb-4 text-primary fw-bold">Enter Your Age</h2>
                <p className="text-secondary">Please enter your age:</p>

                {/* Age Input Field */}
                <input
                    type="number"
                    min="0"
                    className="form-control text-center"
                    value={age}
                    onChange={(e) => setAge(e.target.value ? parseInt(e.target.value) : "")}
                />

                {/* Display Real-Time Age Group */}
                {age >= 15 && (
                    <p className="text-muted mt-2">
                        Age Group: <strong className="text-warning">{determineAgeGroup(age)}</strong>
                    </p>
                )}

                {/* Warning Message */}
                {warning && <div className="warning mt-3">{warning}</div>}

                {/* Action Buttons */}
                <div className="d-flex justify-content-center mt-4 gap-3">
                    <button className="btn btn-secondary" onClick={() => navigate(-1)}>
                        Back
                    </button>
                    <button className="btn btn-secondary" onClick={handleNext}>
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SelectAgeGroup;