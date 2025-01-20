import React, { useState, useEffect } from "react";
import QuizCard from "./QuizCard";
import QuizReviewModal from "./QuizReviewModal";
import CustomAlert from "./CustomAlert";
import config from "./config";

import { getAuthToken, getUserEmail } from "./CallbackHandler";
import "./QuizList.css";

const API_URL = `${config.apiUrl}/quizzes`;

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);

  const fetchQuizzes = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        setAlertMessage("Authorization token is missing. Please log in.");
        return;
      }

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Authorization: token,
          "ngrok-skip-browser-warning": "6024",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setQuizzes(data);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      setAlertMessage("Failed to fetch quizzes. Please try again later.");
    }
  };

  useEffect(() => {
    const userEmail = getUserEmail();
    if (!userEmail) {
      setAlertMessage("No user found. Please log in.");
      return;
    }
    fetchQuizzes();
    const interval = setInterval(fetchQuizzes, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleRename = async (quizId) => {
    const newName = prompt("Enter the new name for the quiz:");
    if (!newName) return;

    try {
      const token = getAuthToken();
      if (!token) {
        setAlertMessage("Authorization token is missing. Please log in.");
        return;
      }

      const response = await fetch(`${API_URL}/${quizId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ text: newName }),
      });
      if (!response.ok) throw new Error("Failed to rename quiz");

      setQuizzes((prevQuizzes) =>
        prevQuizzes.map((quiz) =>
          quiz.id === quizId ? { ...quiz, text: newName } : quiz
        )
      );
    } catch (error) {
      console.error("Error renaming quiz:", error);
    }
  };

  const handleDelete = async (quizId) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;

    try {
      const token = getAuthToken();
      if (!token) {
        setAlertMessage("Authorization token is missing. Please log in.");
        return;
      }

      const response = await fetch(`${API_URL}/${quizId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      if (!response.ok) throw new Error("Failed to delete quiz");

      setQuizzes((prevQuizzes) =>
        prevQuizzes.filter((quiz) => quiz.id !== quizId)
      );
    } catch (error) {
      console.error("Error deleting quiz:", error);
    }
  };

  const handleReview = (quizId) => {
    const selected = quizzes.find((quiz) => quiz.id === quizId);
    if (!selected) {
      console.error(`Quiz with ID ${quizId} not found.`);
      return;
    }
    setSelectedQuiz(selected);
  };

  return (
    <div className="quiz-list">
      {alertMessage ? (
        <CustomAlert message={alertMessage} onClose={() => setAlertMessage(null)} />
      ) : (
        <>
          {quizzes.map((quiz) => (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
              onReview={quiz.status !== "processing" ? handleReview : null}
              onRename={handleRename}
              onDelete={handleDelete}
            />
          ))}
          {selectedQuiz && (
            <QuizReviewModal
              quiz={selectedQuiz}
              onClose={() => setSelectedQuiz(null)}
              onSave={(updatedQuiz) => {
                setQuizzes((prevQuizzes) =>
                  prevQuizzes.map((quiz) =>
                    quiz.id === updatedQuiz.id ? updatedQuiz : quiz
                  )
                );
                setSelectedQuiz(null);
              }}
              apiUrl={API_URL}
            />
          )}
        </>
      )}
    </div>
  );
};

export default QuizList;
