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
app.use(cors());

app.use(express.json());

connectDB();


app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/income", incomeRoutes);
app.use("/api/v1/expense", expenseRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/upload-image", uploadRoutes);

// uploads folder 
// app.use('/uploads', express.static(path.join(__dirname, "uploads")))

const clientPath = path.join(__dirname, "../frontend/dist");

// serve static files
app.use(express.static(clientPath));

// important for React routing (refresh fix)
app.get("*", (req, res, next) => {
    if (req.originalUrl.startsWith("/api") || req.originalUrl.startsWith("/uploads")) {
        return next();
    }
    res.sendFile(path.join(clientPath, "index.html"));
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;