import { useState, FormEvent } from 'react'
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, AlertCircle } from 'lucide-react'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault(); setLoading(true)
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await res.json()
      if (data.success) { setStatus('success'); setForm({ name: '', email: '', subject: '', message: '' }) }
      else setStatus('error')
    } catch { setStatus('error') } finally { setLoading(false) }
  }

  return (
    <div className="bg-fl-light min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-heading font-bold text-fl-dark mb-3">Get in Touch</h1>
          <p className="text-gray-500 max-w-xl mx-auto">Have a question or need help with a shipment? We're here to help.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-5">
            {[
              { icon: <MapPin className="w-5 h-5 text-fl-orange" />, title: 'Headquarters', text: '1 Canada Square\nCanary Wharf, London\nE14 5AB, UK' },
              { icon: <Phone className="w-5 h-5 text-fl-orange" />, title: 'Phone', text: '+44 7735 380906' },
              { icon: <Mail className="w-5 h-5 text-fl-orange" />, title: 'Email', text: 'support@fedlogistics.com' },
              { icon: <Clock className="w-5 h-5 text-fl-orange" />, title: 'Hours', text: 'Mon–Fri: 8am–8pm\nSat: 9am–5pm' },
            ].map(i => (
              <div key={i.title} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-start gap-4">
                <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center flex-shrink-0">{i.icon}</div>
                <div><p className="font-bold text-gray-800 text-sm">{i.title}</p><p className="text-gray-500 text-sm mt-0.5 whitespace-pre-line">{i.text}</p></div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl font-bold text-fl-dark mb-6">Send a Message</h2>
            {status === 'success' && <div className="flex items-center gap-3 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg mb-5"><CheckCircle className="w-5 h-5 text-green-500" /><p className="text-green-700 text-sm font-medium">Message sent! We'll get back to you soon.</p></div>}
            {status === 'error' && <div className="flex items-center gap-3 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-5"><AlertCircle className="w-5 h-5 text-red-500" /><p className="text-red-700 text-sm">Something went wrong. Please try again.</p></div>}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div><label className="block text-sm font-semibold text-gray-700 mb-2">Name</label><input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="John Doe" className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-fl-orange transition" /></div>
                <div><label className="block text-sm font-semibold text-gray-700 mb-2">Email</label><input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-fl-orange transition" /></div>
              </div>
              <div><label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                <select required value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white outline-none focus:ring-2 focus:ring-fl-orange transition">
                  <option value="">Select a subject</option>
                  <option>Tracking Issue</option><option>Request a Quote</option><option>Billing Inquiry</option><option>General Support</option><option>Other</option>
                </select>
              </div>
              <div><label className="block text-sm font-semibold text-gray-700 mb-2">Message</label><textarea required rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="How can we help you?" className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-fl-orange transition resize-none"></textarea></div>
              <button type="submit" disabled={loading} className="bg-fl-purple hover:bg-purple-900 text-white px-8 py-3 rounded-xl font-bold transition disabled:opacity-60 flex items-center gap-2">
                {loading ? 'Sending...' : <><Send className="w-4 h-4" /> Send Message</>}
              </button>
            </form>
          </div>
        </div>

        {/* Map */}
        <div className="mt-10 rounded-2xl overflow-hidden shadow-sm border border-gray-200 h-80">
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2482.2554151618!2d-0.02176902317757812!3d51.50444101011!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487602b9a1b4aaab%3A0x1cbfc254e61c7d0!2s1%20Canada%20Square%2C%20London%20E14%205AB!5e0!3m2!1sen!2suk!4v1709644800000!5m2!1sen!2suk" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" title="Fed Logistics HQ"></iframe>
        </div>
      </div>
    </div>
  )
}
