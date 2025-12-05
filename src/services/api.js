// src/services/api.js

import { get } from 'svelte/store';
import { auth } from "../stores/auth";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Central fetch function
export async function apiFetch(path, options = {}) {
    const headers = new Headers(options.headers || {});
    headers.set("Accept", "application/json");

    const state = get(auth);
    if (state.token) {
        headers.set("Authorization", `Bearer ${state.token}`);
    }

    const res = await fetch(API_URL + path, {
        ...options,
        headers,
    });

    if (res.status === 401) {
        auth.logout();
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

// Auth
export async function login(username, password) {
    const data = await apiFetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });

    const token = data.token || data.access_token;
    if (token) {
        auth.login(data.user || { username }, token);
    }

    return data;
}

export async function register(username, password, email, phone) {
    const data = await apiFetch("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, email, phone }),
    });

    const token = data.token || data.access_token;
    if (token) {
        auth.login(data.user || { username }, token);
    }

    return data;
}

// History
export function getHistory(page = 1, limit = 20) {
    return apiFetch(`/history?limit=${limit}&page=${page}`);
}

// Tokens
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

// OCR
export async function runOcr(file) {
    const formData = new FormData();
    formData.append("file", file);

    const headers = new Headers();
    const state = get(auth);
    if (state.token) {
        headers.set("Authorization", `Bearer ${state.token}`);
    }

    const res = await fetch(API_URL + "/upload/", {
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
