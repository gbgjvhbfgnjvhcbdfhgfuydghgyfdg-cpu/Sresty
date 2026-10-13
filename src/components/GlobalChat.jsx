import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import {
  MessageSquare,
  Send,
  X,
  Crown,
  Shield,
  User,
  Trash2,
  VolumeX,
  Volume2,
  Ban,
  UserPlus,
  Sparkles,
  Smile,
  ChevronDown,
  Minimize2,
  Maximize2,
  Search,
  Users,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Tv,
  Copy,
  Check,
  PhoneCall,
  PhoneOff,
  ArrowLeft,
  Circle,
  Share2
} from 'lucide-react';

const INITIAL_GLOBAL_MESSAGES = [
  {
    id: 'msg-1',
    username: 'Owner',
    displayName: 'ArcadeOwner',
    avatar: '👑',
    rank: 'owner',
    text: 'Welcome to Playground Arcade! Enjoy all the classic games. Keep it friendly in chat!',
    timestamp: '10:00 AM',
    timeValue: Date.now() - 3600000,
  },
  {
    id: 'msg-2',
    username: 'PixelMod',
    displayName: 'PixelMod',
    avatar: '🛡️',
    rank: 'moderator',
    text: 'Just scored 28,400 on Snake! Anyone able to beat my record today?',
    timestamp: '10:14 AM',
    timeValue: Date.now() - 2700000,
  },
  {
    id: 'msg-3',
    username: 'RetroGamer99',
    displayName: 'RetroGamer',
    avatar: '🎮',
    rank: 'member',
    text: 'Retro Bowl and Tetris are running super smooth. Loving the normal graphics!',
    timestamp: '10:22 AM',
    timeValue: Date.now() - 1800000,
  },
  {
    id: 'msg-4',
    username: 'SpeedRunnerX',
    displayName: 'SpeedRunner',
    avatar: '⚡',
    rank: 'member',
    text: 'Subway Surfers run was insane, made it to 150k before crashing haha',
    timestamp: '10:35 AM',
    timeValue: Date.now() - 900000,
  },
];

const INITIAL_DIRECT_MESSAGES = {
  // Keyed by pair identifier e.g. 'Owner__PixelMod'
  'Owner__PixelMod': [
    {
      id: 'dm-1',
      senderUsername: 'PixelMod',
      receiverUsername: 'Owner',
      senderName: 'PixelMod',
      avatar: '🛡️',
      rank: 'moderator',
      text: 'Hey boss! The arcade server is running great today, no rule violations in global chat.',
      timestamp: '10:05 AM',
      timeValue: Date.now() - 3200000,
    },
    {
      id: 'dm-2',
      senderUsername: 'Owner',
      receiverUsername: 'PixelMod',
      senderName: 'ArcadeOwner',
      avatar: '👑',
      rank: 'owner',
      text: 'Awesome work PixelMod! Thanks for keeping the community friendly.',
      timestamp: '10:08 AM',
      timeValue: Date.now() - 3000000,
    },
  ],
  'Owner__RetroGamer99': [
    {
      id: 'dm-3',
      senderUsername: 'RetroGamer99',
      receiverUsername: 'Owner',
      senderName: 'RetroGamer',
      avatar: '🎮',
      rank: 'member',
      text: 'Hey! Are we doing a high score tournament in a meet room later?',
      timestamp: '10:25 AM',
      timeValue: Date.now() - 1500000,
    },
  ],
};

