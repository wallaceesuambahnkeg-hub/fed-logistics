import { useState, FormEvent } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { Package, Lock, AlertCircle, CheckCircle } from 'lucide-react'

export default function ResetPassword() {
  const [params] = useSearchParams()
  const token = params.get('token') || ''
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (password !== confirm) { setError('Passwords do not match'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })
      const data = await res.json()
      if (data.success) { setDone(true); setTimeout(() => navigate('/login'), 3000) }
      else setError(data.message || 'Invalid or expired link')
    } catch { setError('Connection error.') }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-fl-light flex flex-col justify-center py-12 px-4">
      <div className="max-w-md w-full mx-auto">
        <Link to="/" className="flex justify-center items-center gap-2 mb-8">
          <Package className="w-9 h-9 text-fl-orange" />
          <span className="text-2xl font-heading font-bold text-fl-purple">FED <span className="text-fl-orange">LOGISTICS</span></span>
        </Link>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {done ? (
            <div className="text-center py-4">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-800 mb-2">Password Reset!</h2>
              <p className="text-gray-500 text-sm">Redirecting you to login...</p>
            </div>
          ) : !token ? (
            <div className="text-center py-4">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
              <p className="text-gray-600">Invalid link. <Link to="/forgot-password" className="text-fl-purple font-bold">Request a new one</Link></p>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-heading font-bold text-gray-900 mb-6">Set New Password</h2>
              {error && (
                <div className="flex items-center gap-3 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-5">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-5">
                {[{ label: 'New Password', val: password, set: setPassword }, { label: 'Confirm Password', val: confirm, set: setConfirm }].map(f => (
                  <div key={f.label}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{f.label}</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input type="password" required value={f.val} onChange={e => f.set(e.target.value)} placeholder="••••••••" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-fl-purple transition" />
                    </div>
                  </div>
                ))}
                <button type="submit" disabled={loading} className="w-full bg-fl-purple hover:bg-purple-900 text-white py-3 rounded-xl font-bold transition disabled:opacity-60">
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
