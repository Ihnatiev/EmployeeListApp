import { NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import secret from '../config/secret';

export const checkJwt = (req: any, res: any, next: NextFunction) => {
  try {
    const token: any = req.headers.authorization.split(' ')[1];
    const decodedToken: any = jwt.verify(token, secret.jwtSecret) as any;

    req.userData = {
      email: decodedToken.email,
      userId: decodedToken.userId
    };
    next();
  } catch (error) {
    res.status(401).json({ message: 'You are not authenticated!' });
  }
};

