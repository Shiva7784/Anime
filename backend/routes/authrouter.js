import express from 'express';
import {
    register,
    login,
    logout,
} from '../controllers/authcontroller.js';

const authrouter = express.Router();

authrouter.post("/register",register)
authrouter.post("/login",login);
authrouter.post("/logout",logout);
authrouter.get("/test" , (req,res) => {
    res.send("test router is working");
});

export default authrouter;