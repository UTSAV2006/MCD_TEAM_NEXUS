import React from 'react';
import { Download, Printer, Building2, CheckCircle, IndianRupee } from 'lucide-react';

const MyPayroll = () => {
  // Hardcoded data for the Hackathon Demo
  const salaryData = {
    month: "January 2026",
    employee: {
      name: "Mr. Bennie Thiel DVM",
      id: "MCD-00001",
      role: "Junior Engineer",
      zone: "Shahdara"
    },
    earnings: [
      { label: "Basic Pay", amount: 28558 },
      { label: "HRA", amount: 8567 },
      { label: "DA", amount: 5712 },
      { label: "Special Allowance", amount: 3173 }
    ],
    deductions: [
      { label: "PF (12%)", amount: 3427 },
      { label: "ESI", amount: 0 },
      { label: "Prof. Tax", amount: 200 },
      { label: "TDS", amount: 0 }
    ]
  };

  const totalEarnings = salaryData.earnings.reduce((acc, curr) => acc + curr.amount, 0);
  const totalDeductions = salaryData.deductions.reduce((acc, curr) => acc + curr.amount, 0);
  const netSalary = totalEarnings - totalDeductions;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto animate-in fade-in duration-500">
      
      {/* Main Salary Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden" id="printable-area">
        
        {/* Header */}
        <div className="bg-white border-b border-gray-100 p-8 text-center">
          <div className="flex justify-center items-center gap-3 mb-2">
            <Building2 className="text-gray-700" size={28} />
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Municipal Corporation of Delhi</h1>
          </div>
          <p className="text-gray-500 font-medium">Salary Slip for {salaryData.month}</p>
        </div>

        {/* Employee Details Grid */}
        <div className="bg-gray-50 p-6 border-b border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
            <div className="flex justify-between md:justify-start md:gap-4">
              <span className="text-gray-500 min-w-[100px]">Employee:</span>
              <span className="font-semibold text-gray-900">{salaryData.employee.name}</span>
            </div>
            <div className="flex justify-between md:justify-start md:gap-4">
              <span className="text-gray-500 min-w-[100px]">ID:</span>
              <span className="font-semibold text-gray-900">{salaryData.employee.id}</span>
            </div>
            <div className="flex justify-between md:justify-start md:gap-4">
              <span className="text-gray-500 min-w-[100px]">Role:</span>
              <span className="font-semibold text-gray-900">{salaryData.employee.role}</span>
            </div>
            <div className="flex justify-between md:justify-start md:gap-4">
              <span className="text-gray-500 min-w-[100px]">Zone:</span>
              <span className="font-semibold text-gray-900">{salaryData.employee.zone}</span>
            </div>
          </div>
        </div>

        {/* Salary Details (Earnings vs Deductions) */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* Earnings Column */}
            <div>
              <h3 className="text-green-600 font-semibold mb-4 text-lg border-b pb-2">Earnings</h3>
              <div className="space-y-3">
                {salaryData.earnings.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.label}</span>
                    <span className="font-medium text-gray-900">₹{item.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-dashed border-gray-300 flex justify-between font-bold text-gray-800">
                <span>Gross</span>
                <span>₹{totalEarnings.toLocaleString()}</span>
              </div>
            </div>

            {/* Deductions Column */}
            <div>
              <h3 className="text-red-500 font-semibold mb-4 text-lg border-b pb-2">Deductions</h3>
              <div className="space-y-3">
                {salaryData.deductions.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.label}</span>
                    <span className="font-medium text-gray-900">₹{item.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-dashed border-gray-300 flex justify-between font-bold text-gray-800">
                <span>Total</span>
                <span>₹{totalDeductions.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Net Salary Box */}
          <div className="mt-8 bg-gray-50 rounded-xl p-6 text-center border border-gray-200">
            <p className="text-gray-500 text-sm mb-1">Net Salary</p>
            <div className="text-4xl font-bold text-gray-800 flex justify-center items-center gap-1">
              <IndianRupee size={32} />
              {netSalary.toLocaleString()}
            </div>
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wide">
              <CheckCircle size={14} /> Paid
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 px-8 py-4 flex flex-col sm:flex-row justify-end gap-3 border-t border-gray-100">
          <button 
            onClick={() => alert("Downloading PDF...")}
            className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-6 py-2.5 rounded-lg font-medium transition-colors w-full sm:w-auto"
          >
            <Download size={18} />
            Download PDF
          </button>
          
          <button 
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-2.5 rounded-lg font-medium transition-colors w-full sm:w-auto"
          >
            <Printer size={18} />
            Print
          </button>
        </div>

      </div>
      
      <p className="text-center text-xs text-gray-400 mt-6">
        Generated securely via MCD Smart Workforce System • {new Date().toLocaleDateString()}
      </p>
    </div>
  );
};

export default MyPayroll;