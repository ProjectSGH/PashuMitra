import React, { useState } from "react";
import { ArrowLeftCircle } from "lucide-react";

const SignupPage = () => {
  const [selectedRole] = useState("MedicalStore");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    village: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = { ...formData, role: "MedicalStore" };

    try {
      const res = await fetch("http://localhost:5000/api/users/signup/farmer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Account created successfully! Redirecting to login...");
        window.location.href = "/login";
      } else {
        setMessage(data.message || "Something went wrong");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setMessage("Server error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 flex items-center justify-center px-4">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl p-8 md:p-12">
        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Create your <span className="text-blue-600">PashuMitra</span> MedicalStore account
          </h2> 
          <p className="text-gray-500 mt-2 text-sm">
            Join our platform to access animal healthcare services
          </p>
        </div>

        {/* Back to home */}
        <div className="flex justify-center mb-4">
          <a href="/" className="flex items-center text-blue-600 hover:underline text-sm font-medium">
            <ArrowLeftCircle className="mr-1" size={18} />
            Back to Home
          </a>
        </div>

        {/* Role Display */}
        <div className="mb-6 text-center">
          <span className="inline-block bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-medium">
            Signing up as: {selectedRole}
          </span>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`text-center mb-4 text-sm font-medium px-4 py-2 rounded ${
              message.toLowerCase().includes("success")
                ? "bg-blue-100 text-blue-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} />
            <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} />
            <Input label="Password" name="password" type="password" value={formData.password} onChange={handleChange} />
            <Input label="Phone Number" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
          </div>

          <Input label="Address" name="address" value={formData.address} onChange={handleChange} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Village (optional)" name="village" value={formData.village} onChange={handleChange} />
            <Input label="City/District" name="city" value={formData.city} onChange={handleChange} />
            <Input label="State" name="state" value={formData.state} onChange={handleChange} />
            <Input label="Pin-Code" name="pincode" value={formData.pincode} onChange={handleChange} />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-3 rounded-md transition"
          >
            Create Account
          </button>

          <div className="text-center text-sm mt-3">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              Log in
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

const Input = ({ label, name, value, onChange, placeholder, type = "text" }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder || `Enter ${label}`}
      className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
  </div>
);

export default SignupPage;
