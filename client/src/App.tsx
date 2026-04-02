import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect, type JSX } from "react";

import { getToken, clearToken } from "./lib/auth";

import Auth from "./pages/AuthPage";
import Home from "./pages/HomePage";
import GoogleSuccess from "./pages/AuthSuccess";
import Profile from "./pages/ProfilePage";
import QuizPage from "./pages/QuizPage";
import MultiplayerEntry from "./pages/MultiplayerQuiz";
import MultiplayerRoom from "./pages/MultiplayerRoom";

const API = "http://localhost:3333";

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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


  const Protected = ({ children }: { children: JSX.Element }) => {
    return user ? children : <Navigate to="/" replace />;
  };


  const Public = ({ children }: { children: JSX.Element }) => {
    return user ? <Navigate to="/home" replace /> : children;
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route
          path="/"
          element={
            <Public>
              <Auth setUser={setUser} />
            </Public>
          }
        />

        {/* Protected */}
        <Route
          path="/home"
          element={
            <Protected>
              <Home />
            </Protected>
          }
        />


        <Route
          path="/multiplayer"
          element={
            <Protected>
              <MultiplayerEntry />
            </Protected>
          }
        />

        <Route
          path="/multiplayer/:id"
          element={
            <Protected>
              <MultiplayerRoom user={user} />
            </Protected>
          }
        />


        <Route
          path="/profile"
          element={
            <Protected>
              <Profile setUser={setUser} mainUser={user} />
            </Protected>
          }
        />


        <Route
          path="/quiz/:id"
          element={
            <Protected>
              <QuizPage />
            </Protected>
          }
        />


        {/* OAuth */}
        <Route
          path="/auth/success"
          element={<GoogleSuccess setUser={setUser} />}
        />
        <Route
          path="/oauth-success"
          element={<GoogleSuccess setUser={setUser} />}
        />
      </Routes>
    </BrowserRouter>
  );
}