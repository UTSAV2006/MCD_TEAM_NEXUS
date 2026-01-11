import { useEffect, useState } from "react";

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  zone: string;
  phone: string;
  email: string;
  status: string;
}

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5050/api/employees")
      .then(res => res.json())
      .then(data => {
        setEmployees(data);
        setLoading(false);
      });
  }, []);

  return { employees, loading };
}