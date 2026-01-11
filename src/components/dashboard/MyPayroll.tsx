import { useEffect, useState } from "react";
import jsPDF from "jspdf";

interface Employee {
  id: string;
  name: string;
}

interface Payroll {
  month: string;
  present_days: number;
  salary: number;
}

export default function MyPayroll() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selected, setSelected] = useState("");
  const [history, setHistory] = useState<Payroll[]>([]);
  const [loading, setLoading] = useState(false);

  // Load employees
  useEffect(() => {
    fetch("http://localhost:5050/api/employees")
      .then(res => res.json())
      .then(setEmployees);
  }, []);

  // Load payroll
  useEffect(() => {
    if (!selected) return;
    setLoading(true);
    fetch(`http://localhost:5050/api/payroll-history/${selected}`)
      .then(res => res.json())
      .then(data => {
        setHistory(data);
        setLoading(false);
      });
  }, [selected]);

  const generatePDF = (p: Payroll) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Municipal Corporation of Delhi", 20, 20);
    doc.setFontSize(12);
    doc.text("Salary Slip", 20, 30);
    doc.text(`Employee ID: ${selected}`, 20, 50);
    doc.text(`Month: ${p.month}`, 20, 65);
    doc.text(`Present Days: ${p.present_days}`, 20, 80);
    doc.text(`Salary: ₹${p.salary}`, 20, 95);
    doc.text("Authorized HRMS Payroll System", 20, 120);
    doc.save(`salary-slip-${selected}-${p.month}.pdf`);
  };

  return (
    <div className="dashboard-card p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Payroll History</h2>

      <select
        className="border p-2 rounded w-full mb-4"
        onChange={e => setSelected(e.target.value)}
      >
        <option value="">Select Employee</option>
        {employees.map(e => (
          <option key={e.id} value={e.id}>
            {e.id} – {e.name}
          </option>
        ))}
      </select>

      {loading && <p className="text-center text-muted-foreground">Loading Payroll…</p>}

      {!loading && (
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="p-2">Month</th>
              <th className="p-2">Days</th>
              <th className="p-2">Salary</th>
              <th className="p-2">Slip</th>
            </tr>
          </thead>
          <tbody>
            {history.map((p, i) => (
              <tr key={i} className="border-t">
                <td className="p-2">{p.month}</td>
                <td className="p-2">{p.present_days}</td>
                <td className="p-2 font-bold text-green-600">₹{p.salary}</td>
                <td className="p-2">
                  <button
                    onClick={() => generatePDF(p)}
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    Download Slip
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}