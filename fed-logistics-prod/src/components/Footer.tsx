import { Link } from 'react-router-dom';
import { Package, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-fedex-dark text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
        {/* Brand */}
        <div className="flex flex-col gap-4">
          <Link to="/" className="flex items-center gap-2 group">
            <Package className="w-8 h-8 text-fedex-orange" />
            <span className="text-2xl font-heading font-bold tracking-tight text-white">
              FED <span className="text-fedex-orange">LOGISTICS</span>
            </span>
          </Link>
          <p className="text-sm leading-relaxed text-gray-400 mt-2 max-w-xs">
            Fast, reliable, and global shipping solutions for businesses and individuals worldwide.
          </p>
          <div className="flex items-center gap-4 mt-4">
            <a href="#" className="text-gray-400 hover:text-fedex-orange transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-fedex-orange transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-fedex-orange transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-fedex-orange transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Links Column 1 */}
        <div>
          <h3 className="text-white font-semibold mb-4 text-lg">Our Company</h3>
          <ul className="flex flex-col gap-3">
            <li><Link to="/about" className="hover:text-fedex-orange transition-colors">About Us</Link></li>
            <li><Link to="/careers" className="hover:text-fedex-orange transition-colors">Careers</Link></li>
            <li><Link to="/news" className="hover:text-fedex-orange transition-colors">Newsroom</Link></li>
            <li><Link to="/sustainability" className="hover:text-fedex-orange transition-colors">Sustainability</Link></li>
          </ul>
        </div>

        {/* Links Column 2 */}
        <div>
          <h3 className="text-white font-semibold mb-4 text-lg">Customer Support</h3>
          <ul className="flex flex-col gap-3">
            <li><Link to="/contact" className="hover:text-fedex-orange transition-colors">Contact Us</Link></li>
            <li><Link to="/faq" className="hover:text-fedex-orange transition-colors">FAQ</Link></li>
            <li><Link to="/track" className="hover:text-fedex-orange transition-colors">Track a Package</Link></li>
            <li><Link to="/locations" className="hover:text-fedex-orange transition-colors">Find Locations</Link></li>
          </ul>
        </div>

        {/* Links Column 3 */}
        <div>
          <h3 className="text-white font-semibold mb-4 text-lg">Legal</h3>
          <ul className="flex flex-col gap-3">
            <li><Link to="/terms" className="hover:text-fedex-orange transition-colors">Terms of Use</Link></li>
            <li><Link to="/privacy" className="hover:text-fedex-orange transition-colors">Privacy Policy</Link></li>
            <li><Link to="/security" className="hover:text-fedex-orange transition-colors">Security</Link></li>
            <li><Link to="/cookies" className="hover:text-fedex-orange transition-colors">Cookie Policy</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} Fed Logistics Corporation. All rights reserved.</p>
        <div className="flex gap-4">
          <span>English (US)</span>
        </div>
      </div>
    </footer>
  );
}
