import { useState, useEffect } from 'react'
import { Package, Users, MessageSquare, TrendingUp, Truck, CheckCircle, Clock, RefreshCw, Trash2, ChevronDown, ChevronUp, DollarSign, Shield, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

interface Stats { totalShipments: number; totalUsers: number; totalMessages: number; inTransit: number; delivered: number; pending: number; revenue: string }
interface Shipment { id: number; tracking_number: string; user_name: string; user_email: string; status: string; origin: string; destination: string; weight: number; service: string; price: number; created_at: string; history: { id: number; status: string; location: string; date: string; completed: boolean }[] }
interface User { id: number; name: string; email: string; created_at: string }
interface Message { id: number; name: string; email: string; subject: string; message: string; created_at: string }

const STATUSES = ['Order Created', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered']

export default function Admin() {
  const { token } = useAuth()
  const [tab, setTab] = useState<'overview' | 'shipments' | 'users' | 'messages'>('overview')
  const [stats, setStats] = useState<Stats | null>(null)
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<number | null>(null)
  const [updating, setUpdating] = useState<{ id: number; status: string; location: string } | null>(null)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const H = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

  async function fetchAll() {
    setLoading(true)
    try {
      const [s, sh, u, m] = await Promise.all([
        fetch('/api/admin/stats', { headers: H }).then(r => r.json()),
        fetch('/api/admin/shipments', { headers: H }).then(r => r.json()),
        fetch('/api/admin/users', { headers: H }).then(r => r.json()),
        fetch('/api/admin/messages', { headers: H }).then(r => r.json()),
      ])
      if (s.success) setStats(s.stats); else { setError(s.message); return }
      if (sh.success) setShipments(sh.shipments)
      if (u.success) setUsers(u.users)
      if (m.success) setMessages(m.messages)
    } catch { setError('Connection error') } finally { setLoading(false) }
  }

  useEffect(() => { fetchAll() }, [])

  async function updateStatus(id: number, status: string, location: string) {
    try {
      const res = await fetch(`/api/admin/shipments/${id}/status`, { method: 'PUT', headers: H, body: JSON.stringify({ status, location }) })
      const d = await res.json()
      if (d.success) { setSuccess(d.message); setExpanded(null); setUpdating(null); setTimeout(() => setSuccess(''), 3000); fetchAll() }
      else setError(d.message)
    } catch { setError('Update failed') }
  }

  async function deleteShipment(id: number) {
    if (!confirm('Delete this shipment?')) return
    try {
      await fetch(`/api/admin/shipments/${id}`, { method: 'DELETE', headers: H })
      setSuccess('Deleted'); setTimeout(() => setSuccess(''), 3000); fetchAll()
    } catch { setError('Delete failed') }
  }

  if (error && error.includes('Admin')) return (
    <div className="min-h-screen bg-fl-light pt-24 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-sm">
        <Shield className="w-14 h-14 text-red-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">Admin Access Only</h2>
        <p className="text-gray-500 text-sm mb-6">You don't have permission to view this page.</p>
        <Link to="/" className="bg-fl-purple text-white px-6 py-2.5 rounded-xl font-bold hover:bg-purple-900 transition">Go Home</Link>
      </div>
    </div>
  )

  const statusBadge = (s: string) => {
    const c = s === 'Delivered' ? 'bg-green-100 text-green-700' : s === 'In Transit' ? 'bg-blue-100 text-blue-700' : s === 'Out for Delivery' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'
    return <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${c}`}>{s}</span>
  }

  return (
    <div className="min-h-screen bg-fl-light pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-fl-purple rounded-xl flex items-center justify-center"><Shield className="w-5 h-5 text-white" /></div>
            <div><h1 className="text-2xl font-heading font-bold text-fl-dark">Admin Panel</h1><p className="text-xs text-gray-400">Full control over your logistics platform</p></div>
          </div>
          <button onClick={fetchAll} className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>

        {success && <div className="flex items-center gap-2 bg-green-50 border-l-4 border-green-500 p-4 rounded-xl mb-5"><CheckCircle className="w-5 h-5 text-green-500" /><p className="text-green-700 text-sm font-medium">{success}</p></div>}
        {error && !error.includes('Admin') && <div className="flex items-center gap-2 bg-red-50 border-l-4 border-red-500 p-4 rounded-xl mb-5"><AlertCircle className="w-5 h-5 text-red-500" /><p className="text-red-700 text-sm">{error}</p></div>}

        {/* Tabs */}
        <div className="flex gap-2 bg-white rounded-xl p-1.5 shadow-sm border border-gray-100 mb-8 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: <TrendingUp className="w-4 h-4" /> },
            { id: 'shipments', label: `Shipments (${shipments.length})`, icon: <Package className="w-4 h-4" /> },
            { id: 'users', label: `Users (${users.length})`, icon: <Users className="w-4 h-4" /> },
            { id: 'messages', label: `Messages (${messages.length})`, icon: <MessageSquare className="w-4 h-4" /> },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id as any)} className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap transition ${tab === t.id ? 'bg-fl-purple text-white' : 'text-gray-500 hover:bg-gray-100'}`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-fl-purple border-t-transparent rounded-full animate-spin"></div></div>
        ) : (
          <>
            {/* OVERVIEW */}
            {tab === 'overview' && stats && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Shipments', value: stats.totalShipments, icon: <Package className="w-6 h-6 text-fl-purple" />, bg: 'bg-purple-50' },
                    { label: 'Total Users', value: stats.totalUsers, icon: <Users className="w-6 h-6 text-blue-500" />, bg: 'bg-blue-50' },
                    { label: 'Total Revenue', value: `$${stats.revenue}`, icon: <DollarSign className="w-6 h-6 text-green-500" />, bg: 'bg-green-50' },
                    { label: 'Messages', value: stats.totalMessages, icon: <MessageSquare className="w-6 h-6 text-fl-orange" />, bg: 'bg-orange-50' },
                  ].map(s => (
                    <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${s.bg}`}>{s.icon}</div>
                      <div><p className="text-2xl font-bold text-fl-dark">{s.value}</p><p className="text-xs text-gray-500">{s.label}</p></div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[{ label: 'Pending', value: stats.pending, icon: <Clock className="w-5 h-5 text-yellow-500" />, bg: 'bg-yellow-50' }, { label: 'In Transit', value: stats.inTransit, icon: <Truck className="w-5 h-5 text-blue-500" />, bg: 'bg-blue-50' }, { label: 'Delivered', value: stats.delivered, icon: <CheckCircle className="w-5 h-5 text-green-500" />, bg: 'bg-green-50' }].map(s => (
                    <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${s.bg}`}>{s.icon}</div>
                      <div><p className="text-2xl font-bold text-fl-dark">{s.value}</p><p className="text-xs text-gray-500">{s.label}</p></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SHIPMENTS */}
            {tab === 'shipments' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b"><h2 className="text-lg font-bold text-fl-dark">All Shipments</h2><p className="text-sm text-gray-400 mt-1">Click Manage to update tracking status</p></div>
                {shipments.length === 0 ? <div className="text-center py-16 text-gray-400"><Package className="w-12 h-12 mx-auto mb-3 opacity-30" /><p>No shipments yet</p></div> : (
                  <div className="divide-y">
                    {shipments.map(s => (
                      <div key={s.id} className="p-5">
                        <div className="flex justify-between items-start gap-4 flex-wrap">
                          <div>
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="font-mono font-bold text-fl-purple">{s.tracking_number}</span>
                              {statusBadge(s.status)}
                              <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full capitalize">{s.service}</span>
                            </div>
                            <p className="text-sm text-gray-500">{s.origin} → {s.destination}</p>
                            <p className="text-xs text-gray-400 mt-0.5">👤 {s.user_name || 'Guest'} · ⚖️ {s.weight}lbs {s.price ? `· $${s.price}` : ''}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => setExpanded(expanded === s.id ? null : s.id)} className="flex items-center gap-1 bg-fl-light text-fl-purple px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-purple-50 transition">
                              {expanded === s.id ? <><ChevronUp className="w-4 h-4" /> Hide</> : <><ChevronDown className="w-4 h-4" /> Manage</>}
                            </button>
                            <button onClick={() => deleteShipment(s.id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </div>

                        {expanded === s.id && (
                          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Timeline */}
                            <div className="bg-gray-50 rounded-xl p-4">
                              <h4 className="font-bold text-gray-700 text-sm mb-3">Current Timeline</h4>
                              <div className="space-y-2">
                                {s.history.map((h, i) => (
                                  <div key={i} className={`flex items-center gap-3 p-2.5 rounded-lg ${h.completed ? 'bg-white border border-green-100' : 'opacity-40'}`}>
                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${h.completed ? 'bg-fl-purple text-white' : 'bg-gray-200 text-gray-400'}`}>{h.completed ? '✓' : i + 1}</div>
                                    <div><p className="text-sm font-semibold text-gray-800">{h.status}</p>{h.location && <p className="text-xs text-gray-400">{h.location}</p>}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            {/* Update form */}
                            <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                              <h4 className="font-bold text-fl-dark text-sm mb-3 flex items-center gap-2"><Truck className="w-4 h-4 text-fl-purple" /> Update Status</h4>
                              <div className="space-y-3">
                                <select value={updating?.id === s.id ? updating.status : ''} onChange={e => setUpdating({ id: s.id, status: e.target.value, location: updating?.id === s.id ? updating.location : '' })} className="w-full px-3 py-2.5 border border-gray-300 rounded-xl bg-white outline-none focus:ring-2 focus:ring-fl-purple text-sm">
                                  <option value="">-- Select New Status --</option>
                                  {STATUSES.map(st => <option key={st} value={st}>{st}</option>)}
                                </select>
                                <input type="text" placeholder="Location (optional, e.g. London Heathrow)" value={updating?.id === s.id ? updating.location : ''} onChange={e => setUpdating(u => u ? { ...u, location: e.target.value } : null)} className="w-full px-3 py-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-fl-purple text-sm" />
                                <button onClick={() => updating?.id === s.id && updateStatus(s.id, updating.status, updating.location)} disabled={!updating || updating.id !== s.id || !updating.status} className="w-full bg-fl-purple hover:bg-purple-900 text-white py-2.5 rounded-xl font-bold text-sm transition disabled:opacity-50">
                                  Update Tracking Status
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* USERS */}
            {tab === 'users' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b"><h2 className="text-lg font-bold text-fl-dark">Registered Users</h2></div>
                {users.length === 0 ? <div className="text-center py-16 text-gray-400"><Users className="w-12 h-12 mx-auto mb-3 opacity-30" /><p>No users yet</p></div> : (
                  <div className="divide-y">
                    {users.map(u => (
                      <div key={u.id} className="p-5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-fl-purple rounded-full flex items-center justify-center text-white font-bold text-sm">{u.name.charAt(0).toUpperCase()}</div>
                          <div><p className="font-semibold text-gray-800 text-sm">{u.name}</p><p className="text-xs text-gray-400">{u.email}</p></div>
                        </div>
                        <p className="text-xs text-gray-400">{new Date(u.created_at).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* MESSAGES */}
            {tab === 'messages' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b"><h2 className="text-lg font-bold text-fl-dark">Contact Messages</h2></div>
                {messages.length === 0 ? <div className="text-center py-16 text-gray-400"><MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" /><p>No messages yet</p></div> : (
                  <div className="divide-y">
                    {messages.map(m => (
                      <div key={m.id} className="p-5">
                        <div className="flex justify-between mb-2 flex-wrap gap-2">
                          <div><p className="font-bold text-gray-800 text-sm">{m.name}</p><p className="text-xs text-fl-purple">{m.email}</p></div>
                          <p className="text-xs text-gray-400">{new Date(m.created_at).toLocaleDateString()}</p>
                        </div>
                        <p className="text-sm font-semibold text-fl-orange mb-2">Re: {m.subject}</p>
                        <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">{m.message}</p>
                        <a href={`mailto:${m.email}`} className="inline-block mt-2 text-sm text-fl-purple font-semibold hover:text-fl-orange">Reply via Email →</a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
