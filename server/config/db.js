import mongoose from 'mongoose';

let hasWarned = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.includes('<username>')) {
    console.warn(
      '[db] MONGODB_URI is missing or still a placeholder — skipping connection.\n' +
        '     Set a real MongoDB Atlas URI in server/.env to enable database features.'
    );
    return;
  }

  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(uri);
    console.log(`[db] MongoDB connected: ${mongoose.connection.host}`);
  } catch (err) {
    if (!hasWarned) {
      console.error(`[db] MongoDB connection failed: ${err.message}`);
      console.error('     The server will keep running, but DB-backed routes will fail until this is fixed.');
      hasWarned = true;
    }
  }

  mongoose.connection.on('disconnected', () => {
    console.warn('[db] MongoDB disconnected');
  });
};

export const isDbConnected = () => mongoose.connection.readyState === 1;
