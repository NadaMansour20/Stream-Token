const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const STREAM_SECRET = process.env.API_SECRET; // ✅ استخدم secret الصحيح
const TOKEN_EXPIRY = "1h";

// ✅ دالة إنشاء التوكن
function generateStreamToken(userId) {
    const payload = {
        user_id: userId,
        role: "user", // مهم علشان يعمل Join / Create call
    };

    return jwt.sign(payload, STREAM_SECRET, {
        algorithm: "HS256",
        expiresIn: TOKEN_EXPIRY,
    });
}

// ✅ endpoint لإنشاء التوكن
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
app.listen(PORT, () => {
    console.log(`✅ Stream token server running on port ${PORT}`);
});
