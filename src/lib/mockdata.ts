// Mock Data for MCD Workforce Management System
import { faker } from '@faker-js/faker/locale/en_IN';

// Employee Interface
export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  zone: string;
  phone: string;
  email: string;
  status: 'Active' | 'Inactive' | 'On Leave';
  avatar: string;
  address: string;
  joiningDate: string;
  performance: string;
  deviceId: string;
}

// Attendance Record Interface
export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  status: 'Present' | 'Absent' | 'Half-day' | 'Anomaly' | 'Leave';
  checkIn: string | null;
  checkOut: string | null;
  location: { lat: number; lng: number } | null;
  deviceId: string | null;
  isGhostFlagged: boolean;
  flagReason?: string;
}

// Payroll Interface
export interface PayrollRecord {
  id: string;
  employeeId: string;
  month: string;
  basicPay: number;
  hra: number;
  conveyance: number;
  medical: number;
  specialAllowance: number;
  pfDeduction: number;
  professionalTax: number;
  incomeTax: number;
  otherDeductions: number;
  grossSalary: number;
  totalDeductions: number;
  netSalary: number;
  daysWorked: number;
  status: 'Paid' | 'Pending' | 'Processing';
}

// RAF Incident Interface
export interface RAFIncident {
  id: string;
  title: string;
  location: string;
  zone: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Resolved' | 'In Progress' | 'Dispatched' | 'Pending';
  teamAssigned: string;
  reportedAt: string;
  resolvedAt: string | null;
  resolutionTime: number | null; // in minutes
  description: string;
}

// Constants
const ZONES = ['Rohini', 'Dwarka', 'Karol Bagh', 'Lajpat Nagar', 'Shahdara', 'Saket', 'Janakpuri', 'Pitampura'];
const DEPARTMENTS = ['Sanitation', 'Water Supply', 'Roads', 'Horticulture', 'Engineering', 'Administration'];
const ROLES = ['Worker', 'Supervisor', 'Junior Engineer', 'Inspector', 'Senior Engineer'];
const RAF_TEAMS = ['Alpha Team', 'Bravo Team', 'Charlie Team', 'Delta Team', 'Echo Team'];

// Pay scales by role
const PAY_SCALES: Record<string, { basic: number; hra: number }> = {
  'Worker': { basic: 18000, hra: 4500 },
  'Supervisor': { basic: 28000, hra: 7000 },
  'Junior Engineer': { basic: 35000, hra: 8750 },
  'Inspector': { basic: 42000, hra: 10500 },
  'Senior Engineer': { basic: 55000, hra: 13750 },
};

