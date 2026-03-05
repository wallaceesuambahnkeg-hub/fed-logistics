import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setIsLoading(true); setError('');
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (data.success) { login(data.token, data.user); navigate('/dashboard'); }
      else setError(data.message || 'Error creating account.');
    } catch { setError('Connection error. Please try again.'); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen bg-fedex-light flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center items-center gap-2 mb-8">
          <Package className="w-10 h-10 text-fedex-orange" />
          <span className="text-3xl font-heading font-bold text-fedex-dark">FED <span className="text-fedex-orange">LOGISTICS</span></span>
        </Link>
        <h2 className="text-center text-3xl font-heading font-bold text-gray-900">Create an account</h2>
        <p className="mt-2 text-center text-sm text-gray-600">Already have one? <Link to="/login" className="font-medium text-fedex-purple hover:text-fedex-orange transition-colors">Log in here</Link></p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          <form className="space-y-5" onSubmit={handleSubmit}>
            {[
              { label: 'Full Name', icon: <User className="h-5 w-5 text-gray-400" />, type: 'text', val: name, set: setName, placeholder: 'John Doe' },
              { label: 'Email', icon: <Mail className="h-5 w-5 text-gray-400" />, type: 'email', val: email, set: setEmail, placeholder: 'you@example.com' },
              { label: 'Password', icon: <Lock className="h-5 w-5 text-gray-400" />, type: 'password', val: password, set: setPassword, placeholder: '8+ characters' },
              { label: 'Confirm Password', icon: <Lock className="h-5 w-5 text-gray-400" />, type: 'password', val: confirmPassword, set: setConfirmPassword, placeholder: '••••••••' },
            ].map(f => (
              <div key={f.label}>
                <label className="block text-sm font-medium text-gray-700">{f.label}</label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{f.icon}</div>
                  <input type={f.type} required className="focus:ring-fedex-orange focus:border-fedex-orange block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3 border outline-none transition-colors" placeholder={f.placeholder} value={f.val} onChange={e => f.set(e.target.value)} />
                </div>
              </div>
            ))}
            <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 rounded-md text-sm font-medium text-white bg-fedex-purple hover:bg-purple-900 transition-colors disabled:opacity-70">
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
