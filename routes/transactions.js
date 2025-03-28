import express from "express";
import Transaction from "../models/Transaction.js";

const router = express.Router();

// Add a new transaction
router.post("/add", async (req, res) => {
    try {
        const { name, date, amount, category } = req.body;

        const newTransaction = new Transaction({
            name,
            date,
            amount,
            category,
            message: "",
            upi_id: "",
            transaction_id: "",
            receiver_name: "",
            expense_type: ""
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

// Update a transaction
router.put("/update/:id", async (req, res) => {
    try {
        const { name, date, amount, category } = req.body;

        const updatedTransaction = await Transaction.findByIdAndUpdate(
            req.params.id,
            { name, date, amount, category },
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
