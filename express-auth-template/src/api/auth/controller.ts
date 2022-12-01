import { Request, Response } from "express";
import { findByEmail } from "../user/service";
import { CreateSessionInput } from "./schema";

export async function createSessionHandler(
  req: Request<{}, {}, CreateSessionInput>,
  res: Response
) {
  const { email, password } = req.body;

  const user = await findByEmail(email);
}
