import { CheckCircle, Award, Users, Target, Globe2, Shield, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function About() {
  return (
    <div className="w-full">
      {/* Hero */}
      <section className="relative bg-fl-purple text-white pt-32 pb-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: "url('https://bidmoncorp.com/images/about-hero.jpg')" }}></div>
        <div className="absolute inset-0 bg-fl-purple/75"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <p className="text-fl-orange font-semibold text-sm uppercase tracking-wider mb-3">About Us</p>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-5">Delivering More Than Packages — Delivering Trust</h1>
          <p className="text-xl text-gray-200 max-w-2xl">For over 15 years, Fed Logistics has connected governments, enterprises and individuals to reliable, compliant and efficient logistics solutions worldwide.</p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-fl-orange font-semibold text-sm uppercase tracking-wider mb-2">Our Story</p>
            <h2 className="text-3xl font-heading font-bold text-fl-dark mb-5">Founded on Reliability</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">Fed Logistics was founded with a clear mission: to provide government agencies and enterprise clients with logistics services they can genuinely depend on. Starting as a regional courier in London, we rapidly expanded our capabilities to serve federal contracts and international freight.</p>
            <p className="text-gray-600 mb-4 leading-relaxed">Today, we operate a global network spanning 200+ countries with a dedicated team serving clients across federal government, defence, healthcare, manufacturing and e-commerce sectors.</p>
            <p className="text-gray-600 leading-relaxed">Our London headquarters at Canary Wharf serves as our operational hub, coordinating shipments across the UK, Europe, North America and beyond.</p>
          </div>
          <img src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=800" alt="Fed Logistics Operations" className="rounded-2xl shadow-xl object-cover h-96 w-full" />
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20 px-4 bg-fl-light">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-fl-orange font-semibold text-sm uppercase tracking-wider mb-2">What Drives Us</p>
            <h2 className="text-3xl font-heading font-bold text-fl-dark">Mission, Vision & Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <Target className="w-8 h-8 text-fl-orange" />, title: 'Our Mission', desc: 'To provide governments, enterprises and individuals with fast, reliable and fully compliant logistics solutions that create operational excellence.' },
              { icon: <Globe2 className="w-8 h-8 text-fl-orange" />, title: 'Our Vision', desc: 'To be the most trusted logistics partner for federal agencies and enterprise clients across the United Kingdom and globally.' },
              { icon: <Shield className="w-8 h-8 text-fl-orange" />, title: 'Our Values', desc: 'Integrity, transparency and accountability in every shipment. We treat every delivery as a mission-critical operation.' },
            ].map(v => (
              <div key={v.title} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-50 rounded-full mb-4">{v.icon}</div>
                <h3 className="font-heading font-bold text-fl-dark text-xl mb-3">{v.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-fl-orange font-semibold text-sm uppercase tracking-wider mb-2">Leadership</p>
            <h2 className="text-3xl font-heading font-bold text-fl-dark">Our Leadership Team</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Michael Harrison', role: 'Chief Executive Officer', bio: '20+ years in global logistics and federal supply chain management. Former Director at a major UK freight company.' },
              { name: 'Angela Osei', role: 'Chief Operations Officer', bio: 'Expert in federal procurement compliance and supply chain optimisation. Leads all operational delivery and client accounts.' },
              { name: 'Daniel Kofi', role: 'Head of Government Contracts', bio: 'Specialist in federal contracting, NAICS classification and government procurement. Manages all public sector partnerships.' },
            ].map(l => (
              <div key={l.name} className="text-center">
                <div className="w-20 h-20 bg-fl-purple rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">{l.name.charAt(0)}</div>
                <h3 className="font-bold text-fl-dark text-lg">{l.name}</h3>
                <p className="text-fl-orange text-sm font-semibold mb-2">{l.role}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{l.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-20 px-4 bg-fl-light">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-fl-orange font-semibold text-sm uppercase tracking-wider mb-2">Industries</p>
            <h2 className="text-3xl font-heading font-bold text-fl-dark">Clients & Industries We Serve</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Federal Government', 'Defence & Security', 'Healthcare & Pharma', 'E-Commerce & Retail', 'Manufacturing', 'Oil & Gas', 'Technology', 'Non-Profit & NGO'].map(i => (
              <div key={i} className="bg-white rounded-xl p-4 text-center border border-gray-100 shadow-sm hover:border-fl-orange transition">
                <CheckCircle className="w-5 h-5 text-fl-orange mx-auto mb-2" />
                <p className="text-sm font-semibold text-fl-dark">{i}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-heading font-bold text-fl-dark mb-3">Our Headquarters</h2>
            <p className="text-gray-500">1 Canada Square, Canary Wharf, London E14 5AB, United Kingdom</p>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-200 h-96">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2482.2554151618!2d-0.02176902317757812!3d51.50444101011!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487602b9a1b4aaab%3A0x1cbfc254e61c7d0!2s1%20Canada%20Square%2C%20London%20E14%205AB!5e0!3m2!1sen!2suk!4v1709644800000!5m2!1sen!2suk" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" title="Fed Logistics HQ"></iframe>
          </div>
        </div>
      </section>

      <section className="bg-fl-purple py-16 px-4 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-heading font-bold mb-4">Partner With Us</h2>
          <p className="text-gray-200 mb-8">Government agency or enterprise? Let's discuss how Fed Logistics can serve your logistics needs.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/contact" className="bg-fl-orange hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-bold transition">Contact Us</Link>
            <Link to="/capabilities" className="border-2 border-white/40 hover:bg-white/10 text-white px-8 py-4 rounded-xl font-bold transition">View Capabilities</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
