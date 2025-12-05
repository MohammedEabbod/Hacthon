<script lang="ts">
  let file: File | null = null;
  let previewUrl: string | null = null;

  let status: "idle" | "uploading" | "processing" | "done" | "error" = "idle";
  let ocrText = "";
  let isCached = false;
  let errorMessage = "";
  let progress = 0;

  function handleFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const selected = input.files?.[0];

    if (!selected) return;

    file = selected;
    ocrText = "";
    isCached = false;
    errorMessage = "";
    status = "idle";
    progress = 0;

    const reader = new FileReader();
    reader.onload = (e) => {
      previewUrl = e.target?.result as string;
    };
    reader.readAsDataURL(selected);
  }

  // TODO: اربطها مع /ocr الحقيقي بالباك
  async function handleSubmit() {
    if (!file) {
      errorMessage = "Please select an image to start OCR.";
      status = "error";
      return;
    }

    errorMessage = "";
    status = "uploading";
    progress = 25;

    try {
      await new Promise((r) => setTimeout(r, 700));
      status = "processing";
      progress = 60;

      await new Promise((r) => setTimeout(r, 900));
      status = "done";
      progress = 100;

      ocrText =
        "Detected sample text from the uploaded image. Replace this with real OCR output from the Skywalkers backend.";
      isCached = Math.random() > 0.5;
    } catch (e) {
      status = "error";
      errorMessage = "Something went wrong while processing the image.";
    }
  }
</script>

