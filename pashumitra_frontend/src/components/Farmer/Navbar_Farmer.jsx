import React, { useState } from "react";
import { Home, Package, LayoutDashboard, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="h-8 w-8 bg-blue-600 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-lg">PM</span>
              </div>
              <span className="ml-2 text-lg font-semibold text-gray-900">PashuMitra</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
              >
                <Home size={18} className="mr-1" />
                Home
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
              >
                <Package size={18} className="mr-1" />
                Inventory
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
              >
                <LayoutDashboard size={18} className="mr-1" />
                Dashboard
              </a>
            </div>
            <div className="flex items-center space-x-2">
              <a
                href="#"
                className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Login
              </a>
              <a
                href="#"
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Get Started
              </a>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-100 focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a
              href="#"
              className="text-gray-600 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium flex items-center"
            >
              <Home size={18} className="mr-2" />
              Home
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium flex items-center"
            >
              <Package size={18} className="mr-2" />
              Inventory
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium flex items-center"
            >
              <LayoutDashboard size={18} className="mr-2" />
              Dashboard
            </a>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-5 space-x-2">
              <a
                href="#"
                className="text-gray-600 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
              >
                Login
              </a>
              <a
                href="#"
                className="bg-blue-600 text-white block px-4 py-2 rounded-md text-base font-medium hover:bg-blue-700"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
