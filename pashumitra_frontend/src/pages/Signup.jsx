import React, { useState } from "react";
import { ArrowLeftCircle } from "lucide-react";
import resource from "../resource"; // optional if you need images or data
const roles = ["Farmer", "Medical Store Owner", "Doctor"];

const SignupPage = () => {
  const [selectedRole, setSelectedRole] = useState("Farmer");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Form State
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

    const payload = {
      ...formData,
      role: selectedRole,
    };

    try {
      const res = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Account created successfully! Redirecting to login...");
        window.location.href = "/login"; // redirect to login
      } else {
        setMessage(data.message || "Something went wrong");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setMessage("Server error");
    }
  };

  return (
    <div className="w-full h-full rounded-2xl flex items-center justify-center">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8">
        <div className="mb-6 text-left">
          <h2 className="text-3xl text-center font-bold text-gray-800">
            Create your <span className="text-blue-600">PashuMitra</span>{" "}
            account
          </h2>
          <p className="text-gray-500 mt-1 text-center">
            Join our platform to access animal healthcare services
          </p>
        </div>

        <div className="mb-4 m-auto text-center">
          <span className="inline-block bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-medium">
            Signing up as: {selectedRole}
          </span>
        </div>

        {message && (
          <div
            className={`text-center mb-4 text-sm font-medium px-4 py-2 rounded ${
              message.includes("success") || message.includes("Successfully")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
            />
            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
            />
            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
            />
            <Input
              label="Phone Number"
              name="phone"
              type="tel"
              placeholder="Your contact number"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="w-full md:w-1/2 relative">
            <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
              Your Role
            </label>
            <div
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex justify-between items-center px-4 py-2 border rounded-md cursor-pointer bg-white"
            >
              <span>{selectedRole}</span>
              <span className="ml-2">&#x25BC;</span>
            </div>
            {dropdownOpen && (
              <div className="absolute z-10 bg-white shadow-md rounded-md w-full mt-1">
                {roles.map((role) => (
                  <div
                    key={role}
                    onClick={() => {
                      setSelectedRole(role);
                      setDropdownOpen(false); // close on select
                    }}                    
                    className={`px-4 py-2 hover:bg-blue-100 cursor-pointer text-left ${
                      selectedRole === role ? "bg-blue-100 font-semibold" : ""
                    }`}
                  >
                    {role}
                  </div>
                ))}
              </div>
            )}
          </div>

          <Input
            label="Address"
            name="address"
            placeholder="Your street address"
            value={formData.address}
            onChange={handleChange}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Village (if applicable)"
              name="village"
              placeholder="Your village name"
              value={formData.village}
              onChange={handleChange}
            />
            <Input
              label="City/District"
              name="city"
              placeholder="Your city or district"
              value={formData.city}
              onChange={handleChange}
            />
            <Input
              label="State"
              name="state"
              placeholder="Your state"
              value={formData.state}
              onChange={handleChange}
            />
            <Input
              label="Pin-Code"
              name="pincode"
              placeholder="Your postal code"
              value={formData.pincode}
              onChange={handleChange}
            />
          </div>

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

const Input = ({
  label,
  name,
  placeholder,
  type = "text",
  value,
  onChange,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
      {label}
    </label>
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full border rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
  </div>
);

export default SignupPage;
