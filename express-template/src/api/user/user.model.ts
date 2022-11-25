import { WithId } from 'mongodb';
import * as z from 'zod';

import { db } from '../../db';

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

export type UserWithoutSensitiveData = z.infer<typeof UserWithoutSensitiveData>; // Used for responding to a new user creation without sensitive data.
export type UserSignUp = z.infer<typeof UserSignUp>; // Used for initial sign up
export type User = z.infer<typeof User>;
export type UserWithId = WithId<UserWithoutSensitiveData>; // Default User model that will be returned from MongoDB (MongoDB will always add user id)
export const UserCollection = db.collection<User>('user');
