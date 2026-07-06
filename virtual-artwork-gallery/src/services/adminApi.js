const FUNCTION_URL =
  `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin`;

function getAdminToken() {
  return sessionStorage.getItem("adminToken");
}

export function adminLogout() {
  sessionStorage.removeItem("adminToken");
  sessionStorage.removeItem("isAdmin");
}

export async function adminLogin(code) {
  const res = await fetch(`${FUNCTION_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code }),
  });

  let data = {};

  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    adminLogout();

    throw new Error(
      data.error || "Invalid access code"
    );
  }

  sessionStorage.setItem(
    "adminToken",
    data.token
  );

  sessionStorage.setItem(
    "isAdmin",
    "true"
  );

  return data;
}

export async function adminFetch(
  path,
  options = {}
) {
  const token = getAdminToken();

  if (!token) {
    throw new Error(
      "Not authenticated as admin."
    );
  }

  const res = await fetch(
    `${FUNCTION_URL}${path}`,
    {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
      },
    }
  );

  let data = {};

  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (res.status === 401) {
    adminLogout();

    throw new Error(
      "Admin session expired. Please log in again."
    );
  }

  if (!res.ok) {
    throw new Error(
      data.error || "Request failed"
    );
  }

  return data;
}

export function isAdminAuthenticated() {
  return !!getAdminToken();
}