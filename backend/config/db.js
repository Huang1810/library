const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.info("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    console.error(error.stack);
    
    
    setTimeout(connectDB, 5000);
  }
};

module.exports = connectDB;
