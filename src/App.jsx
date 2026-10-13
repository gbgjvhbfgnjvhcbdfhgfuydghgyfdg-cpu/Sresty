import React, { useState, useEffect, useMemo, useRef } from 'react';
import defaultGames from './data/games.json';
import TopBar from './components/TopBar.jsx';
import HeroBanner from './components/HeroBanner.jsx';
import GameCard from './components/GameCard.jsx';
import GamePlayerModal from './components/GamePlayerModal.jsx';
import AddGameModal from './components/AddGameModal.jsx';
import StealthModal from './components/StealthModal.jsx';
import AccountModal from './components/AccountModal.jsx';
import GlobalChat from './components/GlobalChat.jsx';
import LandingPage from './components/LandingPage.jsx';
import SettingsModal from './components/SettingsModal.jsx';
import AboutModal from './components/AboutModal.jsx';
import UnblockedBrowserModal from './components/UnblockedBrowserModal.jsx';
import { Search, Flame, Sparkles, Filter, Plus, Gamepad2, MessageSquare, Clock, ChevronDown, Check, Layers } from 'lucide-react';

const ARCADE_CATEGORIES = [
  { id: 'all', label: 'All Titles', icon: '🎮' },
  { id: 'Arcade', label: 'Arcade Classics', icon: '👾' },
  { id: 'Action', label: 'Action & Combat', icon: '⚡' },
  { id: 'Sports', label: 'Sports & Athletics', icon: '⚽' },
  { id: 'Racing', label: 'High-Speed Racing', icon: '🏎️' },
  { id: 'Puzzle', label: 'Brain & Puzzle', icon: '🧩' },
  { id: 'Classics', label: 'Retro 8-Bit', icon: '🕹️' },
  { id: 'favorites', label: 'My Favorites', icon: '❤️' },
];

