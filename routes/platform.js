import express from "express";
import ScrapedDeal from "../models/Platform.js";

const router = express.Router();

// POST /api/deals
router.post('/deals', async (req, res) => {
    try {
        const { name, data } = req.body;

        if (!name || !data) {
            return res.status(400).json({ message: 'Missing name or data' });
        }

        const newDeal = new ScrapedDeal({ name, data });
        await newDeal.save();

        res.status(201).json({ message: 'Deal saved successfully', deal: newDeal });
    } catch (err) {
        console.error('Error saving deal:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
