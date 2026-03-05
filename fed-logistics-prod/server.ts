import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './database/db.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = parseInt(process.env.PORT || '3000');
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-this';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@fedlogistics.com';

app.use(cors());
app.use(express.json());

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthRequest extends Request {
  user?: { id: number; email: string; name: string };
  // include common properties to keep TypeScript happy
  headers?: any;
  body?: any;
}

// ─── Middleware ───────────────────────────────────────────────────────────────

function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) { res.status(401).json({ success: false, message: 'Access token required' }); return; }
  try {
    req.user = jwt.verify(token, JWT_SECRET) as { id: number; email: string; name: string };
    next();
  } catch { res.status(403).json({ success: false, message: 'Invalid or expired token' }); }
}

function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.email !== ADMIN_EMAIL) {
    res.status(403).json({ success: false, message: 'Admin access required' }); return;
  }
  next();
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateTrackingNumber(): string {
  return `FL${Date.now().toString().slice(-6)}${Math.floor(1000 + Math.random() * 9000)}`;
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function sendEmail(to: string, subject: string, html: string) {
  if (!process.env.EMAIL_USER || process.env.EMAIL_USER.includes('your-gmail')) return;
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });
  await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, html });
}

// ─── AUTH: Signup ─────────────────────────────────────────────────────────────

app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) { res.status(400).json({ success: false, message: 'All fields are required' }); return; }
  if (!validateEmail(email)) { res.status(400).json({ success: false, message: 'Invalid email address' }); return; }
  if (password.length < 8) { res.status(400).json({ success: false, message: 'Password must be at least 8 characters' }); return; }
  try {
    if (db.prepare('SELECT id FROM users WHERE email = ?').get(email)) {
      res.status(400).json({ success: false, message: 'An account with this email already exists' }); return;
    }
    const password_hash = await bcrypt.hash(password, 10);
    const result = db.prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)').run(name, email, password_hash);
    const token = jwt.sign({ id: result.lastInsertRowid, email, name }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, token, user: { id: result.lastInsertRowid, name, email } });
  } catch (err) { console.error(err); res.status(500).json({ success: false, message: 'Server error' }); }
});

// ─── AUTH: Login ──────────────────────────────────────────────────────────────

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) { res.status(400).json({ success: false, message: 'Email and password required' }); return; }
  try {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      res.status(401).json({ success: false, message: 'Invalid email or password' }); return;
    }
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) { console.error(err); res.status(500).json({ success: false, message: 'Server error' }); }
});

// ─── AUTH: Forgot Password ────────────────────────────────────────────────────

app.post('/api/auth/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) { res.status(400).json({ success: false, message: 'Email is required' }); return; }
  try {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
    const msg = 'If an account exists with this email, a reset link has been sent.';
    if (!user) { res.json({ success: true, message: msg }); return; }
    const crypto = await import('crypto');
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 3600000).toISOString();
    db.prepare('UPDATE users SET reset_token = ?, reset_expires = ? WHERE id = ?').run(resetToken, expiry, user.id);
    const baseUrl = process.env.BASE_URL || `http://localhost:${PORT}`;
    const resetLink = `${baseUrl}/reset-password?token=${resetToken}`;
    await sendEmail(email, 'Reset Your Fed Logistics Password', `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px;">
        <h2 style="color:#4D148C;">Password Reset Request</h2>
        <p>Hi ${user.name}, click below to reset your password. Link expires in 1 hour.</p>
        <a href="${resetLink}" style="display:inline-block;background:#FF6200;color:white;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold;margin:16px 0;">Reset Password</a>
        <p style="color:#888;font-size:13px;">If you didn't request this, ignore this email.</p>
      </div>
    `);
    console.log(`[DEV] Reset link: ${resetLink}`);
    res.json({ success: true, message: msg });
  } catch (err) { console.error(err); res.status(500).json({ success: false, message: 'Server error' }); }
});

// ─── AUTH: Reset Password ─────────────────────────────────────────────────────

app.post('/api/auth/reset-password', async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) { res.status(400).json({ success: false, message: 'Token and password required' }); return; }
  if (password.length < 8) { res.status(400).json({ success: false, message: 'Password must be at least 8 characters' }); return; }
  try {
    const user = db.prepare('SELECT * FROM users WHERE reset_token = ?').get(token) as any;
    if (!user || new Date(user.reset_expires) < new Date()) {
      res.status(400).json({ success: false, message: 'Invalid or expired reset link.' }); return;
    }
    const password_hash = await bcrypt.hash(password, 10);
    db.prepare('UPDATE users SET password_hash = ?, reset_token = NULL, reset_expires = NULL WHERE id = ?').run(password_hash, user.id);
    res.json({ success: true, message: 'Password reset successfully.' });
  } catch (err) { console.error(err); res.status(500).json({ success: false, message: 'Server error' }); }
});

// ─── TRACK ────────────────────────────────────────────────────────────────────

