import { useState, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Package, MapPin, Truck, Check, ChevronRight, CheckCircle, AlertCircle, Lock, LogIn, UserPlus, User, Phone, Mail, CreditCard, Building } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

// ── Auth Gate ─────────────────────────────────────────────────────────────────
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
            <button onClick={() => { setMode('login'); setError('') }} className="w-full bg-fl-purple hover:bg-purple-900 text-white p-5 rounded-2xl flex items-center gap-4 transition hover:shadow-lg">
              <div className="w-11 h-11 bg-white/20 rounded-full flex items-center justify-center"><LogIn className="w-5 h-5" /></div>
              <div className="text-left flex-grow"><p className="font-bold">Log In</p><p className="text-sm text-purple-200">I already have an account</p></div>
              <ChevronRight className="w-5 h-5 opacity-60" />
            </button>
            <button onClick={() => { setMode('signup'); setError('') }} className="w-full bg-fl-orange hover:bg-orange-600 text-white p-5 rounded-2xl flex items-center gap-4 transition hover:shadow-lg">
              <div className="w-11 h-11 bg-white/20 rounded-full flex items-center justify-center"><UserPlus className="w-5 h-5" /></div>
              <div className="text-left flex-grow"><p className="font-bold">Create Free Account</p><p className="text-sm text-orange-100">Sign up — it takes 30 seconds</p></div>
              <ChevronRight className="w-5 h-5 opacity-60" />
            </button>
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
                <button type="submit" disabled={loading} className="w-full bg-fl-purple hover:bg-purple-900 text-white py-3 rounded-xl font-bold transition disabled:opacity-60">{loading ? 'Logging in...' : 'Log In & Continue'}</button>
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
                <button type="submit" disabled={loading} className="w-full bg-fl-orange hover:bg-orange-600 text-white py-3 rounded-xl font-bold transition disabled:opacity-60">{loading ? 'Creating...' : 'Create Account & Continue'}</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Payment Details Component ─────────────────────────────────────────────────
