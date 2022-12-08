import express from "express";
import requireUser from "../../middlware/requireUser";
import validateResource from "../../middlware/validateResource";
import {
  createUserHandler,
  deleteUserHandler,
  forgotPassworHandler,
  getCurrentUserHandler,
  resetPasswordHandler,
  updateUserHandler,
  verifyUserHandler,
} from "./controller";
import {
  createUserSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateUserSchema,
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

// PUT - Update Object
router.put("/update", validateResource(updateUserSchema), updateUserHandler);

router.delete("/delete", requireUser, deleteUserHandler);

export default router;
