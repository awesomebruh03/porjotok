<script>
  import { toast } from '../stores/ui.svelte.js';

  const current = $derived(toast.current);
</script>

{#if current}
  <div class="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300 max-w-sm">
    <div
      class="flex items-center space-x-3 px-4 py-3 shadow-xl border-l-4 {current.type === 'error' ? 'bg-[#7D1212] text-white border-[#FFDF00]' : current.type === 'info' ? 'bg-[#0F2B34] text-white border-[#FDD835]' : 'bg-[#0F2B34] text-white border-[#FDD835]'}"
    >
      <div class="shrink-0 text-lg">
        {#if current.type === 'error'}
          ⚠️
        {:else if current.type === 'info'}
          ℹ️
        {:else}
          ✓
        {/if}
      </div>
      <div class="text-sm font-medium pr-2">
        {current.message}
      </div>
      <button
        onclick={() => toast.dismiss()}
        class="text-gray-300 hover:text-white text-base leading-none ml-auto"
        aria-label="বন্ধ করুন"
      >
        ✕
      </button>
    </div>
  </div>
{/if}
