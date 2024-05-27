import React from "react";

interface ResultViewerProps {
  results: any;
}

const ResultViewer: React.FC<ResultViewerProps> = ({ results }) => {
  return (
    <div>
      <h1 className="text-2xl font-bold">Quiz Results</h1>
      <p>Score: {results.score}</p>
      <button
        onClick={() => window.location.reload()}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
      >
        Take another quiz
      </button>
    </div>
  );
};

export default ResultViewer;
