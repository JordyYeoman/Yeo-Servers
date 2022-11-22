import { WithId } from 'mongodb';
import * as z from 'zod';

import { db } from '../../db';

export const Todo = z.object({
  content: z.string().min(1),
  done: z.boolean(),
});

export type Todo = z.infer<typeof Todo>;
export type TodoWithId = WithId<Todo>; // Utilise the helper method from mongodb to wrap type with default ID.
export const TodosCollection = db.collection<Todo>('todos');
