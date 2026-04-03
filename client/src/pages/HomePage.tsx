import { useEffect, useState } from "react";
import { getToken, clearToken } from "../lib/auth";
import PageContainer from "./PageContainer";

export default function Home({ setUser }: any) {
  const [user, setLocalUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");

  const API = "http://localhost:3333";

  // 🔐 Logout
  const handleLogout = async () => {
    const token = getToken();

    await fetch(API + "/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    clearToken();
    setUser(null);
    window.location.href = "/";
  };


  return (
    <PageContainer onLogout={handleLogout}>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">Play Solo</h1>
        <p className="text-gray-400 text-sm">Test your knowledge with different quizzes</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
       hi
      </div>
    </PageContainer>
  );
}