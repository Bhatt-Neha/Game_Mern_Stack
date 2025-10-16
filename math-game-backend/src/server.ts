import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db";
import authRoutes from "./routes/authRoutes";
import gameRoutes from "./routes/gameRoutes";

dotenv.config();

const app= express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/game", gameRoutes);

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Math Game Backend running 🚀" });
});

connectDB();
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
