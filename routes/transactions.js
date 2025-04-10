import express from "express";
import Transaction from "../models/Transaction.js";

const router = express.Router();

// GET route to fetch recent transactions with a dynamic limit
router.get("/recent/:userId/:count?", async (req, res) => {
    const { userId, count } = req.params;

    try {
        const limit = parseInt(count) || 10;

        const transactions = await Transaction.find({ user_id: userId }) // 👈 filter by user_id
            .sort({ createdAt: -1 }) // latest first
            .limit(limit);

        res.status(200).json({ success: true, transactions });
    } catch (error) {
        console.error("Error fetching recent transactions:", error);
        res.status(500).json({ success: false, error: "Server error: " + error.message });
    }
});

// Add a new transaction
router.post("/add", async (req, res) => {
    try {
        const { name, date, amount, category, upi_id, transaction_id, expense_type, user_id } = req.body;

        const newTransaction = new Transaction({
            name,
            date,
            amount,
            category,
            expense_type,
            upi_id,
            transaction_id,
            user_id,
            message: "",
            receiver_name: "",
        });

        await newTransaction.save();
        res.status(201).json({ message: "Transaction added successfully", transaction: newTransaction });
    } catch (error) {
        res.status(500).json({ error: "Error adding transaction: " + error.message });
    }
});

// Get all transactions
router.get("/all", async (req, res) => {
    try {
        const transactions = await Transaction.find().sort({ date: -1 });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: "Error fetching transactions: " + error.message });
    }
});

// GET all transactions of a specific user
router.get("/all/:userId", async (req, res) => {
    const { userId } = req.params;

    try {
        const transactions = await Transaction.find({
            user_id: userId, // <-- match the field name exactly
        }).sort({ date: -1 });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: "Error fetching transactions: " + error.message });
    }
});

// Update a transaction
router.put("/update/:id", async (req, res) => {
    try {
        const { name, date, amount, category, upi_id, transaction_id, expense_type, user_id } = req.body;

        const updatedTransaction = await Transaction.findByIdAndUpdate(
            req.params.id,
            { name, date, amount, category, upi_id, transaction_id, expense_type, user_id },
            { new: true }
        );

        res.json({ message: "Transaction updated successfully", transaction: updatedTransaction });
    } catch (error) {
        res.status(500).json({ error: "Error updating transaction: " + error.message });
    }
});

// Delete a transaction
router.delete("/delete/:id", async (req, res) => {
    try {
        await Transaction.findByIdAndDelete(req.params.id);
        res.json({ message: "Transaction deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting transaction: " + error.message });
    }
});

export default router;
