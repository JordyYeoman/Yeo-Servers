import { Router } from 'express';
import { ParamsWithId } from '../../interfaces/ParamsWithId';
import { validateRequest } from '../../middlewares';
import * as TodoControllers from './todos.handlers';
import { Todo } from './todos.model';

const router = Router();

router.get('/', TodoControllers.findAll);
router.get(
  '/:id',
  validateRequest({ params: ParamsWithId }),
  TodoControllers.findOne,
);
router.post('/', validateRequest({ body: Todo }), TodoControllers.createOne);
router.put(
  '/:id',
  validateRequest({ params: ParamsWithId, body: Todo }),
  TodoControllers.updateOne,
);
router.delete(
  '/:id',
  validateRequest({ params: ParamsWithId }),
  TodoControllers.deleteOne,
);

export default router;
