<script>
  import { toast } from "../stores/ui.svelte.js";
  import { t } from "../stores/content.svelte.js";

  const current = $derived(toast.current);
</script>

{#if current}
  <div
    class="animate-in slide-in-from-bottom-5 fixed bottom-6 right-6 z-50 max-w-sm duration-300"
  >
    <div
      class="flex items-center space-x-3 border-l-4 px-4 py-3 shadow-xl {current.type ===
      'error'
        ? 'border-[#FFDF00] bg-[#7D1212] text-white'
        : current.type === 'info'
          ? 'border-[#FDD835] bg-[#0F2B34] text-white'
          : 'border-[#FDD835] bg-[#0F2B34] text-white'}"
    >
      <div class="shrink-0 text-lg">
        {#if current.type === "error"}
          ⚠️
        {:else if current.type === "info"}
          ℹ️
        {:else}
          ✓
        {/if}
      </div>
      <div class="pr-2 text-sm font-medium">
        {current.message}
      </div>
      <button
        onclick={() => toast.dismiss()}
        class="ml-auto text-base leading-none text-gray-300 hover:text-white"
        aria-label={t("toast.dismiss")}
        data-content-key-aria-label="toast.dismiss"
      >
        ✕
      </button>
    </div>
  </div>
{/if}
