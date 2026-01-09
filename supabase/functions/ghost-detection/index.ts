import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Haversine formula to calculate distance between two GPS coordinates (in km)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Calculate travel time needed based on distance (assuming max 60 km/h in Delhi traffic)
function calculateMinTravelTime(distanceKm: number): number {
  const avgSpeedKmh = 60; // Max reasonable speed in Delhi NCR
  return (distanceKm / avgSpeedKmh) * 60; // Return in minutes
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { action, attendanceData } = await req.json();
    console.log(`Ghost Detection Action: ${action}`);

    if (action === 'check_attendance') {
      // Run all three detection algorithms
      const anomalies = [];
      
      // 1. BUDDY PUNCHING DETECTION
      // Check if multiple workers checked in from same GPS within 30 seconds
      const buddyPunchingAnomalies = await detectBuddyPunching(supabase, attendanceData);
      anomalies.push(...buddyPunchingAnomalies);
      
      // 2. SHARED DEVICE DETECTION
      // Check if multiple workers use the same device fingerprint
      const sharedDeviceAnomalies = await detectSharedDevice(supabase, attendanceData);
      anomalies.push(...sharedDeviceAnomalies);
      
      // 3. IMPOSSIBLE TRAVEL DETECTION
      // Check if worker traveled impossible distance in short time
      const impossibleTravelAnomalies = await detectImpossibleTravel(supabase, attendanceData);
      anomalies.push(...impossibleTravelAnomalies);
      
      // Insert detected anomalies into database
      if (anomalies.length > 0) {
        const { error: insertError } = await supabase
          .from('anomalies')
          .insert(anomalies);
          
        if (insertError) {
          console.error('Error inserting anomalies:', insertError);
        } else {
          console.log(`Inserted ${anomalies.length} anomalies`);
        }
      }
      
      return new Response(JSON.stringify({ 
        success: true, 
        anomalies_detected: anomalies.length,
        anomalies 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    if (action === 'run_full_scan') {
      // Run a full scan of today's attendance data
      const today = new Date().toISOString().split('T')[0];
      
      const { data: todayLogs, error } = await supabase
        .from('attendance_logs')
        .select('*, workers(*)')
        .gte('check_in_time', `${today}T00:00:00`)
        .order('check_in_time', { ascending: true });
        
      if (error) {
        throw error;
      }
      
      console.log(`Scanning ${todayLogs?.length || 0} attendance logs for today`);
      
      const allAnomalies = [];
      
      // Run buddy punching detection on all logs
      const buddyAnomalies = await runBuddyPunchingScan(supabase, todayLogs || []);
      allAnomalies.push(...buddyAnomalies);
      
      // Run shared device detection
      const deviceAnomalies = await runSharedDeviceScan(supabase, todayLogs || []);
      allAnomalies.push(...deviceAnomalies);
      
      // Run impossible travel detection
      const travelAnomalies = await runImpossibleTravelScan(supabase, todayLogs || []);
      allAnomalies.push(...travelAnomalies);
      
      return new Response(JSON.stringify({ 
        success: true, 
        logs_scanned: todayLogs?.length || 0,
        anomalies_detected: allAnomalies.length,
        anomalies: allAnomalies
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    if (action === 'get_stats') {
      // Get anomaly statistics
      const today = new Date().toISOString().split('T')[0];
      
      const { data: stats, error } = await supabase
        .from('anomalies')
        .select('anomaly_type, severity')
        .gte('created_at', `${today}T00:00:00`);
        
      if (error) throw error;
      
      const summary = {
        total: stats?.length || 0,
        by_type: {
          buddy_punching: stats?.filter(s => s.anomaly_type === 'buddy_punching').length || 0,
          shared_device: stats?.filter(s => s.anomaly_type === 'shared_device').length || 0,
          impossible_travel: stats?.filter(s => s.anomaly_type === 'impossible_travel').length || 0
        },
        by_severity: {
          critical: stats?.filter(s => s.severity === 'critical').length || 0,
          high: stats?.filter(s => s.severity === 'high').length || 0,
          medium: stats?.filter(s => s.severity === 'medium').length || 0,
          low: stats?.filter(s => s.severity === 'low').length || 0
        }
      };
      
      return new Response(JSON.stringify({ success: true, stats: summary }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Ghost Detection Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// BUDDY PUNCHING: Same GPS + Same Time (within 30 seconds)
async function detectBuddyPunching(supabase: any, attendanceData: any) {
  const anomalies = [];
  const { worker_id, latitude, longitude, check_in_time, zone } = attendanceData;
  
  // Find other check-ins at same location within 30 seconds
  const timeWindow = new Date(new Date(check_in_time).getTime() - 30000).toISOString();
  
  const { data: nearbyCheckins } = await supabase
    .from('attendance_logs')
    .select('*, workers(employee_id, full_name)')
    .neq('worker_id', worker_id)
    .gte('check_in_time', timeWindow)
    .lte('check_in_time', check_in_time);
    
  for (const checkin of nearbyCheckins || []) {
    if (checkin.latitude && checkin.longitude) {
      const distance = calculateDistance(
        latitude, longitude,
        parseFloat(checkin.latitude), parseFloat(checkin.longitude)
      );
      
      // If within 10 meters, flag as buddy punching
      if (distance < 0.01) { // 10 meters = 0.01 km
        anomalies.push({
          anomaly_type: 'buddy_punching',
          severity: 'high',
          title: 'Buddy Punching Detected',
          description: `Workers checked in from identical GPS coordinates within 30 seconds. Possible proxy attendance.`,
          worker_ids: [worker_id, checkin.worker_id],
          attendance_log_ids: [checkin.id],
          zone: zone,
          latitude: latitude,
          longitude: longitude,
          metadata: {
            time_difference_seconds: Math.abs(new Date(check_in_time).getTime() - new Date(checkin.check_in_time).getTime()) / 1000,
            distance_meters: distance * 1000
          }
        });
      }
    }
  }
  
  return anomalies;
}

// SHARED DEVICE: Same device fingerprint used by multiple workers
interface SharedDeviceAnomaly {
  anomaly_type: 'shared_device';
  severity: 'high' | 'critical';
  title: string;
  description: string;
  worker_ids: string[];
  zone: string;
  metadata: Record<string, any>;
}

async function detectSharedDevice(supabase: any, attendanceData: any): Promise<SharedDeviceAnomaly[]> {
  const anomalies: SharedDeviceAnomaly[] = [];
  const { worker_id, device_fingerprint, zone } = attendanceData;
  
  if (!device_fingerprint) return anomalies;
  
  // Check how many unique workers have used this device
  const { data: deviceUsage } = await supabase
    .from('attendance_logs')
    .select('worker_id')
    .eq('device_fingerprint', device_fingerprint)
    .neq('worker_id', worker_id);
    
  const uniqueWorkers = [...new Set((deviceUsage || []).map((d: any) => d.worker_id))];
  
  // If more than 3 different workers use same device, flag it
  if (uniqueWorkers.length >= 3) {
    // Update device_fingerprints table
    await supabase
      .from('device_fingerprints')
      .upsert({
        fingerprint: device_fingerprint,
        total_workers_count: uniqueWorkers.length + 1,
        flagged: true,
        last_seen_at: new Date().toISOString()
      }, { onConflict: 'fingerprint' });
      
    anomalies.push({
      anomaly_type: 'shared_device',
      severity: uniqueWorkers.length >= 10 ? 'critical' : 'high',
      title: 'Shared Ghost Device Detected',
      description: `${uniqueWorkers.length + 1} different workers have checked in using the same device. This device may be used for mass proxy attendance.`,
      worker_ids: [worker_id, ...uniqueWorkers],
      zone: zone,
      metadata: {
        device_fingerprint: device_fingerprint,
        total_workers: uniqueWorkers.length + 1
      }
    });
  }
  
  return anomalies;
}

// IMPOSSIBLE TRAVEL: Worker appears in two distant locations too quickly
interface ImpossibleTravelAnomaly {
  anomaly_type: 'impossible_travel';
  severity: 'critical';
  title: string;
  description: string;
  worker_ids: string[];
  zone: string;
  latitude: number;
  longitude: number;
  metadata: Record<string, any>;
}

async function detectImpossibleTravel(supabase: any, attendanceData: any): Promise<ImpossibleTravelAnomaly[]> {
  const anomalies: ImpossibleTravelAnomaly[] = [];
  const { worker_id, latitude, longitude, check_in_time, zone } = attendanceData;
  
  if (!latitude || !longitude) return anomalies;
  
  // Get last known location for this worker (within last 2 hours)
  const twoHoursAgo = new Date(new Date(check_in_time).getTime() - 2 * 60 * 60 * 1000).toISOString();
  
  const { data: lastLocations } = await supabase
    .from('worker_locations')
    .select('*')
    .eq('worker_id', worker_id)
    .gte('recorded_at', twoHoursAgo)
    .order('recorded_at', { ascending: false })
    .limit(1);
    
  if (lastLocations && lastLocations.length > 0) {
    const lastLoc = lastLocations[0];
    const distance = calculateDistance(
      latitude, longitude,
      parseFloat(lastLoc.latitude), parseFloat(lastLoc.longitude)
    );
    
    const timeDiffMinutes = (new Date(check_in_time).getTime() - new Date(lastLoc.recorded_at).getTime()) / (1000 * 60);
    const minTravelTime = calculateMinTravelTime(distance);
    
    // If travel time needed is more than actual time elapsed, it's impossible
    if (minTravelTime > timeDiffMinutes && distance > 5) { // Only flag if > 5km
      anomalies.push({
        anomaly_type: 'impossible_travel',
        severity: 'critical',
        title: 'Impossible Travel Detected',
        description: `Worker appeared ${distance.toFixed(1)}km away in ${timeDiffMinutes.toFixed(0)} minutes. Minimum travel time required: ${minTravelTime.toFixed(0)} minutes.`,
        worker_ids: [worker_id],
        zone: zone,
        latitude: latitude,
        longitude: longitude,
        metadata: {
          distance_km: distance,
          time_elapsed_minutes: timeDiffMinutes,
          min_travel_time_minutes: minTravelTime,
          previous_zone: lastLoc.zone,
          current_zone: zone
        }
      });
    }
  }
  
  return anomalies;
}

// Full scan functions for batch processing
async function runBuddyPunchingScan(supabase: any, logs: any[]) {
  const anomalies = [];
  const processed = new Set();
  
  for (let i = 0; i < logs.length; i++) {
    for (let j = i + 1; j < logs.length; j++) {
      const log1 = logs[i];
      const log2 = logs[j];
      
      const pairKey = [log1.id, log2.id].sort().join('-');
      if (processed.has(pairKey)) continue;
      processed.add(pairKey);
      
      if (!log1.latitude || !log2.latitude) continue;
      
      const timeDiff = Math.abs(new Date(log1.check_in_time).getTime() - new Date(log2.check_in_time).getTime());
      
      if (timeDiff <= 30000) { // Within 30 seconds
        const distance = calculateDistance(
          parseFloat(log1.latitude), parseFloat(log1.longitude),
          parseFloat(log2.latitude), parseFloat(log2.longitude)
        );
        
        if (distance < 0.01) { // Within 10 meters
          anomalies.push({
            anomaly_type: 'buddy_punching',
            severity: 'high',
            title: 'Buddy Punching Detected',
            description: `Workers ${log1.workers?.employee_id || log1.worker_id} and ${log2.workers?.employee_id || log2.worker_id} checked in from same location within 30 seconds.`,
            worker_ids: [log1.worker_id, log2.worker_id],
            attendance_log_ids: [log1.id, log2.id],
            zone: log1.zone,
            latitude: parseFloat(log1.latitude),
            longitude: parseFloat(log1.longitude),
            metadata: { time_difference_seconds: timeDiff / 1000 }
          });
        }
      }
    }
  }
  
  return anomalies;
}

async function runSharedDeviceScan(supabase: any, logs: any[]) {
  const anomalies = [];
  const deviceWorkers: Record<string, Set<string>> = {};
  
  for (const log of logs) {
    if (log.device_fingerprint) {
      if (!deviceWorkers[log.device_fingerprint]) {
        deviceWorkers[log.device_fingerprint] = new Set();
      }
      deviceWorkers[log.device_fingerprint].add(log.worker_id);
    }
  }
  
  for (const [fingerprint, workers] of Object.entries(deviceWorkers)) {
    if (workers.size >= 3) {
      anomalies.push({
        anomaly_type: 'shared_device',
        severity: workers.size >= 10 ? 'critical' : 'high',
        title: 'Shared Ghost Device Detected',
        description: `${workers.size} workers used the same device for attendance today.`,
        worker_ids: Array.from(workers),
        metadata: { device_fingerprint: fingerprint, total_workers: workers.size }
      });
    }
  }
  
  return anomalies;
}

async function runImpossibleTravelScan(supabase: any, logs: any[]) {
  const anomalies = [];
  const workerLogs: Record<string, any[]> = {};
  
  for (const log of logs) {
    if (!workerLogs[log.worker_id]) {
      workerLogs[log.worker_id] = [];
    }
    workerLogs[log.worker_id].push(log);
  }
  
  for (const [workerId, workerLogsArray] of Object.entries(workerLogs)) {
    const sortedLogs = workerLogsArray.sort((a: any, b: any) => 
      new Date(a.check_in_time).getTime() - new Date(b.check_in_time).getTime()
    );
    
    for (let i = 1; i < sortedLogs.length; i++) {
      const prev = sortedLogs[i - 1];
      const curr = sortedLogs[i];
      
      if (!prev.latitude || !curr.latitude) continue;
      
      const distance = calculateDistance(
        parseFloat(prev.latitude), parseFloat(prev.longitude),
        parseFloat(curr.latitude), parseFloat(curr.longitude)
      );
      
      const timeDiffMinutes = (new Date(curr.check_in_time).getTime() - new Date(prev.check_in_time).getTime()) / (1000 * 60);
      const minTravelTime = calculateMinTravelTime(distance);
      
      if (minTravelTime > timeDiffMinutes && distance > 5) {
        anomalies.push({
          anomaly_type: 'impossible_travel',
          severity: 'critical',
          title: 'Impossible Travel Detected',
          description: `Worker traveled ${distance.toFixed(1)}km in ${timeDiffMinutes.toFixed(0)} minutes (needs ${minTravelTime.toFixed(0)} min minimum).`,
          worker_ids: [workerId],
          attendance_log_ids: [prev.id, curr.id],
          zone: curr.zone,
          latitude: parseFloat(curr.latitude),
          longitude: parseFloat(curr.longitude),
          metadata: {
            distance_km: distance,
            time_elapsed_minutes: timeDiffMinutes,
            min_travel_time_minutes: minTravelTime
          }
        });
      }
    }
  }
  
  return anomalies;
}
