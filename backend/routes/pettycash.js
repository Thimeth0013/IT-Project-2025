const router = require('express').Router();
const PettyCash = require('../Models/pettycash');


// GET: Fetch all petty cash entries, sorted by date (newest first)
router.get('/', async (req, res) => {
    try {
        const entries = await PettyCash.find().sort({ date: -1 });
        res.status(200).json(entries);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// POST: Add a new petty cash entry
router.post('/', async (req, res) => {
    // Create new entry from request body
    const entry = new PettyCash(req.body);
    try {
        const newEntry = await entry.save();
        res.status(201).json(newEntry);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE: Remove a petty cash entry
router.delete('/:id', async (req, res) => {
    try {
        const deletedEntry = await PettyCash.findByIdAndDelete(req.params.id);
        if (!deletedEntry) {
            return res.status(404).json({ message: 'Entry not found' });
        }
        res.json({ success: true, id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT: Update a petty cash entry
router.put('/:id', async (req, res) => {
    try {
        const updatedEntry = await PettyCash.findByIdAndUpdate(
            req.params.id,
            {
                ...req.body,
                amount: Number(req.body.amount),
                date: new Date(req.body.date)
            },
            { new: true }
        );
        if (!updatedEntry) {
            return res.status(404).json({ message: 'Entry not found' });
        }
        res.json(updatedEntry);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
