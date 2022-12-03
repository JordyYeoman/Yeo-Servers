import { Request, Response, NextFunction, response } from "express";
const requireUser = (req: Request, res: Response, next: NextFunction) => {
  // At this point we already know the deserializeUser middleware has fired
  // and has added user to the locals property.
  const user = res.locals.user;

  if (!user) {
    res.sendStatus(403);
  }

  return next();
};

export default requireUser;
