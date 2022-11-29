import {
  getModelForClass,
  modelOptions,
  prop,
  Severity,
  pre,
  DocumentType,
} from "@typegoose/typegoose";
import { nanoid } from "nanoid"; // CommonJS export supported only to 3.3.4
import argon2 from "argon2";
import log from "../../utils/logger";

// @ - Class Decorators

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
  options: {
    allowMixed: Severity.ALLOW, // Allow mixed so the passwordReset field can be nullable
  },
})
@pre<User>("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  const hash = await argon2.hash(this.password);
  this.password = hash;

  return;
})
export class User {
  @prop({ lowercase: true, required: true, unique: true }) // Unique constraint handles the need to check for duplicate user emails
  email: string;

  @prop({ required: true })
  firstName: string;

  @prop({ required: true })
  lastName: string;

  @prop({ required: true })
  password: string;

  @prop({ required: true, default: () => nanoid() })
  verificationCode: string;

  @prop()
  passwordReset: string | null;

  @prop({ default: false })
  verified: boolean;

  async validatePassword(this: DocumentType<User>, candidatePassword: string) {
    try {
      return await argon2.verify(this.password, candidatePassword);
    } catch (e) {
      log.error(e, "Could not validate password");
    }
  }
}

const UserModel = getModelForClass(User);
export default UserModel;