app.post('/api/track', (req, res) => {
  const { trackingNumber } = req.body;
  if (!trackingNumber) { res.status(400).json({ success: false, message: 'Tracking number is required' }); return; }
  try {
    const shipment = db.prepare('SELECT * FROM shipments WHERE tracking_number = ?').get(trackingNumber.trim()) as any;
    if (!shipment) { setTimeout(() => res.status(404).json({ success: false, message: 'Tracking number not found.' }), 600); return; }
    const history = db.prepare('SELECT * FROM tracking_history WHERE shipment_id = ? ORDER BY id ASC').all(shipment.id);
    setTimeout(() => res.json({
      success: true,
      data: {
        trackingNumber: shipment.tracking_number, status: shipment.status,
        estimatedDelivery: shipment.estimated_delivery, origin: shipment.origin,
        destination: shipment.destination, weight: shipment.weight, service: shipment.service,
        history: history.map((h: any) => ({ status: h.status, location: h.location, date: h.date, completed: h.completed === 1 })),
      }
    }), 600);
  } catch (err) { console.error(err); res.status(500).json({ success: false, message: 'Server error' }); }
});

// ─── QUOTE ────────────────────────────────────────────────────────────────────

app.post('/api/quote', (req, res) => {
  const { from, to, weight, service } = req.body;
  if (!from || !to || !weight || !service) { res.status(400).json({ success: false, message: 'All fields required' }); return; }
  const total = (15 + parseFloat(weight) * 2.5) * (service === 'same-day' ? 3 : service === 'express' ? 2 : 1);
  setTimeout(() => res.json({ success: true, price: total.toFixed(2) }), 500);
});

// ─── SHIP CREATE ──────────────────────────────────────────────────────────────

app.post('/api/ship/create', authenticateToken, (req: AuthRequest, res) => {
  const { from, to, weight, service, price } = req.body;
  if (!from || !to || !weight || !service) { res.status(400).json({ success: false, message: 'All fields required' }); return; }
  try {
    const trackingNumber = generateTrackingNumber();
    const deliveryDays = service === 'same-day' ? 0 : service === 'express' ? 1 : 5;
    const estimatedDelivery = new Date(Date.now() + deliveryDays * 86400000).toISOString().split('T')[0];
    const result = db.prepare(`INSERT INTO shipments (tracking_number, user_id, status, origin, destination, weight, service, price, estimated_delivery) VALUES (?, ?, 'Order Created', ?, ?, ?, ?, ?, ?)`).run(trackingNumber, req.user!.id, from, to, parseFloat(weight), service, parseFloat(price || 0), estimatedDelivery);
    const insertH = db.prepare('INSERT INTO tracking_history (shipment_id, status, location, date, completed) VALUES (?, ?, ?, ?, ?)');
    const now = new Date().toLocaleString();
    db.transaction(() => {
      ['Order Created', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered'].forEach((step, i) => {
        insertH.run(result.lastInsertRowid, step, i === 0 ? from : '', i === 0 ? now : '', i === 0 ? 1 : 0);
      });
    })();
    res.json({ success: true, trackingNumber, estimatedDelivery });
  } catch (err) { console.error(err); res.status(500).json({ success: false, message: 'Error creating shipment' }); }
});

// ─── MY SHIPMENTS ─────────────────────────────────────────────────────────────

app.get('/api/shipments/my', authenticateToken, (req: AuthRequest, res) => {
  try {
    const shipments = db.prepare('SELECT * FROM shipments WHERE user_id = ? ORDER BY created_at DESC').all(req.user!.id) as any[];
    res.json({
      success: true,
      shipments: shipments.map(s => ({
        trackingNumber: s.tracking_number, status: s.status, origin: s.origin,
        destination: s.destination, service: s.service, price: s.price,
        estimatedDelivery: s.estimated_delivery, createdAt: s.created_at,
        history: (db.prepare('SELECT * FROM tracking_history WHERE shipment_id = ? ORDER BY id ASC').all(s.id) as any[]).map(h => ({ status: h.status, location: h.location, date: h.date, completed: h.completed === 1 })),
      }))
    });
  } catch (err) { console.error(err); res.status(500).json({ success: false, message: 'Server error' }); }
});

// ─── CONTACT ──────────────────────────────────────────────────────────────────

app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) { res.status(400).json({ success: false, message: 'All fields are required' }); return; }
  if (!validateEmail(email)) { res.status(400).json({ success: false, message: 'Invalid email address' }); return; }
  try {
    db.prepare('INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)').run(name, email, subject, message);
    await sendEmail(process.env.EMAIL_TO || process.env.EMAIL_USER || '', `[Fed Logistics] ${subject}`, `<h2>Contact Form</h2><p><b>Name:</b> ${name}</p><p><b>Email:</b> ${email}</p><p><b>Message:</b></p><p>${message}</p>`);
    res.json({ success: true, message: "Message received. We'll get back to you within 24 hours." });
  } catch (err) { console.error(err); res.status(500).json({ success: false, message: 'Error sending message' }); }
});

// ─── ADMIN: Stats ─────────────────────────────────────────────────────────────

