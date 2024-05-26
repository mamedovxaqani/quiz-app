import { Quiz } from "./types";

export const getQuizzes = (): Promise<Quiz[]> => {
  return new Promise((resolve) => {
    const quizzes = JSON.parse(localStorage.getItem("quizzes") || "[]");
    setTimeout(() => resolve(quizzes), 500);
  });
};

export const saveQuiz = (quiz: Quiz): Promise<void> => {
  return new Promise((resolve) => {
    const quizzes = JSON.parse(localStorage.getItem("quizzes") || "[]");
    const index = quizzes.findIndex((q: Quiz) => q.id === quiz.id);
    if (index >= 0) {
      quizzes[index] = quiz;
    } else {
      quizzes.push(quiz);
    }
    localStorage.setItem("quizzes", JSON.stringify(quizzes));
    setTimeout(() => resolve(), 500);
  });
};

export const deleteQuiz = (id: string): Promise<void> => {
  return new Promise((resolve) => {
    const quizzes = JSON.parse(localStorage.getItem("quizzes") || "[]");
    const filtered = quizzes.filter((q: Quiz) => q.id !== id);
    localStorage.setItem("quizzes", JSON.stringify(filtered));
    setTimeout(() => resolve(), 500);
  });
};
