import { Response, Request } from 'express';

const signOut = async (req: Request, res: Response) => {
  try {
    res.clearCookie('login-token');
    return res.status(200).send({ message: 'Successful logout !' });
  } catch (error) {
    console.log(error);
  }
};
export default signOut;
