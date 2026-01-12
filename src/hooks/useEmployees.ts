import { useEffect, useState } from "react";
import { api } from "@/lib/api";

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
    api.getEmployees()
      .then(data => {
        setEmployees(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch employees:", err);
        setLoading(false);
      });
  }, []);

  return { employees, loading };
}
