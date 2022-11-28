import { NextFunction, Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { ParamsWithId } from '../../interfaces/ParamsWithId';
import {
  User,
  UserCollection,
  UserLogin,
  UserSignUp,
  UserWithId,
  UserWithJWT,
} from './user.model';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export async function findAll(
  req: Request,
  res: Response<UserWithId[]>,
  next: NextFunction,
) {
  try {
    console.log('getting all users');
    const users = await UserCollection.find().toArray();
    res.json(users);
  } catch (error) {
    next(error);
  }
}

// Create sign up handler
export async function createOneUser(
  req: Request<{}, UserWithJWT, UserSignUp>,
  res: Response<UserWithJWT>,
  next: NextFunction,
) {
  try {
    const { username, name, age, password, email, emailConfirmed, userType } =
      req.body;

    // Password hashing or identitiy provider
    let hash = await bcrypt.hash(password, 12);

    const newUser: User = {
      username,
      name,
      age,
      password: hash, // replace password with hash of password
      email,
      emailConfirmed,
      userType,
    };

    const insertResult = await UserCollection.insertOne(newUser); // Error thrown here are passed to the error handler, similar in most Collection methods.
    if (!insertResult.acknowledged) throw new Error('Error creating User');

    // Sign JWT
    const token = jwt.sign(
      { id: insertResult.insertedId },
      `${process.env.JWT_SECRET}`,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    );

    res.status(201);
    res.json({
      token,
      data: {
        _id: insertResult.insertedId,
        username,
        name,
        age,
        email,
        emailConfirmed,
        userType,
      },
    });
  } catch (error) {
    console.log('Error: ', error);
    next(error);
  }
}

// Create sign in handler
export async function findOneUser(
  req: Request<{}, UserWithId, UserLogin>,
  res: Response<UserWithId>,
  next: NextFunction,
) {
  try {
    const { email, password } = req.body;
    console.log('Made it here', req.body);
    if (!email || !password) {
      res.status(404);
      throw new Error('User not found.');
    }

    // Check if email and password are valid

    const result = await UserCollection.findOne({
      email: email,
    });
    if (!result) {
      res.status(404);
      throw new Error('User not found.');
    }
    res.json(result);
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
