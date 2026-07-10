const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

/* ================= ACCESS TOKEN ================= */

export const saveAccessToken = (token) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const removeAccessToken = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
};

/* ================= REFRESH TOKEN ================= */

export const saveRefreshToken = (token) => {
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
};

export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const removeRefreshToken = () => {
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

/* ================= CLEAR ================= */

export const clearAuth = () => {
  removeAccessToken();
  removeRefreshToken();
};

/* ================= JWT ================= */

const base64UrlDecode = (str) => {
  str = str.replace(/-/g, "+").replace(/_/g, "/");

  while (str.length % 4) {
    str += "=";
  }

  return decodeURIComponent(
    atob(str)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
};

export const decodeToken = (token) => {
  try {
    return JSON.parse(base64UrlDecode(token.split(".")[1]));
  } catch {
    return null;
  }
};

export const isTokenExpired = (token) => {
  const payload = decodeToken(token);

  if (!payload?.exp) return true;

  return payload.exp * 1000 <= Date.now();
};

export const getRole = () => {
  const token = getAccessToken();

  if (!token) return null;

  return decodeToken(token)?.role;
};

export const isAuthenticated = () => {
  const token = getAccessToken();

  return token && !isTokenExpired(token);
};