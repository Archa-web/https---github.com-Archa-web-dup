import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./Login";
import Register from "./Register";
import Home from "./Home";
import SelectAgeGroup from "./SelectAgeGroup";
import Survey from "./Survey";
import Result from "./Result";
import Recommendation from './Recommendation';



function App() {
    const [ageGroup, setAgeGroup] = useState(null);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/select-age-group" element={<SelectAgeGroup setAgeGroup={setAgeGroup} />} />
                <Route path="/survey" element={<Survey ageGroup={ageGroup} />} />
                <Route path="/result" element={<Result />} />
                <Route path="/recommendation" element={<Recommendation />} />
                </Routes>
        </Router>
    );
};

export default App;