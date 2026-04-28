require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

async function test() {
    console.log("Starting test...");
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: 'Hello!'
        });
        console.log("Success:", response.text());
    } catch (e) {
        console.error("Gemini Error:", e);
    }
}
test();
