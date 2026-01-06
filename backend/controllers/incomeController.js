const Income = require("../models/Income");
const xlsx = require("xlsx");



// add income source 
exports.addIncome = async (req, res) => {
    const userId = req.user.id;

    try {
        const { icon, source, amount, date } = req.body;

        // validation
        if (!source || !amount || !date) {
            return res.status(400).json({ message: "All fields required !" });
        }

        const newIncome = new Income({
            userId,
            icon,
            source,
            amount,
            date
        });

        await newIncome.save();
        res.status(200).json(newIncome);

    } catch (err) {
        res.status(500).json({ message: "Server error !" });
    }
};

// Get income sources 
exports.getAllIncome = async (req, res) => {
    const userId = req.user.id;

    try {
        const income = await Income.find({ userId }).sort({ date: -1 });
        res.json(income);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

// Delete income source 
exports.deleteIncome = async (req, res) => {
    try {
        await Income.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted income" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

// Download source 
exports.downloadIncomeExcel = async (req, res) => {
    const userId = req.user.id;

    try {
        const income = await Income.find({ userId }).sort({ date: -1 });

        const data = income.map((item) => ({
            Source: item.source,
            Amount: item.amount,
            Date: item.date
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Income");

        // Create file in memory (not in folder)
        const buffer = xlsx.write(wb, { bookType: "xlsx", type: "buffer" });

        res.setHeader("Content-Disposition", "attachment; filename=income_details.xlsx");
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

        res.send(buffer);

    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};
