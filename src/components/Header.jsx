import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <img src={require('../assets/logo.png')} alt="Logo" />
        </div>

        <h1 className="header-title">AUK Quiz Generator</h1>

        <nav className="header-nav">
          <Link to="/quizzes" className="header-link">Quiz List</Link>
          <Link to="/materials" className="header-link">Materials</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
