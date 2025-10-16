"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { startGame } from "../../utils/api";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture:string
}

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) router.push("/login");
    else setUser(JSON.parse(storedUser));
  }, []);

  const handleStartGame = async () => {
    if (!user) return;
    const gameData = await startGame({ userId: user.id });
    localStorage.setItem("gameData", JSON.stringify(gameData));
    router.push("/game");
  };

  if (!user) return null;

  return (
    <div style={{ textAlign: "center", marginTop: 50 }}>
  <h2>Welcome, {user.firstName} {user.lastName}!</h2>
  <p>Email: {user.email}</p>

  {/* Show profile image */}
  {user.profilePicture ? (
     <div style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}>
    <img
      src={user.profilePicture}
      alt={`${user.firstName}'s profile`}
      style={{ width: 100, height: 100, borderRadius: "50%", objectFit: "cover"}}
    />
    </div>
  ) : (
    <p>No profile image</p>
  )}

  <button onClick={handleStartGame} style={{ padding: "10px 20px", marginTop: 20 }}>
    Start Game
  </button>
</div>
  );
}
