import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import {
  X,
  Crown,
  Shield,
  User,
  LogOut,
  Check,
  Ban,
  VolumeX,
  Volume2,
  Key,
  Lock,
  Sparkles,
  UserCheck,
  Settings,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Edit3
} from 'lucide-react';

export default function AccountModal({ isOpen, onClose }) {
  const {
    currentUser,
    users,
    signIn,
    signUp,
    signOut,
    setRank,
    toggleMute,
    toggleBan,
    updateProfile,
    changeUsername,
    changePassword,
    updateNickname,
  } = useAuth();

  // Tab: 'profile' | 'edit_profile' | 'security' | 'admin' | 'signin' | 'signup'
  const [tab, setTab] = useState(currentUser ? 'profile' : 'signin');

  // Sign In state
  const [signInUsername, setSignInUsername] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Sign Up state
  const [signUpUsername, setSignUpUsername] = useState('');
  const [signUpNickname, setSignUpNickname] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpAvatar, setSignUpAvatar] = useState('🎮');

  // Edit Profile / Nickname state
  const [editNickname, setEditNickname] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editAvatar, setEditAvatar] = useState('👑');

  // Change Username state
  const [newUsernameInput, setNewUsernameInput] = useState('');

  // Change Password state
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Feedback notifications
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Sync edit fields when opening or switching tabs
  useEffect(() => {
    if (currentUser) {
      setEditNickname(currentUser.nickname || currentUser.displayName || '');
      setEditBio(currentUser.bio || '');
      setEditAvatar(currentUser.avatar || '🎮');
      setNewUsernameInput(currentUser.username || '');
    }
  }, [currentUser, tab]);

  if (!isOpen) return null;

  const showSuccess = (msg) => {
    setSuccess(msg);
    setError('');
    setTimeout(() => setSuccess(''), 3000);
  };

  const showError = (msg) => {
    setError(msg);
    setSuccess('');
  };

  // 1. Sign In Handler
  const handleSignIn = (e) => {
    e.preventDefault();
    setError('');
    const res = signIn(signInUsername, signInPassword);
    if (!res.success) {
      showError(res.error);
    } else {
      showSuccess(`Signed in as ${res.user.nickname || res.user.displayName}!`);
      setTimeout(() => setTab('profile'), 400);
    }
  };

  // 2. Sign Up Handler
  const handleSignUp = (e) => {
    e.preventDefault();
    setError('');
    const res = signUp(
      signUpUsername,
      signUpPassword,
      signUpNickname,
      signUpAvatar,
      'member',
      signUpNickname
    );
    if (!res.success) {
      showError(res.error);
    } else {
      showSuccess('Account created and logged in!');
      setTimeout(() => setTab('profile'), 400);
    }
  };

  // 3. Save Nickname & Profile Handler
  const handleSaveNicknameAndProfile = (e) => {
    e.preventDefault();
    if (!editNickname.trim()) {
      showError('Nickname cannot be empty.');
      return;
    }
    updateProfile(editNickname.trim(), editBio, editAvatar, editNickname.trim());
    showSuccess('Nickname and profile updated successfully!');
  };

  // 4. Change Username Handler
  const handleChangeUsernameSubmit = (e) => {
    e.preventDefault();
    if (!newUsernameInput.trim()) {
      showError('Please enter a new username.');
      return;
    }
    const res = changeUsername(newUsernameInput.trim());
    if (!res.success) {
      showError(res.error);
    } else {
      showSuccess(`Username successfully updated to @${res.newUsername}!`);
    }
  };

  // 5. Change Password Handler
  const handleChangePasswordSubmit = (e) => {
    e.preventDefault();
    if (!newPasswordInput) {
      showError('Please enter a new password.');
      return;
    }
    if (newPasswordInput.length < 3) {
      showError('New password must be at least 3 characters.');
      return;
    }
    if (newPasswordInput !== confirmPasswordInput) {
      showError('New passwords do not match.');
      return;
    }

    const res = changePassword(newPasswordInput, currentPasswordInput);
    if (!res.success) {
      showError(res.error);
    } else {
      showSuccess('Password updated successfully!');
      setCurrentPasswordInput('');
      setNewPasswordInput('');
      setConfirmPasswordInput('');
    }
  };

  const AVATAR_OPTIONS = ['👑', '🛡️', '🎮', '⚡', '🔥', '🚀', '👾', '🎯', '🐱', '🦊', '🐉', '💎', '🏆', '🌟'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#0d1424] border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(34,211,238,0.2)] p-5 sm:p-6 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-purple-500/20 border border-amber-400/40 flex items-center justify-center text-xl">
              {currentUser?.avatar || '🎮'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                User Account & Settings
              </h2>
              <p className="text-xs text-slate-400">
                {currentUser
                  ? `Signed in as ${currentUser.nickname || currentUser.displayName} (@${currentUser.username})`
                  : 'Sign in or create an arcade account'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 sm:gap-2 pt-3 pb-2 border-b border-slate-800/80 shrink-0 overflow-x-auto no-scrollbar">
          {currentUser ? (
            <>
              <button
                onClick={() => {
                  setTab('profile');
                  setError('');
                }}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                  tab === 'profile'
                    ? 'bg-cyan-400 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Profile & Stats
              </button>
              <button
                onClick={() => {
                  setTab('edit_profile');
                  setError('');
                }}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  tab === 'edit_profile'
                    ? 'bg-cyan-400 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Nickname & Avatar</span>
              </button>
              <button
                onClick={() => {
                  setTab('security');
                  setError('');
                }}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  tab === 'security'
                    ? 'bg-cyan-400 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Username & Password</span>
              </button>
              {currentUser.rank === 'owner' && (
                <button
                  onClick={() => {
                    setTab('admin');
                    setError('');
                  }}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    tab === 'admin'
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : 'text-amber-400/80 hover:text-amber-300 hover:bg-slate-800'
                  }`}
                >
                  <Crown className="w-3.5 h-3.5" />
                  <span>Owner Console</span>
                </button>
              )}
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setTab('signin');
                  setError('');
                }}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  tab === 'signin'
                    ? 'bg-cyan-400 text-slate-950'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setTab('signup');
                  setError('');
                }}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  tab === 'signup'
                    ? 'bg-cyan-400 text-slate-950'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Create Account
              </button>
            </>
          )}
        </div>

        {/* Feedback Alerts */}
        {error && (
          <div className="mt-3 p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2 shrink-0 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="mt-3 p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2 shrink-0 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto pt-4 pr-1 space-y-4">
          {/* TAB 1: PROFILE OVERVIEW */}
          {tab === 'profile' && currentUser && (
            <div className="space-y-4">
              {/* Profile Card */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="text-4xl p-2 bg-slate-800 border border-slate-700 rounded-2xl select-none">
                    {currentUser.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-lg font-black text-white">
                        {currentUser.nickname || currentUser.displayName}
                      </span>
                      {/* GOLD CROWN FOR OWNER */}
                      {currentUser.rank === 'owner' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-400/50 text-amber-300 text-xs font-black shadow-[0_0_10px_rgba(251,191,36,0.3)]">
                          <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          <span>OWNER</span>
                        </span>
                      )}
                      {currentUser.rank === 'moderator' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-500/20 border border-blue-400/50 text-blue-300 text-xs font-bold">
                          <Shield className="w-3.5 h-3.5 text-blue-400" />
                          <span>MODERATOR</span>
                        </span>
                      )}
                      {currentUser.rank === 'member' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span>MEMBER</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1 font-mono">
                      Username: <span className="text-cyan-400">@{currentUser.username}</span> · Member since {currentUser.joinedDate}
                    </p>
                  </div>
                </div>

                <button
                  onClick={signOut}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-300 hover:text-white bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-colors self-start sm:self-center"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>

              {/* Quick Actions Shortcuts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  onClick={() => setTab('edit_profile')}
                  className="p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/40 text-left transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Change Nickname & Avatar
                    </span>
                    <span className="text-xs text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">Edit →</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Current Nickname: <strong className="text-slate-200">{currentUser.nickname || currentUser.displayName}</strong>
                  </p>
                </button>

                <button
                  onClick={() => setTab('security')}
                  className="p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/40 text-left transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-cyan-400" /> Change Username & Password
                    </span>
                    <span className="text-xs text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">Manage →</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Username: <span className="text-cyan-300 font-mono">@{currentUser.username}</span>
                  </p>
                </button>
              </div>

              {/* Bio display */}
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Bio / Status
                </span>
                <p className="text-xs text-slate-200 italic">
                  "{currentUser.bio || 'Arcade gamer ready for high scores.'}"
                </p>
              </div>

              {/* Authority Information */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 via-slate-900 to-[#141b2d] border border-cyan-500/20">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block mb-2">
                  Account Privileges
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase">Chat Status</span>
                    <span className="text-white font-medium">
                      {currentUser.isMuted ? '🔇 Muted' : '🟢 Unrestricted'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase">Rank Powers</span>
                    <span className="text-white font-medium">
                      {currentUser.rank === 'owner' ? '👑 Absolute Owner' : currentUser.rank === 'moderator' ? '🛡️ Moderate & Mute' : '🎮 Standard Player'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase">Meets & Video</span>
                    <span className="text-emerald-400 font-bold">Enabled</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EDIT NICKNAME & PROFILE */}
          {tab === 'edit_profile' && currentUser && (
            <form onSubmit={handleSaveNicknameAndProfile} className="space-y-4">
              <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs text-cyan-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>
                  Your <strong>Nickname</strong> is how other players see you in Global Chat, Direct Messages, Meets, and leaderboards!
                </span>
              </div>

              {/* Nickname Input */}
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  Arcade Nickname *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={editNickname}
                    onChange={(e) => setEditNickname(e.target.value)}
                    placeholder="Enter your custom nickname..."
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Unique or flashy name (e.g., TheDestroyer, RetroKing, NeonAce)
                </p>
              </div>

              {/* Avatar Picker */}
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">
                  Select Avatar Icon
                </label>
                <div className="flex flex-wrap gap-2">
                  {AVATAR_OPTIONS.map((ico) => (
                    <button
                      key={ico}
                      type="button"
                      onClick={() => setEditAvatar(ico)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all ${
                        editAvatar === ico
                          ? 'bg-cyan-400/20 border-2 border-cyan-400 scale-105 shadow-[0_0_12px_rgba(34,211,238,0.4)]'
                          : 'bg-slate-900 border border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {ico}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bio Input */}
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  Bio / Status
                </label>
                <textarea
                  rows={2}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Share a short bio or favorite games..."
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs rounded-xl shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all flex items-center gap-2 active:scale-95"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Nickname & Profile</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTab('profile')}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors"
                >
                  Back to Profile
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: USERNAME & PASSWORD MANAGEMENT */}
          {tab === 'security' && currentUser && (
            <div className="space-y-6">
              {/* SECTION 1: CHANGE USERNAME */}
              <form onSubmit={handleChangeUsernameSubmit} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Change Username (@user)
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Current: @{currentUser.username}
                  </span>
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">
                    New Username *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-xs">@</span>
                    <input
                      type="text"
                      required
                      value={newUsernameInput}
                      onChange={(e) => setNewUsernameInput(e.target.value)}
                      placeholder="new_username"
                      className="w-full pl-8 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Minimum 3 characters. Letters, numbers, hyphens, and underscores only.
                  </p>
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-1.5 active:scale-95"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Update Username</span>
                </button>
              </form>

              {/* SECTION 2: CHANGE PASSWORD */}
              <form onSubmit={handleChangePasswordSubmit} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                  <Lock className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Change Password
                  </span>
                </div>

                {/* Current Password (if account has one) */}
                {currentUser.password && (
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">
                      Current Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPass ? 'text' : 'password'}
                        required
                        value={currentPasswordInput}
                        onChange={(e) => setCurrentPasswordInput(e.target.value)}
                        placeholder="Current password"
                        className="w-full px-3.5 py-2 pr-10 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPass(!showCurrentPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {/* New Password */}
                <div>
                  <label className="block text-xs text-slate-300 mb-1">
                    New Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPass ? 'text' : 'password'}
                      required
                      value={newPasswordInput}
                      onChange={(e) => setNewPasswordInput(e.target.value)}
                      placeholder="At least 3 characters"
                      className="w-full px-3.5 py-2 pr-10 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className="block text-xs text-slate-300 mb-1">
                    Confirm New Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPass ? 'text' : 'password'}
                      required
                      value={confirmPasswordInput}
                      onChange={(e) => setConfirmPasswordInput(e.target.value)}
                      placeholder="Re-enter new password"
                      className="w-full px-3.5 py-2 pr-10 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPass(!showConfirmPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {confirmPasswordInput && confirmPasswordInput !== newPasswordInput && (
                    <p className="text-[11px] text-rose-400 mt-1">Passwords do not match</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-1.5 active:scale-95"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>Update Password</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: OWNER ADMIN PANEL */}
          {tab === 'admin' && currentUser?.rank === 'owner' && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between text-xs text-amber-300">
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-amber-400" />
                  <span>Site Owner Management Console: Mute, Ban, and Promote</span>
                </div>
                <span className="font-mono text-[11px] text-slate-400">{users.length} registered</span>
              </div>

              <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl bg-slate-900/60 overflow-hidden">
                {users.map((u) => {
                  const isSelf = u.username.toLowerCase() === currentUser.username.toLowerCase();
                  return (
                    <div
                      key={u.username}
                      className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-800/40 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl p-1 bg-slate-800 rounded-lg">{u.avatar}</span>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold text-white">
                              {u.nickname || u.displayName}
                            </span>
                            <span className="text-xs text-cyan-400 font-mono">(@{u.username})</span>
                            {u.rank === 'owner' && (
                              <span className="text-[10px] font-black text-amber-400 flex items-center gap-0.5">
                                <Crown className="w-3 h-3 fill-amber-400" /> OWNER
                              </span>
                            )}
                            {u.rank === 'moderator' && (
                              <span className="text-[10px] font-bold text-blue-400 flex items-center gap-0.5">
                                <Shield className="w-3 h-3" /> MOD
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                            {u.isBanned ? (
                              <span className="text-rose-400 font-bold">● BANNED</span>
                            ) : u.isMuted ? (
                              <span className="text-amber-400 font-bold">● MUTED</span>
                            ) : (
                              <span className="text-emerald-400">● Active</span>
                            )}
                            <span>· Joined {u.joinedDate}</span>
                          </div>
                        </div>
                      </div>

                      {/* Moderation Action Buttons */}
                      {!isSelf && (
                        <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                          {/* Promote / Demote */}
                          {u.rank === 'moderator' ? (
                            <button
                              onClick={() => setRank(u.username, 'member')}
                              className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold hover:bg-slate-700 transition-colors"
                              title="Demote to Member"
                            >
                              Demote
                            </button>
                          ) : (
                            <button
                              onClick={() => setRank(u.username, 'moderator')}
                              className="px-2.5 py-1 rounded bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border border-blue-500/30 text-xs font-semibold transition-colors flex items-center gap-1"
                              title="Promote to Moderator"
                            >
                              <Shield className="w-3 h-3" />
                              <span>Make Mod</span>
                            </button>
                          )}

                          {/* Mute Toggle */}
                          <button
                            onClick={() => toggleMute(u.username)}
                            className={`p-1.5 rounded text-xs font-semibold transition-colors ${
                              u.isMuted
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                            }`}
                            title={u.isMuted ? 'Unmute User' : 'Mute User in Global Chat'}
                          >
                            {u.isMuted ? <VolumeX className="w-4 h-4 text-amber-400" /> : <Volume2 className="w-4 h-4" />}
                          </button>

                          {/* Ban Toggle */}
                          <button
                            onClick={() => toggleBan(u.username)}
                            className={`p-1.5 rounded text-xs font-semibold transition-colors ${
                              u.isBanned
                                ? 'bg-rose-500 text-white'
                                : 'bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 border border-rose-500/30'
                            }`}
                            title={u.isBanned ? 'Unban User' : 'Ban User from Site'}
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5: SIGN IN */}
          {tab === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Username (@user)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Owner"
                  value={signInUsername}
                  onChange={(e) => setSignInUsername(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Password"
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Quick Owner Fill Shortcut */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs text-amber-300">
                <div className="flex items-center gap-1.5">
                  <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>Log in as Owner</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSignInUsername('Owner');
                    setSignInPassword('owner');
                  }}
                  className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-[11px] font-bold"
                >
                  Use Owner (owner)
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-sm rounded-xl shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all"
              >
                Sign In to Arcade
              </button>
            </form>
          )}

          {/* TAB 6: CREATE ACCOUNT */}
          {tab === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Username (@user) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., retro_ace"
                    value={signUpUsername}
                    onChange={(e) => setSignUpUsername(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nickname (Display Name)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., The Master"
                    value={signUpNickname}
                    onChange={(e) => setSignUpNickname(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
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
                  placeholder="Choose password (min 3 chars)"
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Choose Avatar
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {AVATAR_OPTIONS.map((ico) => (
                    <button
                      key={ico}
                      type="button"
                      onClick={() => setSignUpAvatar(ico)}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all ${
                        signUpAvatar === ico
                          ? 'bg-cyan-400/20 border-2 border-cyan-400 scale-105'
                          : 'bg-slate-900 border border-slate-800'
                      }`}
                    >
                      {ico}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rank Security Policy */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-2.5 text-xs text-slate-400">
                <Shield className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>
                  All new registrations join as <strong>Member (🎮)</strong>. Moderator and Owner status can only be granted by the site owner.
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-slate-950 font-bold text-sm rounded-xl shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all"
              >
                Create Account & Join
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
