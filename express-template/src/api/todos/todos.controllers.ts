import { Request, Response } from 'express';
import { TodoWithId, TodosCollection } from './todos.model';

export const FindAll = async (req: Request, res: Response<TodoWithId[]>) => {
  console.log('Function FIRED');
  const result = await TodosCollection.find();
  const todos = await result.toArray();
  res.json(todos);
};
