<script>
  import { ExternalLink } from "lucide-svelte";
  import { at } from "./adminI18n.svelte.js";
  import { ADMIN_NAV } from "./nav.js";

  let { current, drawerOpen = $bindable(false) } = $props();
</script>

{#if drawerOpen}
  <button
    type="button"
    class="fixed inset-0 z-40 bg-black/45 backdrop-blur-[1px] lg:hidden"
    onclick={() => (drawerOpen = false)}
    aria-label={at("nav.close")}
  ></button>
{/if}

<aside
  class="fixed inset-y-0 left-0 z-50 flex w-[272px] shrink-0 flex-col bg-[#0F2B34] text-white shadow-2xl transition-transform duration-300 lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:translate-x-0 lg:shadow-none {drawerOpen
    ? 'translate-x-0'
    : '-translate-x-full'}"
>
  <div class="flex items-center gap-3 border-b border-white/10 px-5 py-5">
    <div
      class="flex h-11 w-11 shrink-0 items-center justify-center border-2 border-[#FDD835] font-serif text-xl font-bold text-[#FDD835]"
    >
      {at("common.monogram")}
    </div>
    <div class="min-w-0">
      <p class="truncate font-serif text-xl font-bold leading-tight">
        {at("common.brand")}
      </p>
      <p class="mt-0.5 text-[10px] uppercase tracking-[0.22em] text-[#7B98A2]">
        {at("common.admin")}
      </p>
    </div>
  </div>

  <nav class="flex-1 overflow-y-auto px-3 py-4" aria-label={at("nav.primary")}>
    <ul class="space-y-1">
      {#each ADMIN_NAV as item}
        {@const Icon = item.icon}
        {@const active = current.id === item.id}
        <li>
          <a
            href={"#" + item.path}
            onclick={() => (drawerOpen = false)}
            aria-current={active ? "page" : undefined}
            class="group relative flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm transition-colors {active
              ? 'bg-white/10 font-semibold text-white'
              : 'text-[#ADC5CE] hover:bg-white/5 hover:text-white'}"
          >
            {#if active}
              <span class="absolute inset-y-1.5 left-0 w-0.5 bg-[#FDD835]"
              ></span>
            {/if}
            <Icon
              size={17}
              strokeWidth={1.8}
              class={active
                ? "shrink-0 text-[#FDD835]"
                : "shrink-0 text-[#7B98A2] transition-colors group-hover:text-[#FDD835]"}
            />
            <span class="truncate">{at(item.labelKey)}</span>
          </a>
        </li>
      {/each}
    </ul>
  </nav>

  <div class="border-t border-white/10 p-4">
    <a
      href="#/"
      class="flex items-center justify-between rounded-sm bg-white/5 px-3 py-2 text-xs text-[#ADC5CE] transition-colors hover:bg-white/10 hover:text-white"
    >
      <span>{at("common.viewSite")}</span>
      <ExternalLink size={14} />
    </a>
    <p
      class="mt-3 flex items-center justify-between px-1 text-[10px] uppercase tracking-widest text-[#7B98A2]"
    >
      <span>{at("common.prototype")}</span>
      <span>{at("common.version")}</span>
    </p>
  </div>
</aside>
