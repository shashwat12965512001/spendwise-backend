import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    settings: {
        enableNotifications: { type: Boolean, default: true },
        smartSpendingNotifications: { type: Boolean, default: false },
        dailySummary: { type: Boolean, default: false },
        weeklySummary: { type: Boolean, default: true },
        hideDefaultSMSNotifications: { type: Boolean, default: false },
    }
}, { timestamps: true });

export default mongoose.model("Settings", SettingsSchema);
