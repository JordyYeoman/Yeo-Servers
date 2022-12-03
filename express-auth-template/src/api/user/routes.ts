import express from "express";
import requireUser from "../../middlware/requireUser";
import validateResource from "../../middlware/validateResource";
import {
  createUserHandler,
  forgotPassworHandler,
  getCurrentUserHandler,
  resetPasswordHandler,
  verifyUserHandler,
} from "./controller";
import {
  createUserSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyUserSchema,
} from "./schema";

const router = express.Router();

router.get(
  "/verify/:id/:verificationCode",
  validateResource(verifyUserSchema),
  verifyUserHandler
);

router.get("/me", requireUser, getCurrentUserHandler);

router.post("/", validateResource(createUserSchema), createUserHandler);
router.post(
  "/forgotpassword",
  validateResource(forgotPasswordSchema),
  forgotPassworHandler
);
router.post(
  "/resetpassword/:id/:passwordResetCode",
  validateResource(resetPasswordSchema),
  resetPasswordHandler
);

export default router;
