import React, { useState, useEffect, useRef } from 'react';
import {
  Gamepad2,
  Plus,
  Heart,
  Shield,
  Volume2,
  VolumeX,
  Crown,
  MessageSquare,
  User,
  Clock,
  Settings,
  Info,
  Video,
  ChevronDown,
  Layers,
  Sparkles,
  Zap,
  Flame,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const CATEGORY_ITEMS = [
  { id: 'all', label: 'All Games', icon: '🎮' },
  { id: 'Arcade', label: 'Arcade', icon: '👾' },
  { id: 'Action', label: 'Action', icon: '⚡' },
  { id: 'Sports', label: 'Sports', icon: '⚽' },
  { id: 'Racing', label: 'Racing', icon: '🏎️' },
  { id: 'Puzzle', label: 'Puzzle', icon: '🧩' },
  { id: 'Classics', label: 'Classics', icon: '🕹️' },
  { id: 'favorites', label: 'Favorites', icon: '❤️' },
];

export default function TopBar({
  activeFilter,
  setActiveFilter,
  favoritesCount = 0,
  onOpenAddModal,
  onToggleStealth,
  isMuted,
  onToggleMute,
  onOpenAccount,
  isChatOpen,
  onToggleChat,
  currentView,
  setCurrentView,
  onOpenSettings,
  onOpenAbout,
  onOpenMeets,
}) {
  const { currentUser } = useAuth();
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsCategoryOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectCategory = (categoryId) => {
    setCurrentView?.('arcade');
    setActiveFilter?.(categoryId);
    setIsCategoryOpen(false);
  };

  const currentCategoryObj = CATEGORY_ITEMS.find((c) => c.id === activeFilter) || CATEGORY_ITEMS[0];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#090d16]/90 backdrop-blur-md border-b border-cyan-500/15">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-6">
        {/* Zone 1: Brand wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setCurrentView?.('landing')}
            className="flex items-center gap-2 sm:gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all">
              <Gamepad2 className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <span className="text-base sm:text-lg font-black tracking-wider text-slate-100 group-hover:text-cyan-400 transition-colors uppercase whitespace-nowrap">
                PLAYGROUND<span className="text-cyan-400">ARCADE</span>
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links with Category Dropdown */}
        <nav className="flex items-center gap-2 sm:gap-4 md:gap-5 text-sm font-medium">
          {/* Landing / Time Page */}
          <button
            onClick={() => setCurrentView?.('landing')}
            className={`flex items-center gap-1.5 whitespace-nowrap transition-colors pb-1 border-b-2 text-xs sm:text-sm ${
              currentView === 'landing'
                ? 'text-cyan-400 border-cyan-400 font-semibold'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Time / Home</span>
          </button>

          {/* Direct Arcade link */}
          <button
            onClick={() => {
              setCurrentView?.('arcade');
            }}
            className={`hidden sm:flex items-center gap-1.5 whitespace-nowrap transition-colors pb-1 border-b-2 text-xs sm:text-sm ${
              currentView === 'arcade'
                ? 'text-cyan-400 border-cyan-400 font-semibold'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>Arcade Hub</span>
          </button>

          {/* CATEGORIES DROPDOWN (Replaced long horizontal line as requested) */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                isCategoryOpen || (currentView === 'arcade' && activeFilter !== 'all')
                  ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.25)]'
                  : 'bg-slate-900/90 border-slate-700/80 text-slate-300 hover:text-white hover:border-slate-600'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Categories</span>
              {currentView === 'arcade' && activeFilter !== 'all' ? (
                <span className="hidden md:inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-cyan-400/20 text-cyan-300 text-[10px] font-mono">
                  {currentCategoryObj.icon} {currentCategoryObj.label}
                </span>
              ) : null}
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  isCategoryOpen ? 'rotate-180 text-cyan-400' : 'text-slate-400'
                }`}
              />
            </button>

            {/* Dropdown Menu Panel */}
            {isCategoryOpen && (
              <div className="absolute left-0 mt-2 w-52 sm:w-60 rounded-2xl bg-[#0a0f1d] border border-cyan-500/30 shadow-[0_15px_40px_rgba(0,0,0,0.8)] p-2 z-50 animate-in fade-in zoom-in-95 backdrop-blur-xl">
                <div className="px-3 py-2 border-b border-slate-800/80 mb-1 flex items-center justify-between text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-cyan-400" /> Game Categories
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">Select</span>
                </div>

                <div className="space-y-1">
                  {CATEGORY_ITEMS.map((item) => {
                    const isSelected = activeFilter === item.id;
                    const isFav = item.id === 'favorites';
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelectCategory(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                          isSelected
                            ? 'bg-cyan-500/20 border border-cyan-400/50 text-cyan-300'
                            : 'text-slate-300 hover:text-white hover:bg-slate-800/70 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-base select-none">{item.icon}</span>
                          <span>{item.label}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {isFav && favoritesCount > 0 && (
                            <span className="px-1.5 py-0.2 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-[10px] font-mono">
                              {favoritesCount}
                            </span>
                          )}
                          {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Friends & Meets Link */}
          <button
            onClick={onOpenMeets}
            className="hidden md:flex items-center gap-1.5 whitespace-nowrap transition-colors pb-1 border-b-2 text-slate-400 border-transparent hover:text-cyan-300 text-xs sm:text-sm"
          >
            <Video className="w-3.5 h-3.5 text-cyan-400" />
            <span>Meets</span>
          </button>

          {/* About Modal Link */}
          <button
            onClick={onOpenAbout}
            className="hidden lg:flex items-center gap-1 whitespace-nowrap transition-colors pb-1 border-b-2 text-slate-400 border-transparent hover:text-slate-200 text-xs sm:text-sm"
          >
            <Info className="w-3.5 h-3.5" />
            <span>About</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action & Utilities */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Mute button */}
          <button
            onClick={onToggleMute}
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-slate-700/50 transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Disguise button */}
          <button
            onClick={onToggleStealth}
            title="Stealth Mode (Panic / Study Disguise)"
            className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 transition-colors whitespace-nowrap"
          >
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Disguise</span>
          </button>

          {/* Settings button */}
          <button
            onClick={onOpenSettings}
            title="Settings (Tab Cloak & Backgrounds)"
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 border border-slate-700/60 transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Global Chat Toggle Button */}
          <button
            onClick={onToggleChat}
            title="Toggle Global Chat"
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all whitespace-nowrap ${
              isChatOpen
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.3)]'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700/80'
            }`}
          >
            <div className="relative">
              <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
              <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
            </div>
            <span className="hidden sm:inline">Chat</span>
          </button>

          {/* User Account / Rank Button (Displays Nickname & Gold Crown for Owner) */}
          <button
            onClick={onOpenAccount}
            title={
              currentUser
                ? `Account: ${currentUser.nickname || currentUser.displayName} (@${currentUser.username}) - Rank: ${currentUser.rank}`
                : 'Sign in / Create Account'
            }
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
              currentUser?.rank === 'owner'
                ? 'bg-gradient-to-r from-amber-500/20 via-yellow-500/15 to-amber-500/20 border-amber-400/60 text-amber-300 hover:border-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.25)]'
                : currentUser?.rank === 'moderator'
                ? 'bg-blue-500/20 border-blue-400/60 text-blue-300 hover:border-blue-300'
                : currentUser
                ? 'bg-slate-800 border-slate-700 text-slate-200 hover:border-slate-600'
                : 'bg-slate-800/90 border-slate-700 text-cyan-300 hover:text-cyan-200'
            }`}
          >
            {currentUser ? (
              <>
                <span className="text-sm select-none">{currentUser.avatar || '🎮'}</span>
                <span className="max-w-[100px] truncate hidden sm:inline">
                  {currentUser.nickname || currentUser.displayName}
                </span>
                {currentUser.rank === 'owner' && (
                  <span className="inline-flex items-center gap-0.5 text-amber-400">
                    <Crown className="w-3.5 h-3.5 fill-amber-400" />
                    <span className="text-[10px] font-black tracking-wide hidden lg:inline">OWNER</span>
                  </span>
                )}
                {currentUser.rank === 'moderator' && (
                  <span className="inline-flex items-center gap-0.5 text-blue-400">
                    <Shield className="w-3 h-3" />
                    <span className="text-[10px] font-bold hidden lg:inline">MOD</span>
                  </span>
                )}
              </>
            ) : (
              <>
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </>
            )}
          </button>

          {/* Add Game Button */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)] whitespace-nowrap active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden sm:inline">Add Game</span>
          </button>
        </div>
      </div>
    </header>
  );
}
