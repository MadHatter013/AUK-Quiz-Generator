import React from 'react';
import { Link } from 'react-router-dom';
import { getUserEmail } from './CallbackHandler'; // Импорт функции для получения email
import './Header.css';

const Header = () => {
  const userEmail = getUserEmail(); // Получаем email из sessionStorage

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

        {/* Отображение email пользователя, если он доступен */}
        {userEmail && <div className="header-user-email">{userEmail}</div>}
      </div>
    </header>
  );
};

export default Header;
