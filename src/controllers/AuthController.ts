
import bcrypt from 'bcrypt'
import { Request,Response } from 'express'
import jwt from 'jsonwebtoken'
import UserModel from '../models/UserModel'
export const signup=async(req:Request,res:Response)=>{
    const {username,password,firstname,lastname,email}=req.body
    const salt=await bcrypt.genSalt(10)
    const hashPass=await bcrypt.hash(password,salt)
    let user=new UserModel({username,password:hashPass,firstname,lastname,email})
    try {        
            user= await user.save()
            const token =jwt.sign({
                username:user.username,id:user._id
            },
            process.env.JWT_KEY as string,{expiresIn:'1h'}
            )
            user.password=password
            res.status(200).json({user,token})
        
       
    } catch (error:any) {
        res.status(500).json(error.message)
    }
}

export const loginUser=async(req :Request,res: Response)=>{
    const {username,password}=req.body
    try {
        const user=await UserModel.findOne({username:username})
        if (user) {
            const validity=await bcrypt.compare(password,user.password as string)
            if (!validity) {
                res.status(400).json("wrong password")
            }else{
                const token =jwt.sign({
                    username:user.username,id:user._id
                },
                process.env.JWT_KEY as string,{expiresIn:'1h'}
                )
                user.password=password

                res.status(200).json({user,token})
           }
        }else{
            res.status(404).json({message:"user Not Found"})
        }
    } catch (error:any) {
        res.status(500).json({message:error.message})
    }
}

export const updateUser=async(req :Request,res :Response)=>{
    const id=req.params.id
    const {currentUserId,password} =req.body
    if(id===currentUserId ){
       
        try {
            if (password) {
                const salt=await bcrypt.genSalt(10)
                req.body.password =await bcrypt.hash(password,salt)
            }
            const user =await UserModel.findByIdAndUpdate(id,req.body,{new:true})
            if (user) {
                user.password=password
            }
            
            res.status(200).json(user)
        } catch (error) {
            res.status(500).json(error)
        }
    }else{
        res.status(403).json("Access denied Son!!")
    }
}