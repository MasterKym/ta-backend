import { Request, Response } from 'express';

const checkAPIHealth = async (req:Request, res:Response) => {
  console.log('THIS LOG SHOULD BE REMOVED');
  return res.status(200).send('API is working');
};

export default checkAPIHealth;
