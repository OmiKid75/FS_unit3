import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    platforms: {
      type: [String],
      enum: ["facebook", "instagram", "whatsapp"],
      default: [],
    },
    status: {
      type: String,
      enum: ["draft", "scheduled", "published"],
      default: "draft",
    },
    scheduledDate: { type: Date, default: null },
    media: [{ type: mongoose.Schema.Types.ObjectId, ref: "Media" }],
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    hashtags: { type: [String], default: [] },
  },
  { timestamps: true }
);

postSchema.index({ author: 1, status: 1 });
postSchema.index({ author: 1, scheduledDate: 1 });

export default mongoose.model("Post", postSchema);