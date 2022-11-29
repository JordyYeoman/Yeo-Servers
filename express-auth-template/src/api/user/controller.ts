import { Request, Response } from "express";
import sendEmail from "../../utils/mailer";
import { isValidObjectId } from "../../utils/validateId";
import { CreateUserInput, VerifyUserInput } from "./schema";
import { createUser, findUserById } from "./service";

export async function createUserHandler(
  req: Request<{}, {}, CreateUserInput>,
  res: Response
) {
  let body = req.body;

  try {
    const user = await createUser(body);

    await sendEmail({
      from: "test@yeomanindustries.com.au",
      to: user.email,
      subject: "Please verify your account",
      text: `Verification code: ${user.verificationCode}. Id: ${user._id}`,
    });

    return res.send("User successfully created.");
  } catch (e: any) {
    if (e.code === 11000) {
      return res.status(409).send("Account already exists");
    }
    return res.status(500).send(e);
  }
}

export async function verifyUserHandler(
  req: Request<VerifyUserInput>,
  res: Response
) {
  const id = req.params.id;
  const verificationCode = req.params.verificationCode;

  // Check incoming id string is valid mongodb _id
  if (!isValidObjectId(id)) {
    return res.send("Invalid User Id");
  }

  // find the user by id
  const user = await findUserById(id);

  if (!user) {
    return res.send("Could not verify user");
  }

  // check to see if they are already verified
  if (user.verified) {
    return res.send("User already verified");
  }

  // check to see if the verificationCode matches
  if (user.verificationCode === verificationCode) {
    user.verified = true;

    await user.save();

    return res.send("User successfully verified");
  }

  return res.send("Unable to verify user");
}
