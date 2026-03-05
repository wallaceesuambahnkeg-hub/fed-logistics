import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './database/db.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = parseInt(process.env.PORT || '3000');
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-this';
const APP_URL = process.env.APP_URL || `http://localhost:${PORT}`;

app.use(cors());
app.use(express.json());

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthRequest extends Request {
  user?: { id: number; email: string; name: string };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function generateTrackingNumber() {
  return `FL${Date.now().toString().slice(-6)}${Math.floor(1000 + Math.random() * 9000)}`;
}

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) { res.status(401).json({ success: false, message: 'Access token required' }); return; }
  try {
    req.user = jwt.verify(token, JWT_SECRET) as { id: number; email: string; name: string };
    next();
  } catch { res.status(403).json({ success: false, message: 'Invalid or expired token' }); }
}

// ─── Email Transporter ────────────────────────────────────────────────────────

function getTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });
}

async function sendEmail(to: string, subject: string, html: string) {
  if (!process.env.EMAIL_USER || process.env.EMAIL_USER.includes('your-gmail')) {
    console.log(`📧 Email skipped (no config) — To: ${to} | Subject: ${subject}`);
    return;
  }
  await getTransporter().sendMail({ from: `"Fed Logistics" <${process.env.EMAIL_USER}>`, to, subject, html });
}

// ─── EMAIL TEMPLATES ─────────────────────────────────────────────────────────

function verificationEmailHTML(name: string, link: string) {
  return `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: #4D148C; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
      <h1 style="color: white; margin: 0;">FED <span style="color: #FF6200;">LOGISTICS</span></h1>
    </div>
    <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #eee;">
      <h2 style="color: #1a1a2e;">Hello ${name}! 👋</h2>
      <p style="color: #555; font-size: 16px;">Thank you for signing up. Please verify your email address to activate your account.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${link}" style="background: #FF6200; color: white; padding: 14px 32px; border-radius: 25px; text-decoration: none; font-size: 16px; font-weight: bold;">
          ✅ Verify My Email
        </a>
      </div>
      <p style="color: #999; font-size: 13px; text-align: center;">This link expires in <strong>24 hours</strong>. If you didn't sign up, ignore this email.</p>
    </div>
  </div>`;
}

function passwordResetEmailHTML(name: string, link: string) {
  return `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: #4D148C; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
      <h1 style="color: white; margin: 0;">FED <span style="color: #FF6200;">LOGISTICS</span></h1>
    </div>
    <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #eee;">
      <h2 style="color: #1a1a2e;">Password Reset Request 🔐</h2>
      <p style="color: #555; font-size: 16px;">Hi ${name}, we received a request to reset your password.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${link}" style="background: #4D148C; color: white; padding: 14px 32px; border-radius: 25px; text-decoration: none; font-size: 16px; font-weight: bold;">
          🔑 Reset My Password
        </a>
      </div>
      <p style="color: #999; font-size: 13px; text-align: center;">This link expires in <strong>1 hour</strong>. If you didn't request this, ignore this email — your password is safe.</p>
    </div>
  </div>`;
}

// ─── SIGNUP ───────────────────────────────────────────────────────────────────

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
    const verification_token = generateToken();
    const verification_expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    const result = db.prepare(
      'INSERT INTO users (name, email, password_hash, is_verified, verification_token, verification_expires) VALUES (?, ?, ?, 0, ?, ?)'
    ).run(name, email, password_hash, verification_token, verification_expires);

    // Send verification email
    const verifyLink = `${APP_URL}/api/auth/verify-email?token=${verification_token}`;
    await sendEmail(email, 'Verify your Fed Logistics account', verificationEmailHTML(name, verifyLink));

    res.json({ success: true, message: 'Account created! Please check your email to verify your account before logging in.' });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ success: false, message: 'Server error during signup' });
  }
});

// ─── VERIFY EMAIL ─────────────────────────────────────────────────────────────

