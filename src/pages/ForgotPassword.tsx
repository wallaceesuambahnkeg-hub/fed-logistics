import { useState, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Package, Mail, AlertCircle, CheckCircle } from 'lucide-react'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (data.success) setDone(true)
      else setError(data.message || 'Something went wrong')
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
              <h2 className="text-xl font-bold text-gray-800 mb-2">Check your email!</h2>
              <p className="text-gray-500 mb-6 text-sm">If an account exists for <strong>{email}</strong>, we sent a reset link.</p>
              <Link to="/login" className="text-fl-purple font-bold hover:text-fl-orange">← Back to Login</Link>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-heading font-bold text-gray-900 mb-2">Reset Password</h2>
              <p className="text-sm text-gray-500 mb-6">Enter your email and we'll send a reset link.</p>
              {error && (
                <div className="flex items-center gap-3 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-5">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-fl-purple transition" />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="w-full bg-fl-purple hover:bg-purple-900 text-white py-3 rounded-xl font-bold transition disabled:opacity-60">
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
                <p className="text-center text-sm"><Link to="/login" className="text-fl-purple hover:text-fl-orange">← Back to Login</Link></p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
