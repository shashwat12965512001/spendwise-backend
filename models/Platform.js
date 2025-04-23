const mongoose = require("mongoose");

const ScrapedDealSchema = new mongoose.Schema({
    id: String, // platform-specific id (e.g., "amazon")
    name: String, // platform name (e.g., "Amazon")
    data: mongoose.Schema.Types.Mixed // allows any flexible structure
}, { timestamps: true });

module.exports = mongoose.model("ScrapedDeal", ScrapedDealSchema);
