// src/services/api.ts

export type ApiError = Error & { status?: number; code?: number | string; retryAfter?: number };

export type UploadItem = {
    id: string | number;
    text?: string | null;
    cached?: boolean;
    timestamp?: string | number;
    imageUrl?: string;
    thumbnailUrl?: string;
    // Backend sometimes returns these fields, so we keep them for compatibility during normalization
    createdAt?: string | number;
    date?: string | number;
    image_url?: string;
    url?: string;
    thumb_url?: string;
};

const API_URL = (import.meta.env.VITE_API_URL as string) || "http://localhost:8000";

let authToken: string | null = null;

// Load token from storage
export function loadAuthTokenFromStorage() {
    if (typeof localStorage === 'undefined') return;
    const saved = localStorage.getItem("skywalkers_token");
    if (saved) {
        authToken = saved;
    }
}

// Save token
export function setAuthToken(token: string) {
    authToken = token;
    localStorage.setItem("skywalkers_token", token);
}

// Clear token
export function clearAuthToken() {
    authToken = null;
    localStorage.removeItem("skywalkers_token");
}

// Central fetch function
export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
    const headers = new Headers(options.headers || {});
    headers.set("Accept", "application/json");

    if (authToken) {
        headers.set("Authorization", `Bearer ${authToken}`);
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

    if (res.status === 204) return null as T;

    return res.json() as Promise<T>;
}

/* ==========
   ENDPOINT FUNCTIONS
========== */

// Auth
export async function login(username: string, password: string): Promise<any> {
    const data = await apiFetch<any>("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });

    if (data.token) {
        setAuthToken(data.token);
    }

    return data;
}

export async function register(username: string, password: string): Promise<any> {
    const data = await apiFetch<any>("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });

    if (data.token) {
        setAuthToken(data.token);
    }

    return data;
}

// History
export function getHistory(page = 1, limit = 20): Promise<UploadItem[]> {
    return apiFetch<UploadItem[]>(`/history?limit=${limit}&page=${page}`);
}

// Tokens
export function getTokens(): Promise<any[]> {
    return apiFetch<any[]>("/tokens");
}

export function createToken(label: string): Promise<any> {
    return apiFetch<any>("/tokens/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label }),
    });
}

export function deleteToken(id: string | number): Promise<any> {
    return apiFetch<any>(`/tokens/${id}`, {
        method: "DELETE",
    });
}

// OCR
export async function runOcr(file: File): Promise<any> {
    const formData = new FormData();
    formData.append("file", file);

    const headers = new Headers();
    if (authToken) {
        headers.set("Authorization", `Bearer ${authToken}`);
    }

    const res = await fetch(API_URL + "/ocr", {
        method: "POST",
        headers,
        body: formData,
    });

    if (!res.ok) {
        throw new Error(`OCR error: ${res.status}`);
    }

    return res.json();
}

// Compatibility object for existing code using 'api.history' style
export const api = {
    history: getHistory
};
