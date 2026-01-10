import { fakerEN_IN as faker } from '@faker-js/faker';

// 1. Employee Interface define karna zaroori hai types ke liye
// ========== ZONES ==========
export const ZONES = ['Rohini', 'Dwarka', 'Shahdara', 'South Delhi', 'Karol Bagh', 'Civil Lines', 'Najafgarh', 'City-SP'] as const;
export type Zone = typeof ZONES[number];

// ========== ROLES & PAY STRUCTURE ==========
export const ROLES = ['Junior Engineer', 'Field Inspector', 'Sanitation Worker', 'Supervisor', 'HR Manager'] as const;
export type Role = typeof ROLES[number];

export const PAY_STRUCTURE: Record<Role, { basic: number; hra: number; da: number; special: number }> = {
  'Junior Engineer': { basic: 45000, hra: 13500, da: 9000, special: 5000 },
  'Field Inspector': { basic: 35000, hra: 10500, da: 7000, special: 3500 },
  'Sanitation Worker': { basic: 22000, hra: 6600, da: 4400, special: 2000 },
  'Supervisor': { basic: 38000, hra: 11400, da: 7600, special: 4000 },
  'HR Manager': { basic: 55000, hra: 16500, da: 11000, special: 7000 },
};

// ========== EMPLOYEE INTERFACE ==========
export interface Employee {
  id: string;
  name: string;
  role: Role;
  department: string;
  zone: string;
  status: 'Active' | 'On Field' | 'On Leave';
  performance: number;
}

// 2. Data generate karne ka function
export const generateEmployees = (count: number): Employee[] => {
  return Array.from({ length: count }, () => ({
    id: `MCD-${faker.string.numeric(5)}`,
    name: faker.person.fullName(), // Indian Names (e.g., Rajesh Kumar)
    role: faker.helpers.arrayElement([
      'Field Inspector', 
      'Sanitation Worker', 
      'Supervisor', 
      'Junior Engineer (JE)'
    ]),
    department: faker.helpers.arrayElement([
      'Waste Management', 
      'Engineering', 
      'Public Health', 
      'Administration'
    ]),
    zone: faker.helpers.arrayElement([
      'Rohini', 
      'Dwarka', 
      'Shahdara', 
      'Karol Bagh', 
      'Najafgarh', 
      'South Delhi'
    ]),
    status: faker.helpers.arrayElement(['Active', 'On Field', 'On Leave']),

    performance: faker.number.float({ min: 3, max: 5, fractionDigits: 1 }),
  }));
};


export const employeeDatabase = generateEmployees(1000);
  zone: Zone;
  email: string;
  phone: string;
  status: 'Active' | 'On Field' | 'On Leave';
  joiningDate: string;
  performance: number;
  avatar: string;
  deviceId: string;
  address: string;
  emergencyContact: string;
}

// ========== ATTENDANCE RECORD ==========
export type AttendanceStatus = 'Present' | 'Absent' | 'Half-day' | 'Anomaly' | 'Leave';

export interface AttendanceRecord {
  employeeId: string;
  date: string;
  status: AttendanceStatus;
  checkIn: string | null;
  checkOut: string | null;
  latitude: number | null;
  longitude: number | null;
  deviceId: string;
  isGhostFlagged: boolean;
  ghostReason: string | null;
}

// ========== PAYROLL ==========
export interface PayrollRecord {
  employeeId: string;
  employeeName: string;
  role: Role;
  zone: Zone;
  month: string;
  year: number;
  basic: number;
  hra: number;
  da: number;
  specialAllowance: number;
  grossSalary: number;
  pf: number;
  esi: number;
  professionalTax: number;
  tds: number;
  totalDeductions: number;
  netSalary: number;
  daysWorked: number;
  daysAbsent: number;
  leavesTaken: number;
  status: 'Paid' | 'Pending' | 'Processing';
  paymentDate: string | null;
}

// ========== RAF INCIDENT ==========
export type IncidentPriority = 'Critical' | 'High' | 'Medium' | 'Low';
export type IncidentStatus = 'Open' | 'Dispatched' | 'In Progress' | 'Resolved' | 'Closed';

export interface RAFIncident {
  id: string;
  title: string;
  description: string;
  location: string;
  zone: Zone;
  coordinates: { lat: number; lng: number };
  priority: IncidentPriority;
  status: IncidentStatus;
  reportedAt: string;
  dispatchedAt: string | null;
  resolvedAt: string | null;
  teamAssigned: string[];
  resolutionTime: number | null; // minutes
  category: string;
  reportedBy: string;
  eta: number | null; // minutes
}

