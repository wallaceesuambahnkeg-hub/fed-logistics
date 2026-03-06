import { Target, Heart, Shield, Users, Globe2, Award } from 'lucide-react'

export default function About() {
  return (
    <div className="w-full">
      <section className="relative bg-fl-purple text-white pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-40 bg-cover bg-center" style={{ backgroundImage: "url('https://bidmoncorp.com/images/about-hero.jpg')" }}></div>
        <div className="absolute inset-0 bg-fl-purple/70"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Delivering More Than Packages</h1>
          <p className="text-xl text-gray-200">Since our founding, Fed Logistics has connected the world through fast, reliable and innovative shipping solutions.</p>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-heading font-bold text-fl-dark mb-4">Our Story</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">What started as a small regional courier service has grown into a global logistics powerhouse. For over 40 years, Fed Logistics has pioneered new ways to move goods faster, safer and more efficiently.</p>
            <p className="text-gray-600 leading-relaxed">Today our network spans over 200 countries, powered by a dedicated team of over 500,000 employees worldwide — headquartered in London, UK.</p>
          </div>
          <img src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=800" alt="Fed Logistics" className="rounded-2xl shadow-xl object-cover h-80 w-full" />
        </div>
      </section>

      <section className="py-20 px-4 bg-fl-light">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-heading font-bold text-fl-dark mb-3">Our Core Values</h2>
        </div>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: <Target className="w-7 h-7 text-fl-orange" />, title: 'Mission', desc: 'To connect people through innovative, reliable logistics solutions.' },
            { icon: <Shield className="w-7 h-7 text-fl-orange" />, title: 'Integrity', desc: 'Transparency and honesty in every interaction.' },
            { icon: <Globe2 className="w-7 h-7 text-fl-orange" />, title: 'Global Reach', desc: 'Operating in 200+ countries from our London HQ.' },
          ].map(v => (
            <div key={v.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-orange-50 rounded-full mb-4">{v.icon}</div>
              <h3 className="font-bold text-fl-dark mb-2">{v.title}</h3>
              <p className="text-sm text-gray-500">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 px-4 bg-fl-purple text-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-heading font-bold mb-4">Global Reach, London Heart</h2>
          <p className="text-gray-200 mb-8">Our headquarters at Canary Wharf, London — serving the world.</p>
          <div className="rounded-2xl overflow-hidden h-80 border border-white/20">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2482.2554151618!2d-0.02176902317757812!3d51.50444101011!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487602b9a1b4aaab%3A0x1cbfc254e61c7d0!2s1%20Canada%20Square%2C%20London%20E14%205AB!5e0!3m2!1sen!2suk!4v1709644800000!5m2!1sen!2suk" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" title="HQ Map"></iframe>
          </div>
        </div>
      </section>
    </div>
  )
}
