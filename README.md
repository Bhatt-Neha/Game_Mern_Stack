# Math Game App

A simple math game web application built with **Node.js**, **Express**, **MongoDB**, and **Next.js**.  
Users can **register, login, start a game**, answer math questions, and see their **score and results**.

## Repositories

- Frontend: [math-game-frontend]
- Backend: [math-game-backend]


## Project Overview

This project is a simple game application built using **MERN stack**. Users can register, log in, and play a game. The frontend is built with **Next.js/React**, and the backend is built with **Node.js, Express, and MongoDB**.  

---

## Technologies Used

### Frontend
- React / Next.js    
- Axios (for API calls)  

### Backend
- Node.js  
- Express.js  
- MongoDB (via Mongoose)  

---

## Installation

```bash
# =========================
# Frontend Setup (math-game-frontend)
# =========================

# 1. go the math-game-frontend folder
cd math-game-frontend

# 2. Install dependencies
npm install

# 3. Create .env file with backend API URL
echo "NEXT_PUBLIC_API_URL=http://localhost:3000" > .env

# 4. Start the frontend development server
npm run dev

# Frontend will run on http://localhost:3000

# =========================
# Backend Setup (math-game-backend)
# =========================

# 1. go the math-game-frontend folder
cd math-game-backend

# 2. Install dependencies
npm install

# 3. Create .env file with MongoDB connection
echo "MONGO_URI=mongodb://127.0.0.1:27017/db_name" > .env
echo "PORT=5000" >> .env

# 4. Start the backend development server
npm run dev

# Backend will run on http://localhost:5000
