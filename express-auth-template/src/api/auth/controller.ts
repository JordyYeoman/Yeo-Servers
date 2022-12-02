import { Request, Response } from "express";
import { findUserByEmail } from "../user/service";
import { CreateSessionInput } from "./schema";
import { signAccessToken, signRefreshToken } from "./service";

export async function createSessionHandler(
  req: Request<{}, {}, CreateSessionInput>,
  res: Response
) {
  const { email, password } = req.body;
  const message = "Invalid email or password";

  const user = await findUserByEmail(email);

  if (!user) {
    return res.send(message);
  }

  if (!user.verified) {
    return res.send("Please verify your email");
  }

  const isValid = user.validatePassword(password);

  if (!isValid) {
    return res.send(message);
  }

  // sign an access token
  const accessToken = signAccessToken(user);

  // sign a refresh token
  const refreshToken = await signRefreshToken({ userId: user._id });

  // send the tokens
  return res.send({ accessToken, refreshToken });
}
