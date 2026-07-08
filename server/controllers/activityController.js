import Activity from "../models/Activity.js";

// @desc    Get recent activities
// @route   GET /api/activities
// @access  Private/Admin
export const getActivities = async (req, res) => {
  try {
    const activities = await Activity.find({})
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
