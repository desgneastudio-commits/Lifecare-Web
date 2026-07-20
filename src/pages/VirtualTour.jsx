import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { CameraControls, Environment, Text, Grid, Box, Cylinder, Sphere } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';

// --- Procedural Room Models ---

const Reception = () => (
  <group>
    {/* Desk */}
    <mesh position={[0, 0.5, 0]}>
      <boxGeometry args={[4, 1, 1]} />
      <meshPhysicalMaterial color="#0f172a" roughness={0.1} clearcoat={1} />
    </mesh>
    <mesh position={[0, 1.2, 0]}>
      <boxGeometry args={[4, 0.1, 1]} />
      <meshPhysicalMaterial color="#38bdf8" transmission={0.9} roughness={0} />
    </mesh>
    {/* Screen */}
    <mesh position={[1, 1.5, -0.2]} rotation={[0, -Math.PI / 8, 0]}>
      <boxGeometry args={[1, 0.6, 0.05]} />
      <meshStandardMaterial color="#1e293b" emissive="#0ea5e9" emissiveIntensity={0.5} />
    </mesh>
    {/* Floor indicator */}
    <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[2.5, 2.6, 32]} />
      <meshBasicMaterial color="#38bdf8" transparent opacity={0.3} />
    </mesh>
  </group>
);

const WaitingLounge = () => (
  <group>
    {/* Sofa 1 */}
    <mesh position={[-1.5, 0.4, 0]}>
      <boxGeometry args={[1, 0.8, 2]} />
      <meshStandardMaterial color="#334155" roughness={0.8} />
    </mesh>
    {/* Sofa 2 */}
    <mesh position={[1.5, 0.4, 0]}>
      <boxGeometry args={[1, 0.8, 2]} />
      <meshStandardMaterial color="#334155" roughness={0.8} />
    </mesh>
    {/* Coffee Table */}
    <mesh position={[0, 0.3, 0]}>
      <cylinderGeometry args={[0.8, 0.8, 0.1, 32]} />
      <meshPhysicalMaterial color="#94a3b8" transmission={0.5} opacity={0.5} transparent />
    </mesh>
    {/* Abstract Plant */}
    <mesh position={[0, 0.8, 0]}>
      <sphereGeometry args={[0.3, 16, 16]} />
      <meshStandardMaterial color="#10b981" emissive="#064e3b" emissiveIntensity={0.5} />
    </mesh>
  </group>
);

const ICU = () => (
  <group>
    {/* Bed */}
    <mesh position={[0, 0.6, 0]}>
      <boxGeometry args={[1.2, 0.2, 2.5]} />
      <meshStandardMaterial color="#e2e8f0" />
    </mesh>
    {/* Monitors */}
    <mesh position={[-1, 1.2, -1]} rotation={[0, Math.PI / 4, 0]}>
      <boxGeometry args={[0.8, 0.6, 0.1]} />
      <meshStandardMaterial color="#020617" emissive="#ef4444" emissiveIntensity={0.8} />
    </mesh>
    <mesh position={[-1, 0.5, -1]}>
      <cylinderGeometry args={[0.05, 0.05, 1]} />
      <meshStandardMaterial color="#64748b" />
    </mesh>
    {/* Drip Stand */}
    <mesh position={[1, 1, -1]}>
      <cylinderGeometry args={[0.03, 0.03, 2]} />
      <meshStandardMaterial color="#94a3b8" metalness={0.8} />
    </mesh>
    <mesh position={[1, 1.8, -1]}>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshStandardMaterial color="#38bdf8" transparent opacity={0.8} />
    </mesh>
  </group>
);

const Emergency = () => {
  const lightRef = useRef();
  useFrame((state) => {
    if (lightRef.current) {
      lightRef.current.intensity = Math.sin(state.clock.elapsedTime * 4) * 0.5 + 0.5;
    }
  });
  return (
    <group>
      {/* Stretcher */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1, 0.1, 2.5]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.5} />
      </mesh>
      {/* Warning Light */}
      <mesh position={[0, 2, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.2, 16]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" ref={lightRef} />
      </mesh>
      <pointLight position={[0, 2, 0]} color="#ef4444" distance={5} intensity={2} />
    </group>
  );
};

const OperationTheatre = () => (
  <group>
    {/* Surgical Table */}
    <mesh position={[0, 0.8, 0]}>
      <boxGeometry args={[1, 0.1, 2.5]} />
      <meshStandardMaterial color="#1e293b" />
    </mesh>
    <mesh position={[0, 0.4, 0]}>
      <cylinderGeometry args={[0.3, 0.4, 0.8]} />
      <meshStandardMaterial color="#64748b" metalness={0.8} />
    </mesh>
    {/* Surgical Lights */}
    <group position={[0, 2.5, 0]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.6, 0.1, 16, 32]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} />
      </mesh>
      <mesh position={[0, -0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.5, 32]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <spotLight position={[0, 0, 0]} target-position={[0, -2.5, 0]} angle={0.5} penumbra={0.5} intensity={5} color="#ffffff" />
    </group>
  </group>
);

