import { useState, useRef, useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

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
}

export default function AttendanceTab() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [present, setPresent] = useState<Attendance[]>([]);
  const [showCamera, setShowCamera] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Load employees
  useEffect(() => {
    fetch("http://localhost:5050/api/employees")
      .then(res => res.json())
      .then(setEmployees);

    loadAttendance();
  }, []);

  const loadAttendance = () => {
    fetch("http://localhost:5050/api/attendance")
      .then(res => res.json())
      .then(setPresent);
  };

  const startCamera = async (id: string) => {
    setSelectedEmployee(id);
    setShowCamera(true);

    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoRef.current) videoRef.current.srcObject = stream;
  };

  const takeSelfie = async () => {
    if (!selectedEmployee) return;

    await fetch("http://localhost:5050/api/attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employee_id: selectedEmployee })
    });

    setShowCamera(false);
    loadAttendance();
    alert("Attendance marked successfully!");
  };

  return (
    <div className="space-y-6">

      {/* Employee Picker */}
      <div className="dashboard-card p-6">
        <h3 className="font-bold mb-4">Select Employee</h3>
        <div className="grid md:grid-cols-3 gap-3">
          {employees.map(e => (
            <button
              key={e.id}
              onClick={() => startCamera(e.id)}
              className="border p-3 rounded hover:bg-primary/10"
            >
              <b>{e.name}</b>
              <div className="text-xs text-muted-foreground">
                {e.role} – {e.zone}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Camera */}
      {showCamera && (
        <div className="dashboard-card p-6 text-center">
          <video ref={videoRef} autoPlay className="mx-auto rounded" />
          <Button onClick={takeSelfie} className="mt-4">
            Capture & Mark Attendance
          </Button>
        </div>
      )}

      {/* Present List */}
      <div className="dashboard-card p-6">
        <h3 className="font-bold mb-3">Today’s Attendance</h3>
        {present.map(p => (
          <div key={p.employee_id} className="flex justify-between border-b py-2">
            <span>{p.name}</span>
            <span className="text-green-600 flex items-center gap-1">
              <CheckCircle size={14} /> {p.check_in}
            </span>
          </div>
        ))}
      </div>

    </div>
  );
}