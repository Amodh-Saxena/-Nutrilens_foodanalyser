const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/nutrilens', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`[DATABASE] MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`[ERROR] Database Connection Failed: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
