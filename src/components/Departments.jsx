import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, Sphere, Box, Cylinder, Torus, Points, PointMaterial } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Heart, Brain, Bone, Activity, Stethoscope, Baby, Smile, XSquare } from 'lucide-react';
import { gsap } from 'gsap';
import * as THREE from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

// --- Procedural Medical Models ---

const ProceduralHeart = ({ isHovered }) => {
  const meshRef = useRef();
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);
  
  useFrame((state, delta) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * (isHovered ? 1.0 : 0.2);
      const targetScale = isHovered ? 1.2 : 1.0;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <sphereGeometry args={[1, 64, 64]} />
      <meshPhysicalMaterial
        color="#f43f5e"
        emissive="#4a0010"
        emissiveIntensity={0.5}
        roughness={0.2}
        metalness={0.1}
        onBeforeCompile={(shader) => {
          shader.uniforms.uTime = uniforms.uTime;
          shader.vertexShader = `
            uniform float uTime;
            ${shader.vertexShader}
          `.replace(
            `#include <begin_vertex>`,
            `
            #include <begin_vertex>
            float pulse = sin(uTime * 5.0) * 0.5 + 0.5;
            transformed.y -= transformed.y * transformed.y * 0.3;
            transformed.z *= 0.8;
            transformed += normal * (pulse * 0.15);
            `
          );
        }}
      />
    </mesh>
  );
};

const ProceduralBrain = ({ isHovered }) => {
  const meshRef = useRef();
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);
  
  useFrame((state, delta) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * (isHovered ? 1.0 : 0.2);
      const targetScale = isHovered ? 1.2 : 1.0;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  return (
    <mesh ref={meshRef} castShadow scale={[1.1, 0.9, 1.2]}>
      <sphereGeometry args={[1, 128, 128]} />
      <meshPhysicalMaterial
        color="#8b5cf6"
        emissive="#2c0066"
        emissiveIntensity={0.8}
        roughness={0.3}
        metalness={0.4}
        onBeforeCompile={(shader) => {
          shader.uniforms.uTime = uniforms.uTime;
          shader.vertexShader = `
            uniform float uTime;
            ${shader.vertexShader}
          `.replace(
            `#include <begin_vertex>`,
            `
            #include <begin_vertex>
            // Fake brain folds using high-frequency sine waves
            float noise = sin(position.x * 20.0) * cos(position.y * 20.0) * sin(position.z * 20.0);
            float pulse = sin(uTime * 2.0) * 0.05;
            transformed += normal * (noise * 0.08 + pulse);
            `
          );
        }}
      />
    </mesh>
  );
};

const ProceduralLungs = ({ isHovered }) => {
  const groupRef = useRef();
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * (isHovered ? 1.0 : 0.2);
      const targetScale = isHovered ? 1.2 : 1.0;
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
      
      // Breathing animation
      const breath = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 1;
      groupRef.current.children[0].scale.set(breath, breath, breath);
      groupRef.current.children[1].scale.set(breath, breath, breath);
    }
  });

  const lungMat = <meshPhysicalMaterial color="#0ea5e9" emissive="#003366" emissiveIntensity={0.4} roughness={0.2} transmission={0.5} thickness={1} />;

  return (
    <group ref={groupRef}>
      <mesh position={[-0.6, 0, 0]} scale={[0.6, 1.2, 0.6]}>
        <sphereGeometry args={[1, 32, 32]} />
        {lungMat}
      </mesh>
      <mesh position={[0.6, 0, 0]} scale={[0.6, 1.2, 0.6]}>
        <sphereGeometry args={[1, 32, 32]} />
        {lungMat}
      </mesh>
      {/* Trachea */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.8, 16]} />
        <meshStandardMaterial color="#38bdf8" />
      </mesh>
    </group>
  );
};

