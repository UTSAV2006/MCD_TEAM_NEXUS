import React from 'react';
import { motion } from 'framer-motion';
import { 
  User, Mail, Phone, MapPin, 
  Briefcase, Calendar, ShieldCheck, 
  Droplets, CreditCard, Download 
} from 'lucide-react';

const UserProfile = ({ user }: { user: any }) => {
  // Mock data agar backend se abhi data nahi aa raha
  const userData = user || {
    name: "Rajesh Kumar",
    empId: "MCD-2024-089",
    role: "Field Supervisor",
    dept: "Sanitation & Waste Management",
    email: "rajesh.k@mcd.gov.in",
    phone: "+91 98765-43210",
    location: "Zone 3 - West Delhi",
    joined: "12 March 2021",
    bloodGroup: "O+",
    status: "Active"
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Banner/Cover */}
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
        
        <div className="px-8 pb-8">
          <div className="relative flex flex-col md:flex-row items-center md:items-end -mt-16 gap-6">
            {/* Profile Image */}
            <div className="w-32 h-32 rounded-2xl border-4 border-white bg-slate-100 shadow-md flex items-center justify-center overflow-hidden">
              <User size={64} className="text-slate-400" />
            </div>
            
            <div className="flex-1 text-center md:text-left mb-2">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <h1 className="text-3xl font-extrabold text-slate-800">{userData.name}</h1>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-wider">
                  {userData.status}
                </span>
              </div>
              <p className="text-slate-500 font-medium">{userData.role} • {userData.empId}</p>
            </div>

            <button className="flex items-center gap-2 bg-slate-800 text-white px-5 py-2.5 rounded-xl hover:bg-slate-900 transition-all shadow-sm font-semibold">
              <Download size={18} /> Download ID Card
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            {/* Professional Info Section */}
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <ShieldCheck size={16} /> Professional Details
              </h3>
              <div className="space-y-4">
                <InfoRow icon={<Briefcase size={20} />} label="Department" value={userData.dept} />
                <InfoRow icon={<Calendar size={20} />} label="Date of Joining" value={userData.joined} />
                <InfoRow icon={<MapPin size={20} />} label="Assigned Zone" value={userData.location} />
                <InfoRow icon={<CreditCard size={20} />} label="Payroll Grade" value="Level-7 (Gazetted)" />
              </div>
            </div>

            {/* Personal Info Section */}
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <User size={16} /> Personal Information
              </h3>
              <div className="space-y-4">
                <InfoRow icon={<Mail size={20} />} label="Email Address" value={userData.email} />
                <InfoRow icon={<Phone size={20} />} label="Contact Number" value={userData.phone} />
                <InfoRow icon={<Droplets size={20} />} label="Blood Group" value={userData.bloodGroup} />
                <InfoRow icon={<MapPin size={20} />} label="Residential Address" value="Sector 12, Dwarka, Delhi" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Helper Component for Info Rows
const InfoRow = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors group">
    <div className="text-blue-500 group-hover:scale-110 transition-transform">{icon}</div>
    <div>
      <p className="text-xs font-semibold text-slate-400 uppercase">{label}</p>
      <p className="text-slate-700 font-bold">{value}</p>
    </div>
  </div>
);

export default UserProfile;