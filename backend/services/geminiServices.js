const axios = require("axios");

/**
 * GEMINI INTELLIGENCE SERVICE
 * Provides fallback intelligence when OCR or external databases are incomplete.
 */

async function analyzeIngredients(ingredients) {
    const prompt = `
You are a food analysis AI.
Analyze these ingredients:
${ingredients.join(", ")}

Return JSON only:
{
 "additives": [],
 "nova_class": "",
 "toxicity_score": 0,
 "metabolic_stress": "",
 "health_explanation": ""
}

Rules:
- additives must contain harmful additives
- nova_class must be NOVA1 NOVA2 NOVA3 or NOVA4
- metabolic_stress must be LOW MEDIUM or HIGH
`;

    const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
            contents: [{
                parts: [{ text: prompt }]
            }]
        }
    );

    const text = response.data.candidates[0].content.parts[0].text;
    return JSON.parse(text.replace(/```json|```/g, ''));
}

/**
 * Predicts the full ingredient list of a known product when OCR is incomplete.
 * Used as a fallback for products like Maggi, Parle-G, etc.
 */
async function predictIngredients(productName) {
    try {
        const prompt = `
The user scanned a food product named: "${productName}". 
The OCR data is incomplete or corrupted. 
Based on your extensive knowledge of global food databases, provide the LIKELY full ingredient list for this specific product.
Include technical industrial additives, preservatives, and emulsifiers that are typically found in this product.

Format your response as a simple comma-separated string of ingredients ONLY.
Example: Wheat Flour, Palm Oil, Sugar, Salt, MSG, INS 635, Sodium Benzoate...
`;

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                contents: [{
                    parts: [{ text: prompt }]
                }]
            }
        );

        const result = response.data.candidates[0].content.parts[0].text;
        console.log(`[GEMINI] Predicted Ingredients for "${productName}":`, result);
        return result;
    } catch (error) {
        console.error('[GEMINI] Prediction Failed:', error.message);
        return "";
    }
}

module.exports = { analyzeIngredients, predictIngredients };