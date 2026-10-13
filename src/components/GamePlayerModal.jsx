import React, { useEffect, useRef, useState } from 'react';
import { Maximize2, Minimize2, RotateCcw, X, Heart, Share2, Check, ExternalLink } from 'lucide-react';

export default function GamePlayerModal({
  game,
  onClose,
  isFavorite,
  onToggleFavorite,
}) {
  const containerRef = useRef(null);
  const iframeRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  // Monitor native fullscreen state changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Global key listener for shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !document.fullscreenElement) {
        onClose();
      } else if ((e.key === 'f' || e.key === 'F') && !e.target.matches('input, textarea')) {
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {
        // Fallback if browser blocks standard requestFullscreen
        setIsFullscreen(!isFullscreen);
      });
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const reloadGame = () => {
    setIframeKey((prev) => prev + 1);
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.origin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Determine iframe source: direct src or parsed from raw iframe tag
  const getIframeSrc = () => {
    if (game.src) return game.src;
    if (game.iframe) {
      const match = game.iframe.match(/src=["'](.*?)["']/);
      if (match && match[1]) return match[1];
    }
    return '';
  };

  const iframeSrc = getIframeSrc();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div
        ref={containerRef}
        className={`relative flex flex-col w-full h-full max-w-6xl max-h-[92vh] bg-[#0b101c] border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(34,211,238,0.2)] overflow-hidden transition-all ${
          isFullscreen ? 'max-w-none max-h-none rounded-none border-none' : ''
        }`}
      >
        {/* Modal Player Header */}
        <div className="h-14 px-4 bg-slate-900/95 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <h2 className="text-base sm:text-lg font-bold text-white truncate">
              {game.title}
            </h2>
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
              <span aria-hidden="true">·</span>
              <span>{game.category}</span>
              <span aria-hidden="true">·</span>
              <span className="truncate max-w-[200px] text-slate-400">{game.controls}</span>
            </div>
          </div>

          {/* Player action tools */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={() => onToggleFavorite(game.id)}
              title={isFavorite ? 'Remove Favorite' : 'Save Favorite'}
              className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>

            <button
              onClick={reloadGame}
              title="Restart / Reload Game"
              className="p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={copyShareLink}
              title="Share Arcade Link"
              className="p-2 rounded-lg text-slate-400 hover:text-purple-400 hover:bg-slate-800 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button
              onClick={toggleFullscreen}
              title={isFullscreen ? 'Exit Fullscreen (F)' : 'Fullscreen (F)'}
              className="p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4 text-cyan-400" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              title="Close Player (Esc)"
              className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* The Game Iframe Viewport */}
        <div className="relative flex-1 w-full bg-[#070b14] overflow-hidden flex items-center justify-center">
          {iframeSrc ? (
            <iframe
              key={iframeKey}
              ref={iframeRef}
              src={iframeSrc}
              title={game.title}
              className="w-full h-full border-0"
              allow="fullscreen; autoplay; gamepad; keyboard-map"
              sandbox="allow-scripts allow-same-origin allow-forms allow-pointer-lock"
            />
          ) : (
            <div className="text-center p-8 text-slate-400">
              <p className="text-sm mb-2">No iframe source provided for this game.</p>
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold bg-slate-800 text-white rounded-lg"
              >
                Back to catalog
              </button>
            </div>
          )}
        </div>

        {/* Quick controls kicker bar */}
        <div className="h-9 px-4 bg-slate-950 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
          <div className="flex items-center gap-3">
            <span>Controls: <strong className="text-slate-300">{game.controls}</strong></span>
          </div>
          <div className="flex items-center gap-3 font-mono">
            <span>[F] Fullscreen</span>
            <span aria-hidden="true">·</span>
            <span>[Esc] Close</span>
          </div>
        </div>
      </div>
    </div>
  );
}
