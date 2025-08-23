// src/pages/ContactUs.jsx
"use client";

import { Phone, Mail, MapPin, Send, ArrowDown, ChevronDown } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Navbar from "../components/Common/Navbar";
import Footer from "../components/Footer";
import resources from "../resource";

// FAQ Component
const FAQ = ({ question, answer }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-300">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center py-4 text-lg font-medium text-left"
      >
        {question}
        <ChevronDown
          className={`h-5 w-5 transform transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && <p className="pb-4 text-gray-600">{answer}</p>}
    </div>
  );
};

// Hero Section (Image Left, Text Right + FAQ)
const HeroSection = () => {
  return (
    <div className="relative overflow-hidden">
      <div className="flex flex-col lg:flex-row bg-white items-center min-h-[80vh] w-full">
        {/* Left: Image */}
        <div className="w-full lg:w-3/5 h-[60vh] lg:h-[80vh] relative order-1 lg:order-none">
          <div
            className="absolute inset-0 bg-blue-600 bg-cover bg-center"
            style={{
              backgroundImage: `url(${resources.ContactHero.src})`,
              clipPath: "polygon(0 0, 85% 0, 100% 100%, 0% 100%)",
            }}
          ></div>
        </div>

        {/* Right: Text */}
        <motion.div
          className="w-full lg:w-2/5 px-6 lg:px-16 py-12 z-10 text-center lg:text-left"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Any Query? <br /> Then why be Confused, Ask Us
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-xl mx-auto lg:mx-0">
            We're here to answer your doubts and guide you with the right
            information you need <b>24 x 7.</b>
          </p>
        </motion.div>
      </div>

      {/* FAQ Section */}
      <div className="px-6 md:px-20 py-12 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8 text-blue-600">
          Frequently Asked Questions
        </h2>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <FAQ
            question="How can I contact support?"
            answer="You can reach us via phone, email, or by filling out the contact form below. We're available 24/7 for emergencies."
          />
          <FAQ
            question="What kind of queries can I ask?"
            answer="You can ask about veterinary care, medicine availability, transport support, or any technical help regarding our platform."
          />
          <FAQ
            question="How quickly will I get a response?"
            answer="Our team usually replies within 24 hours for non-urgent queries. For emergencies, use our phone helpline."
          />
          <FAQ
            question="Is there any cost for asking queries?"
            answer="No, asking queries is completely free. You only pay if you order medicines or request transport services."
          />
        </div>
      </div>
    </div>
  );
};

const ContactUs = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.subject.trim() ||
      !form.message.trim()
    ) {
      toast.error("Please fill in all fields.");
      return;
    }

    toast.success("Message sent successfully!");
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  return (
    <>
      <Navbar />
      <HeroSection /> {/* ✅ Hero + FAQ section added here */}
      <div className="bg-white text-blue-600">
        {/* Header */}
        <div className="text-center px-4 py-10">
          <h1 className="text-5xl font-bold mb-2">Get in Touch with Us</h1>
          <p className="text-gray-600 text-lg">
            We're here to help you with anything related to veterinary care or
            medicine access.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="container m-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:px-20 mb-12">
          {/* Phone Support */}
          <div className="bg-white shadow-lg p-6 rounded-md text-center">
            <div className="mx-auto mb-3 w-16 h-16">
              <Phone className="w-full h-full p-3 rounded-full bg-blue-600 text-white" />
            </div>
            <h3 className="font-semibold">Phone Support</h3>
            <p className="text-lg mt-1">
              <p> +91-9316846548 </p>
              <p> +91-7043569445 </p>
              <p> +91-9023897448 </p>
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Available 24/7 for emergency support
            </p>
          </div>

          {/* Email Support */}
          <div className="bg-white shadow-lg p-6 rounded-md text-center">
            <div className="mx-auto mb-3 w-16 h-16">
              <Mail className="w-full h-full p-3 rounded-full bg-blue-600 text-white" />
            </div>
            <h3 className="font-semibold">Email Support</h3>
            <p className="text-lg mt-1">info.hexcodebreaker@gmail.com</p>
            <p className="text-sm text-gray-500 mt-1">
              We'll respond within 24 hours
            </p>
          </div>

          {/* Location */}
          <div className="bg-white shadow-lg p-6 rounded-md text-center">
            <div className="mx-auto mb-3 w-16 h-16">
              <MapPin className="w-full h-full p-3 rounded-full bg-blue-600 text-white" />
            </div>
            <h3 className="font-semibold">Location</h3>
            <p className="text-lg mt-1">U.V. Patel College of Engineering</p>
            <p className="text-sm text-gray-500 mt-1">
              Ganpat University, Mehsana, Gujarat
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="px-4 md:px-20 mb-20">
          <div className="grid md:grid-cols-2 gap-10 items-start">
            {/* Contact Form */}
            <div className="bg-white rounded-xl shadow-xl p-8 w-full text-black">
              <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">
                Get in Touch
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-lg font-medium mb-2 text-black">
                    Name
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    type="text"
                    placeholder="John Doe"
                    className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-lg font-medium mb-2 text-black">
                    Email
                  </label>
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    type="email"
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-lg font-medium mb-2 text-black">
                    Phone
                  </label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    type="text"
                    placeholder="+91 9876543210"
                    className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-lg font-medium mb-2 text-black">
                    Subject
                  </label>
                  <input
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    type="text"
                    placeholder="I need help with..."
                    className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-lg font-medium mb-2 text-black">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Write your message here..."
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Google Map */}
            <div className="h-[600px] w-full rounded-xl overflow-hidden shadow-lg">
              <iframe
                title="Our Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3658.115154878245!2d72.4562824110149!3d23.52836029717575!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395c476dcc7fad61%3A0x1cf6e21d7ca9091d!2sU.%20V.%20Patel%20College%20of%20Engineering%20(Main%20Building)!5e0!3m2!1sen!2sin!4v1754399770274!5m2!1sen!2sin"
                className="w-full h-full border-0"
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ContactUs;
