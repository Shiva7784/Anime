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
const port = process.env.PORT || 5000;

const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:5173',
    'http://localhost:3000'
].filter(Boolean);

// Middleware
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
            callback(null, true);
        } else {
            callback(null, true);
        }
    },
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB on incoming requests
app.use(async (req, res, next) => {
    await connectDB();
    next();
});

// Routes
app.get("/", (req, res) => {
    res.send("ANIME API Server is live");
});

app.use("/api/auth", authrouter);
app.use("/api/user", userrouter);
app.use("/api/list", ListRouter);

// Start server locally if not on Vercel
if (!process.env.VERCEL) {
    connectDB();
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

export default app;
