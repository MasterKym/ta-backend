import  express  from 'express';
import { updateUser } from '../controllers/AuthController';
import authMiddleWare from '../middleware/AuthMiddleware';
const UserRouter =express.Router()
UserRouter.put('/update/:id',authMiddleWare,updateUser)
export default UserRouter