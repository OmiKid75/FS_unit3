import express from "express";
import { getAllUsers, updateUserRole, getSystemAnalytics } from "../controllers/admin.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";

const router = express.Router();

router.use(protect, authorizeRoles("admin"));

router.get("/users", getAllUsers);
router.put("/users/:id/role", updateUserRole);
router.get("/analytics", getSystemAnalytics);

export default router;