import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ReactLenis } from '@studio-freight/react-lenis';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Doctors from './pages/Doctors';
import VirtualTour from './pages/VirtualTour';
import DepartmentsPage from './pages/DepartmentsPage';
import DepartmentDetails from './pages/DepartmentDetails';

function App() {
  return (
    <ReactLenis root>
      <Router>
        <div className="min-h-screen font-sans selection:bg-medical-emerald selection:text-white">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/tour" element={<VirtualTour />} />
            <Route path="/departments" element={<DepartmentsPage />} />
            <Route path="/departments/:departmentName" element={<DepartmentDetails />} />
            {/* Fallback route */}
            <Route path="*" element={<Home />} />
          </Routes>
        </div>
      </Router>
    </ReactLenis>
  );
}

export default App;
