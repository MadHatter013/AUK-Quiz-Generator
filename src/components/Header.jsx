import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUserEmail, getAuthToken } from "./CallbackHandler";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const userEmail = getUserEmail();
  const authToken = getAuthToken();

  const handleLogout = () => {
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("userEmail");

    window.location.href = "https://e3f1-185-223-114-81.ngrok-free.app/auth";
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <div className="header-logo">
            <img src={require("../assets/logo.png")} alt="Logo" />
          </div>
          <h1 className="header-title">AUK Quiz Generator</h1>
        </div>
        <nav className="header-nav">
          <Link to="/quizzes" className="header-link">Quiz List</Link>
          <Link to="/materials" className="header-link">Materials</Link>
        </nav>
        <div className="header-right">
          {userEmail && <div className="header-user-email">{userEmail}</div>}
          {(userEmail || authToken) && (
            <button className="header-logout-button" onClick={handleLogout}>
              Log out
            </button>
          )}
        </div>
      </div>
    </header>

  );
};

export default Header;
