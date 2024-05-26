import React, { useState } from "react";
import { Quiz, Question } from "../types";

interface QuizTakerProps {
  quiz: Quiz;
  onComplete: (results: any) => void;
}

const QuizTaker: React.FC<QuizTakerProps> = ({ quiz, onComplete }) => {
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (questionId: string, value: string) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    const score = quiz.questions.reduce((acc, question) => {
      if (question.type === "multiple-choice") {
        if (answers[question.id] === question.correctOption) {
          return acc + question.points;
        }
      } else if (question.type === "text") {
        if (
          answers[question.id]?.trim().toLowerCase() ===
          question.correctOption?.trim().toLowerCase()
        ) {
          return acc + question.points;
        }
      }
      return acc;
    }, 0);

    onComplete({ score, answers });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">{quiz.name}</h1>
      <form onSubmit={handleSubmit}>
        {quiz.questions.map((question, idx) => (
          <div key={question.id} className="border p-4 rounded mb-2">
            <label className="block text-sm font-medium">
              Question {idx + 1}
            </label>
            <p className="mb-2">{question.text}</p>
            {question.type === "multiple-choice" ? (
              <div>
                {question.options?.map((option, optIdx) => (
                  <div key={optIdx} className="flex items-center mb-1">
                    <input
                      type="radio"
                      name={question.id}
                      value={option}
                      checked={answers[question.id] === option}
                      onChange={() => handleChange(question.id, option)}
                    />
                    <span className="ml-2">{option}</span>
                  </div>
                ))}
              </div>
            ) : (
              <input
                type="text"
                className="border rounded px-2 py-1 mb-2 w-full"
                value={answers[question.id] || ""}
                onChange={(e) => handleChange(question.id, e.target.value)}
              />
            )}
          </div>
        ))}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
        >
          Submit
        </button>
      </form>
      {submitted && (
        <div className="mt-4">
          <h2 className="text-xl font-bold">Results</h2>
          <p>
            Your score:{" "}
            {quiz.questions.reduce((acc, question) => {
              if (question.type === "multiple-choice") {
                if (answers[question.id] === question.correctOption) {
                  return acc + question.points;
                }
              } else if (question.type === "text") {
                if (
                  answers[question.id]?.trim().toLowerCase() ===
                  question.correctOption?.trim().toLowerCase()
                ) {
                  return acc + question.points;
                }
              }
              return acc;
            }, 0)}
          </p>
        </div>
      )}
    </div>
  );
};

export default QuizTaker;
