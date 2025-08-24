"use client";
import React, { useState } from "react";
import AwarenessPosts from "../../components/Farmer/Awareness/AwarenessPost";
import AwarenessBlogs from "../../components/Farmer/Awareness/AwarenessBlogs";
import AwarenessCampaigns from "../../components/Farmer/Awareness/AwarenessCampaign";

export default function Awareness_Farmer() {
  const [activeTab, setActiveTab] = useState("Posts"); // default tab

  const tabs = ["Posts", "Blogs", "Campaigns"];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[80vw] mx-auto space-y-6">
        {/* Dropdown for mobile / Tabs for desktop */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">
            Awareness
          </h1>

          {/* Tabs */}
          <div className="flex space-x-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === tab
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Render active component */}
        <div>
          {activeTab === "Posts" && <AwarenessPosts />}
          {activeTab === "Blogs" && <AwarenessBlogs />}
          {activeTab === "Campaigns" && <AwarenessCampaigns />}
        </div>
      </div>
    </div>
  );
}
