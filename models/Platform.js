const mongoose = require("mongoose");

const ScrapedDealSchema = new mongoose.Schema({
    name: String,
    data: mongoose.Schema.Types.Mixed
}, { timestamps: true });

module.exports = mongoose.model("ScrapedDeal", ScrapedDealSchema);