export default function App() {
  const [games, setGames] = useState(() => {
    try {
      const stored = localStorage.getItem('neon_custom_games');
      const custom = stored ? JSON.parse(stored) : [];
      return [...defaultGames, ...custom];
    } catch {
      return defaultGames;
    }
  });

  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem('neon_favorites');
      return stored ? JSON.parse(stored) : ['snake', '2048'];
    } catch {
      return ['snake', '2048'];
    }
  });

  // Portal Customizer & Tab Cloak Settings
  const [settings, setSettings] = useState(() => {
    try {
      const stored = localStorage.getItem('arcade_portal_settings');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return {
      cloakPreset: 'default',
      customTitle: '',
      customFavicon: '',
      themePreset: 'deep-space',
      bgColor: '#080c14',
      bgGradient: 'radial-gradient(ellipse at top, #0d1527, #080c14 70%)',
      bgImageUrl: '',
      bgBlur: 0,
      bgOpacity: 100,
    };
  });

  const [currentView, setCurrentView] = useState('landing');
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGame, setActiveGame] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isStealthActive, setIsStealthActive] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isBrowserModalOpen, setIsBrowserModalOpen] = useState(false);
  const [browserQuery, setBrowserQuery] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInitialTab, setChatInitialTab] = useState('global');
  const [isMuted, setIsMuted] = useState(false);

  // Category dropdown menu state for arcade library
  const [isCatalogCategoryOpen, setIsCatalogCategoryOpen] = useState(false);
  const catalogDropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (catalogDropdownRef.current && !catalogDropdownRef.current.contains(event.target)) {
        setIsCatalogCategoryOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOpenSocial = (tab = 'global') => {
    playUiSound(440);
    setChatInitialTab(tab);
    setIsChatOpen(true);
  };

  // Sync settings to localStorage and apply tab cloak dynamically
  useEffect(() => {
    try {
      localStorage.setItem('arcade_portal_settings', JSON.stringify(settings));
    } catch (e) {}

    // Apply document title
    if (settings.customTitle) {
      document.title = settings.customTitle;
    } else {
      document.title = 'Playground Arcade - Unblocked Games Hub';
    }

    // Apply favicon
    let link = document.querySelector("link[rel*='icon']");
    if (settings.customFavicon) {
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = settings.customFavicon;
    } else if (link) {
      link.href = 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f3ae.png';
    }
  }, [settings]);

  const handleUpdateSettings = (newSettings) => {
    setSettings(newSettings);
  };

  // Audio tone feedback
  const playUiSound = (freq = 440) => {
    if (isMuted) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } catch (e) {}
  };

  const toggleFavorite = (gameId) => {
    playUiSound(540);
    setFavorites((prev) => {
      const next = prev.includes(gameId)
        ? prev.filter((id) => id !== gameId)
        : [...prev, gameId];
      localStorage.setItem('neon_favorites', JSON.stringify(next));
      return next;
    });
  };

  const handleAddGame = (newGame) => {
    playUiSound(600);
    const updated = [newGame, ...games];
    setGames(updated);
    try {
      const stored = localStorage.getItem('neon_custom_games');
      const custom = stored ? JSON.parse(stored) : [];
      localStorage.setItem('neon_custom_games', JSON.stringify([newGame, ...custom]));
    } catch (e) {}
    setActiveFilter('all');
    setActiveGame(newGame);
  };

  const handlePlayGame = (game) => {
    playUiSound(500);
    // Increment play count
    setGames((prev) =>
      prev.map((g) => (g.id === game.id ? { ...g, plays: (g.plays || 0) + 1 } : g))
    );
    setActiveGame(game);
  };

  // Filtered games calculation
  const filteredGames = useMemo(() => {
    let result = games;

    if (activeFilter === 'favorites') {
      result = result.filter((g) => favorites.includes(g.id));
    } else if (activeFilter !== 'all') {
      result = result.filter((g) => g.category.toLowerCase() === activeFilter.toLowerCase());
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (g) =>
          g.title.toLowerCase().includes(q) ||
          g.category.toLowerCase().includes(q) ||
          g.description.toLowerCase().includes(q)
      );
    }

    return result;
  }, [games, activeFilter, searchQuery, favorites]);

  // Featured game
  const featuredGame = useMemo(() => {
    return games.find((g) => g.featured) || games[0];
  }, [games]);

  return (
    <div
      className="min-h-screen text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950 font-sans relative transition-colors duration-300"
      style={{
        backgroundColor: settings.bgColor || '#080c14',
        backgroundImage: !settings.bgImageUrl && settings.bgGradient ? settings.bgGradient : 'none',
      }}
    >
      {/* Custom Wallpaper Background Layer (if image URL configured in Settings) */}
      {settings.bgImageUrl && (
        <div
          className="fixed inset-0 pointer-events-none -z-10 bg-cover bg-center bg-fixed transition-all duration-300"
          style={{
            backgroundImage: `url(${settings.bgImageUrl})`,
            filter: settings.bgBlur > 0 ? `blur(${settings.bgBlur}px)` : 'none',
            opacity: (settings.bgOpacity ?? 100) / 100,
          }}
        />
      )}

      {/* Top Bar Navigation */}
      <TopBar
        activeFilter={activeFilter}
        setActiveFilter={(f) => {
          playUiSound(400);
          setActiveFilter(f);
        }}
        favoritesCount={favorites.length}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onToggleStealth={() => setIsStealthActive(true)}
        isMuted={isMuted}
        onToggleMute={() => setIsMuted(!isMuted)}
        onOpenAccount={() => setIsAccountModalOpen(true)}
        isChatOpen={isChatOpen}
        onToggleChat={() => {
          if (!isChatOpen) handleOpenSocial('global');
          else setIsChatOpen(false);
        }}
        currentView={currentView}
        setCurrentView={setCurrentView}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenAbout={() => setIsAboutModalOpen(true)}
        onOpenMeets={() => handleOpenSocial('meets')}
      />

      {currentView === 'landing' ? (
        <LandingPage
          onEnterArcade={() => {
            playUiSound(440);
            setCurrentView('arcade');
          }}
          onPlayGame={(game) => {
            handlePlayGame(game);
          }}
          games={games}
          onOpenBrowser={(query) => {
            setBrowserQuery(query);
            setIsBrowserModalOpen(true);
          }}
        />
      ) : (
        /* Main Container */
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Spotlight (Shown when no active text search) */}
        {!searchQuery && activeFilter === 'all' && (
          <HeroBanner
            featuredGame={featuredGame}
            onPlayGame={handlePlayGame}
            totalGamesCount={games.length}
          />
        )}

        {/* Filter and Search Bar Strip */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
          {/* Category Dropdown (Replacing horizontal row with dropdown menu) */}
          <div className="relative" ref={catalogDropdownRef}>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 shrink-0">
                <Layers className="w-3.5 h-3.5 text-cyan-400" /> Category:
              </span>
              <button
                type="button"
                onClick={() => setIsCatalogCategoryOpen(!isCatalogCategoryOpen)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/95 border border-cyan-500/30 text-xs font-bold text-white hover:border-cyan-400 hover:bg-slate-800/80 shadow-md transition-all active:scale-95"
              >
                <span className="text-base select-none">
                  {(ARCADE_CATEGORIES.find((c) => c.id === activeFilter) || ARCADE_CATEGORIES[0]).icon}
                </span>
                <span>
                  {(ARCADE_CATEGORIES.find((c) => c.id === activeFilter) || ARCADE_CATEGORIES[0]).label}
                </span>
                {activeFilter === 'favorites' && favorites.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[10px] font-mono">
                    ({favorites.length})
                  </span>
                )}
                <ChevronDown
                  className={`w-3.5 h-3.5 text-cyan-400 transition-transform duration-200 ${
                    isCatalogCategoryOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
            </div>

            {/* Dropdown Menu Panel */}
            {isCatalogCategoryOpen && (
              <div className="absolute left-0 mt-2 w-64 rounded-2xl bg-[#0a0f1d] border border-cyan-500/40 shadow-[0_20px_50px_rgba(0,0,0,0.85)] p-2 z-30 animate-in fade-in zoom-in-95 backdrop-blur-xl">
                <div className="px-3 py-1.5 border-b border-slate-800 text-[11px] font-semibold text-slate-400 flex items-center justify-between">
                  <span>Browse by Category</span>
                  <span className="text-[10px] text-cyan-400 font-mono">Select</span>
                </div>
                <div className="space-y-1 mt-1">
                  {ARCADE_CATEGORIES.map((cat) => {
                    const isSelected = activeFilter === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          playUiSound(420);
                          setActiveFilter(cat.id);
                          setIsCatalogCategoryOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                          isSelected
                            ? 'bg-cyan-500/20 border border-cyan-400/50 text-cyan-300'
                            : 'text-slate-300 hover:text-white hover:bg-slate-800/80 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-base select-none">{cat.icon}</span>
                          <span>{cat.label}</span>
                        </div>
                        {cat.id === 'favorites' && favorites.length > 0 && (
                          <span className="px-1.5 py-0.2 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-[10px] font-mono">
                            {favorites.length}
                          </span>
                        )}
                        {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search unblocked games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/40 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Catalog Section Header & Count */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-white">
              {activeFilter === 'all'
                ? 'Game Library'
                : activeFilter === 'favorites'
                ? 'Favorite Games'
                : `${activeFilter} Games`}
            </h2>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-xs text-slate-400 font-mono tabular-nums">
              {filteredGames.length} {filteredGames.length === 1 ? 'game' : 'games'}
            </span>
          </div>

          {activeFilter === 'favorites' && favorites.length > 0 && (
            <span className="text-xs text-slate-400">
              Saved locally in browser
            </span>
          )}
        </div>

        {/* Games Grid */}
        {filteredGames.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredGames.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                isFavorite={favorites.includes(game.id)}
                onToggleFavorite={toggleFavorite}
                onPlay={handlePlayGame}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-12 text-center max-w-md mx-auto my-12">
            <Gamepad2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-200 mb-1">
              {activeFilter === 'favorites' ? 'No favorites added yet' : 'No games found'}
            </h3>
            <p className="text-xs text-slate-400 mb-5 leading-relaxed">
              {activeFilter === 'favorites'
                ? 'Click the heart icon on any game card to bookmark it for fast access.'
                : 'Try adjusting your search query or add a custom iframe game.'}
            </p>
            <div className="flex items-center justify-center gap-3">
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 text-xs font-semibold bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
                >
                  Reset Search
                </button>
              )}
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2 text-xs font-bold bg-cyan-400 text-slate-950 rounded-lg hover:bg-cyan-300 transition-colors"
              >
                Add Game
              </button>
            </div>
          </div>
        )}
      </main>
      )}

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-900 bg-[#060910] py-8 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">PLAYGROUND ARCADE</span>
            <span aria-hidden="true">·</span>
            <span>Unblocked Games Catalog</span>
            <span aria-hidden="true">·</span>
            <span>Real-time Clock & Global Chat</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                playUiSound(440);
                setCurrentView(currentView === 'landing' ? 'arcade' : 'landing');
              }}
              className="text-cyan-400 hover:underline flex items-center gap-1"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{currentView === 'landing' ? 'Go to Arcade Library →' : '← Return to Clock Landing'}</span>
            </button>
            <span aria-hidden="true">·</span>
            <span>Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px] text-slate-300">F</kbd> for Fullscreen</span>
          </div>
        </div>
      </footer>

      {/* Game Theater Modal */}
      {activeGame && (
        <GamePlayerModal
          game={activeGame}
          onClose={() => setActiveGame(null)}
          isFavorite={favorites.includes(activeGame.id)}
          onToggleFavorite={toggleFavorite}
        />
      )}

      {/* Add Custom Game Modal */}
      <AddGameModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddGame={handleAddGame}
      />

      {/* Academic Disguise Modal */}
      <StealthModal
        isActive={isStealthActive}
        onClose={() => setIsStealthActive(false)}
      />

      {/* User Account & Ranks / Moderation Modal */}
      <AccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
      />

      {/* Global Arcade Chat & Social Meets */}
      <GlobalChat
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onOpenAccount={() => setIsAccountModalOpen(true)}
        initialTab={chatInitialTab}
      />

      {/* Settings Modal (Tab Cloak & Theme Backgrounds) */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
      />

      {/* About Portal Modal */}
      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
        totalGames={games.length}
      />

      {/* Unblocked Google & Web Browser Modal */}
      <UnblockedBrowserModal
        isOpen={isBrowserModalOpen}
        onClose={() => setIsBrowserModalOpen(false)}
        initialQuery={browserQuery}
      />

      {/* Floating Global Chat Toggle Button (when chat is closed) */}
      {!isChatOpen && (
        <button
          onClick={() => handleOpenSocial('global')}
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-slate-900/90 hover:bg-slate-800 text-cyan-400 hover:text-cyan-300 border border-cyan-500/40 shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all hover:scale-105 active:scale-95 group"
          title="Open Social Hub & Meets"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full" />
          </div>
          <span className="text-xs font-bold text-white tracking-wide pr-1">Social & Meets</span>
        </button>
      )}
    </div>
  );
}
