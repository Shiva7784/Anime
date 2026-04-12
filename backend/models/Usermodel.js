import mongoose from "mongoose";

const userschema = new mongoose.Schema({
    name : { type: String , required : true },
    email : { type: String , required : true , unique : true},
    password : { type: String , required : true},
    role : { type: String , default : 'user'},

})

const Usermodel = mongoose.model("user",userschema);

export default Usermodel;