<script lang="ts">
  import { onMount } from 'svelte'
  import { api, type UploadItem, type ApiError } from '../lib/api/client'
  import UploadCard from '../lib/components/UploadCard.svelte'
  import Skeleton from '../lib/components/ui/Skeleton.svelte'
  import DetailsModal from '../lib/components/DetailsModal.svelte'

  let uploads: UploadItem[] = []
  let page = 1
  const limit = 50
  let loading = true
  let loadingMore = false
  let endReached = false
  let error: string | null = null
  let detailsOpen = false
  let selected: UploadItem | null = null

  let q = ''
  let cached: 'all' | 'cached' | 'fresh' = 'all'

  async function load(initial = false) {
    try {
      if (initial) {
        loading = true
        error = null
        uploads = []
        page = 1
        endReached = false
      } else {
        loadingMore = true
      }
      const list = await api.history(page, limit)
      const normalized = (list || []).map((x) => ({
        id: (x as any).id,
        text: (x as any).text ?? '',
        cached: Boolean((x as any).cached),
        timestamp: (x as any).timestamp ?? (x as any).createdAt ?? (x as any).date,
        imageUrl: (x as any).imageUrl ?? (x as any).image_url ?? (x as any).url,
        thumbnailUrl: (x as any).thumbnailUrl ?? (x as any).thumb_url
      }))
      normalized.sort((a, b) => new Date(b.timestamp as any).getTime() - new Date(a.timestamp as any).getTime())
      uploads = [...uploads, ...normalized]
      if (normalized.length < limit) endReached = true
      page += 1
    } catch (e) {
      const err = e as ApiError
      error = err.message || 'Failed to load history'
    } finally {
      loading = false
      loadingMore = false
    }
  }

  function openDetails(item: UploadItem) {
    selected = item
    detailsOpen = true
  }

  $: filtered = uploads.filter((u) => {
    const byCache = cached === 'all' ? true : cached === 'cached' ? !!u.cached : !u.cached
    const byText = q ? (u.text || '').toLowerCase().includes(q.toLowerCase()) : true
    return byCache && byText
  })

  onMount(() => load(true))
</script>

<div class="flex flex-col gap-12 pt-4">
  <section class="flex flex-col gap-4 text-center md:text-left">
    <div class="inline-block px-4 py-2 bg-secondary-teal/10 border border-secondary-teal/30 rounded-full text-secondary-teal text-sm font-medium w-fit mx-auto md:mx-0">
      Records
    </div>
    <h1 class="text-3xl md:text-[2.5rem] leading-[1.1] font-bold text-text-main">
      Processing <span class="bg-gradient-to-br from-secondary-teal to-secondary-light bg-clip-text text-transparent">History</span>
    </h1>
    <p class="text-base md:text-lg text-text-secondary leading-relaxed max-w-[90%] mx-auto md:mx-0">
      Browse all your past OCR results, search within extracted text, and filter by cache status.
    </p>
  </section>

  <section class="bg-white/5 backdrop-blur-xl border border-secondary-light/15 rounded-3xl p-6 md:p-8 flex flex-col gap-6">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex flex-col gap-1 text-left">
        <span class="text-sm font-medium uppercase tracking-[0.12em] text-secondary-teal/80">Filters</span>
        <span class="text-sm text-text-secondary">Refine your history by text and cache status.</span>
      </div>
      <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          placeholder="Search text"
          bind:value={q}
          class="h-10 w-full sm:w-[240px] rounded-full border border-secondary-light/40 bg-white/5 px-4 text-sm text-text-main placeholder:text-text-secondary/70 focus:outline-none focus:ring-2 focus:ring-secondary-teal/60 focus:border-transparent"
        />
        <select
          bind:value={cached}
          class="h-10 rounded-full border border-secondary-light/40 bg-white/5 px-4 text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-secondary-teal/60 focus:border-transparent"
        >
          <option value="all">All</option>
          <option value="cached">Cached</option>
          <option value="fresh">Not cached</option>
        </select>
      </div>
    </div>

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
      <div class="rounded-2xl border border-red-200/60 bg-red-500/10 p-4 text-sm text-red-100">
        {error}
      </div>
    {:else if filtered.length === 0}
      <div class="rounded-2xl border border-secondary-light/20 bg-white/5 p-6 text-center text-sm text-text-secondary">
        No uploads match the current filters.
      </div>
    {:else}
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {#each filtered as item (item.id)}
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

<DetailsModal bind:open={detailsOpen} item={selected} on:openChange={(e) => (detailsOpen = e.detail)} />
