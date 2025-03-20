import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SelectAgeGroup.css"; // Import the custom CSS file

const SelectAgeGroup = ({ setAgeGroup }) => {
    const navigate = useNavigate();
    const [age, setAge] = useState(20); // Default age
    const [warning, setWarning] = useState("");

    const determineAgeGroup = (age) => {
        if (age >= 15 && age <= 20) return "15-20";
        if (age >= 21 && age <= 30) return "21-30";
        if (age >= 31 && age <= 50) return "31-50";
        return "51+";
    };

    const handleNext = () => {
        if (!age) {
            setWarning("Please select an age before proceeding.");
        } else {
            const selectedAgeGroup = determineAgeGroup(age);
            setAgeGroup(selectedAgeGroup);
            navigate("/survey");
        }
    };

    return (
        <div className="container text-center mt-5 select-age-group-container">
            <h2 className="mb-4">Select Your Age</h2>
            <p>Use the slider to select your age:</p>

            {/* Age Slider */}
            <input
                type="range"
                min="15"
                max="80"
                value={age}
                className="form-range age-slider"
                onChange={(e) => setAge(parseInt(e.target.value))}
            />
            <p className="mt-2">Selected Age: <strong>{age}</strong></p>

            {warning && <div className="warning mt-3">{warning}</div>}

            <button className="btn btn-primary mt-4" onClick={handleNext}>
                Next
            </button>
        </div>
    );
};

export default SelectAgeGroup;