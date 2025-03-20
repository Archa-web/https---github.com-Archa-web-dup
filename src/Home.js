import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css'; // Import the custom CSS file

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="container text-center mt-5 home-container">
            <h1 className="mb-4">GameAware</h1>
            <p className="lead">
                Welcome to GameAware, a platform dedicated to helping you understand your gaming habits.
            </p>
            <p className="motive">
                Our mission is to provide you with insights into your gaming behavior and help you maintain a healthy balance between gaming and other aspects of your life. 
                The assessment is based on the criteria defined by the DSM-5 (Diagnostic and Statistical Manual of Mental Disorders, Fifth Edition). 
                Answer the questions honestly to get an accurate assessment of your gaming habits.
            </p>
            <button className="btn btn-lg btn-primary mt-4" onClick={() => navigate("/select-age-group")}>
                Continue
            </button>
        </div>
    );
};

export default Home;