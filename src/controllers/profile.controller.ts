import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import SALT from '../env/SALT';
import prisma from '../prisma/prisma';
import { exclude } from '../utils/excludeField';

export const getProfile = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { username } = res.locals.user;

    const profile = await prisma.user.findUnique({
        where: { username },
    });
    const profileWithoutPassword = exclude(profile!, 'password');
    return res.status(200).send(profileWithoutPassword);
};

// Route for updating Profile
export const updateProfile = async (req: Request, res: Response) => {
    const schema = Joi.object({
        firstName: Joi.string().min(2).max(20).required(),
        lastName: Joi.string().min(2).max(20).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).max(20).required(),
        dateOfBirth: Joi.date().required(),
        phone: Joi.string().min(10).max(15).required(),
    });

    // Check if the request body is valid
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            message: 'The values you entered do not meet the requirements.',
            error: error,
        });
    }
    // get the user inputs from request body
    const {
        firstName,
        lastName,
        email,
        dateOfBirth,
        phone,
    }: {
        firstName: string;
        lastName: string;
        email: string;
        dateOfBirth: Date;
        phone: string;
    } = req.body;

    const { username } = res.locals.user;

    // update user profile
    const newProfile = await prisma.user.update({
        where: { username },
        data: {
            firstName,
            lastName,
            email,
            dateOfBirth: new Date(dateOfBirth),
            phone,
        },
        select: {
            username: true,
        },
    });
    res.status(200).send(newProfile);
};

// Router for changing user password
export const changePassword = async (req: Request, res: Response) => {
    const schema = Joi.object({
        oldPassword: Joi.string().min(8).max(20).required(),
        newPassword: Joi.string().min(8).max(20).required(),
        confirmPassword: Joi.ref('password'),
    });

    // Check if the request body is valid
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            message: 'The values you entered do not meet the requirements.',
            error: error,
        });
    }
    // destructure properties from request body
    const {
        newPassword,
        oldPassword,
    }: { oldPassword: string; newPassword: string; confirmPassword: string } =
        req.body;

    const { username } = res.locals.user;

    // find user by username
    const user = await prisma.user.findUnique({
        where: { username },
        select: { password: true },
    });
    // check if old password supplied by user is correct
    const match = await bcrypt.compare(oldPassword, user!.password);
    if (!match) return res.status(400).json({ message: 'Wrong password' });
    // hash new password
    const hashedPassword = await bcrypt.hash(newPassword, SALT);
    // check if the new password is the same as the old  one
    if (hashedPassword === user!.password) {
        return res.status(400).json({
            message: "New Password can't be the same as old password",
        });
    }
    // update user password
    await prisma.user.update({
        where: { username },
        data: {
            password: hashedPassword,
        },
    });
    return res.status(200).json({
        message: 'Password updated successfully',
    });
};
