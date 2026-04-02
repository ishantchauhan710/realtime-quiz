import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setToken } from "../lib/auth";

export default function Auth({ setUser }: any) {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const API = "http://localhost:3333";

  const updateField = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const endpoint = isLogin ? "/login" : "/register";

      const body = isLogin
        ? { email: form.email, password: form.password }
        : form;

      const res = await fetch(API + endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || "Something went wrong");
        return;
      }

      if (data.accessToken) {
        setToken(data.accessToken);
        setUser(data.user);
        navigate("/home");
      }

      setSuccess(isLogin ? "Login successful" : "Account created");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(API + "/guest", {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || "Guest login failed");
        return;
      }

      setToken(data.accessToken || data.token);
      setUser(data.user);
      navigate("/home");
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = API + "/auth/google";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
      <div className="w-full max-w-md p-8 rounded-2xl bg-gray-900/80 backdrop-blur border border-gray-700 shadow-2xl">

        <h2 className="text-3xl font-bold text-white text-center mb-6">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>

        {error && (
          <div className="mb-4 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 text-green-400 text-sm text-center">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              type="text"
              placeholder="Full Name"
              disabled={loading}
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
          )}

          <input
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            type="email"
            placeholder="Email"
            disabled={loading}
            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />

          <input
            value={form.password}
            onChange={(e) => updateField("password", e.target.value)}
            type="password"
            placeholder="Password"
            disabled={loading}
            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />

          <button
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-lg text-white font-semibold disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? "Please wait..." : isLogin ? "Login" : "Register"}
          </button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-700"></div>
          <span className="px-3 text-gray-500 text-xs">OR</span>
          <div className="flex-1 h-px bg-gray-700"></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 bg-white text-black p-3 rounded-lg font-medium hover:bg-gray-200 transition"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="google"
            className="w-5 h-5"
          />
          Continue with Google
        </button>

        <button
          onClick={handleGuestLogin}
          disabled={loading}
          className="w-full mt-3 text-gray-300 hover:text-white disabled:opacity-50"
        >
          {loading ? "Loading..." : "Play as Guest →"}
        </button>

        <p className="text-gray-400 text-center mt-6">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <span
            onClick={() => !loading && setIsLogin(!isLogin)}
            className="text-blue-400 cursor-pointer ml-1"
          >
            {isLogin ? "Register" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
}