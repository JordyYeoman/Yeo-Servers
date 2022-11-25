import { AnyZodObject, ZodEffects } from 'zod';

export interface RequestValidators {
  body?: AnyZodObject | ZodEffects<AnyZodObject>;
  params?: AnyZodObject;
  query?: AnyZodObject;
}
