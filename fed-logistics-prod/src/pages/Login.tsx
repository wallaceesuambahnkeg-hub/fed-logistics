import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [notVerified, setNotVerified] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); setError(''); setNotVerified(false);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) { login(data.token, data.user); navigate('/dashboard'); }
      else {
        setError(data.message || 'Invalid email or password.');
        if (data.notVerified) setNotVerified(true);
      }
    } catch { setError('Connection error. Please try again.'); }
    finally { setIsLoading(false); }
  };

  const handleResendVerification = async () => {
    setResendLoading(true);
    try {
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) setResendSuccess(true);
    } catch {}
    finally { setResendLoading(false); }
  };

  return (
    <div className="min-h-screen bg-fedex-light flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center items-center gap-2 mb-8">
          <Package className="w-10 h-10 text-fedex-orange" />
          <span className="text-3xl font-heading font-bold text-fedex-dark">FED <span className="text-fedex-orange">LOGISTICS</span></span>
        </Link>
        <h2 className="text-center text-3xl font-heading font-bold text-gray-900">Log in to your account</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or <Link to="/signup" className="font-medium text-fedex-purple hover:text-fedex-orange transition-colors">create a new account</Link>
        </p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-red-700">{error}</p>
                  {notVerified && !resendSuccess && (
                    <button onClick={handleResendVerification} disabled={resendLoading} className="mt-2 text-sm font-semibold text-fedex-purple hover:text-fedex-orange transition-colors underline">
                      {resendLoading ? 'Sending...' : 'Resend verification email'}
                    </button>
                  )}
                  {resendSuccess && <p className="mt-2 text-sm text-green-600 font-semibold">✅ Verification email sent! Check your inbox.</p>}
                </div>
              </div>
            </div>
          )}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email address</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Mail className="h-5 w-5 text-gray-400" /></div>
                <input type="email" required className="focus:ring-fedex-orange focus:border-fedex-orange block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3 border outline-none transition-colors" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <Link to="/forgot-password" className="text-sm font-medium text-fedex-purple hover:text-fedex-orange transition-colors">Forgot password?</Link>
              </div>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-gray-400" /></div>
                <input type="password" required className="focus:ring-fedex-orange focus:border-fedex-orange block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3 border outline-none transition-colors" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
              </div>
            </div>
            <div className="text-right">
              <Link to="/forgot-password" className="text-sm text-fedex-purple hover:text-fedex-orange font-medium transition-colors">
                Forgot your password?
              </Link>
            </div>
            <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 rounded-md text-sm font-medium text-white bg-fedex-purple hover:bg-purple-900 transition-colors disabled:opacity-70">
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
