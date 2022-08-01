import { Request, Response, NextFunction } from 'express';

const logger = async (req: Request, res: Response, next: NextFunction) => {
  // console.log(`${new Date().toLocaleTimeString()} -- ${req.method} to '${req.originalUrl}'`)
  console.log(
    `${req.method} '${req.originalUrl}' -- ${new Date().toLocaleTimeString()}`
  );
  next();
};
export default logger;
