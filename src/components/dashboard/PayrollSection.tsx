import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Wallet, Building2, Calendar, FileText, Printer } from 'lucide-react';
import { payrollDatabase, employeeDatabase } from '@/lib/mockdata';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const PayrollSection = () => {
  const [selectedEmployee] = useState(employeeDatabase[0]);
  const payroll = payrollDatabase.find(p => p.employeeId === selectedEmployee.id);

  if (!payroll) return null;

  const handleDownload = () => {
    alert('PDF Download initiated! (Mock functionality)');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Salary Slip */}
      <div className="dashboard-card max-w-2xl mx-auto">
        <div className="text-center border-b border-border pb-4 mb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Building2 className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-bold text-primary">Municipal Corporation of Delhi</h2>
          </div>
          <p className="text-sm text-muted-foreground">Salary Slip for {payroll.month} {payroll.year}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
          <div><span className="text-muted-foreground">Employee:</span> <strong>{payroll.employeeName}</strong></div>
          <div><span className="text-muted-foreground">ID:</span> <strong>{payroll.employeeId}</strong></div>
          <div><span className="text-muted-foreground">Role:</span> <strong>{payroll.role}</strong></div>
          <div><span className="text-muted-foreground">Zone:</span> <strong>{payroll.zone}</strong></div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <h4 className="font-semibold text-status-success border-b pb-1">Earnings</h4>
            <div className="flex justify-between text-sm"><span>Basic Pay</span><span>₹{payroll.basic.toLocaleString()}</span></div>
            <div className="flex justify-between text-sm"><span>HRA</span><span>₹{payroll.hra.toLocaleString()}</span></div>
            <div className="flex justify-between text-sm"><span>DA</span><span>₹{payroll.da.toLocaleString()}</span></div>
            <div className="flex justify-between text-sm"><span>Special Allowance</span><span>₹{payroll.specialAllowance.toLocaleString()}</span></div>
            <div className="flex justify-between font-semibold border-t pt-2"><span>Gross</span><span>₹{payroll.grossSalary.toLocaleString()}</span></div>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-status-danger border-b pb-1">Deductions</h4>
            <div className="flex justify-between text-sm"><span>PF (12%)</span><span>₹{payroll.pf.toLocaleString()}</span></div>
            <div className="flex justify-between text-sm"><span>ESI</span><span>₹{payroll.esi.toLocaleString()}</span></div>
            <div className="flex justify-between text-sm"><span>Prof. Tax</span><span>₹{payroll.professionalTax.toLocaleString()}</span></div>
            <div className="flex justify-between text-sm"><span>TDS</span><span>₹{payroll.tds.toLocaleString()}</span></div>
            <div className="flex justify-between font-semibold border-t pt-2"><span>Total</span><span>₹{payroll.totalDeductions.toLocaleString()}</span></div>
          </div>
        </div>

        <div className="bg-primary/5 rounded-lg p-4 text-center border border-primary/20">
          <p className="text-sm text-muted-foreground">Net Salary</p>
          <p className="text-3xl font-bold text-primary">₹{payroll.netSalary.toLocaleString()}</p>
          <Badge className="mt-2" variant={payroll.status === 'Paid' ? 'default' : 'secondary'}>{payroll.status}</Badge>
        </div>

        <div className="flex gap-3 mt-6">
          <Button onClick={handleDownload} className="flex-1 gap-2"><Download className="h-4 w-4" />Download PDF</Button>
          <Button variant="outline" className="gap-2"><Printer className="h-4 w-4" />Print</Button>
        </div>
      </div>
    </motion.div>
  );
};

export default PayrollSection;
