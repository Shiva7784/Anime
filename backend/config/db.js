import mongoose from "mongoose";

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) {
        return;
    }
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            console.error("MONGODB_URI environment variable is missing!");
            return;
        }

        let connectUri = uri.trim();
        if (connectUri.endsWith('/')) {
            connectUri = connectUri + 'Anime';
        }

        console.log("Connecting to MongoDB...");
        await mongoose.connect(connectUri);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
    }
};

export default connectDB;
