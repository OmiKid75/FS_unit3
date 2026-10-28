import User from "../models/User.js";
import Post from "../models/Post.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ users });
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!["admin", "creator"].includes(role)) {
      return res.status(400).json({ message: "Role must be 'admin' or 'creator'" });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = role;
    await user.save();
    res.json({ user });
  } catch (error) {
    next(error);
  }
};

export const getSystemAnalytics = async (req, res, next) => {
  try {
    const [totalUsers, totalPosts, draftCount, scheduledCount, publishedCount, byPlatform] = await Promise.all([
      User.countDocuments(),
      Post.countDocuments(),
      Post.countDocuments({ status: "draft" }),
      Post.countDocuments({ status: "scheduled" }),
      Post.countDocuments({ status: "published" }),
      Post.aggregate([
        { $unwind: "$platforms" },
        { $group: { _id: "$platforms", count: { $sum: 1 } } },
      ]),
    ]);

    const postsPerPlatform = { facebook: 0, instagram: 0, whatsapp: 0 };
    byPlatform.forEach((p) => { postsPerPlatform[p._id] = p.count; });

    res.json({ totalUsers, totalPosts, draftCount, scheduledCount, publishedCount, postsPerPlatform });
  } catch (error) {
    next(error);
  }
};