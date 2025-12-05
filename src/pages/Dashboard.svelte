<script>
  import { onMount } from "svelte";
  import { api } from "../services/api";
  import UploadCard from "../lib/components/UploadCard.svelte";
  import Skeleton from "../lib/components/ui/Skeleton.svelte";
  import DetailsModal from "../lib/components/DetailsModal.svelte";

  let uploads = [];
  let page = 1;
  const limit = 20;
  let loading = true;
  let loadingMore = false;
  let endReached = false;
  let error = null;
  let detailsOpen = false;
  let selected = null;

  async function load(initial = false) {
    try {
      if (initial) {
        loading = true;
        error = null;
        uploads = [];
        page = 1;
        endReached = false;
      } else {
        loadingMore = true;
      }
      const list = await api.history(page, limit);
      const normalized = (list || []).map((x) => ({
        id: x.id,
        text: x.text ?? "",
        cached: Boolean(x.cached),
        timestamp: x.timestamp ?? x.createdAt ?? x.date,
        imageUrl: x.imageUrl ?? x.image_url ?? x.url,
        thumbnailUrl: x.thumbnailUrl ?? x.thumb_url,
      }));
      normalized.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      );
      uploads = [...uploads, ...normalized];
      if (normalized.length < limit) endReached = true;
      page += 1;
    } catch (e) {
      // Handle 404 or "Not Found" as empty state
      if (
        e.message &&
        (e.message.includes("Not Found") || e.message.includes("404"))
      ) {
        uploads = [];
        error = null;
      } else {
        error = e.message || "Failed to load history";
      }
    } finally {
      loading = false;
      loadingMore = false;
    }
  }

  function openDetails(item) {
    selected = item;
    detailsOpen = true;
  }

  onMount(() => load(true));
</script>

<div class="flex flex-col gap-12 pt-4">
  <section class="flex flex-col gap-4 text-center md:text-left">
    <div
      class="inline-block px-4 py-2 bg-secondary-teal/10 border border-secondary-teal/30 rounded-full text-secondary-teal text-sm font-medium w-fit mx-auto md:mx-0"
    >
      Overview
    </div>
    <h1
      class="text-3xl md:text-[2.5rem] leading-[1.1] font-bold text-text-main"
    >
      Your <span
        class="bg-gradient-to-br from-secondary-teal to-secondary-light bg-clip-text text-transparent"
        >Dashboard</span
      >
    </h1>
    <p
      class="text-base md:text-lg text-text-secondary leading-relaxed max-w-[90%] mx-auto md:mx-0"
    >
      Track and manage all your recent OCR uploads in one place. Open any item
      to preview the image and extracted text.
    </p>
  </section>

  <section
    class="bg-white/5 backdrop-blur-xl border border-secondary-light/15 rounded-3xl p-6 md:p-8 flex flex-col gap-6"
  >
    {#if loading}
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {#each Array(6) as _}
          <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
            <Skeleton className="mb-3 h-40 w-full" />
            <Skeleton className="mb-2 h-4 w-1/2" />
            <Skeleton className="mb-2 h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
          </div>
        {/each}
      </div>
    {:else if error}
      <div
        class="rounded-2xl border border-red-200/60 bg-red-500/10 p-4 text-sm text-red-100"
      >
        {error}
      </div>
    {:else if uploads.length === 0}
      <div
        class="flex flex-col items-center justify-center gap-4 rounded-2xl border border-secondary-light/20 bg-white/5 p-12 text-center"
      >
        <div class="rounded-full bg-secondary-teal/10 p-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-8 w-8 text-secondary-teal"
            ><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline
              points="17 8 12 3 7 8"
            /><line x1="12" x2="12" y1="3" y2="15" /></svg
          >
        </div>
        <div class="space-y-1">
          <h3 class="text-lg font-semibold text-text-main">No uploads yet</h3>
          <p class="text-sm text-text-secondary">
            Start by processing your first image to see it here.
          </p>
        </div>
        <a
          href="#/demo"
          class="mt-2 inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-primary-blue to-secondary-teal px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105"
        >
          Upload your first image
        </a>
      </div>
    {:else}
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {#each uploads as item (item.id)}
          <UploadCard {item} on:details={(e) => openDetails(e.detail)} />
        {/each}
      </div>
      {#if !endReached}
        <div class="mt-6 flex justify-center">
          <button
            class="flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-primary-blue to-secondary-teal text-white border border-secondary-light/40 rounded-full text-sm font-semibold font-['Lexend'] cursor-pointer transition-all duration-200 shadow-[0_4px_15px_rgba(14,70,163,0.3)] hover:scale-102 hover:shadow-[0_6px_20px_rgba(14,70,163,0.4)] hover:brightness-110 disabled:opacity-60"
            on:click={() => load(false)}
            disabled={loadingMore}
          >
            {#if loadingMore}Loading…{/if}
            {#if !loadingMore}Load more{/if}
          </button>
        </div>
      {/if}
    {/if}
  </section>
</div>

<DetailsModal
  bind:open={detailsOpen}
  item={selected}
  on:openChange={(e) => (detailsOpen = e.detail)}
/>
