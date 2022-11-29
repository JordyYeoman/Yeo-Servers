import express from "express";
import validateResource from "../../middlware/validateResource";
import { createUserHandler, verifyUserHandler } from "./controller";
import { createUserSchema, verifyUserSchema } from "./schema";

const router = express.Router();

router.get(
  "/verify/:id/:verificationCode",
  validateResource(verifyUserSchema),
  verifyUserHandler
);

router.post("/", validateResource(createUserSchema), createUserHandler);

export default router;
