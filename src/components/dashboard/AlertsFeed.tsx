import { AlertTriangle, AlertCircle, Info, Clock } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface Alert {
  id: number;
  time: string;
  message: string;
  zone: string;
  severity: 'high' | 'medium' | 'low';
  type: string;
}

const alerts: Alert[] = [
  {
    id: 1,
    time: '10:05 AM',
    message: 'Worker ID #552 & #553 marked attendance at exact same time from same device IP.',
    zone: 'Rohini',
    severity: 'high',
    type: 'Ghost Entry',
  },
  {
    id: 2,
    time: '09:48 AM',
    message: 'Unusual pattern detected: 8 workers checked in from unauthorized location.',
    zone: 'Dwarka Sector 12',
    severity: 'high',
    type: 'Location Anomaly',
  },
  {
    id: 3,
    time: '09:32 AM',
    message: 'Biometric mismatch detected for Worker ID #891. Manual verification required.',
    zone: 'Karol Bagh',
    severity: 'medium',
    type: 'Biometric',
  },
  {
    id: 4,
    time: '09:15 AM',
    message: 'Supervisor S. Sharma has not checked in. All team members awaiting assignment.',
    zone: 'Shahdara',
    severity: 'medium',
    type: 'Attendance',
  },
  {
    id: 5,
    time: '08:55 AM',
    message: 'RFID device sync error at checkpoint. 12 check-ins pending verification.',
    zone: 'South Delhi',
    severity: 'low',
    type: 'System',
  },
  {
    id: 6,
    time: '08:30 AM',
    message: 'Multiple rapid check-in/check-out cycles detected for Worker ID #334.',
    zone: 'Pitampura',
    severity: 'high',
    type: 'Ghost Entry',
  },
];

const AlertsFeed = () => {
  const severityConfig = {
    high: {
      icon: AlertTriangle,
      bg: 'bg-status-danger/10',
      border: 'border-status-danger/30',
      iconColor: 'text-status-danger',
      badge: 'bg-status-danger/15 text-status-danger',
    },
    medium: {
      icon: AlertCircle,
      bg: 'bg-status-warning/10',
      border: 'border-status-warning/30',
      iconColor: 'text-status-warning',
      badge: 'bg-status-warning/15 text-status-warning',
    },
    low: {
      icon: Info,
      bg: 'bg-primary/10',
      border: 'border-primary/30',
      iconColor: 'text-primary',
      badge: 'bg-primary/15 text-primary',
    },
  };

  return (
    <div className="dashboard-card h-full flex flex-col animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Recent AI Alerts</h3>
          <p className="text-sm text-muted-foreground">Live anomaly detection feed</p>
        </div>
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-status-danger/15 text-status-danger">
          {alerts.filter(a => a.severity === 'high').length} Critical
        </span>
      </div>

      <ScrollArea className="flex-1 -mx-5 px-5">
        <div className="space-y-3 pb-2">
          {alerts.map((alert) => {
            const config = severityConfig[alert.severity];
            const Icon = config.icon;

            return (
              <div
                key={alert.id}
                className={cn(
                  "p-3 rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-sm",
                  config.bg,
                  config.border
                )}
              >
                <div className="flex gap-3">
                  <div className={cn("mt-0.5", config.iconColor)}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn("text-xs font-medium px-1.5 py-0.5 rounded", config.badge)}>
                        {alert.type}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {alert.time}
                      </span>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">Zone: {alert.zone}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      <button className="mt-3 text-sm font-medium text-primary hover:text-primary/80 transition-colors text-center">
        View All Alerts →
      </button>
    </div>
  );
};

export default AlertsFeed;
