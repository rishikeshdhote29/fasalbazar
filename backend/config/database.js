const mongoose = require("mongoose");

const connectDB = async () => {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
        throw new Error("MONGO_URI is not configured");
    }

    try {
        await mongoose.connect(mongoUri, {
        dbName: "fasalbazar",
            serverSelectionTimeoutMS: 5000
        });

        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection failed:", error.message);
        throw error;
    }
};

module.exports = connectDB;