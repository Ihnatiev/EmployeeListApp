import { Response, NextFunction } from 'express';
import { HTTPSClientError, HTTPS404Error } from './httpsErrors';

export const notFoundError = () => {
  throw new HTTPS404Error('Method not found.');
};

export const clientError = (err: Error, res: Response, next: NextFunction) => {
  if (err instanceof HTTPSClientError) {
    console.warn(err);
    res.status(err.statusCode).json({ message: err.message });
  } else {
    next(err);
  }
};

export const serverError = (err: Error, res: Response, next: NextFunction) => {
  console.error(err);
  if (process.env.NODE_ENV === 'production') {
    res.status(500).json({ message: 'Internal Server Error' });
  } else {
    res.status(500).json({ message: err.stack });
  }
};

