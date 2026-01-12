// API client for backend communication
const SUPABASE_PROJECT_ID = import.meta.env.VITE_SUPABASE_PROJECT_ID;

// Use edge function URL
const API_BASE_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co/functions/v1/api`;

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
}

// API methods
export const api = {
  // Auth
  login: (employee_id: string, password: string) =>
    apiRequest<{ success: boolean; employee: any }>('/login', {
      method: 'POST',
      body: JSON.stringify({ employee_id, password }),
    }),

  // Employees
  getEmployees: () => apiRequest<any[]>('/employees'),
  
  getEmployee: (id: string) => apiRequest<any>(`/employee/${id}`),

  // Attendance
  getEmployeeAttendance: (id: string) =>
    apiRequest<any[]>(`/employee-attendance/${id}`),
  
  getTodayAttendance: () => apiRequest<any[]>('/attendance'),
  
  checkIn: (employee_id: string) =>
    apiRequest<{ message: string }>('/attendance', {
      method: 'POST',
      body: JSON.stringify({ employee_id }),
    }),

  // Payroll
  getPayroll: (id: string) => apiRequest<any>(`/payroll/${id}`),
  
  getPayrollHistory: (id: string) => apiRequest<any[]>(`/payroll-history/${id}`),

  // Health check
  health: () => apiRequest<{ status: string; time: any }>('/health'),
};
