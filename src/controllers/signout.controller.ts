import { Request, Response } from 'express';
import { COOKIE_NAME } from '../constants';

const signOut = async (req: Request, res: Response) => {
    // Clear cookie from response
    res.clearCookie(COOKIE_NAME);
    return res.sendStatus(200);
};

export default signOut;
