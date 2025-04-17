import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    user_id: { type: String, required: true }, // 👈 Mandatory
    name: { type: String, default: "" },       // 👈 Optional
    expense_type: { type: String, default: "" }, // 👈 Optional

    amount: { type: Number, required: true },
    category: { type: String, required: true },
    date: { type: String, required: true }, // Storing as string for now (e.g., ISO string)

    // Optional fields
    upi_id: { type: String, default: "" },
    transaction_id: { type: String, default: "" },
    message: { type: String, default: "" },
    receiver_name: { type: String, default: "" },

    // Extra optional fields from raw bank data
    address: { type: String, default: "" } // e.g., "VA-FEDBNK"
});

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
