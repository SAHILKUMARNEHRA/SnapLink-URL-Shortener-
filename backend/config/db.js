import mongoose from 'mongoose';

class Database {
  constructor() {
    if (!Database.instance) {
      this.connection = null;
      Database.instance = this;
    }
    return Database.instance;
  }

  async connect() {
    if (this.connection) return this.connection;
    try {
      const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/snaplink';
      this.connection = await mongoose.connect(uri);
      console.log('MongoDB Connected');
      return this.connection;
    } catch (error) {
      console.error(`Error connecting to MongoDB: ${error.message}`);
      process.exit(1);
    }
  }
}

export default new Database();
