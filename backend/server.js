require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

const app = express();


// middelware to handle cors
app.use(
    cors({
        origin: process.env.CLIENT_URL || "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();


app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/income", incomeRoutes);
app.use("/api/v1/expense", expenseRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/upload-image", uploadRoutes);

// -------------------------------------------------------------------------
// Serve Frontend Static Files & SPA Handling
// -------------------------------------------------------------------------

// adjust path if frontend folder is elsewhere
const frontendPath = path.join(__dirname, "../frontend/dist");
// 1. Serve static frontend files
app.use(express.static(frontendPath));
// 2. SPA fallback (React / Vue routing)
app.use((req, res, next) => {
    if (req.path.startsWith("/api")) {
        return next();
    }

    res.sendFile(path.join(frontendPath, "index.html"), (err) => {
        if (err) {
            console.error("Error serving index.html:", err);
            if (!res.headersSent) {
                res.status(500).send("Server Error");
            }
        }
    });
});

// -------------------- API 404 Handler --------------------
app.use((req, res) => {
    if (req.path.startsWith("/api")) {
        res.status(404).json({ message: "API endpoint not found" });
    }
});

// -------------------- Global Error Handler --------------------
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || "Something went wrong!",
        status: err.status || 500,
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Server running on port http://localhost:${PORT}`);
});

module.exports = app;