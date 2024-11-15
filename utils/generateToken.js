import { stat } from "fs";

export const generateToken =(user,message,statuscode,res)=>{
    const token =user.generateAccessToken();
    const cookieName= user.role === 'admin' ? 'adminToken' : 'userToken';
    res.status(statuscode).cookie(cookieName,token,{
        httpOnly:true,
        secure: process.env.NODE_ENV === 'production',
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // Set cookie to expire in 1 day

    }).json({success:true,message,user,token});
}

