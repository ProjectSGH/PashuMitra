"use client";

import { ChevronDown, LogOut, Menu, X, Bell } from "lucide-react";
import { useState } from "react";
import ServicesDropdown from "./Home/Service_Dropdown_Farmer";
import resources from "../../resource";

export default function FarmerNavbar() {
  const [showServices, setShowServices] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <img
              src={resources.Logo.src}
              alt="Logo"
              className="h-8 w-8 rounded-md"
            />
            <span className="ml-2 text-lg font-semibold">PashuMitra</span>
          </div>

          {/* Mobile menu toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <NavItem icon="grid" text="Home" link="/farmer/home" />
            <NavItem icon="message-square" text="Chat" link="/farmer/chat" />
            <NavItem icon="help-circle" text="Help" link="/farmer/help" />
            <NavItem icon="bell" text="Notifications" link="/farmer/notifications" />
            <NavItem icon="" text="About" link="/farmer/about" />

            <div className="relative">
              <button
                className="flex items-center text-sm px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                onClick={() => setShowServices(!showServices)}
              >
                Services
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              {showServices && <ServicesDropdown />}
            </div>

            <a
              href="/farmer/profile"
              className="text-sm px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
            >
              Profile
            </a>

            <a
              href="/"
              className="flex items-center text-sm px-3 py-2 rounded-md text-red-600 hover:bg-gray-100"
            >
              <LogOut className="mr-1 h-4 w-4" />
              Logout
            </a>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 space-y-1">
            <NavItem icon="grid" text="Home" link="/farmer/home" />
            <NavItem icon="message-square" text="Chat" link="/farmer/chat" />
            <NavItem icon="help-circle" text="Help" link="/farmer/help" />
            <NavItem icon="bell" text="Notifications" link="/farmer/notifications" />
            <NavItem icon="" text="About" link="/farmer/about" />

            <button
              onClick={() => setShowServices(!showServices)}
              className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Services
            </button>
            {showServices && <ServicesDropdown />}

            <a
              href="/farmer/profile"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Profile
            </a>

            <a
              href="/"
              className="flex items-center px-4 py-2 text-red-600 hover:bg-gray-100"
            >
              <LogOut className="mr-1 h-4 w-4" />
              Logout
            </a>
          </div>
        )}
      </div>
    </header>
  );
}

// Reusable nav item component
function NavItem({ icon, text, link }) {
  const getIcon = (iconName) => {
    switch (iconName) {
      case "grid":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
        );
      case "message-square":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        );
      case "help-circle":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        );
      case "bell":
        return <Bell className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <a
      href={link}
      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
    >
      {getIcon(icon)}
      <span className="ml-2">{text}</span>
    </a>
  );
}
