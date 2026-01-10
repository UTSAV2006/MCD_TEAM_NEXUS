import { useState } from 'react';
import { Search, Filter, MoreVertical, Download } from 'lucide-react';
import { employeeDatabase, Employee } from '@/lib/mockdata';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const EmployeeDirectory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredEmployees = employeeDatabase.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.id.includes(searchTerm)
  ).slice(0, 10); // Performance ke liye sirf pehle 10 dikhayenge

  return (
    <div className="dashboard-card animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold">MCD Workforce Directory</h3>
          <p className="text-sm text-muted-foreground">Managing 1,000+ registered personnel</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              className="pl-9 p-2 rounded-lg border bg-muted text-sm w-64" 
              placeholder="Search by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon"><Download className="h-4 w-4" /></Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/50 text-xs uppercase font-semibold">
              <th className="p-4">Employee</th>
              <th className="p-4">Role & Dept</th>
              <th className="p-4">Zone</th>
              <th className="p-4">Status</th>
              <th className="p-4">Perf.</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {filteredEmployees.map((emp) => (
              <tr key={emp.id} className="border-t hover:bg-muted/30 transition-colors">
                <td className="p-4">
                  <div className="font-bold text-primary">{emp.name}</div>
                  <div className="text-[10px] text-muted-foreground">{emp.id}</div>
                </td>
                <td className="p-4">
                  <div>{emp.role}</div>
                  <div className="text-xs text-muted-foreground">{emp.department}</div>
                </td>
                <td className="p-4 font-medium">{emp.zone}</td>
                <td className="p-4">
                  <Badge variant={emp.status === 'Active' ? 'default' : 'outline'} className="text-[10px]">
                    {emp.status}
                  </Badge>
                </td>
                <td className="p-4">
                   <div className="flex items-center gap-1 text-status-warning font-bold">
                     ★ {emp.performance}
                   </div>
                </td>
                <td className="p-4 text-right">
                  <button className="p-1 hover:bg-muted rounded"><MoreVertical className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4 text-center border-t">
        <p className="text-xs text-muted-foreground italic">Showing top results. Use search to find specific records.</p>
      </div>
    </div>
  );
};

export default EmployeeDirectory;