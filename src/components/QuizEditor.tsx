import React, { useState, useEffect } from "react";
import { Quiz, Question } from "../types";
import { saveQuiz, getQuizzes } from "../quizService";

interface QuizEditorProps {
  quiz?: Quiz;
  onSave: () => void;
}

const QuizEditor: React.FC<QuizEditorProps> = ({ quiz, onSave }) => {
  const [name, setName] = useState(quiz?.name || "");
  const [questions, setQuestions] = useState<Question[]>(quiz?.questions || []);
  const [error, setError] = useState<string | null>(null);
  const [questionError, setQuestionError] = useState<string | null>(null);

  useEffect(() => {
    if (quiz) {
      setName(quiz.name);
      setQuestions(quiz.questions);
    }
  }, [quiz]);

  const handleSave = () => {
    if (name.trim() === "") {
      setError("Quiz name cannot be empty");
      return;
    }
    setError(null);

    for (let question of questions) {
      if (question.text.trim() === "") {
        setError("All questions must have text");
        return;
      }
      if (question.type === "multiple-choice") {
        if (
          !question.options ||
          question.options.some((opt) => opt.trim() === "")
        ) {
          setError(
            "All options must be non-empty for multiple-choice questions"
          );
          return;
        }
        if (
          !question.correctOption ||
          !question.options.includes(question.correctOption)
        ) {
          setError(
            "Correct option must be one of the options for multiple-choice questions"
          );
          return;
        }
      }
    }

    const newQuiz = { id: quiz?.id || Date.now().toString(), name, questions };

    getQuizzes().then((existingQuizzes) => {
      const updatedQuizzes = existingQuizzes.map((q) =>
        q.id === newQuiz.id ? newQuiz : q
      );
      if (!existingQuizzes.find((q) => q.id === newQuiz.id)) {
        updatedQuizzes.push(newQuiz);
      }
      localStorage.setItem("quizzes", JSON.stringify(updatedQuizzes));
      onSave();
    });
  };

  const addQuestion = (
    newQuestionText: string,
    newType: "text" | "multiple-choice",
    newOptions: string[],
    newCorrectOption: string,
    newPoints: number
  ) => {
    if (newQuestionText.trim() === "") {
      setQuestionError("Question text cannot be empty");
      return;
    }
    if (newType === "multiple-choice") {
      if (
        newOptions.length === 0 ||
        newOptions.some((opt) => opt.trim() === "")
      ) {
        setQuestionError("All options must be non-empty");
        return;
      }
      if (!newOptions.includes(newCorrectOption)) {
        setQuestionError("Correct option must be one of the options");
        return;
      }
    }
    setQuestionError(null);
    const newQuestions = [
      ...questions,
      {
        id: Date.now().toString(),
        text: newQuestionText,
        type: newType,
        options: newType === "multiple-choice" ? newOptions : undefined,
        correctOption:
          newType === "multiple-choice" ? newCorrectOption : undefined,
        points: newPoints,
      },
    ];
    setQuestions(newQuestions);
  };

  const removeQuestion = (id: string) => {
    const newQuestions = questions.filter((q) => q.id !== id);
    setQuestions(newQuestions);
  };

  const handleQuestionChange = (id: string, text: string) => {
    const newQuestions = questions.map((q) =>
      q.id === id ? { ...q, text } : q
    );
    setQuestions(newQuestions);
  };

  const handleOptionChange = (
    questionId: string,
    optionIndex: number,
    text: string
  ) => {
    const newQuestions = questions.map((q) =>
      q.id === questionId
        ? {
            ...q,
            options: q.options?.map((opt, idx) =>
              idx === optionIndex ? text : opt
            ),
          }
        : q
    );
    setQuestions(newQuestions);
  };

  const addOption = (questionId: string) => {
    const newQuestions = questions.map((q) =>
      q.id === questionId ? { ...q, options: [...(q.options || []), ""] } : q
    );
    setQuestions(newQuestions);
  };

  const setCorrectOption = (questionId: string, option: string) => {
    const newQuestions = questions.map((q) =>
      q.id === questionId ? { ...q, correctOption: option } : q
    );
    setQuestions(newQuestions);
  };

  const handlePointsChange = (questionId: string, points: number) => {
    const newQuestions = questions.map((q) =>
      q.id === questionId ? { ...q, points } : q
    );
    setQuestions(newQuestions);
  };

  const [newQuestionText, setNewQuestionText] = useState("");
  const [newType, setNewType] = useState<"text" | "multiple-choice">("text");
  const [newOptions, setNewOptions] = useState<string[]>([""]);
  const [newCorrectOption, setNewCorrectOption] = useState("");
  const [newPoints, setNewPoints] = useState(1);

  const handleNewOptionChange = (index: number, value: string) => {
    const updatedOptions = [...newOptions];
    updatedOptions[index] = value;
    setNewOptions(updatedOptions);
  };

  const addNewOption = () => {
    setNewOptions([...newOptions, ""]);
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    addQuestion(
      newQuestionText,
      newType,
      newOptions,
      newCorrectOption,
      newPoints
    );
    setNewQuestionText("");
    setNewType("text");
    setNewOptions([""]);
    setNewCorrectOption("");
    setNewPoints(1);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">
        {quiz ? "Edit Quiz" : "Create New Quiz"}
      </h1>
      <div>
        <label className="block text-sm font-medium">Quiz Name</label>
        <input
          className="border rounded px-2 py-1"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {error && <p className="text-red-500">{error}</p>}
      </div>
      <div>
        <h2 className="text-xl font-semibold mt-4">Questions</h2>
        {questions.map((question, idx) => (
          <div key={question.id} className="border p-4 rounded mb-2">
            <label className="block text-sm font-medium">
              Question {idx + 1}
            </label>
            <input
              className="border rounded px-2 py-1 mb-2"
              value={question.text}
              onChange={(e) =>
                handleQuestionChange(question.id, e.target.value)
              }
            />
            {question.type === "multiple-choice" && (
              <div>
                {question.options?.map((option, optIdx) => (
                  <div key={optIdx} className="flex items-center mb-1">
                    <input
                      className="border rounded px-2 py-1 flex-grow"
                      value={option}
                      onChange={(e) =>
                        handleOptionChange(question.id, optIdx, e.target.value)
                      }
                    />
                    <input
                      type="radio"
                      name={`correct-${question.id}`}
                      checked={question.correctOption === option}
                      onChange={() => setCorrectOption(question.id, option)}
                    />
                  </div>
                ))}
                <button
                  onClick={() => addOption(question.id)}
                  className="bg-gray-500 text-white px-2 py-1 rounded"
                >
                  Add Option
                </button>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mt-2">Points</label>
              <input
                type="number"
                className="border rounded px-2 py-1"
                value={question.points}
                onChange={(e) =>
                  handlePointsChange(question.id, parseInt(e.target.value))
                }
              />
            </div>
            <button
              onClick={() => removeQuestion(question.id)}
              className="bg-red-500 text-white px-2 py-1 rounded mt-2"
            >
              Remove Question
            </button>
          </div>
        ))}
        {questionError && <p className="text-red-500">{questionError}</p>}
        <form onSubmit={handleAddQuestion}>
          <div className="border p-4 rounded mb-2">
            <label className="block text-sm font-medium">New Question</label>
            <input
              className="border rounded px-2 py-1 mb-2"
              value={newQuestionText}
              onChange={(e) => setNewQuestionText(e.target.value)}
            />
            <label className="block text-sm font-medium">Type</label>
            <select
              className="border rounded px-2 py-1 mb-2"
              value={newType}
              onChange={(e) =>
                setNewType(e.target.value as "text" | "multiple-choice")
              }
            >
              <option value="text">Text</option>
              <option value="multiple-choice">Multiple Choice</option>
            </select>
            {newType === "multiple-choice" && (
              <div>
                {newOptions.map((option, idx) => (
                  <div key={idx} className="flex items-center mb-1">
                    <input
                      className="border rounded px-2 py-1 flex-grow"
                      value={option}
                      onChange={(e) =>
                        handleNewOptionChange(idx, e.target.value)
                      }
                    />
                    <input
                      type="radio"
                      name="newCorrectOption"
                      checked={newCorrectOption === option}
                      onChange={() => setNewCorrectOption(option)}
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addNewOption}
                  className="bg-gray-500 text-white px-2 py-1 rounded"
                >
                  Add Option
                </button>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mt-2">Points</label>
              <input
                type="number"
                className="border rounded px-2 py-1"
                value={newPoints}
                onChange={(e) => setNewPoints(parseInt(e.target.value))}
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
            >
              Add Question
            </button>
          </div>
        </form>
      </div>
      <button
        onClick={handleSave}
        className="bg-green-500 text-white px-4 py-2 rounded mt-4"
      >
        Save Quiz
      </button>
    </div>
  );
};

export default QuizEditor;
