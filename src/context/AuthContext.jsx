import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const DEFAULT_USERS = [
  {
    username: 'Owner',
    displayName: 'ArcadeOwner',
    nickname: 'ArcadeMaster',
    password: 'owner',
    rank: 'owner',
    avatar: '👑',
    isMuted: false,
    isBanned: false,
    joinedDate: '2026-01-01',
    bio: 'Creator & Site Administrator of Playground Arcade.'
  },
  {
    username: 'PixelMod',
    displayName: 'PixelMod',
    nickname: 'PixelGuardian',
    password: '123',
    rank: 'moderator',
    avatar: '🛡️',
    isMuted: false,
    isBanned: false,
    joinedDate: '2026-02-15',
    bio: 'Community moderator keeping the arcade friendly.'
  },
  {
    username: 'RetroGamer99',
    displayName: 'RetroGamer',
    nickname: 'RetroKing',
    password: '123',
    rank: 'member',
    avatar: '🎮',
    isMuted: false,
    isBanned: false,
    joinedDate: '2026-03-10',
    bio: 'High score chaser on Retro Bowl & Slope!'
  },
  {
    username: 'SpeedRunnerX',
    displayName: 'SpeedRunner',
    nickname: 'Speedster',
    password: '123',
    rank: 'member',
    avatar: '⚡',
    isMuted: false,
    isBanned: false,
    joinedDate: '2026-04-01',
    bio: 'Subway Surfers master.'
  }
];

