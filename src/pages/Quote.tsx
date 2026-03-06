import { useState, FormEvent } from 'react'
import { Package, MapPin, Truck, CheckCircle, AlertCircle } from 'lucide-react'

export default function Quote() {
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', from: '', to: '', weight: '', service: 'ground', description: '', urgency: 'standard' })
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault(); setLoading(true); setError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, subject: `Quote Request from ${form.company || form.name}`, message: `Company: ${form.company}\nPhone: ${form.phone}\nFrom: ${form.from}\nTo: ${form.to}\nWeight: ${form.weight}\nService: ${form.service}\nUrgency: ${form.urgency}\nDescription: ${form.description}` })
      })
      const data = await res.json()
      if (data.success) setDone(true)
      else setError(data.message || 'Something went wrong')
    } catch { setError('Connection error. Please try again.') }
    finally { setLoading(false) }
  }

  if (done) return (
    <div className="min-h-screen bg-fl-light pt-24 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-md">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-fl-dark mb-2">Quote Request Received!</h2>
        <p className="text-gray-500 mb-2">Thank you for contacting Fed Logistics.</p>
        <p className="text-gray-500 text-sm">Our team will review your requirements and get back to you within <strong>2–4 business hours</strong>.</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-fl-light pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-fl-orange font-semibold text-sm uppercase tracking-wider mb-2">Get a Quote</p>
          <h1 className="text-3xl font-heading font-bold text-fl-dark mb-3">Request a Logistics Quote</h1>
          <p className="text-gray-500">Fill in the form below and our team will respond within 2–4 business hours.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {error && <div className="flex items-center gap-3 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6"><AlertCircle className="w-5 h-5 text-red-500" /><p className="text-red-700 text-sm">{error}</p></div>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className="font-bold text-fl-dark mb-4 flex items-center gap-2"><Package className="w-5 h-5 text-fl-orange" /> Contact Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'Full Name *', key: 'name', type: 'text', ph: 'John Doe', req: true },
                  { label: 'Company / Agency', key: 'company', type: 'text', ph: 'Fed Agency or Company Ltd', req: false },
                  { label: 'Email Address *', key: 'email', type: 'email', ph: 'you@example.com', req: true },
                  { label: 'Phone Number', key: 'phone', type: 'tel', ph: '+44 7700 000000', req: false },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{f.label}</label>
                    <input type={f.type} required={f.req} value={(form as any)[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} placeholder={f.ph} className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-fl-orange transition" />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-fl-dark mb-4 flex items-center gap-2"><MapPin className="w-5 h-5 text-fl-orange" /> Shipment Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold text-gray-700 mb-2">Origin *</label><input type="text" required value={form.from} onChange={e => setForm({ ...form, from: e.target.value })} placeholder="e.g. London, UK" className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-fl-orange transition" /></div>
                <div><label className="block text-sm font-semibold text-gray-700 mb-2">Destination *</label><input type="text" required value={form.to} onChange={e => setForm({ ...form, to: e.target.value })} placeholder="e.g. New York, USA" className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-fl-orange transition" /></div>
                <div><label className="block text-sm font-semibold text-gray-700 mb-2">Estimated Weight</label><input type="text" value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })} placeholder="e.g. 50kg or 200lbs" className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-fl-orange transition" /></div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Service Type</label>
                  <select value={form.service} onChange={e => setForm({ ...form, service: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white outline-none focus:ring-2 focus:ring-fl-orange transition">
                    <option value="ground">Ground Delivery</option>
                    <option value="express">Express (Next Day)</option>
                    <option value="same-day">Same Day</option>
                    <option value="international">International Freight</option>
                    <option value="supply-chain">Supply Chain Management</option>
                    <option value="other">Other / Not Sure</option>
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Cargo Description</label>
                <textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe the cargo, any special handling requirements, hazmat, temperature control, etc." className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-fl-orange transition resize-none"></textarea>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-fl-purple hover:bg-purple-900 text-white py-4 rounded-xl font-bold transition disabled:opacity-60 flex items-center justify-center gap-2">
              {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
              {loading ? 'Submitting...' : 'Submit Quote Request'}
            </button>
            <p className="text-xs text-gray-400 text-center">We respond within 2–4 business hours. For urgent requests call +44 7735 380906.</p>
          </form>
        </div>
      </div>
    </div>
  )
}
