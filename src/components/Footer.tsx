import { Link } from 'react-router-dom'
import { Package, MapPin, Phone, Mail, Clock, Shield } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-fl-dark text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-6 h-6 text-fl-orange" />
            <span className="text-white font-heading font-bold text-lg">FED <span className="text-fl-orange">LOGISTICS</span></span>
          </div>
          <p className="text-sm leading-relaxed mb-4">Trusted logistics partner for federal agencies and commercial enterprises. Serving clients in 200+ countries from London, UK.</p>
          <div className="flex flex-wrap gap-2">
            {['SSL Secured', 'Insured & Bonded', 'SAM.gov Registered'].map(b => (
              <span key={b} className="flex items-center gap-1 text-xs bg-white/10 px-2 py-1 rounded-full text-gray-300">
                <Shield className="w-3 h-3 text-green-400" /> {b}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4">Services</h4>
          <ul className="space-y-2 text-sm">
            {[['Transportation Management', '/services'], ['Express & Same-Day', '/services'], ['International Freight', '/services'], ['Supply Chain Management', '/services'], ['Capabilities Statement', '/capabilities']].map(([n, h]) => (
              <li key={n}><Link to={h} className="hover:text-fl-orange transition-colors">{n}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4">Company</h4>
          <ul className="space-y-2 text-sm">
            {[['About Us', '/about'], ['Services', '/services'], ['Request a Quote', '/quote'], ['Track Shipment', '/track'], ['Ship a Package', '/ship'], ['Contact Us', '/contact']].map(([n, h]) => (
              <li key={n}><Link to={h} className="hover:text-fl-orange transition-colors">{n}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4">Head Office</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2"><MapPin className="w-4 h-4 text-fl-orange mt-0.5 flex-shrink-0" /><span>1 Canada Square, Canary Wharf<br />London E14 5AB, UK</span></li>
            <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-fl-orange flex-shrink-0" />+44 7735 380906</li>
            <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-fl-orange flex-shrink-0" />info@fedlogisticscorp.com</li>
            <li className="flex items-start gap-2"><Clock className="w-4 h-4 text-fl-orange mt-0.5 flex-shrink-0" /><span>Mon–Fri: 8am–8pm<br />Sat: 9am–5pm GMT</span></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-700 pt-6 px-4 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-gray-500">
        <p>© {new Date().getFullYear()} Fed Logistics Ltd. All rights reserved. Registered in England & Wales.</p>
        <div className="flex gap-4">
          <Link to="/contact" className="hover:text-gray-300">Privacy Policy</Link>
          <Link to="/contact" className="hover:text-gray-300">Terms of Service</Link>
          <Link to="/capabilities" className="hover:text-gray-300">Capabilities Statement</Link>
        </div>
      </div>
    </footer>
  )
}
