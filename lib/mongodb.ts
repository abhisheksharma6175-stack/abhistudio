import mongoose, { Types } from "mongoose";
import type { Db } from "mongodb";

const globalForMongo = global as typeof globalThis & { mongoConnection?: Promise<Db> };

export async function connectDB(): Promise<Db> {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured.");
  if (!globalForMongo.mongoConnection) {
    globalForMongo.mongoConnection = mongoose.connect(process.env.DATABASE_URL).then(() => mongoose.connection.db as Db);
  }
  return globalForMongo.mongoConnection;
}

export function objectId(id: string) {
  if (!Types.ObjectId.isValid(id)) throw new Error("Invalid database id.");
  return new Types.ObjectId(id);
}

export function document<T extends Record<string, unknown>>(value: T) {
  const { _id, ...rest } = value;
  return { ...rest, id: _id instanceof Types.ObjectId ? _id.toString() : String(_id) };
}
