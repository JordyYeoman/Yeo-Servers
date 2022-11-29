import { Request, Response } from "express";
import sendEmail from "../../utils/mailer";
import { CreateUserInput } from "./schema";
import { createUser } from "./service";

export async function createUserHandler(
  req: Request<{}, {}, CreateUserInput>,
  res: Response
) {
  let body = req.body;

  try {
    const user = await createUser(body);

    await sendEmail();

    return res.send("User successfully created.");
  } catch (e: any) {
    if (e.code === 11000) {
      return res.status(409).send("Account already exists");
    }
    return res.status(500).send(e);
  }
}
