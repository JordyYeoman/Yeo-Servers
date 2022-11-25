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

export async function findOne(
  req: Request<ParamsWithId, UserWithId, {}>,
  res: Response<UserWithId>,
  next: NextFunction,
) {
  try {
    const result = await UserCollection.findOne({
      _id: new ObjectId(req.params.id),
    });
    if (!result) {
      res.status(404);
      throw new Error(`User with id ${req.params.id} not found.`);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function updateOne(
  req: Request<ParamsWithId, UserWithId, User>, // Incoming request - id in param{} // respond with a UserWithId // request body should be a User
  res: Response<UserWithId>,
  next: NextFunction,
) {
  try {
    const result = await UserCollection.findOneAndUpdate(
      {
        _id: new ObjectId(req.params.id),
      },
      {
        $set: req.body,
      },
      {
        returnDocument: 'after',
      },
    );
    if (!result.value) {
      res.status(404);
      throw new Error(`User with id ${req.params.id} not found.`);
    }
    res.json(result.value);
  } catch (error) {
    next(error);
  }
}

export async function deleteOne(
  req: Request<ParamsWithId, {}, {}>, // Incoming request - id in param{} // respond with a UserWithId // request body should be a user
  res: Response<{}>,
  next: NextFunction,
) {
  try {
    const result = await UserCollection.findOneAndDelete({
      _id: new ObjectId(req.params.id),
    });
    if (!result.value) {
      res.status(404);
      throw new Error(`User with id ${req.params.id} not found.`);
    }
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}
