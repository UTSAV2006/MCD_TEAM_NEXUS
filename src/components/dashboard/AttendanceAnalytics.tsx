import { motion } from 'framer-motion';
import { TrendingUp, Users, MapPin, Calendar, AlertTriangle } from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell
} from 'recharts';
import { 
  attendanceDatabase, 
  employeeDatabase, 
  getAttendanceByDate, 
  getZoneWisePerformance,
  getGhostAnomalies,
  ZONES
} from '@/lib/mockdata';
import { Badge } from '@/components/ui/badge';

const AttendanceAnalytics = () => {
  const dailyTrends = getAttendanceByDate(attendanceDatabase).slice(-14);
  const zonePerformance = getZoneWisePerformance(employeeDatabase, attendanceDatabase);
  const ghostAnomalies = getGhostAnomalies(attendanceDatabase);
  
  // Summary stats
  const totalPresent = attendanceDatabase.filter(a => a.status === 'Present').length;
  const totalAbsent = attendanceDatabase.filter(a => a.status === 'Absent').length;
  const totalAnomalies = ghostAnomalies.length;
  const attendanceRate = Math.round((totalPresent / (totalPresent + totalAbsent)) * 100);
  
  // Pie chart data
  const statusDistribution = [
    { name: 'Present', value: attendanceDatabase.filter(a => a.status === 'Present').length, color: 'hsl(var(--status-success))' },
    { name: 'Absent', value: attendanceDatabase.filter(a => a.status === 'Absent').length, color: 'hsl(var(--status-danger))' },
    { name: 'Half-day', value: attendanceDatabase.filter(a => a.status === 'Half-day').length, color: 'hsl(var(--status-warning))' },
    { name: 'Anomaly', value: attendanceDatabase.filter(a => a.status === 'Anomaly').length, color: 'hsl(var(--primary))' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="dashboard-card p-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-status-success/10">
              <TrendingUp className="h-5 w-5 text-status-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-status-success">{attendanceRate}%</p>
              <p className="text-xs text-muted-foreground">Attendance Rate</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="dashboard-card p-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{employeeDatabase.length.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Total Workforce</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="dashboard-card p-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-status-warning/10">
              <Calendar className="h-5 w-5 text-status-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{dailyTrends.length}</p>
              <p className="text-xs text-muted-foreground">Days Tracked</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="dashboard-card p-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-status-danger/10">
              <AlertTriangle className="h-5 w-5 text-status-danger" />
            </div>
            <div>
              <p className="text-2xl font-bold text-status-danger">{totalAnomalies}</p>
              <p className="text-xs text-muted-foreground">Ghost Anomalies</p>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Attendance Trends */}
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="dashboard-card p-5"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Daily Attendance Trends (Last 14 Days)
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 10 }}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  labelFormatter={(value) => new Date(value).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="present" 
                  name="Present"
                  stroke="hsl(var(--status-success))" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="absent" 
                  name="Absent"
                  stroke="hsl(var(--status-danger))" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="anomaly" 
                  name="Anomalies"
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
        
        {/* Zone-wise Performance */}
        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="dashboard-card p-5"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Zone-wise Performance
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={zonePerformance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
                <YAxis 
                  dataKey="zone" 
                  type="category" 
                  width={80}
                  tick={{ fontSize: 11 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <Tooltip 
                  contentStyle={{ 
                    background: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number, name: string) => [
                    name === 'attendance' ? `${value}%` : value,
                    name === 'attendance' ? 'Attendance Rate' : 'Perf. Score'
                  ]}
                />
                <Legend />
                <Bar 
                  dataKey="attendance" 
                  name="Attendance %"
                  fill="hsl(var(--status-success))" 
                  radius={[0, 4, 4, 0]}
                />
                <Bar 
                  dataKey="performance" 
                  name="Performance"
                  fill="hsl(var(--primary))" 
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
      
      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Distribution Pie */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="dashboard-card p-5"
        >
          <h3 className="text-lg font-semibold mb-4">Attendance Distribution</h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    background: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {statusDistribution.map((item, i) => (
              <div key={i} className="flex items-center gap-1 text-xs">
                <span className="w-3 h-3 rounded-full" style={{ background: item.color }} />
                {item.name}
              </div>
            ))}
          </div>
        </motion.div>
        
        {/* Zone Stats Table */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="dashboard-card p-5 lg:col-span-2"
        >
          <h3 className="text-lg font-semibold mb-4">Zone Statistics</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase text-muted-foreground border-b">
                  <th className="pb-3">Zone</th>
                  <th className="pb-3">Employees</th>
                  <th className="pb-3">Attendance</th>
                  <th className="pb-3">Performance</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {zonePerformance.map((zone, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="py-3 font-medium">{zone.zone}</td>
                    <td className="py-3">{zone.employees}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-status-success rounded-full"
                            style={{ width: `${zone.attendance}%` }}
                          />
                        </div>
                        <span className="text-xs">{zone.attendance}%</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-1">
                        <span className="text-status-warning">★</span>
                        {(zone.performance / 20).toFixed(1)}
                      </div>
                    </td>
                    <td className="py-3">
                      <Badge variant={zone.attendance >= 80 ? 'default' : zone.attendance >= 60 ? 'secondary' : 'destructive'}>
                        {zone.attendance >= 80 ? 'Good' : zone.attendance >= 60 ? 'Fair' : 'Poor'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AttendanceAnalytics;
