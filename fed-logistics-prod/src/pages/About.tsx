import { motion } from 'motion/react';
import { Target, Heart, Shield, Users, Globe2, Award } from 'lucide-react';

export default function About() {
  const values = [
    { icon: <Target className="w-8 h-8 text-fedex-orange" />, title: 'Mission', desc: 'To connect people and possibilities through innovative, reliable logistics solutions.' },
    { icon: <Heart className="w-8 h-8 text-fedex-orange" />, title: 'Customer First', desc: 'We prioritize our customers\' needs, ensuring every package is handled with care.' },
    { icon: <Shield className="w-8 h-8 text-fedex-orange" />, title: 'Integrity', desc: 'We operate with transparency, honesty, and a commitment to ethical business practices.' },
    { icon: <Users className="w-8 h-8 text-fedex-orange" />, title: 'Teamwork', desc: 'Our diverse global team collaborates to deliver exceptional results every day.' },
    { icon: <Globe2 className="w-8 h-8 text-fedex-orange" />, title: 'Sustainability', desc: 'We are dedicated to reducing our environmental impact and promoting green logistics.' },
    { icon: <Award className="w-8 h-8 text-fedex-orange" />, title: 'Excellence', desc: 'We strive for continuous improvement and operational excellence in all we do.' },
  ];

  const team = [
    { name: 'David Reynolds', role: 'Chief Executive Officer', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop' },
    { name: 'Sarah Jenkins', role: 'Chief Operations Officer', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop' },
    { name: 'Michael Chen', role: 'Head of Global Logistics', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop' },
    { name: 'Elena Rodriguez', role: 'VP of Customer Experience', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop' },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative bg-fedex-dark text-white pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-fedex-dark via-fedex-dark/80 to-transparent z-10"></div>
        
        <div className="max-w-7xl mx-auto relative z-20">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              Delivering More Than Packages
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Since our founding, Fed Logistics has been committed to connecting the world through fast, reliable, and innovative shipping solutions. We don't just move boxes; we move businesses forward.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-fedex-dark mb-6">Our Story</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                What started as a small regional courier service has grown into a global logistics powerhouse. For over 40 years, Fed Logistics has pioneered new ways to move goods faster, safer, and more efficiently.
              </p>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Today, our network spans over 200 countries and territories, powered by a dedicated team of over 500,000 employees worldwide. We leverage cutting-edge technology and a massive fleet of aircraft and vehicles to ensure your promises are kept.
              </p>
              <div className="bg-orange-50 p-6 rounded-xl border-l-4 border-fedex-orange">
                <p className="text-fedex-dark font-semibold italic">
                  "Our success is built on a simple premise: when we deliver for our customers, we deliver for the world."
                </p>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=2070&auto=format&fit=crop" alt="Fed Logistics History" className="rounded-2xl shadow-2xl object-cover h-[500px] w-full" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-fedex-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-fedex-dark mb-4">Our Core Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">The principles that guide our decisions and shape our culture every single day.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((val, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow"
              >
                <div className="inline-flex items-center justify-center bg-orange-50 w-16 h-16 rounded-full mb-6">
                  {val.icon}
                </div>
                <h3 className="text-xl font-bold text-fedex-dark mb-3">{val.title}</h3>
                <p className="text-gray-600 leading-relaxed">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-fedex-dark mb-4">Leadership Team</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Meet the experts driving our vision forward.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="relative overflow-hidden rounded-2xl mb-4 aspect-[3/4]">
                  <img src={member.image} alt={member.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h3 className="text-xl font-bold text-fedex-dark">{member.name}</h3>
                <p className="text-fedex-orange font-medium">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Coverage Map Placeholder */}
      <section className="py-20 bg-fedex-dark text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">Global Reach, Local Expertise</h2>
          <p className="text-xl text-gray-300 mb-12">Operating in over 200 countries and territories worldwide.</p>
          
          <div className="relative w-full aspect-[2/1] bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 flex items-center justify-center">
            {/* Placeholder for SVG Map */}
            <Globe2 className="w-32 h-32 text-gray-600 opacity-50" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiM0ZDE0OGMiIG9wYWNpdHk9IjAuNSIvPjwvc3ZnPg==')] opacity-20"></div>
            <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-fedex-orange rounded-full animate-ping"></div>
            <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-fedex-orange rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute bottom-1/3 left-1/2 w-3 h-3 bg-fedex-orange rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>
      </section>
    </div>
  );
}