const ProceduralSkeleton = ({ isHovered }) => {
  const groupRef = useRef();
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * (isHovered ? 1.0 : 0.2);
      const targetScale = isHovered ? 1.2 : 1.0;
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  const boneMat = <meshStandardMaterial color="#fef08a" roughness={0.6} />;

  return (
    <group ref={groupRef} scale={0.8}>
      {/* Spine */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 2, 16]} />
        {boneMat}
      </mesh>
      {/* Pelvis placeholder */}
      <mesh position={[0, -1, 0]} rotation={[Math.PI/2, 0, 0]}>
        <torusGeometry args={[0.5, 0.15, 16, 32]} />
        {boneMat}
      </mesh>
      {/* Ribs */}
      {[0.2, 0.5, 0.8].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} rotation={[Math.PI/2, 0, 0]}>
          <torusGeometry args={[0.6 + i*0.1, 0.08, 16, 32, Math.PI]} />
          {boneMat}
        </mesh>
      ))}
    </group>
  );
};

const ProceduralTooth = ({ isHovered }) => {
  const meshRef = useRef();
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * (isHovered ? 1.0 : 0.2);
      const targetScale = isHovered ? 1.2 : 1.0;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  return (
    <group ref={meshRef}>
      {/* Crown */}
      <mesh position={[0, 0.5, 0]} scale={[1, 0.8, 1]}>
        <boxGeometry args={[1, 1, 1, 8, 8, 8]} />
        <meshPhysicalMaterial color="#ffffff" emissive="#10b981" emissiveIntensity={0.1} roughness={0.1} clearcoat={1.0} />
      </mesh>
      {/* Roots */}
      <mesh position={[-0.25, -0.5, 0]} rotation={[0, 0, 0.2]}>
        <cylinderGeometry args={[0.3, 0.1, 1, 16]} />
        <meshPhysicalMaterial color="#e2e8f0" roughness={0.3} />
      </mesh>
      <mesh position={[0.25, -0.5, 0]} rotation={[0, 0, -0.2]}>
        <cylinderGeometry args={[0.3, 0.1, 1, 16]} />
        <meshPhysicalMaterial color="#e2e8f0" roughness={0.3} />
      </mesh>
    </group>
  );
};

const ProceduralMRI = ({ isHovered }) => {
  const groupRef = useRef();
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * (isHovered ? 1.0 : 0.2);
      const targetScale = isHovered ? 1.2 : 1.0;
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
      
      // Animate bed
      const bed = groupRef.current.children[2];
      if (bed) {
        bed.position.z = Math.sin(state.clock.elapsedTime) * 0.5;
      }
    }
  });

  return (
    <group ref={groupRef} rotation={[0, Math.PI/4, 0]}>
      {/* Main Tube */}
      <mesh rotation={[Math.PI/2, 0, 0]}>
        <cylinderGeometry args={[1.2, 1.2, 1.5, 32, 1, true]} />
        <meshPhysicalMaterial color="#f8fafc" roughness={0.2} metalness={0.1} side={THREE.DoubleSide} />
      </mesh>
      {/* Inner Glow */}
      <mesh rotation={[Math.PI/2, 0, 0]}>
        <cylinderGeometry args={[1.0, 1.0, 1.4, 32, 1, true]} />
        <meshBasicMaterial color="#6366f1" transparent opacity={0.5} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
      </mesh>
      {/* Bed */}
      <mesh position={[0, -0.2, 0]}>
        <boxGeometry args={[0.8, 0.1, 2.5]} />
        <meshStandardMaterial color="#cbd5e1" />
      </mesh>
    </group>
  );
};

const ProceduralIncubator = ({ isHovered }) => {
  const groupRef = useRef();
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * (isHovered ? 1.0 : 0.2);
      const targetScale = isHovered ? 1.2 : 1.0;
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Base */}
      <mesh position={[0, -0.6, 0]}>
        <boxGeometry args={[1.5, 0.8, 1]} />
        <meshStandardMaterial color="#f1f5f9" />
      </mesh>
      {/* Glass Hood */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.7, 0.75, 1.2, 32, 1, false, 0, Math.PI]} />
        <meshPhysicalMaterial color="#60a5fa" transmission={0.9} opacity={1} transparent roughness={0} thickness={0.1} />
      </mesh>
      {/* Inside Glow/Warmth */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial color="#f59e0b" transparent opacity={0.6} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
};

