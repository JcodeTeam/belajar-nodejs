import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const DATABASE_NAME = process.env.DATABASE_NAME;
const MONGO_URI = process.env.MONGO_URI;


async function connectDB() {
    try {
            await mongoose.connect(MONGO_URI, {
                dbName: DATABASE_NAME,
            });

        console.log(`Connected to MongoDB | DataBase : ${DATABASE_NAME}`);
    } catch (err) {
        console.error("MongoDB Connection Failed:", err);
        process.exit(1);
    }
}

export default connectDB;
