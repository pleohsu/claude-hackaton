// Simple session management using localStorage
// This provides basic session tracking until proper auth is implemented

export interface SessionData {
  userId: string;
  userType: 'restaurant' | 'lab';
  email: string;
  name: string;
  entityId?: string; // restaurant_id or lab_id
}

const SESSION_KEY = 'shellcycle_session';

export function saveSession(data: SessionData): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(SESSION_KEY, JSON.stringify(data));
  }
}

export function getSession(): SessionData | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const stored = localStorage.getItem(SESSION_KEY);
  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function clearSession(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_KEY);
  }
}

export function isLoggedIn(): boolean {
  return getSession() !== null;
}

export function getRestaurantId(): string | null {
  const session = getSession();
  return session?.userType === 'restaurant' ? session.entityId || null : null;
}

export function getLabId(): string | null {
  const session = getSession();
  return session?.userType === 'lab' ? session.entityId || null : null;
}
