import Post from "../models/Post.js";

export const getAnalytics = async (req, res, next) => {
  try {
    const authorId = req.user._id;

    const [totalPosts, draftCount, publishedCount, scheduledCount, byPlatform] = await Promise.all([
      Post.countDocuments({ author: authorId }),
      Post.countDocuments({ author: authorId, status: "draft" }),
      Post.countDocuments({ author: authorId, status: "published" }),
      Post.countDocuments({ author: authorId, status: "scheduled" }),
      Post.aggregate([
        { $match: { author: authorId } },
        { $unwind: "$platforms" },
        { $group: { _id: "$platforms", count: { $sum: 1 } } },
      ]),
    ]);

    const postsPerPlatform = { facebook: 0, instagram: 0, whatsapp: 0 };
    byPlatform.forEach((p) => { postsPerPlatform[p._id] = p.count; });

    const mostActivePlatform =
      Object.entries(postsPerPlatform).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const monthly = await Post.aggregate([
      { $match: { author: authorId, createdAt: { $gte: sixMonthsAgo } } },
      { $group: { _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } }, count: { $sum: 1 } } },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    res.json({
      totalPosts, draftCount, publishedCount, scheduledCount,
      postsPerPlatform, mostActivePlatform,
      monthlyTrend: monthly.map((m) => ({ year: m._id.year, month: m._id.month, count: m.count })),
    });
  } catch (error) {
    next(error);
  }
};