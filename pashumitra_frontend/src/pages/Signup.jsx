import React, { useState } from "react";
import { ArrowLeftCircle } from "lucide-react";
import resource  from "../resource";
const roles = ["Farmer", "Medical Store Owner", "Doctor"];

const SignupPage = () => {
  const [selectedRole, setSelectedRole] = useState("Farmer");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setDropdownOpen(false);
  };

  return (
    <div className="w-full bg-gradient-to-br rounded-2xl from-blue-50 to-blue-100 flex items-center justify-center">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8">
        <div className="mb-6 text-left">
          <h2 className="text-3xl font-bold text-gray-800">
            Create your <span className="text-blue-600">PashuMitra </span> account
          </h2>
          <p className="text-gray-500 mt-1 text-center">
            Join our platform to access animal healthcare services
          </p>
        </div>

        <button className="text-blue-600 text-sm mb-4 ">
          <a href="/Login" className="text-decoration-none flex items-center justify-center">
            <ArrowLeftCircle className="inline mr-1" />
           Back to Home
          </a>
        </button>

        <div className="mb-4 m-auto text-center">
          <span className="inline-block bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-medium">
            Signing up as: {selectedRole}
          </span>
        </div>

        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Full Name" placeholder="Enter your full name" />
            <Input label="Email" type="email" placeholder="you@example.com" />
            <Input label="Password" type="password" placeholder="Create a password" />
            <Input label="Phone Number" type="tel" placeholder="Your contact number" />
          </div>

          <div className="w-full md:w-1/2">
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
              <div className="absolute z-10 bg-white shadow-md rounded-md w-48 mt-1">
                {roles.map((role) => (
                  <div
                    key={role}
                    onClick={() => handleRoleSelect(role)}
                    className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-left"
                  >
                    {role}
                  </div>
                ))}
              </div>
            )}
          </div>

          <Input label="Address" placeholder="Your street address" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Village (if applicable)" placeholder="Your village name" />
            <Input label="City/District" placeholder="Your city or district" />
            <Input label="State" placeholder="Your state" />
            <Input label="Pin-Code" placeholder="Your postal code" />
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

export default SignupPage;
