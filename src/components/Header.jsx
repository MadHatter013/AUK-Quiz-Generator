import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Header.css";
import config from "./config";

const Header = () => {
  const location = useLocation();
  const [userEmail, setUserEmail] = useState(sessionStorage.getItem("userEmail") || "");
  const [authToken, setAuthToken] = useState(sessionStorage.getItem("authToken") || "");

  const handleLogout = () => {
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("userEmail");
    window.location.href = `${config.baseUrl}/auth`;
  };

  const handleLogin = () => {
    window.location.href = `${config.baseUrl}/auth`;
  };

  useEffect(() => {
    setUserEmail(sessionStorage.getItem("userEmail") || "");
    setAuthToken(sessionStorage.getItem("authToken") || "");
  }, [location]);

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
          {userEmail || authToken ? (
            <button className="header-logout-button" onClick={handleLogout}>
              Log out
            </button>
          ) : (
            <button className="header-login-button" onClick={handleLogin}>
              Log in
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
