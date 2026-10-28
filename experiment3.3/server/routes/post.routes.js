import express from "express";
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  getDrafts,
  getScheduledPosts,
  uploadMedia,
  validateContent,
  getPublishedPosts,
} from "../controllers/post.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

router.use(protect);

router.get("/drafts", getDrafts);
router.get("/scheduled", getScheduledPosts);
router.get("/published", getPublishedPosts);
router.post("/validate", validateContent);

router.route("/").get(getPosts).post(createPost);
router.route("/:id").get(getPostById).put(updatePost).delete(deletePost);
router.post("/:id/media", upload.array("files", 10), uploadMedia);

export default router;