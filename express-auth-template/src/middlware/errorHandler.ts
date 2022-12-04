import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

import ErrorResponse from "../interfaces/ErrorResponse";
import { RequestValidators } from "../interfaces/Validator";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response<ErrorResponse>,
  next: NextFunction
) {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  // console.log('🚨 BRA, ERROR MESSAGE: ', err.message); // Uncomment for debugging
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack, // mmmm pancakes
  });
  next();
}
