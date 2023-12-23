import { NextFunction, Request, Response } from "express";

export default (func: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    func(req, res, next).catch(next);
  };
};
