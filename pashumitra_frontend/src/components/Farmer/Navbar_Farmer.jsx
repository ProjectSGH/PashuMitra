"use client";

import { ChevronDown, Bell, LogOut } from "lucide-react";
import ServicesDropdown from "./Home/Service_Dropdown_Farmer";
import { useState } from "react";
import resources from "../../resource";

export default function FarmerNavbar() {
  const [showServices, setShowServices] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center">
                {/* <div className="h-8 w-8 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold">
                  PM
                </div> */}
                <img
                  src={resources.Logo.src}
                  alt="Logo"
                  className="h-8 w-8 rounded-md"
                />
                <span className="ml-2 text-lg font-semibold">
                  PashuMitra
                </span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <NavItem
                icon="grid"
                text="Home"
                link="/farmer/home"
                active={false}
              />
              <NavItem
                icon="message-square"
                text="Chat"
                link="/farmer/chat"
                active={false}
              />
              <NavItem
                icon="help-circle"
                text="Help"
                link="/farmer/help"
                active={false}
              />
              <NavItem
                icon="bell"
                text="Notifications"
                link="/farmer/notifications"
                active={false}
              />
              <NavItem
                icon=""
                text="About"
                link="/farmer/about"
                active={false}
              />
            </div>
          </div>

          {/* Right side menu */}
          <div className="flex items-center space-x-4">
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

            <button className="flex items-center text-sm px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">
              <a href="/farmer/profile">Profile</a>
            </button>

            <button className="flex items-center text-sm px-3 py-2 rounded-md text-red-600 hover:bg-gray-100">
              <LogOut className="mr-1 h-4 w-4" />
              <a href="/">Logout</a>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

function NavItem({ icon, text, active, link }) {
  const getIcon = (iconName) => {
    switch (iconName) {
      case "grid":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
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
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        );
      case "help-circle":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
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
      className={`flex items-center px-3 py-2 text-sm font-medium ${
        active ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
      }`}
    >
      {getIcon(icon)}
      <span className="ml-2">{text}</span>
    </a>
  );
}
