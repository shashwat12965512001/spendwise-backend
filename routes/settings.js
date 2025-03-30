import express from "express";
import Settings from "../models/Settings.js";

const router = express.Router();

// ✅ Save user settings
router.post("/save", async (req, res) => {
    try {
        const { userId, settings } = req.body;

        if (!userId) return res.status(400).json({ error: "User ID is required" });

        // Update settings for the user or create new if not exist
        const updatedSettings = await Settings.findOneAndUpdate(
            { userId },
            { settings },
            { new: true, upsert: true } // Creates new entry if it doesn't exist
        );

        res.status(200).json({ message: "Settings saved successfully", data: updatedSettings });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error saving settings" });
    }
});

// ✅ Fetch user settings
router.get("/get/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        const userSettings = await Settings.findOne({ userId });

        if (!userSettings) {
            return res.status(404).json({ message: "No settings found" });
        }

        res.status(200).json(userSettings.settings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error fetching settings" });
    }
});

export default router;
