import React from 'react';

const Doctors = () => {
  const doctors = [
    { name: 'Dr. Sarah Chen', spec: 'Neurology', exp: '15+ Years', img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80' },
    { name: 'Dr. James Wilson', spec: 'Cardiology', exp: '20+ Years', img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80' },
    { name: 'Dr. Emily Stone', spec: 'Pediatrics', exp: '12+ Years', img: 'https://images.unsplash.com/photo-1594824436998-05f923c0137a?w=400&q=80' },
    { name: 'Dr. Mark Johnson', spec: 'Orthopedics', exp: '18+ Years', img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&q=80' }
  ];

  return (
    <div className="pt-24 pb-12 min-h-screen bg-slate-950 px-6 container mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Specialists</h1>
        <p className="text-white/60 max-w-2xl mx-auto">World-renowned experts dedicated to providing exceptional care.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {doctors.map((doc, i) => (
          <div key={i} className="glass-panel rounded-2xl overflow-hidden group">
            <div className="h-64 overflow-hidden relative">
              <div className="absolute inset-0 bg-medical-blue/20 group-hover:bg-transparent transition-colors z-10"></div>
              <img src={doc.img} alt={doc.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-1">{doc.name}</h3>
              <p className="text-medical-emerald text-sm font-medium mb-3">{doc.spec}</p>
              <div className="flex justify-between items-center border-t border-white/10 pt-4 mt-4 text-sm">
                <span className="text-white/60">Experience</span>
                <span className="font-medium text-white">{doc.exp}</span>
              </div>
              <button className="w-full mt-4 border border-white/20 hover:border-medical-emerald hover:bg-medical-emerald text-white py-2 rounded-lg transition-all">
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Doctors;
