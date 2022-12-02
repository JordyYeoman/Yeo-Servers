import { createSessionSchema } from "./schema";
import express from "express";
import validateResource from "../../middlware/validateResource";
import { createSessionHandler, refreshAccessTokenHandler } from "./controller";

const router = express.Router();

router.post(
  "/session",
  validateResource(createSessionSchema),
  createSessionHandler
);

router.post("/session/refresh", refreshAccessTokenHandler);

export default router;
