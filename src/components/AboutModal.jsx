import React from 'react';
import {
  X,
  Info,
  Gamepad2,
  Crown,
  Shield,
  Search,
  Clock,
  Sparkles,
  Terminal,
  Lock,
  Heart,
  CheckCircle2,
  Cpu
} from 'lucide-react';

export default function AboutModal({ isOpen, onClose, totalGames = 16 }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0b101d] border border-cyan-500/30 rounded-3xl shadow-[0_0_60px_rgba(34,211,238,0.2)] p-6 sm:p-7 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide">
                About Playground Arcade
              </h2>
              <p className="text-xs text-slate-400">
                The ultimate unblocked web gaming portal & community hub
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pt-4 pr-1 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
          {/* Hero Pitch */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-[#0d1424] to-slate-900 border border-cyan-500/20">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Project Mission</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              <strong>Playground Arcade</strong> is a lightweight, privacy-focused unblocked gaming platform built entirely in client-side HTML5, JavaScript, and Tailwind CSS. Games are isolated in clean iframe environments stored in JSON catalogs, allowing smooth 60fps performance without downloads or external blockers.
            </p>
          </div>

          {/* Key Features Grid */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Core Capabilities & Tools
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-cyan-400 font-bold">
                  <Gamepad2 className="w-4 h-4" />
                  <span>{totalGames}+ Unblocked Titles</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Classics like Tetris, Retro Bowl, Slope, 2048, Snake, Asteroids, and Space Invaders rendered in standalone JavaScript.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <Crown className="w-4 h-4 fill-amber-400" />
                  <span>Ranks & Owner Authority</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Gold Crown Owner rank with full moderation power: ban disruptive players, mute bad actors, and promote trusted moderators.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <Shield className="w-4 h-4" />
                  <span>Tab Cloak & Stealth Mode</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Instantly disguise browser tabs as Google Classroom, Docs, or Canvas, plus an emergency academic Wikipedia panic screen.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-purple-400 font-bold">
                  <Search className="w-4 h-4" />
                  <span>Unblocked Google Search</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Front-page Google search engine utilizing unblocked embedded protocols to browse without firewall blocks.
                </p>
              </div>
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2.5">
            <span className="text-xs font-bold text-slate-200 block">
              Keyboard Shortcuts
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Fullscreen Game</span>
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-cyan-300">F</kbd>
              </div>
              <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Exit Stealth Mode</span>
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-cyan-300">Esc</kbd>
              </div>
              <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Send Chat Message</span>
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-cyan-300">Enter</kbd>
              </div>
            </div>
          </div>

          {/* Credits & Version */}
          <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <span>Maintained by</span>
              <span className="text-amber-400 font-bold flex items-center gap-1">
                <Crown className="w-3.5 h-3.5 fill-amber-400" /> ArcadeOwner
              </span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[11px]">
              <span>v2.5.0-JS</span>
              <span>·</span>
              <span className="text-emerald-400">Client Authoritative</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
