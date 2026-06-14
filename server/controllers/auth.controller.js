import genToken from "../config/token.js"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs";

// Register

export const register = async (req,res) => {
   try{
      const {name,email,password} = req.body;

      const exists = await User.findOne({email});

      if(exists){
         return res.status(400).json({
            message:"User already exists"
         });
      }

      const hashedPassword = await bcrypt.hash(password,10);

      const user = await User.create({
         name,
         email,
         password:hashedPassword
      });

      res.status(201).json(user);

   }catch(error){
      res.status(500).json({
         message:error.message
      });
   }
}


// Login

export const login = async (req,res) => {
   try{
      const {email,password} = req.body;

      const user = await User.findOne({email});

      if(!user){
         return res.status(400).json({
            message:"User not found"
         });
      }

      const isMatch = await bcrypt.compare(
         password,
         user.password
      );

      if(!isMatch){
         return res.status(400).json({
            message:"Invalid password"
         });
      }

      const token = await genToken(user._id);

      res.cookie("token",token,{
         httpOnly:true,
         secure:true,
         sameSite:"none",
         maxAge:7*24*60*60*1000
      });

      res.status(200).json(user);

   }catch(error){
      res.status(500).json({
         message:error.message
      });
   }
}

// Goggle Login
export const googleAuth = async (req,res) => {
    try {
        const {name , email} = req.body
        let user = await User.findOne({email})
        if(!user){
            user = await User.create({
                name , 
                email
            })
        }
        let token = await genToken(user._id)
        res.cookie("token" , token , {
            httpOnly:true,
            secure:true,
            sameSite:"none",
            maxAge:7 * 24 * 60 * 60 * 1000
        })

        return res.status(200).json(user)



    } catch (error) {
        return res.status(500).json({message:`Google auth error ${error}`})
    }
    
}

export const logout = async (req,res) => {
    try {
        await res.clearCookie("token")
        return res.status(200).json({message:"LogOut Successfully"})
    } catch (error) {
         return res.status(500).json({message:`Logout error ${error}`})
    }
    
}