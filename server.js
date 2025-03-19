const express = require("express");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const ACCESS_SECRET = process.env.ACCESS_SECRET || "my_access_secret"; // سر التوكن
const TOKEN_EXPIRY = "1h"; // مدة التوكن

// إنشاء Access Token جديد
function generateToken(userId) {
    return jwt.sign({ userId }, ACCESS_SECRET, { expiresIn: TOKEN_EXPIRY });
}

// Middleware للتحقق من التوكن وتجديده تلقائيًا إذا انتهت صلاحيته
function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.status(401).json({ message: "Access Denied! No Token Provided." });

    jwt.verify(token, ACCESS_SECRET, (err, user) => {
        if (err) {
            if (err.name === "TokenExpiredError") {
                // إذا انتهت صلاحية التوكن، نقوم بإنشاء واحد جديد تلقائيًا
                const newToken = generateToken(user.userId);
                return res.json({ accessToken: newToken });
            }
            return res.status(403).json({ message: "Invalid Token!" });
        }

        req.user = user;
        next();
    });
}

// API لإنشاء التوكن لأول مرة
app.post("/get-token", (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }

    const accessToken = generateToken(userId);
    res.json({ accessToken });
});

// API محمية تحتاج إلى توكن
app.get("/protected-route", authenticateToken, (req, res) => {
    res.json({ message: "You have accessed a protected route!", userId: req.user.userId });
});

// تشغيل السيرفر
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
