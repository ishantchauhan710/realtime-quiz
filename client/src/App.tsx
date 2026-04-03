// App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getToken, clearToken } from "./lib/auth";
import Auth from "./pages/AuthPage";
import Home from "./pages/HomePage";
import GoogleSuccess from "./pages/AuthSuccess";
import Profile from "./pages/ProfilePage";
import QuizStartPage from "./pages/QuizStartPage";
import SessionPage from "./pages/SessionPage";
import ResultPage from "./pages/ResultPage";

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const API = "http://localhost:3333";

  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(API + "/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          clearToken();
          setUser(null);
        } else {
          const data = await res.json();
          setUser(data);
        }
      } catch {
        clearToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return null;

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            user ? <Navigate to="/home" replace /> : <Auth setUser={setUser} />
          }
        />

        <Route
          path="/home"
          element={
            user ? (
              <Home setUser={setUser} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />


        <Route
          path="/quiz/:id"
          element={
            user ? (
              <QuizStartPage />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route
          path="/session/:id"
          element={
            user ? (
              <SessionPage />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route
          path="/result/:id"
          element={
            user ? (
              <ResultPage />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route
          path="/profile"
          element={
            user ? (
              <Profile setUser={setUser} user={user} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />


        ``


        <Route path="/auth/success" element={<GoogleSuccess setUser={setUser} />} />
        <Route path="/oauth-success" element={<GoogleSuccess setUser={setUser} />} />

      </Routes>
    </BrowserRouter>
  );
}