<script lang="ts">
  import Card from './ui/Card.svelte'
  import Badge from './ui/Badge.svelte'
  import type { UploadItem } from '../api/client'
  import { createEventDispatcher } from 'svelte'

  export let item: UploadItem
  const dispatch = createEventDispatcher<{ details: UploadItem }>()
  $: img = item?.thumbnailUrl || item?.imageUrl || ''
  function preview(s?: string | null) {
    const t = s || ''
    return t.length > 200 ? t.slice(0, 200) + '…' : (t || 'Processing…')
  }
  function openDetails() { dispatch('details', item) }
  function fmt(ts?: string | number) {
    if (!ts) return ''
    const d = new Date(ts)
    return isNaN(d.getTime()) ? '' : d.toLocaleString()
  }
</script>

<Card className="overflow-hidden">
  <div class="aspect-[4/3] w-full overflow-hidden bg-gray-100">
    {#if img}
      <img src={img} alt="thumbnail" class="h-full w-full object-cover" loading="lazy" />
    {:else}
      <div class="h-full w-full"></div>
    {/if}
  </div>
  <div slot="header" class="flex items-center justify-between gap-2">
    <div class="text-sm text-gray-600">{fmt(item?.timestamp)}</div>
    {#if item?.cached}
      <Badge variant="secondary">Cached</Badge>
    {/if}
  </div>
  <div>{preview(item?.text)}</div>
  <div slot="footer" class="flex items-center justify-end">
    <button class="inline-flex items-center rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-black" on:click={openDetails}>View details</button>
  </div>
</Card>
