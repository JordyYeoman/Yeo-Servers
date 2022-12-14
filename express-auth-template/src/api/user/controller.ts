import { nanoid } from "nanoid";
import { Request, Response } from "express";
import log from "../../utils/logger";
import sendEmail from "../../utils/mailer";
import { isValidObjectId } from "../../utils/validateId";
import {
  CreateUserInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  VerifyUserInput,
} from "./schema";
import {
  createUser,
  deleteUserById,
  findUserByEmail,
  findUserById,
  findUserByIdAndUpdate,
} from "./service";
import config from "config";

export async function createUserHandler(
  req: Request<{}, {}, CreateUserInput>,
  res: Response
) {
  let body = req.body;
  try {
    const user = await createUser(body);
    await sendEmail({
      from: config.get<string>("serviceEmail"),
      to: user.email,
      subject: "Please verify your account",
      text: `Verification code: ${user.verificationCode}. Id: ${user._id}`,
    });
    return res.send({ id: user._id, message: "User successfully created." });
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

export async function forgotPassworHandler(
  req: Request<{}, {}, ForgotPasswordInput>,
  res: Response
) {
  const message =
    "If a user with that email is registered you will receive a password reset email";
  const { email } = req.body;

  const user = await findUserByEmail(email);

  if (!user) {
    log.debug(`User with email: ${email} does not exist`);
    return res.send("User not found");
  }

  if (!user.verified) {
    return res.send("User is not verified");
  }

  const paswordResetCode = nanoid();

  user.passwordResetCode = paswordResetCode;
  await user.save();

  await sendEmail({
    to: user.email,
    from: config.get<string>("serviceEmail"),
    subject: "Reset your password",
    text: `Password reset code: ${paswordResetCode}. Id ${user._id}`,
  });

  log.debug(`Password reset email sent to ${email}`);

  return res.send(message);
}

export async function resetPasswordHandler(
  req: Request<ResetPasswordInput["params"], {}, ResetPasswordInput["body"]>,
  res: Response
) {
  const { id, passwordResetCode } = req.params;
  const { password } = req.body;

  const user = await findUserById(id);

  if (
    !user ||
    !user.passwordResetCode ||
    user.passwordResetCode !== passwordResetCode
  ) {
    return res.status(400).send("Could not reset user password");
  }

  // Set resetCode to null so it cannot be used again
  user.passwordResetCode = null;

  user.password = password;

  await user.save();

  return res.status(200).send("User password updated successfully");
}

export async function getCurrentUserHandler(req: Request, res: Response) {
  return res.send(res.locals.user);
}

export async function updateUserHandler(req: Request, res: Response) {
  const { email, firstName, lastName } = req.body;
  try {
    const result = await findUserByIdAndUpdate(res.locals.user._id, {
      ...(email && { email }),
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
    });
    res.send("User updated successfully");
  } catch (e: any) {
    log.error(e);
  }
}

export async function deleteUserHandler(req: Request, res: Response<{}>) {
  try {
    const result = await deleteUserById(res.locals.user._id);

    if (!result) {
      res.status(404);
      throw new Error(`User with id ${req.params.id} not found.`);
    }
    return res.status(204).end();
  } catch (e: any) {
    log.error(e);
    return;
  }
}
