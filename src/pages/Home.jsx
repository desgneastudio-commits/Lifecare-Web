import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import HeroScene from '../components/3d/HeroScene';
import Departments from '../components/Departments';
import AnatomyExplorer from '../components/AnatomyExplorer';
import { ArrowRight, Calendar, HeartPulse } from 'lucide-react';

const PreLoader = ({ onComplete }) => {
  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: onComplete
    });

    tl.to(".loader-text", {
      opacity: 1,
      y: 0,
      duration: 1.5,
      stagger: 0.2,
      ease: "power3.out"
    })
    .to(".loader-container", {
      opacity: 0,
      duration: 1.2,
      ease: "power2.inOut",
      delay: 0.8
    });
  }, [onComplete]);

  return (
    <div className="loader-container fixed inset-0 z-[100] bg-[#020813] flex flex-col items-center justify-center text-white">
      <div className="flex gap-4 text-3xl font-light tracking-[0.3em] uppercase overflow-hidden">
        {['L','I','F','E','C','A','R','E'].map((char, i) => (
          <span key={i} className="loader-text opacity-0 translate-y-8 font-serif">{char}</span>
        ))}
      </div>
      <div className="loader-text opacity-0 mt-8 h-[1px] w-24 bg-medical-emerald/50"></div>
    </div>
  );
};

const Home = () => {
  const [loading, setLoading] = useState(true);
  const heroRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (!loading) {
      const tl = gsap.timeline();
      
      // Fade in the 3D Scene smoothly and slowly
      tl.fromTo(heroRef.current, 
        { opacity: 0 }, 
        { opacity: 1, duration: 3, ease: "power2.inOut" }
      )
      
      // Reveal text elements sequentially with a slow, refined upward drift
      const elements = contentRef.current.children;
      tl.fromTo(elements,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.5, stagger: 0.3, ease: "power3.out" },
        "-=2"
      );
    }
  }, [loading]);

  return (
    <main className="w-full min-h-screen bg-[#020813]">
      <style>
        {`
          /* Shift the 3D canvas to the right side on desktop for the spacious composition */
          @media (min-width: 1024px) {
            .hero-3d-wrapper canvas {
              transform: translateX(20%);
            }
          }
          .font-serif {
            font-family: 'Playfair Display', Georgia, serif;
          }
        `}
      </style>

      {loading && <PreLoader onComplete={() => setLoading(false)} />}
      
      {/* 3D Background / Right Side Heart */}
      <div ref={heroRef} className="hero-3d-wrapper opacity-0 fixed inset-0 pointer-events-none z-0">
        {!loading && <HeroScene />}
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-24 px-6 md:px-16 lg:px-24 container mx-auto z-10">
        <div ref={contentRef} className="max-w-2xl w-full">
          
          <div className="inline-block mb-8 border-b border-medical-emerald pb-2">
            <span className="text-medical-emerald uppercase tracking-[0.2em] text-sm font-medium">LifeCare Medical Institute</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-serif font-light leading-[1.1] mb-10 tracking-tight text-white">
            Healing Through <br/>
            <span className="italic text-medical-emerald/90">Medical Excellence</span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/70 mb-14 max-w-lg font-light leading-relaxed tracking-wide">
            Experience world-class healthcare driven by profound expertise, compassionate care, and advanced medical innovation.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 mb-16">
            <button className="bg-medical-emerald hover:bg-teal-500 text-white px-10 py-5 rounded-sm text-sm uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-3 group">
              <Calendar size={16} /> Book Appointment
            </button>
            <button className="bg-transparent border border-white/20 hover:border-white/60 hover:bg-white/5 text-white px-10 py-5 rounded-sm text-sm uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-3 group">
              Explore Services <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          {/* Subtle animated ECG line beneath content */}
          <div className="w-full max-w-md h-12 relative opacity-60">
            <svg viewBox="0 0 400 50" className="w-full h-full stroke-medical-emerald stroke-[1.5] fill-none">
              <motion.path 
                d="M 0 25 L 100 25 L 115 10 L 130 45 L 145 5 L 160 40 L 175 25 L 400 25" 
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </svg>
          </div>

        </div>
      </section>

      {/* Increased Whitespace & Refined Typography for remaining sections */}
      <div className="relative z-10 bg-[#020813]">
        
        {/* Minimal Stats Section */}
        <section className="py-32 border-t border-white/5">
          <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {[
              { label: "Patients Annually", value: "250K" },
              { label: "Medical Specialists", value: "500+" },
              { label: "Global Accolades", value: "120" },
              { label: "Advanced Facilities", value: "45" }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center justify-center gap-4">
                <div className="text-5xl md:text-7xl font-serif font-light text-white tracking-tighter">{stat.value}</div>
                <div className="text-xs text-white/50 uppercase tracking-[0.2em]">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>
        
        <div className="py-20">
          <Departments />
        </div>
        
        <div className="py-20">
          <AnatomyExplorer />
        </div>

      </div>
    </main>
  );
};

export default Home;
