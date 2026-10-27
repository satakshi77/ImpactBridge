const mongoose = require('mongoose');

const connectDB = async () => {
  const defaultUri = 'mongodb+srv://vanshitripathi19_db_user:van19shi@cluster0.5scdnrp.mongodb.net/impactbridge?retryWrites=true&w=majority';
  const mongoUri = process.env.MONGODB_URI || defaultUri;

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`[MongoDB Connected] Host: ${conn.connection.host}, Database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB Connection Error] ${error.message}`);
    console.log('Notice: MongoDB Atlas connection failed or timed out. Check IP whitelist (0.0.0.0/0).');
    console.log('Backend will remain online to respond to health checks and serve fallback routes.');
  }
};

module.exports = connectDB;
