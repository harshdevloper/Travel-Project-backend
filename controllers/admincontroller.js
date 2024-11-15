
import {User} from '../models/userSchema.js'
const getuser=async(req,res)=>{
    try{
        const user=await User.find({})
        res.json(user)
    }catch(e){
        res.status(404).json({message:e.message})
    }
}
const deleteuser=async(req,res)=>{
    try{
        const userId=req.params.id;
        const checkAdmin=await User.findById(userId);
        if(checkAdmin.role==="admin"){
            return res.status(404).json({message:"Admin cannot be deleted"})
        }
        const user=await User.findByIdAndDelete(userId);
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        res.status(200).json({message:"User deleted successfully"})
    }catch(e){
        res.status(404).json({message:e.message})
    }
}
export {getuser};