//ssr protection

const BLOCKED_HOSTS = [
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "::1",
  "169.254.169.254", // AWS metadata
];

export const isBlockedUrl = (url) => {
  try {
    const { hostname } = new URL(url);
    if (BLOCKED_HOSTS.includes(hostname)) return true;
    if (/^10\./.test(hostname)) return true;
    if (/^172\.(1[6-9]|2\d|3[01])\./.test(hostname)) return true;
    if (/^192\.168\./.test(hostname)) return true;
    return false;
  } catch {
    return true;
  }
};
