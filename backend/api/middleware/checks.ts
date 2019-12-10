import { Request, Response, NextFunction } from "express";
import { HTTPS400Error } from "../utils/httpsErrors";

export const checkUserCreate = (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.name || !req.body.email || !req.body.password) {
    throw new HTTPS400Error("All fields must be filled");
  } else {
    next();
  }
};

export const checkUserLogin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.email || !req.body.password) {
    throw new HTTPS400Error("All fields must be filled");
  } else {
    next();
  }
};



