import React, { useState } from 'react';
import { Check, ChevronRight, Package, MapPin, CreditCard, Truck, CheckCircle, AlertCircle, LogIn, UserPlus, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx } from 'clsx';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

// ─── Auth Gate shown when user is not logged in ───────────────────────────────
function AuthGate() {
  const [mode, setMode] = useState<'choice' | 'login' | 'signup'>('choice');
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });
      const data = await res.json();
      if (data.success) { login(data.token, data.user); }
      else setError(data.message || 'Invalid email or password.');
    } catch { setError('Connection error. Please try again.'); }
    finally { setIsLoading(false); }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) { setError('Passwords do not match.'); return; }
    if (formData.password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setIsLoading(true); setError('');
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password }),
      });
      const data = await res.json();
      if (data.success) { login(data.token, data.user); }
      else setError(data.message || 'Error creating account.');
    } catch { setError('Connection error. Please try again.'); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="bg-fedex-light min-h-screen pt-24 pb-20">
      <div className="max-w-lg mx-auto px-4 sm:px-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-fedex-purple rounded-full mb-6 shadow-lg">
            <Lock className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-heading font-bold text-fedex-dark mb-3">Ship a Package</h1>
          <p className="text-gray-500 text-lg">You need an account to create a shipment and track it.</p>
        </motion.div>

        <AnimatePresence mode="wait">

          {/* Choice Screen */}
          {mode === 'choice' && (
            <motion.div key="choice" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
              <button
                onClick={() => { setMode('login'); setError(''); }}
                className="w-full bg-fedex-purple hover:bg-purple-900 text-white p-6 rounded-2xl font-bold text-lg flex items-center gap-4 transition-all hover:shadow-xl group"
              >
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <LogIn className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="text-lg font-bold">Log In</p>
                  <p className="text-sm text-purple-200 font-normal">I already have an account</p>
                </div>
                <ChevronRight className="w-5 h-5 ml-auto opacity-70" />
              </button>

              <button
                onClick={() => { setMode('signup'); setError(''); }}
                className="w-full bg-fedex-orange hover:bg-orange-600 text-white p-6 rounded-2xl font-bold text-lg flex items-center gap-4 transition-all hover:shadow-xl group"
              >
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <UserPlus className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="text-lg font-bold">Create Account</p>
                  <p className="text-sm text-orange-100 font-normal">Sign up for free — takes 30 seconds</p>
                </div>
                <ChevronRight className="w-5 h-5 ml-auto opacity-70" />
              </button>

              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mt-6">
                <h3 className="font-bold text-fedex-dark mb-3 flex items-center gap-2">
                  <Package className="w-5 h-5 text-fedex-orange" /> Why create an account?
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  {[
                    'Get a real tracking number for every shipment',
                    'View your full shipment history on your Dashboard',
                    'Receive shipment updates and notifications',
                    'Save your addresses for faster future shipping',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}

          {/* Login Form */}
          {mode === 'login' && (
            <motion.div key="login" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-fedex-purple p-6 text-white">
                <button onClick={() => { setMode('choice'); setError(''); }} className="text-purple-200 hover:text-white text-sm mb-3 flex items-center gap-1 transition-colors">
                  ← Back
                </button>
                <h2 className="text-2xl font-heading font-bold">Welcome back!</h2>
                <p className="text-purple-200 text-sm mt-1">Log in to continue shipping</p>
              </div>
              <div className="p-8">
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}
                <form onSubmit={handleLogin} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email address</label>
                    <input type="email" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fedex-purple focus:border-fedex-purple outline-none transition-all" placeholder="you@example.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                    <input type="password" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fedex-purple focus:border-fedex-purple outline-none transition-all" placeholder="••••••••" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                    <div className="text-right mt-2">
                      <Link to="/forgot-password" className="text-xs text-fedex-purple hover:text-fedex-orange transition-colors">Forgot password?</Link>
                    </div>
                  </div>
                  <button type="submit" disabled={isLoading} className="w-full bg-fedex-purple hover:bg-purple-900 text-white py-3 rounded-lg font-bold transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
                    {isLoading ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Logging in...</> : <><LogIn className="w-5 h-5" /> Log In & Continue</>}
                  </button>
                </form>
                <p className="text-center text-sm text-gray-500 mt-6">
                  Don't have an account?{' '}
                  <button onClick={() => { setMode('signup'); setError(''); }} className="text-fedex-orange font-semibold hover:underline">Sign up free</button>
                </p>
              </div>
            </motion.div>
          )}

          {/* Signup Form */}
          {mode === 'signup' && (
            <motion.div key="signup" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-fedex-orange p-6 text-white">
                <button onClick={() => { setMode('choice'); setError(''); }} className="text-orange-100 hover:text-white text-sm mb-3 flex items-center gap-1 transition-colors">
                  ← Back
                </button>
                <h2 className="text-2xl font-heading font-bold">Create your account</h2>
                <p className="text-orange-100 text-sm mt-1">Free forever — no credit card needed</p>
              </div>
              <div className="p-8">
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}
                <form onSubmit={handleSignup} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                    <input type="text" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fedex-orange focus:border-fedex-orange outline-none transition-all" placeholder="John Doe" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email address</label>
                    <input type="email" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fedex-orange focus:border-fedex-orange outline-none transition-all" placeholder="you@example.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                    <input type="password" required minLength={8} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fedex-orange focus:border-fedex-orange outline-none transition-all" placeholder="At least 8 characters" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
                    <input type="password" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fedex-orange focus:border-fedex-orange outline-none transition-all" placeholder="••••••••" value={formData.confirmPassword} onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })} />
                  </div>
                  <button type="submit" disabled={isLoading} className="w-full bg-fedex-orange hover:bg-orange-600 text-white py-3 rounded-lg font-bold transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
                    {isLoading ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Creating account...</> : <><UserPlus className="w-5 h-5" /> Create Account & Continue</>}
                  </button>
                </form>
                <p className="text-center text-sm text-gray-500 mt-6">
                  Already have an account?{' '}
                  <button onClick={() => { setMode('login'); setError(''); }} className="text-fedex-purple font-semibold hover:underline">Log in</button>
                </p>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Main Ship Page ───────────────────────────────────────────────────────────
export default function Ship() {
  const { isLoggedIn, token } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ from: '', to: '', weight: '', service: 'ground' });
  const [quote, setQuote] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [trackingResult, setTrackingResult] = useState<string | null>(null);

  // Show auth gate if not logged in
  if (!isLoggedIn) return <AuthGate />;

  const steps = [
    { id: 1, name: 'Addresses', icon: <MapPin className="w-5 h-5" /> },
    { id: 2, name: 'Package', icon: <Package className="w-5 h-5" /> },
    { id: 3, name: 'Service', icon: <Truck className="w-5 h-5" /> },
    { id: 4, name: 'Review & Pay', icon: <CreditCard className="w-5 h-5" /> },
  ];

  const handleGetQuote = async () => {
    setIsLoading(true); setError('');
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) { setQuote(data.price); setStep(4); }
      else setError(data.message || 'Could not get a quote. Please try again.');
    } catch { setError('Connection error. Please try again.'); }
    finally { setIsLoading(false); }
  };

  const handleFinalSubmit = async () => {
    setIsLoading(true); setError('');
    try {
      const res = await fetch('/api/ship/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ...formData, price: quote }),
      });
      const data = await res.json();
      if (data.success) setTrackingResult(data.trackingNumber);
      else setError(data.message || 'Could not create shipment. Please try again.');
    } catch { setError('Connection error. Please try again.'); }
    finally { setIsLoading(false); }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    if (step === 3) handleGetQuote();
    else if (step === 4) handleFinalSubmit();
    else setStep(s => Math.min(s + 1, 4));
  };

  // Success screen
  if (trackingResult) {
    return (
      <div className="bg-fedex-light min-h-screen pt-24 pb-20 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-md mx-4">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h2 className="text-3xl font-heading font-bold text-fedex-dark mb-3">Shipment Created!</h2>
          <p className="text-gray-600 mb-4">Your tracking number is:</p>
          <div className="bg-fedex-light rounded-xl p-4 mb-4">
            <p className="text-2xl font-mono font-bold text-fedex-purple">{trackingResult}</p>
          </div>
          <p className="text-sm text-gray-500 mb-8">Save this number to track your package at any time.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to={`/track?number=${trackingResult}`} className="bg-fedex-orange text-white px-6 py-3 rounded-lg font-bold hover:bg-orange-600 transition-colors">
              Track Package
            </Link>
            <Link to="/dashboard" className="bg-fedex-purple text-white px-6 py-3 rounded-lg font-bold hover:bg-purple-900 transition-colors">
              My Dashboard
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-fedex-light min-h-screen pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-12">
          <h1 className="text-4xl font-heading font-bold text-fedex-dark mb-4">Ship a Package</h1>
          <p className="text-lg text-gray-600">Create your shipment in just a few easy steps.</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-1/2 h-1 bg-gray-200 -z-10 transform -translate-y-1/2"></div>
            <div className="absolute left-0 top-1/2 h-1 bg-fedex-orange -z-10 transform -translate-y-1/2 transition-all duration-500" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
            {steps.map(s => (
              <div key={s.id} className="flex flex-col items-center gap-2">
                <div className={clsx('w-12 h-12 rounded-full flex items-center justify-center border-4 border-white transition-colors duration-300', step > s.id ? 'bg-fedex-orange text-white' : step === s.id ? 'bg-fedex-purple text-white' : 'bg-gray-200 text-gray-400')}>
                  {step > s.id ? <Check className="w-6 h-6" /> : s.icon}
                </div>
                <span className={clsx('text-sm font-semibold hidden sm:block', step >= s.id ? 'text-fedex-dark' : 'text-gray-400')}>{s.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-700">{error}</p>
          </motion.div>
        )}

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <form onSubmit={handleSubmit}>
            <div className="p-8 md:p-12">

              {/* Step 1 */}
              {step === 1 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <h2 className="text-2xl font-bold text-fedex-dark mb-6">Where are you shipping?</h2>
                  <div className="space-y-6">
                    {[{ label: 'From (Origin)', key: 'from', placeholder: 'e.g. London, UK' }, { label: 'To (Destination)', key: 'to', placeholder: 'e.g. New York, USA' }].map(f => (
                      <div key={f.key}>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">{f.label}</label>
                        <input type="text" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fedex-orange focus:border-fedex-orange outline-none transition-all" placeholder={f.placeholder} value={formData[f.key as 'from' | 'to']} onChange={e => setFormData({ ...formData, [f.key]: e.target.value })} />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <h2 className="text-2xl font-bold text-fedex-dark mb-6">Package Details</h2>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Weight (lbs)</label>
                    <input type="number" required min="0.1" step="0.1" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fedex-orange outline-none transition-all" placeholder="e.g. 5.5" value={formData.weight} onChange={e => setFormData({ ...formData, weight: e.target.value })} />
                    <p className="text-sm text-gray-400 mt-2">Enter the total weight of your package in pounds.</p>
                  </div>
                </motion.div>
              )}

              {/* Step 3 */}
              {step === 3 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <h2 className="text-2xl font-bold text-fedex-dark mb-6">Select Service</h2>
                  <div className="space-y-4">
                    {[
                      { id: 'ground', label: 'Ground Delivery', desc: '1-5 business days — most affordable', price: 'From $15' },
                      { id: 'express', label: 'Express Shipping', desc: 'Next business day — fast and reliable', price: 'From $30' },
                      { id: 'same-day', label: 'Same Day Delivery', desc: 'Delivered today — for urgent packages', price: 'From $45' },
                    ].map(srv => (
                      <label key={srv.id} className={clsx('flex items-center p-5 border-2 rounded-xl cursor-pointer transition-all', formData.service === srv.id ? 'border-fedex-orange bg-orange-50' : 'border-gray-200 hover:border-fedex-orange/50')}>
                        <input type="radio" name="service" value={srv.id} checked={formData.service === srv.id} onChange={e => setFormData({ ...formData, service: e.target.value })} className="w-5 h-5 text-fedex-orange" />
                        <div className="ml-4 flex-grow">
                          <span className="block text-lg font-bold text-fedex-dark">{srv.label}</span>
                          <span className="block text-sm text-gray-500">{srv.desc}</span>
                        </div>
                        <span className="text-fedex-orange font-bold text-sm">{srv.price}</span>
                      </label>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 4 */}
              {step === 4 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <h2 className="text-2xl font-bold text-fedex-dark mb-6">Review & Confirm</h2>
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-6">
                    <h3 className="font-bold text-lg mb-4 border-b pb-3">Shipment Summary</h3>
                    <div className="space-y-3 text-sm">
                      {[['From', formData.from], ['To', formData.to], ['Weight', `${formData.weight} lbs`], ['Service', formData.service.replace('-', ' ')]].map(([k, v]) => (
                        <div key={k} className="flex justify-between">
                          <span className="text-gray-500 capitalize">{k}</span>
                          <span className="font-semibold text-gray-800 capitalize">{v}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 pt-4 border-t flex justify-between items-center">
                      <span className="text-lg font-bold text-fedex-dark">Total Cost</span>
                      <span className="text-3xl font-bold text-fedex-orange">${quote}</span>
                    </div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-blue-800 text-sm">
                    <p className="font-semibold mb-1">📦 Demo Mode</p>
                    <p>Click <strong>"Confirm & Ship"</strong> to create your shipment and get a real tracking number.</p>
                  </div>
                </motion.div>
              )}

            </div>

            {/* Footer Buttons */}
            <div className="bg-gray-50 px-8 py-6 border-t flex justify-between items-center">
              {step > 1 ? (
                <button type="button" onClick={() => { setStep(s => s - 1); setError(''); }} className="px-6 py-3 text-gray-600 font-semibold hover:text-fedex-dark transition-colors">
                  ← Back
                </button>
              ) : <div />}
              <button type="submit" disabled={isLoading} className="bg-fedex-purple hover:bg-purple-900 text-white px-8 py-3 rounded-lg font-bold transition-colors flex items-center gap-2 disabled:opacity-70">
                {isLoading ? (
                  <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Processing...</>
                ) : step === 4 ? 'Confirm & Ship' : step === 3 ? 'Get Quote' : <>Continue <ChevronRight className="w-5 h-5" /></>}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
