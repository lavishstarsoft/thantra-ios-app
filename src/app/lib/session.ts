"use client";

import { useEffect, useState } from "react";

// Lightweight client-side session store for the iOS webview.
// Tokens live in localStorage; a custom event keeps every mounted view in sync.

const TOKEN_KEY = "ios_access_token";
const REFRESH_KEY = "ios_refresh_token";
const USER_KEY = "ios_user";
const DEVICE_KEY = "ios_device_id";
const EVENT = "ios-session-change";

export interface SessionUser {
  id: string;
  phone: string;
  name?: string | null;
  email?: string | null;
}

function isBrowser() {
  return typeof window !== "undefined";
}

export function getDeviceId(): string {
  if (!isBrowser()) return "server";
  let id = localStorage.getItem(DEVICE_KEY);
  if (!id) {
    id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? `ios-${crypto.randomUUID()}`
        : `ios-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(DEVICE_KEY, id);
  }
  return id;
}

export function getToken(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser(): SessionUser | null {
  if (!isBrowser()) return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

export function setSession(user: SessionUser, accessToken: string, refreshToken?: string) {
  if (!isBrowser()) return;
  localStorage.setItem(TOKEN_KEY, accessToken);
  if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event(EVENT));
}

export function clearSession() {
  if (!isBrowser()) return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
  window.dispatchEvent(new Event(EVENT));
}

// React hook: re-renders whenever the session changes (login/logout) in any view.
export function useSession() {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => {
      setUser(getUser());
      setToken(getToken());
      setReady(true);
    };
    sync();
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return { user, token, ready, isLoggedIn: !!token };
}
