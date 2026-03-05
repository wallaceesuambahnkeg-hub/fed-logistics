import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, CheckCircle, Clock, MapPin, Package, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { clsx } from 'clsx';

interface TrackingHistory {
  status: string;
  location: string;
  date: string;
  completed: boolean;
}

interface ShipmentData {
  trackingNumber: string;
  status: string;
  estimatedDelivery: string;
  origin: string;
  destination: string;
  history: TrackingHistory[];
}

export default function Track() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTrackingNumber = searchParams.get('number') || '';
  
  const [trackingNumber, setTrackingNumber] = useState(initialTrackingNumber);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [shipmentData, setShipmentData] = useState<ShipmentData | null>(null);

  useEffect(() => {
    if (initialTrackingNumber) {
      handleTrack(initialTrackingNumber);
    }
  }, [initialTrackingNumber]);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      setSearchParams({ number: trackingNumber });
      handleTrack(trackingNumber);
    }
  };

  const handleTrack = async (number: string) => {
    setIsLoading(true);
    setError('');
    setShipmentData(null);

    try {
      const response = await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackingNumber: number }),
      });

      const data = await response.json();

      if (data.success) {
        setShipmentData(data.data);
      } else {
        setError(data.message || 'Tracking number not found.');
      }
    } catch (err) {
      setError('An error occurred while tracking your package. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-fedex-light min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 sticky top-28">
              <h3 className="text-xl font-heading font-bold text-fedex-dark mb-4">Track Options</h3>
              <ul className="space-y-3">
                <li>
                  <button className="w-full text-left px-4 py-2 bg-orange-50 text-fedex-orange font-semibold rounded-md border-l-4 border-fedex-orange">
                    Track by Number
                  </button>
                </li>
                <li>
                  <button className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-md transition-colors">
                    Track by Reference
                  </button>
                </li>
                <li>
                  <button className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-md transition-colors">
                    Track by Email
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100 mb-8">
              <h1 className="text-3xl font-heading font-bold text-fedex-dark mb-6">Track Your Package</h1>
              
              <form onSubmit={handleTrackSubmit} className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-fedex-orange focus:border-fedex-orange transition-colors"
                    placeholder="Enter tracking number (e.g., 123456789)"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    required
                  />
                </div>
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="bg-fedex-purple hover:bg-purple-900 text-white px-8 py-3 rounded-lg font-bold transition-colors whitespace-nowrap disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Tracking...
                    </>
                  ) : (
                    'Track'
                  )}
                </button>
              </form>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md mb-8 flex items-start gap-3"
              >
                <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                <p className="text-red-700">{error}</p>
              </motion.div>
            )}

            {/* Results */}
            {shipmentData && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
              >
                {/* Header */}
                <div className="bg-fedex-dark text-white p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">Tracking Number</p>
                    <h2 className="text-2xl font-mono font-bold">{shipmentData.trackingNumber}</h2>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">Status</p>
                    <div className="flex items-center gap-2">
                      <div className={clsx("w-3 h-3 rounded-full", shipmentData.status === 'Delivered' ? 'bg-green-500' : 'bg-fedex-orange animate-pulse')}></div>
                      <h2 className="text-2xl font-bold text-fedex-orange">{shipmentData.status}</h2>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 md:p-8 border-b border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1 flex items-center gap-1"><MapPin className="w-4 h-4" /> Origin</p>
                    <p className="font-semibold text-gray-800">{shipmentData.origin}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1 flex items-center gap-1"><MapPin className="w-4 h-4" /> Destination</p>
                    <p className="font-semibold text-gray-800">{shipmentData.destination}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1 flex items-center gap-1"><Clock className="w-4 h-4" /> Est. Delivery</p>
                    <p className="font-semibold text-gray-800">{shipmentData.estimatedDelivery}</p>
                  </div>
                </div>

                {/* Timeline */}
                <div className="p-6 md:p-8">
                  <h3 className="text-xl font-heading font-bold text-fedex-dark mb-8">Shipment Progress</h3>
                  
                  <div className="relative">
                    {/* Progress Line */}
                    <div className="absolute left-4 md:left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                    
                    <div className="space-y-8">
                      {shipmentData.history.map((step, index) => (
                        <div key={index} className="relative flex items-start gap-6">
                          {/* Icon */}
                          <div className={clsx(
                            "relative z-10 w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center flex-shrink-0 border-4 border-white",
                            step.completed ? "bg-fedex-purple text-white" : "bg-gray-200 text-gray-400"
                          )}>
                            {step.status === 'Delivered' ? <CheckCircle className="w-4 h-4 md:w-6 md:h-6" /> : <Package className="w-4 h-4 md:w-6 md:h-6" />}
                          </div>
                          
                          {/* Content */}
                          <div className="flex-grow pt-1 md:pt-2">
                            <h4 className={clsx("text-lg font-bold", step.completed ? "text-fedex-dark" : "text-gray-400")}>
                              {step.status}
                            </h4>
                            <p className="text-gray-500 flex items-center gap-1 mt-1">
                              <MapPin className="w-4 h-4" /> {step.location}
                            </p>
                            {step.date && (
                              <p className="text-sm text-gray-400 mt-1">{step.date}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
