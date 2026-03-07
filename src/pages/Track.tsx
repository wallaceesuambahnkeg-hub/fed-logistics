import { useState, FormEvent, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, Package, MapPin, CheckCircle, Clock, Truck, AlertCircle } from 'lucide-react'

interface TrackData {
  trackingNumber: string; status: string; estimatedDelivery: string
  origin: string; destination: string; weight: number; service: string
  history: { status: string; location: string; date: string; completed: boolean }[]
}

function Check({ className }: { className: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
}

// ── Map component using OpenStreetMap + Leaflet (free, no API key needed) ──────
function ShipmentMap({ origin, destination, status }: { origin: string; destination: string; status: string }) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return

    // Load Leaflet CSS
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link')
      link.id = 'leaflet-css'
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }

    // Load Leaflet JS then init map
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    script.onload = () => initMap()
    document.head.appendChild(script)

    async function geocode(place: string): Promise<[number, number] | null> {
      try {
        const r = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place)}&format=json&limit=1`)
        const d = await r.json()
        if (d.length > 0) return [parseFloat(d[0].lat), parseFloat(d[0].lon)]
      } catch {}
      return null
    }

    async function initMap() {
      const L = (window as any).L
      if (!L || !mapRef.current || mapInstance.current) return

      // Geocode both locations
      const [fromCoords, toCoords] = await Promise.all([geocode(origin), geocode(destination)])

      // Fallback coords if geocoding fails
      const from: [number, number] = fromCoords || [51.5074, -0.1278]  // London
      const to: [number, number] = toCoords || [40.7128, -74.0060]     // NYC

      // Init map
      const map = L.map(mapRef.current, { zoomControl: true, scrollWheelZoom: false })
      mapInstance.current = map

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map)

      // Custom icons
      const originIcon = L.divIcon({
        html: `<div style="background:#4D148C;color:white;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;font-size:18px;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)">📦</div>`,
        className: '', iconSize: [36, 36], iconAnchor: [18, 18]
      })
      const destIcon = L.divIcon({
        html: `<div style="background:#FF6200;color:white;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;font-size:18px;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)">🏁</div>`,
        className: '', iconSize: [36, 36], iconAnchor: [18, 18]
      })

      // Determine truck position along route based on status
      const statusProgress: Record<string, number> = {
        'Order Created': 0.05,
        'Picked Up': 0.2,
        'In Transit': 0.55,
        'Out for Delivery': 0.85,
        'Delivered': 1.0,
      }
      const progress = statusProgress[status] ?? 0.1
      const truckLat = from[0] + (to[0] - from[0]) * progress
      const truckLng = from[1] + (to[1] - from[1]) * progress

      const truckIcon = L.divIcon({
        html: `<div style="background:white;border-radius:50%;width:40px;height:40px;display:flex;align-items:center;justify-content:center;font-size:22px;border:3px solid #FF6200;box-shadow:0 2px 12px rgba(255,98,0,0.4)">🚛</div>`,
        className: '', iconSize: [40, 40], iconAnchor: [20, 20]
      })

      // Add markers
      L.marker(from, { icon: originIcon }).addTo(map)
        .bindPopup(`<b>📦 Origin</b><br>${origin}`)
      L.marker(to, { icon: destIcon }).addTo(map)
        .bindPopup(`<b>🏁 Destination</b><br>${destination}`)

      if (status !== 'Delivered') {
        L.marker([truckLat, truckLng], { icon: truckIcon }).addTo(map)
          .bindPopup(`<b>🚛 Your Package</b><br>Status: ${status}`)
          .openPopup()
      } else {
        L.marker(to, { icon: L.divIcon({
          html: `<div style="background:#22c55e;color:white;border-radius:50%;width:40px;height:40px;display:flex;align-items:center;justify-content:center;font-size:22px;border:3px solid white;box-shadow:0 2px 12px rgba(34,197,94,0.4)">✅</div>`,
          className: '', iconSize: [40, 40], iconAnchor: [20, 20]
        })}).addTo(map).bindPopup('<b>✅ Delivered!</b>').openPopup()
      }

      // Draw dotted route line
      const routeLine = L.polyline([from, to], {
        color: '#FF6200', weight: 3, dashArray: '10, 8', opacity: 0.7
      }).addTo(map)

      // Draw completed portion in solid purple
      if (progress > 0 && progress < 1) {
        L.polyline([from, [truckLat, truckLng]], {
          color: '#4D148C', weight: 4, opacity: 0.9
        }).addTo(map)
      }

      // Fit map to show both markers
      map.fitBounds([[from[0], from[1]], [to[0], to[1]]], { padding: [50, 50] })
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove()
        mapInstance.current = null
      }
    }
  }, [origin, destination, status])

  return (
    <div className="relative">
      <div ref={mapRef} style={{ height: '380px', width: '100%', borderRadius: '0' }}></div>
      {/* Legend */}
      <div className="absolute bottom-3 left-3 bg-white rounded-xl shadow-lg p-3 text-xs space-y-1.5 z-[1000]">
        <div className="flex items-center gap-2"><span>📦</span><span className="font-semibold text-gray-700">Origin: {origin}</span></div>
        <div className="flex items-center gap-2"><span>🚛</span><span className="font-semibold text-gray-700">In Transit</span></div>
        <div className="flex items-center gap-2"><span>🏁</span><span className="font-semibold text-gray-700">Destination: {destination}</span></div>
      </div>
    </div>
  )
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

  const statusColor = (s: string) => s === 'Delivered' ? 'bg-green-500' : s === 'In Transit' || s === 'Out for Delivery' ? 'bg-blue-500' : 'bg-fl-orange'

  return (
    <div className="min-h-screen bg-fl-light pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-heading font-bold text-fl-dark mb-2">Track Your Package</h1>
          <p className="text-gray-500">Enter your tracking number to see live status and map.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-3 mb-8">
          <input type="text" value={number} onChange={e => setNumber(e.target.value)} placeholder="e.g. FL8699744009" className="flex-grow px-5 py-3.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-fl-purple transition bg-white font-medium" />
          <button type="submit" disabled={loading} className="bg-fl-purple hover:bg-purple-900 text-white px-6 py-3.5 rounded-xl font-bold transition disabled:opacity-60 flex items-center gap-2">
            <Search className="w-5 h-5" />{loading ? 'Searching...' : 'Track'}
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

            {/* Header */}
            <div className="bg-fl-purple text-white p-6">
              <div className="flex justify-between items-start flex-wrap gap-3 mb-4">
                <div>
                  <p className="text-purple-200 text-sm mb-1">Tracking Number</p>
                  <p className="font-mono font-bold text-xl">{data.trackingNumber}</p>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-sm font-bold text-white ${statusColor(data.status)}`}>{data.status}</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div><p className="text-purple-200">From</p><p className="font-medium">{data.origin}</p></div>
                <div><p className="text-purple-200">To</p><p className="font-medium">{data.destination}</p></div>
                <div><p className="text-purple-200">Service</p><p className="font-medium capitalize">{data.service}</p></div>
                <div><p className="text-purple-200">Est. Delivery</p><p className="font-medium">{data.estimatedDelivery}</p></div>
              </div>
            </div>

            {/* ── LIVE MAP ── */}
            <div className="border-b border-gray-100">
              <div className="px-6 py-3 bg-gray-50 flex items-center gap-2 border-b border-gray-100">
                <MapPin className="w-4 h-4 text-fl-orange" />
                <p className="font-semibold text-sm text-fl-dark">Live Shipment Map</p>
                <span className="ml-auto text-xs text-gray-400">Powered by OpenStreetMap</span>
              </div>
              <ShipmentMap origin={data.origin} destination={data.destination} status={data.status} />
            </div>

            {/* Timeline */}
            <div className="p-6">
              <h3 className="font-bold text-fl-dark mb-5 flex items-center gap-2">
                <Truck className="w-4 h-4 text-fl-orange" /> Tracking Timeline
              </h3>
              <div className="space-y-3">
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
                    {h.completed && <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />}
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