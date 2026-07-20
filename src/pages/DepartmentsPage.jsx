import React from 'react';
import { departmentsData, DepartmentCard } from '../components/Departments';

const DepartmentsPage = () => {
  return (
    <div className="pt-24 pb-12 min-h-screen bg-slate-950">
      {/* Hero Section */}
      <div className="container mx-auto px-6 mb-16 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white tracking-tight">Medical Departments</h1>
        <p className="text-white/60 max-w-3xl mx-auto text-xl font-light">
          Explore our specialized medical centers. We combine world-class expertise, compassionate care, and cutting-edge technology to provide comprehensive treatment across all major medical disciplines.
        </p>
      </div>

      {/* Grid Section */}
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {departmentsData.map((dept, idx) => (
            <DepartmentCard key={dept.id} dept={dept} idx={idx} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DepartmentsPage;
