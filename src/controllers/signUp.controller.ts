import { Request, Response } from 'express';
import prisma from '../prisma/prisma';
import bcrypt from 'bcrypt';
import Joi from 'joi';
import SALT from '../env/SALT';
import { Role } from '@prisma/client';

const signUp = async (req: Request, res: Response) => {
  const schema = Joi.object({
    username: Joi.string().min(5).max(25).required(),
    firstName: Joi.string().min(2).max(20).required(),
    lastName: Joi.string().min(2).max(20).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(20).required(),
    confirmPassword: Joi.ref('password'),
    dateOfBirth: Joi.date().required(),
    phone: Joi.string().min(10).max(15).required(),
    role: Joi.string().valid('USER', 'ADMIN', 'SUPER_ADMIN'),
  });

  const { value, error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: 'The values you entered do not meet the requirements.',
      error: error,
    });
  }
  const {
    username,
    password,
    role,
    firstName,
    lastName,
    email,
    dateOfBirth,
    phone,
  }: {
    username: string;
    password: string;
    role: Role;
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: Date;
    phone: string;
  } = req.body;
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });
  if (user) return res.status(403).json({ message: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, SALT);
  const newUser = await prisma.user.create({
    data: {
      username,
      email,
      firstName,
      lastName,
      dateOfBirth: new Date(dateOfBirth),
      phone,
      password: hashedPassword,
      role,
    },
    select: {
      username: true,
    },
  });
  return res.status(200).json(newUser);
};

export default signUp;