const ProceduralSkin = ({ isHovered }) => {
  const groupRef = useRef();
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * (isHovered ? 1.0 : 0.2);
      groupRef.current.rotation.x = Math.PI / 6;
      const targetScale = isHovered ? 1.2 : 1.0;
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Epidermis */}
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[1.5, 0.2, 1.5]} />
        <meshStandardMaterial color="#fcd34d" roughness={0.6} />
      </mesh>
      {/* Dermis */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[1.5, 0.6, 1.5]} />
        <meshStandardMaterial color="#fca5a5" roughness={0.8} />
      </mesh>
      {/* Subcutaneous */}
      <mesh position={[0, -0.4, 0]}>
        <boxGeometry args={[1.5, 0.6, 1.5]} />
        <meshStandardMaterial color="#fde047" roughness={0.9} />
      </mesh>
      {/* Hair follicle */}
      <mesh position={[0.2, 0.4, 0.2]} rotation={[0, 0, -0.2]}>
        <cylinderGeometry args={[0.02, 0.05, 1.5, 8]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
    </group>
  );
};

const ProceduralGynecology = ({ isHovered }) => {
  const groupRef = useRef();
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * (isHovered ? 1.0 : 0.2);
      const targetScale = isHovered ? 1.2 : 1.0;
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
      
      // Gentle pulsing
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.05 + 1;
      groupRef.current.scale.multiplyScalar(pulse);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Abstract elegant form */}
      <mesh position={[0, 0, 0]}>
        <torusKnotGeometry args={[0.6, 0.2, 100, 16]} />
        <meshPhysicalMaterial 
          color="#ec4899" 
          emissive="#500020"
          emissiveIntensity={0.3}
          roughness={0.1} 
          metalness={0.2}
          clearcoat={1.0}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshBasicMaterial color="#fbcfe8" transparent opacity={0.8} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
};


const ProceduralOncology = ({ isHovered }) => {
  const groupRef = useRef();
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * (isHovered ? 1.0 : 0.2);
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.2;
      const targetScale = isHovered ? 1.2 : 1.0;
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Abstract stylized atom/cell */}
      <mesh>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshPhysicalMaterial color="#3b82f6" emissive="#1d4ed8" emissiveIntensity={0.5} roughness={0.1} />
      </mesh>
      {[0, 1, 2].map((i) => (
        <mesh key={i} rotation={[Math.PI / 2, (Math.PI / 3) * i, 0]}>
          <torusGeometry args={[0.8, 0.05, 16, 64]} />
          <meshBasicMaterial color="#60a5fa" transparent opacity={0.5} blending={THREE.AdditiveBlending} />
        </mesh>
      ))}
    </group>
  );
};


// --- Main Component ---

export const departmentsData = [
  { id: 'cardiology', name: 'Cardiology', desc: 'Advanced heart care', icon: Heart, color: '#f43f5e', Model: ProceduralHeart },
  { id: 'neurology', name: 'Neurology', desc: 'Brain & nerve specialist', icon: Brain, color: '#8b5cf6', Model: ProceduralBrain },
  { id: 'orthopedics', name: 'Orthopedics', desc: 'Bone & joint care', icon: Bone, color: '#eab308', Model: ProceduralSkeleton },
  { id: 'pulmonology', name: 'Pulmonology', desc: 'Lungs & respiratory', icon: Activity, color: '#0ea5e9', Model: ProceduralLungs },
  { id: 'dental-care', name: 'Dental Care', desc: 'Advanced dentistry', icon: Stethoscope, color: '#10b981', Model: ProceduralTooth },
  { id: 'radiology', name: 'Radiology', desc: 'MRI & CT Scans', icon: Activity, color: '#6366f1', Model: ProceduralMRI },
  { id: 'pediatrics', name: 'Pediatrics', desc: 'Child healthcare', icon: Baby, color: '#f59e0b', Model: ProceduralIncubator },
  { id: 'oncology', name: 'Oncology', desc: 'Cancer care & treatment', icon: Activity, color: '#3b82f6', Model: ProceduralOncology },
  { id: 'dermatology', name: 'Dermatology', desc: 'Skin specialist', icon: Smile, color: '#ec4899', Model: ProceduralSkin },
  { id: 'gynecology', name: 'Gynecology', desc: 'Women\'s health', icon: Activity, color: '#ec4899', Model: ProceduralGynecology },
];

