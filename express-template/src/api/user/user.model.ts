import { ObjectId, WithId } from 'mongodb';
import * as z from 'zod';

import { db } from '../../db';

// TODO: Remove hardcoded password in response when querying for users
// Currently .strip() or .omit({ password: true }) does not remove password from the payload.

// Default User schema for login/logout etc
export const User = z.object({
  username: z.string().min(5),
  name: z.string().min(5),
  age: z.number().min(10),
  password: z.string().min(10),
  email: z.string().email(),
  emailConfirmed: z.boolean(),
  userType: z.string(),
});

// Response from Server - User model without password or other sensitive fields
export const UserWithoutSensitiveData = z.object({
  username: z.string().min(5),
  name: z.string().min(5),
  age: z.number().min(10),
  email: z.string().email(),
  emailConfirmed: z.boolean(),
  userType: z.string(),
});

// User object returned with jwt
export const UserWithJWT = z.object({
  token: z.string().min(10),
  data: z.object({
    _id: z.instanceof(ObjectId), // Remove _id declaration here and wrap `withId` when understanding for extending zod interfaces/types
    username: z.string().min(5),
    name: z.string().min(5),
    age: z.number().min(10),
    email: z.string().email(),
    emailConfirmed: z.boolean(),
    userType: z.string(),
  }),
});

// Initial User signup schema
export const UserSignUp = z
  .object({
    username: z.string().min(5),
    name: z.string().min(5),
    age: z.number().min(10),
    password: z.string().min(10),
    passwordConfirmation: z.string().min(10),
    email: z.string().email(),
    emailConfirmed: z.boolean(),
    userType: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'Passwords do not match',
    path: ['passwordConfirmation'],
  });

// User Login
export const UserLogin = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type UserWithoutSensitiveData = z.infer<typeof UserWithoutSensitiveData>; // Used for responding to a new user creation without sensitive data.
export type UserSignUp = z.infer<typeof UserSignUp>; // Used for initial sign up
export type UserWithJWT = z.infer<typeof UserWithJWT>; // Used for responding to a user signup / login
export type User = z.infer<typeof User>;
export type UserLogin = z.infer<typeof UserLogin>; // Used for login params
export type UserWithId = WithId<UserWithoutSensitiveData>; // Default User model that will be returned from MongoDB (MongoDB will always add user id)
export const UserCollection = db.collection<User>('user');
