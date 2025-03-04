import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Login.css"; // Custom styles

const Login = () => {
    const navigate = useNavigate(); // ✅ Initialize useNavigate

    const goToNewPage = () => {
        navigate("/Register");
    };

    return (
        <div className="container-fluid d-flex flex-column align-items-center justify-content-center ">
      <header className="d-flex justify-content-between w-100 p-3">
        <h4 className="mb-5 fw-bold">Game Addiction Control</h4>
      </header>
            <div className="d-flex justify-content-center align-items-center w-100">
        <div className="register-info me-5">
          <h2 className="fw-bold">Login</h2>
          <p>Sign In now to be a part of our healthy gaming community</p>
        </div>
                <form className="login-box text-center p-4 shadow rounded bg-white ">
                    <div className="mb-3">
                        <label className="form-label d-flex justify-content-between ">Email</label>
                        <input type="email" className="form-control" placeholder="Enter your email" />
                    </div>
                    <div className="mb-3">
                        <label className="form-label d-flex justify-content-between">Password</label>
                        <input type="password" className="form-control" placeholder="Enter your password" />
                    </div>
                    <div className="text-start mb-3">
                        <a href="#" className="text-decoration-none">Forgot password?</a>
                    </div>
                    <div className="d-flex justify-content-between">
                        <button onClick={goToNewPage} type="button" className="btn btn-outline-dark w-45">Sign Up</button>
                        <button type="submit" className="btn btn-dark w-45">Log In</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
