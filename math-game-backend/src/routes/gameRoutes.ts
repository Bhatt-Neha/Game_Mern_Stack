import { Router, Request, Response } from "express";
import mongoose from "mongoose";
import GameRound, { IQuestion } from "../models/GameRound";

const router = Router();

// Calculate value based on operator
const calculateAnswer = (num1: number, num2: number, operator: string): number => {
  switch (operator) {
    case "+": return num1 + num2;
    case "-": return num1 - num2;
    case "x": return num1 * num2;
    case "/": return num2 !== 0 ? Math.floor(num1 / num2) : 0;
    default: return 0;
  }
};

// Generate `count` unique questions for a game
const generateQuestions = (count: number): IQuestion[] => {
  const questions: IQuestion[] = [];
  const used = new Set<string>();
  const operators = ["+", "-", "x", "/"];

  while (questions.length < count) {
    const num1 = Math.floor(Math.random() * 10);
    const num2 = Math.floor(Math.random() * 10);
    const operator = operators[Math.floor(Math.random() * operators.length)];
    const key = `${num1}${operator}${num2}`;

    if (used.has(key)) continue;
    used.add(key);

    const correctAnswer = calculateAnswer(num1, num2, operator);

    // Generates 3 incorrect answers
    const optionsSet = new Set<number>();
    optionsSet.add(correctAnswer);
    while (optionsSet.size < 4) {
      optionsSet.add(Math.floor(Math.random() * 20));
    }

    // Shuffle options
    const options = Array.from(optionsSet).sort(() => Math.random() - 0.5);

    questions.push({
      num1,
      num2,
      operator: operator as "+" | "-" | "x" | "/",
      options,
      correctAnswer,
    });
  }

  return questions;
};

// Start a new game
router.post("/start", async (req: Request, res: Response) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "Valid userId is required" });
  }

  try {
    const questions = generateQuestions(10);

    const game = new GameRound({ userId, questions });
    await game.save();

    res.status(201).json({
      message: "Game round created",
      gameId: game._id,
      questions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Submit game
router.post("/submit", async (req: Request, res: Response) => {
  const { gameId, answers } = req.body;

  if (!gameId || !mongoose.Types.ObjectId.isValid(gameId)) {
    return res.status(400).json({ message: "Valid gameId is required" });
  }

  try {
    const game = await GameRound.findById(gameId);
    if (!game) return res.status(404).json({ message: "Game not found" });

    if (!Array.isArray(answers) || answers.length !== game.questions.length) {
      return res.status(400).json({ message: "Invalid answers format" });
    }

    let score = 0;
    const results = game.questions.map((q, index) => {
      const userAnswer = answers[index]?.answer ?? null;
      const isTimeout = userAnswer === null;
      const isCorrect = userAnswer === q.correctAnswer;

      if (isCorrect) score++;

      return {
        question: `${q.num1} ${q.operator} ${q.num2}`,
        userAnswer,
        correctAnswer: q.correctAnswer,
        result: isCorrect,
        status: isTimeout ? "timeout" : "answered",
      };
    });

    game.answers = results;
    game.score = score;
    await game.save();

    res.status(200).json({
      message: "Game completed successfully",
      totalQuestions: game.questions.length,
      score,
      results,
    });
  } catch (error) {
    console.error("Error submitting answers:", error);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
