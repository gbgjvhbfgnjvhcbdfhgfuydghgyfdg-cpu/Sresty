import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import {
  Clock,
  Calendar,
  Gamepad2,
  Crown,
  Shield,
  User,
  ArrowRight,
  Sparkles,
  Lock,
  KeyRound,
  CheckCircle2,
  Flame,
  MessageSquare,
  Zap,
  Play,
  Search,
  Globe,
  ShieldCheck
} from 'lucide-react';

export default function LandingPage({
  onEnterArcade,
  onPlayGame,
  games = [],
  onOpenBrowser,
}) {
  const { currentUser, signIn, signUp, signOut, isOwner } = useAuth();

  // Real-time Clock state
  const [currentTime, setCurrentTime] = useState(new Date());

  // Front Page Unblocked Google Search state
  const [googleQuery, setGoogleQuery] = useState('');

  // Form mode: 'login' | 'signup'
  const [authMode, setAuthMode] = useState('login');

  // Login form state
  const [loginUsername, setLoginUsername] = useState('Owner');
  const [loginPassword, setLoginPassword] = useState('owner');
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState('');

  // Sign up / Create account state
  const [signupUsername, setSignupUsername] = useState('');
  const [signupDisplayName, setSignupDisplayName] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupAvatar, setSignupAvatar] = useState('🎮');
  const [signupError, setSignupError] = useState('');
  const [signupSuccess, setSignupSuccess] = useState('');

  // Tick clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format time components
  const hours = currentTime.getHours();
  const timeString = currentTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const dateString = currentTime.toLocaleDateString([], {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // Time-based greeting
  const greeting =
    hours < 12
      ? 'Good Morning'
      : hours < 18
      ? 'Good Afternoon'
      : 'Good Evening';

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginSuccess('');
    const res = signIn(loginUsername, loginPassword);
    if (!res.success) {
      setLoginError(res.error);
    } else {
      setLoginSuccess(`Signed in as ${res.user.displayName}!`);
      setTimeout(() => {
        setLoginSuccess('');
      }, 1500);
    }
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    setSignupError('');
    setSignupSuccess('');
    const res = signUp(
      signupUsername,
      signupPassword,
      signupDisplayName,
      signupAvatar,
      'member',
      signupDisplayName
    );
    if (!res.success) {
      setSignupError(res.error);
    } else {
      setSignupSuccess(`Account created! Welcome, ${res.user.displayName}!`);
      setTimeout(() => {
        setSignupSuccess('');
      }, 1500);
    }
  };

  const AVATARS = ['👑', '🛡️', '🎮', '⚡', '🔥', '🚀', '👾', '🎯', '🐱', '🦊'];

  // Spotlight games for preview
  const previewGames = games.slice(0, 4);

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-cyan-500/10 via-purple-500/10 to-transparent blur-3xl opacity-70" />
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl w-full mx-auto space-y-10">
        {/* TOP CLOCK & GREETING HERO SECTION */}
        <section className="text-center pt-4 pb-2">
          {/* Greeting Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-6 shadow-[0_0_20px_rgba(34,211,238,0.15)]">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>{greeting}, Arcade Player</span>
            <span className="text-slate-600">·</span>
            <span className="text-emerald-400 flex items-center gap-1 font-mono text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Server
            </span>
          </div>

          {/* Correct Real-Time Digital Clock Display */}
          <div className="max-w-xl mx-auto p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-slate-900/90 via-[#0b1120] to-[#070b14] border border-cyan-500/30 shadow-[0_0_50px_rgba(34,211,238,0.15)] relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-400" />

            <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400/90 mb-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Current Real Time</span>
            </div>

            {/* Time Typography */}
            <div className="font-mono font-black text-4xl sm:text-6xl md:text-7xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-slate-200 tabular-nums my-2 drop-shadow-[0_0_25px_rgba(34,211,238,0.4)]">
              {timeString}
            </div>

            {/* Date Display */}
            <div className="flex items-center justify-center gap-2 text-sm sm:text-base font-medium text-slate-300 mt-2">
              <Calendar className="w-4 h-4 text-cyan-400/80" />
              <span>{dateString}</span>
            </div>
          </div>

          {/* FRONT PAGE UNBLOCKED GOOGLE SEARCH BAR */}
          <div className="max-w-2xl mx-auto mt-8">
            <div className="p-6 rounded-3xl bg-gradient-to-b from-slate-900/90 via-[#0a0f1d] to-[#070b14] border border-cyan-500/30 shadow-[0_0_40px_rgba(34,211,238,0.12)]">
              {/* Google Brand Header */}
              <div className="flex items-center justify-center gap-2.5 mb-4">
                <span className="text-2xl sm:text-3xl font-black tracking-tight font-sans">
                  <span className="text-[#4285F4]">G</span>
                  <span className="text-[#EA4335]">o</span>
                  <span className="text-[#FBBC05]">o</span>
                  <span className="text-[#4285F4]">g</span>
                  <span className="text-[#34A853]">l</span>
                  <span className="text-[#EA4335]">e</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-[10px] font-black tracking-wider uppercase flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>UNBLOCKED</span>
                </span>
              </div>

              {/* Search Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!googleQuery.trim()) return;
                  onOpenBrowser?.(googleQuery.trim());
                }}
                className="space-y-3"
              >
                <div className="relative group">
                  <Search className="w-4 h-4 text-slate-400 group-focus-within:text-cyan-400 absolute left-4 top-1/2 -translate-y-1/2 transition-colors" />
                  <input
                    type="text"
                    value={googleQuery}
                    onChange={(e) => setGoogleQuery(e.target.value)}
                    placeholder="Search Google or type a web URL (always unblocked)..."
                    className="w-full pl-11 pr-24 py-3 bg-slate-950/90 border border-slate-700/80 rounded-full text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 shadow-inner transition-all"
                  />
                  {googleQuery ? (
                    <button
                      type="button"
                      onClick={() => setGoogleQuery('')}
                      className="absolute right-14 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                    >
                      Clear
                    </button>
                  ) : null}
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs rounded-full shadow-sm transition-all flex items-center gap-1 active:scale-95"
                  >
                    <span>Search</span>
                  </button>
                </div>

                {/* Google Style Action Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700 text-xs font-medium transition-colors"
                  >
                    Google Search
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const lucky = [
                        'wikipedia unblocked',
                        'space telescope imagery',
                        'cool math games unblocked',
                        'retro arcade history',
                        'scientific american science news'
                      ];
                      const pick = lucky[Math.floor(Math.random() * lucky.length)];
                      onOpenBrowser?.(pick);
                    }}
                    className="px-4 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700 text-xs font-medium transition-colors"
                  >
                    I'm Feeling Lucky 🎲
                  </button>
                </div>

                {/* Quick Unblocked Search Chips */}
                <div className="pt-2 flex flex-wrap items-center justify-center gap-1.5 text-[11px] text-slate-400">
                  <span className="text-slate-500 mr-1">Quick Links:</span>
                  {[
                    'Wikipedia',
                    'Google Classroom',
                    'Google Docs',
                    'Google Scholar',
                    'Khan Academy'
                  ].map((topic) => (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => onOpenBrowser?.(topic)}
                      className="px-2.5 py-0.5 rounded-full bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-400/50 text-slate-300 hover:text-cyan-300 transition-colors"
                    >
                      {topic}
                    </button>
                  ))}
                </div>

                {/* Unblocked Protocol Notice */}
                <p className="text-center text-[10px] text-slate-500 pt-1">
                  🔒 Automatically streams via Google IGU unblocked proxy frames to bypass school/work filters.
                </p>
              </form>
            </div>
          </div>
        </section>

        {/* MAIN INTERACTIVE SECTION: LOGIN / SIGN IN vs ARCADE ENTER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: AUTHENTICATION PORTAL (Login & Sign In) */}
          <div className="lg:col-span-6 bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
            {/* Header Tabs: Log In vs Sign In */}
            <div className="flex items-center justify-between pb-5 border-b border-slate-800">
              <div>
                <h2 className="text-xl font-black text-white tracking-wide">
                  Arcade Access Portal
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Sign in or create an account to unlock your rank & chat
                </p>
              </div>

              {/* Segmented Auth Selector */}
              <div className="flex items-center p-1 bg-slate-950 border border-slate-800 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setLoginError('');
                    setSignupError('');
                  }}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    authMode === 'login'
                      ? 'bg-cyan-400 text-slate-950 shadow-[0_0_12px_rgba(34,211,238,0.3)]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    setLoginError('');
                    setSignupError('');
                  }}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    authMode === 'signup'
                      ? 'bg-cyan-400 text-slate-950 shadow-[0_0_12px_rgba(34,211,238,0.3)]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Sign In / Create
                </button>
              </div>
            </div>

            {/* Currently Logged In Banner */}
            {currentUser && (
              <div className="my-5 p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-[#0e1628] to-slate-950 border border-cyan-500/30 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl p-1 bg-slate-800 border border-slate-700 rounded-xl select-none">
                    {currentUser.avatar}
                  </span>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-white">
                        {currentUser.nickname || currentUser.displayName}
                      </span>
                      <span className="text-xs text-cyan-400 font-mono">
                        (@{currentUser.username})
                      </span>
                      {currentUser.rank === 'owner' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/20 border border-amber-400/50 text-amber-300 text-[10px] font-black">
                          <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          <span>OWNER</span>
                        </span>
                      )}
                      {currentUser.rank === 'moderator' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-500/20 border border-blue-400/50 text-blue-300 text-[10px] font-bold">
                          <Shield className="w-3.5 h-3.5 text-blue-400" />
                          <span>MOD</span>
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-emerald-400 font-medium">
                      ● Active Account Session
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={signOut}
                    className="px-2.5 py-1 text-xs text-rose-300 hover:text-white bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-lg transition-colors"
                  >
                    Log Out
                  </button>
                </div>
              </div>
            )}

            {/* OPTION 1: LOG IN FORM */}
            {authMode === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4 pt-4">
                {loginError && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 animate-in fade-in">
                    {loginError}
                  </div>
                )}
                {loginSuccess && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{loginSuccess}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Username
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="Username (e.g., Owner)"
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      placeholder="Password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all"
                    />
                  </div>
                </div>

                {/* Quick Owner Credentials Preset */}
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-amber-300">
                    <Crown className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" />
                    <span>Default Owner login is pre-filled!</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginUsername('Owner');
                      setLoginPassword('owner');
                    }}
                    className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-200 text-[11px] font-bold rounded-lg transition-colors"
                  >
                    Use Owner 👑
                  </button>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-sm rounded-xl shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all flex items-center justify-center gap-2 active:scale-95"
                  >
                    <span>Log In to Arcade</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={onEnterArcade}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl transition-colors"
                  >
                    Skip to Games
                  </button>
                </div>
              </form>
            ) : (
              /* OPTION 2: SIGN UP / CREATE ACCOUNT FORM */
              <form onSubmit={handleSignupSubmit} className="space-y-4 pt-4">
                {signupError && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 animate-in fade-in">
                    {signupError}
                  </div>
                )}
                {signupSuccess && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{signupSuccess}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Username *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., gamer_pro"
                      value={signupUsername}
                      onChange={(e) => setSignupUsername(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Display Name
                    </label>
                    <input
                      type="text"
                      placeholder="Nickname in chat"
                      value={signupDisplayName}
                      onChange={(e) => setSignupDisplayName(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Choose a password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {/* Avatar Icon Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Select Avatar Icon
                  </label>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {AVATARS.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setSignupAvatar(icon)}
                        className={`text-xl p-2 rounded-xl border transition-all ${
                          signupAvatar === icon
                            ? 'border-cyan-400 bg-cyan-500/20 scale-110 shadow-sm'
                            : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rank Security Policy */}
                <div className="p-3 bg-slate-950/90 border border-slate-800 rounded-xl flex items-center gap-2.5 text-xs text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>
                    New accounts join as <strong>Member (🎮)</strong>. Moderator and Owner status can only be granted by the site owner.
                  </span>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-slate-950 font-bold text-sm rounded-xl shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all flex items-center justify-center gap-2 active:scale-95"
                  >
                    <span>Create & Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={onEnterArcade}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl transition-colors"
                  >
                    Skip
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* RIGHT COLUMN: DIRECT ARCADE LAUNCH & HIGHLIGHTS */}
          <div className="lg:col-span-6 space-y-5">
            {/* BIG PLAY NOW CARD */}
            <div className="relative rounded-3xl bg-gradient-to-br from-[#12192e] via-[#0d1322] to-[#090d16] border border-cyan-500/30 p-6 sm:p-8 shadow-2xl overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/15 transition-all" />

              <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Gamepad2 className="w-4 h-4" />
                <span>Instant Unblocked Catalog</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug mb-3">
                Play 16+ Unblocked Games with Global Chat
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                All titles run in JavaScript iframes directly in your browser with zero downloads, school-friendly stealth disguise, fullscreen mode, and live multiplayer chat.
              </p>

              <button
                onClick={onEnterArcade}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-300 hover:from-cyan-300 hover:to-teal-200 text-slate-950 font-black text-base tracking-wide shadow-[0_0_30px_rgba(34,211,238,0.4)] hover:shadow-[0_0_40px_rgba(34,211,238,0.6)] transition-all flex items-center justify-center gap-2 group active:scale-98"
              >
                <span>ENTER GAME LIBRARY NOW</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* POPULAR TITLES QUICK PREVIEWS */}
            <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-5 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-200 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-400" />
                  Popular Ready-to-Play Titles
                </span>
                <button
                  onClick={onEnterArcade}
                  className="text-cyan-400 hover:underline font-semibold"
                >
                  View All ({games.length})
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {previewGames.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => {
                      onPlayGame?.(g);
                    }}
                    className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-cyan-400/50 hover:bg-slate-900 transition-all text-left group flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-xs text-white group-hover:text-cyan-300 transition-colors block">
                        {g.title}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {g.category}
                      </span>
                    </div>
                    <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-400 group-hover:text-slate-950 transition-all">
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* COMMUNITY HIGHLIGHT PILL */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900/90 to-[#101728] border border-cyan-500/20 flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 shrink-0">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-white block">Global Arcade Chat Active</span>
                  <span className="text-slate-400 text-[11px]">Chat with players, site owner 👑 and moderators</span>
                </div>
              </div>
              <span className="text-emerald-400 font-mono font-bold text-[11px] shrink-0">
                Online
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
