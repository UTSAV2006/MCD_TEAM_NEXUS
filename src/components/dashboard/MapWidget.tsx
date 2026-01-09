import { useState, useEffect } from 'react';
import { MapPin, Users, AlertTriangle, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const MapWidget = () => {
  const [hotspots, setHotspots] = useState([
    { id: 1, name: 'Rohini Sector 7', workers: 245, status: 'normal', x: 30, y: 25 },
    { id: 2, name: 'Dwarka Sector 12', workers: 189, status: 'normal', x: 20, y: 60 },
    { id: 3, name: 'Shahdara', workers: 312, status: 'warning', x: 75, y: 35 },
    { id: 4, name: 'South Delhi', workers: 278, status: 'normal', x: 50, y: 70 },
    { id: 5, name: 'Karol Bagh', workers: 156, status: 'danger', x: 45, y: 40 },
    { id: 6, name: 'Pitampura', workers: 198, status: 'normal', x: 35, y: 20 },
  ]);

  const [rapidTeams, setRapidTeams] = useState([
    { id: 1, name: 'Team Alpha', x: 55, y: 45 },
    { id: 2, name: 'Team Beta', x: 25, y: 35 },
    { id: 3, name: 'Team Gamma', x: 70, y: 55 },
  ]);

  // Simulate Live Movement & Data
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly change worker counts
      setHotspots(prev => prev.map(spot => ({
        ...spot,
        workers: spot.workers + (Math.random() > 0.5 ? 1 : -1)
      })));

      // Slightly move Rapid Teams (Patrolling effect)
      setRapidTeams(prev => prev.map(team => ({
        ...team,
        x: team.x + (Math.random() - 0.5) * 0.5,
        y: team.y + (Math.random() - 0.5) * 0.5,
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard-card h-full animate-fade-in-up">
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
        </div>
      </div>

      <div className="relative h-[320px] sm:h-[400px] rounded-lg overflow-hidden bg-gradient-to-br from-primary/5 to-accent/10 border border-border">
        {/* Map Grid Background */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.3" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>

        {/* Hotspots */}
        {hotspots.map((spot) => (
          <div
            key={spot.id}
            className={cn(
              "absolute rounded-full border-2 flex items-center justify-center cursor-pointer hover:scale-110 transition-all duration-1000 group",
              spot.status === 'danger' ? "bg-status-danger/30 border-status-danger" : 
              spot.status === 'warning' ? "bg-status-warning/30 border-status-warning" : "bg-status-success/30 border-status-success",
              spot.workers > 250 ? 'w-16 h-16' : spot.workers > 180 ? 'w-12 h-12' : 'w-10 h-10'
            )}
            style={{ left: `${spot.x}%`, top: `${spot.y}%`, transform: 'translate(-50%, -50%)' }}
            onClick={() => alert(`Zone: ${spot.name}\nActive Workers: ${spot.workers}`)}
          >
            {spot.status === 'danger' && (
              <span className="absolute inset-0 rounded-full border-2 border-status-danger animate-ping opacity-50"></span>
            )}
            <span className="text-xs font-bold">{spot.workers}</span>
            <div className="absolute bottom-full mb-2 hidden group-hover:block bg-popover text-popover-foreground text-[10px] p-1 rounded shadow-md z-20">
              {spot.name}
            </div>
          </div>
        ))}

        {/* Rapid Teams */}
        {rapidTeams.map((team) => (
          <div
            key={team.id}
            className="absolute transition-all duration-1000 ease-linear"
            style={{ left: `${team.x}%`, top: `${team.y}%`, transform: 'translate(-50%, -50%)' }}
          >
            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg animate-bounce">
              <Users className="w-3 h-3 text-primary-foreground" />
            </div>
          </div>
        ))}

        {/* Legend */}
        <div className="absolute bottom-3 left-3 bg-card/90 backdrop-blur-sm p-2 rounded border border-border text-[10px] flex gap-3">
          <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-status-success"></span> Normal</div>
          <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-status-danger"></span> Anomaly</div>
        </div>
      </div>
    </div>
  );
};

export default MapWidget;
