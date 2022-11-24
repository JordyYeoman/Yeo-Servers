import { Router } from 'express';
import { validateRequest } from '../../middlewares';
// import { ParamsWithId } from '../../interfaces/ParamsWithId';
import * as UserHandlers from './user.handlers';
import { User } from './user.model';

const router = Router();

router.get('/', UserHandlers.findAll);
// router.get(
//   '/:id',
//   validateRequest({ params: ParamsWithId }),
//   UserHandlers.findOne,
// );
router.post('/', validateRequest({ body: User }), UserHandlers.createOne);
// router.put(
//   '/:id',
//   validateRequest({ params: ParamsWithId, body: User }),
//   UserHandlers.updateOne,
// );
// router.delete(
//   '/:id',
//   validateRequest({ params: ParamsWithId }),
//   UserHandlers.deleteOne,
// );

export default router;
