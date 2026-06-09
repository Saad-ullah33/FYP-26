export const getToken = () => localStorage.getItem("token");

export const getRole = () => {
  try {
    const token = getToken();
    if (!token) return null;

    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role;
  } catch {
    return null;
  }
};

export const isAuthenticated = () => {
  const token = getToken();
  const exp = localStorage.getItem("token_exp");

  if (!token) return false;

  if (exp && Date.now() > Number(exp)) {
    localStorage.clear();
    return false;
  }

  return true;
};

export const logout = () => {
  localStorage.clear();
};