import { Request, Response } from 'express';
import prisma from '../prisma/prisma';
import bcrypt from 'bcrypt';
import Joi from 'joi';
import JWT_SECRET from '../env/JWT_SECRET';
import jwt from 'jsonwebtoken';

const logIn = async (req: Request, res: Response) => {
  const schema = Joi.object({
    username: Joi.string().min(5).max(50).required(),
    password: Joi.string().min(8).max(20).required(),
  });
  const { value, error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: 'The values you entered do not meet the requirements.',
      error: error,
    });
  }
  const { username, password } = req.body;
  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });
  if (!user) {
    return res.status(404).json({ message: 'User does not exist' });
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: 'Wrong password' });

  // generate token
  const token = jwt.sign(
    {
      username,
    },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
  console.log(token);

  // put JWT in cookie
  res.cookie('login-token', token);

  return res.status(200).json({ message: 'Successful login !' });
};

export default logIn;
