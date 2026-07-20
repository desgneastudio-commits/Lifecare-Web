import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Departments', path: '/departments' },
    { name: 'Doctors', path: '/doctors' },
    { name: 'Virtual Tour', path: '/tour' },
    { name: 'Patient Portal', path: '/dashboard' },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-medical-blue/80 backdrop-blur-md py-4 shadow-lg border-b border-white/10' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <Activity className="text-medical-emerald w-8 h-8 group-hover:scale-110 transition-transform" />
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-medical-emerald/80">
            LifeCare
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.name} to={link.path} className="text-sm font-medium text-white/80 hover:text-medical-emerald transition-colors relative group">
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-medical-emerald transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
          <button className="bg-medical-emerald/10 hover:bg-medical-emerald/20 border border-medical-emerald text-medical-emerald px-6 py-2 rounded-full font-medium transition-all hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            Book Appointment
          </button>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-medical-blue/95 backdrop-blur-xl border-b border-white/10 py-4 px-6 md:hidden flex flex-col gap-4"
          >
            {navLinks.map((link) => (
              <Link key={link.name} to={link.path} onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-white/80 hover:text-medical-emerald">
                {link.name}
              </Link>
            ))}
            <button className="w-full bg-medical-emerald text-white px-6 py-3 rounded-lg font-medium mt-4">
              Book Appointment
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
