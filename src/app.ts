import path from "path";
import express from "express";
import dotenv from 'dotenv'
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import AuthRoute from "./routes/AuthRoutes";
import UserRoute from "./routes/UserRoute";
const app = express();
const port = process.env.PORT || 5000;

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

// I think middleware should go before the routes
app.use(bodyParser.json({limit:'30mb'}))
app.use(bodyParser.urlencoded({limit:'30mb',extended:true}))
dotenv.config({path: __dirname + '/.env' })
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.static('public'))
app.use('/images',express.static('images'))

// add the listenets for all routes
app.use('/auth',AuthRoute)
app.use('/user',UserRoute)
mongoose.connect(process.env.MONGO_DB as string)
.then(()=>app.listen(process.env.PORT,()=>console.log("listening at port 5000")))
.catch((e)=>console.log(e))

export default app;
