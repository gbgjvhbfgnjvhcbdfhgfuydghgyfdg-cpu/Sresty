import React, { useState, useEffect } from 'react';
import {
  X,
  Eye,
  EyeOff,
  Image,
  Palette,
  Shield,
  RotateCcw,
  Check,
  ExternalLink,
  Laptop,
  Sparkles,
  Layers,
  Key
} from 'lucide-react';

const PRESET_CLOAKS = [
  {
    id: 'default',
    name: 'Playground Arcade (Normal)',
    title: 'Playground Arcade - Unblocked Games Hub',
    icon: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f3ae.png',
  },
  {
    id: 'google',
    name: 'Google Search',
    title: 'Google',
    icon: 'https://www.google.com/favicon.ico',
  },
  {
    id: 'classroom',
    name: 'Google Classroom',
    title: 'Home - Google Classroom',
    icon: 'https://ssl.gstatic.com/classroom/favicon.png',
  },
  {
    id: 'drive',
    name: 'Google Drive',
    title: 'My Drive - Google Drive',
    icon: 'https://ssl.gstatic.com/docs/doclist/images/drive_2022q3_32dp.png',
  },
  {
    id: 'docs',
    name: 'Google Docs',
    title: 'Untitled document - Google Docs',
    icon: 'https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico',
  },
  {
    id: 'canvas',
    name: 'Canvas LMS',
    title: 'Dashboard - Canvas LMS',
    icon: 'https://du11hjcvx0uqb.cloudfront.net/dist/images/favicon-e10d657a73.ico',
  },
  {
    id: 'wikipedia',
    name: 'Wikipedia',
    title: 'Wikipedia, the free encyclopedia',
    icon: 'https://en.wikipedia.org/static/favicon/wikipedia.ico',
  },
  {
    id: 'edpuzzle',
    name: 'Edpuzzle',
    title: 'Edpuzzle',
    icon: 'https://edpuzzle.imgix.net/favicon.png',
  },
];

const PRESET_THEMES = [
  {
    id: 'deep-space',
    name: 'Deep Space (Default)',
    bgColor: '#080c14',
    bgGradient: 'radial-gradient(ellipse at top, #0d1527, #080c14 70%)',
    accent: 'cyan',
    previewClass: 'from-[#0d1527] to-[#080c14]',
  },
  {
    id: 'midnight-navy',
    name: 'Midnight Navy',
    bgColor: '#070f26',
    bgGradient: 'radial-gradient(ellipse at top, #0e1c4a, #070f26 70%)',
    accent: 'blue',
    previewClass: 'from-[#0e1c4a] to-[#070f26]',
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Purple',
    bgColor: '#110720',
    bgGradient: 'radial-gradient(ellipse at top, #260c45, #110720 70%)',
    accent: 'purple',
    previewClass: 'from-[#260c45] to-[#110720]',
  },
  {
    id: 'matrix',
    name: 'Matrix Terminal',
    bgColor: '#041209',
    bgGradient: 'radial-gradient(ellipse at top, #092b15, #041209 70%)',
    accent: 'emerald',
    previewClass: 'from-[#092b15] to-[#041209]',
  },
  {
    id: 'stealth-charcoal',
    name: 'Stealth Charcoal',
    bgColor: '#121212',
    bgGradient: 'radial-gradient(ellipse at top, #1f1f1f, #121212 70%)',
    accent: 'slate',
    previewClass: 'from-[#1f1f1f] to-[#121212]',
  },
  {
    id: 'sunset-synthwave',
    name: 'Sunset Synthwave',
    bgColor: '#16091e',
    bgGradient: 'radial-gradient(ellipse at top, #361036, #16091e 70%)',
    accent: 'rose',
    previewClass: 'from-[#361036] to-[#16091e]',
  },
];

