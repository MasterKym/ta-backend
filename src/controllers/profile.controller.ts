

import { NextFunction, Request, Response } from 'express';

const profile = async (req:Request, res:Response, next:NextFunction) => {
  const { username, role } = res.locals.user;

  return res.status(200)
  .send(`Hello ${username}. Your role is: <b>${role}</b>`);
};

export default profile;