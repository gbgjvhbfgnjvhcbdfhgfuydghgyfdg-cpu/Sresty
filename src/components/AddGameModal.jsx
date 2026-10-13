import React, { useState } from 'react';
import { X, Plus, Code, Globe, HelpCircle } from 'lucide-react';

export default function AddGameModal({ isOpen, onClose, onAddGame }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Arcade');
  const [description, setDescription] = useState('');
  const [controls, setControls] = useState('Arrow keys or Mouse');
  const [embedInput, setEmbedInput] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const cleanTitle = title.trim();
    if (!cleanTitle) {
      setError('Please provide a game title.');
      return;
    }

    const cleanEmbed = embedInput.trim();
    if (!cleanEmbed) {
      setError('Please enter either an iframe embed code or a valid web URL.');
      return;
    }

    let src = '';
    let iframeSnippet = '';

    if (cleanEmbed.toLowerCase().startsWith('<iframe')) {
      const match = cleanEmbed.match(/src=["'](.*?)["']/);
      if (match && match[1]) {
        src = match[1];
        iframeSnippet = cleanEmbed;
      } else {
        setError('The iframe tag does not contain a valid src attribute.');
        return;
      }
    } else if (cleanEmbed.startsWith('http://') || cleanEmbed.startsWith('https://') || cleanEmbed.startsWith('/')) {
      src = cleanEmbed;
      iframeSnippet = `<iframe src="${cleanEmbed}" width="100%" height="100%" allow="fullscreen; autoplay; gamepad" frameborder="0"></iframe>`;
    } else {
      setError('Please enter a valid URL (starting with https://) or an <iframe> tag.');
      return;
    }

    const newGame = {
      id: `custom-${Date.now()}`,
      title: cleanTitle,
      category,
      description: description.trim() || 'Custom user-submitted web game.',
      controls: controls.trim() || 'Arrow keys / Mouse',
      plays: 1,
      rating: 5.0,
      icon: 'Globe',
      isCustom: true,
      src,
      iframe: iframeSnippet,
    };

    onAddGame(newGame);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0d1424] border border-cyan-500/30 rounded-2xl shadow-[0_0_40px_rgba(34,211,238,0.2)] p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-white">Add Custom Game</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Paste an iframe embed code or external game URL to add to your arcade
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-xs text-rose-300">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Game Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Retro Racer 3D"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="Arcade">Arcade</option>
                <option value="Puzzle">Puzzle</option>
                <option value="Classics">Classics</option>
                <option value="Action">Action</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Controls Hint
              </label>
              <input
                type="text"
                placeholder="e.g. WASD to drive"
                value={controls}
                onChange={(e) => setControls(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Iframe Embed Code or Game URL *
            </label>
            <textarea
              required
              rows={3}
              placeholder='<iframe src="https://example.com/game"></iframe> or https://example.com/game'
              value={embedInput}
              onChange={(e) => setEmbedInput(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-cyan-300 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 resize-none"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Supports standard HTML &lt;iframe&gt; embeds or direct links.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Short Description (Optional)
            </label>
            <input
              type="text"
              placeholder="Brief summary of gameplay"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all active:scale-95"
            >
              Save to Library
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
