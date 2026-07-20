import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, Html } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

// Very basic placeholder for Anatomy since we don't have a real human GLB.
// Using a few spheres to represent head, chest, abdomen for clicking.
const AnatomyModel = ({ onPartClick }) => {
  return (
    <group position={[0, -2, 0]}>
      {/* Head */}
      <mesh position={[0, 4, 0]} onClick={(e) => { e.stopPropagation(); onPartClick('Brain'); }}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#8b5cf6" wireframe opacity={0.5} transparent />
      </mesh>
      
      {/* Chest / Heart */}
      <mesh position={[0, 2.5, 0]} onClick={(e) => { e.stopPropagation(); onPartClick('Heart'); }}>
        <cylinderGeometry args={[0.8, 0.7, 1.5, 32]} />
        <meshStandardMaterial color="#f43f5e" wireframe opacity={0.5} transparent />
      </mesh>

      {/* Abdomen / Lungs / Liver placeholder */}
      <mesh position={[0, 1, 0]} onClick={(e) => { e.stopPropagation(); onPartClick('Kidneys'); }}>
        <cylinderGeometry args={[0.7, 0.6, 1.5, 32]} />
        <meshStandardMaterial color="#0ea5e9" wireframe opacity={0.5} transparent />
      </mesh>

      {/* Spine / Skeleton placeholder */}
      <mesh position={[0, 2, -0.3]} onClick={(e) => { e.stopPropagation(); onPartClick('Bones'); }}>
        <cylinderGeometry args={[0.1, 0.1, 4, 16]} />
        <meshStandardMaterial color="#eab308" />
      </mesh>
    </group>
  );
};

const AnatomyExplorer = () => {
  const [selectedPart, setSelectedPart] = useState(null);

  const partDetails = {
    'Brain': {
      diseases: ['Migraine', 'Stroke', 'Alzheimer’s'],
      specialists: ['Dr. Sarah Chen (Neurology)'],
      treatments: ['Neuroimaging', 'Cognitive Therapy'],
    },
    'Heart': {
      diseases: ['Arrhythmia', 'Coronary Artery Disease'],
      specialists: ['Dr. James Wilson (Cardiology)'],
      treatments: ['Angioplasty', 'ECG Monitoring'],
    },
    'Kidneys': {
      diseases: ['Kidney Stones', 'Chronic Kidney Disease'],
      specialists: ['Dr. Emily Stone (Nephrology)'],
      treatments: ['Dialysis', 'Lithotripsy'],
    },
    'Bones': {
      diseases: ['Osteoporosis', 'Fractures', 'Arthritis'],
      specialists: ['Dr. Mark Johnson (Orthopedics)'],
      treatments: ['Joint Replacement', 'Physiotherapy'],
    }
  };

  return (
    <section className="py-24 bg-[#0a1128] relative overflow-hidden">
      <div className="container mx-auto px-6 h-[800px] flex flex-col md:flex-row items-center">
        
        <div className="w-full md:w-1/2 z-10 mb-10 md:mb-0">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Interactive Human Anatomy</h2>
          <p className="text-white/60 text-lg mb-8 max-w-md">
            Click on different body parts of our 3D model to explore related diseases, treatments, and specialized doctors at LifeCare Institute.
          </p>
          
          <AnimatePresence mode="wait">
            {selectedPart ? (
              <motion.div 
                key={selectedPart}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="glass-panel p-6 rounded-2xl border-l-4 border-l-medical-emerald max-w-md"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-medical-emerald">{selectedPart}</h3>
                  <button onClick={() => setSelectedPart(null)} className="text-white/50 hover:text-white">
                    <X size={20} />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm text-white/50 uppercase tracking-wider mb-1">Treated Conditions</h4>
                    <p className="text-white/90">{partDetails[selectedPart]?.diseases.join(', ')}</p>
                  </div>
                  <div>
                    <h4 className="text-sm text-white/50 uppercase tracking-wider mb-1">Top Specialists</h4>
                    <p className="text-white/90">{partDetails[selectedPart]?.specialists.join(', ')}</p>
                  </div>
                  <button className="mt-4 w-full bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg transition-colors border border-white/10">
                    Book Appointment
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="glass-panel p-6 rounded-2xl max-w-md text-center border-dashed border-white/20"
              >
                <p className="text-white/50">Select a body part on the 3D model to view details.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="w-full md:w-1/2 h-full absolute md:relative right-0 opacity-50 md:opacity-100 mix-blend-screen md:mix-blend-normal">
          <Canvas camera={{ position: [0, 2, 8], fov: 45 }}>
            <ambientLight intensity={0.5} />
            <spotLight position={[5, 10, 5]} intensity={1.5} color="#10b981" />
            <AnatomyModel onPartClick={setSelectedPart} />
            <OrbitControls 
              enableZoom={false}
              enablePan={false}
              minPolarAngle={Math.PI / 3}
              maxPolarAngle={Math.PI / 1.5}
            />
          </Canvas>
        </div>
      </div>
    </section>
  );
};

export default AnatomyExplorer;
