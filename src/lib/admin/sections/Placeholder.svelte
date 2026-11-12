<script>
  import { ArrowLeft } from "lucide-svelte";
  import { at } from "../adminI18n.svelte.js";

  let { item } = $props();
  const Icon = $derived(item.icon);
</script>

<div class="flex min-h-[60vh] items-center justify-center">
  <div
    class="w-full max-w-xl border border-[#DED8CB] bg-white p-8 text-center shadow-[0_18px_40px_-32px_rgba(15,43,52,0.45)] sm:p-10"
  >
    <div
      class="mx-auto flex h-14 w-14 items-center justify-center border border-[#DED8CB] bg-[#FBF9F5] text-[#A31D1D]"
    >
      <Icon size={24} strokeWidth={1.6} />
    </div>
    <h2 class="mt-5 font-serif text-xl font-bold text-[#0F2B34]">
      {at("placeholder.title", { name: at(item.labelKey) })}
    </h2>
    <p class="mt-3 text-sm leading-relaxed text-[#5A636D]">
      {at("placeholder.body")}
    </p>
    <a
      href="#/admin"
      class="mt-6 inline-flex items-center gap-2 border border-[#0F2B34] bg-[#0F2B34] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#1A4553]"
    >
      <ArrowLeft size={14} />
      {at("common.backToDashboard")}
    </a>
  </div>
</div>
