"use client"
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div style={{ textAlign: "center", marginTop: 100 }}>
      <h1>Welcome to Math Game</h1>
      <p>Test your math skills with random equations!</p>

      <div style={{ marginTop: 30 }}>
        <button
          onClick={() => router.push("/register")}
          style={{ padding: "10px 20px", marginRight: 10 }}
        >
          Register
        </button>

        <button
          onClick={() => router.push("/login")}
          style={{ padding: "10px 20px" }}
        >
          Login
        </button>
      </div>
    </div>
  );
}
