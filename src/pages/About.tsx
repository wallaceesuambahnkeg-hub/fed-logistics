import { CheckCircle, ArrowRight, Star } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function About() {
  return (
    <div className="w-full">

      {/* HERO with real image */}
      <section className="relative min-h-[560px] flex items-center overflow-hidden">
        <img src="https://picsum.photos/id/1072/800/600" alt="About Fed Logistics" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent"></div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 pt-32 pb-20">
          <p className="text-fl-orange font-bold text-sm uppercase tracking-widest mb-3">About Us</p>
          <h1 className="text-5xl md:text-6xl font-heading font-black text-white mb-5 leading-tight">
            Built on Trust.<br /><span className="text-fl-orange">Driven by Results.</span>
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl leading-relaxed">Founded in 2009, Fed Logistics has grown from a small London courier into a trusted global logistics partner serving government agencies and enterprises across 200+ countries.</p>
        </div>
      </section>

      {/* FOUNDER STORY */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <img src="https://picsum.photos/id/453/900/600" alt="David Harrington, Founder of Fed Logistics" className="rounded-2xl shadow-2xl w-full h-[520px] object-cover object-top" />
            <div className="absolute -bottom-5 -left-5 bg-fl-orange text-white rounded-2xl p-5 shadow-xl hidden md:block">
              <p className="text-4xl font-black leading-none">2009</p>
              <p className="text-orange-100 text-sm mt-1">Year Founded</p>
            </div>
          </div>
          <div>
            <p className="text-fl-orange font-bold text-sm uppercase tracking-widest mb-3">Our Founder</p>
            <h2 className="text-4xl font-heading font-black text-fl-dark mb-5">A Vision Born From Military Precision</h2>
            <p className="text-gray-600 mb-4 leading-relaxed text-lg">Fed Logistics was founded in <strong>2009</strong> by <strong>David Harrington</strong>, a former military logistics officer who completed 8 years of active service before returning to civilian life with a clear mission.</p>
            <p className="text-gray-600 mb-4 leading-relaxed">David saw firsthand the inefficiencies and failures in both government and commercial logistics — and he knew he could fix them. Starting with a single van and three employees in East London, he built Fed Logistics on the principles of military-grade accountability and zero tolerance for missed deadlines.</p>
            <p className="text-gray-600 mb-6 leading-relaxed">The company won its first government contract in 2011. By 2016, it had expanded to international air and sea freight. Today, Fed Logistics operates globally with 200+ staff, offices in London and Washington DC, and has delivered over 500,000 packages to clients in 200+ countries.</p>
            <blockquote className="border-l-4 border-fl-orange pl-5 py-2 bg-orange-50 rounded-r-xl">
              <p className="italic text-gray-600 text-lg leading-relaxed">"In logistics, a missed deadline isn't just inconvenient — it can cost lives, deals and trust. We built Fed Logistics so that never happens."</p>
              <cite className="block mt-3 text-fl-orange font-black text-sm not-italic">— David Harrington, Founder & CEO</cite>
            </blockquote>
          </div>
        </div>
      </section>

      {/* MISSION VISION VALUES */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-fl-orange font-bold text-sm uppercase tracking-widest mb-3">What Drives Us</p>
            <h2 className="text-4xl font-heading font-black text-fl-dark">Mission, Vision & Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { emoji: '🎯', title: 'Our Mission', desc: 'To provide governments, enterprises and individuals with fast, reliable, fully compliant logistics that create operational excellence and peace of mind on every single shipment.' },
              { emoji: '🌍', title: 'Our Vision', desc: 'To be the most trusted logistics partner for federal agencies and commercial clients across the UK, USA and worldwide — delivering with military precision every time.' },
              { emoji: '🛡️', title: 'Our Values', desc: 'Integrity in every shipment. Transparency in every update. Full accountability when things go wrong. We hold ourselves to the same standards David learned in the military.' },
            ].map(v => (
              <div key={v.title} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center hover:shadow-lg hover:-translate-y-1 transition">
                <p className="text-5xl mb-4">{v.emoji}</p>
                <h3 className="font-heading font-black text-fl-dark text-xl mb-3">{v.title}</h3>
                <p className="text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPANY TIMELINE */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-fl-orange font-bold text-sm uppercase tracking-widest mb-3">Our Journey</p>
            <h2 className="text-4xl font-heading font-black text-fl-dark">How We Grew</h2>
          </div>
          <div className="space-y-5">
            {[
              { year: '2009', title: 'Founded in London', desc: 'David Harrington launches Fed Logistics with 3 staff and 1 van, focusing on local courier services in East London.' },
              { year: '2011', title: 'First Government Contract', desc: 'Awarded our first UK government logistics contract. Team expanded to 15 staff with a growing vehicle fleet.' },
              { year: '2015', title: 'National UK Expansion', desc: 'Operations now cover all major UK cities. Launched our proprietary real-time shipment tracking platform.' },
              { year: '2017', title: 'International Freight Launch', desc: 'Launched air freight and sea freight services. Partnerships formed with major global carriers.' },
              { year: '2020', title: 'Washington DC Office Opens', desc: 'Opened our first US office in Washington DC to better serve federal government clients in North America.' },
              { year: '2021', title: 'SAM.gov Registration', desc: 'Registered as a federal contractor on SAM.gov USA. Began serving US government agencies and defence contractors.' },
              { year: '2024', title: '500,000 Packages & Growing', desc: 'Delivered our 500,000th package. Operating in 200+ countries with 200+ staff and a global carrier network.' },
            ].map((e, i, arr) => (
              <div key={e.year} className="flex gap-5 items-start">
                <div className="flex-shrink-0 flex flex-col items-center">
                  <div className="w-16 h-16 bg-fl-purple rounded-full flex items-center justify-center text-white font-black text-xs text-center leading-tight px-1">{e.year}</div>
                  {i < arr.length - 1 && <div className="w-0.5 h-6 bg-gray-200 mt-1"></div>}
                </div>
                <div className="bg-gray-50 rounded-xl p-5 flex-grow border border-gray-100 hover:border-fl-orange transition mt-2">
                  <p className="font-bold text-fl-dark text-lg">{e.title}</p>
                  <p className="text-gray-500 text-sm mt-1 leading-relaxed">{e.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LEADERSHIP TEAM with photos */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-fl-orange font-bold text-sm uppercase tracking-widest mb-3">Leadership</p>
            <h2 className="text-4xl font-heading font-black text-fl-dark">Meet the Team</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { img: 'https://picsum.photos/id/453/900/600', name: 'David Harrington', role: 'Founder & CEO', bio: 'Former military logistics officer with 8 years of service. Built Fed Logistics from the ground up with a mission to bring military-grade reliability to commercial and government logistics.' },
              { img: 'https://randomuser.me/api/portraits/women/28.jpg', name: 'Angela Osei', role: 'Chief Operations Officer', bio: 'Expert in federal procurement and supply chain optimisation with 12 years experience. Leads all operational delivery and manages key government client accounts.' },
              { img: 'https://randomuser.me/api/portraits/men/45.jpg', name: 'Daniel Kofi', role: 'Head of Government Contracts', bio: 'Specialist in federal contracting, NAICS classification and government procurement. Manages all public sector partnerships and compliance for US and UK government clients.' },
            ].map(l => (
              <div key={l.name} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition group">
                <div className="h-64 overflow-hidden">
                  <img src={l.img} alt={l.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <h3 className="font-heading font-black text-fl-dark text-xl">{l.name}</h3>
                  <p className="text-fl-orange font-bold text-sm mb-3">{l.role}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{l.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS on About page */}
      <section className="py-24 px-4 bg-fl-purple text-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-fl-orange font-bold text-sm uppercase tracking-widest mb-3">Testimonials</p>
            <h2 className="text-4xl font-heading font-black">Trusted by Clients Worldwide</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { img: 'https://randomuser.me/api/portraits/men/32.jpg', name: 'Michael Turner', role: 'Texas, USA', quote: 'Fast and reliable delivery service. Fed Logistics handled our entire federal supply contract without a single missed deadline.' },
              { img: 'https://randomuser.me/api/portraits/women/44.jpg', name: 'Sarah Mitchell', role: 'London, UK', quote: 'Their air freight service is exceptional. Real-time tracking and 24/7 support give us complete peace of mind for our time-sensitive medical shipments.' },
              { img: 'https://randomuser.me/api/portraits/men/68.jpg', name: 'James Okafor', role: 'Washington DC, USA', quote: "Switched our agency's logistics to Fed Logistics 2 years ago. Our delivery success rate jumped from 94% to 99.8%. Exceptional service." },
            ].map(t => (
              <div key={t.name} className="bg-white/10 border border-white/20 rounded-2xl p-6">
                <div className="flex gap-1 mb-4">{[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-fl-orange text-fl-orange" />)}</div>
                <p className="italic text-gray-200 text-sm leading-relaxed mb-5">"{t.quote}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-white/20">
                  <img src={t.img} alt={t.name} className="w-11 h-11 rounded-full object-cover border-2 border-fl-orange" />
                  <div><p className="font-bold text-white text-sm">— {t.name}</p><p className="text-purple-200 text-xs">{t.role}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INDUSTRIES */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-fl-orange font-bold text-sm uppercase tracking-widest mb-3">Industries</p>
            <h2 className="text-4xl font-heading font-black text-fl-dark">Who We Serve</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[{ emoji: '🏛️', name: 'Federal Government' }, { emoji: '🛡️', name: 'Defence & Security' }, { emoji: '🏥', name: 'Healthcare & Pharma' }, { emoji: '🛒', name: 'E-Commerce & Retail' }, { emoji: '🏭', name: 'Manufacturing' }, { emoji: '⛽', name: 'Oil & Gas' }, { emoji: '💻', name: 'Technology' }, { emoji: '🌍', name: 'Non-Profit & NGO' }].map(i => (
              <div key={i.name} className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100 hover:border-fl-orange hover:shadow-md transition group">
                <p className="text-3xl mb-2 group-hover:scale-110 transition-transform inline-block">{i.emoji}</p>
                <p className="text-sm font-bold text-fl-dark">{i.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 px-4 overflow-hidden">
        <img src="https://picsum.photos/id/870/1920/600" alt="CTA background" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-fl-purple"></div>
        <div className="relative z-10 max-w-2xl mx-auto text-center text-white">
          <h2 className="text-4xl font-heading font-black mb-4">Ready to Partner With Us?</h2>
          <p className="text-purple-200 text-lg mb-8">Government agency or enterprise? Let's discuss how Fed Logistics can serve your needs.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/contact" className="bg-fl-orange hover:bg-orange-500 text-white px-8 py-4 rounded-xl font-bold transition text-lg">Contact Us Today</Link>
            <Link to="/capabilities" className="border-2 border-white/40 hover:bg-white/10 text-white px-8 py-4 rounded-xl font-bold transition text-lg flex items-center gap-2">View Capabilities <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </div>
      </section>
    </div>
  )
}
