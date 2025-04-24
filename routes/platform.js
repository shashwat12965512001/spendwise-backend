import express from "express";
import ScrapedDeal from "../models/Platform.js";

const router = express.Router();

// POST /api/deals
router.post('/deals', async (req, res) => {
    try {
        const { name, data: newData } = req.body;

        if (!name || !newData) {
            return res.status(400).json({ message: 'Missing name or data' });
        }

        // Fetch existing entry if any
        let existing = await ScrapedDeal.findOne({ name });

        if (!existing) {
            // No record yet, so insert fresh
            const newDeal = new ScrapedDeal({ name, data: newData });
            await newDeal.save();
            return res.status(201).json({ message: 'New deal saved', deal: newDeal });
        }

        // Merge logic
        const updatedData = { ...existing.data };

        // Loop through keys in newData
        for (const key in newData) {
            if (Array.isArray(newData[key])) {
                if (!Array.isArray(updatedData[key])) updatedData[key] = [];

                // Append only unique items
                const existingItems = updatedData[key];
                const newItems = newData[key];

                // Merge arrays, avoid duplicates based on JSON.stringify
                const mergedArray = [...existingItems];

                newItems.forEach(item => {
                    const isDuplicate = mergedArray.some(existingItem =>
                        JSON.stringify(existingItem) === JSON.stringify(item)
                    );
                    if (!isDuplicate) {
                        mergedArray.push(item);
                    }
                });

                updatedData[key] = mergedArray;
            } else {
                // If it's not an array, just overwrite/merge
                updatedData[key] = newData[key];
            }
        }

        // Update the document
        existing.data = updatedData;
        await existing.save();

        res.status(200).json({ message: 'Deal updated with merge', deal: existing });
    } catch (err) {
        console.error('❌ Error saving deal:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// GET /api/deals
router.get('/deals', async (req, res) => {
    try {
        const deals = await ScrapedDeal.find();
        res.status(200).json(deals);
    } catch (err) {
        console.error('❌ Error fetching all deals:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// GET /api/deals/:platformName
router.get('/deals/:platformName', async (req, res) => {
    try {
        const { platformName } = req.params;

        const deal = await ScrapedDeal.findOne({ name: platformName });
        if (!deal) {
            return res.status(404).json({ message: `No deals found for platform: ${platformName}` });
        }

        res.status(200).json(deal);
    } catch (err) {
        console.error(`❌ Error fetching deals for ${req.params.platformName}:`, err);
        res.status(500).json({ message: 'Internal server error' });
    }
});


export default router;
