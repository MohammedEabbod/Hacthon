<script lang="ts">
  export let className = ''
</script>

<div class={`rounded-lg border border-gray-200 bg-white shadow-sm ${className}`}>
  {#if $$slots.header}
    <div class="p-4 border-b"><slot name="header" /></div>
  {/if}
  <div class="p-4"><slot /></div>
  {#if $$slots.footer}
    <div class="p-4 border-t"><slot name="footer" /></div>
  {/if}
</div>
