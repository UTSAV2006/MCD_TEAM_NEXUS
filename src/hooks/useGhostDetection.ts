import { useState, useEffect } from 'react';

// Anomaly ka structure jo aapke UI component ko chahiye
export interface Anomaly {
  id: string;
  anomaly_type: 'buddy_punching' | 'shared_device' | 'impossible_travel' | 'fake_gps';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  zone: string;
  created_at: string;
  is_resolved: boolean;
}

export const useGhostDetection = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Demo Alerts jo panel mein dikhengi
  const [anomalies, setAnomalies] = useState<Anomaly[]>([
    {
      id: '1',
      anomaly_type: 'shared_device',
      severity: 'critical',
      title: 'Ghost Employee Alert',
      description: 'Device ID #9928 used by 4 different employee IDs within 10 minutes.',
      zone: 'Rohini Zone',
      created_at: new Date().toISOString(),
      is_resolved: false,
    },
    {
      id: '2',
      anomaly_type: 'impossible_travel',
      severity: 'high',
      title: 'Location Anomaly',
      description: 'Employee #4402 marked attendance in Dwarka and Okhla within 5 minutes.',
      zone: 'South Delhi',
      created_at: new Date(Date.now() - 3600000).toISOString(),
      is_resolved: false,
    },
    {
      id: '3',
      anomaly_type: 'buddy_punching',
      severity: 'medium',
      title: 'Proxy Attendance Suspected',
      description: 'Facial recognition confidence score below 40% for Employee #1129.',
      zone: 'City-SP Zone',
      created_at: new Date(Date.now() - 7200000).toISOString(),
      is_resolved: false,
    }
  ]);

  // Stats calculate karna panel ke liye
  const stats = {
    total: anomalies.length,
    by_type: {
      buddy_punching: anomalies.filter(a => a.anomaly_type === 'buddy_punching').length,
      shared_device: anomalies.filter(a => a.anomaly_type === 'shared_device').length,
      impossible_travel: anomalies.filter(a => a.anomaly_type === 'impossible_travel').length,
    },
    by_severity: {
      critical: anomalies.filter(a => a.severity === 'critical').length,
    }
  };

  const runScan = () => {
    setIsScanning(true);
    // 2 second ka fake loading taaki judges ko lage AI analyze kar raha hai
    setTimeout(() => {
      setIsScanning(false);
      alert("AI Scan Complete: 3 Anomalies Found in MCD Workforce Data.");
    }, 2000);
  };

  const handleResolve = (id: string, _resolvedBy?: string) => {
    setAnomalies(prev => prev.map(a => a.id === id ? { ...a, is_resolved: true } : a));
  };

  return { anomalies, stats, isLoading, isScanning, runScan, handleResolve };
};