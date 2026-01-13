import { useState, useRef, useEffect } from "react";
import { CheckCircle, Camera, MapPin, Clock, History, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface Employee {
  id: string;
  name: string;
  role: string;
  zone: string;
}

interface Attendance {
  employee_id: string;
  name: string;
  check_in: string;
  date: string;
}

interface AttendanceRecord {
  id: number;
  employee_id: string;
  date: string;
  check_in: string;
}

export default function AttendanceTab() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [present, setPresent] = useState<Attendance[]>([]);
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceRecord[]>([]);
  const [showCamera, setShowCamera] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(false);
  const [marking, setMarking] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const API_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/api`;

  useEffect(() => {
    loadEmployees();
    loadTodayAttendance();
  }, []);

  const loadEmployees = async () => {
    try {
      const res = await fetch(`${API_URL}/employees`, {
        headers: { 'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY }
      });
      const data = await res.json();
      setEmployees(data);
    } catch (error) {
      console.error('Failed to load employees:', error);
      toast.error('Failed to load employees');
    }
  };

  const loadTodayAttendance = async () => {
    try {
      const res = await fetch(`${API_URL}/attendance`, {
        headers: { 'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY }
      });
      const data = await res.json();
      setPresent(data);
    } catch (error) {
      console.error('Failed to load attendance:', error);
    }
  };

  const loadAttendanceHistory = async (employeeId: string) => {
    try {
      const res = await fetch(`${API_URL}/attendance-history/${employeeId}`, {
        headers: { 'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY }
      });
      const data = await res.json();
      setAttendanceHistory(data);
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  };

  const startCamera = async (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowCamera(true);
    setLoading(true);

    // Get location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          });
        },
        () => toast.error('Location access required for attendance')
      );
    }

    // Start camera
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      await loadAttendanceHistory(employee.id);
    } catch (error) {
      toast.error('Camera access required for attendance');
    }
    setLoading(false);
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
    setSelectedEmployee(null);
    setAttendanceHistory([]);
  };

  const markAttendance = async () => {
    if (!selectedEmployee) return;
    
    setMarking(true);
    try {
      const res = await fetch(`${API_URL}/attendance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
        },
        body: JSON.stringify({ employee_id: selectedEmployee.id })
      });

      if (!res.ok) throw new Error('Failed to mark attendance');

      toast.success(`Attendance marked for ${selectedEmployee.name}!`, {
        description: `Location: ${location?.lat.toFixed(4)}, ${location?.lng.toFixed(4)}`
      });

      stopCamera();
      loadTodayAttendance();
    } catch (error) {
      toast.error('Failed to mark attendance');
    }
    setMarking(false);
  };

  const isPresent = (employeeId: string) => {
    return present.some(p => p.employee_id === employeeId);
  };

  return (
    <div className="space-y-6">
      {/* Employee Picker */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Select Employee for Attendance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-3">
            {employees.map(e => (
              <motion.button
                key={e.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => !isPresent(e.id) && startCamera(e)}
                disabled={isPresent(e.id)}
                className={`border p-3 rounded-lg text-left transition-all ${
                  isPresent(e.id) 
                    ? 'bg-green-50 border-green-200 cursor-not-allowed' 
                    : 'hover:bg-primary/10 hover:border-primary'
                }`}
              >
                <div className="flex items-center justify-between">
                  <b className="text-sm">{e.name}</b>
                  {isPresent(e.id) && <CheckCircle className="h-4 w-4 text-green-500" />}
                </div>
                <div className="text-xs text-muted-foreground">
                  {e.role} – {e.zone}
                </div>
                <div className="text-xs text-muted-foreground font-mono">{e.id}</div>
              </motion.button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Camera Modal */}
      <AnimatePresence>
        {showCamera && selectedEmployee && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-2 border-primary">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Mark Attendance - {selectedEmployee.name}</span>
                  <Button variant="ghost" size="sm" onClick={stopCamera}>✕</Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Camera Section */}
                  <div className="space-y-4">
                    <div className="relative rounded-lg overflow-hidden bg-black aspect-video">
                      <video 
                        ref={videoRef} 
                        autoPlay 
                        playsInline 
                        muted
                        className="w-full h-full object-cover"
                      />
                      {loading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                          <Loader2 className="h-8 w-8 animate-spin text-white" />
                        </div>
                      )}
                    </div>
                    
                    {location && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 text-green-500" />
                        <span>Location verified: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}</span>
                      </div>
                    )}
                    
                    <Button 
                      onClick={markAttendance} 
                      className="w-full"
                      disabled={marking || !location}
                    >
                      {marking ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Marking...
                        </>
                      ) : (
                        <>
                          <Camera className="mr-2 h-4 w-4" />
                          Capture & Mark Attendance
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Last 10 Days History */}
                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-2">
                      <History className="h-4 w-4" />
                      Last 10 Days Attendance
                    </h4>
                    <div className="space-y-1 max-h-60 overflow-y-auto">
                      {attendanceHistory.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No attendance records found</p>
                      ) : (
                        attendanceHistory.map((record, i) => (
                          <motion.div
                            key={record.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex justify-between items-center p-2 rounded bg-muted/50"
                          >
                            <span className="text-sm font-medium">
                              {new Date(record.date).toLocaleDateString('en-IN', {
                                weekday: 'short',
                                day: 'numeric',
                                month: 'short'
                              })}
                            </span>
                            <span className="text-sm flex items-center gap-1 text-green-600">
                              <Clock className="h-3 w-3" />
                              {record.check_in}
                            </span>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Today's Attendance List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Today's Attendance ({present.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {present.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No attendance marked yet today</p>
          ) : (
            <div className="space-y-2">
              {present.map((p, i) => (
                <motion.div 
                  key={p.employee_id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex justify-between items-center border-b py-2 last:border-0"
                >
                  <span className="font-medium">{p.name}</span>
                  <span className="text-green-600 flex items-center gap-1 text-sm">
                    <CheckCircle size={14} /> {p.check_in}
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}