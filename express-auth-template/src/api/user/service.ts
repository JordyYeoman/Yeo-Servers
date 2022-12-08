import UserModel, { User } from "./model";
import { UpdateUserInput } from "./schema";

export function createUser(input: Partial<User>) {
  return UserModel.create(input);
}

export function findUserById(id: string) {
  return UserModel.findById(id);
}

export function findUserByEmail(email: string) {
  return UserModel.findOne({
    email,
  });
}

export function findUserByIdAndUpdate(
  id: string,
  payload: Partial<UpdateUserInput>
) {
  return UserModel.findByIdAndUpdate(id, payload, { returnDocument: "after" });
}

export function deleteUserById(id: string) {
  return UserModel.findByIdAndDelete(id);
}
