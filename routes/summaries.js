import express from "express";
import Summary from "../models/Summary.js";

const router = express.Router();

// GET summary data for a user (optionally filter by year or month)
router.get("/:userId", async (req, res) => {
    const { userId } = req.params;
    const { year, month } = req.query;

    const query = { user_id: userId };
    if (year) query.year = parseInt(year);
    if (month) query.month = month;

    try {
        const summaries = await Summary.find(query).sort({ year: 1, month: 1 });
        res.status(200).json({ success: true, summaries });
    } catch (error) {
        console.error("Error fetching summaries:", error);
        res.status(500).json({ success: false, error: "Server error: " + error.message });
    }
});

export default router;
