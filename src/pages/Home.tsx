import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Package, Search, ArrowRight, CheckCircle, Star, Award, MapPin, Phone, Mail, Clock } from 'lucide-react'

export default function Home() {
  const [tracking, setTracking] = useState('')
  const navigate = useNavigate()
  function handleTrack(e: FormEvent) { e.preventDefault(); if (tracking.trim()) navigate(`/track?number=${tracking.trim()}`) }

  return (
    <div className="w-full font-body">

      {/* HERO - full viewport with real logistics image */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <img src="https://picsum.photos/id/1048/1920/1000" alt="Fed Logistics warehouse operations" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40"></div>
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-32">
          <div className="flex flex-col lg:flex-row items-center gap-14">
            <div className="flex-1 text-white">
              <div className="inline-flex items-center gap-2 bg-fl-orange/20 border border-fl-orange/50 text-fl-orange text-sm font-semibold px-4 py-2 rounded-full mb-7">
                <Award className="w-4 h-4" /> Trusted Federal & Commercial Logistics — Since 2009
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-black leading-tight mb-6">Moving the<br />World <span className="text-fl-orange">Forward.</span></h1>
              <p className="text-xl text-gray-300 leading-relaxed mb-8 max-w-xl">Air freight, sea freight, cargo transport and warehousing for federal agencies, businesses and individuals across the USA, UK and 200+ countries worldwide.</p>
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link to="/quote" className="bg-fl-orange hover:bg-orange-500 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-2 justify-center transition shadow-2xl hover:-translate-y-0.5"><Package className="w-5 h-5" />Get a Free Quote</Link>
                <Link to="/services" className="border-2 border-white/40 hover:border-white hover:bg-white/10 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-2 justify-center transition">Our Services <ArrowRight className="w-5 h-5" /></Link>
              </div>
              <div className="flex flex-wrap gap-3">
                {['✓ SSL Secured', '✓ Fully Insured', '✓ Federal Compliant', '✓ SAM.gov Registered'].map(b => (
                  <span key={b} className="bg-white/10 border border-white/20 text-gray-200 text-xs font-semibold px-3 py-1.5 rounded-full">{b}</span>
                ))}
              </div>
            </div>
            <div className="w-full lg:w-[420px] bg-white/10 backdrop-blur-md border border-white/25 rounded-2xl p-7 shadow-2xl">
              <h3 className="text-white font-heading font-bold text-xl mb-1">Track Your Shipment</h3>
              <p className="text-gray-300 text-sm mb-5">Enter your tracking number for live updates</p>
              <form onSubmit={handleTrack} className="space-y-3">
                <input type="text" value={tracking} onChange={e => setTracking(e.target.value)} placeholder="e.g. FL1234567890" className="w-full px-4 py-3.5 bg-white/15 border border-white/30 rounded-xl text-white placeholder-gray-400 outline-none focus:border-fl-orange transition font-medium" />
                <button type="submit" className="w-full bg-fl-orange hover:bg-orange-500 text-white py-3.5 rounded-xl font-bold text-base transition flex items-center justify-center gap-2"><Search className="w-4 h-4" />Track Package</button>
              </form>
              <div className="mt-5 pt-5 border-t border-white/20 grid grid-cols-3 text-center gap-2">
                {[['500K+', 'Delivered'], ['200+', 'Countries'], ['99.9%', 'On Time']].map(([n, l]) => (
                  <div key={l}><p className="text-fl-orange font-black text-xl">{n}</p><p className="text-gray-300 text-xs mt-0.5">{l}</p></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-fl-orange py-10 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
          {[['15+', 'Years in Business'], ['200+', 'Countries Served'], ['500K+', 'Packages Delivered'], ['99.9%', 'On-Time Rate']].map(([n, l]) => (
            <div key={l}><p className="text-4xl font-heading font-black">{n}</p><p className="text-orange-100 text-sm mt-1 font-medium">{l}</p></div>
          ))}
        </div>
      </section>

      {/* SERVICES - image cards */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-fl-orange font-bold text-sm uppercase tracking-widest mb-3">What We Do</p>
            <h2 className="text-4xl font-heading font-black text-fl-dark mb-4">Complete Logistics Services</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">Air freight, sea freight, cargo transport and warehousing — all under one roof for every type of client.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { img: 'https://picsum.photos/id/137/800/600', emoji: '✈️', title: 'Air Freight', desc: 'Fast worldwide air cargo with customs clearance and door-to-door tracking.', link: '/services#air' },
              { img: 'https://picsum.photos/id/1072/800/600', emoji: '🚢', title: 'Sea Freight', desc: 'Cost-effective FCL & LCL ocean freight to any major port worldwide.', link: '/services#sea' },
              { img: 'https://picsum.photos/id/111/800/600', emoji: '🚛', title: 'Cargo Transport', desc: 'FTL & LTL ground freight across the USA and UK with GPS tracking.', link: '/services#cargo' },
              { img: 'https://picsum.photos/id/1033/800/600', emoji: '🏭', title: 'Warehousing', desc: 'Secure storage, pick-and-pack and fulfilment in key logistics hubs.', link: '/services#warehouse' },
            ].map(s => (
              <Link to={s.link} key={s.title} className="group rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="relative h-52 overflow-hidden">
                  <img src={s.img} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent"></div>
                  <span className="absolute bottom-4 left-4 text-4xl">{s.emoji}</span>
                </div>
                <div className="p-5 bg-white">
                  <h3 className="font-heading font-bold text-fl-dark text-lg mb-1.5">{s.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-3">{s.desc}</p>
                  <span className="text-fl-orange font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">Learn more <ArrowRight className="w-4 h-4" /></span>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/services" className="inline-flex items-center gap-2 bg-fl-purple hover:bg-purple-900 text-white px-8 py-3.5 rounded-xl font-bold transition">View All Services <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <img src="https://picsum.photos/id/453/900/600" alt="Fed Logistics operations team" className="rounded-2xl shadow-2xl w-full h-[500px] object-cover" />
            <div className="absolute -bottom-6 -right-4 bg-fl-purple text-white rounded-2xl p-5 shadow-2xl hidden md:block">
              <p className="text-5xl font-black text-fl-orange leading-none">15+</p>
              <p className="text-purple-200 text-sm font-semibold mt-1">Years of Excellence</p>
            </div>
          </div>
          <div>
            <p className="text-fl-orange font-bold text-sm uppercase tracking-widest mb-3">Why Fed Logistics</p>
            <h2 className="text-4xl font-heading font-black text-fl-dark mb-5 leading-tight">A Partner You Can Count On — Every Single Shipment</h2>
            <p className="text-gray-500 mb-8 leading-relaxed text-lg">Since 2009, we've built our reputation on one principle: doing exactly what we say we'll do. From a single parcel to a full government supply chain — we deliver.</p>
            <div className="space-y-4">
              {[
                { title: 'Federal Contractor Ready', desc: 'SAM.gov registered with CAGE code, UEI and NAICS codes covering all major logistics categories.' },
                { title: 'Real-Time Tracking Technology', desc: 'Every shipment gets a unique tracking number with live status updates from pickup to final delivery.' },
                { title: 'Fully Insured & Bonded', desc: 'Complete cargo insurance and liability coverage on every shipment — no exceptions.' },
                { title: '24/7 Dedicated Support', desc: 'Government and enterprise clients have a dedicated account manager available round the clock.' },
              ].map(i => (
                <div key={i.title} className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-fl-orange transition">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"><CheckCircle className="w-5 h-5 text-green-600" /></div>
                  <div><p className="font-bold text-fl-dark">{i.title}</p><p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{i.desc}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS - photos + quotes */}
      <section className="py-24 px-4 bg-fl-purple text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-fl-orange font-bold text-sm uppercase tracking-widest mb-3">Client Reviews</p>
            <h2 className="text-4xl font-heading font-black mb-3">What Our Clients Say</h2>
            <p className="text-purple-200 text-lg">Trusted by government agencies, businesses and individuals worldwide.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { img: 'https://randomuser.me/api/portraits/men/32.jpg', name: 'Michael Turner', role: 'Supply Chain Director, Texas', stars: 5, quote: 'Fast and reliable delivery service. Fed Logistics handled our entire federal supply contract without a single missed deadline. Highly recommended for any government work.' },
              { img: 'https://randomuser.me/api/portraits/women/44.jpg', name: 'Sarah Mitchell', role: 'Operations Manager, MedTech Corp', stars: 5, quote: 'We ship time-sensitive medical equipment globally. Their air freight service is exceptional — real-time tracking and 24/7 support give us complete peace of mind every time.' },
              { img: 'https://randomuser.me/api/portraits/men/68.jpg', name: 'James Okafor', role: 'Procurement Officer, Washington DC', stars: 5, quote: "Switched our agency's logistics to Fed Logistics 2 years ago. Warehousing and cargo transport are top tier. Our delivery success rate jumped from 94% to 99.8%." },
            ].map(t => (
              <div key={t.name} className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-7 flex flex-col">
                <div className="flex gap-1 mb-5">{[...Array(t.stars)].map((_, i) => <Star key={i} className="w-4 h-4 fill-fl-orange text-fl-orange" />)}</div>
                <p className="text-gray-100 leading-relaxed italic flex-grow mb-6">"{t.quote}"</p>
                <div className="flex items-center gap-3 pt-5 border-t border-white/20">
                  <img src={t.img} alt={t.name} className="w-12 h-12 rounded-full object-cover border-2 border-fl-orange flex-shrink-0" />
                  <div><p className="font-bold text-white text-sm">— {t.name}</p><p className="text-purple-200 text-xs">{t.role}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INDUSTRIES */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-fl-orange font-bold text-sm uppercase tracking-widest mb-3">Industries</p>
          <h2 className="text-4xl font-heading font-black text-fl-dark mb-12">Who We Serve</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {[{ emoji: '🏛️', name: 'Federal Government' }, { emoji: '🛡️', name: 'Defence & Security' }, { emoji: '🏥', name: 'Healthcare & Pharma' }, { emoji: '🛒', name: 'E-Commerce & Retail' }, { emoji: '🏭', name: 'Manufacturing' }, { emoji: '⛽', name: 'Oil & Gas' }, { emoji: '💻', name: 'Technology' }, { emoji: '🌍', name: 'Non-Profit & NGO' }].map(i => (
              <div key={i.name} className="bg-gray-50 rounded-xl p-5 border border-gray-100 hover:border-fl-orange hover:shadow-md transition group">
                <p className="text-4xl mb-3 group-hover:scale-110 transition-transform inline-block">{i.emoji}</p>
                <p className="text-sm font-bold text-fl-dark">{i.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HEAD OFFICE */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-stretch">
          <div className="flex flex-col justify-center">
            <p className="text-fl-orange font-bold text-sm uppercase tracking-widest mb-3">Find Us</p>
            <h2 className="text-4xl font-heading font-black text-fl-dark mb-8">Our Head Office</h2>
            <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100 mb-6">
              <h3 className="font-heading font-black text-xl text-fl-dark mb-5 flex items-center gap-2"><Package className="w-5 h-5 text-fl-orange" />Fed Logistics Corp</h3>
              <div className="space-y-4 text-gray-600">
                {[
                  { icon: <MapPin className="w-4 h-4 text-fl-orange" />, label: 'Head Office', text: '1 Canada Square, Canary Wharf\nLondon, E14 5AB\nUnited Kingdom' },
                  { icon: <Phone className="w-4 h-4 text-fl-orange" />, label: 'Phone', text: '+44 7735 380906' },
                  { icon: <Mail className="w-4 h-4 text-fl-orange" />, label: 'Email', text: 'info@fedlogisticscorp.com\nsupport@fedlogisticscorp.com' },
                  { icon: <Clock className="w-4 h-4 text-fl-orange" />, label: 'Business Hours', text: 'Mon–Fri: 8:00am – 8:00pm GMT\nSaturday: 9:00am – 5:00pm GMT' },
                ].map(item => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-orange-50 rounded-full flex items-center justify-center flex-shrink-0">{item.icon}</div>
                    <div><p className="font-bold text-fl-dark text-sm">{item.label}</p><p className="text-sm leading-relaxed whitespace-pre-line">{item.text}</p></div>
                  </div>
                ))}
              </div>
            </div>
            <Link to="/contact" className="inline-flex items-center gap-2 bg-fl-purple hover:bg-purple-900 text-white px-7 py-3.5 rounded-xl font-bold transition w-fit">Contact Our Team <ArrowRight className="w-4 h-4" /></Link>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-200 min-h-[400px]">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2482.2554151618!2d-0.02176902317757812!3d51.50444101011!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487602b9a1b4aaab%3A0x1cbfc254e61c7d0!2s1%20Canada%20Square%2C%20London%20E14%205AB!5e0!3m2!1sen!2suk!4v1709644800000!5m2!1sen!2suk" width="100%" height="100%" style={{ border: 0, minHeight: '400px' }} allowFullScreen loading="lazy" title="Fed Logistics Head Office"></iframe>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative py-24 px-4 overflow-hidden text-white text-center">
        <img src="https://picsum.photos/id/1072/1920/600" alt="Ready to ship" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-fl-orange"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-5xl font-heading font-black mb-4">Ready to Ship With Us?</h2>
          <p className="text-orange-100 text-xl mb-10">Government agency, enterprise or individual — get a free quote in minutes.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/quote" className="bg-white text-fl-orange hover:bg-gray-100 px-10 py-4 rounded-xl font-black text-lg transition shadow-xl">Get Free Quote</Link>
            <Link to="/ship" className="border-2 border-white/60 hover:bg-white/10 text-white px-10 py-4 rounded-xl font-bold text-lg transition">Ship a Package</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
