const mongoose= require("mongoose");
const connectDB= async()=>{
	const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/fasalbazar";
	try {
		await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
		console.log("database connected");
	} catch (error) {
		console.error("database connection failed:", error.message);
		throw error;
	}
}
module.exports=connectDB;