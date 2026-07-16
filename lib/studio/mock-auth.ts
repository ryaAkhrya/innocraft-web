"use client";

const STUDIO_COOKIE_NAME = "inno_studio_session";

export function setStudioSessionCookie() {
  // Mock-only cookie persistence (no backend/database)
  // Max-Age ~ 30 days
  document.cookie = `${STUDIO_COOKIE_NAME}=1; Path=/studio; Max-Age=${60 * 60 * 24 * 30}; SameSite=Lax`;
}

export function clearStudioSessionCookie() {
  document.cookie = `${STUDIO_COOKIE_NAME}=; Path=/studio; Max-Age=0; SameSite=Lax`;
}

export function hasStudioSessionCookie() {
  if (typeof document === "undefined") return false;
  const cookie = document.cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${STUDIO_COOKIE_NAME}=`));
  return Boolean(cookie && cookie.split("=")[1] === "1");
}

