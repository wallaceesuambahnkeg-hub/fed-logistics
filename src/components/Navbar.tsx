import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, Package, LogOut, LayoutDashboard, Shield } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const ADMIN_EMAIL = (import.meta as any).env?.VITE_ADMIN_EMAIL || 'wallaceesuambahnkeg@gmail.com'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { isLoggedIn, user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const isAdmin = user?.email === ADMIN_EMAIL

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [location.pathname])

  const links = [
    { name: 'Home', to: '/' },
    { name: 'Track', to: '/track' },
    { name: 'Ship', to: '/ship' },
    { name: 'Services', to: '/services' },
    { name: 'About', to: '/about' },
    { name: 'Contact', to: '/contact' },
  ]

  const navBg = scrolled ? 'bg-white shadow-md' : 'bg-fl-purple'
  const textColor = scrolled ? 'text-gray-700' : 'text-gray-100'
  const logoColor = scrolled ? 'text-fl-purple' : 'text-white'

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg} py-4`}>
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <Package className="w-7 h-7 text-fl-orange" />
          <span className={`text-xl font-heading font-bold ${logoColor}`}>
            FED <span className="text-fl-orange">LOGISTICS</span>
          </span>
        </Link>

        {/* Desktop links */}
        <nav className="hidden md:flex items-center gap-6">
          {links.map(l => (
            <Link key={l.to} to={l.to} className={`text-sm font-medium transition-colors hover:text-fl-orange ${textColor} ${location.pathname === l.to ? 'text-fl-orange' : ''}`}>
              {l.name}
            </Link>
          ))}
        </nav>

        {/* Desktop auth */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <>
              {isAdmin && (
                <Link to="/admin" className="flex items-center gap-1 bg-fl-orange text-white text-xs font-bold px-3 py-1.5 rounded-full hover:bg-orange-600 transition-colors">
                  <Shield className="w-3 h-3" /> Admin
                </Link>
              )}
              <Link to="/dashboard" className={`flex items-center gap-1 text-sm font-medium hover:text-fl-orange transition-colors ${textColor}`}>
                <LayoutDashboard className="w-4 h-4" /> {user?.name.split(' ')[0]}
              </Link>
              <button onClick={() => { logout(); navigate('/') }} className={`flex items-center gap-1 text-sm font-medium hover:text-red-400 transition-colors ${textColor}`}>
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={`text-sm font-medium hover:text-fl-orange transition-colors ${textColor}`}>Log In</Link>
              <Link to="/signup" className="bg-fl-orange text-white text-sm font-bold px-5 py-2 rounded-full hover:bg-orange-600 transition-colors">Sign Up</Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open
            ? <X className={`w-6 h-6 ${scrolled ? 'text-fl-purple' : 'text-white'}`} />
            : <Menu className={`w-6 h-6 ${scrolled ? 'text-fl-purple' : 'text-white'}`} />
          }
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t shadow-lg px-4 py-4 flex flex-col gap-3">
          {links.map(l => (
            <Link key={l.to} to={l.to} className={`py-2 px-3 rounded-lg font-medium ${location.pathname === l.to ? 'bg-orange-50 text-fl-orange' : 'text-gray-800'}`}>
              {l.name}
            </Link>
          ))}
          <hr className="my-1" />
          {isLoggedIn ? (
            <>
              {isAdmin && <Link to="/admin" className="py-2 px-3 text-fl-orange font-bold flex items-center gap-2"><Shield className="w-4 h-4" /> Admin Panel</Link>}
              <Link to="/dashboard" className="py-2 px-3 text-fl-purple font-medium flex items-center gap-2"><LayoutDashboard className="w-4 h-4" /> Dashboard</Link>
              <button onClick={() => { logout(); navigate('/') }} className="py-2 px-3 text-red-500 font-medium text-left">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="py-2 px-3 text-fl-purple font-medium">Log In</Link>
              <Link to="/signup" className="py-3 bg-fl-orange text-white text-center rounded-lg font-bold">Sign Up Free</Link>
            </>
          )}
        </div>
      )}
    </header>
  )
}
