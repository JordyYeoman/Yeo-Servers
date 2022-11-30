import config from "config";
import jwt from "jsonwebtoken";
import { object } from "zod";

export function signJwt(
  object: Object,
  keyName: "accessTokenPrivateKey" | "refreshTokenPrivateKey",
  options?: jwt.SignOptions | undefined
) {
  const signingKey = Buffer.from(
    config.get<string>(keyName),
    "base64"
  ).toString("ascii");
}

export function verifyJwt() {}
