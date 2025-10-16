"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { submitGame } from "../../utils/api";

interface Question {
  num1: number;
  num2: number;
  operator: string;
  options: number[];
  correctAnswer: number;
}

export default function GamePage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timer, setTimer] = useState(30);
  const [userAnswers, setUserAnswers] = useState<{ answer: number | null }[]>([]);

  useEffect(() => {
    const gameData = localStorage.getItem("gameData");
    if (!gameData) return router.push("/home");
    setQuestions(JSON.parse(gameData).questions);
  }, []);

  useEffect(() => {
    if (!questions.length || currentIndex >= questions.length) return;

    setTimer(30);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          handleAnswer(null); // time out
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentIndex, questions]);

  const handleAnswer = (answer: number | null) => {
    // store selected answer or null if timed out
    setUserAnswers([...userAnswers, { answer }]);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      submitResults([...userAnswers, { answer }]);
    }
  };

  const submitResults = async (answers: { answer: number | null }[]) => {
    const gameData = JSON.parse(localStorage.getItem("gameData") || "{}");
    const res = await submitGame({ gameId: gameData.gameId, answers });
    //storing in local storage
    localStorage.setItem("gameResult", JSON.stringify(res));
    router.push("/result");
  };

  if (!questions.length) return <p>Loading...</p>;
  if (currentIndex >= questions.length) return <p>Calculating results...</p>;

  const q = questions[currentIndex];

  return (
    <div style={{ maxWidth: 400, margin: "50px auto", textAlign: "center" }}>
      <h2>
        Question {currentIndex + 1} / {questions.length}
      </h2>
      <p>Time Left: {timer}s</p>
      <div style={{ fontSize: 24, margin: "20px 0" }}>
        <span>{q.num1}</span>
        <span style={{ margin: "0 10px" }}>{q.operator}</span>
        <span>{q.num2}</span>
      </div>
      <div>
        {q.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => handleAnswer(opt)}
            style={{ margin: 5, padding: "8px 16px" }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
