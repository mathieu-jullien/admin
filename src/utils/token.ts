interface JwtPayload {
  exp?: number;
  iat?: number;
  [key: string]: unknown;
}

interface DecodedJwt {
  header: Record<string, unknown>;
  payload: JwtPayload;
  signature: string;
}

export function saveToken(token: string): void {
  localStorage.setItem('token', token);
}

export function getToken(): string | null {
  return localStorage.getItem('token');
}

export function deleteToken(): void {
  localStorage.removeItem('token');
}

export function decodeToken(): DecodedJwt | null {
  const token = getToken();
  if (!token) return null;

  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const header = JSON.parse(atob(parts[0])) as Record<string, unknown>;
    const payload = JSON.parse(atob(parts[1])) as JwtPayload;

    return {
      header,
      payload,
      signature: parts[2],
    };
  } catch {
    return null;
  }
}

export function isExpiredToken(): boolean {
  const decodedToken = decodeToken();
  if (!decodedToken) return true;

  const expirationTime = decodedToken.payload.exp;
  if (!expirationTime) return true;

  const currentTimestamp = Math.floor(Date.now() / 1000);
  return expirationTime < currentTimestamp;
}

export function isTokenValid(): boolean {
  const token = getToken();
  if (!token) return false;
  return !isExpiredToken();
}