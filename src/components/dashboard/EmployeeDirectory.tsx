import { useState } from 'react';
import { Search, Filter, MoreVertical, Download, ChevronDown, User, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { employeeDatabase, Employee, ZONES, attendanceDatabase } from '@/lib/mockdata';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import EmployeeProfileDrawer from './EmployeeProfileDrawer';

const EmployeeDirectory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedZone, setSelectedZone] = useState<string>('All Zones');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  
  // Get ghost flags for each employee
  const getGhostFlags = (empId: string) => {
    return attendanceDatabase.filter(a => a.employeeId === empId && a.isGhostFlagged).length;
  };
  
  const filteredEmployees = employeeDatabase.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesZone = selectedZone === 'All Zones' || emp.zone === selectedZone;
    return matchesSearch && matchesZone;
  });
  
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const handleEmployeeClick = (emp: Employee) => {
    setSelectedEmployee(emp);
    setDrawerOpen(true);
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="dashboard-card"
      >
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl font-bold">MCD Workforce Directory</h3>
            <p className="text-sm text-muted-foreground">
              Managing {employeeDatabase.length.toLocaleString()} registered personnel • 
              <span className="text-status-success ml-1">{filteredEmployees.length} matching</span>
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input 
                className="pl-9 pr-4 py-2 rounded-lg border bg-muted text-sm w-56" 
                placeholder="Search by name, ID, role..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              />
            </div>
            
            {/* Zone Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  {selectedZone}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => { setSelectedZone('All Zones'); setCurrentPage(1); }}>
                  All Zones
                </DropdownMenuItem>
                {ZONES.map(zone => (
                  <DropdownMenuItem key={zone} onClick={() => { setSelectedZone(zone); setCurrentPage(1); }}>
                    {zone}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto -mx-5">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-muted/50 text-xs uppercase font-semibold text-muted-foreground">
                <th className="p-4">Employee</th>
                <th className="p-4">Role & Dept</th>
                <th className="p-4">Zone</th>
                <th className="p-4">Status</th>
                <th className="p-4">Performance</th>
                <th className="p-4">Flags</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <AnimatePresence mode="popLayout">
                {paginatedEmployees.map((emp, index) => {
                  const ghostFlags = getGhostFlags(emp.id);
                  return (
                    <motion.tr
                      key={emp.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.02 }}
                      onClick={() => handleEmployeeClick(emp)}
                      className="border-t hover:bg-muted/30 transition-colors cursor-pointer"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={emp.avatar} 
                            alt={emp.name}
                            className="w-10 h-10 rounded-full bg-muted"
                          />
                          <div>
                            <div className="font-semibold text-foreground">{emp.name}</div>
                            <div className="text-xs text-muted-foreground">{emp.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium">{emp.role}</div>
                        <div className="text-xs text-muted-foreground">{emp.department}</div>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline" className="font-medium">
                          {emp.zone}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge 
                          variant={emp.status === 'Active' ? 'default' : emp.status === 'On Field' ? 'secondary' : 'outline'}
                          className={emp.status === 'Active' ? 'bg-status-success' : ''}
                        >
                          {emp.status}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <span className="text-status-warning">★</span>
                          <span className="font-semibold">{emp.performance}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        {ghostFlags > 0 ? (
                          <Badge variant="destructive" className="gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            {ghostFlags}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">Clean</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleEmployeeClick(emp); }}>
                          <User className="h-4 w-4" />
                        </Button>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between pt-4 border-t mt-4">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredEmployees.length)} of {filteredEmployees.length}
          </p>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
            >
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? 'default' : 'ghost'}
                    size="sm"
                    className="w-8 h-8 p-0"
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </motion.div>
      
      <EmployeeProfileDrawer 
        employee={selectedEmployee}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </>
  );
};

export default EmployeeDirectory;
