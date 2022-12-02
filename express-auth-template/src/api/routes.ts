import express from "express";
import user from "./user/routes";
import auth from "./auth/routes";

const router = express.Router();

router.get("/healthcheck", (_, res) => res.sendStatus(200));

// User Routes
router.use("/users", user);
router.use("/auth", auth);

export default router;
