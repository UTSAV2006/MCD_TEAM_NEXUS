import { MapPin, Users, AlertTriangle, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const MapWidget = () => {
  const hotspots = [
    { id: 1, name: 'Rohini Sector 7', workers: 245, status: 'normal', x: 30, y: 25 },
    { id: 2, name: 'Dwarka Sector 12', workers: 189, status: 'normal', x: 20, y: 60 },
    { id: 3, name: 'Shahdara', workers: 312, status: 'warning', x: 75, y: 35 },
    { id: 4, name: 'South Delhi', workers: 278, status: 'normal', x: 50, y: 70 },
    { id: 5, name: 'Karol Bagh', workers: 156, status: 'danger', x: 45, y: 40 },
    { id: 6, name: 'Pitampura', workers: 198, status: 'normal', x: 35, y: 20 },
  ];

  const rapidTeams = [
    { id: 1, name: 'Team Alpha', x: 55, y: 45 },
    { id: 2, name: 'Team Beta', x: 25, y: 35 },
    { id: 3, name: 'Team Gamma', x: 70, y: 55 },
  ];

  return (
    <div className="dashboard-card h-full animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Live Workforce Heatmap - Delhi NCR</h3>
          <p className="text-sm text-muted-foreground">Real-time geofencing visualization</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-status-success"></span>
            </span>
            Live
          </Badge>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative h-[320px] sm:h-[400px] rounded-lg overflow-hidden bg-gradient-to-br from-primary/5 to-accent/10 border border-border">
        {/* Delhi Map Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-primary"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
            {/* Delhi boundary approximation */}
            <path 
              d="M 15,20 Q 25,10 45,15 Q 70,12 85,25 Q 90,45 85,65 Q 75,85 50,88 Q 25,90 12,70 Q 8,45 15,20 Z" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="0.5" 
              className="text-primary"
            />
          </svg>
        </div>

        {/* Heatmap Hotspots */}
        {hotspots.map((spot) => {
          const sizeClass = spot.workers > 250 ? 'w-16 h-16' : spot.workers > 180 ? 'w-12 h-12' : 'w-10 h-10';
          const bgColor = spot.status === 'danger' ? 'bg-status-danger/30' : spot.status === 'warning' ? 'bg-status-warning/30' : 'bg-status-success/30';
          const borderColor = spot.status === 'danger' ? 'border-status-danger' : spot.status === 'warning' ? 'border-status-warning' : 'border-status-success';

          return (
            <div
              key={spot.id}
              className={`absolute ${sizeClass} rounded-full ${bgColor} border-2 ${borderColor} flex items-center justify-center cursor-pointer hover:scale-110 transition-transform group`}
              style={{ left: `${spot.x}%`, top: `${spot.y}%`, transform: 'translate(-50%, -50%)' }}
            >
              {spot.status === 'danger' && (
                <span className="absolute inset-0 rounded-full border-2 border-status-danger animate-ping opacity-50"></span>
              )}
              <span className="text-xs font-bold text-foreground">{spot.workers}</span>
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                <p className="font-semibold">{spot.name}</p>
                <p>{spot.workers} workers active</p>
              </div>
            </div>
          );
        })}

        {/* Rapid Action Teams (Moving pins) */}
        {rapidTeams.map((team) => (
          <div
            key={team.id}
            className="absolute w-6 h-6 cursor-pointer group"
            style={{ left: `${team.x}%`, top: `${team.y}%`, transform: 'translate(-50%, -50%)' }}
          >
            <div className="relative">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg animate-bounce" style={{ animationDuration: '2s' }}>
                <Users className="w-3 h-3 text-primary-foreground" />
              </div>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary rotate-45"></div>
            </div>
            
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 px-2 py-1 bg-primary text-primary-foreground text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
              {team.name}
            </div>
          </div>
        ))}

        {/* Legend */}
        <div className="absolute bottom-3 left-3 bg-card/95 backdrop-blur-sm rounded-lg p-3 shadow-md border border-border">
          <div className="flex flex-wrap gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-status-success/50 border border-status-success"></span>
              <span className="text-muted-foreground">Normal</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-status-warning/50 border border-status-warning"></span>
              <span className="text-muted-foreground">Warning</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-status-danger/50 border border-status-danger"></span>
              <span className="text-muted-foreground">Anomaly</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-3 h-3 text-primary" />
              <span className="text-muted-foreground">Rapid Team</span>
            </div>
          </div>
        </div>

        {/* Zone Counter */}
        <div className="absolute top-3 right-3 bg-card/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md border border-border">
          <div className="flex items-center gap-4 text-xs">
            <div className="text-center">
              <p className="font-bold text-foreground">6</p>
              <p className="text-muted-foreground">Zones</p>
            </div>
            <div className="h-8 w-px bg-border"></div>
            <div className="text-center">
              <p className="font-bold text-status-success">1,378</p>
              <p className="text-muted-foreground">Active</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapWidget;
