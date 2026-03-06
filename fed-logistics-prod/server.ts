import express, { Request, Response, NextFunction } from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import cors from 'cors'
import dotenv from 'dotenv'
import db from './database/db.js'

dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = parseInt(process.env.PORT || '3000')
const JWT_SECRET = process.env.JWT_SECRET || 'fed-logistics-secret-2026'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'wallaceesuambahnkeg@gmail.com'

app.use(cors())
app.use(express.json())

// ─── Types ────────────────────────────────────────────────────────────────────
interface AuthReq extends Request { user?: { id: number; email: string; name: string } }

// ─── Auth middleware ──────────────────────────────────────────────────────────
function auth(req: AuthReq, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) { res.status(401).json({ success: false, message: 'Login required' }); return }
  try { req.user = jwt.verify(token, JWT_SECRET) as any; next() }
  catch { res.status(403).json({ success: false, message: 'Invalid or expired token' }) }
}

function adminOnly(req: AuthReq, res: Response, next: NextFunction) {
  if (!req.user || req.user.email !== ADMIN_EMAIL) {
    res.status(403).json({ success: false, message: 'Admin access required' }); return
  }
  next()
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function validEmail(e: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) }
function trackNum() { return `FL${Date.now().toString().slice(-6)}${Math.floor(1000 + Math.random() * 9000)}` }

async function sendEmail(to: string, subject: string, html: string) {
  if (!process.env.EMAIL_USER || process.env.EMAIL_USER.includes('your-gmail')) {
    console.log('[MAIL] Email not configured — skipping send'); return
  }
  try {
    const t = nodemailer.createTransport({ service: 'gmail', auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS } })
    await t.sendMail({ from: process.env.EMAIL_USER, to, subject, html })
  } catch (e) { console.error('[MAIL] Send failed:', e) }
}

// ─── SIGNUP ───────────────────────────────────────────────────────────────────
app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password } = req.body
  if (!name || !email || !password) { res.status(400).json({ success: false, message: 'All fields are required' }); return }
  if (!validEmail(email)) { res.status(400).json({ success: false, message: 'Invalid email address' }); return }
  if (password.length < 8) { res.status(400).json({ success: false, message: 'Password must be at least 8 characters' }); return }
  try {
    if (db.prepare('SELECT id FROM users WHERE email = ?').get(email)) {
      res.status(400).json({ success: false, message: 'An account with this email already exists' }); return
    }
    const hash = await bcrypt.hash(password, 10)
    const r = db.prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)').run(name, email, hash)
    const token = jwt.sign({ id: r.lastInsertRowid, email, name }, JWT_SECRET, { expiresIn: '7d' })
    res.json({ success: true, token, user: { id: r.lastInsertRowid, name, email } })
  } catch (e) { console.error(e); res.status(500).json({ success: false, message: 'Server error' }) }
})

// ─── LOGIN ────────────────────────────────────────────────────────────────────
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) { res.status(400).json({ success: false, message: 'Email and password required' }); return }
  try {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      res.status(401).json({ success: false, message: 'Invalid email or password' }); return
    }
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' })
    res.json({ success: true, token, user: { id: user.id, name: user.name, email: user.email } })
  } catch (e) { console.error(e); res.status(500).json({ success: false, message: 'Server error' }) }
})

// ─── FORGOT PASSWORD ──────────────────────────────────────────────────────────
app.post('/api/auth/forgot-password', async (req, res) => {
  const { email } = req.body
  const msg = 'If an account exists, a reset link was sent.'
  if (!email) { res.status(400).json({ success: false, message: 'Email required' }); return }
  try {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any
    if (!user) { res.json({ success: true, message: msg }); return }
    const { randomBytes } = await import('crypto')
    const token = randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 3600000).toISOString()
    db.prepare('UPDATE users SET reset_token = ?, reset_expires = ? WHERE id = ?').run(token, expires, user.id)
    const base = process.env.BASE_URL || `https://fed-logistics.onrender.com`
    const link = `${base}/reset-password?token=${token}`
    console.log(`[RESET] Link for ${email}: ${link}`)
    await sendEmail(email, 'Reset Your Fed Logistics Password',
      `<div style="font-family:sans-serif;max-width:500px;margin:auto;padding:32px;">
        <h2 style="color:#4D148C">Reset Your Password</h2>
        <p>Hi ${user.name}, click below to reset your password. Expires in 1 hour.</p>
        <a href="${link}" style="display:inline-block;background:#FF6200;color:white;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold;margin:16px 0">Reset Password</a>
        <p style="color:#999;font-size:12px">If you didn't request this, ignore this email.</p>
      </div>`
    )
    res.json({ success: true, message: msg })
  } catch (e) { console.error(e); res.status(500).json({ success: false, message: 'Server error' }) }
})

