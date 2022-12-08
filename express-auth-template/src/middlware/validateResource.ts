import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";

const validateResource =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error: any) {
      if (error instanceof ZodError) {
        res.status(422);
      }
      next(error);
    }
  };

export default validateResource;
