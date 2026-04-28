/**
 * NutriLens V2 - Demo Data Seeder
 * ─────────────────────────────────────────────────────────────────
 * Creates a demo user account and populates 14 days of telemetry
 * logs + 8 realistic scan records in Firestore for professor demos.
 *
 * HOW TO USE:
 *   1. Make sure the backend dependencies are installed (npm install)
 *   2. Run from the /backend directory:
 *        node seedDemoData.js
 *   3. Use these credentials to log in:
 *        Email:    demo@nutrilens.ai
 *        Password: Demo@1234
 * ─────────────────────────────────────────────────────────────────
 */

require('dotenv').config();
const bcrypt = require('bcryptjs');
const { admin, db } = require('./config/firebase');

// ── Demo User Credentials ────────────────────────────────────────
const DEMO_USER = {
  name: 'Dr. Demo User',
  email: 'demo@nutrilens.ai',
  password: 'Demo@1234',
};

// ── Helper: subtract N days from today ───────────────────────────
const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
};

const isoAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
};

// ── 14 Days of Telemetry Logs ─────────────────────────────────────
const buildDailyLogs = (userId) => [
  { date: daysAgo(13), sleepHours: 6, dailyFoodStress: 55, metabolicHealthIndex: 72, predictedScore: 72 },
  { date: daysAgo(12), sleepHours: 7, dailyFoodStress: 60, metabolicHealthIndex: 70, predictedScore: 70 },
  { date: daysAgo(11), sleepHours: 8, dailyFoodStress: 45, metabolicHealthIndex: 77, predictedScore: 77 },
  { date: daysAgo(10), sleepHours: 7, dailyFoodStress: 50, metabolicHealthIndex: 75, predictedScore: 75 },
  { date: daysAgo(9),  sleepHours: 5, dailyFoodStress: 70, metabolicHealthIndex: 65, predictedScore: 65 },
  { date: daysAgo(8),  sleepHours: 8, dailyFoodStress: 30, metabolicHealthIndex: 85, predictedScore: 85 },
  { date: daysAgo(7),  sleepHours: 8, dailyFoodStress: 20, metabolicHealthIndex: 90, predictedScore: 90 },
  { date: daysAgo(6),  sleepHours: 7, dailyFoodStress: 35, metabolicHealthIndex: 82, predictedScore: 82 },
  { date: daysAgo(5),  sleepHours: 9, dailyFoodStress: 25, metabolicHealthIndex: 87, predictedScore: 87 },
  { date: daysAgo(4),  sleepHours: 6, dailyFoodStress: 40, metabolicHealthIndex: 80, predictedScore: 80 },
  { date: daysAgo(3),  sleepHours: 7, dailyFoodStress: 30, metabolicHealthIndex: 85, predictedScore: 85 },
  { date: daysAgo(2),  sleepHours: 8, dailyFoodStress: 20, metabolicHealthIndex: 90, predictedScore: 90 },
  { date: daysAgo(1),  sleepHours: 8, dailyFoodStress: 15, metabolicHealthIndex: 92, predictedScore: 92 },
  { date: daysAgo(0),  sleepHours: 9, dailyFoodStress: 10, metabolicHealthIndex: 95, predictedScore: 95 },
].map(log => ({
  ...log,
  user: userId,
  dailyFoodReadiness: 100 - log.dailyFoodStress,
  createdAt: new Date(log.date).toISOString(),
  updatedAt: new Date(log.date).toISOString(),
}));

