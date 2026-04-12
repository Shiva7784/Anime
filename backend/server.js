import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import authrouter from './routes/authrouter.js';
import userrouter from './routes/userrouter.js';
import cookieParser from 'cookie-parser';
import ListRouter from './routes/listrouter.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const allowedOrigins = {origin:process.env.FRONTEND_URL,credentials:true};
console.log("allowed origins",allowedOrigins);
console.log("mongo url",process.env.MONGODB_URI);
console.log("frontend url", process.env.FRONTEND_URL);

//middleware
app.use(cors(allowedOrigins));
app.use(express.json());
app.use(cookieParser());


//routes
app.get("/",(req,res) => {res.send("server is live")});
app.use("/api/auth",authrouter);
app.use("/api/user",userrouter);
app.use("/api/list",ListRouter);



await connectDB();


app.listen(port,() => {
    console.log(`serrer is running at ${port}`)
})

