import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/devhub';

    const conn = await mongoose.connect(mongoURI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error(`MongoDB connection error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    console.log('\n⚠️  MongoDB Connection Failed!');
    console.log('📋 Quick Fix Options:');
    console.log('   1. Start MongoDB with Docker: npm run docker:db');
    console.log('   2. Install MongoDB locally - see MONGODB_SETUP.md');
    console.log('   3. Use MongoDB Atlas (cloud) - see MONGODB_SETUP.md\n');
    // Don't exit - let the API run without DB for now
  }
};

export default connectDB;
