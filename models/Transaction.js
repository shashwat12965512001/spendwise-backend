import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Required
    date: { type: Date, required: true }, // Required
    amount: { type: Number, required: true }, // Required
    category: { type: String, required: true }, // Required
    expense_type: { type: String, required: true },
    upi_id: { type: String, required: true },
    transaction_id: { type: String, required: true },

    // Optional fields (default to empty string)
    message: { type: String, default: "" },
    receiver_name: { type: String, default: "" },
});

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
