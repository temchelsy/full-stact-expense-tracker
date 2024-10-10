import IncomeSchema from '../models/IncomeModel.js';

export const addIncome = async (req, res) => {
    const { title, amount, category, description, date } = req.body;

    console.log("Request body:", req.body);

    // Validating required fields
    if (!title || !category || !description || !date) {
        return res.status(400).json({ message: 'All fields are required!' });
    }

    // Parsing and validating amount
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
        return res.status(400).json({ message: 'Amount must be a positive number!' });
    }

    // Date validation and parsing
    let parsedDate;
    try {
        parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
            throw new Error('Invalid date');
        }
    } catch (error) {
        return res.status(400).json({ message: 'Invalid date format! Please provide a valid date.' });
    }

    const income = new IncomeSchema({
        title,
        amount: parsedAmount,
        category,
        description,
        date: parsedDate,
    });

    try {
        await income.save();
        res.status(201).json({ message: 'Income Added Successfully', income });
    } catch (error) {
        console.error("Error saving income:", error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

export const getIncomes = async (req, res) => {
    try {
        const incomes = await IncomeSchema.find().sort({ createdAt: -1 });
        res.status(200).json(incomes);
    } catch (error) {
        console.error("Error fetching incomes:", error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

export const deleteIncome = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'Income ID is required!' });
    }

    try {
        const income = await IncomeSchema.findByIdAndDelete(id);
        if (!income) {
            return res.status(404).json({ message: 'Income not found!' });
        }
        res.status(200).json({ message: 'Income Deleted Successfully', deletedIncome: income });
    } catch (error) {
        console.error("Error deleting income:", error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};