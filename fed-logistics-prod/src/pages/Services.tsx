import { Truck, Zap, Globe, Package, Shield, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'

const services = [
  { icon: <Truck className="w-8 h-8 text-fl-orange" />, title: 'Ground Delivery', desc: '1–5 business days. Most affordable option for non-urgent packages.', price: 'From $15' },
  { icon: <Zap className="w-8 h-8 text-fl-orange" />, title: 'Express Shipping', desc: 'Next business day delivery. Fast and reliable for urgent packages.', price: 'From $30' },
  { icon: <Clock className="w-8 h-8 text-fl-orange" />, title: 'Same Day Delivery', desc: 'Delivered the same day. For time-critical shipments.', price: 'From $45' },
  { icon: <Globe className="w-8 h-8 text-fl-orange" />, title: 'International', desc: 'Worldwide shipping to 200+ countries with full tracking.', price: 'From $25' },
  { icon: <Package className="w-8 h-8 text-fl-orange" />, title: 'Freight Services', desc: 'Large and heavy shipments handled with care.', price: 'Custom quote' },
  { icon: <Shield className="w-8 h-8 text-fl-orange" />, title: 'Insured Shipping', desc: 'Full insurance coverage for valuable or fragile items.', price: '+2% of value' },
]

export default function Services() {
  return (
    <div className="min-h-screen bg-fl-light pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-heading font-bold text-fl-dark mb-3">Our Services</h1>
          <p className="text-gray-500 max-w-xl mx-auto">From same-day local delivery to international freight — we have the right service for every shipment.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {services.map(s => (
            <div key={s.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="w-14 h-14 bg-orange-50 rounded-xl flex items-center justify-center mb-4">{s.icon}</div>
              <h3 className="font-bold text-fl-dark text-lg mb-2">{s.title}</h3>
              <p className="text-sm text-gray-500 mb-4 leading-relaxed">{s.desc}</p>
              <p className="text-fl-orange font-bold text-sm">{s.price}</p>
            </div>
          ))}
        </div>
        <div className="bg-fl-purple rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-heading font-bold mb-3">Ready to ship?</h2>
          <p className="text-gray-200 mb-6">Get an instant quote and create your shipment in minutes.</p>
          <Link to="/ship" className="inline-block bg-fl-orange hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-bold transition">Start Shipping Now</Link>
        </div>
      </div>
    </div>
  )
}
