import { CheckCircle, ArrowRight, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'

const services = [
  {
    id: 'air',
    img: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1200&auto=format&fit=crop',
    emoji: '✈️',
    title: 'Air Freight',
    tagline: 'Fast. Global. Door-to-Door.',
    desc: 'When speed is critical, our air freight service gets your cargo to any destination worldwide in the shortest possible time. We work with major international airlines and freight forwarders to offer competitive rates on both express and standard air cargo.',
    detail: 'Our air freight specialists handle everything — export declarations, customs documentation, import clearance and last-mile delivery — so your shipment reaches its destination without delays or surprises. Whether it\'s a small urgent parcel or a full charter, we have the right solution.',
    features: ['Express 24–48hr & standard options', 'Door-to-door worldwide delivery', 'Full customs clearance handled', 'Dangerous goods & pharma certified', 'Real-time flight tracking', 'Cargo insurance included'],
    price: 'From $35 / kg',
  },
  {
    id: 'sea',
    img: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=1200&auto=format&fit=crop',
    emoji: '🚢',
    title: 'Sea Freight',
    tagline: 'Cost-Effective. High Volume. Worldwide.',
    desc: 'For large or heavy shipments where speed is less critical, sea freight is the most economical solution. We handle Full Container Load (FCL) and Less than Container Load (LCL) shipments to any major port worldwide.',
    detail: 'Our sea freight team manages everything from booking and documentation through to port handling and final delivery. We work with the world\'s top ocean carriers to guarantee competitive rates, reliable sailing schedules and on-time arrivals.',
    features: ['FCL & LCL options available', 'Major ports worldwide', 'Port-to-door or door-to-door', 'Customs clearance & documentation', 'Refrigerated (Reefer) containers', 'Cargo consolidation service'],
    price: 'From $500 / container',
  },
  {
    id: 'cargo',
    img: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=1200&auto=format&fit=crop',
    emoji: '🚛',
    title: 'Cargo Transport',
    tagline: 'Ground Freight. USA & UK.',
    desc: 'Our road freight service covers the entire United States and United Kingdom. From single pallets to full truckloads, our GPS-tracked fleet moves your cargo on schedule — every time. We serve businesses, government agencies and individuals.',
    detail: 'We offer FTL (Full Truckload), LTL (Less than Truckload) and dedicated vehicle options. Every driver in our network is vetted and every load is monitored in real time by our operations centre. We provide proof of delivery on completion.',
    features: ['FTL, LTL & dedicated vehicle options', 'GPS-tracked fleet', 'Same-day & next-day delivery', 'Temperature-controlled options', 'Hazmat certified drivers', 'Electronic proof of delivery'],
    price: 'From $15 / shipment',
  },
  {
    id: 'warehouse',
    img: 'https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=1200&auto=format&fit=crop',
    emoji: '🏭',
    title: 'Warehousing & Storage',
    tagline: 'Secure. Flexible. Strategically Located.',
    desc: 'Our warehousing facilities offer flexible, secure storage for businesses of all sizes — from short-term overflow storage to long-term fulfilment partnerships. Our facilities are located in key logistics hubs in London and the USA.',
    detail: 'All our warehouses are CCTV-monitored 24/7, alarmed and staffed by trained operatives. We offer pick-and-pack, inventory management, cross-docking and direct fulfilment to your customers — with full system integration into your existing platforms.',
    features: ['24/7 CCTV monitored', 'Pick, pack & fulfilment services', 'Inventory management system', 'Cross-docking available', 'Bonded warehouse options', 'E-commerce fulfilment'],
    price: 'From £8 / pallet / week',
  },
  {
    id: 'supply-chain',
    img: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?q=80&w=1200&auto=format&fit=crop',
    emoji: '🔗',
    title: 'Supply Chain Management',
    tagline: 'End-to-End Visibility & Control.',
    desc: 'For government agencies and enterprise clients, we offer complete supply chain management — from procurement through to delivery. We integrate with your systems to provide full visibility, demand forecasting and continuous optimisation.',
    detail: 'Our supply chain managers work as an extension of your team — identifying bottlenecks, negotiating carrier rates and managing vendor relationships. For government clients, all operations are fully FAR-compliant.',
    features: ['ERP/WMS system integration', 'Demand forecasting & planning', 'Vendor & carrier management', 'KPI reporting & dashboards', 'Dedicated supply chain manager', 'FAR-compliant for federal contracts'],
    price: 'Custom pricing',
  },
  {
    id: 'secure',
    img: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?q=80&w=1200&auto=format&fit=crop',
    emoji: '🛡️',
    title: 'Secure & Insured Freight',
    tagline: 'High-Value. Sensitive. Classified.',
    desc: 'For high-value goods, classified government materials and sensitive cargo, our secure freight service provides a fully insured, chain-of-custody tracked solution with specialist handling at every stage of the journey.',
    detail: 'Our secure freight team is trained in handling government classified materials, pharmaceuticals, jewellery, fine art and high-value electronics. All movements are documented, insured and supervised with real-time tamper alerts.',
    features: ['Full cargo insurance included', 'Chain-of-custody documentation', 'Discreet unmarked vehicles', 'Federal security clearance', 'Secure facility handovers', 'Real-time tamper alerts'],
    price: '+2% of cargo value',
  },
]

export default function Services() {
  return (
    <div className="w-full">

      {/* HERO with image */}
      <section className="relative min-h-[450px] flex items-center overflow-hidden">
        <img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop" alt="Fed Logistics services" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent"></div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 pt-32 pb-20">
          <p className="text-fl-orange font-bold text-sm uppercase tracking-widest mb-3">Our Services</p>
          <h1 className="text-5xl md:text-6xl font-heading font-black text-white mb-5 leading-tight">
            Complete Logistics<br /><span className="text-fl-orange">For Every Need</span>
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl">Air freight, sea freight, cargo transport, warehousing and supply chain management — all under one roof, with one point of contact.</p>
        </div>
      </section>

      {/* SERVICES LIST */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto space-y-12">
          {services.map((s, i) => (
            <div key={s.id} id={s.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden scroll-mt-28 hover:shadow-lg transition">
              <div className={`flex flex-col ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                {/* IMAGE */}
                <div className="lg:w-2/5 relative overflow-hidden">
                  <img src={s.img} alt={s.title} className="w-full h-72 lg:h-full object-cover" style={{ minHeight: '320px' }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-5 left-5">
                    <span className="text-5xl">{s.emoji}</span>
                  </div>
                </div>
                {/* CONTENT */}
                <div className="lg:w-3/5 p-8 lg:p-10">
                  <p className="text-fl-orange font-bold text-xs uppercase tracking-widest mb-2">{s.tagline}</p>
                  <h2 className="text-3xl font-heading font-black text-fl-dark mb-4">{s.title}</h2>
                  <p className="text-gray-600 leading-relaxed mb-3">{s.desc}</p>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6">{s.detail}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-7">
                    {s.features.map(f => (
                      <div key={f} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />{f}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between flex-wrap gap-4 pt-5 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">Starting from</p>
                      <p className="text-2xl font-black text-fl-orange">{s.price}</p>
                    </div>
                    <Link to="/quote" className="bg-fl-purple hover:bg-purple-900 text-white px-6 py-3 rounded-xl font-bold transition flex items-center gap-2">
                      Get a Quote <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-fl-purple py-20 px-4 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-heading font-black mb-4">Not Sure Which Service You Need?</h2>
          <p className="text-purple-200 text-lg mb-8">Call us or submit a quote request — our team will recommend the best solution for your cargo within 2 hours.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/quote" className="bg-fl-orange hover:bg-orange-500 text-white px-8 py-4 rounded-xl font-bold transition text-lg">Request a Quote</Link>
            <a href="tel:+447735380906" className="border-2 border-white/40 hover:bg-white/10 text-white px-8 py-4 rounded-xl font-bold transition text-lg flex items-center gap-2">
              <Phone className="w-5 h-5" />Call Us Now
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