export function AuthProvider({ children }) {
  // Load users database from localStorage
  const [users, setUsers] = useState(() => {
    try {
      const stored = localStorage.getItem('playground_users');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Ensure each user has a nickname field
          return parsed.map((u) => ({
            ...u,
            nickname: u.nickname || u.displayName || u.username,
            displayName: u.nickname || u.displayName || u.username,
          }));
        }
      }
    } catch (e) {}
    return DEFAULT_USERS;
  });

  // Current logged in user (Defaults to the Owner account as requested!)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('playground_current_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...parsed,
          nickname: parsed.nickname || parsed.displayName || parsed.username,
          displayName: parsed.nickname || parsed.displayName || parsed.username,
        };
      }
    } catch (e) {}
    // Default logged in as Owner
    return DEFAULT_USERS[0];
  });

  // Save users changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('playground_users', JSON.stringify(users));
    } catch (e) {}
  }, [users]);

  // Save current user session
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('playground_current_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('playground_current_user');
      }
    } catch (e) {}
  }, [currentUser]);

  // Synchronize current user with users database (if muted/banned/promoted/updated)
  useEffect(() => {
    if (!currentUser) return;
    const fresh = users.find((u) => u.username.toLowerCase() === currentUser.username.toLowerCase());
    if (fresh) {
      if (
        fresh.rank !== currentUser.rank ||
        fresh.isMuted !== currentUser.isMuted ||
        fresh.isBanned !== currentUser.isBanned ||
        fresh.displayName !== currentUser.displayName ||
        fresh.nickname !== currentUser.nickname ||
        fresh.password !== currentUser.password ||
        fresh.avatar !== currentUser.avatar ||
        fresh.bio !== currentUser.bio
      ) {
        setCurrentUser(fresh);
      }
    }
  }, [users, currentUser]);

  const signIn = (username, password) => {
    const user = users.find(
      (u) => u.username.toLowerCase() === username.trim().toLowerCase() && u.password === password
    );
    if (!user) {
      return { success: false, error: 'Invalid username or password.' };
    }
    if (user.isBanned) {
      return { success: false, error: 'This account has been banned by the site owner.' };
    }
    const hydrated = {
      ...user,
      nickname: user.nickname || user.displayName || user.username,
      displayName: user.nickname || user.displayName || user.username,
    };
    setCurrentUser(hydrated);
    return { success: true, user: hydrated };
  };

  const signUp = (
    username,
    password,
    displayName = '',
    avatar = '🎮',
    requestedRank = 'member',
    nickname = ''
  ) => {
    const cleanUsername = username.trim();
    if (!cleanUsername || cleanUsername.length < 3) {
      return { success: false, error: 'Username must be at least 3 characters.' };
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(cleanUsername)) {
      return {
        success: false,
        error: 'Username can only contain letters, numbers, hyphens, and underscores.',
      };
    }
    if (!password || password.length < 3) {
      return { success: false, error: 'Password must be at least 3 characters.' };
    }
    const exists = users.some(
      (u) => u.username.toLowerCase() === cleanUsername.toLowerCase()
    );
    if (exists) {
      return { success: false, error: 'Username is already taken.' };
    }

    const effectiveNickname = (nickname || displayName || cleanUsername).trim();
    const newUser = {
      username: cleanUsername,
      displayName: effectiveNickname,
      nickname: effectiveNickname,
      // Security: None can become owner or mod unless explicitly promoted by the site owner
      rank: 'member',
      isMuted: false,
      isBanned: false,
      joinedDate: new Date().toISOString().split('T')[0],
      bio: 'Arcade gamer ready for high scores.',
    };

    const updated = [...users, newUser];
    setUsers(updated);
    setCurrentUser(newUser);
    return { success: true, user: newUser };
  };

  const signOut = () => {
    setCurrentUser(null);
  };

  // --------------------------------------------------------------------------
  // USERNAME, PASSWORD & NICKNAME MANAGEMENT
  // --------------------------------------------------------------------------

  // 1. Change username
  const changeUsername = (newUsername) => {
    if (!currentUser) return { success: false, error: 'You must be signed in.' };
    const clean = newUsername.trim();
    if (!clean || clean.length < 3) {
      return { success: false, error: 'New username must be at least 3 characters.' };
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(clean)) {
      return {
        success: false,
        error: 'Username can only contain letters, numbers, hyphens, and underscores.',
      };
    }
    const isTaken = users.some(
      (u) =>
        u.username.toLowerCase() === clean.toLowerCase() &&
        u.username.toLowerCase() !== currentUser.username.toLowerCase()
    );
    if (isTaken) {
      return { success: false, error: `The username "${clean}" is already taken.` };
    }

    const oldUsername = currentUser.username;
    const updatedUser = {
      ...currentUser,
      username: clean,
    };

    const updatedUsers = users.map((u) =>
      u.username.toLowerCase() === oldUsername.toLowerCase() ? updatedUser : u
    );
    setUsers(updatedUsers);
    setCurrentUser(updatedUser);

    // Update any direct message history in localStorage
    try {
      const rawDm = localStorage.getItem('playground_direct_messages');
      if (rawDm) {
        const dmObj = JSON.parse(rawDm);
        const newDmObj = {};
        Object.keys(dmObj).forEach((key) => {
          const parts = key.split('__');
          const newKey = parts
            .map((p) => (p.toLowerCase() === oldUsername.toLowerCase() ? clean : p))
            .join('__');
          const msgs = dmObj[key].map((m) => ({
            ...m,
            senderUsername:
              m.senderUsername?.toLowerCase() === oldUsername.toLowerCase()
                ? clean
                : m.senderUsername,
            receiverUsername:
              m.receiverUsername?.toLowerCase() === oldUsername.toLowerCase()
                ? clean
                : m.receiverUsername,
          }));
          newDmObj[newKey] = msgs;
        });
        localStorage.setItem('playground_direct_messages', JSON.stringify(newDmObj));
      }
    } catch (e) {}

    return { success: true, newUsername: clean };
  };

  // 2. Change password
  const changePassword = (newPassword, currentPassword = '') => {
    if (!currentUser) return { success: false, error: 'You must be signed in.' };
    if (!newPassword || newPassword.length < 3) {
      return { success: false, error: 'New password must be at least 3 characters long.' };
    }
    if (currentPassword && currentUser.password && currentPassword !== currentUser.password) {
      return { success: false, error: 'Current password does not match.' };
    }

    const updatedUser = {
      ...currentUser,
      password: newPassword,
    };

    const updatedUsers = users.map((u) =>
      u.username.toLowerCase() === currentUser.username.toLowerCase() ? updatedUser : u
    );
    setUsers(updatedUsers);
    setCurrentUser(updatedUser);
    return { success: true };
  };

  // 3. Set or update Nickname
  const updateNickname = (newNickname) => {
    if (!currentUser) return { success: false, error: 'You must be signed in.' };
    const clean = newNickname.trim();
    if (!clean) {
      return { success: false, error: 'Nickname cannot be empty.' };
    }

    const updatedUser = {
      ...currentUser,
      nickname: clean,
      displayName: clean,
    };

    const updatedUsers = users.map((u) =>
      u.username.toLowerCase() === currentUser.username.toLowerCase() ? updatedUser : u
    );
    setUsers(updatedUsers);
    setCurrentUser(updatedUser);
    return { success: true, nickname: clean };
  };

  // 4. Update Profile & Credentials All-In-One
  const updateProfile = (displayName, bio, avatar, nickname = '') => {
    if (!currentUser) return;
    const finalNickname = (nickname || displayName || currentUser.nickname || currentUser.displayName).trim();
    const updated = {
      ...currentUser,
      nickname: finalNickname,
      displayName: finalNickname,
      bio: bio !== undefined ? bio : currentUser.bio,
      avatar: avatar || currentUser.avatar,
    };
    setCurrentUser(updated);
    setUsers((prev) =>
      prev.map((u) => (u.username.toLowerCase() === currentUser.username.toLowerCase() ? updated : u))
    );
  };

  // 5. Update complete credentials atomically
  const updateAccountCredentials = ({
    newUsername,
    newNickname,
    newPassword,
    currentPassword,
    bio,
    avatar,
  }) => {
    if (!currentUser) return { success: false, error: 'You must be signed in.' };

    let targetUsername = currentUser.username;
    if (newUsername && newUsername.trim().toLowerCase() !== currentUser.username.toLowerCase()) {
      const cleanUser = newUsername.trim();
      if (cleanUser.length < 3) {
        return { success: false, error: 'Username must be at least 3 characters.' };
      }
      if (!/^[a-zA-Z0-9_-]+$/.test(cleanUser)) {
        return {
          success: false,
          error: 'Username can only contain letters, numbers, hyphens, and underscores.',
        };
      }
      const taken = users.some(
        (u) =>
          u.username.toLowerCase() === cleanUser.toLowerCase() &&
          u.username.toLowerCase() !== currentUser.username.toLowerCase()
      );
      if (taken) {
        return { success: false, error: `The username "${cleanUser}" is already taken.` };
      }
      targetUsername = cleanUser;
    }

    if (newPassword) {
      if (newPassword.length < 3) {
        return { success: false, error: 'New password must be at least 3 characters.' };
      }
      if (currentPassword && currentUser.password && currentPassword !== currentUser.password) {
        return { success: false, error: 'Current password is incorrect.' };
      }
    }

    const targetNickname =
      newNickname !== undefined && newNickname.trim() !== ''
        ? newNickname.trim()
        : currentUser.nickname || currentUser.displayName;
    const targetPassword = newPassword ? newPassword : currentUser.password;
    const targetBio = bio !== undefined ? bio : currentUser.bio;
    const targetAvatar = avatar || currentUser.avatar;

    const oldUsername = currentUser.username;
    const updatedUser = {
      ...currentUser,
      username: targetUsername,
      nickname: targetNickname,
      displayName: targetNickname,
      password: targetPassword,
      bio: targetBio,
      avatar: targetAvatar,
    };

    const updatedUsers = users.map((u) =>
      u.username.toLowerCase() === oldUsername.toLowerCase() ? updatedUser : u
    );
    setUsers(updatedUsers);
    setCurrentUser(updatedUser);
    return { success: true, user: updatedUser };
  };

  // --------------------------------------------------------------------------
  // MODERATION ACTIONS
  // --------------------------------------------------------------------------

  // Promote / Demote
  const setRank = (targetUsername, newRank) => {
    if (!currentUser || currentUser.rank !== 'owner') {
      return { success: false, error: 'Only the site owner can promote ranks.' };
    }
    setUsers((prev) =>
      prev.map((u) =>
        u.username.toLowerCase() === targetUsername.toLowerCase() ? { ...u, rank: newRank } : u
      )
    );
    return { success: true };
  };

  // Mute / Unmute
  const toggleMute = (targetUsername) => {
    if (!currentUser || (currentUser.rank !== 'owner' && currentUser.rank !== 'moderator')) {
      return { success: false, error: 'Permission denied.' };
    }
    setUsers((prev) =>
      prev.map((u) => {
        if (u.username.toLowerCase() === targetUsername.toLowerCase()) {
          if (u.rank === 'owner') return u; // Cannot mute owner
          return { ...u, isMuted: !u.isMuted };
        }
        return u;
      })
    );
    return { success: true };
  };

  // Ban / Unban
  const toggleBan = (targetUsername) => {
    if (!currentUser || currentUser.rank !== 'owner') {
      return { success: false, error: 'Only the site owner can ban members.' };
    }
    setUsers((prev) =>
      prev.map((u) => {
        if (u.username.toLowerCase() === targetUsername.toLowerCase()) {
          if (u.rank === 'owner') return u; // Cannot ban owner
          return { ...u, isBanned: !u.isBanned };
        }
        return u;
      })
    );
    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{
        users,
        currentUser,
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
        updateAccountCredentials,
        isOwner: currentUser?.rank === 'owner',
        isModerator: currentUser?.rank === 'moderator' || currentUser?.rank === 'owner',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
