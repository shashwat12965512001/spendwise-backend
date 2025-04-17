import express from "express";
import Transaction from "../models/Transaction.js";

const router = express.Router();

// GET yearly transactions grouped by month
router.get("/yearly/:userId/:year", async (req, res) => {
    const { userId, year } = req.params;

    try {
        const startOfYear = new Date(`${year}-01-01T00:00:00.000Z`);
        const startOfNextYear = new Date(`${parseInt(year) + 1}-01-01T00:00:00.000Z`);

        const transactions = await Transaction.find({
            user_id: userId,
            date: {
                $gte: startOfYear,
                $lt: startOfNextYear
            }
        }).sort({ date: 1 });

        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        const groupedByMonth = {};

        for (const txn of transactions) {
            const monthIndex = txn.date.getMonth(); // 👈 use JS Date API
            const monthName = monthNames[monthIndex];

            if (!groupedByMonth[monthName]) {
                groupedByMonth[monthName] = [];
            }

            groupedByMonth[monthName].push(txn);
        }

        res.status(200).json({ success: true, transactions: groupedByMonth });
    } catch (error) {
        console.error("Error fetching yearly transactions:", error);
        res.status(500).json({ success: false, error: "Server error: " + error.message });
    }
});

// GET recent transactions
router.get("/recent/:userId/:count?", async (req, res) => {
    const { userId, count } = req.params;

    try {
        const limit = parseInt(count) || 10;

        const transactions = await Transaction.find({ user_id: userId })
            .sort({ date: -1 }) // descending order
            .limit(limit);

        res.status(200).json({ success: true, transactions });
    } catch (error) {
        console.error("Error fetching recent transactions:", error);
        res.status(500).json({ success: false, error: "Server error: " + error.message });
    }
});

// POST add new transaction
router.post("/add", async (req, res) => {
    try {
        const {
            name = "",
            date,
            amount,
            category,
            upi_id = "",
            transaction_id = "",
            message = "",
            receiver_name = "",
            expense_type = "",
            user_id,
            address = ""
        } = req.body;

        if (!user_id || !date || !amount || !category) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const newTransaction = new Transaction({
            name,
            date,
            amount,
            category,
            expense_type,
            user_id,
            upi_id,
            transaction_id,
            message,
            receiver_name,
            address
        });

        await newTransaction.save();
        res.status(201).json({ message: "Transaction added successfully", transaction: newTransaction });
    } catch (error) {
        res.status(500).json({ error: "Error adding transaction: " + error.message });
    }
});

// GET all transactions (admin/debug use)
router.get("/all", async (req, res) => {
    try {
        const transactions = await Transaction.find().sort({ date: -1 });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: "Error fetching transactions: " + error.message });
    }
});

// GET all transactions for a specific user
router.get("/all/:userId", async (req, res) => {
    const { userId } = req.params;

    try {
        const transactions = await Transaction.find({
            user_id: userId
        }).sort({ date: -1 });

        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: "Error fetching transactions: " + error.message });
    }
});

// PUT update transaction
router.put("/update/:id", async (req, res) => {
    try {
        const {
            name = "",
            date,
            amount,
            category,
            upi_id = "",
            transaction_id = "",
            message = "",
            receiver_name = "",
            expense_type = "",
            user_id,
            address = ""
        } = req.body;

        if (!user_id || !date || !amount || !category) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const updatedTransaction = await Transaction.findByIdAndUpdate(
            req.params.id,
            {
                name,
                date,
                amount,
                category,
                upi_id,
                transaction_id,
                message,
                receiver_name,
                expense_type,
                user_id,
                address
            },
            { new: true }
        );

        res.json({ message: "Transaction updated successfully", transaction: updatedTransaction });
    } catch (error) {
        res.status(500).json({ error: "Error updating transaction: " + error.message });
    }
});

// DELETE transaction
router.delete("/delete/:id", async (req, res) => {
    try {
        await Transaction.findByIdAndDelete(req.params.id);
        res.json({ message: "Transaction deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting transaction: " + error.message });
    }
});

export default router;
