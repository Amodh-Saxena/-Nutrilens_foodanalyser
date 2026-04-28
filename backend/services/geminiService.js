const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Calls Gemini API with the image bytes to analyze ingredients.
 * @param {Buffer} imageBuffer - Current image buffer.
 * @param {String} mimeType - e.g. 'image/jpeg'
 * @returns {Object} JSON response from Gemini
 */
const analyzeIngredients = async (imageBuffer, mimeType) => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: [
                {
                    role: 'user',
                    parts: [
                        {
                            inlineData: {
                                data: imageBuffer.toString('base64'),
                                mimeType: mimeType
                            }
                        },
                        {
                            text: `Analyze this image of food or an ingredient label. Provide a structured JSON response identifying the ingredients, breaking them down into specific components (e.g., sugars, healthy fats, harmful chemicals), and calculating a 'Metabolic Stress Score' out of 100 based on how taxing these ingredients are on the human metabolism.
                            
Ensure the output is STRICTLY valid JSON ONLY without any markdown blocks.
Format:
{
  "ingredients": ["ingredient1", "ingredient2"],
  "components": [
    {
      "name": "Component Name",
      "description": "Brief description of what this does to the body",
      "impact": "Positive" | "Neutral" | "Negative" | "Unknown"
    }
  ],
  "metabolicStressScore": 75,
  "summary": "A brief, narrative-style one-paragraph summary of the metabolic impact."
}`
                        }
                    ]
                }
            ]
        });

        let responseText = response.text;
        
        // Ensure no markdown formatting in the response text if Gemini accidentally includes it
        if (responseText.startsWith('\`\`\`json')) {
            responseText = responseText.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
        }

        const jsonResult = JSON.parse(responseText);
        return jsonResult;
    } catch (error) {
        console.error('Error in Gemini Service:', error);
        throw new Error('Failed to analyze image with Gemini API');
    }
};

module.exports = { analyzeIngredients };