// ── 8 Realistic Scan Records ──────────────────────────────────────
const buildScans = (userId) => [
  {
    productName: "Instant Noodles (Masala)",
    metabolicStressScore: 72,
    ingredients: "Wheat flour, Palm oil, Salt, High Fructose Corn Syrup, Monosodium Glutamate, Sodium Tripolyphosphate, Tartrazine, Red 40",
    components: [
      { name: "Palm Oil", category: "Industrial Fats", severity: "High", impact: "Negative" },
      { name: "High Fructose Corn Syrup", category: "Refined Sugars", severity: "Extreme", impact: "Negative" },
      { name: "Monosodium Glutamate", category: "Flavor Enhancers", severity: "High", impact: "Negative" },
      { name: "Red 40", category: "Artificial Colors", severity: "High", impact: "Negative" },
      { name: "Wheat flour", category: "Grain", severity: "Low", impact: "Neutral" },
      { name: "Salt", category: "Mineral", severity: "Low", impact: "Neutral" },
    ],
    createdAt: isoAgo(12),
  },
  {
    productName: "Chocolate Sandwich Cookies",
    metabolicStressScore: 68,
    ingredients: "Enriched flour, Sugar, Palm oil, Cocoa, Soy lecithin, Artificial flavors, BHA, High Fructose Corn Syrup",
    components: [
      { name: "High Fructose Corn Syrup", category: "Refined Sugars", severity: "Extreme", impact: "Negative" },
      { name: "Palm Oil", category: "Industrial Fats", severity: "High", impact: "Negative" },
      { name: "BHA", category: "Preservatives", severity: "High", impact: "Negative" },
      { name: "Soy lecithin", category: "Emulsifiers", severity: "Moderate", impact: "Negative" },
      { name: "Cocoa", category: "Natural Flavoring", severity: "Low", impact: "Positive" },
    ],
    createdAt: isoAgo(10),
  },
  {
    productName: "Fruit Juice Drink",
    metabolicStressScore: 55,
    ingredients: "Water, Concentrated apple juice, Sugar, Citric acid, Aspartame, Sodium Benzoate, Red 40, Blue 1",
    components: [
      { name: "Aspartame", category: "Artificial Sweeteners", severity: "Extreme", impact: "Negative" },
      { name: "Sodium Benzoate", category: "Preservatives", severity: "High", impact: "Negative" },
      { name: "Red 40", category: "Artificial Colors", severity: "High", impact: "Negative" },
      { name: "Citric Acid", category: "Natural Acids", severity: "Low", impact: "Neutral" },
    ],
    createdAt: isoAgo(8),
  },
  {
    productName: "Processed Cheese Slices",
    metabolicStressScore: 48,
    ingredients: "Pasteurized milk, Cheddar cheese, Whey, Sodium Citrate, Salt, Sorbic acid, Carrageenan",
    components: [
      { name: "Carrageenan", category: "Emulsifiers", severity: "High", impact: "Negative" },
      { name: "Sorbic acid", category: "Preservatives", severity: "Moderate", impact: "Negative" },
      { name: "Pasteurized milk", category: "Dairy", severity: "Low", impact: "Positive" },
      { name: "Cheddar cheese", category: "Dairy", severity: "Low", impact: "Positive" },
    ],
    createdAt: isoAgo(6),
  },
  {
    productName: "Honey Granola Bar",
    metabolicStressScore: 28,
    ingredients: "Rolled oats, Honey, Almonds, Sunflower seeds, Brown rice syrup, Vanilla extract",
    components: [
      { name: "Rolled oats", category: "Whole Grain", severity: "Low", impact: "Positive" },
      { name: "Honey", category: "Natural Sweetener", severity: "Low", impact: "Positive" },
      { name: "Almonds", category: "Nuts", severity: "Low", impact: "Positive" },
      { name: "Sunflower seeds", category: "Seeds", severity: "Low", impact: "Positive" },
    ],
    createdAt: isoAgo(5),
  },
  {
    productName: "Greek Yogurt (Plain)",
    metabolicStressScore: 12,
    ingredients: "Pasteurized skim milk, Live active cultures (L. bulgaricus, S. thermophilus), Vitamin D",
    components: [
      { name: "Pasteurized skim milk", category: "Dairy", severity: "Low", impact: "Positive" },
      { name: "Live active cultures", category: "Probiotic", severity: "Low", impact: "Positive" },
      { name: "Vitamin D", category: "Nutrient Fortification", severity: "Low", impact: "Positive" },
    ],
    createdAt: isoAgo(3),
  },
  {
    productName: "Flavoured Potato Chips",
    metabolicStressScore: 62,
    ingredients: "Potatoes, Vegetable oil, Salt, Monosodium Glutamate, Disodium Inosinate, Disodium Guanylate, Yellow 5, Red 40",
    components: [
      { name: "Monosodium Glutamate", category: "Flavor Enhancers", severity: "High", impact: "Negative" },
      { name: "Yellow 5", category: "Artificial Colors", severity: "High", impact: "Negative" },
      { name: "Red 40", category: "Artificial Colors", severity: "High", impact: "Negative" },
      { name: "Potatoes", category: "Whole Vegetable", severity: "Low", impact: "Neutral" },
    ],
    createdAt: isoAgo(2),
  },
  {
    productName: "Organic Almond Milk",
    metabolicStressScore: 8,
    ingredients: "Filtered water, Organic almonds, Sea salt, Locust bean gum, Vitamin E, Vitamin D2",
    components: [
      { name: "Organic almonds", category: "Nuts", severity: "Low", impact: "Positive" },
      { name: "Vitamin E", category: "Antioxidant", severity: "Low", impact: "Positive" },
      { name: "Locust bean gum", category: "Natural Stabilizer", severity: "Low", impact: "Neutral" },
      { name: "Sea salt", category: "Mineral", severity: "Low", impact: "Neutral" },
    ],
    createdAt: isoAgo(0),
  },
].map(scan => ({
  ...scan,
  user: userId,
  imageUrl: '/uploads/demo-placeholder.jpg',
  geminiSummary: `Analysis complete for ${scan.productName}. Metabolic stress index: ${scan.metabolicStressScore}/100.`,
  upesMetrics: { novaScore: scan.metabolicStressScore > 50 ? 4 : 2 },
}));

