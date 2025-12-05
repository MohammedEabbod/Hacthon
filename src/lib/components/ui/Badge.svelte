<script lang="ts">
  export let variant: 'default' | 'secondary' | 'outline' = 'default'
  export let className = ''
  $: base = 'inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium'
  $: color = variant === 'default'
    ? 'border-transparent bg-gray-900 text-white'
    : variant === 'secondary'
    ? 'border-transparent bg-gray-100 text-gray-900'
    : 'border-gray-200 text-gray-700'
</script>
<span class={`${base} ${color} ${className}`}><slot /></span>
