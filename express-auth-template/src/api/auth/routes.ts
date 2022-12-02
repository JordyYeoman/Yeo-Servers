import { createSessionSchema } from "./schema";
import express from "express";
import validateResource from "../../middlware/validateResource";
import { createSessionHandler } from "./controller";

const router = express.Router();

router.post(
  "/session",
  validateResource(createSessionSchema),
  createSessionHandler
);

export default router;
