import React, { useState } from "react";
import "./QuizGenerator.css";
import CustomAlert from "./CustomAlert";
import "./CustomAlert.css";

const QuizGenerator = ({ selectedMaterials }) => {
  const [quizName, setQuizName] = useState("Japan 13");
  const [materialText, setMaterialText] = useState("*");
  const [questionsNumber, setQuestionsNumber] = useState(10);
  const [answersNumber, setAnswersNumber] = useState(5);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    const requestPayload = {
      text: quizName,
      material: materialText,
      questions_number: questionsNumber,
      answers_number: answersNumber,
      material_ids: selectedMaterials,
    };
  
    try {
      const response = await fetch("https://quality-owl-simply.ngrok-free.app/quizzes/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJleHAiOjE3MzcwMjYwMjV9.S2JTLy91iQaZ3Ky6TD8glscRD2BdomubLsYQvdXRNJM`,
          "ngrok-skip-browser-warning": "6024",
        },
        body: JSON.stringify(requestPayload),
      });
  
      if (!response.ok) {
        const errorText = await response.text(); 
        throw new Error(`Failed to generate quiz: ${errorText}`);
      }
  
      const result = await response.json(); 
      console.log("Quiz generated successfully:", result);
  
      CustomAlert("Quiz generation request sent successfully!");
    } catch (error) {
      console.error("Error sending request:", error);
      CustomAlert("Failed to send quiz generation request. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="quiz-generator">
      <form onSubmit={handleSubmit} className="quiz-generator-form">
        <h2>Generate a Quiz</h2>
        <label>
          Quiz Name:
          <input
            type="text"
            value={quizName}
            onChange={(e) => setQuizName(e.target.value)}
            required
          />
        </label>
        <label>
          Material Text:
          <textarea
            value={materialText}
            onChange={(e) => setMaterialText(e.target.value)}
            required
          ></textarea>
        </label>
        <label>
          Number of Questions:
          <input
            type="number"
            value={questionsNumber}
            onChange={(e) => setQuestionsNumber(Number(e.target.value))}
            min="1"
            required
          />
        </label>
        <label>
          Number of Answer Options:
          <input
            type="number"
            value={answersNumber}
            onChange={(e) => setAnswersNumber(Number(e.target.value))}
            min="2"
            required
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Sending Request..." : "Generate Quiz"}
        </button>
      </form>
    </div>
  );
};

export default QuizGenerator;
