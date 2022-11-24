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
    const users = await UserCollection.find().toArray();
    res.json(users);
  } catch (error) {
    next(error);
  }
}

export async function createOne(
  req: Request<{}, UserWithId, User>,
  res: Response<UserWithId>,
  next: NextFunction,
) {
  try {
    const insertResult = await UserCollection.insertOne(req.body);
    if (!insertResult.acknowledged) throw new Error('Error inserting User');
    res.status(201);
    res.json({
      _id: insertResult.insertedId,
      ...req.body,
    });
  } catch (error) {
    next(error);
  }
}
