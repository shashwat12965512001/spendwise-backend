import mongoose from "mongoose";

const loginHistorySchema = new mongoose.Schema({
    device: String,
    location: String,
    date: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true, unique: true }, // ✅ Added mobile number (Unique)
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    loginHistory: [loginHistorySchema]
});

const User = mongoose.model("User", userSchema);

export default User;
