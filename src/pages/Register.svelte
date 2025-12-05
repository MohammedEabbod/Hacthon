<script>
    import { register } from "../services/api";
    import { push } from "svelte-spa-router";

    let username = "";
    let email = "";
    let phone = "";
    let password = "";
    let confirmPassword = "";
    let error = "";

    async function handleRegister() {
        if (password !== confirmPassword) {
            error = "Passwords do not match";
            return;
        }

        try {
            const res = await register(username, password, email, phone);
            console.log("Registered:", res);
            // If API returns token, api.js sets it. We can redirect to dashboard.
            // If not, maybe we need to login. Assuming token is returned for smooth UX.
            push("/dashboard");
        } catch (e) {
            error = e.message || "Registration failed";
        }
    }
</script>

<div class="flex flex-col gap-24 pt-8 min-h-[80vh] justify-center">
    <section class="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <!-- Left Side: Text -->
        <div
            class="flex flex-col gap-6 items-center md:items-start text-center md:text-left"
        >
            <div
                class="inline-block px-4 py-2 bg-secondary-teal/10 border border-secondary-teal/30 rounded-full text-secondary-teal text-sm font-medium w-fit"
            >
                Join the Future
            </div>
            <h1
                class="text-4xl md:text-[3.5rem] leading-[1.1] font-bold text-text-main"
            >
                Create Your <br />
                <span
                    class="bg-gradient-to-br from-secondary-teal to-secondary-light bg-clip-text text-transparent"
                    >Account</span
                >
            </h1>
            <p class="text-lg text-text-secondary leading-relaxed max-w-[90%]">
                Sign up to start extracting text from images with our advanced
                AI technology.
            </p>
        </div>

        <!-- Right Side: Register Form -->
        <div class="flex justify-center w-full">
            <div
                class="w-full max-w-[420px] bg-white/5 backdrop-blur-2xl border border-secondary-light/20 rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.2)] relative overflow-hidden"
            >
                <!-- Decorative Top Line similar to specific design -->
                <div
                    class="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-secondary-teal to-transparent shadow-[0_0_10px_#9AC8CD]"
                ></div>

                <div class="flex flex-col gap-6 mt-4">
                    <h2 class="text-2xl font-bold text-text-main">Register</h2>

                    {#if error}
                        <div
                            class="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-200 text-sm text-center"
                        >
                            {error}
                        </div>
                    {/if}

                    <div class="flex flex-col gap-4">
                        <div class="flex flex-col gap-2">
                            <label
                                for="username"
                                class="text-sm font-medium text-text-secondary ml-1"
                                >Username</label
                            >
                            <input
                                id="username"
                                type="text"
                                bind:value={username}
                                placeholder="Choose a username"
                                class="w-full px-5 py-3.5 bg-white/5 border border-secondary-light/15 rounded-xl text-text-main placeholder-text-secondary/50 focus:outline-none focus:border-secondary-teal/50 focus:bg-white/10 transition-all duration-200"
                            />
                        </div>

                        <div class="flex flex-col gap-2">
                            <label
                                for="email"
                                class="text-sm font-medium text-text-secondary ml-1"
                                >Email</label
                            >
                            <input
                                id="email"
                                type="email"
                                bind:value={email}
                                placeholder="Enter your email"
                                class="w-full px-5 py-3.5 bg-white/5 border border-secondary-light/15 rounded-xl text-text-main placeholder-text-secondary/50 focus:outline-none focus:border-secondary-teal/50 focus:bg-white/10 transition-all duration-200"
                            />
                        </div>

                        <div class="flex flex-col gap-2">
                            <label
                                for="phone"
                                class="text-sm font-medium text-text-secondary ml-1"
                                >Phone Number</label
                            >
                            <input
                                id="phone"
                                type="tel"
                                bind:value={phone}
                                placeholder="Enter your phone number"
                                class="w-full px-5 py-3.5 bg-white/5 border border-secondary-light/15 rounded-xl text-text-main placeholder-text-secondary/50 focus:outline-none focus:border-secondary-teal/50 focus:bg-white/10 transition-all duration-200"
                            />
                        </div>

                        <div class="flex flex-col gap-2">
                            <label
                                for="password"
                                class="text-sm font-medium text-text-secondary ml-1"
                                >Password</label
                            >
                            <input
                                id="password"
                                type="password"
                                bind:value={password}
                                placeholder="Choose a password"
                                class="w-full px-5 py-3.5 bg-white/5 border border-secondary-light/15 rounded-xl text-text-main placeholder-text-secondary/50 focus:outline-none focus:border-secondary-teal/50 focus:bg-white/10 transition-all duration-200"
                            />
                        </div>

                        <div class="flex flex-col gap-2">
                            <label
                                for="confirmPassword"
                                class="text-sm font-medium text-text-secondary ml-1"
                                >Confirm Password</label
                            >
                            <input
                                id="confirmPassword"
                                type="password"
                                bind:value={confirmPassword}
                                placeholder="Confirm your password"
                                class="w-full px-5 py-3.5 bg-white/5 border border-secondary-light/15 rounded-xl text-text-main placeholder-text-secondary/50 focus:outline-none focus:border-secondary-teal/50 focus:bg-white/10 transition-all duration-200"
                            />
                        </div>
                    </div>

                    <div class="pt-2">
                        <button
                            class="w-full flex justify-center items-center gap-2 px-8 py-3.5 bg-gradient-to-br from-primary-blue to-secondary-teal text-white border border-secondary-light/40 rounded-full font-semibold font-['Lexend'] cursor-pointer transition-all duration-200 shadow-[0_4px_15px_rgba(14,70,163,0.3)] hover:scale-[1.02] hover:shadow-[0_6px_20px_rgba(14,70,163,0.4)] hover:brightness-110 active:scale-95"
                            on:click={handleRegister}
                        >
                            Sign Up
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >
                                <path
                                    d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
                                ></path>
                                <circle cx="8.5" cy="7" r="4"></circle>
                                <line x1="20" y1="8" x2="20" y2="14"></line>
                                <line x1="23" y1="11" x2="17" y2="11"></line>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>
</div>
