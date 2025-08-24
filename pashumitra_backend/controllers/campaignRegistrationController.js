import CampaignRegistration from "../models/Farmer/FarmerCampaginRegisteration.js";
import Campaign from "../models/Common/campaignModel.js";

// ✅ Register farmer to campaign
// ✅ Register farmer to campaign
export const registerFarmerToCampaign = async (req, res) => {
  try {
    const { campaignId, farmerId, animalType, animalsCount, membersAttending, timeSlot, remarks } = req.body;

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    // prevent duplicate registration
    const existing = await CampaignRegistration.findOne({ campaign: campaignId, farmer: farmerId });
    if (existing) {
      return res.status(400).json({ message: "Already registered for this campaign" });
    }

    // ✅ Check max capacity
    const requestedSeats = membersAttending && membersAttending > 0 ? membersAttending : 1;
    if (campaign.maxParticipants && (campaign.participants + requestedSeats) > campaign.maxParticipants) {
      return res.status(400).json({ message: "Registration closed. Campaign is full." });
    }

    // save registration
    const registration = new CampaignRegistration({
      campaign: campaignId,
      farmer: farmerId,
      animalType,
      animalsCount,
      membersAttending: requestedSeats,
      timeSlot,
      remarks,
    });

    await registration.save();

    // ✅ increase participants count properly
    campaign.participants = (campaign.participants || 0) + requestedSeats;
    await campaign.save();

    res.status(201).json({
      message: "Registered successfully",
      registration,
      participants: campaign.participants,
    });
  } catch (err) {
    res.status(400).json({ message: "Error registering for campaign", error: err.message });
  }
};

// ✅ Get registrations for a specific campaign (for doctor)
export const getCampaignRegistrations = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const regs = await CampaignRegistration.find({ campaign: campaignId })
      .populate("farmer", "name email phone");
    res.json(regs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching registrations", error: err.message });
  }
};

// ✅ Get farmer’s registered campaigns
export const getFarmerRegistrations = async (req, res) => {
  try {
    const { farmerId } = req.params;
    const regs = await CampaignRegistration.find({ farmer: farmerId })
      .populate("campaign");
    res.json(regs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching farmer registrations", error: err.message });
  }
};

// ✅ Update attendance (doctor marks attended/missed)
export const updateAttendance = async (req, res) => {
  try {
    const { regId } = req.params;
    const { status } = req.body; // "attended" | "missed"

    const updated = await CampaignRegistration.findByIdAndUpdate(
      regId,
      { attendanceStatus: status },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Error updating attendance", error: err.message });
  }
};
