<script>
  import { Menu } from "lucide-svelte";
  import { adminLang, at, setAdminLang } from "./adminI18n.svelte.js";

  let { current, onMenu } = $props();

  const languages = [
    { id: "bn", labelKey: "common.bangla" },
    { id: "en", labelKey: "common.english" },
  ];
</script>

<header
  class="sticky top-0 z-30 border-b border-[#DED8CB] bg-[#FBF9F5]/95 backdrop-blur"
>
  <div class="flex items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6 lg:px-10">
    <button
      type="button"
      class="flex h-9 w-9 shrink-0 items-center justify-center border border-[#DED8CB] bg-white text-[#0F2B34] transition-colors hover:border-[#0F2B34] lg:hidden"
      onclick={onMenu}
      aria-label={at("nav.menu")}
    >
      <Menu size={18} />
    </button>

    <div class="min-w-0 flex-1">
      <div class="flex items-center gap-2">
        <h1
          class="truncate font-serif text-lg font-bold text-[#0F2B34] sm:text-xl"
        >
          {at(current.labelKey)}
        </h1>
        <span
          class="hidden shrink-0 border border-[#FDD835] bg-[#FDD835]/20 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-widest text-[#0F2B34] sm:inline-block"
        >
          {at("common.draftMode")}
        </span>
      </div>
      <p class="mt-0.5 hidden truncate text-xs text-[#5A636D] sm:block">
        {at(current.descriptionKey)}
      </p>
    </div>

    <div
      class="flex shrink-0 items-center gap-0.5 border border-[#DED8CB] bg-white p-0.5"
      role="group"
      aria-label={at("common.language")}
    >
      {#each languages as language}
        {@const active = adminLang.value === language.id}
        <button
          type="button"
          onclick={() => setAdminLang(language.id)}
          aria-pressed={active}
          class="px-2.5 py-1 text-xs transition-colors {active
            ? 'bg-[#0F2B34] font-semibold text-white'
            : 'text-[#5A636D] hover:text-[#0F2B34]'}"
        >
          {at(language.labelKey)}
        </button>
      {/each}
    </div>
  </div>
</header>
