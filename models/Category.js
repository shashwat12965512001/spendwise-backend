import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    icon: { type: String, required: true }, // Store SVG or class names
});

export default mongoose.models.Category || mongoose.model("Category", categorySchema);
