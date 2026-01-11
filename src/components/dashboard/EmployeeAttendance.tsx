import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock, AlertTriangle, Calendar, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050';

interface AttendanceRecord {
  id: number;
  employee_id: string;
  date: string;
  check_in: string;
}

interface EmployeeAttendanceProps {
  employeeId: string;
  fullView?: boolean;
}

export default function EmployeeAttendance({ employeeId, fullView = false }: EmployeeAttendanceProps) {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/api/employee-attendance/${employeeId}`)
      .then(res => res.json())
      .then(data => {
        setAttendance(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [employeeId]);

  // Calculate stats
  const thisMonth = new Date().getMonth();
  const monthlyAttendance = attendance.filter(a => new Date(a.date).getMonth() === thisMonth);
  const presentDays = monthlyAttendance.length;
  const workingDays = 26; // Approximate
  const attendancePercentage = Math.round((presentDays / workingDays) * 100);

  // Prepare chart data
  const chartData = attendance.slice(0, 14).reverse().map(a => ({
    date: new Date(a.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
    present: 1,
    checkIn: a.check_in,
  }));

  const getStatusColor = (checkIn: string) => {
    const hour = parseInt(checkIn?.split(':')[0] || '9');
    if (hour <= 9) return 'text-status-success';
    if (hour <= 10) return 'text-status-warning';
    return 'text-status-danger';
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          Loading attendance data...
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={fullView ? 'space-y-6' : ''}
    >
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5 text-primary" />
            My Attendance
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Stats Summary */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-3 bg-status-success/10 rounded-lg">
              <CheckCircle className="h-5 w-5 text-status-success mx-auto mb-1" />
              <p className="text-2xl font-bold text-status-success">{presentDays}</p>
              <p className="text-xs text-muted-foreground">Present</p>
            </div>
            <div className="text-center p-3 bg-status-danger/10 rounded-lg">
              <XCircle className="h-5 w-5 text-status-danger mx-auto mb-1" />
              <p className="text-2xl font-bold text-status-danger">{workingDays - presentDays}</p>
              <p className="text-xs text-muted-foreground">Absent</p>
            </div>
            <div className="text-center p-3 bg-primary/10 rounded-lg">
              <TrendingUp className="h-5 w-5 text-primary mx-auto mb-1" />
              <p className="text-2xl font-bold text-primary">{attendancePercentage}%</p>
              <p className="text-xs text-muted-foreground">Rate</p>
            </div>
          </div>

          {/* Chart */}
          {chartData.length > 0 && (
            <div className="h-40 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px' 
                    }}
                    formatter={(value: any, name: string, props: any) => [
                      props.payload.checkIn || 'N/A',
                      'Check-in'
                    ]}
                  />
                  <Bar dataKey="present" fill="hsl(var(--status-success))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Full View - Recent Records */}
      {fullView && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Attendance Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {attendance.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No attendance records found</p>
              ) : (
                attendance.slice(0, 15).map((record, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-status-success" />
                      <span className="text-sm">
                        {new Date(record.date).toLocaleDateString('en-IN', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className={`h-3 w-3 ${getStatusColor(record.check_in)}`} />
                      <span className={`text-sm font-medium ${getStatusColor(record.check_in)}`}>
                        {record.check_in || 'N/A'}
                      </span>
                      <Badge variant="outline" className="text-status-success">Present</Badge>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
