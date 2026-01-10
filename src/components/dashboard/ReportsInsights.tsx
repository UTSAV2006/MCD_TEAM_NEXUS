import React, { useState } from 'react';
import { 
  Users, TrendingUp, AlertTriangle, Calendar, 
  Download, Filter, Search, MoreHorizontal, MapPin 
} from 'lucide-react';

const ReportsAnalytics = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      
      {/* --- Top Stats Row (Matches Screenshot 1) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          label="Attendance Rate" 
          value="88%" 
          icon={TrendingUp} 
          trend="up" 
          color="green" 
        />
        <StatCard 
          label="Total Workforce" 
          value="1,000" 
          icon={Users} 
          trend="neutral" 
          color="gray" 
        />
        <StatCard 
          label="Days Tracked" 
          value="14" 
          icon={Calendar} 
          trend="neutral" 
          color="orange" 
        />
        <StatCard 
          label="Ghost Anomalies" 
          value="1099" 
          icon={AlertTriangle} 
          trend="down" 
          color="red" 
        />
      </div>

      {/* --- Row 2: Charts (Matches Screenshot 1) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Line Chart: Daily Trends */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-6">Daily Attendance Trends (Last 14 Days)</h3>
          <div className="h-64 flex items-end justify-between gap-2 px-2 relative">
            {/* Background Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between text-xs text-gray-300 pointer-events-none">
              <div className="border-b border-dashed border-gray-100 w-full h-0"></div>
              <div className="border-b border-dashed border-gray-100 w-full h-0"></div>
              <div className="border-b border-dashed border-gray-100 w-full h-0"></div>
              <div className="border-b border-dashed border-gray-100 w-full h-0"></div>
              <div className="border-b border-gray-200 w-full h-0"></div>
            </div>
            
            {/* Simulated Line Chart using SVG */}
            <svg className="absolute inset-0 w-full h-full p-4 overflow-visible" preserveAspectRatio="none">
              {/* Green Line (Present) */}
              <polyline 
                points="0,20 50,25 100,15 150,22 200,18 250,20 300,28 350,24 400,20 450,15 500,25 550,30" 
                fill="none" 
                stroke="#10b981" 
                strokeWidth="2" 
              />
               {/* Red Line (Absent) */}
              <polyline 
                points="0,200 50,190 100,195 150,205 200,200 250,202 300,198 350,195 400,190 450,195 500,200 550,195" 
                fill="none" 
                stroke="#ef4444" 
                strokeWidth="2" 
              />
              {/* Dotted Black Line (Anomalies) */}
              <polyline 
                points="0,230 50,235 100,232 150,230 200,228 250,235 300,225 350,220 400,228 450,230 500,232 550,230" 
                fill="none" 
                stroke="#374151" 
                strokeWidth="2" 
                strokeDasharray="5,5"
              />
            </svg>

            {/* X-Axis Labels */}
            <div className="absolute -bottom-6 left-0 w-full flex justify-between text-[10px] text-gray-400">
              <span>26 Dec</span><span>29 Dec</span><span>31 Dec</span><span>2 Jan</span><span>5 Jan</span><span>8 Jan</span><span>10 Jan</span>
            </div>
          </div>
           {/* Legend */}
           <div className="flex justify-center gap-6 mt-8 text-xs font-medium text-gray-600">
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Present</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div> Absent</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-gray-700"></div> Anomalies</span>
            </div>
        </div>

        {/* Horizontal Bar Chart: Zone Performance */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <MapPin size={18} className="text-gray-500"/> Zone-wise Performance
          </h3>
          <div className="space-y-4">
            {['Rohini', 'Dwarka', 'Shahdara', 'South Delhi', 'Karol Bagh', 'Civil Lines'].map((zone, i) => (
              <div key={zone} className="flex items-center gap-4">
                <span className="w-20 text-xs text-gray-500 font-medium text-right">{zone}</span>
                <div className="flex-1 flex flex-col gap-1">
                  {/* Green Bar (Attendance) */}
                  <div className="h-2 bg-emerald-100 rounded-full overflow-hidden w-full">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${85 - (i * 3)}%` }}></div>
                  </div>
                  {/* Blue Bar (Performance) */}
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden w-full">
                    <div className="h-full bg-slate-700 rounded-full" style={{ width: `${78 - (i * 2)}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-6 mt-6 text-xs font-medium text-gray-600">
             <span className="flex items-center gap-1"><div className="w-3 h-3 bg-emerald-500 rounded-sm"></div> Attendance %</span>
             <span className="flex items-center gap-1"><div className="w-3 h-3 bg-slate-700 rounded-sm"></div> Performance</span>
          </div>
        </div>
      </div>

      {/* --- Row 3: Donut & Stats (Matches Screenshot 2) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Donut Chart */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center">
          <h3 className="font-semibold text-gray-800 w-full mb-2">Attendance Distribution</h3>
          <div className="relative w-48 h-48 my-4">
             {/* Simple CSS Donut representation using conic-gradient */}
             <div className="w-full h-full rounded-full" style={{ background: 'conic-gradient(#10b981 0% 65%, #ef4444 65% 80%, #f59e0b 80% 90%, #1e293b 90% 100%)' }}></div>
             <div className="absolute inset-4 bg-white rounded-full"></div>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-xs mt-2">
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Present</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div> Absent</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500"></div> Half-day</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-slate-800"></div> Anomaly</span>
          </div>
        </div>

        {/* Zone Statistics Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">Zone Statistics</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 font-medium">
                <tr>
                  <th className="px-6 py-3">ZONE</th>
                  <th className="px-6 py-3">EMPLOYEES</th>
                  <th className="px-6 py-3">ATTENDANCE</th>
                  <th className="px-6 py-3">PERFORMANCE</th>
                  <th className="px-6 py-3">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {zoneData.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50/50">
                    <td className="px-6 py-3 font-medium text-gray-700">{row.zone}</td>
                    <td className="px-6 py-3 text-gray-500">{row.emp}</td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-gray-200 rounded-full">
                          <div className={`h-full rounded-full ${row.att > 80 ? 'bg-green-500' : 'bg-yellow-500'}`} style={{ width: `${row.att}%` }}></div>
                        </div>
                        <span className="text-xs text-gray-600">{row.att}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-amber-500 font-medium text-xs">★ {row.perf}</td>
                    <td className="px-6 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        row.status === 'Good' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- Row 4: Workforce Directory (Matches Screenshot 3) --- */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="font-semibold text-gray-800">MCD Workforce Directory</h3>
            <p className="text-xs text-green-600 mt-1">Managing 1,000 registered personnel • <span className="text-gray-400">1000 matching</span></p>
          </div>
          
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Search by name, ID..." 
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
              <Filter size={16} /> All Zones
            </button>
            <button className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
              <Download size={16} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-3">Employee</th>
                <th className="px-6 py-3">Role & Dept</th>
                <th className="px-6 py-3">Zone</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Performance</th>
                <th className="px-6 py-3">Flags</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {directoryData.map((emp, i) => (
                <tr key={i} className="hover:bg-gray-50 group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                        {emp.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{emp.name}</div>
                        <div className="text-xs text-gray-500">{emp.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-700">{emp.role}</div>
                    <div className="text-xs text-gray-400">{emp.dept}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">{emp.zone}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      emp.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-50 text-blue-600'
                    }`}>
                      {emp.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-amber-500 text-xs">
                    ★ {emp.perf}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded text-xs font-bold flex items-center w-fit gap-1">
                      <AlertTriangle size={10} /> {emp.flags}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

// --- Sub-Components & Data ---

const StatCard = ({ label, value, icon: Icon, trend, color }: any) => {
  const colors = {
    green: "text-emerald-600 bg-emerald-50",
    gray: "text-gray-600 bg-gray-100",
    orange: "text-amber-600 bg-amber-50",
    red: "text-red-600 bg-red-50",
  };

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
      <div>
        <div className={`flex items-center gap-2 font-bold text-2xl mb-1 ${
          color === 'green' ? 'text-emerald-600' : color === 'red' ? 'text-red-600' : 'text-gray-800'
        }`}>
          {trend === 'up' && <TrendingUp size={20} />}
          {trend === 'down' && <AlertTriangle size={20} />}
          {value}
        </div>
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
      </div>
      <div className={`p-3 rounded-lg ${colors[color as keyof typeof colors]}`}>
        <Icon size={24} />
      </div>
    </div>
  );
};

const zoneData = [
  { zone: "Rohini", emp: 132, att: 82, perf: 3.7, status: "Good" },
  { zone: "Dwarka", emp: 129, att: 81, perf: 3.8, status: "Good" },
  { zone: "Shahdara", emp: 118, att: 81, perf: 3.7, status: "Good" },
  { zone: "South Delhi", emp: 120, att: 81, perf: 3.8, status: "Good" },
  { zone: "Karol Bagh", emp: 110, att: 82, perf: 3.7, status: "Good" },
  { zone: "Civil Lines", emp: 116, att: 81, perf: 3.7, status: "Good" },
  { zone: "Najafgarh", emp: 135, att: 80, perf: 3.9, status: "Good" },
  { zone: "City-SP", emp: 140, att: 79, perf: 3.8, status: "Fair" },
];

const directoryData = [
  { name: "Myron Russel", id: "MCD-00001", role: "Sanitation Worker", dept: "Engineering", zone: "Rohini", status: "Active", perf: 3.2, flags: 8 },
  { name: "Erin Legros", id: "MCD-00002", role: "Supervisor", dept: "Waste Mgmt", zone: "Najafgarh", status: "On Field", perf: 4.8, flags: 8 },
  { name: "Roger Beer", id: "MCD-00003", role: "Sanitation Worker", dept: "Waste Mgmt", zone: "Karol Bagh", status: "Active", perf: 3.6, flags: 10 },
  { name: "Howard Gusikowski", id: "MCD-00004", role: "Field Inspector", dept: "Sanitation", zone: "Shahdara", status: "Active", perf: 4.4, flags: 8 },
  { name: "Mrs. Maureen Schmidt", id: "MCD-00005", role: "HR Manager", dept: "Sanitation", zone: "Shahdara", status: "On Field", perf: 2.5, flags: 10 },
  { name: "Judy Walker", id: "MCD-00006", role: "Junior Engineer", dept: "Waste Mgmt", zone: "City-SP", status: "Active", perf: 5.0, flags: 6 },
  { name: "Salvador Simonis", id: "MCD-00007", role: "Field Inspector", dept: "Public Health", zone: "Dwarka", status: "Active", perf: 3.6, flags: 9 },
];

export default ReportsAnalytics;