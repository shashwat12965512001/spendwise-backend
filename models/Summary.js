import mongoose from "mongoose";

const summarySchema = new mongoose.Schema({
    user_id: { type: String, required: true },
    year: { type: Number, required: true },
    month: { type: String, required: true }, // Example: "January"
    total_income: { type: Number, required: true },
    total_expense: { type: Number, required: true },
    total_savings: { type: Number, required: true },
}, {
    timestamps: true,
});

const Summary = mongoose.model("Summary", summarySchema);

export default Summary;
