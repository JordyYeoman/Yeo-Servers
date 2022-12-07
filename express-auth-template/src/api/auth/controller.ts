import { Request, Response } from "express";
import { get } from "lodash";
import { verifyJwt } from "../../utils/jwt";
import { findUserByEmail, findUserById } from "../user/service";
import { CreateSessionInput } from "./schema";
import { findSessionById, signAccessToken, signRefreshToken } from "./service";

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
  console.log("made it here?", accessToken);
  // send the tokens
  return res.send({ accessToken, refreshToken });
}

export async function refreshAccessTokenHandler(req: Request, res: Response) {
  const refreshToken = get(req, "headers.x-refresh");
  console.log("refresh token", refreshToken);
  if (!refreshToken) {
    return res.status(401).send("Could not refresh access token");
  }

  const decoded = verifyJwt<{ session: string }>(
    refreshToken.toString(),
    "refreshTokenPublicKey"
  );
  if (!decoded) {
    return res.status(401).send("Could not refresh access token");
  }

  const session = await findSessionById(decoded.session);
  if (!session || !session.valid) {
    return res.status(401).send("Could not refresh access token");
  }

  const user = await findUserById(String(session.user));
  if (!user) {
    return res.status(401).send("Could not refresh access token");
  }

  const accessToken = signAccessToken(user);
  return res.send({ accessToken });
}
