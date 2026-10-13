import React, { useState } from 'react';
import { Play, Heart, Gamepad2, Grid, Zap, Layers, Sparkles, CheckSquare, Globe } from 'lucide-react';

const ICON_MAP = {
  Gamepad2,
  Grid,
  Zap,
  Layers,
  Sparkles,
  CheckSquare,
  Globe,
};

export default function GameCard({ game, isFavorite, onToggleFavorite, onPlay }) {
  const [imgError, setImgError] = useState(false);
  const IconComponent = ICON_MAP[game.icon] || Gamepad2;

  return (
    <div className="group relative flex flex-col justify-between rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 hover:shadow-[0_0_25px_rgba(34,211,238,0.15)] transition-all duration-200 overflow-hidden p-5">
      {/* Top action row */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          {game.thumbnail && !imgError ? (
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-800 border border-slate-700 shrink-0 shadow-sm">
              <img
                src={game.thumbnail}
                alt={game.title}
                loading="lazy"
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
              />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400/50 group-hover:scale-105 transition-all">
              <IconComponent className="w-6 h-6 text-cyan-400" />
            </div>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(game.id);
            }}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 transition-colors focus:outline-none"
          >
            <Heart
              className={`w-5 h-5 transition-transform active:scale-125 ${
                isFavorite
                  ? 'fill-rose-500 text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]'
                  : 'text-slate-400 hover:text-rose-400'
              }`}
            />
          </button>
        </div>

        {/* Game Title */}
        <h3 className="text-lg font-bold text-slate-100 group-hover:text-cyan-300 transition-colors mb-1.5">
          {game.title}
        </h3>

        {/* Zero-Pill Typography Metadata */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
          <span className="font-medium text-slate-300">{game.category}</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="font-mono tabular-nums">{game.plays?.toLocaleString() || '1,000+'} plays</span>
          {game.isCustom && (
            <>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-purple-400 font-medium">Custom</span>
            </>
          )}
        </div>

        {/* Description */}
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
          {game.description}
        </p>
      </div>

      {/* Bottom controls & launch button */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
        <span className="text-[11px] text-slate-400 truncate max-w-[160px]" title={game.controls}>
          {game.controls}
        </span>

        <button
          onClick={() => onPlay(game)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.3)] hover:shadow-[0_0_18px_rgba(34,211,238,0.5)] transition-all whitespace-nowrap active:scale-95"
        >
          <Play className="w-3.5 h-3.5 fill-slate-950" />
          <span>Launch</span>
        </button>
      </div>
    </div>
  );
}
