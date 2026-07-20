import React, { useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { departmentsData } from '../components/Departments';
import { ArrowLeft, CheckCircle2, Users, Activity, Calendar } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { Environment, Float } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

const dummyDetails = {
  overview: "Our department is equipped with state-of-the-art technology and staffed by internationally recognized experts dedicated to providing the highest quality of care.",
  diseases: ["Chronic Conditions", "Acute Illnesses", "Preventative Care", "Specialized Disorders"],
  treatments: ["Advanced Surgery", "Minimally Invasive Procedures", "Targeted Therapy", "Comprehensive Rehabilitation"],
  technologies: ["AI-Assisted Diagnostics", "Robotic Surgery Systems", "Next-Gen Imaging", "Precision Medicine Labs"],
  doctors: [
    { name: 'Dr. Sarah Chen', role: 'Head of Department' },
    { name: 'Dr. James Wilson', role: 'Senior Specialist' },
    { name: 'Dr. Emily Stone', role: 'Consultant' }
  ]
};

const DepartmentDetails = () => {
  const { departmentName } = useParams();
  
  // Find department data based on URL param
  const dept = useMemo(() => {
    return departmentsData.find(d => d.id === departmentName);
  }, [departmentName]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [departmentName]);

  if (!dept) {
    return (
      <div className="pt-32 pb-12 min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <h1 className="text-4xl font-bold mb-4">Department Not Found</h1>
        <Link to="/departments" className="text-medical-emerald hover:underline flex items-center gap-2">
          <ArrowLeft size={16} /> Back to Departments
        </Link>
      </div>
    );
  }

  const Model = dept.Model;
  const Icon = dept.icon;

  return (
    <div className="pt-24 pb-20 min-h-screen bg-slate-950 text-white selection:bg-medical-emerald selection:text-white">
      <div className="container mx-auto px-6">
        
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link to="/departments" className="inline-flex items-center gap-2 text-white/50 hover:text-medical-emerald transition-colors text-sm font-medium">
            <ArrowLeft size={16} /> Back to Departments
          </Link>
        </div>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/80 text-sm font-medium mb-6">
              <Icon size={16} color={dept.color} /> {dept.name} Center
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight" style={{ color: dept.color }}>
              {dept.name}
            </h1>
            <p className="text-xl text-white/70 font-light leading-relaxed mb-8">
              {dept.desc}. {dummyDetails.overview}
            </p>
            <button className="bg-medical-emerald hover:bg-teal-500 text-white px-8 py-4 rounded-full font-semibold transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <Calendar size={20} /> Book an Appointment
            </button>
          </div>

          {/* 3D Model Showcase */}
          <div className="h-[400px] lg:h-[500px] bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ background: `radial-gradient(circle at center, ${dept.color}, transparent 70%)` }} />
            <Canvas camera={{ position: [0, 0, 4.5], fov: 45 }} shadows dpr={[1, 2]}>
              <ambientLight intensity={0.6} />
              <directionalLight position={[5, 5, 5]} intensity={1.5} castShadow />
              <spotLight position={[-5, 5, 0]} intensity={2} color={dept.color} />
              <Environment preset="studio" />
              
              <Float speed={2} rotationIntensity={0.5} floatIntensity={1.5}>
                <Model isHovered={true} />
              </Float>

              <EffectComposer disableNormalPass>
                <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.9} intensity={1.2} mipmapBlur />
              </EffectComposer>
            </Canvas>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Diseases & Treatments */}
          <div className="space-y-8">
            <div className="glass-panel p-8 rounded-3xl">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Activity className="text-medical-emerald" /> Diseases Treated
              </h2>
              <ul className="space-y-4">
                {dummyDetails.diseases.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-white/80">
                    <CheckCircle2 size={20} className="text-medical-emerald shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-panel p-8 rounded-3xl">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Icon className="text-medical-emerald" /> Treatments & Procedures
              </h2>
              <ul className="space-y-4">
                {dummyDetails.treatments.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-white/80">
                    <CheckCircle2 size={20} className="text-medical-emerald shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Technologies & Specialists */}
          <div className="space-y-8">
            <div className="glass-panel p-8 rounded-3xl border-l-4 border-l-medical-emerald">
              <h2 className="text-2xl font-bold mb-6">Available Technologies</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {dummyDetails.technologies.map((tech, i) => (
                  <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <p className="font-medium text-white/90">{tech}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel p-8 rounded-3xl">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Users className="text-medical-emerald" /> Related Specialists
              </h2>
              <div className="space-y-4">
                {dummyDetails.doctors.map((doc, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/10">
                    <div className="w-12 h-12 rounded-full bg-medical-blue flex items-center justify-center font-bold text-lg text-medical-emerald border border-medical-emerald/30">
                      {doc.name.charAt(4)}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{doc.name}</h3>
                      <p className="text-white/50 text-sm">{doc.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DepartmentDetails;
