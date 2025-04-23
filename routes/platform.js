import express from "express";
import ScrapedDealSchema from "../models/Platform.js";

const router = express.Router();

// POST /api/deals
router.post('/deals', async (req, res) => {
    try {
        const { platform, data } = req.body;

        if (!platform || !data) {
            return res.status(400).json({ message: 'Missing platform or data' });
        }

        const newDeal = new ScrapedDeal({ platform, data });
        await newDeal.save();

        res.status(201).json({ message: 'Deal saved successfully', deal: newDeal });
    } catch (err) {
        console.error('Error saving deal:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
