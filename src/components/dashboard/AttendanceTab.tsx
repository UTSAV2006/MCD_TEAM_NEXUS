import { useState, useRef } from 'react';
import { Camera, Calendar, CheckCircle, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AttendanceTab = () => {
  const [showCamera, setShowCamera] = useState(false);
  const [captured, setCaptured] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Camera start logic
  const startCamera = async () => {
    setShowCamera(true);
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoRef.current) videoRef.current.srcObject = stream;
  };

  const takeSelfie = () => {
    setCaptured(true);
    setTimeout(() => {
      setShowCamera(false);
      setCaptured(false);
      alert("Attendance Marked Successfully with Face ID!");
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Selfie Section */}
      <div className="dashboard-card text-center p-8 border-2 border-dashed border-primary/30">
        {!showCamera ? (
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Camera className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Mark Your Attendance</h3>
            <p className="text-muted-foreground mb-4">Take a quick selfie to verify your presence on-site.</p>
            <Button onClick={startCamera}>Open Camera & Mark</Button>
          </div>
        ) : (
          <div className="relative max-w-md mx-auto rounded-lg overflow-hidden border-4 border-primary">
            <video ref={videoRef} autoPlay className="w-full" />
            <Button onClick={takeSelfie} className="absolute bottom-4 left-1/2 -translate-x-1/2 shadow-xl">
              {captured ? "Verifying..." : "Capture Selfie"}
            </Button>
          </div>
        )}
      </div>

      {/* Monthly Attendance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="dashboard-card p-4 bg-status-success/5 border-status-success/20">
          <p className="text-sm text-muted-foreground">Days Present</p>
          <p className="text-3xl font-bold text-status-success">22</p>
        </div>
        <div className="dashboard-card p-4 bg-status-danger/5 border-status-danger/20">
          <p className="text-sm text-muted-foreground">Absents</p>
          <p className="text-3xl font-bold text-status-danger">1</p>
        </div>
        <div className="dashboard-card p-4 bg-primary/5 border-primary/20">
          <p className="text-sm text-muted-foreground">Leave Balance</p>
          <p className="text-3xl font-bold text-primary">4</p>
        </div>
      </div>

      {/* Recent History Table */}
      <div className="dashboard-card overflow-hidden">
        <h3 className="text-lg font-semibold mb-4 px-4 pt-4">Attendance History - January 2026</h3>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted text-xs uppercase">
              <th className="p-3">Date</th>
              <th className="p-3">Check In</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {[...Array(5)].map((_, i) => (
              <tr key={i} className="border-t">
                <td className="p-3 font-medium">Jan {9 - i}, 2026</td>
                <td className="p-3">09:15 AM</td>
                <td className="p-3"><span className="text-status-success flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Present</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceTab;