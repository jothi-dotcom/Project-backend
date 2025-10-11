const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcryptjs =require("bcryptjs");

const protect = async (req,res,next) =>{
    try{
        let token =req.headers.authorization?.split(" ")[1];
        if(!token){
            return res.status(401).json({message:"Not Authorised"});
        }

            const decoded =jwt.verify(token ,process.env.JWT_SECRET_KEY);


            req.user = await User.findById(decoded.id).select("-password");
    
        next();
    }catch(err){
        res.status(401).json({message:"Invalid token"});
    }
};

const admins = (req,res,next) =>{
    if(req.user && req.user.role === "admin"){
        next();
    }
    else{
        res.status(403).json({message:"Admin access only"})
    }
};

module.exports ={protect,admins};

