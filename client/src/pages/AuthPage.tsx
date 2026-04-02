import { useState } from "react";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  const handleGuestLogin = () => {
  };

  const handleGoogleLogin = () => {
    
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md">
        
        <h2 className="text-2xl font-bold text-white text-center mb-6">
          {isLogin ? "Login" : "Register"}
        </h2>

        <form className="space-y-4">
          
          {!isLogin && (
            <input
              type="text"
              placeholder="Name"
              className="w-full p-3 rounded-lg bg-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg bg-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg bg-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition p-3 rounded-lg text-white font-semibold"
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <div className="flex items-center my-5">
          <div className="flex-1 h-px bg-gray-600"></div>
          <span className="px-3 text-gray-400 text-sm">OR</span>
          <div className="flex-1 h-px bg-gray-600"></div>
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
          className="w-full mt-3 border border-gray-600 text-white p-3 rounded-lg hover:bg-gray-700 transition"
        >
          Play as Guest
        </button>

        <p className="text-gray-400 text-center mt-4">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <span
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-400 cursor-pointer ml-1"
          >
            {isLogin ? "Register" : "Login"}
          </span>
        </p>

      </div>
    </div>
  );
}