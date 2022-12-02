import { DocumentType } from "@typegoose/typegoose";
import { signJwt } from "../../utils/jwt";
import SessionModel from "../session/model";
import { User } from "../user/model";

export async function createSession({ userId }: { userId: string }) {
  return SessionModel.create({ user: userId });
}

export async function signRefreshToken({ userId }: { userId: string }) {
  const session = await createSession({
    userId,
  });

  const refreshToken = signJwt(session._id, "refreshTokenPrivateKey");
  return refreshToken;
}

export function signAccessToken(user: DocumentType<User>) {
  const payload = user.toJSON();
  console.log("wtf is payload? ", payload);
  const accessToken = signJwt(payload, "accessTokenPrivateKey");
  console.log("wtf is accessToken? ", accessToken);
  return accessToken;
}
