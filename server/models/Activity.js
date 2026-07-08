import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    type: {
      type: String,
      required: [true, "Activity type is required"],
      enum: ["product", "inventory", "order", "search", "auth", "system"],
    },
    status: {
      type: String,
      required: [true, "Status color is required"],
      enum: ["success", "warning", "danger", "info"],
      default: "info",
    },
  },
  {
    timestamps: true,
  }
);

const Activity = mongoose.model("Activity", activitySchema);

export default Activity;
