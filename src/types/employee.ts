// Employee type from backend
export interface LoggedInEmployee {
  id: string;
  name: string;
  role: string;
  department: string;
  zone: string;
  phone: string;
  email: string;
  status: string;
  userRole: 'admin' | 'employee' | 'hr';
  avatar?: string;
  address?: string;
  joining_date?: string;
}
