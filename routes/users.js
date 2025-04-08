import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get("/:id/login-history", async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("loginHistory");
        if (!user) return res.status(404).json({ error: "User not found" });

        res.json({ loginHistory: user.loginHistory });
    } catch (error) {
        res.status(500).json({ error: "Error fetching login history" });
    }
});

// User Login Route
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "User not found. Please sign up first." });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials. Please try again." });
        }

        // Extract device
        const device = req.useragent.platform + " - " + req.useragent.browser;

        // Extract IP (you can get it from req.ip or headers)
        const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

        // Extract location using geoip
        const geo = geoip.lookup(ip);
        const location = geo ? `${geo.city}, ${geo.country}` : "Unknown";

        // Push login history
        user.loginHistory.push({
            device,
            location,
            date: new Date()
        });

        await user.save();

        // Generate JWT Token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        // Send response
        res.json({ message: "Login successful", token, user: { id: user._id, name: user.name, email: user.email, mobile: user.mobile, createdAt: user.createdAt } });

    } catch (error) {
        res.status(500).json({ error: "Server error: " + error.message });
    }
});

// ✅ 1. Signup (Create User)
router.post("/signup", async (req, res) => {
    try {
        const { name, email, mobile, password } = req.body;

        // Check if email or mobile already exists
        const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });
        if (existingUser) {
            return res.status(400).json({ error: "Email or Mobile already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save new user
        const newUser = new User({ name, email, mobile, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error) {
        res.status(500).json({ error: "Error signing up: " + error.message });
    }
});

// ✅ 2. Get All Users
router.get("/", async (req, res) => {
    try {
        const users = await User.find().select("-password"); // Exclude password
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Error fetching users" });
    }
});

// ✅ 3. Get a Single User
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Error fetching user" });
    }
});

// ✅ 4. Update User
router.put("/update/:id", async (req, res) => {
    try {
        const { name, email, mobile, password } = req.body;
        const updatedData = { name, email, mobile };

        // Hash new password if provided
        if (password) {
            updatedData.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, updatedData, { new: true }).select("-password");
        if (!updatedUser) return res.status(404).json({ error: "User not found" });

        res.json({ message: "User updated", user: updatedUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ 5. Delete User
router.delete("/delete/:id", async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ error: "User not found" });

        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting user" });
    }
});

// Update Password Route (Requires Authorization Header)
router.post("/update-password", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Missing or invalid Authorization header" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        const { current_password, new_password } = req.body;

        // ✅ Validate input
        if (!current_password || !new_password) {
            return res.status(400).json({ error: "Both current and new passwords are required." });
        }

        // Check if current password is correct
        const isMatch = await bcrypt.compare(current_password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Current password is incorrect" });
        }

        // Update password
        const hashedPassword = await bcrypt.hash(new_password, 10);
        user.password = hashedPassword;
        await user.save();

        res.json({ message: "Password updated successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Server error: " + error.message });
    }
});

export default router;
