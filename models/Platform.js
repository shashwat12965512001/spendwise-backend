import mongoose from "mongoose";

const ScrapedDealSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true // ✅ This ensures only one per platform name
    },
    data: {
        type: Object,
        required: true
    }
}, { timestamps: true });


export default mongoose.models.Schema || mongoose.model("ScrapedDeal", ScrapedDealSchema);
