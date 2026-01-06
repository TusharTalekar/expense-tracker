const Expense = require("../models/Expense");
const xlsx = require("xlsx");



// add income source 
exports.addExpense = async (req, res) => {
    const userId = req.user.id;

    try {
        const { icon, category, amount, date } = req.body;

        // validation
        if (!category || !amount || !date) {
            return res.status(400).json({ message: "All fields required !" });
        }

        const newExpense = new Expense({
            userId,
            icon,
            category,
            amount,
            date
        });

        await newExpense.save();
        res.status(200).json(newExpense);

    } catch (err) {
        res.status(500).json({ message: "Server error !" });
    }
};

// Get income sources 
exports.getAllExpense = async (req, res) => {
    const userId = req.user.id;

    try {
        const expense = await Expense.find({ userId }).sort({ date: -1 });
        res.json(expense);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

// Delete income source 
exports.deleteExpense = async (req, res) => {
    try {
        await Expense.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted expense" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

// Download source 
exports.downloadExpenseExcel = async (req, res) => {
    const userId = req.user.id;

    try {
        const expense = await Expense.find({ userId }).sort({ date: -1 });

        const data = expense.map((item) => ({
            Category: item.category,
            Amount: item.amount,
            Date: item.date,
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Expense");

        const buffer = xlsx.write(wb, { bookType: "xlsx", type: "buffer" });

        res.setHeader("Content-Disposition", "attachment; filename=expense_details.xlsx");
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

        res.send(buffer);

    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};
