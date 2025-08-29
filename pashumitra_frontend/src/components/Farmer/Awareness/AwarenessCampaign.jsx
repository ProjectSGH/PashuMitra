"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Megaphone, Phone, MapPin, Calendar, Users } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import resource from "../../../resource";

export default function AwarenessCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [formData, setFormData] = useState({
    animalType: "",
    selectedAnimals: [],
    animalsCount: "",
    membersAttending: 1,
    remarks: "",
  });
  const [registrations, setRegistrations] = useState([]);

  // ✅ Fetch farmer registrations
  useEffect(() => {
    const fetchRegs = async () => {
      const farmer = JSON.parse(localStorage.getItem("user"));
      if (!farmer?._id) return;

      const res = await axios.get(
        `http://localhost:5000/api/campaign-registrations/farmer/${farmer._id}`
      );

      // Extract only campaign IDs
      setRegistrations(res.data.map((r) => r.campaign._id));
    };
    fetchRegs();
  }, []);

  // ✅ Fetch active campaigns
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/campaigns/active"
        );
        setCampaigns(res.data);
      } catch (err) {
        console.error("Error fetching campaigns", err);
      }
    };
    fetchCampaigns();
  }, []);

  // ✅ Handle checkbox change
  const toggleAnimal = (animal) => {
    setFormData((prev) => {
      const updated = prev.selectedAnimals.includes(animal)
        ? prev.selectedAnimals.filter((a) => a !== animal)
        : [...prev.selectedAnimals, animal];
      return { ...prev, selectedAnimals: updated };
    });
  };

  // ✅ Register Farmer
  const handleRegister = async () => {
    try {
      const farmer = JSON.parse(localStorage.getItem("user"));
      if (!farmer?._id) {
        toast.error("Please login as Farmer first!");
        return;
      }

      // Validation for with_animals campaigns
      if (selectedCampaign.campaignType === "with_animals") {
        if (
          formData.selectedAnimals.length === 0 &&
          !formData.animalType.trim()
        ) {
          toast.error(
            "Select at least one animal or enter custom animal type."
          );
          return;
        }
        if (!formData.animalsCount) {
          toast.error("Please enter number of animals.");
          return;
        }
      }

      const payload = {
        campaignId: selectedCampaign._id,
        farmerId: farmer._id,
        animalsCount: formData.animalsCount,
        membersAttending: formData.membersAttending,
        remarks: formData.remarks,
        animalType: formData.selectedAnimals.join(", ") || formData.animalType,
      };

      await axios.post(
        "http://localhost:5000/api/campaign-registrations/register",
        payload
      );

      // ✅ Update state immediately so UI reflects
      setRegistrations((prev) => [...prev, selectedCampaign._id]);

      toast.success("Registered successfully!", {
        duration: 4000,
        position: "bottom-right",
        style: {
          backgroundColor: "#4CAF50",
          color: "#fff",
          fontWeight: "bold",
          borderRadius: "8px",
        },
      });

      setSelectedCampaign(null);
      setFormData({
        animalType: "",
        selectedAnimals: [],
        animalsCount: "",
        membersAttending: 1,
        remarks: "",
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed", {
        duration: 4000,
        position: "bottom-right",
        style: {
          backgroundColor: "#f44336",
          color: "#fff",
          fontWeight: "bold",
          borderRadius: "8px",
        },
      });
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Megaphone className="w-6 h-6 text-orange-600" /> Campaigns
      </h2>
      <div className="space-y-6">
        {campaigns.map((camp) => (
          <motion.div
            key={camp._id}
            whileHover={{ scale: 1.02 }}
            className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg transition-all hover:shadow-xl"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">{camp.title}</h3>

              {registrations.includes(camp._id) && (
                <div className="flex items-center gap-1 text-green-600 font-semibold text-sm">
                  <span>Registered</span>
                  <img
                    src={resource.customVerificationMark.src}
                    alt="Registered"
                    className="w-4 h-4"
                  />
                </div>
              )}
            </div>

            {/* Dates & Time */}
            <div className="flex flex-wrap gap-4 mb-3 text-gray-600 text-sm">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(camp.startDate).toLocaleDateString()} →{" "}
                {new Date(camp.endDate).toLocaleDateString()}
              </div>
              {camp.startTime && camp.endTime && (
                <div className="flex items-center gap-1">
                  🕒 {camp.startTime} - {camp.endTime}
                </div>
              )}
            </div>

            {/* Location */}
            {camp.location && (
              <div className="flex items-center gap-1 text-gray-700 mb-3">
                <MapPin className="w-4 h-4" /> {camp.location}
              </div>
            )}

            {/* Description */}
            {camp.description && (
              <p className="text-gray-700 mb-3">{camp.description}</p>
            )}

            {/* Extra Details */}
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
              {camp.organizerOrg && (
                <p>
                  🏥 <b>Organizer:</b> {camp.organizerOrg}
                </p>
              )}
              {camp.contact && (
                <p>
                  📞 <b>Contact:</b> {camp.contact}
                </p>
              )}
              {camp.benefits && (
                <p>
                  🎁 <b>Benefits:</b> {camp.benefits}
                </p>
              )}
              {camp.animalType && (
                <p>
                  🐄 <b>Animal Type:</b> {camp.animalType}
                </p>
              )}
              {camp.maxParticipants && (
                <p>
                  👥 <b>Max Participants:</b> {camp.maxParticipants}
                </p>
              )}
            </div>

            {/* Register Button */}
            {!registrations.includes(camp._id) && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-2 bg-gray-900 text-white rounded-lg shadow-md"
                onClick={() => setSelectedCampaign(camp)}
              >
                Register
              </motion.button>
            )}
          </motion.div>
        ))}
      </div>

      {/* Registration Modal */}
      <AnimatePresence>
        {selectedCampaign && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg"
            >
              <h3 className="text-lg font-bold mb-4 text-orange-700">
                Register for {selectedCampaign.title}
              </h3>

              {/* Show details */}
              <div className="text-sm text-gray-700 mb-4 space-y-1">
                <p>
                  <Calendar className="w-4 h-4 inline" />{" "}
                  {new Date(selectedCampaign.startDate).toLocaleDateString()} →{" "}
                  {new Date(selectedCampaign.endDate).toLocaleDateString()}
                </p>
                <p>📍 {selectedCampaign.location}</p>
                {selectedCampaign.organizerOrg && (
                  <p>🏥 {selectedCampaign.organizerOrg}</p>
                )}
                {selectedCampaign.benefits && (
                  <p>🎁 {selectedCampaign.benefits}</p>
                )}
                {selectedCampaign.contact && (
                  <p>📞 {selectedCampaign.contact}</p>
                )}
              </div>

              {/* If with_animals campaign → show extra inputs */}
              {selectedCampaign.campaignType === "with_animals" && (
                <div className="mb-3">
                  <label className="block text-sm mb-1 text-gray-600">
                    Select Animal Type
                  </label>
                  <div className="flex gap-4 flex-wrap mb-2">
                    {selectedCampaign.animalType
                      ?.split(",")
                      .map((animal, idx) => (
                        <label key={idx} className="flex items-center gap-1">
                          <input
                            type="checkbox"
                            checked={formData.selectedAnimals.includes(
                              animal.trim()
                            )}
                            onChange={() => toggleAnimal(animal.trim())}
                          />
                          <span>{animal.trim()}</span>
                        </label>
                      ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Other Animal (Optional)"
                    value={formData.animalType}
                    onChange={(e) =>
                      setFormData({ ...formData, animalType: e.target.value })
                    }
                    className="border rounded-lg px-3 py-2 w-full"
                  />
                </div>
              )}

              {/* Animals Count */}
              {selectedCampaign.campaignType === "with_animals" && (
                <div className="mb-3">
                  <label className="block text-sm mb-1 text-gray-600">
                    No. of Animals
                  </label>
                  <input
                    type="number"
                    value={formData.animalsCount}
                    onChange={(e) =>
                      setFormData({ ...formData, animalsCount: e.target.value })
                    }
                    className="border rounded-lg px-3 py-2 w-full"
                  />
                </div>
              )}

              {/* Members Attending */}
              <div className="mb-3">
                <label className="block text-sm mb-1 text-gray-600">
                  Members Attending
                </label>
                <input
                  type="number"
                  value={formData.membersAttending}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      membersAttending: e.target.value,
                    })
                  }
                  className="border rounded-lg px-3 py-2 w-full"
                />
              </div>

              {/* Remarks */}
              <div className="mb-3">
                <label className="block text-sm mb-1 text-gray-600">
                  Remarks
                </label>
                <textarea
                  value={formData.remarks}
                  onChange={(e) =>
                    setFormData({ ...formData, remarks: e.target.value })
                  }
                  className="border rounded-lg px-3 py-2 w-full"
                  placeholder="Any special note..."
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setSelectedCampaign(null)}
                  className="px-4 py-2 bg-gray-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRegister}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg"
                >
                  Confirm Registration
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
