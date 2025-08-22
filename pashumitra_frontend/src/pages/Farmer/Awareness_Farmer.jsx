"use client";
import React from "react";
import AwarenessPosts from "../../components/Farmer/Awareness/AwarenessPost";
import AwarenessBlogs from "../../components/Farmer/Awareness/AwarenessBlogs";
import AwarenessCampaigns from "../../components/Farmer/Awareness/AwarenessCampaign";

export default function Awareness_Farmer() {
  // const posts = [/* fetch from backend later */];
  // const blogs = [/* fetch from backend later */];
  // const campaigns = [/* fetch from backend later */];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[80vw] mx-auto space-y-12">
        <AwarenessPosts />
        <AwarenessBlogs  />
        <AwarenessCampaigns  />
      </div>
    </div>
  );
}