import { useNavigate } from 'react-router-dom';

const Departments = () => {
  return (
    <section className="py-32 bg-slate-950 relative" id="departments">
      {/* Subtle background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-medical-emerald/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-medical-blue/10 rounded-full blur-[150px]"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-20 text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight text-white">Specialized Departments</h2>
          <p className="text-white/60 max-w-2xl mx-auto text-xl font-light">
            Our centers of excellence provide world-class medical care with the latest technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {departmentsData.map((dept, idx) => (
            <DepartmentCard key={dept.id} dept={dept} idx={idx} />
          ))}
        </div>
      </div>
    </section>
  );
};

export const DepartmentCard = ({ dept, idx }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);
  const navigate = useNavigate();
  const Icon = dept.icon;
  const Model = dept.Model;

  useEffect(() => {
    if (!cardRef.current) return;
    const el = cardRef.current;

    // GSAP Hover Animations
    const hoverTl = gsap.timeline({ paused: true });
    hoverTl.to(el, {
      y: -10,
      scale: 1.02,
      boxShadow: `0 25px 50px -12px ${dept.color}33, 0 0 0 1px ${dept.color}66`,
      duration: 0.4,
      ease: "power2.out"
    });

    const onEnter = () => {
      setIsHovered(true);
      hoverTl.play();
    };
    const onLeave = () => {
      setIsHovered(false);
      hoverTl.reverse();
    };

    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);

    return () => {
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [dept.color]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay: (idx % 3) * 0.15, ease: "easeOut" }}
      className="h-full"
    >
      <div 
        ref={cardRef}
        onClick={() => navigate(`/departments/${dept.id}`)}
        className="h-full bg-white/5 backdrop-blur-xl rounded-3xl p-2 relative overflow-hidden group border border-white/10 shadow-lg cursor-pointer flex flex-col"
      >
        {/* Animated Background Gradient on Hover */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{ background: `radial-gradient(circle at top right, ${dept.color}15, transparent 70%)` }}
        />
        
        {/* 3D Canvas Container */}
        <div className="h-56 w-full relative z-10 bg-black/40 rounded-2xl overflow-hidden mb-6 shadow-inner">
          <Canvas camera={{ position: [0, 0, 5], fov: 45 }} shadows dpr={[1, 2]}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 5, 5]} intensity={1.5} castShadow shadow-bias={-0.0001} />
            <spotLight position={[-5, 5, 0]} intensity={2} color={dept.color} penumbra={1} />
            <Environment preset="studio" />
            
            <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
              <Model isHovered={isHovered} />
            </Float>

            <EffectComposer disableNormalPass>
              <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.9} intensity={1.2} mipmapBlur />
            </EffectComposer>
          </Canvas>
          
          <div className="absolute top-4 left-4 w-12 h-12 rounded-full bg-slate-900/80 backdrop-blur-md flex items-center justify-center border border-white/10 shadow-xl z-20">
            <Icon size={24} color={dept.color} />
          </div>
        </div>

        <div className="px-5 pb-6 relative z-10 flex-grow flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-transparent group-hover:bg-clip-text transition-colors duration-300" style={{ backgroundImage: `linear-gradient(to right, #fff, ${dept.color})` }}>
              {dept.name}
            </h3>
            <p className="text-white/70 text-base leading-relaxed">{dept.desc}</p>
          </div>
          
          <div 
            className="mt-6 flex items-center text-sm font-semibold opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
            style={{ color: dept.color }}
          >
            Explore Department <span className="ml-2">&rarr;</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Departments;
