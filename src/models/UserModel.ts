import mongoose from "mongoose";
interface UserModal{
    username:String,
    firstname:String,
    lastname:String,
    email :String,
    password:String,
    dateOfBirth:Date
}
const UserSchema = new mongoose.Schema<UserModal>(
    {
        password : {
            type: String,
            required: true,
            unique:true
        },
        username : {
            type: String,
            required: true
        },
        firstname: {
            type: String,
            required: true
        },
        lastname : {
            type: String,
            required: true
        },
        email : {
            type: String,
            required: true
        },
        dateOfBirth : {
            type: Date,
            required: false
        },
      
    },
    {timestamps: true}
)

const UserModel= mongoose.model("Users", UserSchema);
export default UserModel