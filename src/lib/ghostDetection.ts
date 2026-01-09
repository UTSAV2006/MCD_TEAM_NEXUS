import { supabase } from "@/integrations/supabase/client";

// Generate a device fingerprint based on browser characteristics
export function generateDeviceFingerprint(): string {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('fingerprint', 2, 2);
  }
  
  const fingerprint = [
    navigator.userAgent,
    screen.width + 'x' + screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
    navigator.language,
    navigator.hardwareConcurrency || 'unknown',
    canvas.toDataURL()
  ].join('|');
  
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  return 'DEV_' + Math.abs(hash).toString(16).toUpperCase();
}

// Get current IP address (simplified - in production use a service)
export async function getIPAddress(): Promise<string> {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch {
    return 'unknown';
  }
}

// Submit attendance with ghost detection
export async function submitAttendanceWithDetection(
  workerId: string,
  latitude: number,
  longitude: number,
  zone: string,
  verificationMethod: 'rfid' | 'face' | 'manual' = 'rfid'
) {
  const deviceFingerprint = generateDeviceFingerprint();
  const ipAddress = await getIPAddress();
  const checkInTime = new Date().toISOString();
  
  // First, insert the attendance log
  const { data: attendanceLog, error: attendanceError } = await supabase
    .from('attendance_logs')
    .insert({
      worker_id: workerId,
      check_in_time: checkInTime,
      latitude,
      longitude,
      device_fingerprint: deviceFingerprint,
      ip_address: ipAddress,
      verification_method: verificationMethod,
      is_verified: true,
      zone
    })
    .select()
    .single();
    
  if (attendanceError) {
    throw attendanceError;
  }
  
  // Update worker location
  await supabase.from('worker_locations').insert({
    worker_id: workerId,
    latitude,
    longitude,
    zone,
    recorded_at: checkInTime
  });
  
  // Trigger ghost detection
  try {
    const { data: detectionResult } = await supabase.functions.invoke('ghost-detection', {
      body: {
        action: 'check_attendance',
        attendanceData: {
          worker_id: workerId,
          latitude,
          longitude,
          check_in_time: checkInTime,
          device_fingerprint: deviceFingerprint,
          ip_address: ipAddress,
          zone
        }
      }
    });
    
    return {
      attendance: attendanceLog,
      detection: detectionResult
    };
  } catch (error) {
    console.error('Ghost detection error:', error);
    return {
      attendance: attendanceLog,
      detection: null
    };
  }
}

// Run full ghost detection scan
export async function runFullGhostScan() {
  const { data, error } = await supabase.functions.invoke('ghost-detection', {
    body: { action: 'run_full_scan' }
  });
  
  if (error) throw error;
  return data;
}

// Get ghost detection statistics
export async function getGhostDetectionStats() {
  const { data, error } = await supabase.functions.invoke('ghost-detection', {
    body: { action: 'get_stats' }
  });
  
  if (error) throw error;
  return data;
}

// Subscribe to real-time anomaly alerts
export function subscribeToAnomalies(callback: (anomaly: any) => void) {
  const channel = supabase
    .channel('anomalies-realtime')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'anomalies'
      },
      (payload) => {
        callback(payload.new);
      }
    )
    .subscribe();
    
  return () => {
    supabase.removeChannel(channel);
  };
}

// Fetch today's anomalies
export async function fetchTodayAnomalies() {
  const today = new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('anomalies')
    .select('*')
    .gte('created_at', `${today}T00:00:00`)
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data;
}

// Resolve an anomaly
export async function resolveAnomaly(anomalyId: string, resolvedBy: string) {
  const { error } = await supabase
    .from('anomalies')
    .update({
      is_resolved: true,
      resolved_at: new Date().toISOString(),
      resolved_by: resolvedBy
    })
    .eq('id', anomalyId);
    
  if (error) throw error;
}
