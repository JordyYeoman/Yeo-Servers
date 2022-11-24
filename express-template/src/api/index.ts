import express from 'express';
import todos from './todos/todos.routes';
import user from './user/user.routes';
import MessageResponse from '../interfaces/MessageResponse';

const router = express.Router();

router.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

router.use('/todos', todos);
router.use('/user', user);

export default router;
