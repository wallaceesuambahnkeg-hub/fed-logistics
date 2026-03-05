import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Package, LogOut, LayoutDashboard, Shield } from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '../context/AuthContext';

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'admin@fedlogistics.com';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useAuth();
  const isAdmin = user?.email === ADMIN_EMAIL;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setIsMobileMenuOpen(false); }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Track', path: '/track' },
    { name: 'Ship', path: '/ship' },
    { name: 'Services', path: '/services' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <header className={clsx('fixed top-0 left-0 right-0 z-50 transition-all duration-300', isScrolled ? 'bg-white shadow-md py-3' : 'bg-fedex-purple text-white py-5')}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Package className={clsx('w-8 h-8', isScrolled ? 'text-fedex-orange' : 'text-white')} />
            <span className={clsx('text-2xl font-heading font-bold tracking-tight', isScrolled ? 'text-fedex-purple' : 'text-white')}>
              FED <span className="text-fedex-orange">LOGISTICS</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <Link key={link.name} to={link.path} className={clsx('font-medium transition-colors hover:text-fedex-orange text-sm', isScrolled ? 'text-gray-700' : 'text-gray-100', location.pathname === link.path && 'text-fedex-orange')}>
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <>
                {isAdmin && (
                  <Link to="/admin" className={clsx('flex items-center gap-1 text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors', isScrolled ? 'bg-fedex-purple text-white hover:bg-purple-900' : 'bg-white/20 text-white hover:bg-white/30')}>
                    <Shield className="w-4 h-4" /> Admin
                  </Link>
                )}
                <Link to="/dashboard" className={clsx('flex items-center gap-1 font-medium transition-colors hover:text-fedex-orange text-sm', isScrolled ? 'text-fedex-purple' : 'text-white')}>
                  <LayoutDashboard className="w-4 h-4" /> {user?.name.split(' ')[0]}
                </Link>
                <button onClick={handleLogout} className={clsx('flex items-center gap-1 text-sm font-medium transition-colors hover:text-red-500', isScrolled ? 'text-gray-500' : 'text-gray-300')}>
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={clsx('font-medium transition-colors hover:text-fedex-orange text-sm', isScrolled ? 'text-fedex-purple' : 'text-white')}>Log In</Link>
                <Link to="/signup" className="bg-fedex-orange hover:bg-orange-600 text-white px-5 py-2 rounded-full font-semibold transition-colors shadow-sm text-sm">Sign Up</Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button className="md:hidden p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className={clsx('w-6 h-6', isScrolled ? 'text-fedex-purple' : 'text-white')} /> : <Menu className={clsx('w-6 h-6', isScrolled ? 'text-fedex-purple' : 'text-white')} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t py-4 px-4 flex flex-col gap-3">
          {navLinks.map(link => (
            <Link key={link.name} to={link.path} className={clsx('text-lg font-medium p-2 rounded-md', location.pathname === link.path ? 'bg-orange-50 text-fedex-orange' : 'text-gray-800 hover:bg-gray-50')}>
              {link.name}
            </Link>
          ))}
          <div className="h-px bg-gray-200 my-1" />
          {isLoggedIn ? (
            <>
              {isAdmin && <Link to="/admin" className="text-lg font-medium text-fedex-purple p-2 flex items-center gap-2"><Shield className="w-5 h-5" /> Admin Panel</Link>}
              <Link to="/dashboard" className="text-lg font-medium text-fedex-purple p-2 flex items-center gap-2"><LayoutDashboard className="w-5 h-5" /> My Dashboard</Link>
              <button onClick={handleLogout} className="text-left text-lg font-medium text-red-500 p-2">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-lg font-medium text-fedex-purple p-2">Log In</Link>
              <Link to="/signup" className="bg-fedex-orange text-white text-center py-3 rounded-md font-semibold">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
