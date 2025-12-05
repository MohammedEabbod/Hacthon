<script>
    import { push } from "svelte-spa-router";

    function handleGetStarted() {
        push("/dashboard");
    }
</script>

<div class="flex flex-col gap-24 pt-8">
    <!-- Hero Section -->
    <section
        class="grid grid-cols-1 md:grid-cols-2 gap-16 items-center text-center md:text-left"
    >
        <div class="flex flex-col gap-6 items-center md:items-start">
            <div
                class="inline-block px-4 py-2 bg-secondary-teal/10 border border-secondary-teal/30 rounded-full text-secondary-teal text-sm font-medium w-fit"
            >
                New Generation OCR
            </div>
            <h1
                class="text-4xl md:text-[3.5rem] leading-[1.1] font-bold text-text-main"
            >
                Unlock Text from <br />
                <span
                    class="bg-gradient-to-br from-secondary-teal to-secondary-light bg-clip-text text-transparent"
                    >Any Image</span
                >
            </h1>
            <p class="text-lg text-text-secondary leading-relaxed max-w-[90%]">
                Skywalkers uses advanced AI to instantly extract text from
                documents, screenshots, and photos with high precision.
            </p>

            <div class="flex gap-4 mt-4 justify-center md:justify-start">
                <button
                    class="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-br from-primary-blue to-secondary-teal text-white border border-secondary-light/40 rounded-full font-semibold font-['Lexend'] cursor-pointer transition-all duration-200 shadow-[0_4px_15px_rgba(14,70,163,0.3)] hover:scale-102 hover:shadow-[0_6px_20px_rgba(14,70,163,0.4)] hover:brightness-110"
                    on:click={handleGetStarted}
                >
                    Get Started
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
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                </button>
                <button
                    class="px-8 py-3.5 bg-white/6 text-text-main border border-secondary-teal/30 rounded-full font-medium font-['Lexend'] cursor-pointer transition-all duration-200 hover:bg-white/10 hover:border-secondary-teal/60 hover:scale-102"
                    on:click={() => push("/demo")}
                >
                    View Demo
                </button>
            </div>
        </div>

        <div class="flex justify-center relative">
            <div
                class="w-full max-w-[400px] bg-white/8 backdrop-blur-2xl border border-secondary-light/20 rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.2)] relative overflow-hidden animate-float"
            >
                <div class="flex justify-between items-center mb-6">
                    <div
                        class="w-10 h-10 bg-[#0E46A3]/20 rounded-xl flex items-center justify-center text-secondary-teal"
                    >
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <rect
                                x="4"
                                y="4"
                                width="16"
                                height="16"
                                rx="2"
                                ry="2"
                            ></rect>
                            <circle cx="9" cy="9" r="2"></circle>
                            <path d="M21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21"
                            ></path>
                        </svg>
                    </div>
                    <div
                        class="px-3 py-1 bg-secondary-teal/15 text-secondary-teal rounded-full text-xs font-semibold"
                    >
                        Processing
                    </div>
                </div>
                <div
                    class="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-secondary-teal to-transparent animate-scan shadow-[0_0_10px_#9AC8CD]"
                ></div>
                <div class="card-body">
                    <div class="h-3 bg-white/10 rounded-md mb-3"></div>
                    <div class="h-3 bg-white/10 rounded-md mb-3 w-[70%]"></div>
                    <div class="h-3 bg-white/10 rounded-md mb-3"></div>
                </div>
            </div>
        </div>
    </section>

    <!-- Features Section -->
    <section class="text-center">
        <h2 class="text-[2.5rem] font-bold mb-12">
            Why Choose <span
                class="bg-gradient-to-br from-secondary-teal to-secondary-light bg-clip-text text-transparent"
                >Skywalkers?</span
            >
        </h2>

        <div
            class="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-8"
        >
            <div
                class="bg-white/5 backdrop-blur-xl border border-secondary-light/15 rounded-3xl p-8 text-left transition-all duration-300 hover:-translate-y-1 hover:bg-white/8 hover:border-secondary-teal/30"
            >
                <div
                    class="text-3xl mb-4 bg-[#0E46A3]/20 w-[60px] h-[60px] flex items-center justify-center rounded-2xl"
                >
                    ⚡
                </div>
                <h3 class="text-xl font-semibold mb-2 text-text-main">
                    Lightning Fast
                </h3>
                <p class="text-text-secondary leading-relaxed text-[0.95rem]">
                    Powered by Ollama for instant text extraction directly in
                    your browser.
                </p>
            </div>

            <div
                class="bg-white/5 backdrop-blur-xl border border-secondary-light/15 rounded-3xl p-8 text-left transition-all duration-300 hover:-translate-y-1 hover:bg-white/8 hover:border-secondary-teal/30"
            >
                <div
                    class="text-3xl mb-4 bg-[#0E46A3]/20 w-[60px] h-[60px] flex items-center justify-center rounded-2xl"
                >
                    🎯
                </div>
                <h3 class="text-xl font-semibold mb-2 text-text-main">
                    High Precision
                </h3>
                <p class="text-text-secondary leading-relaxed text-[0.95rem]">
                    Advanced AI models ensure accurate recognition even from
                    low-quality images.
                </p>
            </div>

            <div
                class="bg-white/5 backdrop-blur-xl border border-secondary-light/15 rounded-3xl p-8 text-left transition-all duration-300 hover:-translate-y-1 hover:bg-white/8 hover:border-secondary-teal/30"
            >
                <div
                    class="text-3xl mb-4 bg-[#0E46A3]/20 w-[60px] h-[60px] flex items-center justify-center rounded-2xl"
                >
                    🔒
                </div>
                <h3 class="text-xl font-semibold mb-2 text-text-main">
                    Secure & Private
                </h3>
                <p class="text-text-secondary leading-relaxed text-[0.95rem]">
                    Your data is processed securely. We prioritize your privacy
                    above all.
                </p>
            </div>
        </div>
    </section>
</div>
