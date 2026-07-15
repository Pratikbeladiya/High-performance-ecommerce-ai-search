import Activity from "../models/Activity.js";

/**
 * Utility to log user/system activities to MongoDB.
 * @param {string|null} userId - The ID of the admin who performed the action (optional)
 * @param {string} description - Description of the action
 * @param {string} type - Action category ('product', 'inventory', 'order', 'search', 'auth', 'system')
 * @param {string} status - Style color status ('success', 'warning', 'danger', 'info')
 */
export const logActivity = async (userId, description, type, status = "info") => {
  try {
    const activity = new Activity({
      user: userId || null,
      description,
      type,
      status,
    });
    await activity.save();
    console.log(`Activity logged: [${type}] ${description}`);
  } catch (error) {
    console.error("Failed to log activity:", error.message);
  }
};
