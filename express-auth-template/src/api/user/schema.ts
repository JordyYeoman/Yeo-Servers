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
      required_error: "Password is required",
    }).min(6, "Password is too short - minimum length of 6 characters"),
    passwordConfirmation: string({
      required_error: "Password Confirmation is required",
    }),
    email: string({
      required_error: "Email is required",
    }).email("Not a valid email address"),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  }),
});

export const verifyUserSchema = object({
  params: object({
    id: string(),
    verificationCode: string(),
  }),
});

export const forgotPasswordSchema = object({
  body: object({
    email: string({
      required_error: "Email address is required",
    }).email("Not a valid email address"),
  }),
});

export const resetPasswordSchema = object({
  params: object({
    id: string(),
    passwordResetCode: string(),
  }),
  body: object({
    password: string({
      required_error: "Password is required",
    }).min(6, "Password is too short - minimum length of 6 characters"),
    passwordConfirmation: string({
      required_error: "Password Confirmation is required",
    }),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  }),
});

export const deleteUserSchema = object({
  body: object({
    id: string(),
  }),
});

export type CreateUserInput = TypeOf<typeof createUserSchema>["body"];
export type VerifyUserInput = TypeOf<typeof verifyUserSchema>["params"];
export type ForgotPasswordInput = TypeOf<typeof forgotPasswordSchema>["body"];
export type DeleteUserInput = TypeOf<typeof deleteUserSchema>["body"];
export type ResetPasswordInput = TypeOf<typeof resetPasswordSchema>;
