import { NextFunction, Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { ParamsWithId } from '../../interfaces/ParamsWithId';
import { User, UserCollection, UserWithId } from './user.model';

export async function findAll(
  req: Request,
  res: Response<UserWithId[]>,
  next: NextFunction,
) {
  try {
    const todos = await UserCollection.find().toArray();
    res.json(todos);
  } catch (error) {
    next(error);
  }
}
