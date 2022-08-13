

import { NextFunction, Request, Response } from 'express';
import prisma from "../prisma/prisma";
import Joi from "joi";
import SALT from "../env/SALT";
import bcrypt from "bcrypt";


export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username } = res.locals.user;

  const user = await prisma.user.findUnique({
    where : {
      username: username
    }, select : {
      firstName: true,
      lastName: true,
      email: true,
      dateOfBirth: true,
      phone: true

    }
  })

  return res
    .status(200)
    .json(user)
};


export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const schema = Joi.object({
    firstName: Joi.string().min(2).max(20),
    lastName: Joi.string().min(2).max(20),
    email: Joi.string().email(),
    password: Joi.string().min(8).max(20),
    dateOfBirth: Joi.date(),
    phone: Joi.string().min(10).max(15),
  }).min(1);

  const { value, error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
        message: "The values you entered do not meet the requirements.",
        error: error,
      })
  }
  const { username } = res.locals.user;
  const {
    firstName,
    lastName,
    email,
    password,
    dateOfBirth,
    phone
  } = req.body

  const hashedPassword = await bcrypt.hash(password, SALT);

  const updateUser = await prisma.user.update({
    where: {
      username: username,
    },
    data: {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword,
      dateOfBirth: new Date(dateOfBirth),
      phone: phone
    }
  })

  return res.status(200).json({"message": "success"})
}
