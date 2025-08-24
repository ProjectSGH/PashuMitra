import { useEffect, useState } from "react";
import axios from "axios";
import ProfileHeader from "../../components/Farmer/Profile/ProfileHeader";
import ProfileCard from "../../components/Farmer/Profile/ProfileCard";
import ProfileInformation from "../../components/Farmer/Profile/ProfileInformation";
import resources from "../../resource";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [verificationData, setVerificationData] = useState(null); // ✅ New
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchUserData = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/users/${user._id}`
      );
      setUserData(res.data);

      // ✅ Also fetch verification status
      const farmerId = res.data?.farmerProfile?._id;
      if (farmerId) {
        const vRes = await axios.get(
          `http://localhost:5000/api/farmer/varify/status/${farmerId}`
        );
        setVerificationData(vRes.data);
      }
    } catch (err) {
      console.error("Error fetching user/verification data", err);
    }
  };

  useEffect(() => {
    if (user && user._id) {
      fetchUserData();
    }
  }, []);

  if (!userData)
    return (
      <div className="flex justify-center items-center min-h-[300px] py-24">
        <img
          src={resources.CustomLoader.src}
          alt="Loading..."
          className="w-20 h-20"
        />
      </div>
    );

  return (
    <div className="h-auto mt-5 bg-gray-50 flex flex-col mb-5">
      <main className="flex-grow container mx-auto px-4 py-6">
        <ProfileHeader
          userData={userData}
          verificationData={verificationData}
        />{" "}
        {/* ✅ Pass verificationData */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="md:col-span-1">
            <ProfileCard userData={userData} />
          </div>
          <div className="md:col-span-2">
            <ProfileInformation
              userData={userData}
              onUserUpdate={fetchUserData} // ✅ important
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;
