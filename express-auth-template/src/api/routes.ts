import express from "express";
import user from "./user/routes";
import auth from "./auth/routes";
import basicTestRoutes from "./basic/routes";

const router = express.Router();

// Default routes for testing
router.use("/", basicTestRoutes);

// User Routes
router.use("/users", user);
router.use("/auth", auth);

export default router;
