<script>
    import { onMount } from "svelte";
    import { getTokens, createToken, deleteToken } from "../services/api";
    import Skeleton from "../lib/components/ui/Skeleton.svelte";

    let tokens = [];
    let loading = true;
    let error = "";
    let newTokenLabel = "";
    let creating = false;

    async function loadTokens() {
        loading = true;
        error = "";
        try {
            tokens = await getTokens();
        } catch (e) {
            error = e.message || "Failed to load tokens";
        } finally {
            loading = false;
        }
    }

    async function handleCreate() {
        if (!newTokenLabel.trim()) return;
        creating = true;
        try {
            await createToken(newTokenLabel);
            newTokenLabel = "";
            await loadTokens();
        } catch (e) {
            error = e.message || "Failed to create token";
        } finally {
            creating = false;
        }
    }

    async function handleDelete(id) {
        if (!confirm("Are you sure you want to delete this token?")) return;
        try {
            await deleteToken(id);
            await loadTokens();
        } catch (e) {
            error = e.message || "Failed to delete token";
        }
    }

    onMount(() => {
        loadTokens();
    });
</script>

<div class="flex flex-col gap-12 pt-4">
    <section class="flex flex-col gap-4 text-center md:text-left">
        <div
            class="inline-block px-4 py-2 bg-secondary-teal/10 border border-secondary-teal/30 rounded-full text-secondary-teal text-sm font-medium w-fit mx-auto md:mx-0"
        >
            Developer API
        </div>
        <h1
            class="text-3xl md:text-[2.5rem] leading-[1.1] font-bold text-text-main"
        >
            Access <span
                class="bg-gradient-to-br from-secondary-teal to-secondary-light bg-clip-text text-transparent"
                >Tokens</span
            >
        </h1>
        <p
            class="text-base md:text-lg text-text-secondary leading-relaxed max-w-[90%] mx-auto md:mx-0"
        >
            Manage your API access tokens to integrate Skywalkers OCR into your
            own applications.
        </p>
    </section>

    <section
        class="bg-white/5 backdrop-blur-xl border border-secondary-light/15 rounded-3xl p-6 md:p-8 flex flex-col gap-8"
    >
        <!-- Create Token Form -->
        <div class="flex flex-col gap-4 md:flex-row md:items-end">
            <div class="flex-1 flex flex-col gap-2">
                <label
                    for="label"
                    class="text-sm font-medium text-text-secondary ml-1"
                    >New Token Label</label
                >
                <input
                    id="label"
                    type="text"
                    bind:value={newTokenLabel}
                    placeholder="e.g. My Python Script"
                    class="w-full px-5 py-3 bg-white/5 border border-secondary-light/15 rounded-xl text-text-main placeholder-text-secondary/50 focus:outline-none focus:border-secondary-teal/50 focus:bg-white/10 transition-all duration-200"
                />
            </div>
            <button
                class="px-6 py-3 bg-gradient-to-br from-primary-blue to-secondary-teal text-white border border-secondary-light/40 rounded-xl font-semibold font-['Lexend'] cursor-pointer transition-all duration-200 shadow-[0_4px_15px_rgba(14,70,163,0.3)] hover:scale-102 hover:shadow-[0_6px_20px_rgba(14,70,163,0.4)] hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
                on:click={handleCreate}
                disabled={creating || !newTokenLabel.trim()}
            >
                {creating ? "Creating..." : "Generate Token"}
            </button>
        </div>

        <!-- Error Message -->
        {#if error}
            <div
                class="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-200 text-sm"
            >
                {error}
            </div>
        {/if}

        <!-- Tokens List -->
        <div class="flex flex-col gap-4">
            <h3 class="text-lg font-semibold text-text-main">Active Tokens</h3>

            {#if loading}
                <div class="space-y-3">
                    <Skeleton className="h-16 w-full rounded-xl" />
                    <Skeleton className="h-16 w-full rounded-xl" />
                </div>
            {:else if tokens.length === 0}
                <div
                    class="rounded-2xl border border-secondary-light/20 bg-white/5 p-6 text-center text-sm text-text-secondary"
                >
                    No active tokens found. Create one to get started.
                </div>
            {:else}
                <div class="grid gap-4">
                    {#each tokens as token (token.id)}
                        <div
                            class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-secondary-teal/30 transition-colors"
                        >
                            <div
                                class="flex flex-col gap-1 overflow-hidden w-full"
                            >
                                <div class="flex items-center gap-2">
                                    <span class="font-medium text-text-main"
                                        >{token.label}</span
                                    >
                                    <span
                                        class="text-[10px] px-2 py-0.5 rounded-full bg-secondary-teal/10 text-secondary-teal border border-secondary-teal/20"
                                    >
                                        Active
                                    </span>
                                </div>
                                <div
                                    class="flex items-center gap-2 text-xs text-text-secondary font-mono bg-black/20 p-2 rounded-lg mt-1 w-full overflow-x-auto"
                                >
                                    <span class="truncate">{token.token}</span>
                                    <button
                                        class="text-secondary-teal hover:text-white transition-colors"
                                        on:click={() =>
                                            navigator.clipboard.writeText(
                                                token.token,
                                            )}
                                        title="Copy Token"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="14"
                                            height="14"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        >
                                            <rect
                                                x="9"
                                                y="9"
                                                width="13"
                                                height="13"
                                                rx="2"
                                                ry="2"
                                            ></rect>
                                            <path
                                                d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
                                            ></path>
                                        </svg>
                                    </button>
                                </div>
                                <span class="text-xs text-text-muted mt-1">
                                    Created: {new Date(
                                        token.created_at,
                                    ).toLocaleDateString()}
                                </span>
                            </div>

                            <button
                                class="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2 rounded-lg transition-colors self-end md:self-center"
                                on:click={() => handleDelete(token.id)}
                                title="Revoke Token"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                >
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path
                                        d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                                    ></path>
                                </svg>
                            </button>
                        </div>
                    {/each}
                </div>
            {/if}
        </div>
    </section>
</div>
