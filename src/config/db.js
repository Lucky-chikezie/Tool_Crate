const mongoose = require('mongoose');

async function connectDB() {
  try{
    const connection = await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected: ' + connection.connection.host);
  }
  catch(error) {
    console.log('Failed to connect to MongoDB');
    console.log(error.message);
    process.exit(1);
  }
}

module.exports = connectDB;