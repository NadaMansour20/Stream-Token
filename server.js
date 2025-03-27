const express = require("express");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// ✅ سر التوقيع الخاص بـ Stream
const STREAM_SECRET = process.env.STREAM_SECRET || "fallback_secret";
const TOKEN_EXPIRY = "1h"; // مدة التوكن

// ✅ إنشاء توكن خاص بـ Stream Video
function generateStreamToken(userId) {
    const payload = {
        user_id: userId,
        role: "user", // ضروري علشان تستخدمي CreateCall
    };

    return jwt.sign(payload, STREAM_SECRET, {
        algorithm: "HS256",
        expiresIn: TOKEN_EXPIRY,
    });
}

// ✅ API لإنشاء التوكن
app.post("/get-token", (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }

    const token = generateStreamToken(userId);
    res.json({ token });
});

// ✅ تشغيل السيرفر
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Stream Token server running on port ${PORT}`));
