import React, { useState, useEffect } from "react";
import QuizList from "./components/QuizList";
import QuizEditor from "./components/QuizEditor";
import QuizTaker from "./components/QuizTaker";
import ResultViewer from "./components/ResultViewer";
import { Quiz } from "./types";
import { getQuizzes, saveQuiz } from "./quizService";

const App: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [takingQuiz, setTakingQuiz] = useState<Quiz | null>(null);
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    getQuizzes().then(setQuizzes);
  }, []);

  const handleCreateQuiz = (name: string) => {
    const newQuiz = { id: Date.now().toString(), name, questions: [] };
    setEditingQuiz(newQuiz);
  };

  const handleSaveQuiz = (quiz: Quiz) => {
    saveQuiz(quiz).then(() => {
      setEditingQuiz(null);
      getQuizzes().then(setQuizzes);
    });
  };

  return (
    <div className="container mx-auto p-4">
      {!editingQuiz && !takingQuiz && !results && (
        <QuizList
          onCreate={handleCreateQuiz}
          onEdit={(quiz) => setEditingQuiz(quiz)}
          onTake={(quiz) => setTakingQuiz(quiz)}
        />
      )}
      {editingQuiz && (
        <QuizEditor
          quiz={editingQuiz}
          onSave={() => handleSaveQuiz(editingQuiz)}
        />
      )}
      {takingQuiz && (
        <QuizTaker
          quiz={takingQuiz}
          onComplete={(res) => {
            setResults(res);
            setTakingQuiz(null);
          }}
        />
      )}
      {results && <ResultViewer results={results} />}
    </div>
  );
};

export default App;
