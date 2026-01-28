//Middleware to protect routes
import User from "../models/User.js";
import jwt from "jsonwebtoken";
export const protect= async (req,res,next)=>{
    try{
    const token=req.header('Authorization')?.replace('Bearer ','');
        if(!token){
            return res.status(401).json({message:"Not authorized, no token"});
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        
        const user=await User.findById(decoded.id).select("-password");

        if(!user){
            return res.status(401).json({message:"Not authorized"});
        }
        req.user=user;
        next();

    }catch(e){
        console.error("auth.js: Error in protect middleware:", e.message);
        return res.status(401).json({message:"Not authorized"});
    }
}

