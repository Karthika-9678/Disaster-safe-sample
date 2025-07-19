const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://user:pass@cluster0.mongodb.net/DisasterAppDB?retryWrites=true&w=majority');
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
  }
};

module.exports = connectDB;
