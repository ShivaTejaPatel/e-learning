import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import {errorHandler} from "../utils/error.js";
import jwt from 'jsonwebtoken';



export const signup = async (req, res, next) => {
    const { name, email, password,avatar, isSuperadmin } = req.body;
    console.log(req.body);
  
    const hashedPassword = bcryptjs.hashSync(password, 10);
  
    try {
      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        avatar: avatar,
        isSuperadmin: isSuperadmin || false,
      });
      console.log(newUser);
  
      res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      next(error);
    }
  };

export const signin = async(req,res,next)=>{
    const {email,password}=req.body;
    try{
        const validUser = await User.findOne({email});
        if(!validUser) return next(errorHandler(404,"User not found"));
        const validPassword = bcryptjs.compareSync(password,validUser.password);
        if(!validPassword) return next(errorHandler(404,'wrong credentials'));
        const token = jwt.sign({id: validUser._id},process.env.JWT_SECRET);
        const {password: pass, ...rest}= validUser._doc;
        res
        .cookie('access_token',token,{httpOnly: true})
        .status(200)
        .json(rest);
    }
    catch(error)
    {
        next(error);
    }

}




  export const signout = async (req, res) => {
    try{
        res.clearCookie("access_token");
        res.status(200).json("User has been signed out");
    }catch(error)
    {
        next(error);
    }
  }