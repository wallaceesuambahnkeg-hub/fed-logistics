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
    <div className="w-full">
      {/* Hero */}
      <section className="relative text-white pt-32 pb-20 px-4 overflow-hidden min-h-[320px] flex items-center">
        <img src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?q=80&w=1920&auto=format&fit=crop" alt="Contact" className="absolute inset-0 w-full h-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-fl-purple/90"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <p className="text-fl-orange font-bold text-sm uppercase tracking-widest mb-3">Get In Touch</p>
          <h1 className="text-5xl font-heading font-black mb-4">Contact Us</h1>
          <p className="text-xl text-gray-200">Our team responds within 2–4 business hours. For urgent matters, call us directly.</p>
        </div>
      </section>

      <div className="bg-fl-light py-20 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Contact Info */}
          <div className="space-y-5">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-heading font-black text-fl-dark text-lg mb-4">Head Office</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-orange-50 rounded-full flex items-center justify-center flex-shrink-0"><MapPin className="w-4 h-4 text-fl-orange" /></div>
                  <div><p className="font-bold text-gray-800 text-sm">Address</p><p className="text-gray-500 text-sm">1 Canada Square, Canary Wharf<br />London, E14 5AB, UK</p></div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-orange-50 rounded-full flex items-center justify-center flex-shrink-0"><Phone className="w-4 h-4 text-fl-orange" /></div>
                  <div><p className="font-bold text-gray-800 text-sm">Phone</p><a href="tel:+447735380906" className="text-gray-500 text-sm hover:text-fl-orange">+44 7735 380906</a></div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-orange-50 rounded-full flex items-center justify-center flex-shrink-0"><Mail className="w-4 h-4 text-fl-orange" /></div>
                  <div><p className="font-bold text-gray-800 text-sm">Email</p><p className="text-gray-500 text-sm">info@fedlogisticscorp.com</p><p className="text-gray-500 text-sm">support@fedlogisticscorp.com</p></div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-orange-50 rounded-full flex items-center justify-center flex-shrink-0"><Clock className="w-4 h-4 text-fl-orange" /></div>
                  <div><p className="font-bold text-gray-800 text-sm">Hours</p><p className="text-gray-500 text-sm">Mon–Fri: 8am–8pm GMT<br />Sat: 9am–5pm GMT</p></div>
                </div>
              </div>
            </div>

            <div className="bg-fl-purple rounded-2xl p-6 text-white">
              <h3 className="font-bold text-lg mb-2">Urgent Shipment?</h3>
              <p className="text-purple-200 text-sm mb-4">Call us directly for same-day and emergency freight arrangements.</p>
              <a href="tel:+447735380906" className="block w-full bg-fl-orange hover:bg-orange-500 text-white text-center py-3 rounded-xl font-bold transition">📞 Call Now</a>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-bold text-fl-dark mb-3 text-sm">Response Times</h3>
              <div className="space-y-2 text-sm">
                {[['General Enquiry', '2–4 hours'], ['Quote Request', '1–2 hours'], ['Urgent Freight', '30 minutes'], ['Technical Support', '1 hour']].map(([t, r]) => (
                  <div key={t} className="flex justify-between"><span className="text-gray-500">{t}</span><span className="font-bold text-fl-orange">{r}</span></div>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-heading font-black text-fl-dark mb-2">Send a Message</h2>
            <p className="text-gray-500 text-sm mb-6">Fill in the form and our team will get back to you promptly.</p>

            {status === 'success' && <div className="flex items-center gap-3 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg mb-6"><CheckCircle className="w-5 h-5 text-green-500" /><p className="text-green-700 text-sm font-medium">Message sent! We'll get back to you within 2–4 hours.</p></div>}
            {status === 'error' && <div className="flex items-center gap-3 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6"><AlertCircle className="w-5 h-5 text-red-500" /><p className="text-red-700 text-sm">Something went wrong. Please try again or call us directly.</p></div>}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div><label className="block text-sm font-bold text-gray-700 mb-2">Full Name *</label><input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="John Doe" className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-fl-orange transition" /></div>
                <div><label className="block text-sm font-bold text-gray-700 mb-2">Email Address *</label><input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-fl-orange transition" /></div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Subject *</label>
                <select required value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white outline-none focus:ring-2 focus:ring-fl-orange transition">
                  <option value="">Select a subject</option>
                  <option>Request a Quote</option><option>Air Freight Enquiry</option><option>Sea Freight Enquiry</option><option>Cargo Transport Enquiry</option><option>Warehousing Enquiry</option><option>Tracking Issue</option><option>Government Contract Enquiry</option><option>General Support</option>
                </select>
              </div>
              <div><label className="block text-sm font-bold text-gray-700 mb-2">Message *</label><textarea required rows={6} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Tell us about your logistics needs..." className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-fl-orange transition resize-none"></textarea></div>
              <button type="submit" disabled={loading} className="w-full bg-fl-purple hover:bg-purple-900 text-white py-4 rounded-xl font-bold transition disabled:opacity-60 flex items-center justify-center gap-2 text-base">
                {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : <Send className="w-4 h-4" />}
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>

        {/* Map */}
        <div className="max-w-6xl mx-auto mt-8 rounded-2xl overflow-hidden shadow-sm border border-gray-200 h-80">
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2482.2554151618!2d-0.02176902317757812!3d51.50444101011!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487602b9a1b4aaab%3A0x1cbfc254e61c7d0!2s1%20Canada%20Square%2C%20London%20E14%205AB!5e0!3m2!1sen!2suk!4v1709644800000!5m2!1sen!2suk" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" title="Fed Logistics HQ"></iframe>
        </div>
      </div>
    </div>
  )
}
