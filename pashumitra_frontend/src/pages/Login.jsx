import React from "react";
import { ArrowLeftCircle } from "lucide-react";

const LoginPage = () => {
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

        <button className="text-blue-600 text-sm mb-4">
          <a
            href="/Login"
            className="text-decoration-none flex items-center justify-center"
          >
            <ArrowLeftCircle className="inline mr-1" />
            Back to Home
          </a>
        </button>

        <form className="space-y-4">
          <Input
            label="Email or Mobile Number"
            placeholder="you@example.com / 9876543210"
          />
          <Input
            label="Password"
            placeholder="Enter your password"
            type="password"
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
            <a href="\" className="text-blue-600 hover:underline">
              Create Account
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

const Input = ({ label, placeholder, type = "text" }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
      {label}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      className="w-full border rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
  </div>
);

export default LoginPage;