// ========== RAF TEAM ==========
export interface RAFTeam {
  id: string;
  name: string;
  members: string[];
  zone: Zone;
  status: 'Ready' | 'Deployed' | 'Returning' | 'Off Duty';
  currentLocation: { lat: number; lng: number };
  vehicleNumber: string;
  specialization: string;
}

// ========== GENERATE EMPLOYEES ==========
export const generateEmployees = (count: number): Employee[] => {
  const departments = ['Waste Management', 'Public Health', 'Engineering', 'Administration', 'Sanitation'];
  
  return Array.from({ length: count }, (_, i) => {
    const role = faker.helpers.arrayElement([...ROLES]);
    return {
      id: `MCD-${String(i + 1).padStart(5, '0')}`,
      name: faker.person.fullName(),
      role,
      department: faker.helpers.arrayElement(departments),
      zone: faker.helpers.arrayElement([...ZONES]),
      email: faker.internet.email().toLowerCase(),
      phone: `+91 ${faker.string.numeric(10)}`,
      status: faker.helpers.arrayElement(['Active', 'On Field', 'On Leave'] as const),
      joiningDate: faker.date.past({ years: 5 }).toISOString().split('T')[0],
      performance: faker.number.float({ min: 2.5, max: 5, fractionDigits: 1 }),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
      deviceId: `DEV-${faker.string.alphanumeric(8).toUpperCase()}`,
      address: `${faker.location.streetAddress()}, ${faker.helpers.arrayElement([...ZONES])}, Delhi`,
      emergencyContact: `+91 ${faker.string.numeric(10)}`,
    };
  });
};

// ========== GENERATE 30-DAY ATTENDANCE ==========
export const generateAttendanceHistory = (employees: Employee[]): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const today = new Date();
  
  // Create device sharing map for ghost detection
  const sharedDevices = new Map<string, string[]>();
  
  // 5% of employees share devices (ghost scenario)
  const ghostEmployees = employees.slice(0, Math.floor(employees.length * 0.05));
  for (let i = 0; i < ghostEmployees.length; i += 2) {
    if (ghostEmployees[i + 1]) {
      const sharedDevice = `DEV-SHARED-${i}`;
      sharedDevices.set(ghostEmployees[i].id, [sharedDevice, ghostEmployees[i + 1].id]);
      sharedDevices.set(ghostEmployees[i + 1].id, [sharedDevice, ghostEmployees[i].id]);
    }
  }
  
  employees.forEach((emp) => {
    for (let day = 0; day < 30; day++) {
      const date = new Date(today);
      date.setDate(date.getDate() - day);
      
      // Skip future dates
      if (date > today) continue;
      
      // Skip Sundays
      if (date.getDay() === 0) continue;
      
      const isSharedDevice = sharedDevices.has(emp.id);
      const rand = Math.random();
      
      let status: AttendanceStatus;
      let isGhostFlagged = false;
      let ghostReason: string | null = null;
      
      if (rand < 0.75) {
        status = 'Present';
        if (isSharedDevice && Math.random() < 0.3) {
          isGhostFlagged = true;
          ghostReason = `Shared device with ${sharedDevices.get(emp.id)?.[1]}`;
          status = 'Anomaly';
        }
      } else if (rand < 0.85) {
        status = 'Absent';
      } else if (rand < 0.92) {
        status = 'Half-day';
      } else if (rand < 0.97) {
        status = 'Leave';
      } else {
        status = 'Anomaly';
        isGhostFlagged = true;
        ghostReason = faker.helpers.arrayElement([
          'Impossible travel: 50km in 5 minutes',
          'Location mismatch: GPS spoofing suspected',
          'Multiple check-ins from different zones',
        ]);
      }
      
      const checkInHour = faker.number.int({ min: 8, max: 10 });
      const checkInMin = faker.number.int({ min: 0, max: 59 });
      const checkOutHour = faker.number.int({ min: 17, max: 19 });
      const checkOutMin = faker.number.int({ min: 0, max: 59 });
      
      records.push({
        employeeId: emp.id,
        date: date.toISOString().split('T')[0],
        status,
        checkIn: status !== 'Absent' && status !== 'Leave' 
          ? `${String(checkInHour).padStart(2, '0')}:${String(checkInMin).padStart(2, '0')}`
          : null,
        checkOut: status === 'Present' || status === 'Anomaly'
          ? `${String(checkOutHour).padStart(2, '0')}:${String(checkOutMin).padStart(2, '0')}`
          : status === 'Half-day'
          ? `${String(checkInHour + 4).padStart(2, '0')}:${String(checkInMin).padStart(2, '0')}`
          : null,
        latitude: status !== 'Absent' && status !== 'Leave' ? 28.6 + Math.random() * 0.2 : null,
        longitude: status !== 'Absent' && status !== 'Leave' ? 77.2 + Math.random() * 0.2 : null,
        deviceId: isSharedDevice && isGhostFlagged 
          ? sharedDevices.get(emp.id)![0] 
          : emp.deviceId,
        isGhostFlagged,
        ghostReason,
      });
    }
  });
  
  return records;
};

