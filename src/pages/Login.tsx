import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../app/services/crudAuth";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.removeItem("accessToken");

    try {
      const response = await login({ email, password }).unwrap();

      // Store accessToken in localStorage
      localStorage.setItem("accessToken", response.data.token);

      toast.success("Login successful!");

      // Navigate to dashboard
      navigate("/dashboard/products");
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(
        error?.data?.message || "Login failed. Please check your credentials."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-50 to-fuchsia-100 p-4">
      <div className="w-full max-w-md bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 backdrop-blur-lg text-white rounded-2xl shadow-2xl p-8">
        <form onSubmit={handleSubmit}>
          {/* Title */}
          <h1 className="text-4xl font-bold text-center mb-8">Login</h1>

          {/* Email Input */}
          <div className="relative w-full h-14 mb-8">
            <input
              required
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-full bg-transparent border-2 border-white/20 rounded-full text-white placeholder-white/80 px-6 py-5 text-base outline-none focus:border-white/50 transition-colors"
            />
          </div>

          {/* Password Input */}
          <div className="relative w-full h-14 mb-8">
            <input
              required
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-full bg-transparent border-2 border-white/20 rounded-full text-white placeholder-white/80 px-6 py-5 text-base outline-none focus:border-white/50 transition-colors"
            />
          </div>

          {/* Login Button */}
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="w-40 h-12 bg-white text-gray-800 font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
