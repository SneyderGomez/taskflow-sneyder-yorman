import mongoose from 'mongoose';
import { config } from './env.js';

export async function connectMongoDB() {
  try {
    await mongoose.connect(config.mongoUrl, {
      serverSelectionTimeoutMS: 8000
    });
    console.log('[MongoDB] Conectado a', config.mongoUrl);
  } catch (err) {
    console.error('[MongoDB] Error de conexión:', err.message);
    throw err;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}

export async function pingMongo() {
  try {
    await mongoose.connection.db.admin().ping();
    return true;
  } catch {
    return false;
  }
}