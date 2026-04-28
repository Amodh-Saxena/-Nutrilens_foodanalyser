const fs = require('fs');
const path = require('path');

// Load external Intelligence Database
const knowledgeBasePath = path.join(__dirname, '../data/ingredient_intelligence.json');
let INGREDIENT_DB = {};

const loadDatabase = () => {
    try {
        if (!fs.existsSync(knowledgeBasePath)) return;
        const rawData = JSON.parse(fs.readFileSync(knowledgeBasePath, 'utf8'));
        const newDb = {};
        Object.entries(rawData).forEach(([category, ingredients]) => {
            Object.entries(ingredients).forEach(([name, data]) => {
                newDb[name.toLowerCase()] = { ...data, category };
            });
        });
        INGREDIENT_DB = newDb;
    } catch (error) {
        console.error('[DATABASE] Load Error:', error);
    }
};

loadDatabase();

const normalize = (text) => text.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();

/**
 * HIGH-PRECISION ANALYSIS ENGINE
 * Perfroms a deterministic sweep of OCR text against the Intelligence DB.
 */
exports.analyzeIngredientsText = async (text, productName = 'Unknown Product') => {
    if (Object.keys(INGREDIENT_DB).length === 0) loadDatabase();
    
    const rawText = text || '';
    const matchedAnalysis = [];
    const processedNames = new Set();
    
    // 1. Structural Splitting: Break OCR text into individual ingredient fragments
    const fragments = rawText
        .replace(/\n/g, ',')
        .replace(/(contains:|ingredients:|ingredients|contains)/gi, '')
        .replace(/[|\[\]{}*•●▪‣⁃;:./]/g, ',')
        .split(',')
        .map(i => normalize(i))
        .filter(i => i.length > 2 && !/^(and|with|of)$/i.test(i));

    // 2. Fragment Analysis (Subtractive Method for accuracy)
    fragments.forEach(fragment => {
        let remainingText = fragment;
        let foundAnyMatch = false;

        for (let dbKey in INGREDIENT_DB) {
            const entry = INGREDIENT_DB[dbKey];
            const aliases = entry.aliases || [];
            // Sort targets by length descending to match longest phrases first (e.g. "wheat flour" before "wheat")
            const searchTargets = [dbKey, ...aliases].sort((a, b) => b.length - a.length);

            for (let target of searchTargets) {
                const cleanTarget = target.toLowerCase().trim();
                if (remainingText.includes(cleanTarget)) {
                    const standardizedName = dbKey.toUpperCase();
                    if (!processedNames.has(standardizedName)) {
                        matchedAnalysis.push({
                            name: standardizedName,
                            category: entry.category,
                            severity: entry.severity,
                            impact: entry.impact,
                            explanation: entry.explanation
                        });
                        processedNames.add(standardizedName);
                    }
                    foundAnyMatch = true;
                    // Extract the found target from the remaining text to expose unknowns
                    remainingText = remainingText.replace(new RegExp(cleanTarget, 'gi'), ' ');
                    break; // Move to next DB ingredient after a match
                }
            }
        }

        // Process any leftover significant words in the fragment as Unknowns
        const leftoverWords = remainingText.split(/\s+/).filter(w => w.length > 4);
        leftoverWords.forEach(word => {
            const unknownName = word.toUpperCase();
            if (!processedNames.has(unknownName)) {
                matchedAnalysis.push({
                    name: unknownName,
                    category: 'Unknown',
                    severity: 'Moderate',
                    impact: 'Unverified Component',
                    explanation: 'Not found in primary database. Cannot verify safety.'
                });
                processedNames.add(unknownName);
            }
        });
    });

    // SCORING LOGIC
    let score = 100;
    matchedAnalysis.forEach(m => {
        if (m.severity === 'High' || m.severity === 'Extreme') score -= 15;
        if (['Additives', 'Preservatives', 'Emulsifiers', 'Industrial Fats'].includes(m.category)) score -= 5;
    });

    const stressScore = Math.min(100, Math.max(0, 100 - score));

    return {
        success: true,
        name: productName,
        ingredients: rawText,
        components: matchedAnalysis,
        metabolicStressScore: Math.round(stressScore),
        summary: `Metabolic autopsy complete. Identified ${matchedAnalysis.length} biochemical factors.`
    };
};
