// components/LoadingScreen.jsx
import React from "react";
import resources from "../../resource";

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <img
        src={resources.CustomLoader.src} 
        alt="Loading..."
        className="w-28 h-28"
      />
    </div>
  );
};

export default LoadingScreen;
