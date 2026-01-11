import { useState, useEffect } from 'react';
import Index from './pages/Index';
import Login from './pages/Login';

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

function App() {
  const [employee, setEmployee] = useState<LoggedInEmployee | null>(null);

  // Check for saved session on mount
  useEffect(() => {
    const savedEmployee = localStorage.getItem('mcd_employee');
    if (savedEmployee) {
      try {
        setEmployee(JSON.parse(savedEmployee));
      } catch {
        localStorage.removeItem('mcd_employee');
      }
    }
  }, []);

  // Login handler
  const handleLogin = (emp: LoggedInEmployee) => {
    setEmployee(emp);
    localStorage.setItem('mcd_employee', JSON.stringify(emp));
  };

  // Logout handler
  const handleLogout = () => {
    setEmployee(null);
    localStorage.removeItem('mcd_employee');
  };

  return (
    <>
      {!employee ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Index employee={employee} onLogout={handleLogout} />
      )}
    </>
  );
}

export default App;
