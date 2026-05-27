const mongoose = require('mongoose');

// connects to mongodb, exits if it fails
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected: ' + conn.connection.host);
  } catch (error) {
    console.error('Could not connect to MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