const MRIRoom = () => {
  const bedRef = useRef();
  useFrame((state) => {
    if (bedRef.current) {
      bedRef.current.position.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.8;
    }
  });
  return (
    <group>
      {/* Scanner */}
      <mesh position={[0, 1.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 1.5, 32, 1, true]} />
        <meshStandardMaterial color="#f8fafc" side={THREE.DoubleSide} />
      </mesh>
      {/* Inner Glow */}
      <mesh position={[0, 1.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.2, 1.2, 1.4, 32, 1, true]} />
        <meshBasicMaterial color="#6366f1" transparent opacity={0.3} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
      </mesh>
      {/* Bed */}
      <mesh ref={bedRef} position={[0, 0.8, 1]}>
        <boxGeometry args={[0.8, 0.1, 3]} />
        <meshStandardMaterial color="#cbd5e1" />
      </mesh>
      <mesh position={[0, 0.4, 1.5]}>
        <boxGeometry args={[0.6, 0.8, 0.6]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>
    </group>
  );
};

const Laboratory = () => (
  <group>
    {/* Lab Bench */}
    <mesh position={[0, 0.8, -0.5]}>
      <boxGeometry args={[4, 0.1, 1]} />
      <meshStandardMaterial color="#e2e8f0" />
    </mesh>
    <mesh position={[0, 0.4, -0.5]}>
      <boxGeometry args={[3.8, 0.8, 0.8]} />
      <meshStandardMaterial color="#334155" />
    </mesh>
    {/* Microscope / Equipment */}
    <mesh position={[-1, 1, -0.5]}>
      <cylinderGeometry args={[0.1, 0.2, 0.4]} />
      <meshStandardMaterial color="#f8fafc" metalness={0.5} />
    </mesh>
    {/* Vials */}
    {[0, 1, 2].map((i) => (
      <mesh key={i} position={[0.5 + i * 0.2, 0.95, -0.4]}>
        <cylinderGeometry args={[0.03, 0.03, 0.2]} />
        <meshPhysicalMaterial color={['#ef4444', '#10b981', '#3b82f6'][i]} transmission={0.9} roughness={0.1} />
      </mesh>
    ))}
  </group>
);

const Pharmacy = () => (
  <group>
    {/* Counter */}
    <mesh position={[0, 0.8, 1]}>
      <boxGeometry args={[4, 1, 0.5]} />
      <meshStandardMaterial color="#1e293b" />
    </mesh>
    <mesh position={[0, 1.3, 1]}>
      <boxGeometry args={[4, 0.1, 0.6]} />
      <meshPhysicalMaterial color="#38bdf8" transmission={0.9} roughness={0} />
    </mesh>
    {/* Shelves */}
    <mesh position={[0, 1.5, -1]}>
      <boxGeometry args={[4, 3, 0.5]} />
      <meshStandardMaterial color="#334155" />
    </mesh>
    {/* Abstract Medicine Boxes */}
    {[...Array(10)].map((_, i) => (
      <mesh key={i} position={[-1.5 + (i % 4), 1 + Math.floor(i / 4) * 0.5, -0.7]}>
        <boxGeometry args={[0.4, 0.3, 0.3]} />
        <meshStandardMaterial color={['#10b981', '#f59e0b', '#ef4444', '#3b82f6'][i % 4]} />
      </mesh>
    ))}
  </group>
);

const PatientRoom = () => (
  <group>
    {/* Bed */}
    <mesh position={[0, 0.6, 0]}>
      <boxGeometry args={[1.5, 0.2, 2.5]} />
      <meshStandardMaterial color="#e2e8f0" />
    </mesh>
    <mesh position={[0, 0.8, -1.1]}>
      <boxGeometry args={[1.5, 0.4, 0.2]} />
      <meshStandardMaterial color="#cbd5e1" />
    </mesh>
    {/* Side Table */}
    <mesh position={[1.2, 0.5, -1]}>
      <boxGeometry args={[0.6, 0.6, 0.6]} />
      <meshStandardMaterial color="#475569" />
    </mesh>
    {/* Lamp */}
    <mesh position={[1.2, 1, -1]}>
      <cylinderGeometry args={[0.1, 0.15, 0.2]} />
      <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={0.5} />
    </mesh>
    <pointLight position={[1.2, 1, -1]} color="#fef08a" distance={4} intensity={1} />
  </group>
);


const rooms = [
  { id: 'reception', name: 'Reception', component: Reception, pos: [0, 0, 0] },
  { id: 'waiting', name: 'Waiting Lounge', component: WaitingLounge, pos: [15, 0, 0] },
  { id: 'icu', name: 'ICU', component: ICU, pos: [30, 0, 0] },
  { id: 'emergency', name: 'Emergency', component: Emergency, pos: [0, 0, 15] },
  { id: 'theatre', name: 'Operation Theatre', component: OperationTheatre, pos: [15, 0, 15] },
  { id: 'mri', name: 'MRI Room', component: MRIRoom, pos: [30, 0, 15] },
  { id: 'lab', name: 'Laboratory', component: Laboratory, pos: [0, 0, 30] },
  { id: 'pharmacy', name: 'Pharmacy', component: Pharmacy, pos: [15, 0, 30] },
  { id: 'patient', name: 'Patient Rooms', component: PatientRoom, pos: [30, 0, 30] },
];

const RoomNode = ({ room }) => {
  const Component = room.component;
  return (
    <group position={room.pos}>
      <Component />
      {/* Platform */}
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[4, 4, 0.2, 64]} />
        <meshPhysicalMaterial color="#0f172a" roughness={0.5} metalness={0.5} clearcoat={1} />
      </mesh>
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.8, 3.9, 64]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.5} />
      </mesh>
      {/* Label */}
      <Text
        position={[0, 3.5, 0]}
        fontSize={0.4}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {room.name}
      </Text>
    </group>
  );
};

