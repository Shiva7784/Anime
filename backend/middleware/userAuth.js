import jwt from "jsonwebtoken";


const userAuth = async (req,res,next) => {

    console.log("cookies:", req.cookies);

    const { token } = req.cookies;

    console.log("token from frontend ", token);


    if(!token) {
        return res.json({
            success: false,
            message : "Not Authorized , Logged in again",
        });
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        if(tokenDecode.id){

            console.log("tokendecode.id",tokenDecode.id);

            console.log("body:", req.body);

            req.userId = tokenDecode.id;

            console.log("req.userId",req.userId);
        } else {
            return res.json({
                success: false,
                message: "Not Authorized , Logged in again",
            });
        }

        next();

    } catch(error) {
        res.json({
            success: false,
            message: error.message,
        })
    }

} 

export default userAuth;