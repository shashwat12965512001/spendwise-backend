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

        const updatedDeal = await ScrapedDeal.findOneAndUpdate(
            { name },
            { $set: { data } },
            { upsert: true, new: true } // upsert = insert if not exists
        );

        res.status(200).json({ message: 'Deal saved/updated successfully', deal: updatedDeal });
    } catch (err) {
        console.error('❌ Error saving deal:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
