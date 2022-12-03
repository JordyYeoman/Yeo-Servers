import config from "config";
import jwt from "jsonwebtoken";

export function signJwt(
  object: Object,
  keyName: "accessTokenPrivateKey" | "refreshTokenPrivateKey",
  options?: jwt.SignOptions | undefined
) {
  const signingKey = Buffer.from(
    config.get<string>(keyName),
    "base64"
  ).toString("ascii");

  // RS256 means we will be using public and private keys
  // Meaning that the if the user service is part of a microservice architecture,
  // we can share the public key around to authenticate on other services
  let signedKey = jwt.sign(object, signingKey, {
    ...(options && options),
    algorithm: "RS256",
  });

  return signedKey;
}

export function verifyJwt<T>(
  token: string,
  keyName: "accessTokenPublicKey" | "refreshTokenPublicKey"
): T | null {
  const publicKey = Buffer.from(config.get<string>(keyName), "base64").toString(
    "ascii"
  );

  try {
    const decoded = jwt.verify(token, publicKey) as T;
    return decoded;
  } catch (e) {
    return null;
  }
}
