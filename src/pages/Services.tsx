import { Truck, Zap, Globe, Package, Shield, Clock, ArrowRight, CheckCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

const services = [
  {
    icon: <Truck className="w-8 h-8 text-fl-orange" />,
    title: 'Transportation Management',
    desc: 'We coordinate ground, air and sea freight solutions for federal agencies and private sector clients, ensuring timely delivery and full compliance with federal logistics standards.',
    features: ['Multi-modal freight coordination', 'Federal compliance documentation', 'Real-time carrier tracking', 'Cost optimisation reporting'],
    price: 'From $15'
  },
  {
    icon: <Zap className="w-8 h-8 text-fl-orange" />,
    title: 'Express & Same-Day Delivery',
    desc: 'Time-critical shipments handled with military precision. Our express network ensures next-day and same-day delivery with full chain-of-custody documentation.',
    features: ['Same-day delivery in London', 'Next business day nationwide', 'Live GPS tracking', 'Proof of delivery documentation'],
    price: 'From $30'
  },
  {
    icon: <Globe className="w-8 h-8 text-fl-orange" />,
    title: 'International Freight & Customs',
    desc: 'Seamless international shipping to 200+ countries. We handle all customs clearance, duty calculations and export/import documentation for hassle-free cross-border logistics.',
    features: ['Customs clearance management', 'Import/export documentation', 'Duty & tax calculation', 'Worldwide carrier partnerships'],
    price: 'From $25'
  },
  {
    icon: <Package className="w-8 h-8 text-fl-orange" />,
    title: 'Supply Chain Management',
    desc: 'End-to-end supply chain visibility and management. We integrate with your existing systems to provide inventory control, demand forecasting and last-mile optimisation.',
    features: ['Inventory management', 'Demand forecasting', 'Last-mile optimisation', 'ERP/WMS integration'],
    price: 'Custom quote'
  },
  {
    icon: <Shield className="w-8 h-8 text-fl-orange" />,
    title: 'Secure & Insured Freight',
    desc: 'Full cargo insurance and secure chain-of-custody for sensitive, high-value and classified shipments. Fully compliant with federal security requirements.',
    features: ['Full cargo insurance', 'Chain-of-custody documentation', 'Secure handling protocols', 'Federal security compliance'],
    price: '+2% of cargo value'
  },
  {
    icon: <Clock className="w-8 h-8 text-fl-orange" />,
    title: 'Dedicated Account Management',
    desc: 'Government and enterprise clients receive a dedicated logistics manager available 24/7. One point of contact for all shipments, escalations and reporting.',
    features: ['24/7 dedicated manager', 'Monthly performance reports', 'SLA guarantees', 'Priority support line'],
    price: 'Enterprise plans'
  },
]

export default function Services() {
  return (
    <div className="w-full">
      {/* Hero */}
      <section className="bg-fl-purple text-white pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-fl-orange font-semibold text-sm uppercase tracking-wider mb-3">Our Services</p>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-5">Logistics Solutions for Government & Enterprise</h1>
          <p className="text-xl text-gray-200 max-w-2xl">From federal supply chains to commercial freight — every service is designed for compliance, reliability and speed.</p>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 px-4 bg-fl-light">
        <div className="max-w-6xl mx-auto space-y-8">
          {services.map((s, i) => (
            <div key={s.title} className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col lg:flex-row ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
              <div className={`lg:w-2/3 p-8`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">{s.icon}</div>
                  <h2 className="text-2xl font-heading font-bold text-fl-dark">{s.title}</h2>
                </div>
                <p className="text-gray-600 leading-relaxed mb-5">{s.desc}</p>
                <div className="grid grid-cols-2 gap-2">
                  {s.features.map(f => (
                    <div key={f} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" /> {f}
                    </div>
                  ))}
                </div>
              </div>
              <div className="lg:w-1/3 bg-fl-purple p-8 flex flex-col justify-center text-white">
                <p className="text-purple-200 text-sm mb-2">Starting from</p>
                <p className="text-3xl font-heading font-bold text-fl-orange mb-4">{s.price}</p>
                <Link to="/quote" className="bg-fl-orange hover:bg-orange-600 text-white py-3 px-6 rounded-xl font-bold text-center transition text-sm">Get a Quote</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-fl-purple py-16 px-4 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-heading font-bold mb-4">Need a Custom Solution?</h2>
          <p className="text-gray-200 mb-8">Government agencies and large enterprises — contact us to discuss a tailored logistics contract.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/contact" className="bg-fl-orange hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-bold transition">Contact Our Team</Link>
            <Link to="/capabilities" className="border-2 border-white/40 hover:bg-white/10 text-white px-8 py-4 rounded-xl font-bold transition flex items-center gap-2">Capabilities Statement <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </div>
      </section>
    </div>
  )
}
