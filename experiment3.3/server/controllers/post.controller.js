import Post from "../models/Post.js";
import Media from "../models/Media.js";
import { validatePlatforms } from "../utils/platformValidation.js";

export const createPost = async (req, res, next) => {
  try {
    const { content, platforms = [], status = "draft", scheduledDate, hashtags = [] } = req.body;

    if (status !== "draft") {
      const { valid, errors } = validatePlatforms(content, platforms);
      if (!valid) return res.status(400).json({ message: "Validation failed", errors });
    }

    if (status === "scheduled" && !scheduledDate) {
      return res.status(400).json({ message: "Scheduled posts require a date and time" });
    }

    const post = await Post.create({
      content,
      platforms,
      status,
      scheduledDate: status === "scheduled" ? scheduledDate : null,
      hashtags,
      author: req.user._id,
    });

    res.status(201).json({ post });
  } catch (error) {
    next(error);
  }
};

export const getPosts = async (req, res, next) => {
  try {
    const { platform, status, keyword, from, to } = req.query;
    const query = { author: req.user._id };

    if (platform) query.platforms = platform;
    if (status) query.status = status;
    if (keyword) query.content = { $regex: keyword, $options: "i" };
    if (from || to) {
      query.scheduledDate = {};
      if (from) query.scheduledDate.$gte = new Date(from);
      if (to) query.scheduledDate.$lte = new Date(to);
    }

    const posts = await Post.find(query).populate("media").sort({ updatedAt: -1 });
    res.json({ posts });
  } catch (error) {
    next(error);
  }
};

export const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findOne({ _id: req.params.id, author: req.user._id }).populate("media");
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json({ post });
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findOne({ _id: req.params.id, author: req.user._id });
    if (!post) return res.status(404).json({ message: "Post not found" });

    const { content, platforms, status, scheduledDate, hashtags } = req.body;

    if (content !== undefined) post.content = content;
    if (platforms !== undefined) post.platforms = platforms;
    if (hashtags !== undefined) post.hashtags = hashtags;

    if (status !== undefined) {
      if (status !== "draft") {
        const { valid, errors } = validatePlatforms(content ?? post.content, platforms ?? post.platforms);
        if (!valid) return res.status(400).json({ message: "Validation failed", errors });
      }
      post.status = status;
    }

    if (scheduledDate !== undefined) post.scheduledDate = scheduledDate;

    await post.save();
    res.json({ post });
  } catch (error) {
    next(error);
  }
};

// Admins can delete any post; creators only their own
export const deletePost = async (req, res, next) => {
  try {
    const query =
      req.user.role === "admin"
        ? { _id: req.params.id }
        : { _id: req.params.id, author: req.user._id };

    const post = await Post.findOneAndDelete(query);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json({ message: "Post deleted" });
  } catch (error) {
    next(error);
  }
};

export const getDrafts = async (req, res, next) => {
  try {
    const drafts = await Post.find({ author: req.user._id, status: "draft" })
      .populate("media")
      .sort({ updatedAt: -1 });
    res.json({ posts: drafts });
  } catch (error) {
    next(error);
  }
};

export const getScheduledPosts = async (req, res, next) => {
  try {
    const scheduled = await Post.find({ author: req.user._id, status: "scheduled" })
      .populate("media")
      .sort({ scheduledDate: 1 });
    res.json({ posts: scheduled });
  } catch (error) {
    next(error);
  }
};

export const uploadMedia = async (req, res, next) => {
  try {
    const post = await Post.findOne({ _id: req.params.id, author: req.user._id });
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const mediaDocs = await Promise.all(
      req.files.map((file) =>
        Media.create({
          fileName: file.originalname,
          fileType: file.mimetype,
          fileUrl: `/uploads/${file.filename}`,
          uploadedBy: req.user._id,
        })
      )
    );

    post.media.push(...mediaDocs.map((m) => m._id));
    await post.save();

    res.status(201).json({ media: mediaDocs, post });
  } catch (error) {
    next(error);
  }
};

export const validateContent = async (req, res, next) => {
  try {
    const { content = "", platforms = [] } = req.body;
    const result = validatePlatforms(content, platforms);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
export const getPublishedPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ status: "published" })
      .populate("media")
      .populate("author", "name")
      .sort({ createdAt: -1 })
      .limit(100);
    res.json({ posts });
  } catch (error) {
    next(error);
  }
};