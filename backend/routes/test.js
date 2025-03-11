const router = require('express').Router();
// const TestModel = require('../models/Test');

// Test route
router.get('/', async (req, res) => {
	try {
		return res.status(200).json({
			success: true,
			message: 'This is a test route'
		});
	} catch (err) {
		return res.status(400).json({
			success: false,
			message: err
		});
	}
});

module.exports = router;