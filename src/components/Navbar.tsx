import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, Package, LogOut, LayoutDashboard, Shield, ChevronDown } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const ADMIN_EMAIL = (import.meta as any).env?.VITE_ADMIN_EMAIL || 'wallaceesuambahnkeg@gmail.com'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const { isLoggedIn, user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const isAdmin = user?.email === ADMIN_EMAIL

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => { setOpen(false); setServicesOpen(false) }, [location.pathname])

  const bg = scrolled ? 'bg-white shadow-md' : 'bg-fl-purple'
  const txt = scrolled ? 'text-gray-700' : 'text-gray-100'
  const logo = scrolled ? 'text-fl-purple' : 'text-white'

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${bg} py-4`}>
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <Package className="w-7 h-7 text-fl-orange" />
          <span className={`text-xl font-heading font-bold ${logo}`}>FED <span className="text-fl-orange">LOGISTICS</span></span>
        </Link>

        <nav className="hidden lg:flex items-center gap-6">
          {[['/', 'Home'], ['/track', 'Track'], ['/ship', 'Ship']].map(([to, name]) => (
            <Link key={to} to={to} className={`text-sm font-medium transition-colors hover:text-fl-orange ${txt} ${location.pathname === to ? 'text-fl-orange' : ''}`}>{name}</Link>
          ))}
          {/* Services dropdown */}
          <div className="relative" onMouseEnter={() => setServicesOpen(true)} onMouseLeave={() => setServicesOpen(false)}>
            <button className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-fl-orange ${txt}`}>
              Services <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {servicesOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                {[['Services', '/services'], ['Capabilities Statement', '/capabilities'], ['Request a Quote', '/quote']].map(([n, h]) => (
                  <Link key={h} to={h} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-fl-orange font-medium transition-colors">{n}</Link>
                ))}
              </div>
            )}
          </div>
          {['/about', '/contact'].map((to) => (
            <Link key={to} to={to} className={`text-sm font-medium transition-colors hover:text-fl-orange ${txt} ${location.pathname === to ? 'text-fl-orange' : ''} capitalize`}>{to.replace('/', '')}</Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          {isLoggedIn ? (
            <>
              {isAdmin && (
                <Link to="/admin" className="flex items-center gap-1 bg-fl-orange text-white text-xs font-bold px-3 py-1.5 rounded-full hover:bg-orange-600 transition">
                  <Shield className="w-3 h-3" /> Admin
                </Link>
              )}
              <Link to="/dashboard" className={`flex items-center gap-1 text-sm font-medium hover:text-fl-orange ${txt}`}>
                <LayoutDashboard className="w-4 h-4" /> {user?.name.split(' ')[0]}
              </Link>
              <button onClick={() => { logout(); navigate('/') }} className={`flex items-center gap-1 text-sm font-medium hover:text-red-400 ${txt}`}>
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={`text-sm font-medium hover:text-fl-orange ${txt}`}>Log In</Link>
              <Link to="/quote" className="bg-fl-orange text-white text-sm font-bold px-5 py-2 rounded-full hover:bg-orange-600 transition">Get a Quote</Link>
            </>
          )}
        </div>

        <button className="lg:hidden" onClick={() => setOpen(!open)}>
          {open ? <X className={`w-6 h-6 ${scrolled ? 'text-fl-purple' : 'text-white'}`} />
                : <Menu className={`w-6 h-6 ${scrolled ? 'text-fl-purple' : 'text-white'}`} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-white border-t shadow-lg px-4 py-4 flex flex-col gap-2">
          {[['/', 'Home'], ['/track', 'Track'], ['/ship', 'Ship'], ['/services', 'Services'], ['/capabilities', 'Capabilities Statement'], ['/quote', 'Get a Quote'], ['/about', 'About'], ['/contact', 'Contact']].map(([to, name]) => (
            <Link key={to} to={to} className={`py-2 px-3 rounded-lg font-medium ${location.pathname === to ? 'bg-orange-50 text-fl-orange' : 'text-gray-800'}`}>{name}</Link>
          ))}
          <hr className="my-1" />
          {isLoggedIn ? (
            <>
              {isAdmin && <Link to="/admin" className="py-2 px-3 text-fl-orange font-bold flex items-center gap-2"><Shield className="w-4 h-4" /> Admin Panel</Link>}
              <Link to="/dashboard" className="py-2 px-3 text-fl-purple font-medium">Dashboard</Link>
              <button onClick={() => { logout(); navigate('/') }} className="py-2 px-3 text-red-500 font-medium text-left">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="py-2 px-3 text-fl-purple font-medium">Log In</Link>
              <Link to="/quote" className="py-3 bg-fl-orange text-white text-center rounded-lg font-bold">Get a Quote</Link>
            </>
          )}
        </div>
      )}
    </header>
  )
}
