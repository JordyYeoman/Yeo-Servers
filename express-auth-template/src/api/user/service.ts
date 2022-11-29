import userModel, { User } from "./model";

export function createUser(input: Partial<User>) {
  return userModel.create(input);
}
