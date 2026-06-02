import Usermodel from "../models/Usermodel.js";

export const getuserData = async (req,res) => {
        try{

            const  userId  = req.userId;

            console.log("this is uerid from controller",req.userId);

            const user = await Usermodel.findById(userId);
        
            if(!user) {
                return res.json({ success : false , message : "user not found"})
            }
        
            res.json({ 
                success : true,
                userdata: {
                    id: userId,
                    name : user.name,
                    email: user.email,
                    role: user.role,
                },
            })

        } catch(error) {
            res.json({success: false, message: error.message})
        }

}