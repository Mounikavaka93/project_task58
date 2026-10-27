import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const JobContext = createContext(null);
const USERS_KEY = 'brightwork_users';
const SESSION_KEY = 'brightwork_session';

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function normalizeSession(account) {
  if (!account?.email) return null;
  return {
    name: account.name || '',
    email: account.email,
    headline: account.headline || '',
    location: account.location || '',
    phone: account.phone || '',
    skills: account.skills || '',
    bio: account.bio || '',
    saved: Array.isArray(account.saved) ? account.saved : [],
    applied: Array.isArray(account.applied) ? account.applied : [],
    createdAt: account.createdAt || null,
  };
}

function normalizeStoredUser(account) {
  return {
    ...normalizeSession(account),
    password: account.password || '',
  };
}

export function JobProvider({ children }) {
  const [users, setUsers] = useState(() => readJson(USERS_KEY, []).map(normalizeStoredUser));
  const [user, setUser] = useState(() => normalizeSession(readJson(SESSION_KEY, null)));
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    else localStorage.removeItem(SESSION_KEY);
  }, [user]);

  const dismissToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const toast = useCallback((message, tone = 'success') => {
    const id = crypto.randomUUID?.() || String(Date.now() + Math.random());
    setToasts((current) => [...current, { id, message, tone }].slice(-3));
    setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id));
    }, 3200);
  }, []);

  const patchAccount = useCallback((email, updates) => {
    setUsers((current) =>
      current.map((account) => (account.email === email ? { ...account, ...updates } : account)),
    );
    setUser((current) => (current && current.email === email ? { ...current, ...updates } : current));
  }, []);

  const signup = useCallback(
    ({ name, email, password }) => {
      const normalizedEmail = email.trim().toLowerCase();
      if (users.some((account) => account.email === normalizedEmail)) {
        return { ok: false, message: 'An account with this email already exists.' };
      }
      const account = normalizeStoredUser({
        name: name.trim(),
        email: normalizedEmail,
        password,
        createdAt: new Date().toISOString(),
      });
      setUsers((current) => [...current, account]);
      setUser(normalizeSession(account));
      toast('Welcome to Brightwork.');
      return { ok: true };
    },
    [toast, users],
  );

  const login = useCallback(
    ({ email, password }) => {
      const normalizedEmail = email.trim().toLowerCase();
      const found = users.find(
        (account) => account.email === normalizedEmail && account.password === password,
      );
      if (!found) return { ok: false, message: 'Email or password is incorrect.' };
      setUser(normalizeSession(found));
      toast(`Welcome back, ${found.name.split(' ')[0]}.`);
      return { ok: true };
    },
    [toast, users],
  );

  const logout = useCallback(() => {
    setUser(null);
    toast('You have been logged out.', 'info');
  }, [toast]);

  const updateProfile = useCallback(
    (profile) => {
      if (!user) return { ok: false, message: 'Log in to update your profile.' };
      const next = {
        name: profile.name.trim(),
        headline: profile.headline.trim(),
        location: profile.location.trim(),
        phone: profile.phone.trim(),
        skills: profile.skills.trim(),
        bio: profile.bio.trim(),
      };
      if (next.name.length < 2) return { ok: false, message: 'Please enter your name.' };
      patchAccount(user.email, next);
      toast('Profile saved.');
      return { ok: true };
    },
    [patchAccount, toast, user],
  );

  const toggleSave = useCallback(
    (jobId) => {
      if (!user) return { ok: false, reason: 'auth' };
      const already = user.saved.includes(jobId);
      const saved = already ? user.saved.filter((id) => id !== jobId) : [jobId, ...user.saved];
      patchAccount(user.email, { saved });
      toast(already ? 'Removed from saved jobs.' : 'Saved to your shortlist.');
      return { ok: true, saved: !already };
    },
    [patchAccount, toast, user],
  );

  const applyToJob = useCallback(
    (jobId) => {
      if (!user) return { ok: false, reason: 'auth' };
      if (user.applied.some((item) => item.jobId === jobId)) {
        toast('You already applied for this role.', 'info');
        return { ok: false, reason: 'duplicate' };
      }
      patchAccount(user.email, {
        applied: [{ jobId, appliedAt: new Date().toISOString(), status: 'Applied' }, ...user.applied],
      });
      toast('Application submitted.');
      return { ok: true };
    },
    [patchAccount, toast, user],
  );

  const isSaved = useCallback((jobId) => Boolean(user?.saved?.includes(jobId)), [user]);
  const isApplied = useCallback(
    (jobId) => Boolean(user?.applied?.some((item) => item.jobId === jobId)),
    [user],
  );

  const value = useMemo(
    () => ({
      user,
      toasts,
      signup,
      login,
      logout,
      updateProfile,
      toggleSave,
      applyToJob,
      dismissToast,
      isSaved,
      isApplied,
    }),
    [
      user,
      toasts,
      signup,
      login,
      logout,
      updateProfile,
      toggleSave,
      applyToJob,
      dismissToast,
      isSaved,
      isApplied,
    ],
  );

  return <JobContext.Provider value={value}>{children}</JobContext.Provider>;
}

export function useJobs() {
  const context = useContext(JobContext);
  if (!context) throw new Error('useJobs must be used within JobProvider');
  return context;
}
