import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/watchmirror';
const MONGODB_DB_NAME = 'watchmirror';

interface MongoConnection {
  client: MongoClient;
  db: Db;
}

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase(): Promise<MongoConnection> {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(MONGODB_DB_NAME);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

export const getDb = async (): Promise<Db> => {
  const { db } = await connectToDatabase();
  return db;
};

export const getCollection = async (collectionName: string) => {
  const db = await getDb();
  return db.collection(collectionName);
};
