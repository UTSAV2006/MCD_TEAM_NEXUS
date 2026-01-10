import { Ghost, Scan, Shield, AlertTriangle, Users, MapPin, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGhostDetection, Anomaly } from '@/hooks/useGhostDetection';
import { cn } from '@/lib/utils';

const GhostDetectionPanel = () => {
  const { anomalies, stats, isLoading, isScanning, runScan, handleResolve } = useGhostDetection();

  const unresolvedAnomalies = anomalies.filter(a => !a.is_resolved);

  const getAnomalyIcon = (type: Anomaly['anomaly_type']) => {
    switch (type) {
      case 'buddy_punching':
        return Users;
      case 'shared_device':
        return Ghost;
      case 'impossible_travel':
        return MapPin;
      default:
        return AlertTriangle;
    }
  };

  const getSeverityColor = (severity: Anomaly['severity']) => {
    switch (severity) {
      case 'critical':
        return 'bg-status-danger text-white';
      case 'high':
        return 'bg-status-danger/80 text-white';
      case 'medium':
        return 'bg-status-warning text-white';
      case 'low':
        return 'bg-primary/60 text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeLabel = (type: Anomaly['anomaly_type']) => {
    switch (type) {
      case 'buddy_punching':
        return 'Buddy Punching';
      case 'shared_device':
        return 'Shared Device';
      case 'impossible_travel':
        return 'Impossible Travel';
      default:
        return type;
    }
  };

  return (
    <div className="dashboard-card animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-status-danger/10">
            <Ghost className="h-5 w-5 text-status-danger" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">AI Ghost Detection</h3>
            <p className="text-sm text-muted-foreground">Real-time anomaly monitoring</p>
          </div>
        </div>
        <Button 
          onClick={runScan} 
          disabled={isScanning}
          size="sm"
          className="gap-2"
        >
          <Scan className={cn("h-4 w-4", isScanning && "animate-spin")} />
          {isScanning ? 'Scanning...' : 'Run AI Scan'}
        </Button>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          <div className="p-3 rounded-lg bg-status-danger/10 border border-status-danger/20">
            <div className="text-2xl font-bold text-status-danger">{stats.total}</div>
            <div className="text-xs text-muted-foreground">Total Anomalies</div>
          </div>
          <div className="p-3 rounded-lg bg-status-warning/10 border border-status-warning/20">
            <div className="text-2xl font-bold text-status-warning">{stats.by_type.buddy_punching}</div>
            <div className="text-xs text-muted-foreground">Buddy Punching</div>
          </div>
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
            <div className="text-2xl font-bold text-primary">{stats.by_type.shared_device}</div>
            <div className="text-xs text-muted-foreground">Shared Devices</div>
          </div>
          <div className="p-3 rounded-lg bg-status-danger/10 border border-status-danger/20">
            <div className="text-2xl font-bold text-status-danger">{stats.by_type.impossible_travel}</div>
            <div className="text-xs text-muted-foreground">Impossible Travel</div>
          </div>
        </div>
      )}

      {/* Anomalies List */}
      <div className="border-t border-border pt-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-foreground">
            Active Alerts ({unresolvedAnomalies.length})
          </h4>
          {unresolvedAnomalies.length > 0 && (
            <Badge variant="destructive" className="animate-pulse">
              {stats?.by_severity.critical || 0} Critical
            </Badge>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <Scan className="h-5 w-5 animate-spin mr-2" />
            Loading...
          </div>
        ) : unresolvedAnomalies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <Shield className="h-10 w-10 mb-2 text-status-success" />
            <p className="text-sm">No active anomalies detected</p>
            <p className="text-xs">System is monitoring for ghost employees</p>
          </div>
        ) : (
          <ScrollArea className="h-[300px] -mx-5 px-5">
            <div className="space-y-3">
              {unresolvedAnomalies.map((anomaly) => {
                const Icon = getAnomalyIcon(anomaly.anomaly_type);
                
                return (
                  <div
                    key={anomaly.id}
                    className={cn(
                      "p-3 rounded-lg border transition-all",
                      anomaly.severity === 'critical' 
                        ? "bg-status-danger/5 border-status-danger/30 animate-pulse"
                        : anomaly.severity === 'high'
                        ? "bg-status-danger/5 border-status-danger/20"
                        : "bg-muted/50 border-border"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "p-1.5 rounded",
                        anomaly.severity === 'critical' || anomaly.severity === 'high'
                          ? "bg-status-danger/20 text-status-danger"
                          : "bg-status-warning/20 text-status-warning"
                      )}>
                        <Icon className="h-4 w-4" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <Badge className={getSeverityColor(anomaly.severity)}>
                            {anomaly.severity.toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {getTypeLabel(anomaly.anomaly_type)}
                          </Badge>
                          {anomaly.zone && (
                            <span className="text-xs text-muted-foreground">
                              Zone: {anomaly.zone}
                            </span>
                          )}
                        </div>
                        
                        <p className="text-sm font-medium text-foreground mb-1">
                          {anomaly.title}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {anomaly.description}
                        </p>
                        
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {new Date(anomaly.created_at).toLocaleTimeString('en-IN', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs gap-1"
                            onClick={() => handleResolve(anomaly.id)}
                          >
                            <CheckCircle className="h-3 w-3" />
                            Resolve
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
};

export default GhostDetectionPanel;
