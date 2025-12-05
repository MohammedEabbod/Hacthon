import { writable } from 'svelte/store';

const initialState = {
    isAuthenticated: false,
    user: null,
    token: null
};

function createAuthStore() {
    const { subscribe, set } = writable(initialState);

    return {
        subscribe,
        login: (userData, token) => {
            const state = {
                isAuthenticated: true,
                user: userData,
                token: token
            };
            set(state);
            localStorage.setItem('skywalkers_auth', JSON.stringify(state));
        },
        logout: () => {
            set(initialState);
            localStorage.removeItem('skywalkers_auth');
            // Clean up legacy keys
            localStorage.removeItem('skywalkers_token');
            localStorage.removeItem('skywalkers_user');
        },
        load: () => {
            const stored = localStorage.getItem('skywalkers_auth');
            if (stored) {
                try {
                    set(JSON.parse(stored));
                } catch (e) {
                    console.error("Failed to parse auth", e);
                    set(initialState);
                }
            } else {
                // Fallback for legacy migration (optional, but good for UX)
                const token = localStorage.getItem('skywalkers_token');
                const userStr = localStorage.getItem('skywalkers_user');
                if (token && userStr) {
                    try {
                        const user = JSON.parse(userStr);
                        const state = { isAuthenticated: true, user, token };
                        set(state);
                        localStorage.setItem('skywalkers_auth', JSON.stringify(state));
                    } catch (e) { }
                }
            }
        }
    };
}

export const auth = createAuthStore();
