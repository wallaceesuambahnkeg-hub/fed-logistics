import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Package, Mail, Lock, User, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (password !== confirm) { setError('Passwords do not match'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await res.json()
      if (data.success) { login(data.token, data.user); navigate('/dashboard') }
      else setError(data.message || 'Error creating account')
    } catch {
      setError('Connection error. Please try again.')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-fl-light flex flex-col justify-center py-12 px-4">
      <div className="max-w-md w-full mx-auto">
        <Link to="/" className="flex justify-center items-center gap-2 mb-8">
          <Package className="w-9 h-9 text-fl-orange" />
          <span className="text-2xl font-heading font-bold text-fl-purple">FED <span className="text-fl-orange">LOGISTICS</span></span>
        </Link>
        <h2 className="text-center text-3xl font-heading font-bold text-gray-900 mb-2">Create your account</h2>
        <p className="text-center text-sm text-gray-500 mb-8">
          Already have one? <Link to="/login" className="text-fl-purple font-semibold hover:text-fl-orange">Log in</Link>
        </p>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {error && (
            <div className="flex items-center gap-3 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            {[
              { label: 'Full Name', type: 'text', val: name, set: setName, icon: <User className="w-5 h-5 text-gray-400" />, placeholder: 'John Doe' },
              { label: 'Email', type: 'email', val: email, set: setEmail, icon: <Mail className="w-5 h-5 text-gray-400" />, placeholder: 'you@example.com' },
              { label: 'Password', type: 'password', val: password, set: setPassword, icon: <Lock className="w-5 h-5 text-gray-400" />, placeholder: 'Min. 8 characters' },
              { label: 'Confirm Password', type: 'password', val: confirm, set: setConfirm, icon: <Lock className="w-5 h-5 text-gray-400" />, placeholder: '••••••••' },
            ].map(f => (
              <div key={f.label}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">{f.label}</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2">{f.icon}</span>
                  <input
                    type={f.type} required
                    value={f.val} onChange={e => f.set(e.target.value)}
                    placeholder={f.placeholder}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-fl-orange focus:border-fl-orange transition"
                  />
                </div>
              </div>
            ))}
            <button
              type="submit" disabled={loading}
              className="w-full bg-fl-orange hover:bg-orange-600 text-white py-3 rounded-xl font-bold transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
