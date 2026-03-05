import { Truck, Globe, Clock, Package, ShieldCheck, ArrowRight, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export default function Services() {
  const services = [
    {
      id: 'express',
      title: 'Express Shipping',
      icon: <Clock className="w-10 h-10 text-fedex-orange" />,
      description: 'When time is of the essence, our express shipping guarantees next-day delivery for your most critical shipments.',
      features: ['Next business day delivery', 'Time-definite options (10:30 AM, 12:00 PM)', 'Money-back guarantee', 'Proactive tracking notifications'],
      price: 'From $25.00'
    },
    {
      id: 'ground',
      title: 'Ground Delivery',
      icon: <Truck className="w-10 h-10 text-fedex-orange" />,
      description: 'Cost-effective, reliable shipping for everyday packages. Ideal for non-urgent deliveries across the country.',
      features: ['1-5 business days delivery', 'Cost-effective rates', 'Residential and commercial delivery', 'Detailed tracking included'],
      price: 'From $9.50'
    },
    {
      id: 'international',
      title: 'International Shipping',
      icon: <Globe className="w-10 h-10 text-fedex-orange" />,
      description: 'Expand your business globally with our international shipping solutions reaching over 200 countries.',
      features: ['Customs clearance assistance', '2-5 days global delivery', 'Door-to-door service', 'International tracking'],
      price: 'From $45.00'
    },
    {
      id: 'freight',
      title: 'Freight Services',
      icon: <Package className="w-10 h-10 text-fedex-orange" />,
      description: 'Heavy, oversized, or bulk shipments? Our freight services handle cargo of any size with specialized equipment.',
      features: ['LTL and FTL options', 'Palletized shipping', 'Temperature-controlled transport', 'Dedicated account manager'],
      price: 'Custom Quote'
    },
    {
      id: 'returns',
      title: 'Returns Management',
      icon: <ArrowRight className="w-10 h-10 text-fedex-orange" />,
      description: 'Simplify the return process for your customers with our streamlined returns management solutions.',
      features: ['Printable return labels', 'Drop-off at 10,000+ locations', 'Automated refunds integration', 'Return analytics dashboard'],
      price: 'Volume Based'
    },
    {
      id: 'sameday',
      title: 'Same-Day Delivery',
      icon: <ShieldCheck className="w-10 h-10 text-fedex-orange" />,
      description: 'For absolute emergencies, our same-day service ensures your package arrives within hours.',
      features: ['Delivery within hours', 'Available 24/7/365', 'Dedicated courier', 'Real-time GPS tracking'],
      price: 'From $85.00'
    }
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-fedex-dark text-white pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-heading font-bold mb-6"
          >
            Shipping Services & Solutions
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            From local deliveries to global supply chains, we have the right service to meet your speed and budget requirements.
          </motion.p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-fedex-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div 
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100 overflow-hidden flex flex-col h-full"
              >
                <div className="p-8 flex-grow">
                  <div className="bg-orange-50 w-20 h-20 rounded-2xl flex items-center justify-center mb-6">
                    {service.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-fedex-dark mb-4">{service.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                  
                  <ul className="space-y-3 mb-8">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-700">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-gray-50 p-6 border-t border-gray-100 flex items-center justify-between mt-auto">
                  <div>
                    <span className="block text-sm text-gray-500 uppercase tracking-wider font-semibold">Starting At</span>
                    <span className="text-xl font-bold text-fedex-dark">{service.price}</span>
                  </div>
                  <Link 
                    to="/ship" 
                    className="bg-fedex-purple hover:bg-purple-900 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                  >
                    Ship Now
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-fedex-dark mb-4">Compare Services</h2>
            <p className="text-lg text-gray-600">Find the perfect balance of speed and cost for your shipment.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-fedex-dark text-white">
                  <th className="p-4 font-semibold rounded-tl-lg">Service</th>
                  <th className="p-4 font-semibold">Delivery Time</th>
                  <th className="p-4 font-semibold">Best For</th>
                  <th className="p-4 font-semibold">Tracking</th>
                  <th className="p-4 font-semibold rounded-tr-lg">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-bold text-fedex-dark">Same-Day</td>
                  <td className="p-4 text-gray-600">Within hours</td>
                  <td className="p-4 text-gray-600">Emergencies, medical supplies</td>
                  <td className="p-4 text-green-600 font-semibold">Real-time GPS</td>
                  <td className="p-4 font-semibold">$$$$</td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-bold text-fedex-dark">Express</td>
                  <td className="p-4 text-gray-600">Next business day</td>
                  <td className="p-4 text-gray-600">Urgent documents, perishables</td>
                  <td className="p-4 text-green-600 font-semibold">Detailed</td>
                  <td className="p-4 font-semibold">$$$</td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-bold text-fedex-dark">Ground</td>
                  <td className="p-4 text-gray-600">1-5 business days</td>
                  <td className="p-4 text-gray-600">Standard retail, everyday items</td>
                  <td className="p-4 text-green-600 font-semibold">Detailed</td>
                  <td className="p-4 font-semibold">$$</td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-bold text-fedex-dark">Freight</td>
                  <td className="p-4 text-gray-600">Varies by route</td>
                  <td className="p-4 text-gray-600">Pallets, heavy machinery (&gt;150 lbs)</td>
                  <td className="p-4 text-green-600 font-semibold">Milestone</td>
                  <td className="p-4 font-semibold">Custom</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
