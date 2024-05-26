import React, { useState, useEffect } from "react";
import { Quiz } from "../types";
import { getQuizzes, deleteQuiz } from "../quizService";

interface QuizListProps {
  onCreate: (name: string) => void;
  onEdit: (quiz: Quiz) => void;
  onTake: (quiz: Quiz) => void;
}

const QuizList: React.FC<QuizListProps> = ({ onCreate, onEdit, onTake }) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newQuizName, setNewQuizName] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getQuizzes().then(setQuizzes);
  }, []);

  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    if (newQuizName.trim() === "") {
      setError("Quiz name cannot be empty");
    } else {
      setError(null);
      onCreate(newQuizName);
      setNewQuizName("");
    }
  };

  const handleDelete = (id: string) => {
    deleteQuiz(id).then(() => {
      setQuizzes(quizzes.filter((quiz) => quiz.id !== id));
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Available Quizzes</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search quizzes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded px-2 py-1"
        />
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter new quiz name"
          value={newQuizName}
          onChange={(e) => setNewQuizName(e.target.value)}
          className="border rounded px-2 py-1 mr-2"
        />
        <button
          onClick={handleCreate}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add New Quiz
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </div>
      <ul>
        {filteredQuizzes.map((quiz) => (
          <li key={quiz.id} className="border p-4 rounded mb-2">
            <h2 className="text-lg font-semibold">{quiz.name}</h2>
            <button
              onClick={() => onEdit(quiz)}
              className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
            >
              Edit
            </button>
            <button
              onClick={() => onTake(quiz)}
              className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            >
              Take
            </button>
            <button
              onClick={() => handleDelete(quiz.id)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuizList;