// ─── RESET PASSWORD ───────────────────────────────────────────────────────────
app.post('/api/auth/reset-password', async (req, res) => {
  const { token, password } = req.body
  if (!token || !password) { res.status(400).json({ success: false, message: 'Token and password required' }); return }
  if (password.length < 8) { res.status(400).json({ success: false, message: 'Password must be at least 8 characters' }); return }
  try {
    const user = db.prepare('SELECT * FROM users WHERE reset_token = ?').get(token) as any
    if (!user || new Date(user.reset_expires) < new Date()) {
      res.status(400).json({ success: false, message: 'Invalid or expired reset link' }); return
    }
    const hash = await bcrypt.hash(password, 10)
    db.prepare('UPDATE users SET password_hash = ?, reset_token = NULL, reset_expires = NULL WHERE id = ?').run(hash, user.id)
    res.json({ success: true, message: 'Password reset successfully' })
  } catch (e) { console.error(e); res.status(500).json({ success: false, message: 'Server error' }) }
})

// ─── TRACK ────────────────────────────────────────────────────────────────────
app.post('/api/track', (req, res) => {
  const { trackingNumber } = req.body
  if (!trackingNumber) { res.status(400).json({ success: false, message: 'Tracking number required' }); return }
  try {
    const s = db.prepare('SELECT * FROM shipments WHERE tracking_number = ?').get(trackingNumber.trim()) as any
    if (!s) { res.status(404).json({ success: false, message: 'Tracking number not found. Please check and try again.' }); return }
    const history = (db.prepare('SELECT * FROM tracking_history WHERE shipment_id = ? ORDER BY id ASC').all(s.id) as any[])
      .map(h => ({ status: h.status, location: h.location, date: h.date, completed: h.completed === 1 }))
    res.json({ success: true, data: { trackingNumber: s.tracking_number, status: s.status, estimatedDelivery: s.estimated_delivery, origin: s.origin, destination: s.destination, weight: s.weight, service: s.service, history } })
  } catch (e) { console.error(e); res.status(500).json({ success: false, message: 'Server error' }) }
})

// ─── QUOTE ────────────────────────────────────────────────────────────────────
app.post('/api/quote', (req, res) => {
  const { from, to, weight, service } = req.body
  if (!from || !to || !weight || !service) { res.status(400).json({ success: false, message: 'All fields required' }); return }
  const mult = service === 'same-day' ? 3 : service === 'express' ? 2 : 1
  const price = (15 + parseFloat(weight) * 2.5) * mult
  res.json({ success: true, price: price.toFixed(2) })
})

// ─── SHIP CREATE ──────────────────────────────────────────────────────────────
app.post('/api/ship/create', auth, (req: AuthReq, res) => {
  const { from, to, weight, service, price } = req.body
  if (!from || !to || !weight || !service) { res.status(400).json({ success: false, message: 'All fields required' }); return }
  try {
    const num = trackNum()
    const days = service === 'same-day' ? 0 : service === 'express' ? 1 : 5
    const delivery = new Date(Date.now() + days * 86400000).toISOString().split('T')[0]
    const r = db.prepare('INSERT INTO shipments (tracking_number, user_id, status, origin, destination, weight, service, price, estimated_delivery) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').run(num, req.user!.id, 'Order Created', from, to, parseFloat(weight), service, parseFloat(price || '0'), delivery)
    const now = new Date().toLocaleString()
    const ins = db.prepare('INSERT INTO tracking_history (shipment_id, status, location, date, completed) VALUES (?, ?, ?, ?, ?)')
    db.transaction(() => {
      ins.run(r.lastInsertRowid, 'Order Created', from, now, 1)
      ins.run(r.lastInsertRowid, 'Picked Up', '', '', 0)
      ins.run(r.lastInsertRowid, 'In Transit', '', '', 0)
      ins.run(r.lastInsertRowid, 'Out for Delivery', '', '', 0)
      ins.run(r.lastInsertRowid, 'Delivered', '', '', 0)
    })()
    res.json({ success: true, trackingNumber: num, estimatedDelivery: delivery })
  } catch (e) { console.error(e); res.status(500).json({ success: false, message: 'Error creating shipment' }) }
})

// ─── MY SHIPMENTS ─────────────────────────────────────────────────────────────
app.get('/api/shipments/my', auth, (req: AuthReq, res) => {
  try {
    const rows = db.prepare('SELECT * FROM shipments WHERE user_id = ? ORDER BY created_at DESC').all(req.user!.id) as any[]
    res.json({
      success: true,
      shipments: rows.map(s => ({
        trackingNumber: s.tracking_number, status: s.status, origin: s.origin,
        destination: s.destination, service: s.service, price: s.price, weight: s.weight,
        estimatedDelivery: s.estimated_delivery, createdAt: s.created_at,
      }))
    })
  } catch (e) { console.error(e); res.status(500).json({ success: false, message: 'Server error' }) }
})

// ─── CONTACT ──────────────────────────────────────────────────────────────────
app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body
  if (!name || !email || !subject || !message) { res.status(400).json({ success: false, message: 'All fields required' }); return }
  if (!validEmail(email)) { res.status(400).json({ success: false, message: 'Invalid email' }); return }
  try {
    db.prepare('INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)').run(name, email, subject, message)
    await sendEmail(process.env.EMAIL_TO || ADMIN_EMAIL, `[Fed Logistics] ${subject}`, `<p><b>From:</b> ${name} (${email})</p><p><b>Message:</b></p><p>${message}</p>`)
    res.json({ success: true, message: "Message received. We'll get back to you within 24 hours." })
  } catch (e) { console.error(e); res.status(500).json({ success: false, message: 'Server error' }) }
})

