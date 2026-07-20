import React, { Suspense, useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Ring, Points, PointMaterial } from '@react-three/drei';
import { EffectComposer, Bloom, DepthOfField, Vignette, ToneMapping } from '@react-three/postprocessing';
import * as THREE from 'three';

// --- Procedural Anatomical Heart ---
// We assemble multiple shapes to mimic anatomical structures (ventricles, aorta, etc.)
// and apply a unified organic shader for a seamless, realistic fleshy appearance.

const HeartMaterial = () => {
  const customUniforms = useMemo(() => ({ 
    uTime: { value: 0 },
    uColorA: { value: new THREE.Color("#6b0f1a") }, // Deep blood red
    uColorB: { value: new THREE.Color("#b31b2c") }, // Bright arterial red
    uVeinColor: { value: new THREE.Color("#1a0508") }
  }), []);
  
  useFrame((state) => {
    customUniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <meshPhysicalMaterial
      color="#8c1222"
      emissive="#2a0000"
      emissiveIntensity={0.2}
      roughness={0.25}
      metalness={0.1}
      clearcoat={1.0}
      clearcoatRoughness={0.15}
      transmission={0.4} // Subsurface scattering feel
      thickness={2.0}
      onBeforeCompile={(shader) => {
        shader.uniforms.uTime = customUniforms.uTime;
        shader.uniforms.uColorA = customUniforms.uColorA;
        shader.uniforms.uColorB = customUniforms.uColorB;
        shader.uniforms.uVeinColor = customUniforms.uVeinColor;
        
        shader.vertexShader = `
          uniform float uTime;
          varying vec3 vPos;
          varying vec3 vNormal;
          
          // 3D Noise for procedural displacement
          vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
          vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
          vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
          vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
          float snoise(vec3 v) {
            const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
            const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
            vec3 i  = floor(v + dot(v, C.yyy) );
            vec3 x0 = v - i + dot(i, C.xxx) ;
            vec3 g = step(x0.yzx, x0.xyz);
            vec3 l = 1.0 - g;
            vec3 i1 = min( g.xyz, l.zxy );
            vec3 i2 = max( g.xyz, l.zxy );
            vec3 x1 = x0 - i1 + C.xxx;
            vec3 x2 = x0 - i2 + C.yyy;
            vec3 x3 = x0 - D.yyy;
            i = mod289(i);
            vec4 p = permute( permute( permute(
                       i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                     + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
                     + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
            float n_ = 0.142857142857;
            vec3  ns = n_ * D.wyz - D.xzx;
            vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
            vec4 x_ = floor(j * ns.z);
            vec4 y_ = floor(j - 7.0 * x_ );
            vec4 x = x_ *ns.x + ns.yyyy;
            vec4 y = y_ *ns.x + ns.yyyy;
            vec4 h = 1.0 - abs(x) - abs(y);
            vec4 b0 = vec4( x.xy, y.xy );
            vec4 b1 = vec4( x.zw, y.zw );
            vec4 s0 = floor(b0)*2.0 + 1.0;
            vec4 s1 = floor(b1)*2.0 + 1.0;
            vec4 sh = -step(h, vec4(0.0));
            vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
            vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
            vec3 p0 = vec3(a0.xy,h.x);
            vec3 p1 = vec3(a0.zw,h.y);
            vec3 p2 = vec3(a1.xy,h.z);
            vec3 p3 = vec3(a1.zw,h.w);
            vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
            p0 *= norm.x;
            p1 *= norm.y;
            p2 *= norm.z;
            p3 *= norm.w;
            vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
            m = m * m;
            return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
          }
          
          ${shader.vertexShader}
        `.replace(
          `#include <begin_vertex>`,
          `
          #include <begin_vertex>
          
          // Realistic "Lub-Dub" Heartbeat Rhythm
          // 60-70 bpm = ~1.1 beats per second
          float t = uTime * 1.1;
          float beat = fract(t);
          
          // First beat (Lub)
          float lub = exp(-15.0 * beat) * sin(beat * 3.1415 * 2.0);
          // Second beat (Dub) - slightly weaker, delayed
          float dubTime = max(0.0, beat - 0.35);
          float dub = exp(-20.0 * dubTime) * sin(dubTime * 3.1415 * 2.0) * 0.6;
          
          float totalPulse = max(lub, 0.0) + max(dub, 0.0);
          
          // Subtle organic displacement to make spheres look fleshy and veiny
          float noise = snoise(position * 4.0 + uTime * 0.5) * 0.05;
          float fineNoise = snoise(position * 15.0) * 0.01;
          
          transformed += normal * (noise + fineNoise + (totalPulse * 0.08));
          
          vPos = position;
          vNormal = normal;
          `
        );
        
        shader.fragmentShader = `
          uniform float uTime;
          uniform vec3 uColorA;
          uniform vec3 uColorB;
          uniform vec3 uVeinColor;
          varying vec3 vPos;
          varying vec3 vNormal;
          
          // Re-declare noise function for fragments
          vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
          vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
          vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
          vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
          float snoise(vec3 v) {
            const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
            const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
            vec3 i  = floor(v + dot(v, C.yyy) );
            vec3 x0 = v - i + dot(i, C.xxx) ;
            vec3 g = step(x0.yzx, x0.xyz);
            vec3 l = 1.0 - g;
            vec3 i1 = min( g.xyz, l.zxy );
            vec3 i2 = max( g.xyz, l.zxy );
            vec3 x1 = x0 - i1 + C.xxx;
            vec3 x2 = x0 - i2 + C.yyy;
            vec3 x3 = x0 - D.yyy;
            i = mod289(i);
            vec4 p = permute( permute( permute(
                       i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                     + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
                     + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
            float n_ = 0.142857142857;
            vec3  ns = n_ * D.wyz - D.xzx;
            vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
            vec4 x_ = floor(j * ns.z);
            vec4 y_ = floor(j - 7.0 * x_ );
            vec4 x = x_ *ns.x + ns.yyyy;
            vec4 y = y_ *ns.x + ns.yyyy;
            vec4 h = 1.0 - abs(x) - abs(y);
            vec4 b0 = vec4( x.xy, y.xy );
            vec4 b1 = vec4( x.zw, y.zw );
            vec4 s0 = floor(b0)*2.0 + 1.0;
            vec4 s1 = floor(b1)*2.0 + 1.0;
            vec4 sh = -step(h, vec4(0.0));
            vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
            vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
            vec3 p0 = vec3(a0.xy,h.x);
            vec3 p1 = vec3(a0.zw,h.y);
            vec3 p2 = vec3(a1.xy,h.z);
            vec3 p3 = vec3(a1.zw,h.w);
            vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
            p0 *= norm.x;
            p1 *= norm.y;
            p2 *= norm.z;
            p3 *= norm.w;
            vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
            m = m * m;
            return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
          }
          
          ${shader.fragmentShader}
        `.replace(
          `#include <color_fragment>`,
          `
          #include <color_fragment>
          
          // Generate vein patterns using noise
          float veinNoise = snoise(vPos * 8.0);
          float isVein = smoothstep(0.4, 0.5, abs(veinNoise));
          
          // Mix base colors
          vec3 baseColor = mix(uColorA, uColorB, snoise(vPos * 2.0) * 0.5 + 0.5);
          
          // Apply dark veins
          diffuseColor.rgb = mix(baseColor, uVeinColor, isVein * 0.6);
          `
        );
      }}
    />
  );
};

// Procedural curved tube for Aorta and Arteries
const CurvedTube = ({ path, radius, ...props }) => {
  const curve = useMemo(() => new THREE.CatmullRomCurve3(path.map(p => new THREE.Vector3(...p))), [path]);
  return (
    <mesh {...props} castShadow receiveShadow>
      <tubeGeometry args={[curve, 32, radius, 16, false]} />
      <HeartMaterial />
    </mesh>
  );
};

const AnatomicalHeart = () => {
  const groupRef = useRef();
  
  useFrame((state) => {
    if (groupRef.current) {
      // Very slow, natural idle rotation
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.08;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.05;
    }
  });

  return (
    <group ref={groupRef} scale={[1.2, 1.2, 1.2]}>
      {/* Left Ventricle (Main Body) */}
      <mesh position={[0, -0.2, 0.2]} rotation={[0, 0, 0.2]} castShadow receiveShadow>
        <sphereGeometry args={[0.8, 64, 64]} />
        <HeartMaterial />
      </mesh>
      
      {/* Right Ventricle */}
      <mesh position={[0.6, -0.1, -0.1]} scale={[0.8, 0.9, 0.7]} rotation={[0, 0, -0.3]} castShadow receiveShadow>
        <sphereGeometry args={[0.7, 64, 64]} />
        <HeartMaterial />
      </mesh>

      {/* Left Atrium */}
      <mesh position={[-0.4, 0.6, 0.3]} scale={[0.6, 0.5, 0.6]} castShadow receiveShadow>
        <sphereGeometry args={[0.6, 64, 64]} />
        <HeartMaterial />
      </mesh>

      {/* Right Atrium */}
      <mesh position={[0.7, 0.7, -0.2]} scale={[0.5, 0.6, 0.5]} castShadow receiveShadow>
        <sphereGeometry args={[0.6, 64, 64]} />
        <HeartMaterial />
      </mesh>

      {/* Aorta Arch */}
      <CurvedTube 
        radius={0.25}
        path={[
          [0, 0.5, 0],
          [-0.1, 1.0, 0.1],
          [-0.3, 1.4, -0.1],
          [-0.4, 1.2, -0.5],
          [-0.4, 0.8, -0.7]
        ]} 
      />

      {/* Pulmonary Artery */}
      <CurvedTube 
        radius={0.2}
        path={[
          [0.3, 0.4, 0.2],
          [0.4, 0.9, 0.4],
          [0.8, 1.2, 0.2],
          [1.0, 1.0, -0.2]
        ]} 
      />
      
      {/* Superior Vena Cava */}
      <CurvedTube 
        radius={0.22}
        path={[
          [0.8, 0.6, -0.4],
          [0.9, 1.1, -0.5],
          [0.9, 1.5, -0.5]
        ]} 
      />
    </group>
  );
};


// --- Environment Enhancements ---

const HolographicRings = () => {
  const groupRef = useRef();
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = state.clock.elapsedTime * 0.1;
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, (Math.PI / 3) * i]}>
          <ringGeometry args={[3.0 + i * 0.1, 3.02 + i * 0.1, 128]} />
          <meshBasicMaterial color="#10B981" transparent opacity={0.15} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
        </mesh>
      ))}
    </group>
  );
};