export default function SettingsModal({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) {
  const [activeTab, setActiveTab] = useState('cloaking');
  const [customTitle, setCustomTitle] = useState(settings?.customTitle || '');
  const [customFavicon, setCustomFavicon] = useState(settings?.customFavicon || '');
  const [selectedCloak, setSelectedCloak] = useState(settings?.cloakPreset || 'default');
  
  // Background settings
  const [selectedTheme, setSelectedTheme] = useState(settings?.themePreset || 'deep-space');
  const [customBgImage, setCustomBgImage] = useState(settings?.bgImageUrl || '');
  const [bgBlur, setBgBlur] = useState(settings?.bgBlur ?? 0);
  const [bgOpacity, setBgOpacity] = useState(settings?.bgOpacity ?? 100);
  const [savedNotice, setSavedNotice] = useState('');

  if (!isOpen) return null;

  const handleApplyCloak = (presetId) => {
    setSelectedCloak(presetId);
    const preset = PRESET_CLOAKS.find((c) => c.id === presetId);
    if (!preset) return;

    const newSettings = {
      ...settings,
      cloakPreset: presetId,
      customTitle: presetId === 'default' ? '' : preset.title,
      customFavicon: presetId === 'default' ? '' : preset.icon,
    };
    onUpdateSettings(newSettings);
    setCustomTitle(newSettings.customTitle);
    setCustomFavicon(newSettings.customFavicon);
    showNotice(`Cloak set to ${preset.name}!`);
  };

  const handleSaveCustomCloak = (e) => {
    e.preventDefault();
    const newSettings = {
      ...settings,
      cloakPreset: 'custom',
      customTitle: customTitle.trim(),
      customFavicon: customFavicon.trim(),
    };
    onUpdateSettings(newSettings);
    showNotice('Custom cloak applied!');
  };

  const handleSelectTheme = (themeId) => {
    setSelectedTheme(themeId);
    const theme = PRESET_THEMES.find((t) => t.id === themeId);
    if (!theme) return;

    const newSettings = {
      ...settings,
      themePreset: themeId,
      bgColor: theme.bgColor,
      bgGradient: theme.bgGradient,
    };
    onUpdateSettings(newSettings);
    showNotice(`Theme updated to ${theme.name}!`);
  };

  const handleSaveBgImage = (e) => {
    e.preventDefault();
    const newSettings = {
      ...settings,
      bgImageUrl: customBgImage.trim(),
      bgBlur,
      bgOpacity,
    };
    onUpdateSettings(newSettings);
    showNotice('Custom background updated!');
  };

  const handleClearBgImage = () => {
    setCustomBgImage('');
    const newSettings = {
      ...settings,
      bgImageUrl: '',
    };
    onUpdateSettings(newSettings);
    showNotice('Custom background image removed.');
  };

  const handleLaunchAboutBlank = () => {
    try {
      const url = window.location.href;
      const win = window.open('about:blank', '_blank');
      if (!win) {
        alert('Please allow popups for this site to open about:blank cloak.');
        return;
      }
      const doc = win.document;
      doc.title = customTitle || 'Classes';
      const iframe = doc.createElement('iframe');
      iframe.style.border = 'none';
      iframe.style.width = '100vw';
      iframe.style.height = '100vh';
      iframe.style.margin = '0';
      iframe.style.padding = '0';
      iframe.style.position = 'fixed';
      iframe.style.top = '0';
      iframe.style.left = '0';
      iframe.src = url;
      doc.body.style.margin = '0';
      doc.body.appendChild(iframe);
      showNotice('About:Blank window launched!');
    } catch (e) {
      alert('Could not launch about:blank cloak: ' + e.message);
    }
  };

  const showNotice = (text) => {
    setSavedNotice(text);
    setTimeout(() => setSavedNotice(''), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0b101d] border border-cyan-500/30 rounded-3xl shadow-[0_0_60px_rgba(34,211,238,0.2)] p-6 sm:p-7 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide">
                Portal Settings & Cloaking
              </h2>
              <p className="text-xs text-slate-400">
                Disguise your browser tab and customize site backgrounds
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

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 pt-4 pb-3 border-b border-slate-800 shrink-0">
          <button
            onClick={() => setActiveTab('cloaking')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'cloaking'
                ? 'bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(34,211,238,0.3)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <EyeOff className="w-4 h-4" />
            <span>Tab Cloaking</span>
          </button>
          <button
            onClick={() => setActiveTab('background')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'background'
                ? 'bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(34,211,238,0.3)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Image className="w-4 h-4" />
            <span>Theme & Background</span>
          </button>
        </div>

        {/* Notice alert */}
        {savedNotice && (
          <div className="mt-3 p-3 bg-emerald-500/15 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2 shrink-0 animate-in fade-in">
            <Check className="w-4 h-4 shrink-0" />
            <span>{savedNotice}</span>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto pt-4 pr-1 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
          {/* TAB 1: TAB CLOAKING */}
          {activeTab === 'cloaking' && (
            <div className="space-y-6">
              {/* Presets Grid */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Preset Tab Disguises
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {PRESET_CLOAKS.map((cloak) => {
                    const isCurrent = selectedCloak === cloak.id;
                    return (
                      <button
                        key={cloak.id}
                        type="button"
                        onClick={() => handleApplyCloak(cloak.id)}
                        className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between group ${
                          isCurrent
                            ? 'bg-cyan-500/15 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                            : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                        }`}
                      >
                        <div className="flex items-center gap-3 truncate">
                          <img
                            src={cloak.icon}
                            alt=""
                            className="w-5 h-5 object-contain shrink-0 rounded"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                          <div className="truncate">
                            <span className="font-bold text-xs text-white block group-hover:text-cyan-300 transition-colors">
                              {cloak.name}
                            </span>
                            <span className="text-[11px] text-slate-400 truncate block">
                              {cloak.title}
                            </span>
                          </div>
                        </div>
                        {isCurrent && (
                          <span className="w-5 h-5 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center shrink-0">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Title & Favicon Form */}
              <form onSubmit={handleSaveCustomCloak} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3.5">
                <span className="text-xs font-bold text-slate-200 block">
                  Custom Tab Cloak (Manual Override)
                </span>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
                    Custom Page Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., AP Biology Study Guide - Chapter 3"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
                    Custom Favicon Icon URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://... (Direct image/ico URL)"
                    value={customFavicon}
                    onChange={(e) => setCustomFavicon(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => handleApplyCloak('default')}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset to Default</span>
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all"
                  >
                    Save Custom Cloak
                  </button>
                </div>
              </form>

              {/* About:Blank Launcher Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/30 via-slate-900 to-slate-900 border border-purple-500/30 flex items-center justify-between gap-4">
                <div>
                  <span className="font-bold text-xs text-purple-300 block">
                    Launch in about:blank (Stealth Window)
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Opens this entire portal in an about:blank iframe so the address bar leaves zero browser history.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleLaunchAboutBlank}
                  className="px-4 py-2.5 bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 shrink-0"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Window</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: THEME & BACKGROUND */}
          {activeTab === 'background' && (
            <div className="space-y-6">
              {/* Preset Theme Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Arcade Color Themes
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {PRESET_THEMES.map((theme) => {
                    const isSelected = selectedTheme === theme.id;
                    return (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => handleSelectTheme(theme.id)}
                        className={`p-3 rounded-2xl border text-left transition-all ${
                          isSelected
                            ? 'border-cyan-400 bg-cyan-500/10 shadow-[0_0_15px_rgba(34,211,238,0.25)]'
                            : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                        }`}
                      >
                        <div
                          className={`w-full h-12 rounded-xl bg-gradient-to-br ${theme.previewClass} border border-slate-700/60 mb-2 flex items-center justify-center`}
                        >
                          {isSelected && <Check className="w-4 h-4 text-cyan-400" />}
                        </div>
                        <span className="text-xs font-bold text-white block">
                          {theme.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Image URL Form */}
              <form onSubmit={handleSaveBgImage} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 block">
                    Custom Wallpaper / Background Image
                  </span>
                  {customBgImage && (
                    <button
                      type="button"
                      onClick={handleClearBgImage}
                      className="text-xs text-rose-400 hover:underline"
                    >
                      Remove Wallpaper
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
                    Image Direct URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/... or any image link"
                    value={customBgImage}
                    onChange={(e) => setCustomBgImage(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1 flex items-center justify-between">
                      <span>Blur Filter</span>
                      <span className="text-cyan-400 font-mono">{bgBlur}px</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="20"
                      value={bgBlur}
                      onChange={(e) => setBgBlur(Number(e.target.value))}
                      className="w-full accent-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1 flex items-center justify-between">
                      <span>Image Opacity</span>
                      <span className="text-cyan-400 font-mono">{bgOpacity}%</span>
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={bgOpacity}
                      onChange={(e) => setBgOpacity(Number(e.target.value))}
                      className="w-full accent-cyan-400"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all"
                  >
                    Apply Wallpaper
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