export default function GlobalChat({
  isOpen,
  onClose,
  onOpenAccount,
  initialTab = 'global', // 'global' | 'direct' | 'meets'
}) {
  const { currentUser, users, setRank, toggleMute, toggleBan, isOwner, isModerator } = useAuth();

  // Active top tab inside the drawer
  const [activeTab, setActiveTab] = useState(initialTab); // 'global' | 'direct' | 'meets'

  // Global Chat state
  const [globalMessages, setGlobalMessages] = useState(() => {
    try {
      const stored = localStorage.getItem('playground_global_chat');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_GLOBAL_MESSAGES;
  });

  const [inputGlobalMessage, setInputGlobalMessage] = useState('');
  const [selectedUserAction, setSelectedUserAction] = useState(null); // moderation popover

  // Direct Messages state
  const [directMessages, setDirectMessages] = useState(() => {
    try {
      const stored = localStorage.getItem('playground_direct_messages');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return INITIAL_DIRECT_MESSAGES;
  });

  const [searchUserQuery, setSearchUserQuery] = useState('');
  const [activeDmUser, setActiveDmUser] = useState(null); // The user object we are chatting with in DM
  const [inputDmMessage, setInputDmMessage] = useState('');

  // Meets / Voice & Video Room state
  const [meetRoomCode, setMeetRoomCode] = useState('');
  const [activeMeet, setActiveMeet] = useState(null); // { code, participants: [...], messages: [...] }
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [meetInputMessage, setMeetInputMessage] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  // General layout state
  const [actionNotice, setActionNotice] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);
  const dmMessagesEndRef = useRef(null);
  const meetMessagesEndRef = useRef(null);

  // Sync initialTab if prop changes
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Sync global messages to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('playground_global_chat', JSON.stringify(globalMessages));
    } catch (e) {}
  }, [globalMessages]);

  // Sync direct messages to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('playground_direct_messages', JSON.stringify(directMessages));
    } catch (e) {}
  }, [directMessages]);

  // Auto-scroll
  useEffect(() => {
    if (isOpen && !isMinimized) {
      if (activeTab === 'global') {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      } else if (activeTab === 'direct' && activeDmUser) {
        dmMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      } else if (activeTab === 'meets' && activeMeet) {
        meetMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [globalMessages, directMessages, activeTab, activeDmUser, activeMeet, isOpen, isMinimized]);

  const showNotification = (msg) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(''), 2500);
  };

  // ----------------------------------------------------
  // GLOBAL CHAT ACTIONS
  // ----------------------------------------------------
  const handleSendGlobalMessage = (e) => {
    e.preventDefault();
    if (!inputGlobalMessage.trim()) return;

    if (!currentUser) {
      onOpenAccount?.();
      return;
    }

    if (currentUser.isBanned) {
      showNotification('Your account is banned.');
      return;
    }

    if (currentUser.isMuted) {
      showNotification('You are muted by site administration.');
      return;
    }

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      username: currentUser.username,
      displayName: currentUser.displayName,
      avatar: currentUser.avatar || '🎮',
      rank: currentUser.rank || 'member',
      text: inputGlobalMessage.trim(),
      timestamp: timeStr,
      timeValue: Date.now(),
    };

    setGlobalMessages((prev) => [...prev, newMsg]);
    setInputGlobalMessage('');
  };

  const handleDeleteGlobalMessage = (msgId) => {
    if (!isOwner && !isModerator) return;
    setGlobalMessages((prev) => prev.filter((m) => m.id !== msgId));
    showNotification('Message deleted');
  };

  // ----------------------------------------------------
  // DIRECT MESSAGING (PRIVATE CHAT) ACTIONS
  // ----------------------------------------------------
  const getDmThreadKey = (u1, u2) => {
    if (!u1 || !u2) return '';
    const sorted = [u1.toLowerCase(), u2.toLowerCase()].sort();
    return `${sorted[0]}__${sorted[1]}`;
  };

  const handleStartDmWithUser = (targetUser) => {
    if (!currentUser) {
      onOpenAccount?.();
      return;
    }
    setActiveDmUser(targetUser);
    setActiveTab('direct');
  };

  const handleSendDmMessage = (e) => {
    e.preventDefault();
    if (!inputDmMessage.trim() || !activeDmUser || !currentUser) return;

    if (currentUser.isBanned) {
      showNotification('Your account is banned.');
      return;
    }

    const key = getDmThreadKey(currentUser.username, activeDmUser.username);
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg = {
      id: `dm-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      senderUsername: currentUser.username,
      receiverUsername: activeDmUser.username,
      senderName: currentUser.displayName,
      avatar: currentUser.avatar || '🎮',
      rank: currentUser.rank || 'member',
      text: inputDmMessage.trim(),
      timestamp: timeStr,
      timeValue: Date.now(),
    };

    setDirectMessages((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), newMsg],
    }));
    setInputDmMessage('');

    // Simulated responsive reply if chatting with default arcade community members
    const targetUsername = activeDmUser.username;
    if (['PixelMod', 'RetroGamer99', 'SpeedRunnerX'].includes(targetUsername)) {
      setTimeout(() => {
        const replyResponses = [
          'Sounds awesome! Let me know if you want to hop on a meet room and play!',
          'Got your message! Hope you are enjoying the unblocked games!',
          'Nice! Check out the new Retro Bowl and 2048 highscores!',
          'Haha agreed! Send me the meet room code whenever you are ready!'
        ];
        const randomReply = replyResponses[Math.floor(Math.random() * replyResponses.length)];
        const replyMsg = {
          id: `dm-reply-${Date.now()}`,
          senderUsername: activeDmUser.username,
          receiverUsername: currentUser.username,
          senderName: activeDmUser.displayName,
          avatar: activeDmUser.avatar || '🎮',
          rank: activeDmUser.rank || 'member',
          text: randomReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          timeValue: Date.now(),
        };
        setDirectMessages((prev) => ({
          ...prev,
          [key]: [...(prev[key] || []), replyMsg],
        }));
      }, 1400);
    }
  };

  // ----------------------------------------------------
  // MEETS / VIDEO ROOM ACTIONS
  // ----------------------------------------------------
  const handleJoinOrCreateMeet = (codeToJoin) => {
    if (!currentUser) {
      onOpenAccount?.();
      return;
    }

    const cleanCode = (codeToJoin || meetRoomCode).trim().toUpperCase();
    if (!cleanCode) {
      showNotification('Please enter a meet room code.');
      return;
    }

    // Load or initialize room state from localStorage
    const storageKey = `arcade_meet_${cleanCode}`;
    let roomData = {
      code: cleanCode,
      participants: [
        {
          username: currentUser.username,
          displayName: currentUser.displayName,
          avatar: currentUser.avatar,
          rank: currentUser.rank,
          isMicOn: true,
          isCamOn: true,
          isSelf: true,
        },
      ],
      messages: [
        {
          id: `meet-sys-${Date.now()}`,
          sender: 'System',
          text: `Meet room ${cleanCode} active! Share code with friends to join together.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
    };

    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.participants) {
          // Add self if not present
          const exists = parsed.participants.some(
            (p) => p.username.toLowerCase() === currentUser.username.toLowerCase()
          );
          if (!exists) {
            parsed.participants.push({
              username: currentUser.username,
              displayName: currentUser.displayName,
              avatar: currentUser.avatar,
              rank: currentUser.rank,
              isMicOn: true,
              isCamOn: true,
              isSelf: true,
            });
          }
          roomData = parsed;
        }
      } else {
        // If joining with a preset code like 'CO-OP' or 'ARCADE-101', seed with a friendly participant
        if (['ARCADE-1', 'SQUAD-88', 'CHILL-101'].includes(cleanCode)) {
          roomData.participants.push({
            username: 'PixelMod',
            displayName: 'PixelMod',
            avatar: '🛡️',
            rank: 'moderator',
            isMicOn: true,
            isCamOn: true,
            isSelf: false,
          });
        }
      }
      localStorage.setItem(storageKey, JSON.stringify(roomData));
    } catch (e) {}

    setActiveMeet(roomData);
    setMeetRoomCode(cleanCode);
    showNotification(`Joined Meet: ${cleanCode}`);
  };

  const handleGenerateRandomCode = () => {
    const prefixes = ['ARCADE', 'SQUAD', 'CHILL', 'VIP', 'PLAY', 'GAMER'];
    const randomNum = Math.floor(100 + Math.random() * 900);
    const code = `${prefixes[Math.floor(Math.random() * prefixes.length)]}-${randomNum}`;
    setMeetRoomCode(code);
    handleJoinOrCreateMeet(code);
  };

  const handleSendMeetMessage = (e) => {
    e.preventDefault();
    if (!meetInputMessage.trim() || !activeMeet || !currentUser) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg = {
      id: `meet-msg-${Date.now()}`,
      sender: currentUser.displayName,
      avatar: currentUser.avatar,
      rank: currentUser.rank,
      text: meetInputMessage.trim(),
      timestamp: timeStr,
    };

    const updated = {
      ...activeMeet,
      messages: [...(activeMeet.messages || []), newMsg],
    };
    setActiveMeet(updated);
    try {
      localStorage.setItem(`arcade_meet_${activeMeet.code}`, JSON.stringify(updated));
    } catch (e) {}
    setMeetInputMessage('');
  };

  const handleLeaveMeet = () => {
    if (activeMeet) {
      showNotification(`Left meet room ${activeMeet.code}`);
      setActiveMeet(null);
    }
  };

  const handleCopyMeetCode = () => {
    if (!activeMeet?.code) return;
    navigator.clipboard?.writeText(activeMeet.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
    showNotification('Meet code copied to clipboard!');
  };

  // Filter users for people search
  const filteredUsers = (users || []).filter((u) => {
    if (!searchUserQuery.trim()) return true;
    const q = searchUserQuery.toLowerCase().trim();
    return (
      u.username.toLowerCase().includes(q) ||
      (u.displayName && u.displayName.toLowerCase().includes(q))
    );
  });

  if (!isOpen) return null;

  return (
    <div
      className={`fixed z-50 transition-all duration-300 right-4 sm:right-6 ${
        isMinimized
          ? 'bottom-4 w-72'
          : 'bottom-4 sm:bottom-6 w-[calc(100vw-2rem)] sm:w-[420px] md:w-[460px]'
      }`}
    >
      <div className="bg-[#0b101d] border border-cyan-500/30 rounded-3xl shadow-[0_10px_50px_rgba(0,0,0,0.85),0_0_35px_rgba(34,211,238,0.2)] flex flex-col overflow-hidden backdrop-blur-xl">
        {/* TOP MAIN HEADER */}
        <div className="bg-gradient-to-r from-slate-900 via-[#0e1628] to-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
              {activeTab === 'global' ? (
                <MessageSquare className="w-4 h-4" />
              ) : activeTab === 'direct' ? (
                <User className="w-4 h-4" />
              ) : (
                <Video className="w-4 h-4" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-white tracking-wide">
                  Arcade Social Hub
                </span>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                {currentUser ? (
                  <span className="flex items-center gap-1">
                    Logged in as <span className="text-cyan-300 font-semibold">{currentUser.displayName}</span>
                    {currentUser.rank === 'owner' && (
                      <Crown className="w-3 h-3 text-amber-400 fill-amber-400 inline" />
                    )}
                  </span>
                ) : (
                  'Sign in to chat & join meets'
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-slate-400">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1.5 rounded-lg hover:text-white hover:bg-slate-800/80 transition-colors"
              title={isMinimized ? 'Expand' : 'Minimize'}
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:text-white hover:bg-slate-800/80 transition-colors"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action Notice Toast */}
        {actionNotice && (
          <div className="px-3 py-1.5 bg-cyan-500/20 border-b border-cyan-500/40 text-cyan-300 text-xs text-center font-medium animate-in fade-in">
            {actionNotice}
          </div>
        )}

        {/* DRAWER BODY (Hidden when minimized) */}
        {!isMinimized && (
          <div className="flex flex-col h-[480px]">
            {/* 3-WAY SUB-TAB NAVIGATION STRIP */}
            <div className="grid grid-cols-3 p-1.5 bg-slate-950/80 border-b border-slate-800/80 shrink-0 text-xs font-bold gap-1">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('global');
                  setActiveDmUser(null);
                }}
                className={`py-1.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'global'
                    ? 'bg-cyan-400 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Global</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('direct')}
                className={`py-1.5 rounded-xl transition-all flex items-center justify-center gap-1.5 relative ${
                  activeTab === 'direct'
                    ? 'bg-cyan-400 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Private DMs</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('meets')}
                className={`py-1.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'meets'
                    ? 'bg-cyan-400 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>Meets 📹</span>
              </button>
            </div>

            {/* TAB 1: GLOBAL CHAT */}
            {activeTab === 'global' && (
              <div className="flex-1 flex flex-col min-h-0">
                {/* Global Message Feed */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-slate-800">
                  {globalMessages.map((msg) => {
                    const targetUserObj = users?.find(
                      (u) => u.username.toLowerCase() === msg.username.toLowerCase()
                    );
                    const effectiveRank = targetUserObj ? targetUserObj.rank : msg.rank;
                    const isTargetBanned = targetUserObj?.isBanned;
                    const isTargetMuted = targetUserObj?.isMuted;
                    const isMyMessage = currentUser?.username.toLowerCase() === msg.username.toLowerCase();

                    return (
                      <div
                        key={msg.id}
                        className={`group relative p-2.5 rounded-xl border transition-all ${
                          effectiveRank === 'owner'
                            ? 'bg-amber-950/20 border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.06)]'
                            : effectiveRank === 'moderator'
                            ? 'bg-blue-950/20 border-blue-500/30'
                            : 'bg-slate-900/60 border-slate-800/80'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-base select-none leading-none">{msg.avatar}</span>
                            <span className="text-xs font-bold text-slate-200">{msg.displayName}</span>

                            {/* OWNER GOLD CROWN BADGE */}
                            {effectiveRank === 'owner' && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-gradient-to-r from-amber-500/25 to-yellow-500/25 border border-amber-400/60 text-amber-300 text-[10px] font-black shadow-[0_0_8px_rgba(251,191,36,0.3)]">
                                <Crown className="w-3 h-3 text-amber-400 fill-amber-400" />
                                <span>OWNER</span>
                              </span>
                            )}

                            {effectiveRank === 'moderator' && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-500/20 border border-blue-400/50 text-blue-300 text-[10px] font-bold">
                                <Shield className="w-3 h-3 text-blue-400" />
                                <span>MOD</span>
                              </span>
                            )}

                            {isTargetMuted && (
                              <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold">
                                MUTED
                              </span>
                            )}
                            {isTargetBanned && (
                              <span className="text-[9px] px-1 py-0.2 rounded bg-rose-500/20 border border-rose-500/40 text-rose-300 font-bold">
                                BANNED
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-slate-500">{msg.timestamp}</span>

                            {/* DM Shortcut button */}
                            {!isMyMessage && targetUserObj && (
                              <button
                                onClick={() => handleStartDmWithUser(targetUserObj)}
                                title={`Send private DM to ${msg.displayName}`}
                                className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded transition-opacity"
                              >
                                <User className="w-3 h-3" />
                              </button>
                            )}

                            {/* Moderation Controls Trigger */}
                            {(isOwner || isModerator) && (
                              <div className="relative">
                                <button
                                  onClick={() =>
                                    setSelectedUserAction(
                                      selectedUserAction === msg.id ? null : msg.id
                                    )
                                  }
                                  title="Moderation Options"
                                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded transition-opacity"
                                >
                                  <Shield className="w-3 h-3" />
                                </button>

                                {selectedUserAction === msg.id && (
                                  <div className="absolute right-0 top-6 z-30 w-48 bg-[#090e1a] border border-cyan-500/40 rounded-xl shadow-2xl p-2 text-xs space-y-1 animate-in fade-in zoom-in-95">
                                    <button
                                      onClick={() => {
                                        handleDeleteGlobalMessage(msg.id);
                                        setSelectedUserAction(null);
                                      }}
                                      className="w-full text-left px-2 py-1.5 rounded hover:bg-rose-500/20 text-rose-300 flex items-center gap-2"
                                    >
                                      <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                                      <span>Delete Message</span>
                                    </button>

                                    {!isMyMessage && (
                                      <button
                                        onClick={() => {
                                          toggleMute(msg.username);
                                          showNotification(
                                            isTargetMuted
                                              ? `Unmuted ${msg.displayName}`
                                              : `Muted ${msg.displayName}`
                                          );
                                          setSelectedUserAction(null);
                                        }}
                                        className="w-full text-left px-2 py-1.5 rounded hover:bg-amber-500/20 text-amber-300 flex items-center gap-2"
                                      >
                                        <VolumeX className="w-3.5 h-3.5 text-amber-400" />
                                        <span>{isTargetMuted ? 'Unmute User' : 'Mute User'}</span>
                                      </button>
                                    )}

                                    {isOwner && !isMyMessage && (
                                      <>
                                        <button
                                          onClick={() => {
                                            const newRank =
                                              effectiveRank === 'moderator' ? 'member' : 'moderator';
                                            setRank(msg.username, newRank);
                                            showNotification(`Promoted/Updated ${msg.displayName}`);
                                            setSelectedUserAction(null);
                                          }}
                                          className="w-full text-left px-2 py-1.5 rounded hover:bg-blue-500/20 text-blue-300 flex items-center gap-2"
                                        >
                                          <Shield className="w-3.5 h-3.5 text-blue-400" />
                                          <span>
                                            {effectiveRank === 'moderator'
                                              ? 'Demote to Member'
                                              : 'Promote to Mod'}
                                          </span>
                                        </button>

                                        <button
                                          onClick={() => {
                                            toggleBan(msg.username);
                                            showNotification(
                                              isTargetBanned
                                                ? `Unbanned ${msg.displayName}`
                                                : `Banned ${msg.displayName}`
                                            );
                                            setSelectedUserAction(null);
                                          }}
                                          className="w-full text-left px-2 py-1.5 rounded hover:bg-rose-500/20 text-rose-300 flex items-center gap-2"
                                        >
                                          <Ban className="w-3.5 h-3.5 text-rose-400" />
                                          <span>{isTargetBanned ? 'Unban Account' : 'Ban Account'}</span>
                                        </button>
                                      </>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed break-words pl-0.5">
                          {msg.text}
                        </p>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Global Input Bar */}
                <div className="p-3 bg-slate-900/90 border-t border-slate-800 shrink-0">
                  {!currentUser ? (
                    <button
                      onClick={onOpenAccount}
                      className="w-full py-2 bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Sign In to Chat</span>
                    </button>
                  ) : currentUser.isMuted ? (
                    <div className="p-2 text-center text-xs text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-xl font-medium">
                      You are currently muted by administration.
                    </div>
                  ) : (
                    <form onSubmit={handleSendGlobalMessage} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Type to global chat..."
                        value={inputGlobalMessage}
                        onChange={(e) => setInputGlobalMessage(e.target.value)}
                        maxLength={250}
                        className="flex-1 px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                      />
                      <button
                        type="submit"
                        disabled={!inputGlobalMessage.trim()}
                        className="p-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 disabled:opacity-40 text-slate-950 transition-all shrink-0 active:scale-95"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: PRIVATE DMs & SEARCH PEOPLE */}
            {activeTab === 'direct' && (
              <div className="flex-1 flex flex-col min-h-0">
                {activeDmUser ? (
                  /* ACTIVE 1-ON-1 PRIVATE CHAT THREAD */
                  <div className="flex-1 flex flex-col min-h-0">
                    {/* Active DM Header */}
                    <div className="px-3.5 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setActiveDmUser(null)}
                          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          title="Back to all people"
                        >
                          <ArrowLeft className="w-4 h-4" />
                        </button>
                        <span className="text-xl">{activeDmUser.avatar}</span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-white">
                              {activeDmUser.displayName}
                            </span>
                            {activeDmUser.rank === 'owner' && (
                              <Crown className="w-3 h-3 text-amber-400 fill-amber-400" />
                            )}
                            {activeDmUser.rank === 'moderator' && (
                              <Shield className="w-3 h-3 text-blue-400" />
                            )}
                          </div>
                          <span className="text-[10px] text-emerald-400 block font-mono">
                            ● Live Private Chat
                          </span>
                        </div>
                      </div>

                      {/* Quick Meet Invite Button */}
                      <button
                        onClick={() => {
                          const code = `DM-${Math.floor(100 + Math.random() * 900)}`;
                          handleJoinOrCreateMeet(code);
                          setActiveTab('meets');
                        }}
                        className="px-2.5 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Video className="w-3 h-3" />
                        <span>Invite to Meet</span>
                      </button>
                    </div>

                    {/* DM Messages Feed */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-slate-800">
                      {(() => {
                        const key = currentUser
                          ? getDmThreadKey(currentUser.username, activeDmUser.username)
                          : '';
                        const thread = directMessages[key] || [];

                        if (thread.length === 0) {
                          return (
                            <div className="text-center py-12 text-slate-500 text-xs">
                              <p className="font-bold text-slate-300 mb-1">
                                No direct messages yet with {activeDmUser.displayName}
                              </p>
                              <p className="text-[11px] text-slate-500">
                                Send a private message below to start chatting live!
                              </p>
                            </div>
                          );
                        }

                        return thread.map((msg) => {
                          const isMine =
                            currentUser?.username.toLowerCase() ===
                            msg.senderUsername.toLowerCase();
                          return (
                            <div
                              key={msg.id}
                              className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                            >
                              <div
                                className={`max-w-[82%] p-2.5 rounded-2xl text-xs ${
                                  isMine
                                    ? 'bg-cyan-500/20 border border-cyan-400/40 text-white rounded-br-none shadow-[0_0_12px_rgba(34,211,238,0.15)]'
                                    : 'bg-slate-800/90 border border-slate-700 text-slate-200 rounded-bl-none'
                                }`}
                              >
                                <p className="leading-relaxed break-words">{msg.text}</p>
                              </div>
                              <span className="text-[9px] text-slate-500 mt-1 px-1">
                                {msg.timestamp}
                              </span>
                            </div>
                          );
                        });
                      })()}
                      <div ref={dmMessagesEndRef} />
                    </div>

                    {/* DM Input Bar */}
                    <div className="p-3 bg-slate-900/90 border-t border-slate-800 shrink-0">
                      <form onSubmit={handleSendDmMessage} className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder={`Message ${activeDmUser.displayName} privately...`}
                          value={inputDmMessage}
                          onChange={(e) => setInputDmMessage(e.target.value)}
                          maxLength={250}
                          className="flex-1 px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                        />
                        <button
                          type="submit"
                          disabled={!inputDmMessage.trim()}
                          className="p-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 disabled:opacity-40 text-slate-950 transition-all shrink-0 active:scale-95"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </form>
                    </div>
                  </div>
                ) : (
                  /* SEARCH & SELECT PEOPLE FOR DIRECT CHAT */
                  <div className="flex-1 flex flex-col min-h-0 p-3 space-y-3">
                    {/* Search Bar for People */}
                    <div className="relative shrink-0">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search players by name or @username..."
                        value={searchUserQuery}
                        onChange={(e) => setSearchUserQuery(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all"
                      />
                    </div>

                    {/* Registered Players List */}
                    <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-slate-800">
                      {filteredUsers.length === 0 ? (
                        <div className="text-center py-8 text-xs text-slate-500">
                          No players found matching "{searchUserQuery}".
                        </div>
                      ) : (
                        filteredUsers.map((userObj) => {
                          const isSelf =
                            currentUser?.username.toLowerCase() ===
                            userObj.username.toLowerCase();
                          const key = currentUser
                            ? getDmThreadKey(currentUser.username, userObj.username)
                            : '';
                          const thread = directMessages[key] || [];
                          const lastMsg = thread[thread.length - 1];

                          return (
                            <div
                              key={userObj.username}
                              className={`p-2.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                                isSelf
                                  ? 'bg-slate-900/30 border-slate-800/50 opacity-60'
                                  : 'bg-slate-900/80 border-slate-800 hover:border-cyan-400/50 hover:bg-slate-900 cursor-pointer'
                              }`}
                              onClick={() => {
                                if (!isSelf) handleStartDmWithUser(userObj);
                              }}
                            >
                              <div className="flex items-center gap-2.5 truncate">
                                <span className="text-2xl p-1 bg-slate-800 border border-slate-700 rounded-xl shrink-0 select-none">
                                  {userObj.avatar}
                                </span>
                                <div className="truncate">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-bold text-white truncate">
                                      {userObj.displayName}
                                    </span>
                                    {userObj.rank === 'owner' && (
                                      <span className="text-[10px] text-amber-400 font-black flex items-center">
                                        <Crown className="w-3 h-3 fill-amber-400 mr-0.5" /> OWNER
                                      </span>
                                    )}
                                    {userObj.rank === 'moderator' && (
                                      <span className="text-[10px] text-blue-400 font-bold flex items-center">
                                        <Shield className="w-3 h-3 mr-0.5" /> MOD
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[10px] text-slate-400 truncate">
                                    {lastMsg
                                      ? `Last: ${lastMsg.text}`
                                      : `@${userObj.username} · ${userObj.bio || 'Arcade gamer'}`}
                                  </p>
                                </div>
                              </div>

                              {!isSelf && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStartDmWithUser(userObj);
                                  }}
                                  className="px-2.5 py-1 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-[11px] rounded-lg shrink-0 transition-colors"
                                >
                                  Chat
                                </button>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: FRIENDS & MEETS (ENTER CODE & JOIN ROOM) */}
            {activeTab === 'meets' && (
              <div className="flex-1 flex flex-col min-h-0 p-3.5 space-y-3.5">
                {activeMeet ? (
                  /* IN AN ACTIVE MEET ROOM */
                  <div className="flex-1 flex flex-col min-h-0 space-y-3">
                    {/* Meet Header with Room Code */}
                    <div className="p-3 bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-900 border border-purple-500/30 rounded-2xl flex items-center justify-between gap-3 shrink-0">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider block">
                          Active Arcade Meet
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-sm text-white">
                            {activeMeet.code}
                          </span>
                          <button
                            onClick={handleCopyMeetCode}
                            className="p-1 text-slate-400 hover:text-white rounded"
                            title="Copy Meet Code to share with friends"
                          >
                            {copiedCode ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={handleLeaveMeet}
                        className="px-2.5 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                      >
                        <PhoneOff className="w-3.5 h-3.5" />
                        <span>Leave</span>
                      </button>
                    </div>

                    {/* Participants Video Cards Grid */}
                    <div className="grid grid-cols-2 gap-2 shrink-0">
                      {(activeMeet.participants || []).map((p) => {
                        const isSelf =
                          currentUser?.username.toLowerCase() === p.username?.toLowerCase();
                        return (
                          <div
                            key={p.username}
                            className="relative aspect-video rounded-xl bg-slate-950 border border-slate-800 p-2 flex flex-col items-center justify-center overflow-hidden group shadow-inner"
                          >
                            {/* Participant Avatar / Simulated Camera */}
                            <div className="text-3xl select-none mb-1">
                              {p.avatar || '🎮'}
                            </div>

                            <span className="text-[11px] font-bold text-white truncate max-w-[90%]">
                              {p.displayName} {isSelf ? '(You)' : ''}
                            </span>

                            {/* Badge Indicator */}
                            <div className="absolute top-1.5 left-1.5 flex items-center gap-1">
                              {p.rank === 'owner' && (
                                <Crown className="w-3 h-3 text-amber-400 fill-amber-400" />
                              )}
                              {p.rank === 'moderator' && (
                                <Shield className="w-3 h-3 text-blue-400" />
                              )}
                            </div>

                            {/* Audio waveform / mic status */}
                            <div className="absolute bottom-1.5 right-1.5 flex items-center gap-1">
                              {isSelf ? (
                                isMicOn ? (
                                  <Mic className="w-3 h-3 text-emerald-400" />
                                ) : (
                                  <MicOff className="w-3 h-3 text-rose-400" />
                                )
                              ) : (
                                <Mic className="w-3 h-3 text-emerald-400" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Self Call Controls */}
                    <div className="flex items-center justify-center gap-3 p-2 bg-slate-950/80 border border-slate-800 rounded-xl shrink-0">
                      <button
                        onClick={() => setIsMicOn(!isMicOn)}
                        className={`p-2 rounded-xl text-xs font-bold transition-all ${
                          isMicOn
                            ? 'bg-slate-800 text-white hover:bg-slate-700'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        }`}
                        title={isMicOn ? 'Mute Microphone' : 'Unmute Microphone'}
                      >
                        {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => setIsCamOn(!isCamOn)}
                        className={`p-2 rounded-xl text-xs font-bold transition-all ${
                          isCamOn
                            ? 'bg-slate-800 text-white hover:bg-slate-700'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        }`}
                        title={isCamOn ? 'Turn Camera Off' : 'Turn Camera On'}
                      >
                        {isCamOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => {
                          setIsScreenSharing(!isScreenSharing);
                          showNotification(
                            !isScreenSharing ? 'Screen sharing active' : 'Screen share stopped'
                          );
                        }}
                        className={`p-2 rounded-xl text-xs font-bold transition-all ${
                          isScreenSharing
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50'
                            : 'bg-slate-800 text-white hover:bg-slate-700'
                        }`}
                        title="Share Screen"
                      >
                        <Tv className="w-4 h-4" />
                      </button>
                    </div>

                    {/* In-Meet Live Chat */}
                    <div className="flex-1 overflow-y-auto p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2 text-xs scrollbar-thin scrollbar-thumb-slate-800">
                      {(activeMeet.messages || []).map((m) => (
                        <div key={m.id} className="p-1.5 bg-slate-900/60 rounded-lg">
                          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
                            <span className="font-bold text-cyan-300">{m.sender}</span>
                            <span>{m.timestamp}</span>
                          </div>
                          <p className="text-slate-200">{m.text}</p>
                        </div>
                      ))}
                      <div ref={meetMessagesEndRef} />
                    </div>

                    {/* Meet Chat Input */}
                    <form onSubmit={handleSendMeetMessage} className="flex items-center gap-2 shrink-0">
                      <input
                        type="text"
                        placeholder="Chat in this meet room..."
                        value={meetInputMessage}
                        onChange={(e) => setMeetInputMessage(e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                      />
                      <button
                        type="submit"
                        disabled={!meetInputMessage.trim()}
                        className="p-1.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 disabled:opacity-40 text-slate-950 transition-all shrink-0"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  </div>
                ) : (
                  /* JOIN OR CREATE A MEET BY CODE */
                  <div className="flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-4">
                      {/* Meet Info Card */}
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/30 via-slate-900 to-slate-900 border border-purple-500/30 text-center">
                        <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-400/40 text-purple-300 flex items-center justify-center mx-auto mb-2">
                          <Video className="w-5 h-5" />
                        </div>
                        <h4 className="font-bold text-sm text-white">Arcade Meets</h4>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                          Type in a room code to join the same meet with friends and hang out live while playing!
                        </p>
                      </div>

                      {/* Code Input Form */}
                      <div className="space-y-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                          Enter Specific Meet Code:
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="e.g., SQUAD-44, CHILL-101"
                            value={meetRoomCode}
                            onChange={(e) => setMeetRoomCode(e.target.value)}
                            className="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm font-mono uppercase text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                          />
                          <button
                            type="button"
                            onClick={() => handleJoinOrCreateMeet(meetRoomCode)}
                            className="px-4 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
                          >
                            Join Meet
                          </button>
                        </div>
                      </div>

                      {/* Quick Code Generator Button */}
                      <button
                        type="button"
                        onClick={handleGenerateRandomCode}
                        className="w-full py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold transition-colors flex items-center justify-center gap-2"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Create New Room with Random Code</span>
                      </button>

                      {/* Popular Public Arcade Rooms */}
                      <div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                          Quick Join Public Rooms:
                        </span>
                        <div className="grid grid-cols-2 gap-2">
                          {['ARCADE-1', 'SQUAD-88', 'CHILL-101', 'VIP-LOUNGE'].map((code) => (
                            <button
                              key={code}
                              onClick={() => {
                                setMeetRoomCode(code);
                                handleJoinOrCreateMeet(code);
                              }}
                              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-400/50 hover:bg-slate-800 text-left text-xs font-mono text-cyan-300 flex items-center justify-between"
                            >
                              <span>{code}</span>
                              <ArrowLeft className="w-3.5 h-3.5 rotate-180 text-slate-500" />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <p className="text-[10px] text-slate-500 text-center">
                      Anyone entering the same room code will join the exact same meet.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
