import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Required
    date: { type: String, required: true }, // Required
    amount: { type: Number, required: true }, // Required
    category: { type: String, required: true }, // Required
    expense_type: { type: String, required: true }, // Required

    // Optional fields (default to empty string)
    upi_id: { type: String },
    transaction_id: { type: String },
    message: { type: String, default: "" },
    receiver_name: { type: String, default: "" },
});

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
