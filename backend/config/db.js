import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_FILE_PATH = path.join(__dirname, '..', 'database.json');

// Initialize local database schema
const defaultSchema = {
  users: [],
  products: [],
  orders: [],
  coupons: [],
  reviews: [],
  cms: {
    announcement: "FREE SHIPPING ACROSS INDIA — NEW COLLECTION — SHOP NOW",
    hero: {
      heading: "THE NEW STANDARD OF MODERN LUXURY",
      subheading: "Designed for women who define their own style.",
      desktopImage: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2560&auto=format&fit=crop",
      mobileImage: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1440&auto=format&fit=crop"
    },
    editorialBanner: {
      heading: "THE ART OF DRESSING",
      subheading: "Contemporary silhouettes. Timeless confidence.",
      image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2560&auto=format&fit=crop"
    },
    featuredCollection: {
      heading: "THE SIGNATURE EDIT",
      subheading: "Where refined silhouettes meet modern femininity.",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2560"
    },
    brandStory: {
      heading: "HOS",
      text: "House of Simons creates contemporary couture fashion for women who value individuality, craftsmanship and effortless elegance.",
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600"
    }
  }
};

let dbCache = null;

// Read JSON DB from disk
async function readDB() {
  if (dbCache) return dbCache;
  try {
    const data = await fs.readFile(DB_FILE_PATH, 'utf-8');
    dbCache = JSON.parse(data);
    return dbCache;
  } catch (error) {
    // If it doesn't exist, create it with default schema
    await writeDB(defaultSchema);
    dbCache = JSON.parse(JSON.stringify(defaultSchema));
    return dbCache;
  }
}

// Write JSON DB to disk
async function writeDB(data) {
  dbCache = data;
  await fs.writeFile(DB_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

// Lowdb-like Collection interface
class Collection {
  constructor(name) {
    this.name = name;
  }

  async find(query = {}) {
    const db = await readDB();
    const items = db[this.name] || [];
    return items.filter(item => {
      for (const key in query) {
        // Simple nested path matching (e.g., 'category')
        if (query[key] !== undefined && item[key] !== query[key]) {
          return false;
        }
      }
      return true;
    });
  }

  async findOne(query = {}) {
    const results = await this.find(query);
    return results[0] || null;
  }

  async insertOne(doc) {
    const db = await readDB();
    if (!db[this.name]) db[this.name] = [];
    
    const newDoc = {
      _id: Math.random().toString(36).substring(2, 11),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...doc
    };
    db[this.name].push(newDoc);
    await writeDB(db);
    return newDoc;
  }

  async updateOne(query, updates) {
    const db = await readDB();
    const items = db[this.name] || [];
    const index = items.findIndex(item => {
      for (const key in query) {
        if (item[key] !== query[key]) return false;
      }
      return true;
    });

    if (index === -1) return null;
    
    // Support MongoDB style $set or normal override
    const current = items[index];
    const newUpdates = updates.$set || updates;
    
    items[index] = {
      ...current,
      ...newUpdates,
      updatedAt: new Date().toISOString()
    };
    db[this.name] = items;
    await writeDB(db);
    return items[index];
  }

  async deleteOne(query) {
    const db = await readDB();
    const items = db[this.name] || [];
    const index = items.findIndex(item => {
      for (const key in query) {
        if (item[key] !== query[key]) return false;
      }
      return true;
    });

    if (index === -1) return false;
    items.splice(index, 1);
    db[this.name] = items;
    await writeDB(db);
    return true;
  }

  async count(query = {}) {
    const results = await this.find(query);
    return results.length;
  }
}

export const db = {
  users: new Collection('users'),
  products: new Collection('products'),
  orders: new Collection('orders'),
  coupons: new Collection('coupons'),
  reviews: new Collection('reviews'),
  cms: {
    async get() {
      const data = await readDB();
      return data.cms;
    },
    async update(updates) {
      const data = await readDB();
      data.cms = { ...data.cms, ...updates };
      await writeDB(data);
      return data.cms;
    }
  },
  reset: async () => {
    await writeDB(defaultSchema);
  }
};

export default db;
