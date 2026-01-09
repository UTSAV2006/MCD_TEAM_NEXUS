-- Create enum for anomaly types
CREATE TYPE public.anomaly_type AS ENUM ('buddy_punching', 'shared_device', 'impossible_travel');

-- Create enum for anomaly severity
CREATE TYPE public.anomaly_severity AS ENUM ('low', 'medium', 'high', 'critical');

-- Create workers table
CREATE TABLE public.workers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  zone TEXT NOT NULL,
  department TEXT,
  phone TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create attendance_logs table for tracking check-ins/check-outs
CREATE TABLE public.attendance_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id UUID REFERENCES public.workers(id) ON DELETE CASCADE NOT NULL,
  check_in_time TIMESTAMPTZ NOT NULL DEFAULT now(),
  check_out_time TIMESTAMPTZ,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  device_fingerprint TEXT,
  ip_address TEXT,
  verification_method TEXT DEFAULT 'rfid',
  is_verified BOOLEAN DEFAULT false,
  zone TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create device_fingerprints table to track device usage patterns
CREATE TABLE public.device_fingerprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fingerprint TEXT UNIQUE NOT NULL,
  screen_resolution TEXT,
  os_version TEXT,
  browser_info TEXT,
  first_seen_at TIMESTAMPTZ DEFAULT now(),
  last_seen_at TIMESTAMPTZ DEFAULT now(),
  total_workers_count INT DEFAULT 1,
  flagged BOOLEAN DEFAULT false
);

-- Create anomalies table for storing detected ghost employee patterns
CREATE TABLE public.anomalies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  anomaly_type anomaly_type NOT NULL,
  severity anomaly_severity NOT NULL DEFAULT 'medium',
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  worker_ids UUID[] NOT NULL,
  attendance_log_ids UUID[],
  zone TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  metadata JSONB DEFAULT '{}',
  is_resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMPTZ,
  resolved_by TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create worker_locations table for real-time GPS tracking
CREATE TABLE public.worker_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id UUID REFERENCES public.workers(id) ON DELETE CASCADE NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  accuracy DECIMAL(6, 2),
  recorded_at TIMESTAMPTZ DEFAULT now(),
  zone TEXT
);

-- Enable RLS on all tables
ALTER TABLE public.workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_fingerprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anomalies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.worker_locations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for workers (public read for dashboard, authenticated write)
CREATE POLICY "Anyone can view workers" ON public.workers FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert workers" ON public.workers FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update workers" ON public.workers FOR UPDATE TO authenticated USING (true);

-- RLS Policies for attendance_logs
CREATE POLICY "Anyone can view attendance logs" ON public.attendance_logs FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert attendance" ON public.attendance_logs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update attendance" ON public.attendance_logs FOR UPDATE TO authenticated USING (true);

-- RLS Policies for device_fingerprints
CREATE POLICY "Anyone can view device fingerprints" ON public.device_fingerprints FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage fingerprints" ON public.device_fingerprints FOR ALL TO authenticated USING (true);

-- RLS Policies for anomalies
CREATE POLICY "Anyone can view anomalies" ON public.anomalies FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert anomalies" ON public.anomalies FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update anomalies" ON public.anomalies FOR UPDATE TO authenticated USING (true);

-- RLS Policies for worker_locations
CREATE POLICY "Anyone can view locations" ON public.worker_locations FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert locations" ON public.worker_locations FOR INSERT TO authenticated WITH CHECK (true);

-- Enable realtime for anomalies table
ALTER PUBLICATION supabase_realtime ADD TABLE public.anomalies;
ALTER PUBLICATION supabase_realtime ADD TABLE public.attendance_logs;

-- Create indexes for performance
CREATE INDEX idx_attendance_worker ON public.attendance_logs(worker_id);
CREATE INDEX idx_attendance_time ON public.attendance_logs(check_in_time DESC);
CREATE INDEX idx_attendance_device ON public.attendance_logs(device_fingerprint);
CREATE INDEX idx_anomalies_type ON public.anomalies(anomaly_type);
CREATE INDEX idx_anomalies_created ON public.anomalies(created_at DESC);
CREATE INDEX idx_locations_worker ON public.worker_locations(worker_id);
CREATE INDEX idx_locations_time ON public.worker_locations(recorded_at DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for workers updated_at
CREATE TRIGGER update_workers_updated_at
  BEFORE UPDATE ON public.workers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();