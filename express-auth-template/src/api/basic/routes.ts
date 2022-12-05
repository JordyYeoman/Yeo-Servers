import express from "express";
import MessageResponse from "../../interfaces/MessageResponse";

const router = express.Router();

router.get<{}, MessageResponse>("/healthcheck", (_, res) => {
  res.status(200);
  res.json({
    message: "All good here!",
  });
});
router.get<{}, MessageResponse>("/", (req, res) => {
  res.json({
    message: "API - 👋🌎🌍🌏",
  });
});

export default router;
