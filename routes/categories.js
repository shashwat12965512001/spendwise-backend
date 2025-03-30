import express from "express";
import Category from "../models/Category.js";

const router = express.Router();

// Add a new category
router.post("/add", async (req, res) => {
    try {
        const { name, icon } = req.body;
        if (!name || !icon) return res.status(400).json({ error: "All fields are required." });

        const existingCategory = await Category.findOne({ name });
        if (existingCategory) return res.status(400).json({ error: "Category already exists." });

        const newCategory = new Category({ name, icon });
        await newCategory.save();

        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

// Get all categories
router.get("/", async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

// Delete a category
router.delete("/:id", async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

export default router;
