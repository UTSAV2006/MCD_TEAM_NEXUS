import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Users, Navigation, PhoneCall, AlertTriangle } from 'lucide-react';

const RapidActionForce = () => {
  // Mock Data: Active Emergency Alerts
  const [alerts, setAlerts] = useState([
    { id: 1, type: 'Critical', location: 'Zone 4 - Rohini', status: 'In Route', time: '2 mins ago' },
    { id: 2, type: 'Emergency', location: 'Zone 1 - City Center', status: 'Pending', time: '5 mins ago' }
  ]);

  return (
    <div className="p-6 bg-slate-900 text-white min-h-screen">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ShieldAlert className="text-red-500 w-8 h-8" /> 
            RAF Command Center
          </h1>
          <p className="text-slate-400">Real-time Emergency Response Unit</p>
        </div>
        <div className="bg-red-500/10 border border-red-500 p-3 rounded-lg animate-pulse">
          <p className="text-red-500 font-bold flex items-center gap-2">
            <AlertTriangle size={18} /> 2 Active Emergencies
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Live Alerts Dashboard */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-xl font-semibold mb-4">Live SOS Alerts</h2>
          <AnimatePresence>
            {alerts.map((alert) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-slate-800 border-l-4 border-red-500 p-4 rounded-r-lg shadow-lg"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold uppercase text-red-400">{alert.type}</span>
                    <h3 className="font-bold text-lg">{alert.location}</h3>
                    <p className="text-sm text-slate-400">{alert.time}</p>
                  </div>
                  <span className="bg-slate-700 px-2 py-1 rounded text-xs">{alert.status}</span>
                </div>
                <div className="mt-4 flex gap-2">
                  <button className="bg-red-600 hover:bg-red-700 text-xs px-3 py-2 rounded-md transition-colors">Dispatch Team</button>
                  <button className="bg-slate-700 hover:bg-slate-600 text-xs px-3 py-2 rounded-md transition-colors text-white">View Map</button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Middle Column: Visual Map Placeholder */}
        <div className="lg:col-span-2 space-y-4">
          <div className="h-[400px] bg-slate-800 rounded-xl border border-slate-700 flex items-center justify-center relative overflow-hidden">
            {/* Yahan aap Google Maps ya Leaflet integrate kar sakte hain */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            <div className="text-center z-10">
              <Navigation className="mx-auto mb-2 text-blue-400 animate-bounce" size={40} />
              <p className="text-slate-400">Interactive Tactical Map Loading...</p>
            </div>
            
            {/* Glowing Map Point Example */}
            <div className="absolute top-1/2 left-1/3">
              <span className="relative flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
              </span>
            </div>
          </div>

          {/* Bottom Row: Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Units', value: '24', icon: <Users size={20} /> },
              { label: 'Available', value: '18', icon: <Navigation size={20} /> },
              { label: 'Response Time', value: '4.2m', icon: <PhoneCall size={20} /> },
              { label: 'Active Tasks', value: '06', icon: <ShieldAlert size={20} /> },
            ].map((stat, i) => (
              <div key={i} className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                <div className="text-blue-400 mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-xs text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RapidActionForce;