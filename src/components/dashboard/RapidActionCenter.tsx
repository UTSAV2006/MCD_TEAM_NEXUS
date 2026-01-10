import { useState } from 'react';
import { Zap, MapPin, Users, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Emergency {
  id: string;
  type: string;
  location: string;
  priority: 'Critical' | 'High' | 'Medium';
  status: 'Unassigned' | 'Dispatching' | 'On-Site' | 'Resolved';
  assignedTeam?: string;
}

const RapidActionCenter = () => {
  const [incidents, setIncidents] = useState<Emergency[]>([
    { id: 'EMG-101', type: 'Illegal Waste Dumping', location: 'Rohini Sec-7', priority: 'Critical', status: 'Unassigned' },
    { id: 'EMG-102', type: 'Public Health Hazard', location: 'Karol Bagh', priority: 'High', status: 'On-Site', assignedTeam: 'Team Arjun' },
    { id: 'EMG-103', type: 'Water Logging', location: 'Najafgarh', priority: 'Medium', status: 'Unassigned' },
  ]);

  const dispatchTeam = (id: string) => {
    setIncidents(prev => prev.map(inc => 
      inc.id === id ? { ...inc, status: 'Dispatching', assignedTeam: `Team ${['Garuda', 'Bheem', 'Chetak'][Math.floor(Math.random() * 3)]}` } : inc
    ));
    setTimeout(() => alert("Rapid Force Dispatched! Team is en route."), 500);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-700">
      {/* Incident List */}
      <div className="xl:col-span-2 space-y-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Zap className="text-status-warning fill-status-warning" /> Active Emergencies
        </h3>
        {incidents.map((inc) => (
          <div key={inc.id} className="dashboard-card flex items-center justify-between p-5 border-l-4 border-l-status-danger">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg">{inc.type}</span>
                <Badge className={inc.priority === 'Critical' ? 'bg-status-danger' : 'bg-status-warning'}>{inc.priority}</Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {inc.location}</span>
                <span className="flex items-center gap-1"><AlertCircle className="h-3 w-3" /> ID: {inc.id}</span>
              </div>
            </div>
            
            <div className="text-right space-y-2">
              <div className="text-sm font-medium">
                {inc.status === 'Unassigned' ? (
                  <Button size="sm" onClick={() => dispatchTeam(inc.id)} className="bg-status-danger hover:bg-red-700">Dispatch RAF</Button>
                ) : (
                  <div className="flex flex-col items-end">
                    <Badge variant="outline" className="text-status-success border-status-success">{inc.status}</Badge>
                    <span className="text-[10px] text-muted-foreground mt-1">Assigned: {inc.assignedTeam}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* RAF Team Availability Stats */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold">Force Readiness</h3>
        <div className="dashboard-card p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-status-success/10 rounded-lg"><Users className="text-status-success" /></div>
              <div>
                <p className="text-sm text-muted-foreground">Available Teams</p>
                <p className="text-2xl font-bold">08</p>
              </div>
            </div>
            <div className="h-10 w-px bg-border" />
            <div className="flex items-center gap-3">
              <div className="p-2 bg-status-danger/10 rounded-lg"><Clock className="text-status-danger" /></div>
              <div>
                <p className="text-sm text-muted-foreground">Avg. Response</p>
                <p className="text-2xl font-bold">14m</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold">Active Patrols</p>
            {['Team Garuda', 'Team Arjun', 'Team Bheem'].map(team => (
              <div key={team} className="flex items-center justify-between text-xs p-2 bg-muted rounded">
                <span>{team}</span>
                <span className="flex items-center gap-1 text-status-success"><CheckCircle2 className="h-3 w-3" /> Operational</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RapidActionCenter;