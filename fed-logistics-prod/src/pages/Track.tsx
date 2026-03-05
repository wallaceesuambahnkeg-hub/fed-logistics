import { useState, FormEvent, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, Package, MapPin, CheckCircle, Clock, Truck, AlertCircle } from 'lucide-react'

interface TrackData {
  trackingNumber: string; status: string; estimatedDelivery: string
  origin: string; destination: string; weight: number; service: string
  history: { status: string; location: string; date: string; completed: boolean }[]
}

const statusIcon = (s: string) => {
  if (s === 'Delivered') return <CheckCircle className="w-5 h-5 text-green-500" />
  if (s === 'In Transit' || s === 'Out for Delivery') return <Truck className="w-5 h-5 text-blue-500" />
  return <Clock className="w-5 h-5 text-gray-400" />
}

export default function Track() {
  const [params] = useSearchParams()
  const [number, setNumber] = useState(params.get('number') || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState<TrackData | null>(null)

  async function doTrack(num: string) {
    if (!num.trim()) return
    setLoading(true); setError(''); setData(null)
    try {
      const res = await fetch('/api/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ trackingNumber: num.trim() }) })
      const d = await res.json()
      if (d.success) setData(d.data)
      else setError(d.message || 'Tracking number not found')
    } catch { setError('Connection error. Please try again.') }
    finally { setLoading(false) }
  }

  useEffect(() => { const n = params.get('number'); if (n) doTrack(n) }, [])

  function handleSubmit(e: FormEvent) { e.preventDefault(); doTrack(number) }

  return (
    <div className="min-h-screen bg-fl-light pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-heading font-bold text-fl-dark mb-2">Track Your Package</h1>
          <p className="text-gray-500">Enter your tracking number to see live status updates.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-3 mb-8">
          <input type="text" value={number} onChange={e => setNumber(e.target.value)} placeholder="e.g. FL1234567890" className="flex-grow px-5 py-3.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-fl-purple transition bg-white" />
          <button type="submit" disabled={loading} className="bg-fl-purple hover:bg-purple-900 text-white px-6 py-3.5 rounded-xl font-bold transition disabled:opacity-60 flex items-center gap-2">
            <Search className="w-5 h-5" /> {loading ? 'Searching...' : 'Track'}
          </button>
        </form>

        {error && (
          <div className="flex items-center gap-3 bg-red-50 border-l-4 border-red-500 p-4 rounded-xl mb-6">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {data && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-fl-purple text-white p-6">
              <div className="flex justify-between items-start flex-wrap gap-3">
                <div>
                  <p className="text-purple-200 text-sm mb-1">Tracking Number</p>
                  <p className="font-mono font-bold text-xl">{data.trackingNumber}</p>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${data.status === 'Delivered' ? 'bg-green-500' : data.status === 'In Transit' ? 'bg-blue-500' : 'bg-fl-orange'}`}>{data.status}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                <div><p className="text-purple-200">From</p><p className="font-medium">{data.origin}</p></div>
                <div><p className="text-purple-200">To</p><p className="font-medium">{data.destination}</p></div>
                <div><p className="text-purple-200">Service</p><p className="font-medium capitalize">{data.service}</p></div>
                <div><p className="text-purple-200">Est. Delivery</p><p className="font-medium">{data.estimatedDelivery}</p></div>
              </div>
            </div>
            <div className="p-6">
              <h3 className="font-bold text-fl-dark mb-5">Tracking Timeline</h3>
              <div className="space-y-4">
                {data.history.map((h, i) => (
                  <div key={i} className={`flex items-start gap-4 p-4 rounded-xl transition ${h.completed ? 'bg-green-50 border border-green-100' : 'bg-gray-50 opacity-50'}`}>
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${h.completed ? 'bg-green-500' : 'bg-gray-200'}`}>
                      {h.completed ? <Check className="w-4 h-4 text-white" /> : <span className="text-xs text-gray-400 font-bold">{i + 1}</span>}
                    </div>
                    <div className="flex-grow">
                      <p className={`font-semibold ${h.completed ? 'text-fl-dark' : 'text-gray-400'}`}>{h.status}</p>
                      {h.location && <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" />{h.location}</p>}
                      {h.date && <p className="text-xs text-gray-400 mt-1">{h.date}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {!data && !loading && !error && (
          <div className="text-center py-16 text-gray-400">
            <Package className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">Enter a tracking number above</p>
            <p className="text-sm mt-1">Your tracking number starts with FL</p>
          </div>
        )}
      </div>
    </div>
  )
}

function Check({ className }: { className: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
}
