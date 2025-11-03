"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import resources from "../resource";
import {
  LogOut,
  LayoutDashboard,
  Users,
  Tractor,
  Stethoscope,
  ListOrdered,
  Store,
  Shield,
  Bell,
  Settings,
  Menu,
  Search,
  Clock,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronRight,
  Verified
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import DashboardPage from "./Dashboard";
import FarmersPage from "./FarmerPage";
import DoctorsPage from "./DoctorPage";
import MedicalStoresPage from "./MedicalStorePage";
import VerificationsPage from "./VerificationPage";
import NotificationsPage from "./NotificationPage";
import AdminOrders from "./AdminOrders";
import MedicineVerificationPage from "./MedicineVerificationPage";
import SettingsPage from "./SettingPage";

const AdminDashboard = ({onLogout}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [usersDropdownOpen, setUsersDropdownOpen] = useState(false);
  const [activePage, setActivePage] = useState("Dashboard");
  const navigate = useNavigate(); // ✅ setup navigate
  const [isLoggingOut, setIsLoggingOut] = useState(false); // ✅ added

   const handleLogout = () => {
    setIsLoggingOut(true)
    setTimeout(() => {
      onLogout()
    }, 300)
  }
  const sidebarItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      active: activePage === "Dashboard",
    },
    { icon: Users, label: "Users", hasSubmenu: true },
    {
      icon: Shield,
      label: "Verifications",
      active: activePage === "Verifications",
    },
    {
      icon: Bell,
      label: "Notifications",
      active: activePage === "Notifications",
    },
    {
      icon: Verified,
      label: "Medicine Verifications",
      active: activePage === "Medicine Verifications",
    },
    {
      icon: ListOrdered,
      label: "Orders",
      active: activePage === "Orders",
    },
    { icon: Settings, label: "Settings", active: activePage === "Settings" },
  ];

  const usersDropdownItems = [
    { icon: Tractor, label: "Veterinary Farmer", page: "Farmers" },
    { icon: Stethoscope, label: "Veterinary Doctor", page: "Doctors" },
    { icon: Store, label: "Medical Store", page: "Medical Stores" },
  ];

  const handleNavigation = (page) => {
    setActivePage(page);
    toast.success(`Navigated to ${page}`);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <Clock className="w-4 h-4" />;
      case "Approved":
        return <CheckCircle className="w-4 h-4" />;
      case "Rejected":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status, color) => {
    const colorClasses = {
      orange: "bg-orange-100 text-orange-800 border-orange-200",
      green: "bg-green-100 text-green-800 border-green-200",
      red: "bg-red-100 text-red-800 border-red-200",
    };

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${colorClasses[color]}`}
      >
        {getStatusIcon(status)}
        {status}
      </span>
    );
  };

  const renderActivePage = () => {
    switch (activePage) {
      case "Dashboard":
        return <DashboardPage />;
      case "Farmers":
        return <FarmersPage />;
      case "Doctors":
        return <DoctorsPage />;
      case "Medical Stores":
        return <MedicalStoresPage />;
      case "Verifications":
        return <VerificationsPage />;
      case "Notifications":
        return <NotificationsPage />;
      case "Orders":
        return <AdminOrders />;
      case "Medicine Verifications":
        return <MedicineVerificationPage />;
      case "Settings":
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Toaster position="bottom-right" />

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed left-0 top-0 h-full w-70 bg-white border-r border-gray-200 z-50 lg:relative lg:translate-x-0"
          >
            <div className="flex flex-col h-full">
              {/* Sidebar Header */}
              <div className="flex items-center gap-3 p-6 border-b border-gray-200">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                  <img
                    src={resources.Logo.src}
                    alt="Logo"
                    className="w-auto h-auto"
                  />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">PashuMitra</h2>
                  <p className="text-sm text-gray-500">Admin Panel</p>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-4">
                <ul className="space-y-2">
                  {sidebarItems.map((item, index) => (
                    <motion.li
                      key={index}
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.hasSubmenu ? (
                        <div>
                          <button
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors text-gray-600 hover:bg-gray-50"
                            onClick={() =>
                              setUsersDropdownOpen(!usersDropdownOpen)
                            }
                          >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium flex-1">
                              {item.label}
                            </span>
                            {usersDropdownOpen ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                          </button>

                          <AnimatePresence>
                            {usersDropdownOpen && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <ul className="mt-2 space-y-1">
                                  {usersDropdownItems.map(
                                    (dropdownItem, dropdownIndex) => (
                                      <motion.li
                                        key={dropdownIndex}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{
                                          duration: 0.2,
                                          delay: dropdownIndex * 0.05,
                                        }}
                                      >
                                        <button
                                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors pl-8 ${
                                            activePage === dropdownItem.page
                                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                                              : "text-gray-600 hover:bg-gray-50"
                                          }`}
                                          onClick={() =>
                                            handleNavigation(dropdownItem.page)
                                          }
                                        >
                                          <dropdownItem.icon className="w-4 h-4" />
                                          <span className="text-sm font-medium">
                                            {dropdownItem.label}
                                          </span>
                                        </button>
                                      </motion.li>
                                    )
                                  )}
                                </ul>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <button
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                            item.active
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : "text-gray-600 hover:bg-gray-50"
                          }`}
                          onClick={() => handleNavigation(item.label)}
                        >
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.label}</span>
                        </button>
                      )}
                    </motion.li>
                  ))}
                </ul>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                  <img
                    src={resources.Logo.src}
                    alt="Logo"
                    className="w-auto h-auto"
                  />
                </div>
                <span className="font-semibold text-gray-900">PashuMitra</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search users, verifications..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80"
                />
              </div>

              {/* <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </button> */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:text-red-900 hover:bg-gray-100 mt-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-6">{renderActivePage()}</main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
