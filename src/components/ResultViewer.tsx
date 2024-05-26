import React from "react";

interface ResultViewerProps {
  results: {
    question: string;
    answer: string;
    correct: boolean;
    points: number;
  }[];
}

const ResultViewer: React.FC<ResultViewerProps> = ({ results }) => {
  const totalPoints = results.reduce((sum, result) => sum + result.points, 0);

  return (
    <div>
      <h1 className="text-2xl font-bold">Quiz Results</h1>
      <ul>
        {results.map((result, idx) => (
          <li key={idx} className="mb-2">
            <h2 className="text-xl">{result.question}</h2>
            <p>Your answer: {result.answer}</p>
            <p>
              {result.correct ? "Correct!" : "Wrong!"} ({result.points} points)
            </p>
          </li>
        ))}
      </ul>
      <h2 className="text-xl font-bold">Total Points: {totalPoints}</h2>
    </div>
  );
};

export default ResultViewer;
