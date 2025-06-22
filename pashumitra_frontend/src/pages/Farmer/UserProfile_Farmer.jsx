import { useEffect, useState } from "react";
import axios from "axios";
import ProfileHeader from "../../components/Farmer/Profile/ProfileHeader";
import ProfileCard from "../../components/Farmer/Profile/ProfileCard";
import ProfileInformation from "../../components/Farmer/Profile/ProfileInformation";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [storeData, setStoreData] = useState(null);
  const [showStoreForm, setShowStoreForm] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user && user._id) {
      axios
        .get(`http://localhost:5000/api/users/${user._id}`)
        .then((res) => {
          setUserData(res.data);
        })
        .catch((err) => console.error("Error fetching user data", err));
    }
  }, []);

  if (!userData)
    return <div className="text-center mt-10">Loading profile...</div>;

  return (
    <div className="h-auto mt-5 bg-gray-50 flex flex-col mb-5">
      <main className="flex-grow container mx-auto px-4 py-6">
        <ProfileHeader />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="md:col-span-1">
            <ProfileCard userData={userData} />
          </div>
          <div className="md:col-span-2">
            <ProfileInformation
              userData={userData}
              onUserUpdate={setUserData}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;
