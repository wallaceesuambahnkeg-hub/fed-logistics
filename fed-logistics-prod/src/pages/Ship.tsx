import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Package, MapPin, Truck, CreditCard, Check, ChevronRight, CheckCircle, AlertCircle, Lock, LogIn, UserPlus } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function AuthGate() {
  const [mode, setMode] = useState<'choose' | 'login' | 'signup'>('choose')
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()

  async function handleLogin(e: FormEvent) {
    e.preventDefault(); setLoading(true); setError('')
    try {
      const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: form.email, password: form.password }) })
      const data = await res.json()
      if (data.success) login(data.token, data.user)
      else setError(data.message || 'Invalid email or password')
    } catch { setError('Connection error') } finally { setLoading(false) }
  }

  async function handleSignup(e: FormEvent) {
    e.preventDefault()
    if (form.password !== form.confirm) { setError('Passwords do not match'); return }
    if (form.password.length < 8) { setError('Password must be at least 8 characters'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/auth/signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: form.name, email: form.email, password: form.password }) })
      const data = await res.json()
      if (data.success) login(data.token, data.user)
      else setError(data.message || 'Error creating account')
    } catch { setError('Connection error') } finally { setLoading(false) }
  }

  const field = (label: string, type: string, key: keyof typeof form, placeholder: string) => (
    <div key={label}>
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      <input type={type} required value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} placeholder={placeholder} className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-fl-purple transition" />
    </div>
  )

  return (
    <div className="min-h-screen bg-fl-light pt-24 pb-16 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-fl-purple rounded-full flex items-center justify-center mx-auto mb-4"><Lock className="w-8 h-8 text-white" /></div>
          <h1 className="text-3xl font-heading font-bold text-fl-dark mb-2">Ship a Package</h1>
          <p className="text-gray-500">You need an account to create shipments and get tracking numbers.</p>
        </div>

        {mode === 'choose' && (
          <div className="space-y-4">
            <button onClick={() => { setMode('login'); setError('') }} className="w-full bg-fl-purple hover:bg-purple-900 text-white p-5 rounded-2xl flex items-center gap-4 transition hover:shadow-lg group">
              <div className="w-11 h-11 bg-white/20 rounded-full flex items-center justify-center"><LogIn className="w-5 h-5" /></div>
              <div className="text-left flex-grow">
                <p className="font-bold">Log In</p>
                <p className="text-sm text-purple-200">I already have an account</p>
              </div>
              <ChevronRight className="w-5 h-5 opacity-60" />
            </button>
            <button onClick={() => { setMode('signup'); setError('') }} className="w-full bg-fl-orange hover:bg-orange-600 text-white p-5 rounded-2xl flex items-center gap-4 transition hover:shadow-lg group">
              <div className="w-11 h-11 bg-white/20 rounded-full flex items-center justify-center"><UserPlus className="w-5 h-5" /></div>
              <div className="text-left flex-grow">
                <p className="font-bold">Create Free Account</p>
                <p className="text-sm text-orange-100">Sign up — it takes 30 seconds</p>
              </div>
              <ChevronRight className="w-5 h-5 opacity-60" />
            </button>
            <div className="bg-white rounded-2xl p-5 border border-gray-100">
              <h3 className="font-bold text-fl-dark mb-3 flex items-center gap-2"><Package className="w-5 h-5 text-fl-orange" /> Why you need an account</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                {['Get a real tracking number for every shipment', 'View all your shipments in your dashboard', 'Track your packages at every step'].map(i => (
                  <li key={i} className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500 flex-shrink-0" />{i}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {mode === 'login' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-fl-purple p-5 text-white">
              <button onClick={() => { setMode('choose'); setError('') }} className="text-purple-200 text-sm mb-2 hover:text-white">← Back</button>
              <h2 className="text-xl font-heading font-bold">Log In</h2>
            </div>
            <div className="p-6">
              {error && <div className="flex items-center gap-2 bg-red-50 border-l-4 border-red-500 p-3 rounded mb-4"><AlertCircle className="w-4 h-4 text-red-500" /><p className="text-sm text-red-700">{error}</p></div>}
              <form onSubmit={handleLogin} className="space-y-4">
                {field('Email', 'email', 'email', 'you@example.com')}
                {field('Password', 'password', 'password', '••••••••')}
                <div className="text-right"><Link to="/forgot-password" className="text-xs text-fl-purple hover:text-fl-orange">Forgot password?</Link></div>
                <button type="submit" disabled={loading} className="w-full bg-fl-purple hover:bg-purple-900 text-white py-3 rounded-xl font-bold transition disabled:opacity-60">
                  {loading ? 'Logging in...' : 'Log In & Continue'}
                </button>
              </form>
              <p className="text-center text-sm text-gray-500 mt-4">No account? <button onClick={() => { setMode('signup'); setError('') }} className="text-fl-orange font-semibold">Sign up free</button></p>
            </div>
          </div>
        )}

        {mode === 'signup' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-fl-orange p-5 text-white">
              <button onClick={() => { setMode('choose'); setError('') }} className="text-orange-100 text-sm mb-2 hover:text-white">← Back</button>
              <h2 className="text-xl font-heading font-bold">Create Account</h2>
            </div>
            <div className="p-6">
              {error && <div className="flex items-center gap-2 bg-red-50 border-l-4 border-red-500 p-3 rounded mb-4"><AlertCircle className="w-4 h-4 text-red-500" /><p className="text-sm text-red-700">{error}</p></div>}
              <form onSubmit={handleSignup} className="space-y-4">
                {field('Full Name', 'text', 'name', 'John Doe')}
                {field('Email', 'email', 'email', 'you@example.com')}
                {field('Password', 'password', 'password', 'Min 8 characters')}
                {field('Confirm Password', 'password', 'confirm', '••••••••')}
                <button type="submit" disabled={loading} className="w-full bg-fl-orange hover:bg-orange-600 text-white py-3 rounded-xl font-bold transition disabled:opacity-60">
                  {loading ? 'Creating...' : 'Create Account & Continue'}
                </button>
              </form>
              <p className="text-center text-sm text-gray-500 mt-4">Have an account? <button onClick={() => { setMode('login'); setError('') }} className="text-fl-purple font-semibold">Log in</button></p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const STEPS = [
  { id: 1, label: 'Addresses', icon: <MapPin className="w-4 h-4" /> },
  { id: 2, label: 'Package', icon: <Package className="w-4 h-4" /> },
  { id: 3, label: 'Service', icon: <Truck className="w-4 h-4" /> },
  { id: 4, label: 'Review', icon: <CreditCard className="w-4 h-4" /> },
]

export default function Ship() {
  const { isLoggedIn, token } = useAuth()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ from: '', to: '', weight: '', service: 'ground' })
  const [quote, setQuote] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [tracking, setTracking] = useState<string | null>(null)

  if (!isLoggedIn) return <AuthGate />

  async function getQuote() {
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/quote', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await res.json()
      if (data.success) { setQuote(data.price); setStep(4) }
      else setError(data.message || 'Could not get quote')
    } catch { setError('Connection error') } finally { setLoading(false) }
  }

  async function createShipment() {
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/ship/create', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ ...form, price: quote }) })
      const data = await res.json()
      if (data.success) setTracking(data.trackingNumber)
      else setError(data.message || 'Could not create shipment')
    } catch { setError('Connection error') } finally { setLoading(false) }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault(); setError('')
    if (step === 3) getQuote()
    else if (step === 4) createShipment()
    else setStep(s => s + 1)
  }

  if (tracking) return (
    <div className="min-h-screen bg-fl-light pt-24 pb-16 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-sm w-full">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-heading font-bold text-fl-dark mb-2">Shipment Created!</h2>
        <p className="text-gray-500 mb-4 text-sm">Your tracking number:</p>
        <div className="bg-fl-light rounded-xl p-4 mb-6"><p className="text-xl font-mono font-bold text-fl-purple">{tracking}</p></div>
        <div className="flex gap-3 justify-center">
          <Link to={`/track?number=${tracking}`} className="bg-fl-orange text-white px-5 py-2.5 rounded-xl font-bold hover:bg-orange-600 transition text-sm">Track It</Link>
          <Link to="/dashboard" className="bg-fl-purple text-white px-5 py-2.5 rounded-xl font-bold hover:bg-purple-900 transition text-sm">Dashboard</Link>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-fl-light pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-heading font-bold text-fl-dark mb-2">Ship a Package</h1>
          <p className="text-gray-500">Complete the steps below to create your shipment.</p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-between mb-10 relative">
          <div className="absolute left-0 right-0 top-5 h-1 bg-gray-200 -z-10"></div>
          <div className="absolute left-0 top-5 h-1 bg-fl-orange -z-10 transition-all duration-500" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
          {STEPS.map(s => (
            <div key={s.id} className="flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white transition-colors ${step > s.id ? 'bg-fl-orange text-white' : step === s.id ? 'bg-fl-purple text-white' : 'bg-gray-200 text-gray-400'}`}>
                {step > s.id ? <Check className="w-4 h-4" /> : s.icon}
              </div>
              <span className={`text-xs font-semibold hidden sm:block ${step >= s.id ? 'text-fl-dark' : 'text-gray-400'}`}>{s.label}</span>
            </div>
          ))}
        </div>

        {error && <div className="flex items-center gap-3 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-5"><AlertCircle className="w-5 h-5 text-red-500" /><p className="text-red-700 text-sm">{error}</p></div>}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <form onSubmit={handleSubmit}>
            <div className="p-8">
              {step === 1 && (
                <div>
                  <h2 className="text-xl font-bold text-fl-dark mb-6">Where are you shipping?</h2>
                  <div className="space-y-5">
                    {[{ label: 'From (Origin)', key: 'from', ph: 'e.g. London, UK' }, { label: 'To (Destination)', key: 'to', ph: 'e.g. New York, USA' }].map(f => (
                      <div key={f.key}>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">{f.label}</label>
                        <input type="text" required placeholder={f.ph} value={form[f.key as 'from' | 'to']} onChange={e => setForm({ ...form, [f.key]: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-fl-orange transition" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {step === 2 && (
                <div>
                  <h2 className="text-xl font-bold text-fl-dark mb-6">Package Details</h2>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Weight (lbs)</label>
                  <input type="number" required min="0.1" step="0.1" placeholder="e.g. 5.5" value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-fl-orange transition" />
                </div>
              )}
              {step === 3 && (
                <div>
                  <h2 className="text-xl font-bold text-fl-dark mb-6">Select Service</h2>
                  <div className="space-y-3">
                    {[{ id: 'ground', label: 'Ground Delivery', desc: '1–5 business days', price: 'From $15' }, { id: 'express', label: 'Express Shipping', desc: 'Next business day', price: 'From $30' }, { id: 'same-day', label: 'Same Day Delivery', desc: 'Delivered today', price: 'From $45' }].map(s => (
                      <label key={s.id} className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition ${form.service === s.id ? 'border-fl-orange bg-orange-50' : 'border-gray-200 hover:border-fl-orange/50'}`}>
                        <input type="radio" name="service" value={s.id} checked={form.service === s.id} onChange={e => setForm({ ...form, service: e.target.value })} className="w-4 h-4 text-fl-orange" />
                        <div className="ml-3 flex-grow">
                          <p className="font-bold text-fl-dark">{s.label}</p>
                          <p className="text-sm text-gray-500">{s.desc}</p>
                        </div>
                        <span className="text-fl-orange font-bold text-sm">{s.price}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
              {step === 4 && (
                <div>
                  <h2 className="text-xl font-bold text-fl-dark mb-6">Review & Confirm</h2>
                  <div className="bg-fl-light rounded-xl p-5 mb-5">
                    {[['From', form.from], ['To', form.to], ['Weight', `${form.weight} lbs`], ['Service', form.service]].map(([k, v]) => (
                      <div key={k} className="flex justify-between py-2 border-b border-gray-200 last:border-0">
                        <span className="text-gray-500 text-sm capitalize">{k}</span>
                        <span className="font-semibold text-sm capitalize">{v}</span>
                      </div>
                    ))}
                    <div className="flex justify-between pt-3 mt-1">
                      <span className="font-bold text-fl-dark">Total</span>
                      <span className="text-2xl font-bold text-fl-orange">${quote}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 bg-blue-50 p-3 rounded-lg">Demo mode — no real payment. Click Confirm to get a real tracking number.</p>
                </div>
              )}
            </div>
            <div className="bg-gray-50 px-8 py-5 border-t flex justify-between items-center">
              {step > 1 ? <button type="button" onClick={() => { setStep(s => s - 1); setError('') }} className="text-gray-500 font-semibold hover:text-fl-dark transition">← Back</button> : <div />}
              <button type="submit" disabled={loading} className="bg-fl-purple hover:bg-purple-900 text-white px-7 py-3 rounded-xl font-bold transition disabled:opacity-60 flex items-center gap-2">
                {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
                {step === 4 ? 'Confirm & Ship' : step === 3 ? 'Get Quote' : <>Continue <ChevronRight className="w-4 h-4" /></>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
