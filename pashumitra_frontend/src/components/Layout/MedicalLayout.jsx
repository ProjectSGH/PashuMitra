import React, { useState, useEffect } from "react";
import MedicalSidebar from "../../components/MedicalStoreOwner/Dashboard_Medical/DashSidebar";
import MedicalHeader from "../../components/MedicalStoreOwner/Dashboard_Medical/DashHeader";

const MedicalLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  }, [isMobile]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex w-screen h-screen overflow-hidden">
      {/* Sidebar */}
      <MedicalSidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        isMobile={isMobile}
      />

      {/* Main Content */}
      <div
        className={`flex flex-col transition-all duration-300 ease-in-out h-full ${
          isMobile ? "w-full ml-0" : isSidebarOpen ? "ml-64 w-[calc(100%-16rem)]" : "w-full ml-0"
        }`}
      >
        {/* Header */}
        <MedicalHeader toggleSidebar={toggleSidebar} isMobile={isMobile} />

        {/* Page Content */}
        <main className="flex-grow p-4 overflow-y-auto bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MedicalLayout;