const CameraHandler = ({ activeRoom }) => {
  const controlsRef = useRef();

  useEffect(() => {
    if (controlsRef.current) {
      if (!activeRoom) {
        // Overview camera
        controlsRef.current.setLookAt(15, 25, 45, 15, 0, 15, true);
      } else {
        // Zoom into specific room
        const { pos } = activeRoom;
        controlsRef.current.setLookAt(
          pos[0], pos[1] + 3, pos[2] + 6, // camera position
          pos[0], pos[1] + 1, pos[2],     // target position
          true                            // animate
        );
      }
    }
  }, [activeRoom]);

  return (
    <CameraControls 
      ref={controlsRef} 
      maxPolarAngle={Math.PI / 2 - 0.1} 
      minDistance={2} 
      maxDistance={60} 
      makeDefault 
    />
  );
};

const VirtualTour = () => {
  const [activeRoomId, setActiveRoomId] = useState(null);
  const activeRoom = rooms.find(r => r.id === activeRoomId);

  return (
    <div className="pt-20 min-h-screen bg-slate-950 flex flex-col relative overflow-hidden">
      
      {/* Header UI */}
      <div className="absolute top-24 left-0 w-full z-20 pointer-events-none px-6">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white drop-shadow-lg">Hospital Virtual Tour</h1>
          <p className="text-white/80 max-w-xl text-lg drop-shadow-md">
            Experience our state-of-the-art facilities. Select a department below to navigate instantly.
          </p>
        </div>
      </div>

      {/* Navigation UI Overlay */}
      <div className="absolute bottom-10 left-0 w-full z-20 px-6 pointer-events-none">
        <div className="container mx-auto flex flex-col items-center">
          <div className="bg-slate-900/80 backdrop-blur-xl p-4 rounded-3xl border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] pointer-events-auto w-full max-w-5xl">
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => setActiveRoomId(null)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${!activeRoomId ? 'bg-medical-emerald text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'}`}
              >
                Overview Map
              </button>
              <div className="w-px h-10 bg-white/10 mx-2 hidden md:block"></div>
              {rooms.map(room => (
                <button
                  key={room.id}
                  onClick={() => setActiveRoomId(room.id)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${activeRoomId === room.id ? 'bg-medical-blue text-medical-emerald border border-medical-emerald/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-transparent'}`}
                >
                  {room.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3D Canvas */}
      <div className="w-full h-screen absolute inset-0 z-10">
        <Canvas shadows>
          <color attach="background" args={['#020617']} />
          <fog attach="fog" args={['#020617', 20, 60]} />
          
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 20, 10]} intensity={1.5} castShadow shadow-bias={-0.0001} />
          <Environment preset="night" />
          
          <Grid infiniteGrid fadeDistance={50} sectionColor="#10b981" cellColor="#1e293b" sectionThickness={1} cellThickness={0.5} position={[0, -0.11, 0]} />

          <group>
            {rooms.map(room => (
              <RoomNode key={room.id} room={room} />
            ))}
          </group>

          <CameraHandler activeRoom={activeRoom} />

          <EffectComposer disableNormalPass>
            <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} intensity={1.5} mipmapBlur />
          </EffectComposer>
        </Canvas>
      </div>
    </div>
  );
};

export default VirtualTour;
