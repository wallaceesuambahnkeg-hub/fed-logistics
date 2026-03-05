import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, MapPin, Clock, ChevronRight, Plus, CheckCircle, Truck, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { clsx } from 'clsx';
import { useAuth } from '../context/AuthContext';

interface Shipment {
  trackingNumber: string;
  status: string;
  origin: string;
  destination: string;
  service: string;
  price: number;
  estimatedDelivery: string;
  createdAt: string;
}

const statusColor = (status: string) => {
  if (status === 'Delivered') return 'bg-green-100 text-green-800';
  if (status === 'Out for Delivery') return 'bg-blue-100 text-blue-800';
  if (status === 'In Transit') return 'bg-yellow-100 text-yellow-800';
  return 'bg-gray-100 text-gray-700';
};

const statusIcon = (status: string) => {
  if (status === 'Delivered') return <CheckCircle className="w-4 h-4" />;
  if (status === 'In Transit' || status === 'Out for Delivery') return <Truck className="w-4 h-4" />;
  return <Package className="w-4 h-4" />;
};

export default function Dashboard() {
  const { user, token } = useAuth();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const res = await fetch('/api/shipments/my', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) setShipments(data.shipments);
        else setError('Failed to load shipments.');
      } catch {
        setError('Connection error. Please refresh.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchShipments();
  }, [token]);

  return (
    <div className="bg-fedex-light min-h-screen pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-heading font-bold text-fedex-dark">Welcome back, {user?.name.split(' ')[0]}!</h1>
            <p className="text-gray-500 mt-1">{user?.email}</p>
          </div>
          <Link to="/ship" className="bg-fedex-orange hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-colors shadow-sm">
            <Plus className="w-5 h-5" /> New Shipment
          </Link>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {[
            { label: 'Total Shipments', value: shipments.length, icon: <Package className="w-6 h-6 text-fedex-purple" />, bg: 'bg-purple-50' },
            { label: 'In Transit', value: shipments.filter(s => s.status === 'In Transit' || s.status === 'Out for Delivery').length, icon: <Truck className="w-6 h-6 text-fedex-orange" />, bg: 'bg-orange-50' },
            { label: 'Delivered', value: shipments.filter(s => s.status === 'Delivered').length, icon: <CheckCircle className="w-6 h-6 text-green-600" />, bg: 'bg-green-50' },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
              <div className={clsx('w-14 h-14 rounded-full flex items-center justify-center', stat.bg)}>{stat.icon}</div>
              <div>
                <p className="text-3xl font-bold text-fedex-dark">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Shipments List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-heading font-bold text-fedex-dark">My Shipments</h2>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-fedex-purple border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="flex items-center gap-3 p-8 text-red-600">
              <AlertCircle className="w-6 h-6" /> {error}
            </div>
          ) : shipments.length === 0 ? (
            <div className="text-center py-20">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-500 mb-2">No shipments yet</h3>
              <p className="text-gray-400 mb-6">Create your first shipment to get started.</p>
              <Link to="/ship" className="bg-fedex-orange text-white px-6 py-3 rounded-lg font-bold hover:bg-orange-600 transition-colors">
                Ship Now
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {shipments.map((s, i) => (
                <motion.div key={s.trackingNumber} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span className="font-mono font-bold text-fedex-purple text-lg">{s.trackingNumber}</span>
                        <span className={clsx('flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold', statusColor(s.status))}>
                          {statusIcon(s.status)} {s.status}
                        </span>
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full capitalize">{s.service}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{s.origin}</span>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                        <span>{s.destination}</span>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Est. {s.estimatedDelivery}</span>
                        {s.price && <span className="font-semibold text-fedex-orange">${s.price.toFixed(2)}</span>}
                      </div>
                    </div>
                    <Link to={`/track?number=${s.trackingNumber}`} className="self-start sm:self-center bg-fedex-light hover:bg-gray-200 text-fedex-purple px-4 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap">
                      Track
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
