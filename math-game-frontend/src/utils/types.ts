
interface ValidationError {
  type: string;
  value: string;
  msg: string;
  path: string;
  location: string;
}

export interface RegisterResponse {
  message?: string;
  user?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  errors?: ValidationError[];
}

export interface LoginResponse {
  message?: string;
  token?: string;
  user?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  errors?: ValidationError[];
}

export interface StartGameResponse {
  message: string;
  gameId: string;
  questions: {
    num1: number;
    num2: number;
    operator: "+" | "-" | "x" | "/";
    options: number[];
  }[];
}

export interface SubmitGameRequest {
  gameId: string;
  answers: { answer: number | null }[];
}

export interface SubmitGameResponse {
  message: string;
  totalQuestions: number;
  score: number;
  results: {
    question: string;
    userAnswer: number | null;
    correctAnswer: number;
    result: boolean;
    status: "answered" | "timeout";
  }[];
}