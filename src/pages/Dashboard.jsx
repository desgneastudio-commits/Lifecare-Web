import React from 'react';
import { motion } from 'framer-motion';
import { User, Calendar, Activity, FileText, Clock, Pill } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="pt-24 pb-12 min-h-screen bg-slate-950 px-6 container mx-auto">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-bold mb-2">Patient Dashboard</h1>
          <p className="text-white/60">Welcome back, John Doe</p>
        </div>
        <button className="bg-medical-emerald text-white px-6 py-2 rounded-full font-medium">
          New Appointment
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Column */}
        <div className="md:col-span-2 space-y-8">
          
          {/* Health Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Heart Rate', value: '72 bpm', icon: Activity, color: '#f43f5e' },
              { label: 'Blood Pressure', value: '120/80', icon: Activity, color: '#0ea5e9' },
              { label: 'Weight', value: '75 kg', icon: User, color: '#10b981' },
              { label: 'Sleep', value: '7.5 hrs', icon: Clock, color: '#8b5cf6' },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-panel p-4 rounded-xl flex flex-col items-start gap-2"
              >
                <stat.icon size={20} color={stat.color} />
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-xs text-white/50">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Appointments Timeline */}
          <div className="glass-panel p-6 rounded-2xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Calendar className="text-medical-emerald" /> Upcoming Appointments
            </h2>
            <div className="space-y-6">
              {[
                { doc: 'Dr. Sarah Chen', spec: 'Neurology', date: 'Tomorrow, 10:00 AM', status: 'Confirmed' },
                { doc: 'Dr. James Wilson', spec: 'Cardiology', date: 'Oct 25, 2:30 PM', status: 'Pending' }
              ].map((apt, i) => (
                <div key={i} className="flex justify-between items-center border-l-2 border-medical-emerald pl-4">
                  <div>
                    <h3 className="font-semibold text-lg">{apt.doc}</h3>
                    <p className="text-sm text-white/60">{apt.spec} &bull; {apt.date}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${apt.status === 'Confirmed' ? 'bg-medical-emerald/20 text-medical-emerald' : 'bg-yellow-500/20 text-yellow-500'}`}>
                    {apt.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Medications */}
          <div className="glass-panel p-6 rounded-2xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Pill className="text-medical-emerald" /> Medications
            </h2>
            <div className="space-y-4">
              <div className="bg-white/5 p-3 rounded-lg border border-white/10 flex justify-between items-center">
                <div>
                  <h4 className="font-semibold">Lisinopril 10mg</h4>
                  <p className="text-xs text-white/50">1 pill daily - Morning</p>
                </div>
                <button className="w-6 h-6 rounded-full border border-medical-emerald flex items-center justify-center text-medical-emerald hover:bg-medical-emerald hover:text-white transition-colors">
                  &check;
                </button>
              </div>
            </div>
          </div>

          {/* Recent Reports */}
          <div className="glass-panel p-6 rounded-2xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <FileText className="text-medical-emerald" /> Recent Reports
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-2 hover:bg-white/5 rounded-lg cursor-pointer transition-colors">
                <div>
                  <h4 className="font-semibold text-sm">Blood Test (CBC)</h4>
                  <p className="text-xs text-white/50">Oct 10, 2023</p>
                </div>
                <span className="text-medical-emerald text-xs">View</span>
              </div>
              <div className="flex justify-between items-center p-2 hover:bg-white/5 rounded-lg cursor-pointer transition-colors">
                <div>
                  <h4 className="font-semibold text-sm">ECG Scan</h4>
                  <p className="text-xs text-white/50">Sep 28, 2023</p>
                </div>
                <span className="text-medical-emerald text-xs">View</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
