export const genericErrorHandler = (res: any, req: any): Error => {
  res.status(404);
  throw new Error(`Todo with id ${req.params.id} not found.`);
};
