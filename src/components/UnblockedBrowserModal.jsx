import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Search,
  RotateCcw,
  ExternalLink,
  Maximize2,
  Minimize2,
  ShieldCheck,
  Globe,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

export default function UnblockedBrowserModal({
  isOpen,
  onClose,
  initialQuery = '',
}) {
  const [query, setQuery] = useState(initialQuery);
  const [engine, setEngine] = useState('google'); // 'google' | 'duckduckgo' | 'bing'
  const [currentUrl, setCurrentUrl] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [key, setKey] = useState(0); // For forcing iframe reload
  const modalRef = useRef(null);

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      buildUrl(initialQuery, engine);
    }
  }, [initialQuery, isOpen]);

  const buildUrl = (q, eng) => {
    if (!q) return '';
    const trimmed = q.trim();

    // Check if it's already a full URL
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      setCurrentUrl(trimmed);
      return trimmed;
    }

    let target = '';
    if (eng === 'google') {
      // The classic unblocked Google iframe trick via igu=1
      target = `https://www.google.com/search?igu=1&q=${encodeURIComponent(trimmed)}`;
    } else if (eng === 'duckduckgo') {
      target = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(trimmed)}`;
    } else if (eng === 'bing') {
      target = `https://www.bing.com/search?q=${encodeURIComponent(trimmed)}`;
    }
    setCurrentUrl(target);
    return target;
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    buildUrl(query, engine);
    setKey((prev) => prev + 1);
  };

  const handleEngineChange = (newEngine) => {
    setEngine(newEngine);
    buildUrl(query, newEngine);
    setKey((prev) => prev + 1);
  };

  const handleReload = () => {
    setKey((prev) => prev + 1);
  };

  const handleToggleFullscreen = () => {
    if (!modalRef.current) return;
    if (!isFullscreen) {
      if (modalRef.current.requestFullscreen) {
        modalRef.current.requestFullscreen().catch(() => {});
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-2 sm:p-4 animate-in fade-in duration-200">
      <div
        ref={modalRef}
        className={`relative w-full bg-[#0a0e1a] border border-cyan-500/40 rounded-3xl shadow-[0_0_80px_rgba(34,211,238,0.25)] flex flex-col overflow-hidden transition-all ${
          isFullscreen ? 'h-screen w-screen rounded-none border-none' : 'h-[92vh] max-w-6xl'
        }`}
      >
        {/* Browser Top Navigation Bar */}
        <div className="bg-[#0e1424] px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* Brand & Security Badge */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Unblocked Proxy Viewer</span>
            </div>

            {/* Engine Tabs */}
            <div className="flex items-center p-0.5 bg-slate-900 border border-slate-800 rounded-lg text-xs">
              <button
                type="button"
                onClick={() => handleEngineChange('google')}
                className={`px-2.5 py-1 rounded font-bold transition-colors ${
                  engine === 'google'
                    ? 'bg-cyan-400 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Google IGU
              </button>
              <button
                type="button"
                onClick={() => handleEngineChange('duckduckgo')}
                className={`px-2.5 py-1 rounded font-bold transition-colors ${
                  engine === 'duckduckgo'
                    ? 'bg-cyan-400 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                DuckDuckGo
              </button>
              <button
                type="button"
                onClick={() => handleEngineChange('bing')}
                className={`px-2.5 py-1 rounded font-bold transition-colors ${
                  engine === 'bing'
                    ? 'bg-cyan-400 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Bing
              </button>
            </div>
          </div>

          {/* Search Bar in Modal */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 max-w-lg min-w-[240px] relative"
          >
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Google or enter full URL..."
              className="w-full pl-9 pr-16 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-[11px] font-bold rounded-lg transition-colors"
            >
              Go
            </button>
          </form>

          {/* Window Control Action Buttons */}
          <div className="flex items-center gap-1.5 text-slate-400">
            <button
              onClick={handleReload}
              title="Reload frame"
              className="p-1.5 rounded-lg hover:text-white hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            {currentUrl && (
              <a
                href={currentUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Open in external tab"
                className="p-1.5 rounded-lg hover:text-cyan-400 hover:bg-slate-800 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
            <button
              onClick={handleToggleFullscreen}
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              className="p-1.5 rounded-lg hover:text-white hover:bg-slate-800 transition-colors"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              title="Close Browser"
              className="p-1.5 rounded-lg hover:text-white hover:bg-rose-500/20 text-rose-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Browser Iframe Viewport */}
        <div className="flex-1 w-full h-full bg-white relative">
          {currentUrl ? (
            <iframe
              key={key}
              src={currentUrl}
              title="Unblocked Google Search"
              className="w-full h-full border-0"
              allow="fullscreen; autoplay; encrypted-media; geolocation; clipboard-write; clipboard-read"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads"
            />
          ) : (
            <div className="w-full h-full bg-[#080c14] flex flex-col items-center justify-center p-6 text-center text-slate-400">
              <Globe className="w-12 h-12 text-cyan-400 mb-3 opacity-60" />
              <p className="text-sm font-bold text-white">Enter a search query or URL above</p>
              <p className="text-xs text-slate-500 mt-1">Google IGU unblocked iframe stream is ready.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
