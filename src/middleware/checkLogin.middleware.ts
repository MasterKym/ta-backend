import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import jwt from "jsonwebtoken";
import JWT_SECRET from '../env/JWT_SECRET';
import prisma from '../prisma/prisma';

/*
	DEV NOTE:
	This middleware will be run on any request that exchanges data from
	the server to backend. It will check if the token in the cookies is
	valid following these steps respectively :

	  1. If token was provided
	  2. If token is valid (using Regex)
	  3. Using jwt.verify(token, secret), check if the token is rightly signed
*/

const checkLogin = async (req: Request, res: Response, next: NextFunction) => {
  const jwtToken = req.cookies["login-token"];

  // 1. Checking if token exists.
  if (!jwtToken) {
    return res.status(400).json({
      message: "No login token",
    });
  }

  // 2. Checking if token is a valid JWT token.
  const schema = Joi.string().regex(
    /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/
  );

  const { value, error } = schema.validate(jwtToken);

  if (error) {
    return res.status(400).json({
      message: "Invalid token",
    });
  }

  // 3. Checking if token is rightly signed
  const decoded = <{ username: string; rand: string }>(
    jwt.verify(jwtToken, JWT_SECRET)
  );

  if (!decoded) {
    return res.status(403).json({
      message: "Token wrongly signed",
    });
  }
  const user = await prisma.user.findUnique({where: {
    username: decoded.username
  }})
  if(!user) return res.status(500).json({message: "Non existant user was signed !!"})

  console.log(user);
  // adding user email to res.locals
  res.locals.user = { username: user.username, role: user.role};

  // If everything went well, go next
  next();
};

export default checkLogin;
