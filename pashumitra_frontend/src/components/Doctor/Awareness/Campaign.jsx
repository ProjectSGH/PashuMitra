"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Calendar, Users, ArrowRight, Plus } from "lucide-react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const CampaignsTab = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [doctorId, setDoctorId] = useState(null);
  const [doctorName, setDoctorName] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loadingRegs, setLoadingRegs] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    title: "",
    description: "",
    location: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    organizerOrg: "",
    benefits: "",
    contact: "",
    campaignType: "awareness",
    animalType: "",
    selectedAnimals: [], // ✅ checkbox values
    maxParticipants: "",
  });

  // ✅ Fetch Doctor Info (Logged-in user)
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser?._id) return;
        setDoctorId(storedUser._id);

        // Doctor details fetch करायचे असल्यास
        const res = await axios.get(
          `http://localhost:5000/api/users/${storedUser._id}`
        );
        setDoctorName(res.data.name);
      } catch (err) {
        console.error("Error fetching doctor", err);
      }
    };
    fetchDoctor();
  }, []);

  // ✅ Handle Checkbox Change
  const handleAnimalCheckbox = (animal) => {
    setNewCampaign((prev) => {
      const updated = prev.selectedAnimals.includes(animal)
        ? prev.selectedAnimals.filter((a) => a !== animal)
        : [...prev.selectedAnimals, animal];
      return { ...prev, selectedAnimals: updated };
    });
  };

  // ✅ Fetch Campaigns
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/campaigns/active"
        );
        const campaignsData = res.data;

        // 🔥 Fetch correct participants for each campaign
        const updatedCampaigns = await Promise.all(
          campaignsData.map(async (camp) => {
            try {
              const regRes = await axios.get(
                `http://localhost:5000/api/campaigns/${camp._id}/registrations`
              );
              return { ...camp, participants: regRes.data.participants };
            } catch {
              return camp;
            }
          })
        );

        setCampaigns(updatedCampaigns);
      } catch (err) {
        console.error("Error fetching campaigns", err);
      }
    };
    fetchCampaigns();
  }, []);

  // ✅ Handle Create Campaign
  const handleCreateCampaign = async () => {
    if (
      !newCampaign.title ||
      !newCampaign.description ||
      !newCampaign.startDate
    ) {
      toast.error("Please fill in Title, Description, and Start Date.", {
        duration: 4000,
        position: "bottom-right",
        style: {
          backgroundColor: "#f44336", // red
          color: "#fff",
          fontWeight: "bold",
          borderRadius: "8px",
        },
      });
      return;
    }

    if (newCampaign.campaignType === "with_animals") {
      if (
        newCampaign.selectedAnimals.length === 0 &&
        !newCampaign.animalType.trim()
      ) {
        toast.error(
          "Please select at least one animal or enter a custom animal type.",
          {
            duration: 4000,
            position: "bottom-right",
            style: {
              backgroundColor: "#f44336",
              color: "#fff",
              fontWeight: "bold",
              borderRadius: "8px",
            },
          }
        );
        return;
      }
    }

    const payload = {
      ...newCampaign,
      organizerDoctor: doctorId,
      animalType:
        newCampaign.selectedAnimals.join(", ") || newCampaign.animalType,
    };

    try {
      const res = await axios.post(
        "http://localhost:5000/api/campaigns/create",
        payload
      );
      setCampaigns([...campaigns, res.data]);

      // Reset form
      setNewCampaign({
        title: "",
        description: "",
        location: "",
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
        organizerOrg: "",
        benefits: "",
        contact: "",
        campaignType: "awareness",
        animalType: "",
        selectedAnimals: [],
        maxParticipants: "",
      });
      setShowForm(false);

      // ✅ Success toast
      toast.success("Campaign created successfully!", {
        duration: 4000,
        position: "bottom-right",
        style: {
          backgroundColor: "#4CAF50", // green
          color: "#fff",
          fontWeight: "bold",
          borderRadius: "8px",
        },
      });
    } catch (err) {
      console.error("Error creating campaign", err);
      toast.error("Error saving campaign", {
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <Target className="w-6 h-6 text-blue-600 mr-2" /> Ongoing Campaigns
        </h2>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowForm(!showForm)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" /> Create Campaign
        </motion.button>
      </div>

      {/* Create Campaign Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Campaign Title"
                value={newCampaign.title}
                onChange={(e) =>
                  setNewCampaign({ ...newCampaign, title: e.target.value })
                }
                className="border rounded-lg px-4 py-2"
              />
              <input
                type="text"
                placeholder="Organization Name"
                value={newCampaign.organizerOrg}
                onChange={(e) =>
                  setNewCampaign({
                    ...newCampaign,
                    organizerOrg: e.target.value,
                  })
                }
                className="border rounded-lg px-4 py-2"
              />

              <input
                type="text"
                placeholder="Location"
                value={newCampaign.location}
                onChange={(e) =>
                  setNewCampaign({ ...newCampaign, location: e.target.value })
                }
                className="border rounded-lg px-4 py-2"
              />
              <input
                type="text"
                placeholder="Benefits"
                value={newCampaign.benefits}
                onChange={(e) =>
                  setNewCampaign({ ...newCampaign, benefits: e.target.value })
                }
                className="border rounded-lg px-4 py-2"
              />

              {/* Dates with labels */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={newCampaign.startDate}
                  onChange={(e) =>
                    setNewCampaign({
                      ...newCampaign,
                      startDate: e.target.value,
                    })
                  }
                  className="border rounded-lg px-4 py-2 w-full"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={newCampaign.endDate}
                  onChange={(e) =>
                    setNewCampaign({ ...newCampaign, endDate: e.target.value })
                  }
                  className="border rounded-lg px-4 py-2 w-full"
                />
              </div>

              {/* Times with labels */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  value={newCampaign.startTime}
                  onChange={(e) =>
                    setNewCampaign({
                      ...newCampaign,
                      startTime: e.target.value,
                    })
                  }
                  className="border rounded-lg px-4 py-2 w-full"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  value={newCampaign.endTime}
                  onChange={(e) =>
                    setNewCampaign({ ...newCampaign, endTime: e.target.value })
                  }
                  className="border rounded-lg px-4 py-2 w-full"
                />
              </div>

              <input
                type="text"
                placeholder="Contact Number"
                value={newCampaign.contact}
                onChange={(e) =>
                  setNewCampaign({ ...newCampaign, contact: e.target.value })
                }
                className="border rounded-lg px-4 py-2"
              />

              {/* Campaign Type */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Campaign Type
                </label>
                <select
                  value={newCampaign.campaignType}
                  onChange={(e) =>
                    setNewCampaign({
                      ...newCampaign,
                      campaignType: e.target.value,
                    })
                  }
                  className="border rounded-lg px-4 py-2 w-full"
                >
                  <option value="awareness">Awareness</option>
                  <option value="with_animals">With Animals</option>
                </select>
              </div>

              {/* Animal Type Section - Visible only if with_animals */}
              {newCampaign.campaignType === "with_animals" && (
                <div className="md:col-span-2 mt-2">
                  <label className="block text-sm text-gray-600 mb-2">
                    Select Animal Type
                  </label>
                  <div className="flex gap-4 flex-wrap">
                    {["Cow", "Buffalo", "Goat", "Sheep"].map((animal) => (
                      <label
                        key={animal}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          checked={newCampaign.selectedAnimals.includes(animal)}
                          onChange={() => handleAnimalCheckbox(animal)}
                        />
                        <span>{animal}</span>
                      </label>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Other Animal (Optional)"
                    value={newCampaign.animalType}
                    onChange={(e) =>
                      setNewCampaign({
                        ...newCampaign,
                        animalType: e.target.value,
                      })
                    }
                    className="border rounded-lg px-4 py-2 mt-2 w-full"
                  />
                </div>
              )}

              <input
                type="number"
                placeholder="Max Participants (Optional)"
                value={newCampaign.maxParticipants}
                onChange={(e) =>
                  setNewCampaign({
                    ...newCampaign,
                    maxParticipants: e.target.value,
                  })
                }
                className="border rounded-lg px-4 py-2"
              />

              <textarea
                placeholder="Campaign Details"
                value={newCampaign.description}
                onChange={(e) =>
                  setNewCampaign({
                    ...newCampaign,
                    description: e.target.value,
                  })
                }
                className="border rounded-lg px-4 py-2 md:col-span-2"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleCreateCampaign}
              className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg"
            >
              Save Campaign
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Campaign List */}
      <div className="space-y-4">
        {campaigns.map((campaign) => (
          <motion.div
            key={campaign._id}
            whileHover={{ scale: 1.01 }}
            className="p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md bg-white transition-all"
          >
            <h3 className="text-lg font-medium text-gray-900">
              {campaign.title}
            </h3>
            <p className="text-gray-600 text-sm mt-1">{campaign.description}</p>

            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-3">
              <span>
                <Calendar className="w-4 h-4 inline mr-1" />{" "}
                {new Date(campaign.startDate).toLocaleDateString()} →{" "}
                {new Date(campaign.endDate).toLocaleDateString()}
              </span>
              <span>
                <Users className="w-4 h-4 inline mr-1" />{" "}
                {campaign.participants} Participants
              </span>
              <span>📍 {campaign.location}</span>
              {campaign.organizerOrg && <span>🏥 {campaign.organizerOrg}</span>}
              {doctorName && <span>👨‍⚕️ {doctorName}</span>}
              {campaign.contact && <span>📞 {campaign.contact}</span>}
              {campaign.benefits && <span>🎁 {campaign.benefits}</span>}
              {campaign.animalType && <span>🐄 {campaign.animalType}</span>}
            </div>

            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${campaign.progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {campaign.progress}% Completed
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="mt-4 flex items-center text-blue-600 hover:underline"
              onClick={async () => {
                setSelectedCampaign(campaign);
                setLoadingRegs(true);
                try {
                  const res = await axios.get(
                    `http://localhost:5000/api/campaigns/${campaign._id}/registrations`
                  );

                  // update registrations array
                  setRegistrations(res.data.registrations || []);

                  // update selected campaign with latest participants count
                  setSelectedCampaign((prev) => ({
                    ...prev,
                    participants: res.data.participants,
                  }));

                  // also update campaigns list so card count updates too
                  setCampaigns((prev) =>
                    prev.map((c) =>
                      c._id === campaign._id
                        ? { ...c, participants: res.data.participants }
                        : c
                    )
                  );
                } catch (err) {
                  toast.error("Failed to load registrations!", {
                    duration: 4000,
                    position: "bottom-right",
                    style: {
                      backgroundColor: "#f44336",
                      color: "#fff",
                      fontWeight: "bold",
                      borderRadius: "8px",
                    },
                  });
                } finally {
                  setLoadingRegs(false);
                }
              }}
            >
              View Details <ArrowRight className="w-4 h-4 ml-1" />
            </motion.button>
          </motion.div>
        ))}
      </div>
      {/* View / Edit Modal */}
      <AnimatePresence>
        {selectedCampaign && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl overflow-y-auto max-h-[90vh]"
            >
              <h3 className="text-lg font-semibold mb-4">Edit Campaign</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title */}
                <input
                  type="text"
                  value={selectedCampaign.title}
                  onChange={(e) =>
                    setSelectedCampaign({
                      ...selectedCampaign,
                      title: e.target.value,
                    })
                  }
                  className="border rounded-lg px-4 py-2"
                  placeholder="Campaign Title"
                />

                {/* Organization */}
                <input
                  type="text"
                  value={selectedCampaign.organizerOrg || ""}
                  onChange={(e) =>
                    setSelectedCampaign({
                      ...selectedCampaign,
                      organizerOrg: e.target.value,
                    })
                  }
                  className="border rounded-lg px-4 py-2"
                  placeholder="Organization"
                />

                {/* Location */}
                <input
                  type="text"
                  value={selectedCampaign.location || ""}
                  onChange={(e) =>
                    setSelectedCampaign({
                      ...selectedCampaign,
                      location: e.target.value,
                    })
                  }
                  className="border rounded-lg px-4 py-2"
                  placeholder="Location"
                />

                {/* Benefits */}
                <input
                  type="text"
                  value={selectedCampaign.benefits || ""}
                  onChange={(e) =>
                    setSelectedCampaign({
                      ...selectedCampaign,
                      benefits: e.target.value,
                    })
                  }
                  className="border rounded-lg px-4 py-2"
                  placeholder="Benefits"
                />

                {/* Contact */}
                <input
                  type="text"
                  value={selectedCampaign.contact || ""}
                  onChange={(e) =>
                    setSelectedCampaign({
                      ...selectedCampaign,
                      contact: e.target.value,
                    })
                  }
                  className="border rounded-lg px-4 py-2"
                  placeholder="Contact"
                />

                {/* Start / End Dates */}
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={selectedCampaign.startDate?.slice(0, 10) || ""}
                    onChange={(e) =>
                      setSelectedCampaign({
                        ...selectedCampaign,
                        startDate: e.target.value,
                      })
                    }
                    className="border rounded-lg px-4 py-2 w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={selectedCampaign.endDate?.slice(0, 10) || ""}
                    onChange={(e) =>
                      setSelectedCampaign({
                        ...selectedCampaign,
                        endDate: e.target.value,
                      })
                    }
                    className="border rounded-lg px-4 py-2 w-full"
                  />
                </div>

                {/* Start / End Time */}
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={selectedCampaign.startTime || ""}
                    onChange={(e) =>
                      setSelectedCampaign({
                        ...selectedCampaign,
                        startTime: e.target.value,
                      })
                    }
                    className="border rounded-lg px-4 py-2 w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={selectedCampaign.endTime || ""}
                    onChange={(e) =>
                      setSelectedCampaign({
                        ...selectedCampaign,
                        endTime: e.target.value,
                      })
                    }
                    className="border rounded-lg px-4 py-2 w-full"
                  />
                </div>

                {/* Campaign Type */}
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Campaign Type
                  </label>
                  <select
                    value={selectedCampaign.campaignType}
                    onChange={(e) =>
                      setSelectedCampaign({
                        ...selectedCampaign,
                        campaignType: e.target.value,
                      })
                    }
                    className="border rounded-lg px-4 py-2 w-full"
                  >
                    <option value="awareness">Awareness</option>
                    <option value="with_animals">With Animals</option>
                  </select>
                </div>

                {/* Animal Section */}
                {selectedCampaign.campaignType === "with_animals" && (
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-600 mb-2">
                      Animals
                    </label>
                    <div className="flex gap-4 flex-wrap">
                      {["Cow", "Buffalo", "Goat", "Sheep"].map((animal) => (
                        <label
                          key={animal}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="checkbox"
                            checked={selectedCampaign.animalType
                              ?.split(", ")
                              ?.includes(animal)}
                            onChange={(e) => {
                              let current = selectedCampaign.animalType
                                ? selectedCampaign.animalType.split(", ")
                                : [];
                              if (e.target.checked) {
                                current.push(animal);
                              } else {
                                current = current.filter((a) => a !== animal);
                              }
                              setSelectedCampaign({
                                ...selectedCampaign,
                                animalType: current.join(", "),
                              });
                            }}
                          />
                          <span>{animal}</span>
                        </label>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder="Other Animal (Optional)"
                      value={selectedCampaign.animalType || ""}
                      onChange={(e) =>
                        setSelectedCampaign({
                          ...selectedCampaign,
                          animalType: e.target.value,
                        })
                      }
                      className="border rounded-lg px-4 py-2 mt-2 w-full"
                    />
                  </div>
                )}

                {/* Max Participants */}
                <input
                  type="number"
                  value={selectedCampaign.maxParticipants || ""}
                  onChange={(e) =>
                    setSelectedCampaign({
                      ...selectedCampaign,
                      maxParticipants: e.target.value,
                    })
                  }
                  className="border rounded-lg px-4 py-2"
                  placeholder="Max Participants"
                />

                {/* Description */}
                <textarea
                  value={selectedCampaign.description}
                  onChange={(e) =>
                    setSelectedCampaign({
                      ...selectedCampaign,
                      description: e.target.value,
                    })
                  }
                  className="border rounded-lg px-4 py-2 md:col-span-2"
                  placeholder="Campaign Details"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-between mt-4">
                <button
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                  onClick={() => setSelectedCampaign(null)}
                >
                  Cancel
                </button>
                <div className="flex gap-2">
                  {/* Save */}
                  <button
                    className="px-4 py-2 bg-green-600 text-white rounded-lg"
                    onClick={async () => {
                      try {
                        const res = await axios.put(
                          `http://localhost:5000/api/campaigns/${selectedCampaign._id}`,
                          selectedCampaign
                        );
                        setCampaigns((prev) =>
                          prev.map((c) =>
                            c._id === res.data._id ? res.data : c
                          )
                        );
                        toast.success("Campaign updated successfully!", {
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
                      } catch (err) {
                        toast.error("Update failed!", {
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
                    }}
                  >
                    Save
                  </button>
                  {/* Delete */}
                  <button
                    className="px-4 py-2 bg-red-600 text-white rounded-lg"
                    onClick={async () => {
                      try {
                        await axios.delete(
                          `http://localhost:5000/api/campaigns/${selectedCampaign._id}`
                        );
                        setCampaigns((prev) =>
                          prev.filter((c) => c._id !== selectedCampaign._id)
                        );
                        toast.success("Campaign moved to history!", {
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
                      } catch (err) {
                        toast.error("Delete failed!", {
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
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CampaignsTab;
