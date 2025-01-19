import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import QuizList from "./components/QuizList";
import Materials from "./components/Materials";
import Header from "./components/Header";
import MicrosoftAuth from "./components/MicrosoftAuth";
import CallbackHandler from "./components/CallbackHandler";

import "./App.css";

const App = () => {
  return (
    <Router>
      <Header />
      <main>
        <Routes>
          {/* <Route path="/" element={<Navigate to="/quizzes" replace />} /> */}
          <Route path="/quizzes" element={<QuizList />} />
          <Route path="/materials" element={<Materials />} />
          <Route path="/auth" element={<MicrosoftAuth />} />
          <Route path="/auth/microsoft_graph/callback" element={<CallbackHandler />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
