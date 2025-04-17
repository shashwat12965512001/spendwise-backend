import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    name: { type: String, default: "" },
    date: { type: Date, required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    expense_type: { type: String, default: "" },
    user_id: { type: String, required: true },
    upi_id: { type: String, default: "" },
    transaction_id: { type: String, default: "" },
    message: { type: String, default: "" },
    receiver_name: { type: String, default: "" },
    address: { type: String, default: "" },
}, {
    timestamps: true,
});

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
