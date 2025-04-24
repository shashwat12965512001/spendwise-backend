import mongoose from "mongoose";

const ScrapedDealSchema = new mongoose.Schema({
    name: String,
    data: mongoose.Schema.Types.Mixed
}, { timestamps: true });

export default mongoose.models.Schema || mongoose.model("ScrapedDeal", ScrapedDealSchema);