// ─── ADMIN ROUTES ─────────────────────────────────────────────────────────────
app.get('/api/admin/stats', auth, adminOnly, (_req, res) => {
  try {
    const get = (q: string) => (db.prepare(q).get() as any).c
    res.json({
      success: true, stats: {
        totalShipments: get('SELECT COUNT(*) as c FROM shipments'),
        totalUsers: get('SELECT COUNT(*) as c FROM users'),
        totalMessages: get('SELECT COUNT(*) as c FROM contact_messages'),
        inTransit: get("SELECT COUNT(*) as c FROM shipments WHERE status = 'In Transit'"),
        delivered: get("SELECT COUNT(*) as c FROM shipments WHERE status = 'Delivered'"),
        pending: get("SELECT COUNT(*) as c FROM shipments WHERE status IN ('Order Created','Picked Up')"),
        revenue: Number((db.prepare('SELECT SUM(price) as t FROM shipments').get() as any).t || 0).toFixed(2),
      }
    })
  } catch (e) { console.error(e); res.status(500).json({ success: false, message: 'Server error' }) }
})

app.get('/api/admin/shipments', auth, adminOnly, (_req, res) => {
  try {
    const rows = db.prepare('SELECT s.*, u.name as user_name, u.email as user_email FROM shipments s LEFT JOIN users u ON s.user_id = u.id ORDER BY s.created_at DESC').all() as any[]
    res.json({
      success: true,
      shipments: rows.map(s => ({
        ...s,
        history: (db.prepare('SELECT * FROM tracking_history WHERE shipment_id = ? ORDER BY id ASC').all(s.id) as any[])
          .map(h => ({ id: h.id, status: h.status, location: h.location, date: h.date, completed: h.completed === 1 }))
      }))
    })
  } catch (e) { console.error(e); res.status(500).json({ success: false, message: 'Server error' }) }
})

app.put('/api/admin/shipments/:id/status', auth, adminOnly, (req, res) => {
  const { id } = req.params
  const { status, location } = req.body
  const valid = ['Order Created', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered']
  if (!status || !valid.includes(status)) { res.status(400).json({ success: false, message: 'Invalid status' }); return }
  try {
    const s = db.prepare('SELECT * FROM shipments WHERE id = ?').get(id) as any
    if (!s) { res.status(404).json({ success: false, message: 'Shipment not found' }); return }
    db.prepare('UPDATE shipments SET status = ? WHERE id = ?').run(status, id)
    const idx = valid.indexOf(status)
    const steps = db.prepare('SELECT * FROM tracking_history WHERE shipment_id = ? ORDER BY id ASC').all(id) as any[]
    const now = new Date().toLocaleString()
    db.transaction(() => {
      steps.forEach((step: any, i: number) => {
        if (i <= idx) db.prepare('UPDATE tracking_history SET completed = 1, location = ?, date = ? WHERE id = ?').run(i === idx ? (location || s.destination) : step.location, i === idx ? now : (step.date || now), step.id)
        else db.prepare('UPDATE tracking_history SET completed = 0 WHERE id = ?').run(step.id)
      })
    })()
    res.json({ success: true, message: `Status updated to "${status}"` })
  } catch (e) { console.error(e); res.status(500).json({ success: false, message: 'Server error' }) }
})

app.get('/api/admin/users', auth, adminOnly, (_req, res) => {
  try { res.json({ success: true, users: db.prepare('SELECT id, name, email, created_at FROM users ORDER BY created_at DESC').all() }) }
  catch (e) { res.status(500).json({ success: false, message: 'Server error' }) }
})

app.get('/api/admin/messages', auth, adminOnly, (_req, res) => {
  try { res.json({ success: true, messages: db.prepare('SELECT * FROM contact_messages ORDER BY created_at DESC').all() }) }
  catch (e) { res.status(500).json({ success: false, message: 'Server error' }) }
})

app.delete('/api/admin/shipments/:id', auth, adminOnly, (req, res) => {
  try {
    db.prepare('DELETE FROM tracking_history WHERE shipment_id = ?').run(req.params.id)
    db.prepare('DELETE FROM shipments WHERE id = ?').run(req.params.id)
    res.json({ success: true, message: 'Deleted' })
  } catch (e) { res.status(500).json({ success: false, message: 'Server error' }) }
})

// ─── SERVE FRONTEND ───────────────────────────────────────────────────────────
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite')
    const vite = await createServer({ server: { middlewareMode: true }, appType: 'spa' })
    app.use(vite.middlewares)
  } else {
    app.use(express.static(path.join(__dirname, 'dist')))
    app.get('*', (_req, res) => res.sendFile(path.join(__dirname, 'dist', 'index.html')))
  }
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Fed Logistics running on port ${PORT}`)
    console.log(`🔐 Admin: ${ADMIN_EMAIL}`)
  })
}

start()
