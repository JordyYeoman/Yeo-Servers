import { WithId } from 'mongodb';
import * as z from 'zod';

import { db } from '../../db';

export const User = z.object({
  username: z.string().min(5),
  name: z.string().min(5),
  age: z.number().min(10),
  email: z.string().email(),
  emailConfirmed: z.boolean(),
  userType: z.string(),
});

export type User = z.infer<typeof User>;
export type UserWithId = WithId<User>; // Default User model that will be returned from MongoDB (MongoDB will always add user id)
export const UserCollection = db.collection<User>('user');
