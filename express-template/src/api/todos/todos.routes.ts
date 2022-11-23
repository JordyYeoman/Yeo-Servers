import { NextFunction, Router, Request, Response } from 'express';
import * as TodoControllers from './todos.handlers';

const router = Router();

const validateRequest = () => {
  return (req: Request, res: Response, next: NextFunction) => {};
};

router.get('/', TodoControllers.findAll);
router.post('/', TodoControllers.createOne);

export default router;
