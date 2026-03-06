import { Link } from 'react-router-dom'
import { Package, MapPin, Phone, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-fl-dark text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-6 h-6 text-fl-orange" />
            <span className="text-white font-heading font-bold text-lg">FED <span className="text-fl-orange">LOGISTICS</span></span>
          </div>
          <p className="text-sm leading-relaxed">Fast, reliable shipping solutions connecting the UK to the world.</p>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {[['Track Package', '/track'], ['Ship Now', '/ship'], ['Services', '/services'], ['About Us', '/about']].map(([n, h]) => (
              <li key={h}><Link to={h} className="hover:text-fl-orange transition-colors">{n}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">Account</h4>
          <ul className="space-y-2 text-sm">
            {[['Log In', '/login'], ['Sign Up', '/signup'], ['Dashboard', '/dashboard'], ['Contact', '/contact']].map(([n, h]) => (
              <li key={h}><Link to={h} className="hover:text-fl-orange transition-colors">{n}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">Contact</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2"><MapPin className="w-4 h-4 text-fl-orange mt-0.5 flex-shrink-0" />1 Canada Square, Canary Wharf, London E14 5AB, UK</li>
            <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-fl-orange flex-shrink-0" />+44 7735 380906</li>
            <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-fl-orange flex-shrink-0" />support@fedlogistics.com</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-700 pt-6 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Fed Logistics Ltd. All rights reserved.
      </div>
    </footer>
  )
}
