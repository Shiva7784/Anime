import bycrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Usermodel from '../models/Usermodel.js';

export const register = async (req,res) => {
    const {name,email,password} = req.body;

    if(!name||!email||!password) {
        return res.json({success : false , message: "Missing details"});
    }
    
    try{    
        const existingUser = await Usermodel.findOne({email});
        if(existingUser) {
            return res.json({success : false , message: "user already exists"});
        }

        const hashedPassword = await bycrypt.hash(password,10);

        const user = new Usermodel({name,email,password:hashedPassword})
        await user.save();

        const token = jwt.sign({id : user._id}, process.env.jwt_SECRET, { expiresIn : "7d",});

        res.cookie("token", token, {
            httpOnly : true,
            secure: process.env.NODE_ENV === "production",
            sameSite:process.env.NODE_ENV ==="production" ? "none" : "strict",
            maxAge : 7*24*60*60*1000,
        });

        console.log("NoDE_ENV",process.env.NODE_ENV);

        return res.json({success: true});

} catch(error) {
    res.json({success: false , message: error.message})
}
};

export const login = async (req,res) => {

    console.log(req.body);
    const {email,password} = req.body;

    if(!email||!password) {
        return res.json({success : false , message: "Email and Password are required"});
    }

    try {
        const user = await Usermodel.findOne({email});

        if(!user){
            return res.json({success: false , message: "invalid email"});
        }

        const ismatch = await bycrypt.compare(password,user.password);

        if(!ismatch) {
            return res.json({success: false, message:"invalid password"});
        }

        const token = jwt.sign({id : user._id}, process.env.jwt_SECRET, { expiresIn : "7d",});

        res.cookie("token", token, {
            httpOnly : true,
            secure: process.env.NODE_ENV === "production",
            sameSite:process.env.NODE_ENV ==="production" ? "none" : "strict",
            maxAge : 7*24*60*60*1000,
        });

        return res.json({success: true});
    }
    catch(error) {
        res.json({success: false , message : error.message});
    }
};


export const logout = (req,res) => {
    try {
        res.clearCookie("token",{
            httpOnly : true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        });

        return res.json({success : true});
    }
    catch(error) {
        return res.json({success:false , message: error.message});
    }
}
