import express from "express";
import validateResource from "../../middlware/validateResource";
import { createUserHandler } from "./controller";
import { createUserSchema } from "./schema";

const router = express.Router();

router.post("/", validateResource(createUserSchema), createUserHandler);

export default router;
