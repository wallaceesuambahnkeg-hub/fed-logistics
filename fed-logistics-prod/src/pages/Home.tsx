import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Package, Truck, Globe, Shield, Search, ArrowRight, CheckCircle } from 'lucide-react'

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
      <section className="relative bg-fl-purple text-white pt-32 pb-24 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-40 bg-cover bg-center" style={{ backgroundImage: "url('https://bidmoncorp.com/images/about-hero.jpg')" }}></div>
        <div className="absolute inset-0 bg-fl-purple/70"></div>
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-block bg-fl-orange/20 border border-fl-orange/40 text-fl-orange text-sm font-semibold px-4 py-1.5 rounded-full mb-6">🇬🇧 UK Headquarters — Global Reach</div>
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6 leading-tight">
            Ship Anywhere.<br /><span className="text-fl-orange">Track Everything.</span>
          </h1>
          <p className="text-xl text-gray-200 mb-10 max-w-2xl mx-auto">Fast, reliable logistics from London to the world. Get instant quotes, real tracking numbers and full shipment management.</p>
          <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto mb-8">
            <input
              type="text" value={tracking} onChange={e => setTracking(e.target.value)}
              placeholder="Enter tracking number..."
              className="flex-grow px-5 py-4 rounded-xl text-gray-900 outline-none text-base font-medium"
            />
            <button type="submit" className="bg-fl-orange hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 justify-center transition">
              <Search className="w-5 h-5" /> Track
            </button>
          </form>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/ship" className="bg-white text-fl-purple px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition flex items-center gap-2 justify-center">
              <Package className="w-5 h-5" /> Ship a Package
            </Link>
            <Link to="/services" className="border-2 border-white/40 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition flex items-center gap-2 justify-center">
              Our Services <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-12 px-4 border-b">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[['200+', 'Countries Served'], ['500K+', 'Packages Delivered'], ['99.9%', 'On-Time Rate'], ['24/7', 'Customer Support']].map(([n, l]) => (
            <div key={l}>
              <p className="text-3xl font-heading font-bold text-fl-purple">{n}</p>
              <p className="text-gray-500 text-sm mt-1">{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-fl-light">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-heading font-bold text-fl-dark mb-4">Why Choose Fed Logistics?</h2>
            <p className="text-gray-500 max-w-xl mx-auto">We combine technology with reliability to deliver the best shipping experience.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Truck className="w-8 h-8 text-fl-orange" />, title: 'Fast Delivery', desc: 'Same day, express and ground shipping options for every need.' },
              { icon: <Globe className="w-8 h-8 text-fl-orange" />, title: 'Global Network', desc: 'Delivery to 200+ countries with real-time tracking worldwide.' },
              { icon: <Shield className="w-8 h-8 text-fl-orange" />, title: 'Fully Insured', desc: 'Every shipment is fully insured and handled with care.' },
              { icon: <CheckCircle className="w-8 h-8 text-fl-orange" />, title: 'Live Tracking', desc: 'Track your package at every step from pickup to delivery.' },
            ].map(f => (
              <div key={f.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center hover:shadow-md transition">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-orange-50 rounded-full mb-4">{f.icon}</div>
                <h3 className="font-bold text-fl-dark mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-fl-purple py-20 px-4 text-center text-white">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-heading font-bold mb-4">Ready to Ship?</h2>
          <p className="text-gray-200 mb-8">Create a free account and start shipping in minutes. Get a real tracking number instantly.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/signup" className="bg-fl-orange hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-bold transition">Get Started Free</Link>
            <Link to="/contact" className="border-2 border-white/40 hover:bg-white/10 text-white px-8 py-4 rounded-xl font-bold transition">Contact Us</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
