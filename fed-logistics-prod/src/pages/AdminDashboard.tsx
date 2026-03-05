import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Package, Users, MessageSquare, TrendingUp, Truck, CheckCircle, Clock, AlertCircle, ChevronDown, ChevronUp, Trash2, RefreshCw, X, MapPin, DollarSign, Shield } from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

interface Stats {
  totalShipments: number;
  totalUsers: number;
  totalMessages: number;
  inTransit: number;
  delivered: number;
  pending: number;
  revenue: string;
}

interface Shipment {
  id: number;
  tracking_number: string;
  user_name: string;
  user_email: string;
  status: string;
  origin: string;
  destination: string;
  weight: number;
  service: string;
  price: number;
  estimated_delivery: string;
  created_at: string;
  history: { id: number; status: string; location: string; date: string; completed: boolean }[];
}

interface User { id: number; name: string; email: string; created_at: string; }
interface Message { id: number; name: string; email: string; subject: string; message: string; created_at: string; }

const STATUSES = ['Order Created', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered'];

const statusColor = (status: string) => {
  if (status === 'Delivered') return 'bg-green-100 text-green-800';
  if (status === 'Out for Delivery') return 'bg-blue-100 text-blue-800';
  if (status === 'In Transit') return 'bg-yellow-100 text-yellow-800';
  if (status === 'Picked Up') return 'bg-purple-100 text-purple-800';
  return 'bg-gray-100 text-gray-700';
};

export default function AdminDashboard() {
  const { token, user } = useAuth();
  const [tab, setTab] = useState<'overview' | 'shipments' | 'users' | 'messages'>('overview');
  const [stats, setStats] = useState<Stats | null>(null);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedShipment, setExpandedShipment] = useState<number | null>(null);
  const [updating, setUpdating] = useState<number | null>(null);
  const [updateForm, setUpdateForm] = useState<{ status: string; location: string }>({ status: '', location: '' });
  const [successMsg, setSuccessMsg] = useState('');

  const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

  const fetchAll = async () => {
    setIsLoading(true); setError('');
    try {
      const [statsRes, shipmentsRes, usersRes, messagesRes] = await Promise.all([
        fetch('/api/admin/stats', { headers }),
        fetch('/api/admin/shipments', { headers }),
        fetch('/api/admin/users', { headers }),
        fetch('/api/admin/messages', { headers }),
      ]);
      const [s, sh, u, m] = await Promise.all([statsRes.json(), shipmentsRes.json(), usersRes.json(), messagesRes.json()]);
      if (s.success) setStats(s.stats);
      if (sh.success) setShipments(sh.shipments);
      if (u.success) setUsers(u.users);
      if (m.success) setMessages(m.messages);
      if (!s.success) setError(s.message || 'Access denied. Admin only.');
    } catch { setError('Connection error. Please refresh.'); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleUpdateStatus = async (shipmentId: number) => {
    if (!updateForm.status) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/shipments/${shipmentId}/status`, {
        method: 'PUT', headers,
        body: JSON.stringify({ status: updateForm.status, location: updateForm.location }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(data.message);
        setUpdating(null);
        setUpdateForm({ status: '', location: '' });
        setTimeout(() => setSuccessMsg(''), 3000);
        fetchAll();
      } else setError(data.message);
    } catch { setError('Update failed.'); }
    finally { setIsLoading(false); }
  };

  const handleDelete = async (shipmentId: number) => {
    if (!confirm('Are you sure you want to delete this shipment?')) return;
    try {
      const res = await fetch(`/api/admin/shipments/${shipmentId}`, { method: 'DELETE', headers });
      const data = await res.json();
      if (data.success) { setSuccessMsg('Shipment deleted.'); setTimeout(() => setSuccessMsg(''), 3000); fetchAll(); }
    } catch { setError('Delete failed.'); }
  };

  // Access denied screen
  if (error && error.includes('Admin')) {
    return (
      <div className="min-h-screen bg-fedex-light pt-24 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-md">
          <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Admin Access Only</h2>
          <p className="text-gray-500 mb-6">You don't have permission to view this page.</p>
          <Link to="/" className="bg-fedex-purple text-white px-6 py-3 rounded-lg font-bold hover:bg-purple-900 transition-colors">Go Home</Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'shipments', label: `Shipments (${shipments.length})`, icon: <Package className="w-4 h-4" /> },
    { id: 'users', label: `Users (${users.length})`, icon: <Users className="w-4 h-4" /> },
    { id: 'messages', label: `Messages (${messages.length})`, icon: <MessageSquare className="w-4 h-4" /> },
  ];

  return (
    <div className="bg-fedex-light min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="bg-fedex-purple p-2 rounded-lg"><Shield className="w-5 h-5 text-white" /></div>
              <h1 className="text-3xl font-heading font-bold text-fedex-dark">Admin Dashboard</h1>
            </div>
            <p className="text-gray-500 ml-11">Logged in as <span className="font-semibold text-fedex-purple">{user?.email}</span></p>
          </div>
          <button onClick={fetchAll} className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>

        {/* Success Message */}
        <AnimatePresence>
          {successMsg && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md mb-6 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <p className="text-green-700 font-medium">{successMsg}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        {error && !error.includes('Admin') && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md mb-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-white rounded-xl p-2 shadow-sm border border-gray-100 overflow-x-auto">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id as any)} className={clsx('flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm whitespace-nowrap transition-all', tab === t.id ? 'bg-fedex-purple text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100')}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-fedex-purple border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* OVERVIEW TAB */}
            {tab === 'overview' && stats && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {[
                    { label: 'Total Shipments', value: stats.totalShipments, icon: <Package className="w-6 h-6 text-fedex-purple" />, bg: 'bg-purple-50', color: 'text-fedex-purple' },
                    { label: 'Total Users', value: stats.totalUsers, icon: <Users className="w-6 h-6 text-blue-600" />, bg: 'bg-blue-50', color: 'text-blue-600' },
                    { label: 'Total Revenue', value: `$${stats.revenue}`, icon: <DollarSign className="w-6 h-6 text-green-600" />, bg: 'bg-green-50', color: 'text-green-600' },
                    { label: 'Contact Messages', value: stats.totalMessages, icon: <MessageSquare className="w-6 h-6 text-fedex-orange" />, bg: 'bg-orange-50', color: 'text-fedex-orange' },
                  ].map((s, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
                      <div className={clsx('w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0', s.bg)}>{s.icon}</div>
                      <div>
                        <p className={clsx('text-3xl font-bold', s.color)}>{s.value}</p>
                        <p className="text-sm text-gray-500">{s.label}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {[
                    { label: 'Pending / Picked Up', value: stats.pending, icon: <Clock className="w-6 h-6 text-yellow-600" />, bg: 'bg-yellow-50' },
                    { label: 'In Transit', value: stats.inTransit, icon: <Truck className="w-6 h-6 text-blue-600" />, bg: 'bg-blue-50' },
                    { label: 'Delivered', value: stats.delivered, icon: <CheckCircle className="w-6 h-6 text-green-600" />, bg: 'bg-green-50' },
                  ].map((s, i) => (
                    <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
                      <div className={clsx('w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0', s.bg)}>{s.icon}</div>
                      <div>
                        <p className="text-3xl font-bold text-fedex-dark">{s.value}</p>
                        <p className="text-sm text-gray-500">{s.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* SHIPMENTS TAB */}
            {tab === 'shipments' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-fedex-dark">All Shipments</h2>
                  <p className="text-sm text-gray-500 mt-1">Click a shipment to update its tracking status</p>
                </div>
                {shipments.length === 0 ? (
                  <div className="text-center py-16 text-gray-400">
                    <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No shipments yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {shipments.map(s => (
                      <div key={s.id} className="p-6">
                        {/* Shipment Row */}
                        <div className="flex flex-col sm:flex-row justify-between gap-4">
                          <div className="flex-grow">
                            <div className="flex items-center gap-3 flex-wrap mb-2">
                              <span className="font-mono font-bold text-fedex-purple text-lg">{s.tracking_number}</span>
                              <span className={clsx('px-3 py-1 rounded-full text-xs font-semibold', statusColor(s.status))}>{s.status}</span>
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full capitalize">{s.service}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                              <MapPin className="w-4 h-4 text-gray-400" /> {s.origin} → {s.destination}
                            </div>
                            <div className="flex items-center gap-4 text-xs text-gray-400">
                              <span>👤 {s.user_name || 'Guest'} ({s.user_email || 'N/A'})</span>
                              <span>⚖️ {s.weight} lbs</span>
                              {s.price && <span className="text-fedex-orange font-semibold">${s.price}</span>}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button onClick={() => { setExpandedShipment(expandedShipment === s.id ? null : s.id); setUpdating(null); }} className="flex items-center gap-1 bg-fedex-light text-fedex-purple px-3 py-2 rounded-lg text-sm font-semibold hover:bg-purple-50 transition-colors">
                              {expandedShipment === s.id ? <><ChevronUp className="w-4 h-4" /> Hide</> : <><ChevronDown className="w-4 h-4" /> Manage</>}
                            </button>
                            <button onClick={() => handleDelete(s.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Expanded Management Panel */}
                        <AnimatePresence>
                          {expandedShipment === s.id && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-6 overflow-hidden">
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                                {/* Tracking Timeline */}
                                <div className="bg-gray-50 rounded-xl p-5">
                                  <h4 className="font-bold text-gray-800 mb-4">Current Tracking Timeline</h4>
                                  <div className="space-y-3">
                                    {s.history.map((h, i) => (
                                      <div key={i} className={clsx('flex items-start gap-3 p-3 rounded-lg', h.completed ? 'bg-white border border-green-100' : 'opacity-40')}>
                                        <div className={clsx('w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold', h.completed ? 'bg-fedex-purple text-white' : 'bg-gray-200 text-gray-400')}>
                                          {h.completed ? '✓' : i + 1}
                                        </div>
                                        <div>
                                          <p className="font-semibold text-sm text-gray-800">{h.status}</p>
                                          {h.location && <p className="text-xs text-gray-500">{h.location}</p>}
                                          {h.date && <p className="text-xs text-gray-400">{h.date}</p>}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Update Status Form */}
                                <div className="bg-fedex-purple/5 rounded-xl p-5 border border-fedex-purple/20">
                                  <h4 className="font-bold text-fedex-dark mb-4 flex items-center gap-2">
                                    <Truck className="w-5 h-5 text-fedex-purple" /> Update Tracking Status
                                  </h4>
                                  <div className="space-y-4">
                                    <div>
                                      <label className="block text-sm font-semibold text-gray-700 mb-2">New Status</label>
                                      <select value={updating === s.id ? updateForm.status : ''} onChange={e => { setUpdating(s.id); setUpdateForm({ ...updateForm, status: e.target.value }); }} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fedex-purple outline-none bg-white">
                                        <option value="">-- Select Status --</option>
                                        {STATUSES.map(st => <option key={st} value={st}>{st}</option>)}
                                      </select>
                                    </div>
                                    <div>
                                      <label className="block text-sm font-semibold text-gray-700 mb-2">Current Location <span className="text-gray-400 font-normal">(optional)</span></label>
                                      <input type="text" placeholder="e.g. London Heathrow, UK" value={updating === s.id ? updateForm.location : ''} onChange={e => { setUpdating(s.id); setUpdateForm({ ...updateForm, location: e.target.value }); }} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fedex-purple outline-none" />
                                    </div>
                                    <button onClick={() => handleUpdateStatus(s.id)} disabled={updating !== s.id || !updateForm.status || isLoading} className="w-full bg-fedex-purple hover:bg-purple-900 text-white py-3 rounded-lg font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                                      {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <CheckCircle className="w-5 h-5" />}
                                      Update Status
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* USERS TAB */}
            {tab === 'users' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-fedex-dark">Registered Users</h2>
                </div>
                {users.length === 0 ? (
                  <div className="text-center py-16 text-gray-400"><Users className="w-12 h-12 mx-auto mb-3 opacity-30" /><p>No users yet</p></div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {users.map((u, i) => (
                      <div key={u.id} className="p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-fedex-purple rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">{u.name}</p>
                            <p className="text-sm text-gray-500">{u.email}</p>
                          </div>
                        </div>
                        <div className="text-right text-xs text-gray-400">
                          <p>Joined</p>
                          <p>{new Date(u.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* MESSAGES TAB */}
            {tab === 'messages' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-fedex-dark">Contact Messages</h2>
                </div>
                {messages.length === 0 ? (
                  <div className="text-center py-16 text-gray-400"><MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" /><p>No messages yet</p></div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {messages.map(m => (
                      <div key={m.id} className="p-6">
                        <div className="flex justify-between items-start mb-3 flex-wrap gap-2">
                          <div>
                            <p className="font-bold text-gray-800">{m.name}</p>
                            <p className="text-sm text-fedex-purple">{m.email}</p>
                          </div>
                          <div className="text-right text-xs text-gray-400">
                            <p>{new Date(m.created_at).toLocaleDateString()}</p>
                            <p>{new Date(m.created_at).toLocaleTimeString()}</p>
                          </div>
                        </div>
                        <p className="text-sm font-semibold text-fedex-orange mb-2">Re: {m.subject}</p>
                        <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-4">{m.message}</p>
                        <a href={`mailto:${m.email}`} className="inline-flex items-center gap-1 mt-3 text-sm text-fedex-purple font-semibold hover:text-fedex-orange transition-colors">
                          Reply via Email →
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
