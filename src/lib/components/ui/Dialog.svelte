<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  export let open = false
  export let closeOnOverlay = true
  const dispatch = createEventDispatcher<{ openChange: boolean }>()
  function close() { dispatch('openChange', false) }
  function onKeydown(e: KeyboardEvent) { if (open && e.key === 'Escape') close() }
</script>
<svelte:window on:keydown={onKeydown} />
{#if open}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center"
    role="dialog"
    aria-modal="true"
    aria-label="Dialog"
  >
    <button
      type="button"
      class="fixed inset-0 bg-black/40"
      aria-label="Close dialog"
      on:click={() => closeOnOverlay && close()}
    ></button>
    <div class="relative z-10 w-full max-w-3xl rounded-lg border bg-white shadow-lg">
      <div class="p-4">
        <slot />
      </div>
    </div>
  </div>
{/if}
