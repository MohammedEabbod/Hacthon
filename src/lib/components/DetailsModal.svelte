<script lang="ts">
  import Dialog from './ui/Dialog.svelte'
  import Badge from './ui/Badge.svelte'
  import type { UploadItem } from '../api/client'
  import { createEventDispatcher } from 'svelte'

  export let open = false
  export let item: UploadItem | null = null
  const dispatch = createEventDispatcher<{ openChange: boolean }>()
  function close() { dispatch('openChange', false) }
  function fmt(ts?: string | number) {
    if (!ts) return ''
    const d = new Date(ts)
    return isNaN(d.getTime()) ? '' : d.toLocaleString()
  }
</script>

<Dialog {open} on:openChange={(e) => dispatch('openChange', e.detail)}>
  {#if item}
    <div class="flex flex-col gap-4">
      <div class="flex items-center justify-between">
        <div class="text-sm text-gray-600">{fmt(item.timestamp)}</div>
        {#if item.cached}
          <Badge variant="secondary">Cached</Badge>
        {/if}
      </div>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div class="rounded-md border bg-gray-50 p-2">
          {#if item.imageUrl}
            <img src={item.imageUrl} alt="full" class="mx-auto max-h-96 w-full object-contain" />
          {/if}
        </div>
        <div class="rounded-md border bg-white p-3">
          <div class="mb-2 text-sm font-medium">Extracted text</div>
          <pre class="max-h-96 overflow-auto whitespace-pre-wrap text-sm text-gray-800">{item.text || ''}</pre>
        </div>
      </div>
      <div class="flex items-center justify-end gap-2">
        {#if item.imageUrl}
          <a class="inline-flex items-center rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50" href={item.imageUrl} download>Download image</a>
        {/if}
        <button class="inline-flex items-center rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-black" on:click={close}>Close</button>
      </div>
    </div>
  {/if}
</Dialog>
