const userModel = require('../models/user.model.js')
const jwt = require('jsonwebtoken')


module.exports.authUser = async(req,res,next)=>{
    try{
        const token  = req.cookies.token || req.header('Authorization')?.replace('Bearer', ' ');
        if(!token){
            return res.status(401).json(({mesage: "Access Denied."}))
        }
        const decode = jwt.verify(token,process.env.JWT_SECRET_KEY);
        const user = await userModel.findById(decode._id);
        if(!user){
            return res.status(401).json({message:"Access denied."})
        }

        req.user = user;
        next();

    }catch(err){
        next(err);
    }
}


