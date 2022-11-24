import { NextFunction, Request, Response } from 'express';
import { Todo, TodoWithId, TodosCollection } from './todos.model';

export async function findAll(
  req: Request,
  res: Response<TodoWithId[]>,
  next: NextFunction,
) {
  try {
    const todos = await TodosCollection.find().toArray();
    res.json(todos);
  } catch (error) {
    next(error);
  }
}

export async function createOne(
  req: Request<{}, TodoWithId, Todo>,
  res: Response<TodoWithId>,
  next: NextFunction,
) {
  try {
    const validateResult = await Todo.parseAsync(req.body); // Validates object and returns ZOD object if successful
    const insertResult = await TodosCollection.insertOne(validateResult);
    if (!insertResult.acknowledged) throw new Error('Error inserting Todo');
    res.status(201);
    res.json({
      _id: insertResult.insertedId,
      ...validateResult,
    });
  } catch (error) {
    next(error);
  }
}
