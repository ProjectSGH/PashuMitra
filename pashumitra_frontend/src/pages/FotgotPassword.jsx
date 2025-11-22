import React, { useState } from "react";
import { ArrowLeftCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import resources from "../resource";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/users/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      // Check if response is OK first
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      // Try to parse JSON
      let data;
      try {
        data = await res.json();
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error('Invalid response from server');
      }

      setMessage(data.message || "Verification code sent to your email");
      
      // Only proceed to next step if we got a successful response
      if (res.status === 200) {
        setStep(2);
      }

    } catch (err) {
      console.error("Error:", err);
      setMessage(err.message || "Failed to send verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCodeSubmit = async (e) => {
  e.preventDefault();
  
  // Validation
  if (newPassword !== confirmPassword) {
    setMessage("Passwords do not match");
    return;
  }

  if (newPassword.length < 6) {
    setMessage("Password must be at least 6 characters long");
    return;
  }

  if (code.length !== 6) {
    setMessage("Please enter a valid 6-digit code");
    return;
  }

  setLoading(true);
  setMessage("");

  try {
    // ✅ CHANGE THIS: Use the new endpoint
    const res = await fetch("/api/users/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, code, newPassword }),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    let data;
    try {
      data = await res.json();
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      throw new Error('Invalid response from server');
    }

    if (res.status === 200) {
      setStep(3);
      setMessage("Password updated successfully!");
    } else {
      setMessage(data.message || "Failed to reset password");
    }
  } catch (err) {
    console.error("Error:", err);
    setMessage(err.message || "Server error. Please try again.");
  } finally {
    setLoading(false);
  }
};

  const resendCode = async () => {
    setLoading(true);
    setMessage("");
    
    try {
      const res = await fetch("/api/users/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      let data;
      try {
        data = await res.json();
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error('Invalid response from server');
      }

      setMessage(data.message || "New verification code sent to your email");
    } catch (err) {
      console.error("Error:", err);
      setMessage(err.message || "Failed to resend code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 flex items-center justify-center -mt-5">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 h-full">
        <div className="flex items-center mb-6">
          <img
            src={resources.Logo.src}
            alt="PashuMitra Logo"
            className="h-10 bg-cover"
          />
          <h1 className="text-4xl font-bold text-blue-600 ml-2">PashuMitra</h1>
        </div>

        <div className="mb-6 text-left">
          <h2 className="text-3xl font-bold text-gray-800">
            {step === 1 && "Reset Your Password"}
            {step === 2 && "Enter Verification Code"}
            {step === 3 && "Password Updated"}
          </h2>
          <p className="text-gray-500 mt-1">
            {step === 1 && "Enter your email to receive a verification code"}
            {step === 2 && "Check your email and enter the 6-digit code"}
            {step === 3 && "Your password has been updated successfully"}
          </p>
        </div>

        <div className="flex justify-start mb-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:underline font-medium"
          >
            <ArrowLeftCircle className="mr-1" size={18} />
            Back
          </button>
        </div>

        {message && (
          <div
            className={`text-sm mb-3 px-4 py-2 rounded ${
              message.includes("successfully") || message.includes("sent")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        {/* Step 1: Email Input */}
        {step === 1 && (
          <form className="space-y-4" onSubmit={handleEmailSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full border rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-3 rounded-md transition disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Verification Code"}
            </button>
          </form>
        )}

        {/* Step 2: Code and New Password */}
        {step === 2 && (
          <form className="space-y-4" onSubmit={handleCodeSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                Verification Code
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit code"
                className="w-full border rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-400 text-center text-lg tracking-widest"
                maxLength={6}
                required
              />
              <button
                type="button"
                onClick={resendCode}
                disabled={loading}
                className="text-sm text-blue-600 hover:underline mt-2"
              >
                Resend code
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min 6 characters)"
                className="w-full border rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                minLength={6}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full border rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                minLength={6}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-3 rounded-md transition disabled:opacity-50"
            >
              {loading ? "Updating..." : "Reset Password"}
            </button>
          </form>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <div className="text-center space-y-4">
            <div className="text-green-500 text-6xl mb-4">✓</div>
            <p className="text-gray-700">Your password has been updated successfully.</p>
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-3 rounded-md transition"
            >
              Go to Login
            </button>
          </div>
        )}

        <div className="flex justify-center text-sm mt-4">
          <span className="text-gray-600">
            Step {step} of 3
          </span>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;