import { object, string, TypeOf } from "zod";

export const createUserSchema = object({
  body: object({
    firstName: string({
      required_error: "First name is required",
    }),
    lastName: string({
      required_error: "Last name is required",
    }),
    password: string({
      required_error: "Password name is required",
    }).min(6, "Password is too short - minimum length of 6 characters"),
    passwordConfirmation: string({
      required_error: "First name is required",
    }),
    email: string({
      required_error: "First name is required",
    }).email("Not a valid email address"),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  }),
});

export type CreateUserInput = TypeOf<typeof createUserSchema>["body"];
