import { NextFunction, Router, Request, Response } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import * as TodoControllers from './todos.handlers';
import { Todo } from './todos.model';

const router = Router();

router.get('/', TodoControllers.findAll);
router.post('/', validateRequest({ body: Todo }), TodoControllers.createOne);

export default router;
