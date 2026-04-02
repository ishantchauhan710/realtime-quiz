// src/pages/Home.tsx
import { useEffect, useState } from "react";
import { getToken, clearToken } from "../lib/auth";

export default function Home({ setUser }: any) {
  const [user, setLocalUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const API = "http://localhost:3333";

  const fetchMe = async () => {
    const token = getToken();

    if (!token) {
      window.location.href = "/";
      return;
    }

    try {
      const res = await fetch(API + "/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        clearToken();
        window.location.href = "/";
        return;
      }

      setLocalUser(data);
      setUser(data);
    } catch {
      clearToken();
      window.location.href = "/";
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

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

  if (loading) {
    return <div className="text-white text-center mt-20">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-3xl mb-4">Welcome {user?.name}</h1>

      <button
        onClick={handleLogout}
        className="bg-red-600 px-4 py-2 rounded-lg"
      >
        Logout
      </button>
    </div>
  );
}