const MinimalECG = () => {
  const pointsRef = useRef();
  
  const particles = useMemo(() => {
    const pts = [];
    for (let i = 0; i < 150; i++) {
      const x = (i - 75) * 0.05;
      let y = 0;
      if (i > 65 && i < 85) {
        if (i === 70) y = -0.5;
        if (i === 75) y = 1.5;
        if (i === 80) y = -0.2;
      }
      pts.push(new THREE.Vector3(x, y, 0));
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.position.x = (state.clock.elapsedTime * 1.5) % 4 - 2;
      pointsRef.current.material.opacity = Math.max(0, 1 - Math.abs(pointsRef.current.position.x) / 2.0) * 0.5;
    }
  });

  return (
    <group position={[0, -2.5, 2]}>
      <points ref={pointsRef} geometry={particles}>
        <pointsMaterial size={0.03} color="#10B981" transparent opacity={0.5} blending={THREE.AdditiveBlending} />
      </points>
    </group>
  );
};

const AmbientDust = () => {
  const pointsRef = useRef();
  const sphere = useMemo(() => {
    const pts = new Float32Array(500 * 3);
    for (let i = 0; i < 500; i++) {
      pts[i * 3] = (Math.random() - 0.5) * 15;
      pts[i * 3 + 1] = (Math.random() - 0.5) * 15;
      pts[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5;
    }
    return pts;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.1;
    }
  });

  return (
    <Points ref={pointsRef} positions={sphere} stride={3}>
      <PointMaterial transparent color="#ffffff" size={0.02} sizeAttenuation={true} depthWrite={false} opacity={0.3} />
    </Points>
  );
};