<!-- Skywalkers Demo - softer borders version -->
<div
  class="min-h-screen flex items-center justify-center px-4 py-8 text-[#DCE3F0] font-[Lexend]"
  style="
    background:
      radial-gradient(circle at 15% 20%, rgba(154,200,205,0.35), transparent 55%),
      radial-gradient(circle at 80% 80%, rgba(225,247,245,0.18), transparent 60%),
      linear-gradient(135deg, #1E0342 0%, #0E46A3 45%, #0E46A3 80%);
  "
>
  <div class="w-full max-w-5xl">
    <!-- Header -->
    <div class="mb-6 flex items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl md:text-4xl font-semibold text-white tracking-tight">
          Skywalkers Demo
        </h1>
        <p class="mt-1 text-sm md:text-base text-[rgba(220,227,240,0.7)]">
          Upload an image and let Skywalkers extract the text using Ollama OCR in a glassy, AI-driven interface.
        </p>
      </div>

      <div
        class="hidden md:flex items-center gap-2 px-4 py-2 rounded-full
               border border-[rgba(225,247,245,0.25)]
               bg-[rgba(255,255,255,0.06)]
               backdrop-blur-xl
               shadow-[0_16px_40px_rgba(14,70,163,0.28)]"
      >
        <span class="h-2 w-2 rounded-full bg-emerald-400"></span>
        <span class="text-xs uppercase tracking-wide text-[#E1F7F5]">
          Demo Mode
        </span>
      </div>
    </div>

    <!-- MAIN GLASS CARD (بس هو اللي عليه Border واضح) -->
    <div
      class="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-start
             rounded-[26px] p-5 md:p-7 lg:p-8
             bg-[rgba(255,255,255,0.06)]
             border border-[rgba(225,247,245,0.20)]
             backdrop-blur-2xl
             shadow-[0_20px_55px_rgba(14,70,163,0.40)]"
    >
      <!-- LEFT SIDE -->
      <div class="space-y-5">
        <!-- Upload area (بدون border خارجي قوي، بس dashed خفيفة) -->
        <label class="block cursor-pointer group">
          <div
            class="rounded-[24px] p-5 md:p-7
                   bg-[rgba(255,255,255,0.05)]
                   group-hover:bg-[rgba(255,255,255,0.10)]
                   transition-all duration-200 ease-out
                   flex flex-col items-center justify-center text-center gap-3
                   border border-dashed border-[rgba(225,247,245,0.22)]"
          >
            <div
              class="h-12 w-12 md:h-14 md:w-14 rounded-2xl flex items-center justify-center
                     bg-[rgba(14,70,163,0.55)]
                     shadow-[0_12px_30px_rgba(14,70,163,0.65)]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                class="h-7 w-7 text-[#E1F7F5]"
                fill="none"
                stroke="currentColor"
                stroke-width="1.7"
              >
                <path
                  d="M12 16V4m0 0-4 4m4-4 4 4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <rect
                  x="4"
                  y="12"
                  width="16"
                  height="8"
                  rx="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>

            <div>
              <p class="text-sm md:text-base text-white font-medium">
                Drop an image here or <span class="text-[#9AC8CD]">browse files</span>
              </p>
              <p class="mt-1 text-xs md:text-sm text-[rgba(220,227,240,0.7)]">
                Supported formats: JPG, PNG, WebP — max ~5MB recommended.
              </p>
            </div>

            <input
              type="file"
              accept="image/*"
              class="hidden"
              on:change={handleFileChange}
            />
          </div>
        </label>

        <!-- Status + action -->
        <div
          class="grid gap-4 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-center"
        >
          <!-- STATUS (بدون border قوي، بس glass خفيف) -->
          <div
            class="rounded-2xl px-4 py-3
                   bg-[rgba(255,255,255,0.04)]
                   backdrop-blur-xl
                   border border-[rgba(225,247,245,0.16)]
                   flex items-center justify-between gap-3"
          >
            <div class="space-y-0.5">
              <p class="text-xs uppercase tracking-wide text-[rgba(220,227,240,0.7)]">
                OCR Status
              </p>
              <p class="text-sm font-medium text-white">
                {#if status === "idle"}
                  Waiting for image…
                {:else if status === "uploading"}
                  Uploading image…
                {:else if status === "processing"}
                  Processing with Ollama…
                {:else if status === "done"}
                  OCR complete
                {:else if status === "error"}
                  Error
                {/if}
              </p>
            </div>

            <div class="flex items-center gap-2">
              <div
                class="h-2.5 w-2.5 rounded-full
                {status === 'idle' ? 'bg-slate-400' : ''}
                {status === 'uploading' ? 'bg-[#9AC8CD] animate-pulse' : ''}
                {status === 'processing' ? 'bg-[#0E46A3] animate-pulse' : ''}
                {status === 'done' ? 'bg-emerald-400' : ''}
                {status === 'error' ? 'bg-red-400' : ''}"
              ></div>
              <span class="text-[10px] uppercase tracking-wide text-[rgba(220,227,240,0.7)]">
                {status.toUpperCase()}
              </span>
            </div>
          </div>

          <!-- MAIN BUTTON -->
          <button
            class="w-full inline-flex items-center justify-center gap-2
                   rounded-full px-5 py-3 text-sm md:text-base font-semibold
                   text-white
                   bg-gradient-to-r from-[#0E46A3] to-[#9AC8CD]
                   border border-[rgba(225,247,245,0.30)]
                   shadow-[0_15px_35px_rgba(14,70,163,0.55)]
                   hover:shadow-[0_18px_45px_rgba(14,70,163,0.85)]
                   hover:brightness-110
                   transition-all duration-200 ease-out
                   disabled:opacity-50 disabled:cursor-not-allowed"
            on:click={handleSubmit}
            disabled={!file || status === "uploading" || status === "processing"}
          >
            {#if status === "idle" || status === "error"}
              <span>Run OCR with Ollama</span>
            {:else if status === "uploading" || status === "processing"}
              <span>Processing…</span>
            {:else if status === "done"}
              <span>Re-run OCR</span>
            {/if}
          </button>
        </div>

        <!-- PROGRESS BAR (بدون border، بس خلفية ناعمة) -->
        <div class="space-y-2">
          <div class="flex items-center justify-between text-[11px] text-[rgba(220,227,240,0.7)]">
            <span>Pipeline Progress</span>
            <span>{progress}%</span>
          </div>
          <div
            class="h-1.5 rounded-full bg-[rgba(255,255,255,0.06)] overflow-hidden"
          >
            <div
              class="h-full bg-gradient-to-r from-[#0E46A3] via-[#9AC8CD] to-[#E1F7F5] transition-all duration-200"
              style={`width: ${progress}%;`}
            ></div>
          </div>
        </div>

        {#if status === "error" && errorMessage}
          <div
            class="rounded-2xl border border-red-400/35 bg-red-500/10 px-4 py-3 text-xs text-red-100"
          >
            {errorMessage}
          </div>
        {/if}
      </div>

      <!-- RIGHT SIDE -->
      <div class="space-y-4">
        <!-- IMAGE PREVIEW -->
        <div
          class="rounded-[24px] p-4 md:p-5
                 bg-[rgba(255,255,255,0.05)]
                 border border-[rgba(225,247,245,0.18)]
                 backdrop-blur-2xl space-y-3"
        >
          <div class="flex items-center justify-between gap-2 mb-1">
            <div>
              <p class="text-xs uppercase tracking-wide text-[rgba(220,227,240,0.7)]">
                Input Image
              </p>
              <p class="text-sm font-medium text-white">
                {file ? file.name : "No file selected yet"}
              </p>
            </div>

            {#if isCached}
              <span
                class="inline-flex items-center gap-1 rounded-full
                       border border-[#9AC8CD]/60
                       bg-[#9AC8CD]/14 px-3 py-1
                       text-[10px] font-medium text-[#E1F7F5]"
              >
                <span class="h-1.5 w-1.5 rounded-full bg-[#9AC8CD]"></span>
                Cached Result
              </span>
            {/if}
          </div>

          <div
            class="relative w-full aspect-video overflow-hidden rounded-2xl
                   bg-[rgba(255,255,255,0.03)]
                   border border-[rgba(225,247,245,0.16)]
                   flex items-center justify-center"
          >
            {#if previewUrl}
              <img
                src={previewUrl}
                alt="Preview"
                class="h-full w-full object-contain"
              />
            {:else}
              <p class="text-xs md:text-sm text-[rgba(220,227,240,0.7)] px-4 text-center">
                Your image preview will appear here once you select a file from the demo uploader.
              </p>
            {/if}
          </div>
        </div>

        <!-- OCR OUTPUT -->
        <div
          class="rounded-[24px] p-4 md:p-5
                 bg-[rgba(255,255,255,0.05)]
                 border border-[rgba(225,247,245,0.18)]
                 backdrop-blur-2xl flex flex-col gap-3"
        >
          <div class="flex items-center justify-between gap-2">
            <div>
              <p class="text-xs uppercase tracking-wide text-[rgba(220,227,240,0.7)]">
                OCR Output
              </p>
              <p class="text-sm font-medium text-white">
                {status === "done" ? "Extracted text" : "Awaiting OCR result"}
              </p>
            </div>

            <button
              class="inline-flex items-center gap-1.5 rounded-full px-3 py-1
                     text-[11px] font-medium text-[#E1F7F5]
                     bg-[rgba(255,255,255,0.06)]
                     border border-[rgba(225,247,245,0.26)]
                     hover:bg-[rgba(255,255,255,0.12)]
                     transition-colors duration-200
                     disabled:opacity-40 disabled:cursor-not-allowed"
              on:click={() => {
                if (ocrText) navigator.clipboard.writeText(ocrText);
              }}
              disabled={!ocrText}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-3.5 w-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.7"
              >
                <rect
                  x="9"
                  y="9"
                  width="11"
                  height="11"
                  rx="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <span>{ocrText ? "Copy text" : "Copy (disabled)"}</span>
            </button>
          </div>

          <div
            class="min-h-[120px] max-h-52 overflow-y-auto rounded-2xl
                   bg-[rgba(0,0,0,0.22)]
                   border border-[rgba(225,247,245,0.14)]
                   px-3.5 py-3 text-xs md:text-sm text-[#DCE3F0]"
          >
            {#if status === "done" && ocrText}
              <p class="whitespace-pre-wrap">{ocrText}</p>
            {:else if status === "processing"}
              <p class="animate-pulse text-[rgba(220,227,240,0.7)]">
                Running OCR with Skywalkers engine… Please wait a moment.
              </p>
            {:else}
              <p class="text-[rgba(220,227,240,0.7)]">
                Once OCR is completed, the extracted text will appear here. Select an image and click
                &ldquo;Run OCR with Ollama&rdquo; to get started.
              </p>
            {/if}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
