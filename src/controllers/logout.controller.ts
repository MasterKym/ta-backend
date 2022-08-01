import { Response, Request } from 'express';

const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie('login-token');
    return res.status(200).send({
      message: 'user logged out successfully',
    });
  } catch (error) {
    return res.status(500).send({
      message: 'something went wrong',
    });
  }
};
export default logout;
