"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ResultItem {
  question: string;
  userAnswer: number;
  correctAnswer: number;
  result:boolean;
}

interface GameResult {
  totalQuestions: number;
  score: number;
  results: ResultItem[];
}

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<GameResult | null>(null);

  useEffect(() => {
    const storedResult = localStorage.getItem("gameResult");
    if (!storedResult) {
      router.push("/home");
      return;
    }
    setResult(JSON.parse(storedResult));
  }, []);

  if (!result) return <p>Loading results...</p>;

  return (
    <div style={{ maxWidth: 600, margin: "50px auto" }}>
      <h2>Game Results</h2>
      <p>
        Score: {result.score} / {result.totalQuestions}
      </p>

      <div>
        {result.results.map((item, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ccc",
              padding: 10,
              marginBottom: 10,
              borderRadius: 5,
              backgroundColor: item.result === true ? "#d4edda" : "#f8d7da",
            }}
          >
            <p>
              <strong>Q{index + 1}:</strong> {item.question}
            </p>
            
            <p>
              <strong>Your Answer:</strong> {item.userAnswer === null ? "No answer (Time out)" : item.userAnswer}
            </p>
            <p>
              <strong>Correct Answer:</strong> {item.correctAnswer}
            </p>
            <p>
              <strong>Result:</strong> {item.result === true ? 'Correct':'Incorrect'}
            </p>
          </div>
        ))}
      </div>

      <button
        onClick={() => router.push("/home")}
        style={{ padding: "10px 20px", marginTop: 20 }}
      >
        Back to Home
      </button>
    </div>
  );
}
