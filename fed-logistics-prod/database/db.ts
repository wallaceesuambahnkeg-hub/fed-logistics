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

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ─── Create Tables ────────────────────────────────────────────────────────────

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
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

// ─── Seed Sample Shipments ────────────────────────────────────────────────────

const count = (db.prepare('SELECT COUNT(*) as c FROM shipments').get() as any).c;

if (count === 0) {
  const seedShipments = [
    {
      tracking_number: 'FL1001234567',
      status: 'In Transit',
      origin: 'New York, NY',
      destination: 'Los Angeles, CA',
      weight: 3.5,
      service: 'express',
      price: 52.50,
      estimated_delivery: '2026-03-07',
      history: [
        { status: 'Order Created', location: 'New York, NY', date: '2026-03-04 08:00 AM', completed: 1 },
        { status: 'Picked Up', location: 'New York, NY', date: '2026-03-04 10:30 AM', completed: 1 },
        { status: 'In Transit', location: 'Chicago, IL', date: '2026-03-05 02:30 PM', completed: 1 },
        { status: 'Out for Delivery', location: 'Los Angeles, CA', date: '', completed: 0 },
        { status: 'Delivered', location: 'Los Angeles, CA', date: '', completed: 0 },
      ],
    },
    {
      tracking_number: 'FL1009876543',
      status: 'Delivered',
      origin: 'Miami, FL',
      destination: 'Seattle, WA',
      weight: 1.2,
      service: 'ground',
      price: 18.00,
      estimated_delivery: '2026-03-01',
      history: [
        { status: 'Order Created', location: 'Miami, FL', date: '2026-02-24 09:00 AM', completed: 1 },
        { status: 'Picked Up', location: 'Miami, FL', date: '2026-02-25 09:00 AM', completed: 1 },
        { status: 'In Transit', location: 'Denver, CO', date: '2026-02-27 11:15 AM', completed: 1 },
        { status: 'Out for Delivery', location: 'Seattle, WA', date: '2026-03-01 07:45 AM', completed: 1 },
        { status: 'Delivered', location: 'Seattle, WA', date: '2026-03-01 02:10 PM', completed: 1 },
      ],
    },
    {
      tracking_number: 'FL1005556677',
      status: 'Picked Up',
      origin: 'Austin, TX',
      destination: 'Boston, MA',
      weight: 7.8,
      service: 'ground',
      price: 34.50,
      estimated_delivery: '2026-03-10',
      history: [
        { status: 'Order Created', location: 'Austin, TX', date: '2026-03-02 08:00 AM', completed: 1 },
        { status: 'Picked Up', location: 'Austin, TX', date: '2026-03-03 10:00 AM', completed: 1 },
        { status: 'In Transit', location: '', date: '', completed: 0 },
        { status: 'Out for Delivery', location: '', date: '', completed: 0 },
        { status: 'Delivered', location: '', date: '', completed: 0 },
      ],
    },
    {
      tracking_number: 'FL1001112233',
      status: 'Out for Delivery',
      origin: 'San Francisco, CA',
      destination: 'San Jose, CA',
      weight: 0.5,
      service: 'same-day',
      price: 45.00,
      estimated_delivery: '2026-03-05',
      history: [
        { status: 'Order Created', location: 'San Francisco, CA', date: '2026-03-05 07:00 AM', completed: 1 },
        { status: 'Picked Up', location: 'San Francisco, CA', date: '2026-03-05 09:00 AM', completed: 1 },
        { status: 'In Transit', location: 'San Francisco, CA', date: '2026-03-05 08:00 AM', completed: 1 },
        { status: 'Out for Delivery', location: 'San Jose, CA', date: '2026-03-05 11:30 AM', completed: 1 },
        { status: 'Delivered', location: '', date: '', completed: 0 },
      ],
    },
    {
      tracking_number: 'FL1004449988',
      status: 'In Transit',
      origin: 'London, UK',
      destination: 'New York, NY',
      weight: 12.0,
      service: 'express',
      price: 120.00,
      estimated_delivery: '2026-03-10',
      history: [
        { status: 'Order Created', location: 'London, UK', date: '2026-03-01 10:00 AM', completed: 1 },
        { status: 'Picked Up', location: 'London, UK', date: '2026-03-01 14:00 PM', completed: 1 },
        { status: 'In Transit', location: 'Heathrow Airport, UK', date: '2026-03-02 18:00 PM', completed: 1 },
        { status: 'Out for Delivery', location: '', date: '', completed: 0 },
        { status: 'Delivered', location: '', date: '', completed: 0 },
      ],
    },
    {
      tracking_number: 'FL1007778899',
      status: 'Order Created',
      origin: 'Chicago, IL',
      destination: 'Houston, TX',
      weight: 2.3,
      service: 'ground',
      price: 20.75,
      estimated_delivery: '2026-03-12',
      history: [
        { status: 'Order Created', location: 'Chicago, IL', date: '2026-03-05 03:00 PM', completed: 1 },
        { status: 'Picked Up', location: '', date: '', completed: 0 },
        { status: 'In Transit', location: '', date: '', completed: 0 },
        { status: 'Out for Delivery', location: '', date: '', completed: 0 },
        { status: 'Delivered', location: '', date: '', completed: 0 },
      ],
    },
  ];

  const insertShipment = db.prepare(`
    INSERT INTO shipments (tracking_number, status, origin, destination, weight, service, price, estimated_delivery)
    VALUES (@tracking_number, @status, @origin, @destination, @weight, @service, @price, @estimated_delivery)
  `);

  const insertHistory = db.prepare(`
    INSERT INTO tracking_history (shipment_id, status, location, date, completed)
    VALUES (@shipment_id, @status, @location, @date, @completed)
  `);

  const seedAll = db.transaction(() => {
    for (const s of seedShipments) {
      const { lastInsertRowid } = insertShipment.run(s);
      for (const h of s.history) {
        insertHistory.run({ shipment_id: lastInsertRowid, ...h });
      }
    }
  });

  seedAll();
  console.log('✅ Database seeded with sample shipments');
}

export default db;
