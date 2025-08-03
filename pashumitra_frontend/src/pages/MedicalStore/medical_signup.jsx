import React, { useState } from "react";
import { ArrowLeftCircle } from "lucide-react";

const SignupPage = () => {
  const [selectedRole] = useState("MedicalStore");

  const [formData, setFormData] = useState({
    storeName: "",
    ownerName: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    village: "",
    city: "",
    state: "",
    pincode: "",
    established: "",
    specialization: "",
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
      const res = await fetch("http://localhost:5000/api/users/signup/store", {
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
            <Input label="Store Name" name="storeName" value={formData.storeName} onChange={handleChange} />
            <Input label="Owner Name" name="ownerName" value={formData.ownerName} onChange={handleChange} />
            <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} />
            <Input label="Password" name="password" type="password" value={formData.password} onChange={handleChange} />
            <Input label="Phone Number" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
            <Input label="Established" name="established" type="date" value={formData.established} onChange={handleChange} />
          </div>

          <Input label="Address" name="address" value={formData.address} onChange={handleChange} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Village (optional)" name="village" value={formData.village} onChange={handleChange} />
            <Input label="City/District" name="city" value={formData.city} onChange={handleChange} />
            <Input label="State" name="state" value={formData.state} onChange={handleChange} />
            <Input label="Pin-Code" name="pincode" value={formData.pincode} onChange={handleChange} />
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                <select
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Select Specialization</option>
                  {[
                    "General Veterinary Medicine",
                    "Small Animal Medicine",
                    "Large Animal Medicine",
                    "Equine Medicine",
                    "Canine and Feline Practice",
                    "Food Animal Medicine",
                    "Poultry Medicine",
                    "Wildlife and Zoo Medicine",
                    "Exotic Animal Medicine",
                    "Veterinary Surgery",
                    "Veterinary Internal Medicine",
                    "Veterinary Dermatology",
                    "Veterinary Ophthalmology",
                    "Veterinary Dentistry",
                    "Veterinary Anesthesiology",
                    "Veterinary Radiology & Imaging",
                    "Veterinary Pathology",
                    "Veterinary Microbiology",
                    "Veterinary Pharmacology",
                    "Veterinary Parasitology",
                    "Veterinary Public Health",
                    "Veterinary Toxicology",
                    "Veterinary Epidemiology",
                    "Veterinary Oncology",
                    "Veterinary Neurology",
                    "Veterinary Nutrition",
                    "Aquatic Animal Health",
                    "Dairy Science",
                    "Animal Reproduction & Gynecology",
                    "Veterinary Emergency & Critical Care",
                    "Veterinary Preventive Medicine",
                    "Veterinary Biotechnology"
                  ].map((specialty) => (
                    <option key={specialty} value={specialty}>
                      {specialty}
                    </option>
                  ))}
                </select>
            </div>
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
