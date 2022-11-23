import { Router } from 'express';
import * as TodoControllers from './todos.controllers';

const router = Router();

router.get('/', TodoControllers.findAll);

export default router;
