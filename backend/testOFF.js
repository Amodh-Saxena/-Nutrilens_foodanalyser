const { analyzeIngredientsText } = require('./services/openFoodFactsService');

async function testService() {
    console.log("=== Testing Open Food Facts Local Dataset Service ===");
    
    const sampleOcrText1 = "Ingredients: Carbonated Water, High Fructose Corn Syrup, Caramel Color, Phosphoric Acid, Natural Flavors, Caffeine, Polysorbate 80, Sodium Benzoate as a preservative.";
    console.log("\nTesting Sample 1 (Soda):");
    console.log(sampleOcrText1);
    
    try {
        const result1 = await analyzeIngredientsText(sampleOcrText1);
        console.log("\nResult 1:");
        console.log(JSON.stringify(result1, null, 2));
    } catch (e) {
        console.error("Error 1:", e);
    }

    const sampleOcrText2 = "Whole grain rolled oats, isolated soy protein (soy lecithin), sugar, organic water.";
    console.log("\nTesting Sample 2 (Protein Oats):");
    console.log(sampleOcrText2);

    try {
        const result2 = await analyzeIngredientsText(sampleOcrText2);
        console.log("\nResult 2:");
        console.log(JSON.stringify(result2, null, 2));
    } catch (e) {
        console.error("Error 2:", e);
    }
}

testService();
