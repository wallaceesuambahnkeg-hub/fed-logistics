import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Package, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) { setStatus('error'); setMessage('Passwords do not match.'); return; }
    if (password.length < 8) { setStatus('error'); setMessage('Password must be at least 8 characters.'); return; }
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (data.success) { setStatus('success'); setTimeout(() => navigate('/login'), 3000); }
      else { setStatus('error'); setMessage(data.message || 'Invalid or expired reset link.'); }
    } catch { setStatus('error'); setMessage('Connection error. Please try again.'); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen bg-fedex-light flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center items-center gap-2 mb-8">
          <Package className="w-10 h-10 text-fedex-orange" />
          <span className="text-3xl font-heading font-bold text-fedex-dark">FED <span className="text-fedex-orange">LOGISTICS</span></span>
        </Link>
        <h2 className="text-center text-3xl font-heading font-bold text-gray-900">Set new password</h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
          {status === 'success' ? (
            <div className="text-center py-4">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Password Reset!</h3>
              <p className="text-gray-600">Redirecting you to login in 3 seconds...</p>
            </div>
          ) : (
            <>
              {status === 'error' && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-700">{message}</p>
                </div>
              )}
              {!token && (
                <div className="text-center py-4">
                  <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
                  <p className="text-gray-600">Invalid reset link. <Link to="/forgot-password" className="text-fedex-purple font-semibold">Request a new one.</Link></p>
                </div>
              )}
              {token && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {[{ label: 'New Password', val: password, set: setPassword }, { label: 'Confirm Password', val: confirmPassword, set: setConfirmPassword }].map(f => (
                    <div key={f.label}>
                      <label className="block text-sm font-medium text-gray-700">{f.label}</label>
                      <div className="mt-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-gray-400" /></div>
                        <input type="password" required minLength={8} className="focus:ring-fedex-orange focus:border-fedex-orange block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3 border outline-none" placeholder="••••••••" value={f.val} onChange={e => f.set(e.target.value)} />
                      </div>
                    </div>
                  ))}
                  <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 rounded-md text-sm font-medium text-white bg-fedex-purple hover:bg-purple-900 transition-colors disabled:opacity-70">
                    {isLoading ? 'Resetting...' : 'Reset Password'}
                  </button>
                </form>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
