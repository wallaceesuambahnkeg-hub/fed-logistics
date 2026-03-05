import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Truck, Globe, ShieldCheck, Clock, Package, MapPin, Star } from 'lucide-react';
import { motion } from 'motion/react';

export default function Home() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const navigate = useNavigate();

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      navigate(`/track?number=${trackingNumber}`);
    }
  };

  const services = [
    { title: 'Express Shipping', icon: <Clock className="w-8 h-8 text-fedex-orange" />, desc: 'Next-day delivery for urgent shipments.' },
    { title: 'Ground Delivery', icon: <Truck className="w-8 h-8 text-fedex-orange" />, desc: 'Cost-effective shipping for everyday needs.' },
    { title: 'Freight', icon: <Package className="w-8 h-8 text-fedex-orange" />, desc: 'Heavy and oversized cargo solutions.' },
    { title: 'International', icon: <Globe className="w-8 h-8 text-fedex-orange" />, desc: 'Global reach to over 200 countries.' },
    { title: 'Returns', icon: <ArrowRight className="w-8 h-8 text-fedex-orange" />, desc: 'Simplified return processes for businesses.' },
    { title: 'Same-Day', icon: <ShieldCheck className="w-8 h-8 text-fedex-orange" />, desc: 'Immediate delivery within city limits.' },
  ];

  const stats = [
    { value: '200+', label: 'Countries Served' },
    { value: '10M+', label: 'Packages/Day' },
    { value: '99.9%', label: 'On-Time Delivery' },
  ];

  const testimonials = [
    { name: 'Sarah Jenkins', role: 'E-commerce Owner', text: 'Fed Logistics transformed our supply chain. Their reliability is unmatched.', rating: 5 },
    { name: 'Michael Chen', role: 'Logistics Manager', text: 'The tracking visibility gives us and our customers complete peace of mind.', rating: 5 },
    { name: 'Elena Rodriguez', role: 'Small Business CEO', text: 'Affordable rates without compromising on speed. Highly recommended.', rating: 4 },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative bg-fedex-purple text-white pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1586528116311-ad8ed7c80a30?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-fedex-purple via-fedex-purple/90 to-transparent z-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <h1 className="text-5xl md:text-6xl font-heading font-bold leading-tight mb-6">
              Fast. Reliable. <span className="text-fedex-orange">Global.</span>
            </h1>
            <p className="text-xl text-gray-200 mb-10 leading-relaxed">
              Connecting people and possibilities around the world with industry-leading shipping and logistics solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/track" className="bg-fedex-orange hover:bg-orange-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-colors shadow-lg flex items-center justify-center gap-2">
                Track a Package <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/ship" className="bg-white text-fedex-purple hover:bg-gray-100 px-8 py-4 rounded-full font-bold text-lg transition-colors shadow-lg flex items-center justify-center">
                Get a Quote
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tracking Widget */}
      <section className="relative -mt-12 z-30 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-4">
          <div className="flex-grow w-full">
            <form onSubmit={handleTrackSubmit} className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-6 w-6 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-lg text-lg focus:ring-fedex-orange focus:border-fedex-orange transition-colors"
                placeholder="Enter tracking number..."
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
              />
            </form>
          </div>
          <button 
            onClick={handleTrackSubmit}
            className="w-full md:w-auto bg-fedex-purple hover:bg-purple-900 text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors whitespace-nowrap"
          >
            Track
          </button>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-fedex-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-fedex-dark mb-4">Our Services</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Comprehensive logistics solutions tailored to meet the demands of your business.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-xl transition-shadow border border-gray-100 group"
              >
                <div className="bg-orange-50 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-fedex-dark mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.desc}</p>
                <Link to="/services" className="text-fedex-purple font-semibold flex items-center gap-1 hover:text-fedex-orange transition-colors">
                  Learn more <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-fedex-dark mb-6">Why Choose Fed Logistics?</h2>
              <p className="text-lg text-gray-600 mb-8">We combine global reach with local expertise to deliver your promises on time, every time.</p>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <Clock className="w-6 h-6 text-fedex-orange" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-fedex-dark mb-2">Unmatched Speed</h4>
                    <p className="text-gray-600">Optimized routing and dedicated fleets ensure the fastest delivery times in the industry.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <ShieldCheck className="w-6 h-6 text-fedex-orange" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-fedex-dark mb-2">Proven Reliability</h4>
                    <p className="text-gray-600">Advanced tracking and secure handling guarantee your shipments arrive safely.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <Globe className="w-6 h-6 text-fedex-orange" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-fedex-dark mb-2">Global Coverage</h4>
                    <p className="text-gray-600">An extensive network spanning over 200 countries and territories worldwide.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img src="https://images.unsplash.com/photo-1580674285054-bed31e145f59?q=80&w=2070&auto=format&fit=crop" alt="Logistics Warehouse" className="rounded-2xl shadow-2xl object-cover h-[500px] w-full" />
              <div className="absolute -bottom-8 -left-8 bg-fedex-purple text-white p-8 rounded-xl shadow-xl hidden md:block">
                <p className="text-4xl font-bold mb-2">40+</p>
                <p className="text-sm uppercase tracking-wider">Years of Excellence</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-16 bg-fedex-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-gray-700">
            {stats.map((stat, index) => (
              <div key={index} className="pt-8 md:pt-0">
                <p className="text-5xl font-heading font-bold text-fedex-orange mb-2">{stat.value}</p>
                <p className="text-lg text-gray-300 uppercase tracking-wide">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-fedex-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-fedex-dark mb-4">What Our Customers Say</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                  ))}
                </div>
                <p className="text-gray-700 italic mb-6">"{testimonial.text}"</p>
                <div>
                  <p className="font-bold text-fedex-dark">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-fedex-orange text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-heading font-bold mb-6">Ready to Ship?</h2>
          <p className="text-xl mb-10 opacity-90">Get a quote today and experience the Fed Logistics difference.</p>
          <Link to="/ship" className="inline-block bg-white text-fedex-orange hover:bg-gray-100 px-10 py-4 rounded-full font-bold text-lg transition-colors shadow-lg">
            Start Shipping Now
          </Link>
        </div>
      </section>
    </div>
  );
}
