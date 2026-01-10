import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Clock, MapPin, Users, CheckCircle, Zap, Timer } from 'lucide-react';
import { incidentDatabase, rafTeams, RAFIncident } from '@/lib/mockdata';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const RAFCenter = () => {
  const [incidents, setIncidents] = useState(incidentDatabase);
  const [activeDispatch, setActiveDispatch] = useState<RAFIncident | null>(null);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (activeDispatch && countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && activeDispatch) {
      setIncidents(prev => prev.map(i => i.id === activeDispatch.id ? { ...i, status: 'Resolved' as const } : i));
      setActiveDispatch(null);
    }
  }, [countdown, activeDispatch]);

  const handleDispatch = (incident: RAFIncident) => {
    setActiveDispatch(incident);
    setCountdown(incident.eta || 30);
    setIncidents(prev => prev.map(i => i.id === incident.id ? { ...i, status: 'In Progress' as const } : i));
  };

  const getPriorityColor = (p: string) => {
    if (p === 'Critical') return 'bg-status-danger text-white';
    if (p === 'High') return 'bg-status-warning text-white';
    return 'bg-muted';
  };

  const openIncidents = incidents.filter(i => i.status === 'Open' || i.status === 'Dispatched');

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Active Dispatch Banner */}
      <AnimatePresence>
        {activeDispatch && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="dashboard-card bg-status-warning/10 border-status-warning/30 overflow-hidden"
          >
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-status-warning/20 rounded-full animate-pulse">
                  <Timer className="h-6 w-6 text-status-warning" />
                </div>
                <div>
                  <p className="font-semibold">Team En Route: {activeDispatch.title}</p>
                  <p className="text-sm text-muted-foreground">{activeDispatch.location}</p>
                </div>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-status-warning">{Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, '0')}</p>
                <p className="text-xs text-muted-foreground">ETA</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Incidents List */}
        <div className="lg:col-span-2 dashboard-card">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-status-danger" />
            Active Incidents ({openIncidents.length})
          </h3>
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {openIncidents.slice(0, 8).map((incident, i) => (
              <motion.div
                key={incident.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="p-3 border rounded-lg hover:bg-muted/30"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={getPriorityColor(incident.priority)}>{incident.priority}</Badge>
                      <span className="text-xs text-muted-foreground">{incident.id}</span>
                    </div>
                    <p className="font-medium">{incident.title}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />{incident.location} • {incident.zone}
                    </p>
                  </div>
                  {incident.status === 'Open' && (
                    <Button size="sm" onClick={() => handleDispatch(incident)} className="gap-1">
                      <Zap className="h-3 w-3" />Dispatch
                    </Button>
                  )}
                  {incident.status === 'In Progress' && (
                    <Badge variant="secondary" className="animate-pulse">In Progress</Badge>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Teams Readiness */}
        <div className="dashboard-card">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />Team Readiness
          </h3>
          <div className="space-y-3">
            {rafTeams.map((team, i) => (
              <div key={team.id} className="p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">{team.name}</span>
                  <Badge variant={team.status === 'Ready' ? 'default' : team.status === 'Deployed' ? 'secondary' : 'outline'}>
                    {team.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{team.vehicleNumber}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RAFCenter;
