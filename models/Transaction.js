import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Required
    date: { type: Date, required: true }, // Required
    amount: { type: Number, required: true }, // Required
    category: { type: String, required: true }, // Required

    // Optional fields (default to empty string)
    message: { type: String, default: "" },
    upi_id: { type: String, default: "" },
    transaction_id: { type: String, default: "" },
    receiver_name: { type: String, default: "" },
    expense_type: { type: String, default: "" },
});

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
