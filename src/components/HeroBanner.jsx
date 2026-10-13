import React from 'react';
import { Play, Sparkles, Terminal, Flame } from 'lucide-react';

export default function HeroBanner({ featuredGame, onPlayGame, totalGamesCount }) {
  if (!featuredGame) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/90 via-[#0c1424] to-[#121124] border border-cyan-500/20 shadow-[0_0_35px_rgba(34,211,238,0.1)] p-6 sm:p-8 mb-10">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="max-w-2xl">
          {/* Natural editorial kicker */}
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <span className="tracking-wider uppercase">Featured Title</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-400">{featuredGame.category}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-3">
            {featuredGame.title}
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            {featuredGame.description}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => onPlayGame(featuredGame)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-400 hover:from-cyan-300 hover:to-teal-200 transition-all shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] active:scale-95"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>Play Now</span>
            </button>

            <div className="text-xs text-slate-400">
              <span>{featuredGame.controls}</span>
            </div>
          </div>
        </div>

        {/* Feature telemetry proof strip */}
        <div className="flex lg:flex-col gap-3 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-slate-800 lg:pl-8">
          <div className="text-left">
            <div className="text-xl sm:text-2xl font-black text-cyan-400 font-mono tabular-nums">
              {totalGamesCount}
            </div>
            <div className="text-xs text-slate-400">Playable Titles</div>
          </div>

          <div className="text-left">
            <div className="text-xl sm:text-2xl font-black text-purple-400 font-mono tabular-nums">
              0ms
            </div>
            <div className="text-xs text-slate-400">Instant Iframe Load</div>
          </div>

          <div className="text-left">
            <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono tabular-nums">
              100%
            </div>
            <div className="text-xs text-slate-400">Unblocked & Offline</div>
          </div>
        </div>
      </div>
    </div>
  );
}
