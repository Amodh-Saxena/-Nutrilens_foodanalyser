const mongoose = require('mongoose');

const IngredientLogSchema = new mongoose.Schema({
    productName: {
        type: String,
        default: 'Unknown Product'
    },
    rawOcrText: {
        type: String,
        required: true
    },
    scannedAt: {
        type: Date,
        default: Date.now
    },
    metadata: {
        charCount: Number,
        wordCount: Number
    }
});

module.exports = mongoose.model('IngredientLog', IngredientLogSchema);
