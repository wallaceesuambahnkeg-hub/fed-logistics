import React, { useState } from 'react';
import { Check, ChevronRight, Package, MapPin, CreditCard, Truck, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { clsx } from 'clsx';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Ship() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ from: '', to: '', weight: '', service: 'ground' });
  const [quote, setQuote] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [trackingResult, setTrackingResult] = useState<string | null>(null);
  const { token } = useAuth();

  const steps = [
    { id: 1, name: 'Addresses', icon: <MapPin className="w-5 h-5" /> },
    { id: 2, name: 'Package', icon: <Package className="w-5 h-5" /> },
    { id: 3, name: 'Service', icon: <Truck className="w-5 h-5" /> },
    { id: 4, name: 'Review & Pay', icon: <CreditCard className="w-5 h-5" /> },
  ];

  const handleGetQuote = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/quote', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
      const data = await res.json();
      if (data.success) { setQuote(data.price); setStep(4); }
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };

  const handleFinalSubmit = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/ship/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ...formData, price: quote }),
      });
      const data = await res.json();
      if (data.success) setTrackingResult(data.trackingNumber);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 3) handleGetQuote();
    else if (step === 4) handleFinalSubmit();
    else setStep(s => Math.min(s + 1, 4));
  };

  if (trackingResult) {
    return (
      <div className="bg-fedex-light min-h-screen pt-24 pb-20 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-md mx-4">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h2 className="text-3xl font-heading font-bold text-fedex-dark mb-3">Shipment Created!</h2>
          <p className="text-gray-600 mb-6">Your tracking number is:</p>
          <div className="bg-fedex-light rounded-xl p-4 mb-8">
            <p className="text-2xl font-mono font-bold text-fedex-purple">{trackingResult}</p>
          </div>
          <div className="flex gap-4 justify-center">
            <Link to={`/track?number=${trackingResult}`} className="bg-fedex-orange text-white px-6 py-3 rounded-lg font-bold hover:bg-orange-600 transition-colors">Track Package</Link>
            <Link to="/dashboard" className="bg-fedex-purple text-white px-6 py-3 rounded-lg font-bold hover:bg-purple-900 transition-colors">Dashboard</Link>
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

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <form onSubmit={handleSubmit}>
            <div className="p-8 md:p-12">
              {step === 1 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <h2 className="text-2xl font-bold text-fedex-dark mb-6">Where are you shipping?</h2>
                  <div className="space-y-6">
                    {[{ label: 'From (Origin)', key: 'from' }, { label: 'To (Destination)', key: 'to' }].map(f => (
                      <div key={f.key}>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">{f.label}</label>
                        <input type="text" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fedex-orange focus:border-fedex-orange outline-none transition-all" placeholder="City, State or Country" value={formData[f.key as 'from' | 'to']} onChange={e => setFormData({ ...formData, [f.key]: e.target.value })} />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
              {step === 2 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <h2 className="text-2xl font-bold text-fedex-dark mb-6">Package Details</h2>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Weight (lbs)</label>
                    <input type="number" required min="0.1" step="0.1" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fedex-orange outline-none transition-all" placeholder="e.g. 5.5" value={formData.weight} onChange={e => setFormData({ ...formData, weight: e.target.value })} />
                  </div>
                </motion.div>
              )}
              {step === 3 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <h2 className="text-2xl font-bold text-fedex-dark mb-6">Select Service</h2>
                  <div className="space-y-4">
                    {[{ id: 'ground', label: 'Ground', desc: '1-5 business days' }, { id: 'express', label: 'Express', desc: 'Next business day' }, { id: 'same-day', label: 'Same Day', desc: 'Delivered today' }].map(srv => (
                      <label key={srv.id} className={clsx('flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all', formData.service === srv.id ? 'border-fedex-orange bg-orange-50' : 'border-gray-200 hover:border-fedex-orange/50')}>
                        <input type="radio" name="service" value={srv.id} checked={formData.service === srv.id} onChange={e => setFormData({ ...formData, service: e.target.value })} className="w-5 h-5 text-fedex-orange" />
                        <div className="ml-4">
                          <span className="block text-lg font-bold text-fedex-dark">{srv.label}</span>
                          <span className="block text-sm text-gray-500">{srv.desc}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </motion.div>
              )}
              {step === 4 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <h2 className="text-2xl font-bold text-fedex-dark mb-6">Review & Confirm</h2>
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-8">
                    <h3 className="font-bold text-lg mb-4 border-b pb-2">Shipment Summary</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {[['From', formData.from], ['To', formData.to], ['Weight', `${formData.weight} lbs`], ['Service', formData.service.replace('-', ' ')]].map(([k, v]) => (
                        <><div className="text-gray-500 capitalize">{k}:</div><div className="font-semibold text-right capitalize">{v}</div></>
                      ))}
                    </div>
                    <div className="mt-6 pt-4 border-t flex justify-between items-center">
                      <span className="text-lg font-bold text-fedex-dark">Total Cost</span>
                      <span className="text-3xl font-bold text-fedex-orange">${quote}</span>
                    </div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-blue-800 text-sm">
                    <p className="font-semibold mb-1">Demo Mode</p>
                    <p>Click "Confirm & Ship" to create your shipment and receive a real tracking number. (No actual payment processed in demo.)</p>
                  </div>
                </motion.div>
              )}
            </div>
            <div className="bg-gray-50 px-8 py-6 border-t flex justify-between items-center">
              {step > 1 ? (
                <button type="button" onClick={() => setStep(s => s - 1)} className="px-6 py-3 text-gray-600 font-semibold hover:text-fedex-dark transition-colors">Back</button>
              ) : <div />}
              <button type="submit" disabled={isLoading} className="bg-fedex-purple hover:bg-purple-900 text-white px-8 py-3 rounded-lg font-bold transition-colors flex items-center gap-2 disabled:opacity-70">
                {isLoading ? 'Processing...' : step === 4 ? 'Confirm & Ship' : step === 3 ? 'Get Quote' : 'Continue'}
                {!isLoading && step < 4 && <ChevronRight className="w-5 h-5" />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
