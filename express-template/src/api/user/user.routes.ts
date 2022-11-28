import { Router } from 'express';
import { validateRequest } from '../../middlewares';
import { ParamsWithId } from '../../interfaces/ParamsWithId';
import * as UserHandlers from './user.handlers';
import { User, UserSignUp, UserLogin } from './user.model';

const router = Router();

// GET - request data from server
router.get('/', UserHandlers.findAll);
router.get(
  '/:id',
  validateRequest({ params: ParamsWithId }),
  UserHandlers.findOne,
);

// POST - Send payload to server
router.post('/', validateRequest({ body: User }), UserHandlers.createOne);
router.post(
  '/signup',
  validateRequest({ body: UserSignUp }),
  UserHandlers.createOneUser,
);
router.post(
  '/login',
  validateRequest({ body: UserLogin }),
  UserHandlers.findOneUser,
);

// PUT - Update Object
router.put(
  '/:id',
  validateRequest({ params: ParamsWithId, body: User }),
  UserHandlers.updateOne,
);

// DELETE
router.delete(
  '/:id',
  validateRequest({ params: ParamsWithId }),
  UserHandlers.deleteOne,
);

export default router;
