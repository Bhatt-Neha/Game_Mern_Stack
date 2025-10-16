import mongoose, { Schema, Document } from "mongoose";

export interface IQuestion {
  num1: number;
  num2: number;
  operator: "+" | "-" | "x" | "/";
  options: number[];
  correctAnswer: number;
}

export interface IAnswer {
  question: string;
  userAnswer: number | null; // null if time ran out
  correctAnswer: number;
  result: boolean;
  status: string; // "answered" or "timeout"
}

export interface IGameRound extends Document {
  userId: mongoose.Types.ObjectId;
  questions: IQuestion[];
  answers: IAnswer[];
  score: number;
  createdAt: Date;
}

const QuestionSchema = new Schema<IQuestion>({
  num1: Number,
  num2: Number,
  operator: String,
  options: [Number],
  correctAnswer: Number,
});

const AnswerSchema = new Schema<IAnswer>({
  question: String,
  userAnswer: { type: Number, default: null },
  correctAnswer: Number,
  result: Boolean,
  status: String,
});

const GameRoundSchema = new Schema<IGameRound>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  questions: [QuestionSchema],
  answers: [AnswerSchema],
  score: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IGameRound>("GameRound", GameRoundSchema);
