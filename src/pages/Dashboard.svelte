<script lang="ts"> 
  import { onMount } from 'svelte'
  import { api, type UploadItem, type ApiError } from '../lib/api/client'
  import UploadCard from '../lib/components/UploadCard.svelte'
  import Skeleton from '../lib/components/ui/Skeleton.svelte'
  import DetailsModal from '../lib/components/DetailsModal.svelte'

  let uploads: UploadItem[] = []
  let page = 1
  const limit = 20
  let loading = true
  let loadingMore = false
  let endReached = false
  let error: string | null = null
  let detailsOpen = false
  let selected: UploadItem | null = null

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

  onMount(() => load(true))
</script>

<div class="mb-4 flex items-center justify-between">
  <h1 class="text-xl font-semibold">Dashboard</h1>
</div>

{#if loading}
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {#each Array(6) as _}
      <div class="rounded-lg border bg-white p-4">
        <Skeleton className="mb-3 h-40 w-full" />
        <Skeleton className="mb-2 h-4 w-1/2" />
        <Skeleton className="mb-2 h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
      </div>
    {/each}
  </div>
{:else if error}
  <div class="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>
{:else if uploads.length === 0}
  <div class="rounded-md border bg-white p-6 text-center text-sm text-gray-600">No uploads yet.</div>
{:else}
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {#each uploads as item (item.id)}
      <UploadCard {item} on:details={(e) => openDetails(e.detail)} />
    {/each}
  </div>
  {#if !endReached}
    <div class="mt-6 flex justify-center">
      <button class="inline-flex items-center rounded-md border px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-60" on:click={() => load(false)} disabled={loadingMore}>
        {#if loadingMore}Loading…{/if}
        {#if !loadingMore}Load more{/if}
      </button>
    </div>
  {/if}
{/if}

<DetailsModal bind:open={detailsOpen} item={selected} on:openChange={(e) => (detailsOpen = e.detail)} />