app.get('/api/auth/verify-email', (req, res) => {
  const { token } = req.query;
  if (!token) { res.status(400).send(renderPage('Invalid Link', '❌ Invalid verification link.')); return; }

  try {
    const user = db.prepare('SELECT * FROM users WHERE verification_token = ?').get(token) as any;
    if (!user) { res.send(renderPage('Already Verified', '✅ Your email is already verified! <a href="/login">Log in here</a>')); return; }
    if (new Date(user.verification_expires) < new Date()) {
      res.send(renderPage('Link Expired', '⏰ This verification link has expired. Please sign up again or contact support.')); return;
    }
    db.prepare('UPDATE users SET is_verified = 1, verification_token = NULL, verification_expires = NULL WHERE id = ?').run(user.id);
    res.send(renderPage('Email Verified! ✅', `
      <p>Your email has been verified successfully!</p>
      <a href="/login" style="background:#FF6200;color:white;padding:12px 28px;border-radius:25px;text-decoration:none;font-weight:bold;display:inline-block;margin-top:16px;">
        Log In Now
      </a>
    `));
  } catch (err) {
    console.error(err);
    res.status(500).send(renderPage('Error', 'Something went wrong. Please try again.'));
  }
});

// ─── RESEND VERIFICATION ──────────────────────────────────────────────────────

