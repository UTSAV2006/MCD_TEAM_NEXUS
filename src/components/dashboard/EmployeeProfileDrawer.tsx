import { X, Mail, Phone, MapPin, Calendar, Star, AlertTriangle, TrendingUp, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Employee, getEmployeeAttendanceSparkline, attendanceDatabase, payrollDatabase } from '@/lib/mockdata';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';

interface EmployeeProfileDrawerProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
}

const EmployeeProfileDrawer = ({ employee, isOpen, onClose }: EmployeeProfileDrawerProps) => {
  if (!employee) return null;
  
  const sparklineData = getEmployeeAttendanceSparkline(employee.id);
  const recentAttendance = attendanceDatabase
    .filter(a => a.employeeId === employee.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 7);
  
  const payroll = payrollDatabase.find(p => p.employeeId === employee.id);
  const anomalyCount = recentAttendance.filter(a => a.isGhostFlagged).length;
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Present': return 'text-status-success';
      case 'Absent': return 'text-status-danger';
      case 'Half-day': return 'text-status-warning';
      case 'Anomaly': return 'text-status-danger';
      case 'Leave': return 'text-primary';
      default: return 'text-muted-foreground';
    }
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-card border-l border-border z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Employee Profile</h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Profile Header */}
            <div className="p-6 text-center border-b border-border bg-gradient-to-b from-primary/5 to-transparent">
              <img
                src={employee.avatar}
                alt={employee.name}
                className="w-20 h-20 rounded-full mx-auto mb-3 border-4 border-primary/20"
              />
              <h3 className="text-xl font-bold">{employee.name}</h3>
              <p className="text-sm text-muted-foreground">{employee.id}</p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <Badge variant={employee.status === 'Active' ? 'default' : 'secondary'}>
                  {employee.status}
                </Badge>
                {anomalyCount > 0 && (
                  <Badge variant="destructive" className="gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    {anomalyCount} Flags
                  </Badge>
                )}
              </div>
            </div>
            
            {/* Performance Sparkline */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-status-success" />
                  14-Day Attendance Trend
                </span>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Star className="h-3 w-3 text-status-warning" />
                  {employee.performance}
                </span>
              </div>
              <div className="h-16 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sparklineData}>
                    <Tooltip 
                      contentStyle={{ 
                        background: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                      formatter={(value: number) => [`${value}%`, 'Attendance']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="hsl(var(--status-success))" 
                      strokeWidth={2}
                      dot={{ r: 3, fill: 'hsl(var(--status-success))' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Contact Info */}
            <div className="p-4 space-y-3 border-b border-border">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Contact</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{employee.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{employee.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{employee.address}</span>
                </div>
              </div>
            </div>
            
            {/* Work Info */}
            <div className="p-4 space-y-3 border-b border-border">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Work Details</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Role</p>
                  <p className="font-medium text-sm">{employee.role}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Department</p>
                  <p className="font-medium text-sm">{employee.department}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Building2 className="h-3 w-3" /> Zone
                  </p>
                  <p className="font-medium text-sm">{employee.zone}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Joined
                  </p>
                  <p className="font-medium text-sm">{new Date(employee.joiningDate).toLocaleDateString('en-IN')}</p>
                </div>
              </div>
            </div>
            
            {/* Recent Attendance */}
            <div className="p-4 space-y-3 border-b border-border">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Recent Attendance</h4>
              <div className="space-y-2">
                {recentAttendance.map((record, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg text-sm">
                    <span>{new Date(record.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                    <div className="flex items-center gap-2">
                      {record.checkIn && <span className="text-xs text-muted-foreground">{record.checkIn}</span>}
                      <Badge variant="outline" className={getStatusColor(record.status)}>
                        {record.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Payroll Summary */}
            {payroll && (
              <div className="p-4 space-y-3">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Payroll Summary</h4>
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Net Salary</span>
                    <span className="text-xl font-bold text-primary">₹{payroll.netSalary.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Days Worked: {payroll.daysWorked}</span>
                    <Badge variant={payroll.status === 'Paid' ? 'default' : 'secondary'}>
                      {payroll.status}
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EmployeeProfileDrawer;
