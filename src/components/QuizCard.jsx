import React, { useState } from "react";
import "./QuizCard.css";
import config from "./config";

const QuizCard = ({ quiz, onRename, onDelete, onReview }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleDownloadQti = (url) => {
    if (!url) {
      alert("Download link not available.");
      return;
    }
    const adjustedUrl = url.startsWith("http://localhost:3000/")
      ? url.replace("http://localhost:3000/", `${config.apiUrl}/`)
      : url;

    window.open(adjustedUrl, "_blank");
  };

  const handleDownloadJson = () => {
    const quizData = JSON.stringify(quiz, null, 2);
    const blob = new Blob([quizData], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${quiz.text || "quiz"}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadTxt = () => {
    const txtData = `
Quiz Name: ${quiz.text || "Unnamed Quiz"}
Status: ${quiz.status}

Questions and Answers:
${quiz.questions
  .map(
    (q, index) => `
${index + 1}. ${q.text}
${q.answers
  .map(
    (a, answerIndex) =>
      `   ${answerIndex + 1}. ${a.text} ${a.correct ? "(Correct)" : "(Incorrect)"}`
  )
  .join("\n")}`
  )
  .join("\n")}`;

    const blob = new Blob([txtData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${quiz.text || "quiz"}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="quiz-card">
      <h3>{quiz.text}</h3>
      <div className={`status ${quiz.status.toLowerCase()}`}>
        {quiz.status.charAt(0).toUpperCase() + quiz.status.slice(1)}
      </div>
      <div className="buttons">
        {quiz.status === "done" && (
          <button className="review" onClick={() => onReview(quiz.id)}>
            Review & Edit
          </button>
        )}
        <button className="rename" onClick={() => onRename(quiz.id)}>
          Rename
        </button>
        <button className="delete" onClick={() => onDelete(quiz.id)}>
          Delete
        </button>
        {quiz.status === "done" && (
          <div className="dropdown">
            <button
              className={`download ${isMenuOpen ? "active" : ""}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              Download ▼
            </button>
            {isMenuOpen && (
              <div className="dropdown-menu">
                <button onClick={() => handleDownloadQti(quiz.qti_package_url)}>
                  QTI
                </button>
                <button onClick={handleDownloadJson}>JSON</button>
                <button onClick={handleDownloadTxt}>TXT</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizCard;
