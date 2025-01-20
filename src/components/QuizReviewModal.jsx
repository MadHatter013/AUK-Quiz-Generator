import React, { useState, useEffect } from "react";
import "./QuizReviewModal.css";
import { getAuthToken } from "./CallbackHandler";

const QuizReviewModal = ({ quiz, onClose, apiUrl }) => {
  const [questions, setQuestions] = useState(quiz?.questions || []);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (quiz?.questions) {
      setQuestions(quiz.questions);
    }
  }, [quiz]);

  const fetchWithLogs = async (url, options, successCallback) => {
    try {
      const token = getAuthToken();
      if (!token) {
        console.error("Authorization token is missing");
        return;
      }

      options.headers = {
        ...options.headers,
        Authorization: token,
      };

      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      const data = await response.json();
      console.log(`API Response from ${url}:`, data);
      if (successCallback) successCallback(data);
    } catch (error) {
      console.error(`Error in fetch for ${url}:`, error);
    }
  };

  const handleAddQuestion = async () => {
    const newQuestionText = prompt("Enter the text for the new question:");
    if (!newQuestionText) return;

    const url = `${apiUrl}/${quiz.id}/questions`;
    const body = { text: newQuestionText };

    fetchWithLogs(
      url,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
      (newQuestion) => {
        if (!newQuestion.answers) {
          newQuestion.answers = [];
        }
        setQuestions((prev) => [...prev, newQuestion]);
      }
    );
  };

  const handleUpdateQuestion = async (questionIndex) => {
    const question = questions[questionIndex];
    const url = `${apiUrl}/${quiz.id}/questions/${question.id}`;

    fetchWithLogs(
      url,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(question),
      },
      (updatedQuestion) => {
        setQuestions((prev) =>
          prev.map((q, index) =>
            index === questionIndex ? updatedQuestion : q
          )
        );
      }
    );
  };

  const handleDeleteQuestion = async (questionIndex) => {
    const question = questions[questionIndex];
    const url = `${apiUrl}/${quiz.id}/questions/${question.id}`;

    fetchWithLogs(
      url,
      { method: "DELETE" },
      () => {
        setQuestions((prev) => prev.filter((_, index) => index !== questionIndex));
      }
    );
  };

  const handleAddOption = async (questionIndex) => {
    const question = questions[questionIndex];
    const newOptionText = prompt("Enter the text for the new option:");
    if (!newOptionText) return;

    const url = `${apiUrl}/${quiz.id}/questions/${question.id}/answers`;
    const body = { text: newOptionText, correct: false };

    fetchWithLogs(
      url,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
      (newAnswer) => {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].answers.push(newAnswer);
        setQuestions(updatedQuestions);
      }
    );
  };

  const handleUpdateOption = async (questionIndex, optionIndex) => {
    const question = questions[questionIndex];
    const option = question.answers[optionIndex];
    const url = `${apiUrl}/${quiz.id}/questions/${question.id}/answers/${option.id}`;

    fetchWithLogs(
      url,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(option),
      },
      (updatedOption) => {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].answers[optionIndex] = updatedOption;
        setQuestions(updatedQuestions);
      }
    );
  };

  const handleDeleteOption = async (questionIndex, optionIndex) => {
    const question = questions[questionIndex];
    const option = question.answers[optionIndex];
    const url = `${apiUrl}/${quiz.id}/questions/${question.id}/answers/${option.id}`;

    fetchWithLogs(
      url,
      { method: "DELETE" },
      () => {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].answers.splice(optionIndex, 1);
        setQuestions(updatedQuestions);
      }
    );
  };

  return (
    <div className="quiz-review-modal">
      <div className="modal-content">
        <h2 className="modal-title">Review & Edit Quiz</h2>
        <div className="questions-container">
          {questions.map((question, questionIndex) => (
            <div className="question-card" key={question.id}>
              <textarea
                className="question-text"
                value={question.text}
                onChange={(e) => {
                  const updatedQuestions = [...questions];
                  updatedQuestions[questionIndex].text = e.target.value;
                  setQuestions(updatedQuestions);
                }}
                onBlur={() => handleUpdateQuestion(questionIndex)}
              />
              <div className="answers-container">
                {question.answers.map((answer, optionIndex) => (
                  <div className="answer-row" key={answer.id}>
                    <input
                      type="text"
                      className="answer-input"
                      value={answer.text}
                      onChange={(e) => {
                        const updatedQuestions = [...questions];
                        updatedQuestions[questionIndex].answers[optionIndex].text =
                          e.target.value;
                        setQuestions(updatedQuestions);
                      }}
                      onBlur={() => handleUpdateOption(questionIndex, optionIndex)}
                    />
                    <input
                      type="checkbox"
                      checked={answer.correct}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        const updatedQuestions = [...questions];
                        updatedQuestions[questionIndex].answers[optionIndex].correct = isChecked;
                        setQuestions(updatedQuestions);

                        const url = `${apiUrl}/${quiz.id}/questions/${question.id}/answers/${answer.id}`;
                        fetchWithLogs(
                          url,
                          {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ ...answer, correct: isChecked }),
                          },
                          (updatedAnswer) => {
                            const updatedQuestionsFromServer = [...questions];
                            updatedQuestionsFromServer[questionIndex].answers[optionIndex] =
                              updatedAnswer;
                            setQuestions(updatedQuestionsFromServer);
                          }
                        );
                      }}
                    />
                    <button
                      className="delete-option-button"
                      onClick={() => handleDeleteOption(questionIndex, optionIndex)}
                    >
                      ✖
                    </button>
                  </div>
                ))}
                <button
                  className="add-option-button"
                  onClick={() => handleAddOption(questionIndex)}
                >
                  Add Option
                </button>
              </div>
              <button
                className="delete-question-button"
                onClick={() => handleDeleteQuestion(questionIndex)}
              >
                Delete Question
              </button>
            </div>
          ))}
        </div>
        <button className="add-question-button" onClick={handleAddQuestion}>
          Add New Question
        </button>
        <div className="modal-footer">
          <button className="close-modal-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizReviewModal;
