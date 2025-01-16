import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import QuizList from "./components/QuizList";
import Materials from "./components/Materials";
import Header from "./components/Header"; // Импортируем Header
import "./App.css";

const App = () => {
  return (
    <Router>
      <Header /> {/* Добавляем Header */}
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/quizzes" replace />} />
          <Route path="/quizzes" element={<QuizList />} />
          <Route path="/materials" element={<Materials />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
