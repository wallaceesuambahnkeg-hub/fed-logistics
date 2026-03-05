import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Package, LogOut, LayoutDashboard } from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useAuth();

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
          <Link to="/" className="flex items-center gap-2">
            <Package className={clsx('w-8 h-8', isScrolled ? 'text-fedex-orange' : 'text-white')} />
            <span className={clsx('text-2xl font-heading font-bold tracking-tight', isScrolled ? 'text-fedex-purple' : 'text-white')}>
              FED <span className="text-fedex-orange">LOGISTICS</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link key={link.name} to={link.path} className={clsx('font-medium transition-colors hover:text-fedex-orange', isScrolled ? 'text-gray-700' : 'text-gray-100', location.pathname === link.path && 'text-fedex-orange')}>
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <Link to="/dashboard" className={clsx('flex items-center gap-1 font-medium transition-colors hover:text-fedex-orange', isScrolled ? 'text-fedex-purple' : 'text-white')}>
                  <LayoutDashboard className="w-4 h-4" /> {user?.name.split(' ')[0]}
                </Link>
                <button onClick={handleLogout} className={clsx('flex items-center gap-1 font-medium transition-colors hover:text-red-500', isScrolled ? 'text-gray-600' : 'text-gray-200')}>
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={clsx('font-medium transition-colors hover:text-fedex-orange', isScrolled ? 'text-fedex-purple' : 'text-white')}>Log In</Link>
                <Link to="/signup" className="bg-fedex-orange hover:bg-orange-600 text-white px-5 py-2 rounded-full font-semibold transition-colors shadow-sm">Sign Up</Link>
              </>
            )}
          </div>

          <button className="md:hidden p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className={clsx('w-6 h-6', isScrolled ? 'text-fedex-purple' : 'text-white')} /> : <Menu className={clsx('w-6 h-6', isScrolled ? 'text-fedex-purple' : 'text-white')} />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t py-4 px-4 flex flex-col gap-4">
          {navLinks.map(link => (
            <Link key={link.name} to={link.path} className={clsx('text-lg font-medium p-2 rounded-md', location.pathname === link.path ? 'bg-orange-50 text-fedex-orange' : 'text-gray-800 hover:bg-gray-50')}>
              {link.name}
            </Link>
          ))}
          <div className="h-px bg-gray-200 my-2" />
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="text-lg font-medium text-fedex-purple p-2">Dashboard</Link>
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
