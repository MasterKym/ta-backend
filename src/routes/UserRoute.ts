import  express  from 'express';
import { updateUser } from '../controllers/AuthController';
const UserRouter =express.Router()
UserRouter.put('/update/:id',updateUser)
export default UserRouter