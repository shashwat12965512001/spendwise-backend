import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import transactionsRoutes from "./routes/transactions.js";
import usersRoutes from "./routes/users.js";
import categoryRoutes from "./routes/categories.js";
import settingsRoutes from "./routes/settings.js";

dotenv.config();
const app = express();

app.use(cors({
    origin: 'https://spendwise-web-seven.vercel.app'
}));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error("❌ DB Connection Error:", err));

app.use("/api/transactions", transactionsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/settings", settingsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
