const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { analyzeImage, getScanHistory, searchProduct, getIngredientLogs } = require('../controllers/analyzeController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'ingredientsImage', maxCount: 1 }
]), analyzeImage);

router.get('/history', protect, getScanHistory);
router.get('/search', protect, searchProduct);
router.get('/logs', getIngredientLogs);

module.exports = router;