// ── Main Seeder ───────────────────────────────────────────────────
async function seedData() {
  console.log('\n🌱  NutriLens V2 — Demo Data Seeder\n' + '─'.repeat(45));

  // 1. Hash password
  const passwordHash = await bcrypt.hash(DEMO_USER.password, 10);

  // 2. Check if demo user already exists in Firestore
  const usersRef = db.collection('users');
  const existing = await usersRef.where('email', '==', DEMO_USER.email).get();
  let userId;

  if (!existing.empty) {
    userId = existing.docs[0].id;
    console.log(`✅  Demo user already exists — ID: ${userId}`);
  } else {
    const newUserRef = usersRef.doc();
    await newUserRef.set({
      name: DEMO_USER.name,
      email: DEMO_USER.email,
      password: passwordHash,
      createdAt: new Date().toISOString(),
    });
    userId = newUserRef.id;
    console.log(`✅  Created demo user — ID: ${userId}`);
  }

  // 3. Clear old demo data
  console.log('\n🧹  Clearing old demo logs...');
  const oldLogs = await db.collection('dailyLogs').where('user', '==', userId).get();
  const oldScans = await db.collection('scans').where('user', '==', userId).get();
  const batch = db.batch();
  oldLogs.docs.forEach(d => batch.delete(d.ref));
  oldScans.docs.forEach(d => batch.delete(d.ref));
  await batch.commit();
  console.log(`   Deleted ${oldLogs.size} old logs and ${oldScans.size} old scans.`);

  // 4. Insert daily logs
  console.log('\n📊  Seeding 14 daily telemetry logs...');
  const logs = buildDailyLogs(userId);
  const logBatch = db.batch();
  logs.forEach(log => logBatch.set(db.collection('dailyLogs').doc(), log));
  await logBatch.commit();
  console.log(`   ✅  Inserted ${logs.length} telemetry logs.`);

  // 5. Insert scans
  console.log('\n🔬  Seeding 8 food scan records...');
  const scans = buildScans(userId);
  const scanBatch = db.batch();
  scans.forEach(scan => scanBatch.set(db.collection('scans').doc(), scan));
  await scanBatch.commit();
  console.log(`   ✅  Inserted ${scans.length} scan records.`);

  // 6. Summary
  console.log('\n' + '─'.repeat(45));
  console.log('🎓  Demo account ready for professors!');
  console.log('─'.repeat(45));
  console.log(`   Email   : ${DEMO_USER.email}`);
  console.log(`   Password: ${DEMO_USER.password}`);
  console.log(`   User ID : ${userId}`);
  console.log('─'.repeat(45));
  console.log('\n   Data includes:');
  console.log('   • 14 days of MHI / Sleep telemetry (improving trend)');
  console.log('   • 8 food scans: from junk food to clean organic options');
  console.log('   • Allergens: Gluten, Dairy, Soy, Nuts detected');
  console.log('   • Toxins: HFCS, Aspartame, Red 40, BHA, MSG\n');

  process.exit(0);
}

seedData().catch(err => {
  console.error('\n❌  Seeder failed:', err.message);
  process.exit(1);
});
