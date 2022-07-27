import express from "express";
import { loginUser, signup } from "../controllers/AuthController";
const AuthRoute=express.Router()
AuthRoute.post('/signup',signup)
AuthRoute.post('/login',loginUser)
export default AuthRoute