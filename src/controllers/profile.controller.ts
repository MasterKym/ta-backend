import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import { IFormData } from '../lib/types';
import prisma from '../prisma/prisma';
import { exclude } from '../utils/excludeField';

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username } = res.locals.user;
  const profile = await prisma.user.findUnique({
    where: {
      username,
    },
  });
  const userWithouPassword = exclude(profile!, 'password');
  return res.status(200).send(userWithouPassword);
};

export const updateProfile = async (req: Request, res: Response) => {
  const schema = Joi.object({
    firstName: Joi.string().min(2).max(20).required(),
    lastName: Joi.string().min(2).max(20).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(20).required(),
    dateOfBirth: Joi.date().required(),
    phone: Joi.string().min(10).max(15).required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: 'The values you entered do not meet the requirements.',
      error: error,
    });
  }
  const {
    password: currentPassword,
    dateOfBirth,
    ...formData
  }: { password: string; dateOfBirth: string; formData: IFormData } = req.body;

  const { username } = res.locals.user;

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
    select: {
      password: true,
    },
  });
  const passwordMatch = await bcrypt.compare(currentPassword, user!.password);
  if (!passwordMatch) {
    return res.status(400).json({ message: 'Password is incorrect' });
  }
  const updatedUser = await prisma.user.update({
    where: {
      username,
    },
    data: {
      dateOfBirth: new Date(dateOfBirth),
      ...formData,
    },
    select: {
      username: true,
    },
  });
  return res.status(200).send(`User ${updatedUser.username} updated`);
};
