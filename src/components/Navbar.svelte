<script>
    import { location } from "svelte-spa-router";

    const links = [
        { path: "/", label: "Home" },
        { path: "/dashboard", label: "Dashboard" },
        { path: "/history", label: "History" },
        { path: "/demo", label: "Demo" },
    ];

    const authLinks = [
        { path: "/login", label: "Login" },
        { path: "/register", label: "Register" },
    ];

    $: activePath = $location;
</script>

<nav
    class="sticky top-0 z-50 w-full bg-white/6 backdrop-blur-[20px] border-b border-[#E1F7F5]/25 py-4"
>
    <div class="max-w-[1200px] mx-auto px-6 flex justify-between items-center">
        <div
            class="font-['Lexend'] text-2xl font-bold text-text-main tracking-[-0.02em] bg-gradient-to-br from-white to-secondary-teal bg-clip-text text-transparent"
        >
            Skywalkers
        </div>

        <div class="flex gap-2 items-center">
            {#each links as link}
                <a
                    href="#{link.path}"
                    class="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border border-transparent
                    {activePath === link.path
                        ? 'bg-gradient-to-br from-[#0E46A3]/80 to-secondary-teal/40 text-white border-[#E1F7F5]/30 shadow-[0_0_15px_rgba(14,70,163,0.3)]'
                        : 'text-text-secondary hover:text-text-main hover:bg-white/5'}"
                >
                    {link.label}
                </a>
            {/each}
        </div>

        <div class="flex gap-2 items-center">
            {#each authLinks as link}
                <a
                    href="#{link.path}"
                    class="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border
                    {activePath === link.path
                        ? 'bg-gradient-to-br from-[#0E46A3]/80 to-secondary-teal/40 text-white border-[#E1F7F5]/30 shadow-[0_0_15px_rgba(14,70,163,0.3)]'
                        : link.label === 'Register'
                          ? 'bg-white/10 border-secondary-teal/30 hover:bg-white/15 hover:border-secondary-teal/60 text-text-secondary hover:text-text-main'
                          : 'border-transparent text-text-secondary hover:text-text-main hover:bg-white/5'}"
                >
                    {link.label}
                </a>
            {/each}
        </div>
    </div>
</nav>