// Generate Employees
const generateEmployees = (count: number): Employee[] => {
  const employees: Employee[] = [];
  const deviceIds: string[] = [];
  
  // Generate some shared device IDs for ghost detection
  for (let i = 0; i < 20; i++) {
    deviceIds.push(faker.string.uuid());
  }
  
  for (let i = 0; i < count; i++) {
    const role = ROLES[Math.floor(Math.random() * ROLES.length)];
    // 5% chance of sharing device with another employee (ghost detection)
    const useSharedDevice = Math.random() < 0.05;
    
    employees.push({
      id: `MCD${String(2000 + i).padStart(4, '0')}`,
      name: faker.person.fullName(),
      role,
      department: DEPARTMENTS[Math.floor(Math.random() * DEPARTMENTS.length)],
      zone: ZONES[Math.floor(Math.random() * ZONES.length)],
      phone: faker.phone.number({ style: 'national' }),
      email: faker.internet.email({ provider: 'mcd.gov.in' }),
      status: Math.random() > 0.1 ? 'Active' : (Math.random() > 0.5 ? 'Inactive' : 'On Leave'),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${faker.string.alphanumeric(8)}`,
      address: `${faker.location.streetAddress()}, ${ZONES[Math.floor(Math.random() * ZONES.length)]}, Delhi`,
      joiningDate: faker.date.past({ years: 10 }).toISOString(),
      performance: `${faker.number.int({ min: 60, max: 100 })}%`,
      deviceId: useSharedDevice 
        ? deviceIds[Math.floor(Math.random() * deviceIds.length)]
        : faker.string.uuid(),
    });
  }
  
  return employees;
};

// Generate 30-day Attendance Records
const generateAttendanceRecords = (employees: Employee[]): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const today = new Date();
  
  employees.forEach((emp) => {
    for (let day = 0; day < 30; day++) {
      const date = new Date(today);
      date.setDate(date.getDate() - day);
      
      // Skip weekends
      if (date.getDay() === 0) continue;
      
      const rand = Math.random();
      let status: AttendanceRecord['status'];
      let isGhostFlagged = false;
      let flagReason: string | undefined;
      
      if (rand < 0.75) status = 'Present';
      else if (rand < 0.85) status = 'Absent';
      else if (rand < 0.92) status = 'Half-day';
      else if (rand < 0.96) status = 'Leave';
      else {
        status = 'Anomaly';
        isGhostFlagged = true;
        flagReason = Math.random() > 0.5 ? 'Shared Device Detected' : 'Impossible Travel Distance';
      }
      
      // Ghost flag for shared devices
      if (status === 'Present' && employees.filter(e => e.deviceId === emp.deviceId).length > 1 && Math.random() < 0.3) {
        isGhostFlagged = true;
        flagReason = 'Shared Device Detected';
      }
      
      const checkIn = status === 'Present' || status === 'Half-day' 
        ? `${faker.number.int({ min: 8, max: 10 })}:${String(faker.number.int({ min: 0, max: 59 })).padStart(2, '0')}`
        : null;
      
      const checkOut = status === 'Present'
        ? `${faker.number.int({ min: 17, max: 19 })}:${String(faker.number.int({ min: 0, max: 59 })).padStart(2, '0')}`
        : status === 'Half-day'
        ? `${faker.number.int({ min: 13, max: 14 })}:${String(faker.number.int({ min: 0, max: 59 })).padStart(2, '0')}`
        : null;
      
      records.push({
        id: faker.string.uuid(),
        employeeId: emp.id,
        date: date.toISOString().split('T')[0],
        status,
        checkIn,
        checkOut,
        location: status === 'Present' || status === 'Half-day' ? {
          lat: 28.6139 + (Math.random() - 0.5) * 0.1,
          lng: 77.2090 + (Math.random() - 0.5) * 0.1,
        } : null,
        deviceId: status === 'Present' || status === 'Half-day' ? emp.deviceId : null,
        isGhostFlagged,
        flagReason,
      });
    }
  });
  
  return records;
};

// Generate Payroll Records
const generatePayrollRecords = (employees: Employee[]): PayrollRecord[] => {
  const records: PayrollRecord[] = [];
  const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
  
  employees.forEach((emp) => {
    const scale = PAY_SCALES[emp.role] || PAY_SCALES['Worker'];
    const daysWorked = faker.number.int({ min: 20, max: 26 });
    
    const basicPay = Math.round((scale.basic / 26) * daysWorked);
    const hra = Math.round((scale.hra / 26) * daysWorked);
    const conveyance = 1600;
    const medical = 1250;
    const specialAllowance = Math.round(basicPay * 0.1);
    
    const grossSalary = basicPay + hra + conveyance + medical + specialAllowance;
    
    const pfDeduction = Math.round(basicPay * 0.12);
    const professionalTax = 200;
    const incomeTax = grossSalary > 50000 ? Math.round(grossSalary * 0.1) : 0;
    const otherDeductions = faker.number.int({ min: 0, max: 500 });
    
    const totalDeductions = pfDeduction + professionalTax + incomeTax + otherDeductions;
    const netSalary = grossSalary - totalDeductions;
    
    records.push({
      id: faker.string.uuid(),
      employeeId: emp.id,
      month: currentMonth,
      basicPay,
      hra,
      conveyance,
      medical,
      specialAllowance,
      pfDeduction,
      professionalTax,
      incomeTax,
      otherDeductions,
      grossSalary,
      totalDeductions,
      netSalary,
      daysWorked,
      status: Math.random() > 0.2 ? 'Paid' : (Math.random() > 0.5 ? 'Pending' : 'Processing'),
    });
  });
  
  return records;
};

// Generate RAF Incidents
const generateRAFIncidents = (count: number): RAFIncident[] => {
  const incidents: RAFIncident[] = [];
  const incidentTypes = [
    'Water Leakage', 'Road Damage', 'Garbage Overflow', 'Street Light Outage',
    'Sewage Blockage', 'Tree Fall', 'Fire Hazard', 'Illegal Construction',
    'Stray Animal Issue', 'Public Nuisance', 'Traffic Signal Malfunction'
  ];
  
  for (let i = 0; i < count; i++) {
    const reportedAt = faker.date.recent({ days: 30 });
    const status: RAFIncident['status'] = Math.random() > 0.3 
      ? 'Resolved' 
      : Math.random() > 0.5 
      ? 'In Progress' 
      : Math.random() > 0.5 
      ? 'Dispatched' 
      : 'Pending';
    
    const resolutionTime = status === 'Resolved' 
      ? faker.number.int({ min: 15, max: 180 }) 
      : null;
    
    incidents.push({
      id: `RAF${String(1000 + i).padStart(4, '0')}`,
      title: incidentTypes[Math.floor(Math.random() * incidentTypes.length)],
      location: faker.location.streetAddress(),
      zone: ZONES[Math.floor(Math.random() * ZONES.length)],
      priority: (['Critical', 'High', 'Medium', 'Low'] as const)[Math.floor(Math.random() * 4)],
      status,
      teamAssigned: RAF_TEAMS[Math.floor(Math.random() * RAF_TEAMS.length)],
      reportedAt: reportedAt.toISOString(),
      resolvedAt: status === 'Resolved' ? new Date(reportedAt.getTime() + (resolutionTime || 60) * 60000).toISOString() : null,
      resolutionTime,
      description: faker.lorem.sentence(),
    });
  }
  
  return incidents.sort((a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime());
};

// Generate all mock data
export const employeesDatabase: Employee[] = generateEmployees(1000);
export const attendanceDatabase: AttendanceRecord[] = generateAttendanceRecords(employeesDatabase);
export const payrollDatabase: PayrollRecord[] = generatePayrollRecords(employeesDatabase);
export const rafIncidentsDatabase: RAFIncident[] = generateRAFIncidents(60);

// Utility functions
export const getEmployeeById = (id: string): Employee | undefined => {
  return employeesDatabase.find(emp => emp.id === id);
};

export const getEmployeeAttendance = (employeeId: string): AttendanceRecord[] => {
  return attendanceDatabase.filter(record => record.employeeId === employeeId);
};

export const getEmployeePayroll = (employeeId: string): PayrollRecord | undefined => {
  return payrollDatabase.find(record => record.employeeId === employeeId);
};

export const getEmployeeAttendanceSparkline = (employeeId: string) => {
  const records = attendanceDatabase
    .filter(r => r.employeeId === employeeId)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-14);
  
  return records.map(r => ({
    date: r.date,
    value: r.status === 'Present' ? 100 : r.status === 'Half-day' ? 50 : 0,
  }));
};

export const getGhostFlaggedRecords = (): AttendanceRecord[] => {
  return attendanceDatabase.filter(record => record.isGhostFlagged);
};

export const getZoneWiseStats = () => {
  const stats: Record<string, { total: number; present: number; absent: number }> = {};
  
  ZONES.forEach(zone => {
    const zoneEmployees = employeesDatabase.filter(e => e.zone === zone);
    const todayRecords = attendanceDatabase.filter(r => 
      r.date === new Date().toISOString().split('T')[0] && 
      zoneEmployees.some(e => e.id === r.employeeId)
    );
    
    stats[zone] = {
      total: zoneEmployees.length,
      present: todayRecords.filter(r => r.status === 'Present').length,
      absent: todayRecords.filter(r => r.status === 'Absent').length,
    };
  });
  
  return stats;
};

export { ZONES, DEPARTMENTS, ROLES, RAF_TEAMS };
