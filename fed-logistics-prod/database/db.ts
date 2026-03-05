import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbDir = path.join(__dirname);
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

const dbPath = process.env.DB_PATH || path.join(__dirname, 'logistics.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    is_verified INTEGER DEFAULT 0,
    verification_token TEXT,
    verification_expires TEXT,
    reset_token TEXT,
    reset_expires TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS shipments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tracking_number TEXT UNIQUE NOT NULL,
    user_id INTEGER,
    status TEXT NOT NULL DEFAULT 'Order Created',
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    weight REAL,
    service TEXT DEFAULT 'ground',
    price REAL,
    estimated_delivery TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS tracking_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    shipment_id INTEGER NOT NULL,
    status TEXT NOT NULL,
    location TEXT,
    date TEXT,
    completed INTEGER DEFAULT 0,
    FOREIGN KEY (shipment_id) REFERENCES shipments(id)
  );

  CREATE TABLE IF NOT EXISTS contact_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );
`);

// Add new columns to existing users table if they don't exist (for existing deployments)
const userCols = (db.prepare("PRAGMA table_info(users)").all() as any[]).map(c => c.name);
if (!userCols.includes('is_verified'))         db.exec("ALTER TABLE users ADD COLUMN is_verified INTEGER DEFAULT 0");
if (!userCols.includes('verification_token'))  db.exec("ALTER TABLE users ADD COLUMN verification_token TEXT");
if (!userCols.includes('verification_expires')) db.exec("ALTER TABLE users ADD COLUMN verification_expires TEXT");
if (!userCols.includes('reset_token'))         db.exec("ALTER TABLE users ADD COLUMN reset_token TEXT");
if (!userCols.includes('reset_expires'))       db.exec("ALTER TABLE users ADD COLUMN reset_expires TEXT");

// Seed sample shipments
const count = (db.prepare('SELECT COUNT(*) as c FROM shipments').get() as any).c;
if (count === 0) {
  const seedShipments = [
    { tracking_number: 'FL1001234567', status: 'In Transit', origin: 'New York, NY', destination: 'Los Angeles, CA', weight: 3.5, service: 'express', price: 52.50, estimated_delivery: '2026-03-07', history: [
      { status: 'Order Created', location: 'New York, NY', date: '2026-03-04 08:00 AM', completed: 1 },
      { status: 'Picked Up', location: 'New York, NY', date: '2026-03-04 10:30 AM', completed: 1 },
      { status: 'In Transit', location: 'Chicago, IL', date: '2026-03-05 02:30 PM', completed: 1 },
      { status: 'Out for Delivery', location: 'Los Angeles, CA', date: '', completed: 0 },
      { status: 'Delivered', location: 'Los Angeles, CA', date: '', completed: 0 },
    ]},
    { tracking_number: 'FL1009876543', status: 'Delivered', origin: 'Miami, FL', destination: 'Seattle, WA', weight: 1.2, service: 'ground', price: 18.00, estimated_delivery: '2026-03-01', history: [
      { status: 'Order Created', location: 'Miami, FL', date: '2026-02-24 09:00 AM', completed: 1 },
      { status: 'Picked Up', location: 'Miami, FL', date: '2026-02-25 09:00 AM', completed: 1 },
      { status: 'In Transit', location: 'Denver, CO', date: '2026-02-27 11:15 AM', completed: 1 },
      { status: 'Out for Delivery', location: 'Seattle, WA', date: '2026-03-01 07:45 AM', completed: 1 },
      { status: 'Delivered', location: 'Seattle, WA', date: '2026-03-01 02:10 PM', completed: 1 },
    ]},
    { tracking_number: 'FL1005556677', status: 'Picked Up', origin: 'Austin, TX', destination: 'Boston, MA', weight: 7.8, service: 'ground', price: 34.50, estimated_delivery: '2026-03-10', history: [
      { status: 'Order Created', location: 'Austin, TX', date: '2026-03-02 08:00 AM', completed: 1 },
      { status: 'Picked Up', location: 'Austin, TX', date: '2026-03-03 10:00 AM', completed: 1 },
      { status: 'In Transit', location: '', date: '', completed: 0 },
      { status: 'Out for Delivery', location: '', date: '', completed: 0 },
      { status: 'Delivered', location: '', date: '', completed: 0 },
    ]},
  ];
  const insertShipment = db.prepare(`INSERT INTO shipments (tracking_number, status, origin, destination, weight, service, price, estimated_delivery) VALUES (@tracking_number, @status, @origin, @destination, @weight, @service, @price, @estimated_delivery)`);
  const insertHistory = db.prepare(`INSERT INTO tracking_history (shipment_id, status, location, date, completed) VALUES (@shipment_id, @status, @location, @date, @completed)`);
  db.transaction(() => {
    for (const s of seedShipments) {
      const { lastInsertRowid } = insertShipment.run(s);
      for (const h of s.history) insertHistory.run({ shipment_id: lastInsertRowid, ...h });
    }
  })();
  console.log('✅ Database seeded');
}

export default db;
