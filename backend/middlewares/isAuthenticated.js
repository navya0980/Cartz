import ExpressError from "../utils/ExpressError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(
        new ExpressError("Authorization token is missing or invalid", 400),
      );
    }
    const token = authHeader.split(" ")[1];
    
    let decoded;
    try {
        decoded=jwt.verify(token,process.env.SECRET);
       
    } catch (error) {
        if(error.message === "TokenExpiredError"){
            return next(new ExpressError("Token has expired",400));
        }
        return next(new ExpressError("Access token is missing or invalid",400));
    }
    const user=await User.findById(decoded.id);
    
    if(!user){
        return next(new ExpressError("User not found",400));
    }
    req.user=user;
    req.id=user._id;
    
    next();
  } catch (error) {
    return next(new ExpressError("Internal server error", 500));
  }
};

export const isAdmin=(req,res,next)=>{
  if(req.user&&req.user.role==="admin"){
    next();
  }else{
    return next(new ExpressError("Access Denied",400));
  }
}