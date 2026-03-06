import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Package, Truck, CheckCircle, Clock, Search, Plus } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

interface Shipment {
  trackingNumber: string; status: string; origin: string
  destination: string; service: string; price: number
  estimatedDelivery: string; createdAt: string
}

export default function Dashboard() {
  const { user, token } = useAuth()
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/shipments/my', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { if (d.success) setShipments(d.shipments) })
      .finally(() => setLoading(false))
  }, [])

  const stats = {
    total: shipments.length,
    inTransit: shipments.filter(s => s.status === 'In Transit').length,
    delivered: shipments.filter(s => s.status === 'Delivered').length,
    pending: shipments.filter(s => ['Order Created', 'Picked Up'].includes(s.status)).length,
  }

  const statusColor = (s: string) => {
    if (s === 'Delivered') return 'bg-green-100 text-green-700'
    if (s === 'In Transit') return 'bg-blue-100 text-blue-700'
    if (s === 'Out for Delivery') return 'bg-yellow-100 text-yellow-700'
    return 'bg-gray-100 text-gray-600'
  }

  return (
    <div className="min-h-screen bg-fl-light pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-heading font-bold text-fl-dark">My Dashboard</h1>
            <p className="text-gray-500 mt-1">Welcome back, <span className="font-semibold text-fl-purple">{user?.name}</span></p>
          </div>
          <Link to="/ship" className="bg-fl-orange hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-bold transition flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Shipment
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total', value: stats.total, icon: <Package className="w-5 h-5 text-fl-purple" />, bg: 'bg-purple-50' },
            { label: 'In Transit', value: stats.inTransit, icon: <Truck className="w-5 h-5 text-blue-500" />, bg: 'bg-blue-50' },
            { label: 'Delivered', value: stats.delivered, icon: <CheckCircle className="w-5 h-5 text-green-500" />, bg: 'bg-green-50' },
            { label: 'Pending', value: stats.pending, icon: <Clock className="w-5 h-5 text-fl-orange" />, bg: 'bg-orange-50' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${s.bg}`}>{s.icon}</div>
              <div><p className="text-2xl font-bold text-fl-dark">{s.value}</p><p className="text-xs text-gray-500">{s.label}</p></div>
            </div>
          ))}
        </div>

        {/* Shipments */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-lg font-bold text-fl-dark">My Shipments</h2>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-16"><div className="w-8 h-8 border-4 border-fl-purple border-t-transparent rounded-full animate-spin"></div></div>
          ) : shipments.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No shipments yet</p>
              <Link to="/ship" className="inline-block mt-4 bg-fl-orange text-white px-6 py-2.5 rounded-xl font-bold hover:bg-orange-600 transition text-sm">Create Your First Shipment</Link>
            </div>
          ) : (
            <div className="divide-y">
              {shipments.map(s => (
                <div key={s.trackingNumber} className="p-5 flex flex-col sm:flex-row justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono font-bold text-fl-purple">{s.trackingNumber}</span>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${statusColor(s.status)}`}>{s.status}</span>
                    </div>
                    <p className="text-sm text-gray-500">{s.origin} → {s.destination}</p>
                    <p className="text-xs text-gray-400 mt-1 capitalize">{s.service} · {s.weight} lbs · {new Date(s.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {s.price > 0 && <span className="text-fl-orange font-bold">${s.price}</span>}
                    <Link to={`/track?number=${s.trackingNumber}`} className="flex items-center gap-1 bg-fl-light text-fl-purple px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-purple-50 transition">
                      <Search className="w-3.5 h-3.5" /> Track
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
