import mongoose, { Types } from "mongoose";
import type { Db } from "mongodb";

console.log("DB URL:", process.env.DATABASE_URL);

const globalForMongo = globalThis as typeof globalThis & {
  mongoConnection?: Promise<Db>;
  memoryStore?: Record<string, Record<string, unknown>[]>;
  mongoIsMemory?: boolean;
};

type MemoryDocument = Record<string, unknown> & { _id?: unknown };

function normalizeValue(value: unknown) {
  return value instanceof Types.ObjectId ? value.toString() : value;
}

function compareValues(left: unknown, right: unknown) {
  return String(normalizeValue(left)) === String(normalizeValue(right));
}

function matchesQuery(document: MemoryDocument, query: Record<string, unknown> = {}) {
  return Object.entries(query).every(([key, queryValue]) => {
    const value = document[key];
    if (queryValue && typeof queryValue === "object" && !Array.isArray(queryValue) && "$in" in queryValue) {
      return (queryValue as { $in: unknown[] }).$in.some((entry) => compareValues(value, entry));
    }
    if (queryValue && typeof queryValue === "object" && !Array.isArray(queryValue) && "$ne" in queryValue) {
      return !compareValues(value, (queryValue as { $ne: unknown }).$ne);
    }
    return compareValues(value, queryValue);
  });
}

function sortDocuments(items: MemoryDocument[], sortSpec: Record<string, number> = {}) {
  const entries = Object.entries(sortSpec);
  if (!entries.length) return items;
  const sorted = [...items];
  sorted.sort((left, right) => {
    for (const [key, direction] of entries) {
      const leftValue = left[key];
      const rightValue = right[key];
      const leftComparable = leftValue instanceof Date ? leftValue.getTime() : leftValue;
      const rightComparable = rightValue instanceof Date ? rightValue.getTime() : rightValue;
      if (leftComparable === rightComparable) continue;
      const result = leftComparable && rightComparable && leftComparable < rightComparable ? -1 : 1;
      return direction < 0 ? -result : result;
    }
    return 0;
  });
  return sorted;
}

function createMemoryCursor(items: MemoryDocument[], query: Record<string, unknown> = {}, sortSpec: Record<string, number> = {}) {
  const filtered = items.filter((item) => matchesQuery(item, query));
  const sorted = sortDocuments(filtered, sortSpec);
  return {
    sort(spec: Record<string, number>) {
      return createMemoryCursor(items, query, spec);
    },
    toArray: async () => sorted,
  };
}

function createMemoryDb(): Db {
  const store: Record<string, MemoryDocument[]> = {};
  const collections = new Map<string, MemoryCollection>();

  class MemoryCollection {
    constructor(private name: string) {}

    find(query: Record<string, unknown> = {}) {
      return createMemoryCursor(store[this.name] || [], query);
    }

    async findOne(query: Record<string, unknown> = {}) {
      return (store[this.name] || []).find((item) => matchesQuery(item, query)) || null;
    }

    async insertOne(document: MemoryDocument) {
      const list = store[this.name] || [];
      const id = typeof document._id === "string" || typeof document._id === "number" ? document._id : `mem-${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const item = { ...document, _id: id } as MemoryDocument;
      list.push(item);
      store[this.name] = list;
      return { insertedId: id };
    }

    async updateOne(query: Record<string, unknown>, update: { $set?: Record<string, unknown> }) {
      const list = store[this.name] || [];
      const target = list.find((item) => matchesQuery(item, query));
      if (!target) return { modifiedCount: 0 };
      const next = { ...target, ...update.$set, _id: target._id } as MemoryDocument;
      const index = list.indexOf(target);
      list[index] = next;
      store[this.name] = list;
      return { modifiedCount: 1 };
    }

    async deleteOne(query: Record<string, unknown>) {
      const list = store[this.name] || [];
      const target = list.find((item) => matchesQuery(item, query));
      if (!target) return { deletedCount: 0 };
      store[this.name] = list.filter((item) => item !== target);
      return { deletedCount: 1 };
    }
  }

  return {
    collection(name: string) {
      if (!collections.has(name)) collections.set(name, new MemoryCollection(name));
      return collections.get(name)!;
    },
  } as unknown as Db;
}

export async function connectDB(): Promise<Db> {
  if (!globalForMongo.mongoConnection) {
    globalForMongo.mongoConnection = (async () => {
      try {
        if (!process.env.DATABASE_URL) {
          globalForMongo.mongoIsMemory = true;
          return createMemoryDb();
        }
        await mongoose.connect(process.env.DATABASE_URL);
        globalForMongo.mongoIsMemory = false;
        return mongoose.connection.db as Db;
      } catch (error) {
        console.warn("MongoDB unavailable, using in-memory fallback.", error);
        globalForMongo.mongoIsMemory = true;
        return createMemoryDb();
      }
    })();
  }

  return globalForMongo.mongoConnection;
}

export function objectId(id: string) {
  if (!id) throw new Error("Invalid database id.");
  // If we're using the in-memory fallback, accept raw ids (they may be strings)
  if (globalForMongo.mongoIsMemory) return id;
  if (!Types.ObjectId.isValid(id)) throw new Error("Invalid database id.");
  return new Types.ObjectId(id);
}

export function document<T extends Record<string, unknown>>(value: T) {
  const { _id, ...rest } = value;
  const id = _id instanceof Types.ObjectId ? _id.toString() : String(_id);
  return { ...rest, id };
}
