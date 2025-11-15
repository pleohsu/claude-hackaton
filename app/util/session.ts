import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export interface SessionData {
  userId: string;
  email: string;
  userType: 'restaurant' | 'lab';
  name: string;
}

const SESSION_COOKIE_NAME = 'shellcycle_session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

/**
 * Create a session by setting a secure cookie
 */
export async function createSession(sessionData: SessionData) {
  const cookieStore = await cookies();

  // In production, you'd want to encrypt this data or use a session store
  // For now, we'll use a simple base64 encoding
  const sessionString = JSON.stringify(sessionData);
  const encodedSession = Buffer.from(sessionString).toString('base64');

  cookieStore.set(SESSION_COOKIE_NAME, encodedSession, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  });
}

/**
 * Get the current session data
 */
export async function getSession(): Promise<SessionData | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

    if (!sessionCookie?.value) {
      return null;
    }

    const sessionString = Buffer.from(sessionCookie.value, 'base64').toString('utf-8');
    const sessionData = JSON.parse(sessionString) as SessionData;

    return sessionData;
  } catch (error) {
    console.error('Session parsing error:', error);
    return null;
  }
}

/**
 * Destroy the current session
 */
export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Create a response with session data
 */
export function createSessionResponse(sessionData: SessionData, responseData: any, status = 200) {
  const sessionString = JSON.stringify(sessionData);
  const encodedSession = Buffer.from(sessionString).toString('base64');

  const response = NextResponse.json(responseData, { status });

  response.cookies.set(SESSION_COOKIE_NAME, encodedSession, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  });

  return response;
}

/**
 * Create a response that clears the session
 */
export function createLogoutResponse() {
  const response = NextResponse.json({ message: 'Logged out successfully' });
  response.cookies.delete(SESSION_COOKIE_NAME);
  return response;
}
