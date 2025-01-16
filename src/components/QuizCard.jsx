import React from "react";
import "./QuizCard.css";

const QuizCard = ({ quiz, onRename, onDelete, onReview }) => {
  const handleDownload = (url) => {
    if (!url) {
      alert("Download link not available.");
      return;
    }
    // Подменяем localhost на ngrok URL
    const adjustedUrl = url.startsWith("http://localhost:3000/")
      ? url.replace("http://localhost:3000/", "https://quality-owl-simply.ngrok-free.app/")
      : url;

    window.open(adjustedUrl, "_blank");
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
        {quiz.status === "done" && quiz.qti_package_url ? (
          <button
            className="download"
            onClick={() => handleDownload(quiz.qti_package_url)}
          >
            Download
          </button>
        ) : quiz.status === "done" ? (
          <div className="no-download">No download available</div>
        ) : null}
      </div>
    </div>
  );
};

export default QuizCard;
