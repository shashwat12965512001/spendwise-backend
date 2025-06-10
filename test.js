import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose.connect(process.env.MONGODB_URI).then(() => console.log("Connected successfully")).catch((err) => console.error("Connection error:", err));
