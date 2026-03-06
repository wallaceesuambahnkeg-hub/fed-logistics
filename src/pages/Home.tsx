import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Package, Truck, Globe, Shield, Search, ArrowRight, CheckCircle, Star, Award, Users, Clock } from 'lucide-react'

export default function Home() {
  const [tracking, setTracking] = useState('')
  const navigate = useNavigate()

  function handleTrack(e: FormEvent) {
    e.preventDefault()
    if (tracking.trim()) navigate(`/track?number=${tracking.trim()}`)
  }

  return (
    <div className="w-full">

      {/* Hero */}
      <section className="relative bg-fl-purple text-white pt-32 pb-28 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: "url('https://bidmoncorp.com/images/about-hero.jpg')" }}></div>
        <div className="absolute inset-0 bg-gradient-to-br from-fl-purple via-fl-purple/90 to-purple-900"></div>
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-fl-orange/20 border border-fl-orange/40 text-fl-orange text-sm font-semibold px-4 py-2 rounded-full mb-6">
                <Award className="w-4 h-4" /> Trusted Federal & Commercial Logistics Partner
              </div>
              <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6 leading-tight">
                Logistics Solutions<br />
                <span className="text-fl-orange">Built for Government</span><br />
                & Enterprise
              </h1>
              <p className="text-xl text-gray-200 mb-8 max-w-xl">Fed Logistics delivers end-to-end supply chain management, freight coordination and last-mile delivery for federal agencies and commercial clients across the USA and worldwide.</p>
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link to="/quote" className="bg-fl-orange hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 justify-center transition shadow-lg">
                  <Package className="w-5 h-5" /> Request a Quote
                </Link>
                <Link to="/capabilities" className="border-2 border-white/40 hover:bg-white/10 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 justify-center transition">
                  Capabilities Statement <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
              {/* Trust badges */}
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                {['SSL Secured', 'HTTPS Encrypted', 'Federal Compliant', 'Insured & Bonded'].map(b => (
                  <div key={b} className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full text-xs font-semibold text-gray-200">
                    <CheckCircle className="w-3.5 h-3.5 text-green-400" /> {b}
                  </div>
                ))}
              </div>
            </div>
            {/* Track widget */}
            <div className="w-full lg:w-96 bg-white rounded-2xl shadow-2xl p-6">
              <h3 className="text-fl-dark font-heading font-bold text-lg mb-1">Track Your Shipment</h3>
              <p className="text-gray-500 text-sm mb-4">Enter your tracking number for live updates</p>
              <form onSubmit={handleTrack} className="space-y-3">
                <input type="text" value={tracking} onChange={e => setTracking(e.target.value)} placeholder="e.g. FL1234567890" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 outline-none focus:border-fl-purple transition font-medium" />
                <button type="submit" className="w-full bg-fl-purple hover:bg-purple-900 text-white py-3 rounded-xl font-bold transition flex items-center justify-center gap-2">
                  <Search className="w-4 h-4" /> Track Package
                </button>
              </form>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400 text-center">Don't have a shipment? <Link to="/ship" className="text-fl-purple font-semibold">Ship now →</Link></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-fl-orange py-8 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
          {[['200+', 'Countries Served'], ['500K+', 'Packages Delivered'], ['15+', 'Years Experience'], ['99.9%', 'On-Time Rate']].map(([n, l]) => (
            <div key={l}><p className="text-3xl font-heading font-bold">{n}</p><p className="text-orange-100 text-sm mt-1">{l}</p></div>
          ))}
        </div>
      </section>

      {/* Services overview */}
      <section className="py-20 px-4 bg-fl-light">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-fl-orange font-semibold text-sm uppercase tracking-wider mb-2">What We Do</p>
            <h2 className="text-3xl font-heading font-bold text-fl-dark mb-4">End-to-End Logistics Services</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">From federal supply chains to commercial freight — we deliver complete logistics solutions tailored to your industry.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Truck className="w-7 h-7 text-fl-orange" />, title: 'Transportation Management', desc: 'Ground, air and sea freight coordination for federal agencies and private sector clients, ensuring compliance with federal logistics standards.' },
              { icon: <Globe className="w-7 h-7 text-fl-orange" />, title: 'International Freight', desc: 'Customs clearance, documentation and delivery to 200+ countries with full real-time tracking at every checkpoint.' },
              { icon: <Package className="w-7 h-7 text-fl-orange" />, title: 'Supply Chain Management', desc: 'End-to-end supply chain visibility, inventory control and last-mile delivery optimization for government and enterprise clients.' },
              { icon: <Clock className="w-7 h-7 text-fl-orange" />, title: 'Express & Same-Day', desc: 'Time-critical shipments handled with precision. Same-day and next-day delivery options with real-time status updates.' },
              { icon: <Shield className="w-7 h-7 text-fl-orange" />, title: 'Secure & Insured Freight', desc: 'Full cargo insurance, secure chain-of-custody and compliance with federal security requirements for sensitive shipments.' },
              { icon: <Users className="w-7 h-7 text-fl-orange" />, title: 'Dedicated Account Management', desc: 'A dedicated logistics manager for every government and enterprise account, available 24/7 for support and escalations.' },
            ].map(s => (
              <div key={s.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-fl-orange/30 transition group">
                <div className="w-14 h-14 bg-orange-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-fl-orange group-hover:text-white transition">{s.icon}</div>
                <h3 className="font-bold text-fl-dark text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/services" className="inline-flex items-center gap-2 bg-fl-purple text-white px-8 py-3 rounded-xl font-bold hover:bg-purple-900 transition">
              View All Services <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-fl-orange font-semibold text-sm uppercase tracking-wider mb-2">Why Fed Logistics</p>
            <h2 className="text-3xl font-heading font-bold text-fl-dark mb-6">A Logistics Partner You Can Trust</h2>
            <div className="space-y-5">
              {[
                { title: 'Federal Contractor Ready', desc: 'Registered and compliant with federal procurement standards. NAICS codes, CAGE code and UEI available on our Capabilities Statement.' },
                { title: 'Real-Time Tracking', desc: 'Every shipment gets a unique tracking number with live status updates from pickup to final delivery.' },
                { title: 'Fully Insured', desc: 'All shipments are fully insured. We are bonded and carry full cargo liability coverage for peace of mind.' },
                { title: '24/7 Support', desc: 'Our logistics team is available around the clock for government and enterprise clients.' },
              ].map(i => (
                <div key={i.title} className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"><CheckCircle className="w-5 h-5 text-green-600" /></div>
                  <div><p className="font-bold text-fl-dark">{i.title}</p><p className="text-sm text-gray-500 mt-0.5">{i.desc}</p></div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-fl-purple rounded-2xl p-6 text-white">
              <h3 className="font-heading font-bold text-xl mb-4">Head Office</h3>
              <div className="space-y-2 text-purple-200 text-sm">
                <p className="text-white font-semibold">Fed Logistics Corp</p>
                <p>1 Canada Square, Canary Wharf</p>
                <p>London, E14 5AB, United Kingdom</p>
                <p className="pt-2">📞 +44 7735 380906</p>
                <p>✉️ info@fedlogisticscorp.com</p>
              </div>
            </div>
            <div className="bg-fl-light rounded-2xl p-6 border border-gray-100">
              <h3 className="font-bold text-fl-dark mb-3">Industries We Serve</h3>
              <div className="flex flex-wrap gap-2">
                {['Federal Government', 'Defence', 'Healthcare', 'E-Commerce', 'Manufacturing', 'Oil & Gas', 'Retail', 'Technology'].map(i => (
                  <span key={i} className="bg-white border border-gray-200 text-gray-600 text-xs px-3 py-1.5 rounded-full font-medium">{i}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-fl-light">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-fl-orange font-semibold text-sm uppercase tracking-wider mb-2">Client Testimonials</p>
            <h2 className="text-3xl font-heading font-bold text-fl-dark">Trusted by Clients Worldwide</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'James Okafor', role: 'Procurement Officer, Federal Agency', text: 'Fed Logistics has been our go-to logistics partner for 3 years. Their compliance with federal standards is impeccable and deliveries are always on time.' },
              { name: 'Sarah Mitchell', role: 'Supply Chain Director, MedTech Corp', text: 'We handle time-sensitive medical equipment. Fed Logistics understands urgency. Their tracking system and account management are best in class.' },
              { name: 'David Chen', role: 'Operations Manager, E-Commerce Ltd', text: 'Switched to Fed Logistics 18 months ago. Our delivery success rate went from 94% to 99.8%. The real-time tracking keeps our customers happy.' },
            ].map(t => (
              <div key={t.name} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex gap-1 mb-4">{[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-fl-orange text-fl-orange" />)}</div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div><p className="font-bold text-fl-dark text-sm">{t.name}</p><p className="text-xs text-gray-400">{t.role}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-fl-purple py-20 px-4 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-heading font-bold mb-4">Ready to Work With Us?</h2>
          <p className="text-gray-200 mb-8">Whether you're a federal agency or a growing business — we have the logistics solution for you.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/quote" className="bg-fl-orange hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-bold transition shadow-lg">Request a Quote</Link>
            <Link to="/capabilities" className="border-2 border-white/40 hover:bg-white/10 text-white px-8 py-4 rounded-xl font-bold transition">View Capabilities</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
