import React from "react";
import { Quiz } from "../types";

interface QuizListProps {
  quizzes: Quiz[];
  onCreate: (name: string) => void;
  onEdit: (quiz: Quiz) => void;
  onTake: (quiz: Quiz) => void;
  onDelete: (id: string) => void;
}

const QuizList: React.FC<QuizListProps> = ({
  quizzes,
  onCreate,
  onEdit,
  onTake,
  onDelete,
}) => {
  const [newQuizName, setNewQuizName] = React.useState("");

  const handleCreate = () => {
    if (newQuizName.trim() !== "") {
      onCreate(newQuizName);
      setNewQuizName("");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Quizzes</h1>
      <input
        type="text"
        className="border rounded px-2 py-1 mr-2"
        value={newQuizName}
        onChange={(e) => setNewQuizName(e.target.value)}
        placeholder="New quiz name"
      />
      <button
        onClick={handleCreate}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Create Quiz
      </button>
      <ul>
        {quizzes.map((quiz: Quiz) => (
          <li key={quiz.id} className="mt-2">
            <span className="font-semibold">{quiz.name}</span>
            <button
              onClick={() => onEdit(quiz)}
              className="bg-yellow-500 text-white px-2 py-1 rounded ml-2"
            >
              Edit
            </button>
            <button
              onClick={() => onTake(quiz)}
              className="bg-blue-500 text-white px-2 py-1 rounded ml-2"
            >
              Take
            </button>
            <button
              onClick={() => onDelete(quiz.id)}
              className="bg-red-500 text-white px-2 py-1 rounded ml-2"
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
