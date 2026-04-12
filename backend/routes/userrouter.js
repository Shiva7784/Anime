import express from "express"
import { getuserData } from "../controllers/usercontroller.js";
import  userAuth  from "../middleware/userAuth.js";

const userrouter = express.Router();

userrouter.get('/getuser',userAuth , getuserData);


export default userrouter;