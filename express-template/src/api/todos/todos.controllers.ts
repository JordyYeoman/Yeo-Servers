import { NextFunction, Request, Response } from 'express';
import { TodoWithId, TodosCollection } from './todos.model';

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
