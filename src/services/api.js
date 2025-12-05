// src/services/api.js

// URL مالت الباك
const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:8000";

let authToken = null;

// تحميل التوكن من localStorage
export function loadAuthTokenFromStorage() {
    const saved = localStorage.getItem("skywalkers_token");
    if (saved) {
        authToken = saved;
    }
}

// حفظ التوكن بعد تسجيل الدخول
export function setAuthToken(token) {
    authToken = token;
    localStorage.setItem("skywalkers_token", token);
}

// مسح التوكن
export function clearAuthToken() {
    authToken = null;
    localStorage.removeItem("skywalkers_token");
}

// دالة fetch مركزية
export async function apiFetch(path, options = {}) {
    const headers = {
        Accept: "application/json",
        ...(options.headers || {}),
    };

    if (authToken) {
        headers["Authorization"] = `Bearer ${authToken}`;
    }

    const res = await fetch(API_URL + path, {
        ...options,
        headers,
    });

    if (res.status === 401) {
        clearAuthToken();
        throw new Error("Unauthorized");
    }

    if (res.status === 429) {
        const retryAfter = res.headers.get("Retry-After");
        throw new Error(
            retryAfter
                ? `Rate limited. Try again after ${retryAfter} seconds.`
                : "Rate limited"
        );
    }

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `API error: ${res.status}`);
    }

    if (res.status === 204) return null;

    return res.json();
}

/* ==========
   ENDPOINT FUNCTIONS
========== */

// login
export async function login(username, password) {
    const data = await apiFetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });

    if (data.token) {
        setAuthToken(data.token);
    }

    return data;
}

// register
export async function register(username, password) {
    const data = await apiFetch("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Backend likely expects username/password. Adjust if needed based on backend docs (but none provided, assuming standard).
        body: JSON.stringify({ username, password }),
    });

    // If backend auto-logins on register and returns token:
    if (data.token) {
        setAuthToken(data.token);
    }

    return data;
}

// history
export function getHistory() {
    return apiFetch("/history");
}

// tokens
export function getTokens() {
    return apiFetch("/tokens");
}

export function createToken(label) {
    return apiFetch("/tokens/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label }),
    });
}

export function deleteToken(id) {
    return apiFetch(`/tokens/${id}`, {
        method: "DELETE",
    });
}

// OCR – رفع صورة
export async function runOcr(file) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(API_URL + "/ocr", {
        method: "POST",
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
        body: formData,
    });

    if (!res.ok) {
        throw new Error(`OCR error: ${res.status}`);
    }

    return res.json();
}