// ========== GENERATE PAYROLL ==========
export const generatePayroll = (employees: Employee[], attendanceRecords: AttendanceRecord[]): PayrollRecord[] => {
  const currentMonth = new Date().toLocaleString('en-IN', { month: 'long' });
  const currentYear = new Date().getFullYear();
  
  return employees.map((emp) => {
    const empAttendance = attendanceRecords.filter(a => a.employeeId === emp.id);
    const daysPresent = empAttendance.filter(a => a.status === 'Present' || a.status === 'Half-day').length;
    const daysAbsent = empAttendance.filter(a => a.status === 'Absent').length;
    const leavesTaken = empAttendance.filter(a => a.status === 'Leave').length;
    const halfDays = empAttendance.filter(a => a.status === 'Half-day').length;
    
    const pay = PAY_STRUCTURE[emp.role];
    const workingDays = 26; // Standard working days
    const actualDaysWorked = daysPresent - (halfDays * 0.5);
    const attendanceRatio = Math.min(actualDaysWorked / workingDays, 1);
    
    const basic = Math.round(pay.basic * attendanceRatio);
    const hra = Math.round(pay.hra * attendanceRatio);
    const da = Math.round(pay.da * attendanceRatio);
    const specialAllowance = Math.round(pay.special * attendanceRatio);
    const grossSalary = basic + hra + da + specialAllowance;
    
    // Deductions
    const pf = Math.round(basic * 0.12);
    const esi = grossSalary <= 21000 ? Math.round(grossSalary * 0.0075) : 0;
    const professionalTax = grossSalary > 15000 ? 200 : 0;
    const tds = grossSalary > 50000 ? Math.round((grossSalary - 50000) * 0.1) : 0;
    const totalDeductions = pf + esi + professionalTax + tds;
    
    const netSalary = grossSalary - totalDeductions;
    
    return {
      employeeId: emp.id,
      employeeName: emp.name,
      role: emp.role,
      zone: emp.zone,
      month: currentMonth,
      year: currentYear,
      basic,
      hra,
      da,
      specialAllowance,
      grossSalary,
      pf,
      esi,
      professionalTax,
      tds,
      totalDeductions,
      netSalary,
      daysWorked: Math.round(actualDaysWorked),
      daysAbsent,
      leavesTaken,
      status: faker.helpers.arrayElement(['Paid', 'Pending', 'Processing'] as const),
      paymentDate: faker.helpers.arrayElement(['Paid', 'Processing']).includes('Paid') 
        ? new Date().toISOString().split('T')[0] 
        : null,
    };
  });
};

// ========== GENERATE RAF INCIDENTS ==========
export const generateRAFIncidents = (count: number): RAFIncident[] => {
  const categories = [
    'Garbage Overflow', 'Drain Blockage', 'Street Light Failure', 
    'Road Damage', 'Illegal Dumping', 'Tree Fall', 'Water Logging',
    'Animal Carcass', 'Public Nuisance', 'Encroachment'
  ];
  
  const locations = [
    'Sector 12 Market', 'GTB Nagar Metro Station', 'Karol Bagh Main Road',
    'Dwarka Sector 21', 'Rohini Sector 9', 'Lajpat Nagar Central',
    'Connaught Place', 'Shahdara Flyover', 'Janakpuri West',
    'Pitampura TV Tower', 'Nehru Place', 'Saket District Centre'
  ];
  
  return Array.from({ length: count }, (_, i) => {
    const reportedAt = faker.date.recent({ days: 30 });
    const status = faker.helpers.arrayElement(['Open', 'Dispatched', 'In Progress', 'Resolved', 'Closed'] as IncidentStatus[]);
    const dispatchedAt = status !== 'Open' ? new Date(reportedAt.getTime() + faker.number.int({ min: 5, max: 30 }) * 60000) : null;
    const resolvedAt = ['Resolved', 'Closed'].includes(status) 
      ? new Date((dispatchedAt?.getTime() || reportedAt.getTime()) + faker.number.int({ min: 30, max: 180 }) * 60000) 
      : null;
    const resolutionTime = resolvedAt && dispatchedAt 
      ? Math.round((resolvedAt.getTime() - dispatchedAt.getTime()) / 60000)
      : null;
    
    const zone = faker.helpers.arrayElement([...ZONES]);
    
    return {
      id: `RAF-${String(i + 1).padStart(4, '0')}`,
      title: faker.helpers.arrayElement(categories),
      description: faker.lorem.sentence(),
      location: faker.helpers.arrayElement(locations),
      zone,
      coordinates: {
        lat: 28.5 + Math.random() * 0.3,
        lng: 77.1 + Math.random() * 0.3,
      },
      priority: faker.helpers.arrayElement(['Critical', 'High', 'Medium', 'Low'] as IncidentPriority[]),
      status,
      reportedAt: reportedAt.toISOString(),
      dispatchedAt: dispatchedAt?.toISOString() || null,
      resolvedAt: resolvedAt?.toISOString() || null,
      teamAssigned: status !== 'Open' ? [faker.person.fullName(), faker.person.fullName()] : [],
      resolutionTime,
      category: faker.helpers.arrayElement(categories),
      reportedBy: faker.person.fullName(),
      eta: status === 'Dispatched' || status === 'In Progress' ? faker.number.int({ min: 5, max: 45 }) : null,
    };
  });
};

