import React, { useState } from "react";
import { ArrowLeftCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: emailOrPhone, password }),
      });
  
      const data = await res.json();
      console.log("Login data:", data);  // Log the data
  
      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        const role = data.user.role.toLowerCase();
        console.log("Redirecting to: ", `/${role}/dashboard`); // Log the redirection path
        navigate(`/${role}/dashboard`);  // Redirect after login
      } else {
        setMessage(data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setMessage("Server error");
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center -mt-5">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="mb-6 text-left">
          <h2 className="text-3xl font-bold text-gray-800">
            Welcome back to <span className="text-blue-600">PashuMitra</span>
          </h2>
          <p className="text-gray-500 mt-1">
            Log in to access your animal healthcare dashboard
          </p>
        </div>

       c

        {message && (
          <div
            className={`text-sm mb-3 px-4 py-2 rounded ${
              message.toLowerCase().includes("invalid")
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {message}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            label="Email or Mobile Number"
            placeholder="you@example.com / 9876543210"
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full border rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            autoComplete="current-password" // Add this line
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-3 rounded-md transition"
          >
            Log In
          </button>

          <div className="flex justify-between text-sm mt-3">
            <a href="#forgot" className="text-blue-600 hover:underline">
              Forgot Password?
            </a>
            <a href="/" className="text-blue-600 hover:underline">
              Create Account
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

const Input = ({ label, placeholder, type = "text", value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full border rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
  </div>
);

export default LoginPage;
