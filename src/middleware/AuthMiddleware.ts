
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import express, { NextFunction,Request,Response } from 'express';

dotenv.config()
const secret = process.env.JWT_KEY;
const authMiddleWare = async (req :Request, res :Response, next:NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    console.log(token)
    if (token) {
      const decoded :any= jwt.verify(token, secret as string);
      console.log(decoded)
      req.body._id = decoded?.id;
      console.log("hhhhhhhhhhh")
    }
    next();
  } catch (error:any) {
    console.log(error.response.data);
  }
};

export default authMiddleWare;