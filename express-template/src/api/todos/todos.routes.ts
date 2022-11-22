import { Router, Request, Response } from 'express';
import { TodosCollection, TodoWithId } from './todos.model';

const router = Router();

router.get('/', async (req: Request, res: Response<TodoWithId[]>) => {
  const result = await TodosCollection.find();
  const todos = await result.toArray();
  res.json(todos);
});

export default router;
