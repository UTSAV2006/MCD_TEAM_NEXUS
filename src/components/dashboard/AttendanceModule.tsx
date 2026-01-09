import React, { useState } from 'react';

// TypeScript types define karna zaruri hai
type AttendanceStatus = 'idle' | 'scanning' | 'success' | 'error';

interface LocationData {
  lat: number;
  lng: number;
}

const AttendanceModule: React.FC = () => {
  const [status, setStatus] = useState<AttendanceStatus>('idle');
  const [location, setLocation] = useState<LocationData | null>(null);

  const handleAttendance = () => {
    setStatus('scanning');
    
    // PPT Point: Attendance at work site 
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          
          // Simulation: Facial recognition and Biometric verification 
          setTimeout(() => {
            setStatus('success');
          }, 2500);
        },
        () => {
          setStatus('error');
          alert("Work-site verification failed. Please enable GPS.");
        }
      );
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-2xl shadow-lg border border-blue-100 flex flex-col items-center space-y-4">
      <div className="text-center">
        <h2 className="text-xl font-bold text-slate-800">MCD Workforce Portal</h2>
        <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Direct Field Reporting </p>
      </div>
      
      {status === 'idle' && (
        <button 
          onClick={handleAttendance}
          className="w-full bg-indigo-600 text-white px-6 py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all transform active:scale-95 shadow-md shadow-indigo-200"
        >
          Verify Biometric & Location
        </button>
      )}

      {status === 'scanning' && (
        <div className="flex flex-col items-center py-4">
          <div className="relative">
            <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></div>
            <div className="relative inline-flex rounded-full h-16 w-16 border-4 border-t-blue-600 border-blue-100 animate-spin"></div>
          </div>
          <p className="mt-4 text-blue-600 font-medium animate-pulse">Running Facial Match & GPS Scan...</p>
        </div>
      )}

      {status === 'success' && (
        <div className="text-center animate-bounce-short">
          <div className="bg-green-100 text-green-600 w-16 h-16 rounded-full flex items-center justify-center text-3xl mx-auto mb-3">
            ✓
          </div>
          <p className="text-green-700 font-bold text-lg">Attendance Verified!</p>
          <div className="mt-3 p-3 bg-slate-50 rounded-lg text-left border border-slate-100">
            <p className="text-[10px] text-slate-400 font-mono uppercase">Log Details:</p>
            <p className="text-xs text-slate-600">📍 Coord: {location?.lat.toFixed(4)}, {location?.lng.toFixed(4)}</p>
            <p className="text-xs text-blue-600 font-semibold mt-1">🛡️ Ghost Check: Verified Clear </p>
          </div>
        </div>
      )}

      {status === 'error' && (
        <button onClick={() => setStatus('idle')} className="text-red-500 text-sm font-medium underline">
          Retry Verification
        </button>
      )}
    </div>
  );
};

export default AttendanceModule;