// ========== GENERATE RAF TEAMS ==========
export const generateRAFTeams = (): RAFTeam[] => {
  return ZONES.map((zone, i) => ({
    id: `TEAM-${String(i + 1).padStart(2, '0')}`,
    name: `${zone} Rapid Response`,
    members: [faker.person.fullName(), faker.person.fullName(), faker.person.fullName()],
    zone,
    status: faker.helpers.arrayElement(['Ready', 'Deployed', 'Returning', 'Off Duty'] as const),
    currentLocation: {
      lat: 28.5 + Math.random() * 0.3,
      lng: 77.1 + Math.random() * 0.3,
    },
    vehicleNumber: `DL ${faker.number.int({ min: 1, max: 14 })}C ${faker.string.alphanumeric(4).toUpperCase()}`,
    specialization: faker.helpers.arrayElement(['Sanitation', 'Emergency', 'Infrastructure', 'General']),
  }));
};

// ========== ANALYTICS HELPERS ==========
export const getAttendanceByDate = (records: AttendanceRecord[]): { date: string; present: number; absent: number; anomaly: number }[] => {
  const grouped = records.reduce((acc, record) => {
    if (!acc[record.date]) {
      acc[record.date] = { present: 0, absent: 0, anomaly: 0, halfDay: 0, leave: 0 };
    }
    if (record.status === 'Present') acc[record.date].present++;
    else if (record.status === 'Absent') acc[record.date].absent++;
    else if (record.status === 'Anomaly') acc[record.date].anomaly++;
    else if (record.status === 'Half-day') acc[record.date].halfDay++;
    else if (record.status === 'Leave') acc[record.date].leave++;
    return acc;
  }, {} as Record<string, { present: number; absent: number; anomaly: number; halfDay: number; leave: number }>);
  
  return Object.entries(grouped)
    .map(([date, counts]) => ({
      date,
      present: counts.present + Math.floor(counts.halfDay / 2),
      absent: counts.absent + counts.leave,
      anomaly: counts.anomaly,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const getZoneWisePerformance = (employees: Employee[], records: AttendanceRecord[]): { zone: Zone; attendance: number; performance: number; employees: number }[] => {
  return ZONES.map(zone => {
    const zoneEmployees = employees.filter(e => e.zone === zone);
    const zoneRecords = records.filter(r => zoneEmployees.some(e => e.id === r.employeeId));
    const presentCount = zoneRecords.filter(r => r.status === 'Present' || r.status === 'Half-day').length;
    const totalRecords = zoneRecords.length || 1;
    
    return {
      zone,
      attendance: Math.round((presentCount / totalRecords) * 100),
      performance: Math.round(zoneEmployees.reduce((sum, e) => sum + e.performance, 0) / (zoneEmployees.length || 1) * 20),
      employees: zoneEmployees.length,
    };
  });
};

export const getGhostAnomalies = (records: AttendanceRecord[]): AttendanceRecord[] => {
  return records.filter(r => r.isGhostFlagged);
};

// ========== GENERATE ALL DATA ==========
export const employeeDatabase = generateEmployees(1000);
export const attendanceDatabase = generateAttendanceHistory(employeeDatabase);
export const payrollDatabase = generatePayroll(employeeDatabase, attendanceDatabase);
export const incidentDatabase = generateRAFIncidents(60);
export const rafTeams = generateRAFTeams();

// ========== EMPLOYEE ATTENDANCE SPARKLINE DATA ==========
export const getEmployeeAttendanceSparkline = (employeeId: string): { day: number; value: number }[] => {
  const empRecords = attendanceDatabase
    .filter(r => r.employeeId === employeeId)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-14); // Last 14 days
  
  return empRecords.map((r, i) => ({
    day: i + 1,
    value: r.status === 'Present' ? 100 : r.status === 'Half-day' ? 50 : r.status === 'Anomaly' ? 25 : 0,
  }));
};