app.get('/api/admin/stats', authenticateToken, requireAdmin, (_req, res) => {
  try {
    const totalShipments = (db.prepare('SELECT COUNT(*) as c FROM shipments').get() as any).c;
    const totalUsers = (db.prepare('SELECT COUNT(*) as c FROM users').get() as any).c;
    const totalMessages = (db.prepare('SELECT COUNT(*) as c FROM contact_messages').get() as any).c;
    const inTransit = (db.prepare("SELECT COUNT(*) as c FROM shipments WHERE status = 'In Transit'").get() as any).c;
    const delivered = (db.prepare("SELECT COUNT(*) as c FROM shipments WHERE status = 'Delivered'").get() as any).c;
    const pending = (db.prepare("SELECT COUNT(*) as c FROM shipments WHERE status IN ('Order Created','Picked Up')").get() as any).c;
    const revenue = (db.prepare('SELECT SUM(price) as total FROM shipments').get() as any).total || 0;
    res.json({ success: true, stats: { totalShipments, totalUsers, totalMessages, inTransit, delivered, pending, revenue: Number(revenue).toFixed(2) } });
  } catch (err) { console.error(err); res.status(500).json({ success: false, message: 'Server error' }); }
});

// ─── ADMIN: All Shipments ─────────────────────────────────────────────────────

app.get('/api/admin/shipments', authenticateToken, requireAdmin, (_req, res) => {
  try {
    const shipments = db.prepare(`SELECT s.*, u.name as user_name, u.email as user_email FROM shipments s LEFT JOIN users u ON s.user_id = u.id ORDER BY s.created_at DESC`).all() as any[];
    res.json({
      success: true,
      shipments: shipments.map(s => ({
        ...s,
        history: (db.prepare('SELECT * FROM tracking_history WHERE shipment_id = ? ORDER BY id ASC').all(s.id) as any[]).map((h: any) => ({ id: h.id, status: h.status, location: h.location, date: h.date, completed: h.completed === 1 })),
      }))
    });
  } catch (err) { console.error(err); res.status(500).json({ success: false, message: 'Server error' }); }
});

// ─── ADMIN: Update Shipment Status ───────────────────────────────────────────

app.put('/api/admin/shipments/:id/status', authenticateToken, requireAdmin, (req, res) => {
  const { id } = req.params;
  const { status, location } = req.body;
  const validStatuses = ['Order Created', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered'];
  if (!status || !validStatuses.includes(status)) { res.status(400).json({ success: false, message: 'Invalid status' }); return; }
  try {
    const shipment = db.prepare('SELECT * FROM shipments WHERE id = ?').get(id) as any;
    if (!shipment) { res.status(404).json({ success: false, message: 'Shipment not found' }); return; }
    db.prepare('UPDATE shipments SET status = ? WHERE id = ?').run(status, id);
    const stepIndex = validStatuses.indexOf(status);
    const historySteps = db.prepare('SELECT * FROM tracking_history WHERE shipment_id = ? ORDER BY id ASC').all(id) as any[];
    const now = new Date().toLocaleString();
    db.transaction(() => {
      historySteps.forEach((step: any, i: number) => {
        if (i <= stepIndex) {
          db.prepare('UPDATE tracking_history SET completed = 1, location = ?, date = ? WHERE id = ?').run(i === stepIndex ? (location || shipment.destination) : step.location, i === stepIndex ? now : (step.date || now), step.id);
        } else {
          db.prepare('UPDATE tracking_history SET completed = 0 WHERE id = ?').run(step.id);
        }
      });
    })();
    res.json({ success: true, message: `Updated to "${status}"` });
  } catch (err) { console.error(err); res.status(500).json({ success: false, message: 'Server error' }); }
});

// ─── ADMIN: All Users ─────────────────────────────────────────────────────────

app.get('/api/admin/users', authenticateToken, requireAdmin, (_req, res) => {
  try {
    res.json({ success: true, users: db.prepare('SELECT id, name, email, created_at FROM users ORDER BY created_at DESC').all() });
  } catch (err) { console.error(err); res.status(500).json({ success: false, message: 'Server error' }); }
});

// ─── ADMIN: All Messages ──────────────────────────────────────────────────────

app.get('/api/admin/messages', authenticateToken, requireAdmin, (_req, res) => {
  try {
    res.json({ success: true, messages: db.prepare('SELECT * FROM contact_messages ORDER BY created_at DESC').all() });
  } catch (err) { console.error(err); res.status(500).json({ success: false, message: 'Server error' }); }
});

// ─── ADMIN: Delete Shipment ───────────────────────────────────────────────────

app.delete('/api/admin/shipments/:id', authenticateToken, requireAdmin, (req, res) => {
  const { id } = req.params;
  try {
    db.prepare('DELETE FROM tracking_history WHERE shipment_id = ?').run(id);
    db.prepare('DELETE FROM shipments WHERE id = ?').run(id);
    res.json({ success: true, message: 'Shipment deleted' });
  } catch (err) { console.error(err); res.status(500).json({ success: false, message: 'Server error' }); }
});

// ─── START SERVER ─────────────────────────────────────────────────────────────

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => res.sendFile(path.join(__dirname, 'dist', 'index.html')));
  }
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Fed Logistics running → http://localhost:${PORT}`);
    console.log(`🔐 Admin: ${ADMIN_EMAIL}`);
  });
}

startServer();
