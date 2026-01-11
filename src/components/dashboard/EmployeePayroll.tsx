import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Download, Calendar, TrendingUp, IndianRupee, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import jsPDF from 'jspdf';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050';

interface PayrollRecord {
  employee_id: string;
  month: string;
  present_days: number;
  salary: number;
}

interface EmployeePayrollProps {
  employeeId: string;
  fullView?: boolean;
}

export default function EmployeePayroll({ employeeId, fullView = false }: EmployeePayrollProps) {
  const [payroll, setPayroll] = useState<PayrollRecord | null>(null);
  const [history, setHistory] = useState<PayrollRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    
    // Fetch current month payroll
    fetch(`${API_URL}/api/payroll/${employeeId}`)
      .then(res => res.json())
      .then(data => {
        setPayroll(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    // Fetch history for full view
    if (fullView) {
      fetch(`${API_URL}/api/payroll-history/${employeeId}`)
        .then(res => res.json())
        .then(data => setHistory(data || []));
    }
  }, [employeeId, fullView]);

  // Calculate earnings breakdown (mock calculation based on salary)
  const calculateBreakdown = (salary: number) => {
    const basic = Math.round(salary * 0.5);
    const hra = Math.round(salary * 0.2);
    const conveyance = Math.round(salary * 0.1);
    const special = salary - basic - hra - conveyance;
    const pf = Math.round(basic * 0.12);
    const tax = salary > 25000 ? Math.round(salary * 0.1) : 0;
    
    return {
      basic,
      hra,
      conveyance,
      special,
      grossSalary: salary,
      pf,
      tax,
      totalDeductions: pf + tax,
      netSalary: salary - pf - tax
    };
  };

  const generatePDF = (p: PayrollRecord) => {
    const breakdown = calculateBreakdown(p.salary);
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(30, 41, 59);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text('Municipal Corporation of Delhi', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text('SALARY SLIP', 105, 32, { align: 'center' });
    
    // Employee Info
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.text(`Employee ID: ${p.employee_id}`, 20, 55);
    doc.text(`Month: ${p.month}`, 120, 55);
    doc.text(`Working Days: ${p.present_days}`, 20, 65);
    doc.text(`Pay Date: ${new Date().toLocaleDateString('en-IN')}`, 120, 65);
    
    // Earnings Section
    doc.setFillColor(240, 240, 240);
    doc.rect(15, 75, 180, 10, 'F');
    doc.setFontSize(12);
    doc.text('EARNINGS', 20, 82);
    
    doc.setFontSize(10);
    let y = 95;
    doc.text('Basic Pay', 25, y);
    doc.text(`₹${breakdown.basic.toLocaleString('en-IN')}`, 160, y, { align: 'right' });
    y += 10;
    doc.text('HRA', 25, y);
    doc.text(`₹${breakdown.hra.toLocaleString('en-IN')}`, 160, y, { align: 'right' });
    y += 10;
    doc.text('Conveyance', 25, y);
    doc.text(`₹${breakdown.conveyance.toLocaleString('en-IN')}`, 160, y, { align: 'right' });
    y += 10;
    doc.text('Special Allowance', 25, y);
    doc.text(`₹${breakdown.special.toLocaleString('en-IN')}`, 160, y, { align: 'right' });
    y += 10;
    doc.line(25, y, 175, y);
    y += 8;
    doc.setFontSize(11);
    doc.text('Gross Salary', 25, y);
    doc.text(`₹${breakdown.grossSalary.toLocaleString('en-IN')}`, 160, y, { align: 'right' });
    
    // Deductions Section
    y += 15;
    doc.setFillColor(240, 240, 240);
    doc.rect(15, y, 180, 10, 'F');
    doc.setFontSize(12);
    doc.text('DEDUCTIONS', 20, y + 7);
    
    y += 18;
    doc.setFontSize(10);
    doc.text('Provident Fund (12%)', 25, y);
    doc.text(`₹${breakdown.pf.toLocaleString('en-IN')}`, 160, y, { align: 'right' });
    y += 10;
    doc.text('Income Tax', 25, y);
    doc.text(`₹${breakdown.tax.toLocaleString('en-IN')}`, 160, y, { align: 'right' });
    y += 10;
    doc.line(25, y, 175, y);
    y += 8;
    doc.setFontSize(11);
    doc.text('Total Deductions', 25, y);
    doc.text(`₹${breakdown.totalDeductions.toLocaleString('en-IN')}`, 160, y, { align: 'right' });
    
    // Net Salary
    y += 20;
    doc.setFillColor(30, 41, 59);
    doc.rect(15, y - 5, 180, 15, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text('NET SALARY', 25, y + 5);
    doc.text(`₹${breakdown.netSalary.toLocaleString('en-IN')}`, 170, y + 5, { align: 'right' });
    
    // Footer
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.text('This is a computer-generated document. No signature required.', 105, 280, { align: 'center' });
    doc.text('© Municipal Corporation of Delhi - HRMS Portal', 105, 285, { align: 'center' });
    
    doc.save(`salary-slip-${p.employee_id}-${p.month}.pdf`);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          Loading payroll data...
        </CardContent>
      </Card>
    );
  }

  const breakdown = payroll ? calculateBreakdown(payroll.salary) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={fullView ? 'space-y-6' : ''}
    >
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Wallet className="h-5 w-5 text-primary" />
            My Payroll
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!payroll ? (
            <p className="text-center text-muted-foreground py-8">
              No payroll data found. Mark attendance to generate payroll.
            </p>
          ) : (
            <>
              {/* Current Month Summary */}
              <div className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border border-primary/20 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">{payroll.month}</span>
                  <Badge variant="outline" className="text-status-success border-status-success">
                    {payroll.present_days} Days Worked
                  </Badge>
                </div>
                <div className="flex items-baseline gap-2">
                  <IndianRupee className="h-6 w-6 text-primary" />
                  <span className="text-3xl font-bold text-primary">
                    {breakdown?.netSalary.toLocaleString('en-IN')}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Net Salary</p>
              </div>

              {/* Quick Breakdown */}
              {fullView && breakdown && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Gross Salary</p>
                      <p className="text-lg font-semibold">₹{breakdown.grossSalary.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="p-3 bg-status-danger/10 rounded-lg">
                      <p className="text-xs text-muted-foreground">Deductions</p>
                      <p className="text-lg font-semibold text-status-danger">
                        -₹{breakdown.totalDeductions.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  {/* Detailed Breakdown */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Earnings</h4>
                    {[
                      { label: 'Basic Pay', value: breakdown.basic },
                      { label: 'HRA', value: breakdown.hra },
                      { label: 'Conveyance', value: breakdown.conveyance },
                      { label: 'Special Allowance', value: breakdown.special },
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{item.label}</span>
                        <span>₹{item.value.toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Deductions</h4>
                    {[
                      { label: 'Provident Fund', value: breakdown.pf },
                      { label: 'Income Tax', value: breakdown.tax },
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{item.label}</span>
                        <span className="text-status-danger">-₹{item.value.toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Download Button */}
              <Button 
                className="w-full mt-4 gap-2"
                onClick={() => generatePDF(payroll)}
              >
                <Download className="h-4 w-4" />
                Download Salary Slip
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Payroll History */}
      {fullView && history.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-primary" />
              Salary History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {history.map((record, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{record.month}</p>
                    <p className="text-xs text-muted-foreground">{record.present_days} days worked</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-semibold text-status-success">
                      ₹{record.salary.toLocaleString('en-IN')}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => generatePDF(record)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
