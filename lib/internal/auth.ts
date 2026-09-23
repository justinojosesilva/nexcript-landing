function safeEqual(a: string, b: string) {
  let diff = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return diff === 0;
}

export function internalAuthConfigured() {
  return Boolean(process.env.INTERNAL_USER && process.env.INTERNAL_PASSWORD);
}

/** Confere o cabeçalho HTTP Basic contra INTERNAL_USER e INTERNAL_PASSWORD. */
export function isAuthorized(authorization: string | null) {
  const user = process.env.INTERNAL_USER;
  const password = process.env.INTERNAL_PASSWORD;
  if (!user || !password || !authorization?.startsWith("Basic ")) return false;
  try {
    const [givenUser, ...rest] = atob(authorization.slice(6)).split(":");
    return safeEqual(givenUser, user) && safeEqual(rest.join(":"), password);
  } catch {
    return false;
  }
}
