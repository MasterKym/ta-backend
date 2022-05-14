import { Request, Response } from 'express';
import prisma from '../prisma/prisma';
import bcrypt from 'bcrypt';
import Joi from 'joi';
import SALT from '../env/SALT';

const signUp = async (req:Request, res:Response) => {

  const schema = Joi.object({
    username: Joi.string().min(5).max(50).required(),
    password: Joi.string().min(8).max(20).required(),
    confirmPassword: Joi.ref("password"),
    role: Joi.string().valid('USER', 'ADMIN', 'SUPER_ADMIN'),
  });

  const { value, error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
        message: "The values you entered do not meet the requirements.",
        error: error,
      })
  }
  const {username, password, role} = req.body;
  const user = await prisma.user.findUnique({
    where: {
      username: username,
    }
  });
  if (user) return res.status(403).json({message: "User already exists"});

  const hashedPassword = await bcrypt.hash(password, SALT);
  const newUser = await prisma.user.create({
    data: {
      username: username,
      password: hashedPassword,
      role: role
    },
    select: {
      username: true,
    },
  });
  return res.status(200).json(newUser);
};

export default signUp;
