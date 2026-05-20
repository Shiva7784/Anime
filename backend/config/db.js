import mongoose from "mongoose";

// const connectDB = async () => {
//     try{
//         const mongodb = await mongoose.connect(`${process.env.mongodb_uri}/mentor1`);
//         if(mongodb){
//             console.log("mongodb connected succesfully")
//         }

//     } catch(error ) {
//         console.log("error in the mongodb connection string", error);
//     }
// }

const connectDB = async () => {
    try{
        mongoose.connection.on("connected", () => {
            console.log("Database connected ")
        })

        await mongoose.connect(`${process.env.MONGODB_URI}/Anime`);
    
    } catch (error) {
        console.log(error.message);
    }
   
};

export default connectDB;


