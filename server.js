import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import useragent from "express-useragent";

import transactionsRoutes from "./routes/transactions.js";
import usersRoutes from "./routes/users.js";
import categoryRoutes from "./routes/categories.js";
import settingsRoutes from "./routes/settings.js";
import summariesRoutes from "./routes/summaries.js";
import platformRoutes from "./routes/platform.js";

dotenv.config();

const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ MongoDB Connected");

        const app = express();

        app.use(cors({
            origin: "*",
            methods: ["GET", "POST", "PUT", "DELETE"],
            allowedHeaders: ["Content-Type", "Authorization"]
        }));

        app.use(express.json());
        app.use(useragent.express());

        app.use("/api/transactions", transactionsRoutes);
        app.use("/api/users", usersRoutes);
        app.use("/api/categories", categoryRoutes);
        app.use("/api/settings", settingsRoutes);
        app.use("/api/summaries", summariesRoutes);
        app.use("/api/platform", platformRoutes);

        app.get("/cors-check", (req, res) => {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.json({ message: "CORS is working" });
        });

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, "0.0.0.0", () =>
            console.log(`🚀 Server running on port ${PORT}`)
        );
    } catch (err) {
        console.error("❌ MongoDB Connection Failed:", err);
        process.exit(1);
    }
};

startServer();