// --- Controller & Scene ---

const SceneController = () => {
  const groupRef = useRef();
  const targetRotation = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Subtle reaction, mapping mouse to a tiny rotation range
      targetRotation.current.x = ((e.clientY / window.innerHeight) * 2 - 1) * 0.15;
      targetRotation.current.y = ((e.clientX / window.innerWidth) * 2 - 1) * 0.15;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame(() => {
    if (groupRef.current) {
      // Smooth interpolation
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotation.current.x, 0.05);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotation.current.y, 0.05);
    }
  });

  return (
    <group ref={groupRef}>
      <AnatomicalHeart />
      <HolographicRings />
      <MinimalECG />
      <AmbientDust />
    </group>
  );
};

const HeroScene = () => {
  return (
    <div className="w-full h-screen absolute top-0 left-0 -z-10 bg-[#020813] pointer-events-none">
      <Canvas shadows camera={{ position: [0, 0, 9], fov: 40 }} dpr={[1, 2]}>
        
        {/* Cinematic Lighting Setup */}
        <ambientLight intensity={0.1} color="#0a192f" />
        
        {/* Key Light (Medical cool white/blue) */}
        <spotLight 
          position={[5, 8, 5]} 
          angle={0.4} 
          penumbra={1} 
          intensity={3} 
          color="#e0f2fe" 
          castShadow 
          shadow-bias={-0.0001}
          shadow-mapSize={1024}
        />
        
        {/* Fill Light (Dark blue for dramatic shadows) */}
        <directionalLight position={[-5, 3, 0]} intensity={1} color="#0284c7" />
        
        {/* Rim / Volumetric-style Backlight (Emerald green) */}
        <spotLight position={[0, -5, -8]} angle={0.6} penumbra={0.8} intensity={4} color="#10b981" />

        {/* Studio HDRI for realistic PBR reflections */}
        <Environment preset="studio" environmentIntensity={0.2} />

        <Suspense fallback={null}>
          <SceneController />
        </Suspense>

        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          enableRotate={false} 
        />

        {/* Premium Post Processing */}
        <EffectComposer disableNormalPass>
          <Bloom 
            luminanceThreshold={0.4} 
            luminanceSmoothing={0.9} 
            intensity={0.8} 
            mipmapBlur 
          />
          <DepthOfField focusDistance={0} focalLength={0.03} bokehScale={3} height={480} />
          <Vignette eskil={false} offset={0.2} darkness={1.3} />
          <ToneMapping adaptive={true} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default HeroScene;
