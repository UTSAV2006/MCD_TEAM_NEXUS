import { useState } from 'react';
import { AlertTriangle, Send, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';

const RapidTask = () => {
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Issue Reported to Command Center! Task ID: " + Math.floor(Math.random() * 10000));
    setDescription('');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="dashboard-card">
        <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
          <AlertTriangle className="text-status-danger" /> Report On-Ground Issue
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Issue Type</label>
            <select className="w-full p-2.5 rounded-lg border bg-muted text-sm">
              <option>Waste Collection Delay</option>
              <option>Equipment Failure</option>
              <option>Attendance Anomaly</option>
              <option>Other Emergency</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Description</label>
            <textarea 
              className="w-full p-2.5 rounded-lg border bg-muted text-sm h-32" 
              placeholder="Describe the issue in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" className="flex-1 gap-2">
              <Camera className="h-4 w-4" /> Upload Photo
            </Button>
            <Button type="submit" className="flex-1 gap-2">
              <Send className="h-4 w-4" /> Submit Report
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RapidTask;