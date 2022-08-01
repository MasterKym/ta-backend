import { NextFunction, Request, Response } from 'express';
import prisma from '../prisma/prisma';
import { Role } from '@prisma/client';
import Joi from 'joi';
import bcrypt from 'bcrypt';
import SALT from '../env/SALT';

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, role } = res.locals.user;

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) return res.status(404).json({ message: 'User not found' });

  return res.status(200).send({
    message: 'Profile retrieved successfully',
    user: {
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      dateOfBirth: user.dateOfBirth,
      phone: user.phone,
      role: user.role,
    },
  });
};

export const updateProfile = async (req: Request, res: Response) => {
  const { username } = res.locals.user;

  const schema = Joi.object({
    username: Joi.string().min(5).max(25).required(),
    firstName: Joi.string().min(2).max(20).required(),
    lastName: Joi.string().min(2).max(20).required(),
    email: Joi.string().email().required(),
    password: Joi.string().max(25).min(5).required(),
    dateOfBirth: Joi.date().required(),
    phone: Joi.string().min(10).max(15).required(),
  });

  const { value, error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: 'The values you entered do not meet the requirements.',
      error: error,
    });
  }

  const {
    password,
    role,
    firstName,
    lastName,
    email,
    dateOfBirth,
    phone,
  }: {
    password: string;
    role: Role;
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: Date;
    phone: string;
    username: string;
  } = req.body;

  const hashedPassword = await bcrypt.hash(password, SALT);

  // find user and look for password match
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
    select: {
      password: true,
    },
  });
  // if user is not found
  if (!user) {
    return res.status(404).json({
      message: 'User not found',
    });
  }
  // if password is not correct
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({
      message: 'Password is incorrect',
    });
  }

  await prisma.user
    .update({
      where: {
        username,
      },
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        dateOfBirth: new Date(dateOfBirth),
        phone,
        role,
      },
    })
    .then((user) => {
      return res.status(200).json({
        message: 'User updated successfully',
        username: user.username,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        message: 'Error updating user',
      });
    });
};