function PaymentDetails({ amount }: { amount: string }) {
  const [copied, setCopied] = useState('')
  function copy(text: string, label: string) {
    navigator.clipboard.writeText(text).then(() => { setCopied(label); setTimeout(() => setCopied(''), 2000) })
  }

  return (
    <div className="space-y-4">
      <div className="bg-fl-orange/10 border border-fl-orange/30 rounded-xl p-4 text-center">
        <p className="text-sm text-gray-600 mb-1">Amount to Transfer</p>
        <p className="text-4xl font-black text-fl-orange">${amount}</p>
        <p className="text-xs text-gray-500 mt-1">Transfer this exact amount using one of the accounts below</p>
      </div>

      {/* UK Bank */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="bg-fl-purple text-white px-4 py-3 flex items-center gap-2">
          <Building className="w-4 h-4" />
          <p className="font-bold text-sm">🇬🇧 UK Bank Transfer</p>
        </div>
        <div className="p-4 space-y-2.5 text-sm">
          {[
            ['Account Name', 'Ogechukwu Odilia Eze'],
            ['Bank Name', 'Clear Junction Limited'],
            ['Account Number', '41153472'],
            ['Sort Code', '04-13-07'],
            ['SWIFT / BIC', 'CLJUGB21XXX'],
            ['Bank Address', '4th Floor Imperial House, 15 Kingsway, London WC2B 6UN'],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between items-start gap-3">
              <span className="text-gray-500 flex-shrink-0">{label}</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-fl-dark text-right">{value}</span>
                {['Account Number', 'Sort Code', 'SWIFT / BIC'].includes(label) && (
                  <button onClick={() => copy(value, label)} className="text-xs bg-gray-100 hover:bg-fl-orange hover:text-white px-2 py-0.5 rounded transition flex-shrink-0">
                    {copied === label ? '✓' : 'Copy'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* USA Bank */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="bg-blue-600 text-white px-4 py-3 flex items-center gap-2">
          <Building className="w-4 h-4" />
          <p className="font-bold text-sm">🇺🇸 USA Bank Transfer (ACH/Wire)</p>
        </div>
        <div className="p-4 space-y-2.5 text-sm">
          {[
            ['Account Name', 'Ogechukwu Odilia Eze'],
            ['Bank Name', 'Lead Bank'],
            ['Account Number', '218877239981'],
            ['Routing Number', '101019644'],
            ['Account Type', 'Checking'],
            ['Bank Address', '1801 Main St., Kansas City, MO 64108'],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between items-start gap-3">
              <span className="text-gray-500 flex-shrink-0">{label}</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-fl-dark text-right">{value}</span>
                {['Account Number', 'Routing Number'].includes(label) && (
                  <button onClick={() => copy(value, label)} className="text-xs bg-gray-100 hover:bg-blue-600 hover:text-white px-2 py-0.5 rounded transition flex-shrink-0">
                    {copied === label ? '✓' : 'Copy'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-xs text-yellow-800">
        <p className="font-bold mb-1">⚠️ Important Payment Instructions</p>
        <ul className="space-y-1 list-disc list-inside">
          <li>Use your <strong>tracking number</strong> as the payment reference</li>
          <li>Transfer the <strong>exact amount</strong> shown above</li>
          <li>Your shipment will be activated within <strong>2–4 business hours</strong> after payment is confirmed</li>
          <li>Email <strong>support@fedlogisticscorp.com</strong> with your payment proof to speed up confirmation</li>
        </ul>
      </div>
    </div>
  )
}

// ── Step definitions ──────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: 'Sender',    icon: <User className="w-4 h-4" /> },
  { id: 2, label: 'Receiver',  icon: <MapPin className="w-4 h-4" /> },
  { id: 3, label: 'Package',   icon: <Package className="w-4 h-4" /> },
  { id: 4, label: 'Service',   icon: <Truck className="w-4 h-4" /> },
  { id: 5, label: 'Payment',   icon: <CreditCard className="w-4 h-4" /> },
]

export default function Ship() {
  const { isLoggedIn, token } = useAuth()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    // Sender
    senderName: '', senderAddress: '', senderPhone: '', senderEmail: '',
    // Receiver
    receiverName: '', receiverAddress: '', receiverPhone: '', receiverEmail: '',
    // Package
    weight: '', description: '',
    // Service
    service: 'ground',
  })
  const [quote, setQuote] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [tracking, setTracking] = useState<string | null>(null)

  if (!isLoggedIn) return <AuthGate />

  function setF(key: keyof typeof form, value: string) { setForm(f => ({ ...f, [key]: value })) }

  async function getQuote() {
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/quote', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ from: form.senderAddress, to: form.receiverAddress, weight: form.weight, service: form.service }) })
      const data = await res.json()
      if (data.success) { setQuote(data.price); setStep(5) }
      else setError(data.message || 'Could not get quote')
    } catch { setError('Connection error') } finally { setLoading(false) }
  }

  async function createShipment() {
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/ship/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          from: form.senderAddress, to: form.receiverAddress,
          weight: form.weight, service: form.service, price: quote,
          senderName: form.senderName, senderPhone: form.senderPhone, senderEmail: form.senderEmail,
          receiverName: form.receiverName, receiverPhone: form.receiverPhone, receiverEmail: form.receiverEmail,
          description: form.description,
        })
      })
      const data = await res.json()
      if (data.success) setTracking(data.trackingNumber)
      else setError(data.message || 'Could not create shipment')
    } catch { setError('Connection error') } finally { setLoading(false) }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault(); setError('')
    if (step === 4) getQuote()
    else if (step === 5) createShipment()
    else setStep(s => s + 1)
  }

  // ── Success screen with payment details ────────────────────────────────────
  if (tracking) return (
    <div className="min-h-screen bg-fl-light pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-green-500 p-6 text-white text-center">
            <CheckCircle className="w-16 h-16 mx-auto mb-3" />
            <h2 className="text-2xl font-heading font-bold mb-1">Shipment Created!</h2>
            <p className="text-green-100">Complete your payment below to activate your shipment</p>
          </div>
          <div className="p-6">
            <div className="bg-fl-light rounded-xl p-4 mb-6 text-center">
              <p className="text-sm text-gray-500 mb-1">Your Tracking Number</p>
              <p className="text-2xl font-mono font-black text-fl-purple">{tracking}</p>
              <p className="text-xs text-gray-400 mt-1">Use this as your payment reference</p>
            </div>
            <h3 className="font-heading font-bold text-fl-dark text-lg mb-4">Complete Payment</h3>
            <PaymentDetails amount={quote || '0'} />
            <div className="flex gap-3 mt-6">
              <Link to={`/track?number=${tracking}`} className="flex-1 bg-fl-purple text-white py-3 rounded-xl font-bold hover:bg-purple-900 transition text-center text-sm">Track Shipment</Link>
              <Link to="/dashboard" className="flex-1 bg-fl-orange text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition text-center text-sm">My Dashboard</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const inputClass = "w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-fl-orange transition"
  const labelClass = "block text-sm font-semibold text-gray-700 mb-2"

  return (
    <div className="min-h-screen bg-fl-light pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-heading font-bold text-fl-dark mb-2">Ship a Package</h1>
          <p className="text-gray-500">Complete the steps below to create your shipment.</p>
        </div>

        {/* Progress bar */}
        <div className="flex items-center justify-between mb-10 relative">
          <div className="absolute left-0 right-0 top-5 h-1 bg-gray-200 -z-10"></div>
          <div className="absolute left-0 top-5 h-1 bg-fl-orange -z-10 transition-all duration-500" style={{ width: `${((step - 1) / 4) * 100}%` }}></div>
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

              {/* STEP 1 — SENDER */}
              {step === 1 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-fl-purple rounded-full flex items-center justify-center"><User className="w-5 h-5 text-white" /></div>
                    <div><h2 className="text-xl font-bold text-fl-dark">Sender Information</h2><p className="text-sm text-gray-500">Details of the person sending the package</p></div>
                  </div>
                  <div className="space-y-4">
                    <div><label className={labelClass}>Full Name *</label><input required type="text" placeholder="John Doe" value={form.senderName} onChange={e => setF('senderName', e.target.value)} className={inputClass} /></div>
                    <div><label className={labelClass}>Full Address *</label><textarea required rows={2} placeholder="123 Main St, London, UK" value={form.senderAddress} onChange={e => setF('senderAddress', e.target.value)} className={inputClass + ' resize-none'} /></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div><label className={labelClass}>Phone Number *</label><input required type="tel" placeholder="+44 7700 000000" value={form.senderPhone} onChange={e => setF('senderPhone', e.target.value)} className={inputClass} /></div>
                      <div><label className={labelClass}>Email Address *</label><input required type="email" placeholder="sender@email.com" value={form.senderEmail} onChange={e => setF('senderEmail', e.target.value)} className={inputClass} /></div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2 — RECEIVER */}
              {step === 2 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-fl-orange rounded-full flex items-center justify-center"><MapPin className="w-5 h-5 text-white" /></div>
                    <div><h2 className="text-xl font-bold text-fl-dark">Receiver Information</h2><p className="text-sm text-gray-500">Details of the person receiving the package</p></div>
                  </div>
                  <div className="space-y-4">
                    <div><label className={labelClass}>Full Name *</label><input required type="text" placeholder="Jane Smith" value={form.receiverName} onChange={e => setF('receiverName', e.target.value)} className={inputClass} /></div>
                    <div><label className={labelClass}>Delivery Address *</label><textarea required rows={2} placeholder="456 Broadway, New York, USA" value={form.receiverAddress} onChange={e => setF('receiverAddress', e.target.value)} className={inputClass + ' resize-none'} /></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div><label className={labelClass}>Phone Number *</label><input required type="tel" placeholder="+1 212 000 0000" value={form.receiverPhone} onChange={e => setF('receiverPhone', e.target.value)} className={inputClass} /></div>
                      <div><label className={labelClass}>Email Address *</label><input required type="email" placeholder="receiver@email.com" value={form.receiverEmail} onChange={e => setF('receiverEmail', e.target.value)} className={inputClass} /></div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3 — PACKAGE */}
              {step === 3 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-fl-purple rounded-full flex items-center justify-center"><Package className="w-5 h-5 text-white" /></div>
                    <div><h2 className="text-xl font-bold text-fl-dark">Package Details</h2><p className="text-sm text-gray-500">Tell us about what you're shipping</p></div>
                  </div>
                  <div className="space-y-4">
                    <div><label className={labelClass}>Weight (lbs) *</label><input required type="number" min="0.1" step="0.1" placeholder="e.g. 5.5" value={form.weight} onChange={e => setF('weight', e.target.value)} className={inputClass} /></div>
                    <div><label className={labelClass}>Package Description</label><textarea rows={3} placeholder="e.g. Electronics, clothing, documents..." value={form.description} onChange={e => setF('description', e.target.value)} className={inputClass + ' resize-none'} /></div>
                  </div>
                </div>
              )}

              {/* STEP 4 — SERVICE */}
              {step === 4 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-fl-orange rounded-full flex items-center justify-center"><Truck className="w-5 h-5 text-white" /></div>
                    <div><h2 className="text-xl font-bold text-fl-dark">Select Service</h2><p className="text-sm text-gray-500">Choose your delivery speed</p></div>
                  </div>
                  <div className="space-y-3">
                    {[
                      { id: 'ground', label: 'Ground Delivery', desc: '1–5 business days', price: 'From $15', icon: '🚛' },
                      { id: 'express', label: 'Express Shipping', desc: 'Next business day', price: 'From $30', icon: '⚡' },
                      { id: 'same-day', label: 'Same Day Delivery', desc: 'Delivered today', price: 'From $45', icon: '🚀' },
                    ].map(s => (
                      <label key={s.id} className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition ${form.service === s.id ? 'border-fl-orange bg-orange-50' : 'border-gray-200 hover:border-fl-orange/50'}`}>
                        <input type="radio" name="service" value={s.id} checked={form.service === s.id} onChange={e => setF('service', e.target.value)} className="w-4 h-4 text-fl-orange" />
                        <span className="text-2xl mx-3">{s.icon}</span>
                        <div className="flex-grow">
                          <p className="font-bold text-fl-dark">{s.label}</p>
                          <p className="text-sm text-gray-500">{s.desc}</p>
                        </div>
                        <span className="text-fl-orange font-bold text-sm">{s.price}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 5 — REVIEW + PAYMENT */}
              {step === 5 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-fl-purple rounded-full flex items-center justify-center"><CreditCard className="w-5 h-5 text-white" /></div>
                    <div><h2 className="text-xl font-bold text-fl-dark">Review & Payment</h2><p className="text-sm text-gray-500">Confirm your shipment details</p></div>
                  </div>

                  {/* Summary */}
                  <div className="bg-fl-light rounded-xl p-5 mb-5 text-sm space-y-2">
                    <p className="font-bold text-fl-dark mb-3">📦 Shipment Summary</p>
                    {[
                      ['Sender', `${form.senderName} — ${form.senderAddress}`],
                      ['Receiver', `${form.receiverName} — ${form.receiverAddress}`],
                      ['Weight', `${form.weight} lbs`],
                      ['Service', form.service],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-3 py-1.5 border-b border-gray-200 last:border-0">
                        <span className="text-gray-500">{k}</span>
                        <span className="font-semibold text-right capitalize">{v}</span>
                      </div>
                    ))}
                    <div className="flex justify-between pt-2 mt-1">
                      <span className="font-bold text-fl-dark">Total</span>
                      <span className="text-2xl font-black text-fl-orange">${quote}</span>
                    </div>
                  </div>

                  {/* Payment preview */}
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800">
                    <p className="font-bold mb-1">💳 Payment by Bank Transfer</p>
                    <p>After confirming, you'll receive your tracking number and full UK/USA bank transfer details.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer buttons */}
            <div className="bg-gray-50 px-8 py-5 border-t flex justify-between items-center">
              {step > 1
                ? <button type="button" onClick={() => { setStep(s => s - 1); setError('') }} className="text-gray-500 font-semibold hover:text-fl-dark transition">← Back</button>
                : <div />
              }
              <button type="submit" disabled={loading} className="bg-fl-purple hover:bg-purple-900 text-white px-7 py-3 rounded-xl font-bold transition disabled:opacity-60 flex items-center gap-2">
                {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
                {step === 5 ? '✓ Confirm & Get Payment Details' : step === 4 ? 'Get Quote' : <>Continue <ChevronRight className="w-4 h-4" /></>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}