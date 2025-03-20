import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./Login";
import Register from "./Register"; 
import Home from "./Home";
import SelectAgeGroup from "./SelectAgeGroup";
import Survey from "./Survey";

function App() {
    const [ageGroup, setAgeGroup] = useState(null);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/home" element={<Home setAgeGroup={setAgeGroup} />} />
                <Route path="/select-age-group" element={<SelectAgeGroup setAgeGroup={setAgeGroup} />} />
                <Route path="/survey" element={<Survey ageGroup={ageGroup} />} />
            </Routes>
        </Router>
    );
};

export default App;