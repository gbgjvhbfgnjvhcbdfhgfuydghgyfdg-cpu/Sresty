import React, { useEffect } from 'react';
import { BookOpen, Search, ArrowLeft } from 'lucide-react';

export default function StealthModal({ isActive, onClose }) {
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || (e.altKey && e.key.toLowerCase() === 'q')) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, onClose]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#ffffff] text-[#202124] overflow-y-auto font-sans p-6 sm:p-12 animate-in fade-in duration-100">
      <div className="max-w-4xl mx-auto">
        {/* Stealth Top Header disguised as academic search / encyclopedic portal */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-8">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <span className="text-xl font-bold tracking-tight text-gray-800">
              Academic Reference Archive
            </span>
          </div>

          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium text-gray-500 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 transition-colors"
            title="Return to Arcade (Esc)"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return</span>
          </button>
        </div>

        {/* Realistic encyclopedic article */}
        <article className="prose prose-slate max-w-none text-gray-700 leading-relaxed space-y-5">
          <h1 className="text-3xl font-extrabold text-gray-900 border-b pb-2">
            Astrophysics & Solar Dynamics
          </h1>
          <p className="text-sm text-gray-500 italic">
            Curated Study Notes · Reference Module 4B
          </p>

          <p>
            The solar wind is a stream of charged particles released from the upper atmosphere of the Sun, called the corona. This plasma consists mostly of electrons, protons and alpha particles with kinetic energies between 0.5 and 10 keV. Embedded within the solar wind plasma is the interplanetary magnetic field.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-6">
            Orbital Mechanics and Resonance
          </h2>
          <p>
            In celestial mechanics, an orbital resonance occurs when orbiting bodies exert regular, periodic gravitational influence on each other, usually because their orbital periods are related by a ratio of small integers. Most commonly, this relationship is found between a pair of objects.
          </p>

          <div className="bg-gray-50 border-l-4 border-blue-500 p-4 rounded my-4">
            <p className="text-xs text-gray-600">
              <strong>Key Equation:</strong> Kepler's Third Law states that the square of the orbital period of a planet is directly proportional to the cube of the semi-major axis of its orbit: <em>T² ∝ a³</em>.
            </p>
          </div>

          <h3 className="text-lg font-semibold text-gray-800">
            Magnetic Reconnection Phenomena
          </h3>
          <p>
            Magnetic reconnection is a physical process occurring in highly conducting plasmas in which the magnetic topology is rearranged and magnetic energy is converted into kinetic energy, thermal energy, and particle acceleration.
          </p>
        </article>

        <div className="mt-12 pt-6 border-t border-gray-200 text-xs text-gray-400 flex justify-between">
          <span>Database ID: REF-40912-AST</span>
          <button onClick={onClose} className="hover:underline text-blue-600">
            Exit Disguise Mode (or press Esc)
          </button>
        </div>
      </div>
    </div>
  );
}