app.post('/api/auth/resend-verification', async (req, res) => {
  const { email } = req.body;
  if (!email) { res.status(400).json({ success: false, message: 'Email is required' }); return; }
  try {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
    if (!user) { res.status(404).json({ success: false, message: 'No account found with this email' }); return; }
    if (user.is_verified) { res.json({ success: false, message: 'This email is already verified' }); return; }

    const verification_token = generateToken();
    const verification_expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    db.prepare('UPDATE users SET verification_token = ?, verification_expires = ? WHERE id = ?').run(verification_token, verification_expires, user.id);

    const verifyLink = `${APP_URL}/api/auth/verify-email?token=${verification_token}`;
    await sendEmail(email, 'Verify your Fed Logistics account', verificationEmailHTML(user.name, verifyLink));

    res.json({ success: true, message: 'Verification email resent! Check your inbox.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── LOGIN ────────────────────────────────────────────────────────────────────

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) { res.status(400).json({ success: false, message: 'Email and password are required' }); return; }
  try {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      res.status(401).json({ success: false, message: 'Invalid email or password' }); return;
    }
    if (!user.is_verified) {
      res.status(403).json({ success: false, message: 'Please verify your email first. Check your inbox or resend the verification email.', notVerified: true }); return;
    }
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── FORGOT PASSWORD ──────────────────────────────────────────────────────────

app.post('/api/auth/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) { res.status(400).json({ success: false, message: 'Email is required' }); return; }
  try {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
    // Always return success to prevent email enumeration
    if (!user) { res.json({ success: true, message: 'If an account exists, a reset email has been sent.' }); return; }

    const reset_token = generateToken();
    const reset_expires = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour
    db.prepare('UPDATE users SET reset_token = ?, reset_expires = ? WHERE id = ?').run(reset_token, reset_expires, user.id);

    const resetLink = `${APP_URL}/reset-password?token=${reset_token}`;
    await sendEmail(email, 'Reset your Fed Logistics password', passwordResetEmailHTML(user.name, resetLink));

    res.json({ success: true, message: 'If an account exists, a reset email has been sent.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── RESET PASSWORD ───────────────────────────────────────────────────────────

app.post('/api/auth/reset-password', async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) { res.status(400).json({ success: false, message: 'Token and new password are required' }); return; }
  if (password.length < 8) { res.status(400).json({ success: false, message: 'Password must be at least 8 characters' }); return; }
  try {
    const user = db.prepare('SELECT * FROM users WHERE reset_token = ?').get(token) as any;
    if (!user) { res.status(400).json({ success: false, message: 'Invalid or expired reset link' }); return; }
    if (new Date(user.reset_expires) < new Date()) {
      res.status(400).json({ success: false, message: 'This reset link has expired. Please request a new one.' }); return;
    }
    const password_hash = await bcrypt.hash(password, 10);
    db.prepare('UPDATE users SET password_hash = ?, reset_token = NULL, reset_expires = NULL WHERE id = ?').run(password_hash, user.id);
    res.json({ success: true, message: 'Password reset successfully! You can now log in.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── VALIDATE RESET TOKEN ─────────────────────────────────────────────────────

app.get('/api/auth/validate-reset-token', (req, res) => {
  const { token } = req.query;
  if (!token) { res.status(400).json({ valid: false }); return; }
  const user = db.prepare('SELECT * FROM users WHERE reset_token = ?').get(token) as any;
  if (!user || new Date(user.reset_expires) < new Date()) {
    res.json({ valid: false }); return;
  }
  res.json({ valid: true });
});

// ─── TRACK ────────────────────────────────────────────────────────────────────

app.post('/api/track', (req, res) => {
  const { trackingNumber } = req.body;
  if (!trackingNumber) { res.status(400).json({ success: false, message: 'Tracking number is required' }); return; }
  try {
    const shipment = db.prepare('SELECT * FROM shipments WHERE tracking_number = ?').get(trackingNumber.trim()) as any;
    if (!shipment) { setTimeout(() => res.status(404).json({ success: false, message: 'Tracking number not found.' }), 600); return; }
    const history = db.prepare('SELECT * FROM tracking_history WHERE shipment_id = ? ORDER BY id ASC').all(shipment.id);
    setTimeout(() => res.json({ success: true, data: {
      trackingNumber: shipment.tracking_number, status: shipment.status,
      estimatedDelivery: shipment.estimated_delivery, origin: shipment.origin,
      destination: shipment.destination, weight: shipment.weight, service: shipment.service,
      history: history.map((h: any) => ({ status: h.status, location: h.location, date: h.date, completed: h.completed === 1 })),
    }}), 600);
  } catch (err) { console.error(err); res.status(500).json({ success: false, message: 'Server error' }); }
});

// ─── QUOTE ────────────────────────────────────────────────────────────────────

app.post('/api/quote', (req, res) => {
  const { from, to, weight, service } = req.body;
  if (!from || !to || !weight || !service) { res.status(400).json({ success: false, message: 'All fields required' }); return; }
  const total = (15 + parseFloat(weight) * 2.5) * (service === 'same-day' ? 3 : service === 'express' ? 2 : 1);
  setTimeout(() => res.json({ success: true, price: total.toFixed(2) }), 500);
});

// ─── SHIP CREATE (protected) ──────────────────────────────────────────────────

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

// ─── MY SHIPMENTS (protected) ─────────────────────────────────────────────────

app.get('/api/shipments/my', authenticateToken, (req: AuthRequest, res) => {
  try {
    const shipments = db.prepare('SELECT * FROM shipments WHERE user_id = ? ORDER BY created_at DESC').all(req.user!.id) as any[];
    res.json({ success: true, shipments: shipments.map(s => ({
      trackingNumber: s.tracking_number, status: s.status, origin: s.origin,
      destination: s.destination, service: s.service, price: s.price,
      estimatedDelivery: s.estimated_delivery, createdAt: s.created_at,
      history: (db.prepare('SELECT * FROM tracking_history WHERE shipment_id = ? ORDER BY id ASC').all(s.id) as any[]).map(h => ({ status: h.status, location: h.location, date: h.date, completed: h.completed === 1 })),
    }))});
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

// ─── Helper: HTML page for email verification responses ──────────────────────

function renderPage(title: string, content: string) {
  return `<!DOCTYPE html><html><head><title>${title} — Fed Logistics</title>
  <style>body{font-family:Arial,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#f8f8f8;}
  .card{background:white;padding:48px;border-radius:16px;box-shadow:0 4px 24px rgba(0,0,0,.1);text-align:center;max-width:480px;}
  h1{color:#4D148C;} p{color:#555;font-size:16px;} a{color:#FF6200;}</style></head>
  <body><div class="card"><h1>${title}</h1>${content}<br><br><a href="/">← Back to Fed Logistics</a></div></body></html>`;
}

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
    console.log(`🚀 Fed Logistics → http://localhost:${PORT}`);
    console.log(`📧 Email: ${process.env.EMAIL_USER || 'not configured'}`);
  });
}

startServer();

// ─── FORGOT PASSWORD ──────────────────────────────────────────────────────────

app.post('/api/auth/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) { res.status(400).json({ success: false, message: 'Email is required' }); return; }
  try {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
    // Always return success to prevent email enumeration
    if (!user) {
      res.json({ success: true, message: 'If an account exists with this email, a reset link has been sent.' });
      return;
    }
    const resetToken = require('crypto').randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 3600000).toISOString(); // 1 hour
    db.prepare('UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?').run(resetToken, expiry, user.id);
    const baseUrl = process.env.BASE_URL || `http://localhost:${PORT}`;
    const resetLink = `${baseUrl}/reset-password?token=${resetToken}`;
    if (process.env.EMAIL_USER && !process.env.EMAIL_USER.includes('your-gmail')) {
      const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS } });
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Reset Your Fed Logistics Password',
        html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#f8f8f8;">
          <div style="background:white;padding:40px;border-radius:16px;box-shadow:0 2px 12px rgba(0,0,0,.08);">
            <h1 style="color:#4D148C;margin-bottom:8px;">Password Reset Request</h1>
            <p style="color:#555;">Hi ${user.name},</p>
            <p style="color:#555;">We received a request to reset your Fed Logistics password. Click the button below to set a new password. This link expires in <strong>1 hour</strong>.</p>
            <div style="text-align:center;margin:32px 0;">
              <a href="${resetLink}" style="background:#FF6200;color:white;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px;">Reset Password</a>
            </div>
            <p style="color:#888;font-size:13px;">If you didn't request this, you can safely ignore this email. Your password won't change.</p>
            <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
            <p style="color:#aaa;font-size:12px;">Fed Logistics — 1 Canada Square, Canary Wharf, London, UK</p>
          </div>
        </div>`,
      });
    } else {
      console.log(`[DEV] Password reset link for ${email}: ${resetLink}`);
    }
    res.json({ success: true, message: 'If an account exists with this email, a reset link has been sent.' });
  } catch (err) { console.error(err); res.status(500).json({ success: false, message: 'Server error' }); }
});

// ─── RESET PASSWORD ───────────────────────────────────────────────────────────

app.post('/api/auth/reset-password', async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) { res.status(400).json({ success: false, message: 'Token and password are required' }); return; }
  if (password.length < 8) { res.status(400).json({ success: false, message: 'Password must be at least 8 characters' }); return; }
  try {
    const user = db.prepare('SELECT * FROM users WHERE reset_token = ?').get(token) as any;
    if (!user) { res.status(400).json({ success: false, message: 'Invalid or expired reset link.' }); return; }
    if (new Date(user.reset_token_expiry) < new Date()) {
      res.status(400).json({ success: false, message: 'This reset link has expired. Please request a new one.' }); return;
    }
    const password_hash = await bcrypt.hash(password, 10);
    db.prepare('UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?').run(password_hash, user.id);
    res.json({ success: true, message: 'Password reset successfully. You can now log in.' });
  } catch (err) { console.error(err); res.status(500).json({ success: false, message: 'Server error' }); }
});

// ─── ADMIN MIDDLEWARE ─────────────────────────────────────────────────────────

function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@fedlogistics.com';
  if (!req.user) { res.status(401).json({ success: false, message: 'Unauthorized' }); return; }
  if (req.user.email !== adminEmail) { res.status(403).json({ success: false, message: 'Admin access required' }); return; }
  next();
}

// ─── ADMIN: Get dashboard stats ───────────────────────────────────────────────

app.get('/api/admin/stats', authenticateToken, requireAdmin, (req: AuthRequest, res) => {
  try {
    const totalShipments = (db.prepare('SELECT COUNT(*) as c FROM shipments').get() as any).c;
    const totalUsers = (db.prepare('SELECT COUNT(*) as c FROM users').get() as any).c;
    const totalMessages = (db.prepare('SELECT COUNT(*) as c FROM contact_messages').get() as any).c;
    const inTransit = (db.prepare("SELECT COUNT(*) as c FROM shipments WHERE status = 'In Transit'").get() as any).c;
    const delivered = (db.prepare("SELECT COUNT(*) as c FROM shipments WHERE status = 'Delivered'").get() as any).c;
    const pending = (db.prepare("SELECT COUNT(*) as c FROM shipments WHERE status = 'Order Created' OR status = 'Picked Up'").get() as any).c;
    const revenue = (db.prepare('SELECT SUM(price) as total FROM shipments').get() as any).total || 0;
    res.json({ success: true, stats: { totalShipments, totalUsers, totalMessages, inTransit, delivered, pending, revenue: revenue.toFixed(2) } });
  } catch (err) { console.error(err); res.status(500).json({ success: false, message: 'Server error' }); }
});

// ─── ADMIN: Get all shipments ─────────────────────────────────────────────────

app.get('/api/admin/shipments', authenticateToken, requireAdmin, (req: AuthRequest, res) => {
  try {
    const shipments = db.prepare(`
      SELECT s.*, u.name as user_name, u.email as user_email
      FROM shipments s LEFT JOIN users u ON s.user_id = u.id
      ORDER BY s.created_at DESC
    `).all() as any[];
    const result = shipments.map(s => ({
      ...s,
      history: (db.prepare('SELECT * FROM tracking_history WHERE shipment_id = ? ORDER BY id ASC').all(s.id) as any[]).map((h: any) => ({ id: h.id, status: h.status, location: h.location, date: h.date, completed: h.completed === 1 })),
    }));
    res.json({ success: true, shipments: result });
  } catch (err) { console.error(err); res.status(500).json({ success: false, message: 'Server error' }); }
});

// ─── ADMIN: Update shipment status ───────────────────────────────────────────

app.put('/api/admin/shipments/:id/status', authenticateToken, requireAdmin, (req: AuthRequest, res) => {
  const { id } = req.params;
  const { status, location } = req.body;
  if (!status) { res.status(400).json({ success: false, message: 'Status is required' }); return; }
  const validStatuses = ['Order Created', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered'];
  if (!validStatuses.includes(status)) { res.status(400).json({ success: false, message: 'Invalid status' }); return; }
  try {
    const shipment = db.prepare('SELECT * FROM shipments WHERE id = ?').get(id) as any;
    if (!shipment) { res.status(404).json({ success: false, message: 'Shipment not found' }); return; }
    // Update shipment status
    db.prepare('UPDATE shipments SET status = ? WHERE id = ?').run(status, id);
    // Update tracking history — mark all steps up to current as completed
    const stepIndex = validStatuses.indexOf(status);
    const historySteps = db.prepare('SELECT * FROM tracking_history WHERE shipment_id = ? ORDER BY id ASC').all(id) as any[];
    const now = new Date().toLocaleString();
    db.transaction(() => {
      historySteps.forEach((step: any, i: number) => {
        if (i <= stepIndex) {
          db.prepare('UPDATE tracking_history SET completed = 1, location = ?, date = ? WHERE id = ?')
            .run(i === stepIndex ? (location || step.location || shipment.destination) : step.location, i === stepIndex ? now : (step.date || now), step.id);
        } else {
          db.prepare('UPDATE tracking_history SET completed = 0 WHERE id = ?').run(step.id);
        }
      });
    })();
    res.json({ success: true, message: `Shipment updated to "${status}"` });
  } catch (err) { console.error(err); res.status(500).json({ success: false, message: 'Server error' }); }
});

// ─── ADMIN: Get all users ─────────────────────────────────────────────────────

app.get('/api/admin/users', authenticateToken, requireAdmin, (req: AuthRequest, res) => {
  try {
    const users = db.prepare('SELECT id, name, email, created_at FROM users ORDER BY created_at DESC').all();
    res.json({ success: true, users });
  } catch (err) { console.error(err); res.status(500).json({ success: false, message: 'Server error' }); }
});

// ─── ADMIN: Get all contact messages ─────────────────────────────────────────

app.get('/api/admin/messages', authenticateToken, requireAdmin, (req: AuthRequest, res) => {
  try {
    const messages = db.prepare('SELECT * FROM contact_messages ORDER BY created_at DESC').all();
    res.json({ success: true, messages });
  } catch (err) { console.error(err); res.status(500).json({ success: false, message: 'Server error' }); }
});

// ─── ADMIN: Delete a shipment ─────────────────────────────────────────────────

app.delete('/api/admin/shipments/:id', authenticateToken, requireAdmin, (req: AuthRequest, res) => {
  const { id } = req.params;
  try {
    db.prepare('DELETE FROM tracking_history WHERE shipment_id = ?').run(id);
    db.prepare('DELETE FROM shipments WHERE id = ?').run(id);
    res.json({ success: true, message: 'Shipment deleted' });
  } catch (err) { console.error(err); res.status(500).json({ success: false, message: 'Server error' }); }
});
