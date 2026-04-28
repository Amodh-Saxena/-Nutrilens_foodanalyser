const express = require('express');
const router = express.Router();
const { getDashboardHistory, addDailyLog, predictMetabolicScore } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

// All dashboard routes are protected
router.use(protect);

router.get('/history', getDashboardHistory);
router.post('/log', addDailyLog);
router.post('/predict', predictMetabolicScore);

module.exports = router;
    