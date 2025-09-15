import Campaign from "../models/Common/campaignModel.js";
import DoctorHistory from "../models/Doctor/DoctorCampaignHistory.js";
import CampaignRegistration from "../models/Farmer/FarmerCampaginRegisteration.js";
// ✅ Create new campaign
export const createCampaign = async (req, res) => {
    try {
        const { organizerDoctor } = req.body; // frontend sends doctorId

        if (!organizerDoctor) {
            return res.status(400).json({ message: "Doctor ID is required" });
        }

        const campaign = new Campaign({
            ...req.body,
            organizerDoctor,
        });

        await campaign.save();
        res.status(201).json(campaign);
    } catch (err) {
        res.status(400).json({ message: "Error creating campaign", error: err.message });
    }
};

// ✅ Get all active campaigns
export const getActiveCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({ isActive: true })
      .populate("organizerDoctor", "name email");

    const now = new Date();

    // calculate progress dynamically
    const campaignsWithProgress = campaigns.map((c) => {
      let progress = 0;
      if (c.startDate && c.endDate) {
        const total = new Date(c.endDate) - new Date(c.startDate);
        const passed = now - new Date(c.startDate);
        progress = Math.min(100, Math.max(0, Math.round((passed / total) * 100)));
      }
      return { ...c.toObject(), progress };
    });

    // ✅ only send response ONCE
    res.json(campaignsWithProgress);
  } catch (err) {
    res.status(500).json({ message: "Error fetching campaigns", error: err.message });
  }
};

// ✅ Get doctor campaign history
export const getDoctorHistory = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const history = await DoctorHistory.find({ doctor: doctorId })
            .sort({ createdAt: -1 });
        res.json(history);
    } catch (err) {
        res
            .status(500)
            .json({ message: "Error fetching doctor history", error: err.message });
    }
};

// ✅ Auto delete expired campaigns
export const autoDeleteExpiredCampaigns = async () => {
    try {
        const now = new Date();

        const expiredCampaigns = await Campaign.find({
            endDate: { $lt: now },
            isActive: true,
        });

        for (let campaign of expiredCampaigns) {
            // doctor history मध्ये save
            await DoctorHistory.create({
                doctor: campaign.organizerDoctor,
                campaignData: campaign.toObject(),
            });

            // campaign delete
            await Campaign.findByIdAndDelete(campaign._id);
        }

        if (expiredCampaigns.length > 0) {
            console.log(
                `✅ ${expiredCampaigns.length} expired campaigns moved to history.`
            );
        }
    } catch (err) {
        console.error("Error in auto-delete campaigns:", err);
    }
};

// ✅ Update campaign
export const updateCampaign = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await Campaign.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        if (!updated) return res.status(404).json({ message: "Campaign not found" });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: "Error updating campaign", error: err.message });
    }
};

// ✅ Delete campaign (move to history)
export const deleteCampaign = async (req, res) => {
    try {
        const { id } = req.params;
        const campaign = await Campaign.findById(id);
        if (!campaign) return res.status(404).json({ message: "Campaign not found" });

        await DoctorHistory.create({
            doctor: campaign.organizerDoctor,
            campaignData: campaign.toObject(),
        });

        await Campaign.findByIdAndDelete(id);

        res.json({ message: "Campaign moved to history" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting campaign", error: err.message });
    }
};

// ✅ Get registrations for a specific campaign (for doctor)
export const getCampaignRegistrations = async (req, res) => {
  try {
    const { campaignId } = req.params;

    // get registrations with farmer info
    const regs = await CampaignRegistration.find({ campaign: campaignId })
      .populate("farmer", "name email phone");

    // ✅ calculate participants correctly (sum of membersAttending, fallback to 1 if not set)
    const participantsCount = regs.reduce(
      (sum, reg) => sum + (reg.membersAttending && reg.membersAttending > 0 ? reg.membersAttending : 1),
      0
    );

    // keep campaign's participant count in sync
    await Campaign.findByIdAndUpdate(
      campaignId,
      { participants: participantsCount },
      { new: true }
    );

    res.json({
      participants: participantsCount,
      registrations: regs,
    });
  } catch (err) {
    console.error("Error in getCampaignRegistrations:", err);
    res.status(500).json({
      message: "Error fetching registrations",
      error: err.message,
    });
  }
};

// ✅ Get total campaigns for a specific doctor
export const getCampaignCountByDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const count = await Campaign.countDocuments({ organizerDoctor: doctorId });
    res.json({ total: count });
  } catch (err) {
    res.status(500).json({ message: "Error fetching campaign count", error: err.message });
  }
};

// ✅ Get recent campaigns for doctor
export const getRecentCampaignsByDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const campaigns = await Campaign.find({ organizerDoctor: doctorId })
      .sort({ createdAt: -1 })
      .limit(5);
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ message: "Error fetching recent campaigns", error: err.message });
  }
};

