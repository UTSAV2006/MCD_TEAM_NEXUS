import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  fetchTodayAnomalies, 
  subscribeToAnomalies, 
  runFullGhostScan,
  getGhostDetectionStats,
  resolveAnomaly
} from '@/lib/ghostDetection';
import { useToast } from '@/hooks/use-toast';

export interface Anomaly {
  id: string;
  anomaly_type: 'buddy_punching' | 'shared_device' | 'impossible_travel';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  worker_ids: string[];
  zone: string | null;
  metadata: Record<string, any>;
  is_resolved: boolean;
  created_at: string;
}

export interface GhostStats {
  total: number;
  by_type: {
    buddy_punching: number;
    shared_device: number;
    impossible_travel: number;
  };
  by_severity: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

export function useGhostDetection() {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [stats, setStats] = useState<GhostStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const { toast } = useToast();

  // Fetch initial data
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [anomaliesData, statsData] = await Promise.all([
        fetchTodayAnomalies(),
        getGhostDetectionStats()
      ]);
      
      // Map the data to ensure correct types
      const mappedAnomalies: Anomaly[] = (anomaliesData || []).map((a: any) => ({
        ...a,
        metadata: typeof a.metadata === 'object' && a.metadata !== null ? a.metadata : {}
      }));
      
      setAnomalies(mappedAnomalies);
      if (statsData?.stats) {
        setStats(statsData.stats);
      }
    } catch (error) {
      console.error('Error loading ghost detection data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Run a full scan
  const runScan = useCallback(async () => {
    setIsScanning(true);
    try {
      const result = await runFullGhostScan();
      
      toast({
        title: 'AI Scan Complete',
        description: `Scanned ${result.logs_scanned} logs. Found ${result.anomalies_detected} anomalies.`,
        variant: result.anomalies_detected > 0 ? 'destructive' : 'default'
      });
      
      // Reload data after scan
      await loadData();
      
      return result;
    } catch (error) {
      console.error('Scan error:', error);
      toast({
        title: 'Scan Failed',
        description: 'Could not complete ghost detection scan.',
        variant: 'destructive'
      });
    } finally {
      setIsScanning(false);
    }
  }, [loadData, toast]);

  // Resolve an anomaly
  const handleResolve = useCallback(async (anomalyId: string, resolvedBy: string) => {
    try {
      await resolveAnomaly(anomalyId, resolvedBy);
      setAnomalies(prev => prev.map(a => 
        a.id === anomalyId 
          ? { ...a, is_resolved: true } 
          : a
      ));
      toast({
        title: 'Anomaly Resolved',
        description: 'The anomaly has been marked as resolved.'
      });
    } catch (error) {
      console.error('Error resolving anomaly:', error);
      toast({
        title: 'Error',
        description: 'Could not resolve the anomaly.',
        variant: 'destructive'
      });
    }
  }, [toast]);

  // Subscribe to real-time updates
  useEffect(() => {
    loadData();
    
    const unsubscribe = subscribeToAnomalies((newAnomaly) => {
      setAnomalies(prev => [newAnomaly, ...prev]);
      
      // Show toast for new critical/high anomalies
      if (newAnomaly.severity === 'critical' || newAnomaly.severity === 'high') {
        toast({
          title: `🚨 ${newAnomaly.title}`,
          description: newAnomaly.description,
          variant: 'destructive'
        });
      }
    });
    
    return unsubscribe;
  }, [loadData, toast]);

  return {
    anomalies,
    stats,
    isLoading,
    isScanning,
    runScan,
    handleResolve,
    refresh: loadData
  };
}
