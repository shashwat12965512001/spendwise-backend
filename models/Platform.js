const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    id: String,
    name: String,
    URL: String
});

const ScrapedDealSchema = new mongoose.Schema({
    platform: String,
    data: {
        home_page_banner_images: [String],
        products: [ProductSchema]
    }
}, { timestamps: true });

module.exports = mongoose.model("ScrapedDeal", ScrapedDealSchema);
