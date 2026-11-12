<script>
  import {
    ArrowRight,
    ExternalLink,
    FileText,
    Languages,
    Layers,
    Link2,
  } from "lucide-svelte";
  import { at } from "../adminI18n.svelte.js";
  import { getBaseContent } from "../../stores/content.svelte.js";

  const entries = Object.entries(getBaseContent());
  const totalKeys = entries.length;
  const totalLinks = entries.filter(([, entry]) => entry.href).length;
  const totalGroups = new Set(entries.map(([key]) => key.split(".")[0])).size;

  const stats = [
    { labelKey: "dashboard.stat.keys", value: totalKeys, icon: FileText },
    { labelKey: "dashboard.stat.links", value: totalLinks, icon: Link2 },
    { labelKey: "dashboard.stat.groups", value: totalGroups, icon: Layers },
    { labelKey: "dashboard.stat.languages", value: 2, icon: Languages },
  ];
</script>

<div class="space-y-6">
  <section
    class="border border-[#DED8CB] bg-white p-6 shadow-[0_18px_40px_-32px_rgba(15,43,52,0.45)] sm:p-8"
  >
    <p
      class="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#A31D1D]"
    >
      {at("common.prototype")}
    </p>
    <h2 class="mt-2 font-serif text-2xl font-bold text-[#0F2B34] sm:text-3xl">
      {at("dashboard.welcome")}
    </h2>
    <p class="mt-3 max-w-3xl text-sm leading-relaxed text-[#5A636D]">
      {at("dashboard.lead")}
    </p>
  </section>

  <section
    class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
    aria-label={at("dashboard.subtitle")}
  >
    {#each stats as stat}
      {@const Icon = stat.icon}
      <div class="border border-[#DED8CB] bg-white p-5">
        <div class="flex items-center justify-between gap-3">
          <p class="text-xs font-medium text-[#5A636D]">
            {at(stat.labelKey)}
          </p>
          <Icon size={18} class="shrink-0 text-[#A31D1D]" />
        </div>
        <p class="mt-3 font-serif text-3xl font-bold text-[#0F2B34]">
          {stat.value}
        </p>
      </div>
    {/each}
  </section>

  <section class="space-y-3">
    <h2 class="font-serif text-lg font-bold text-[#0F2B34]">
      {at("dashboard.quick.title")}
    </h2>
    <div class="grid gap-4 md:grid-cols-2">
      <a
        href="#/admin/content"
        class="group flex items-center justify-between gap-4 border border-[#DED8CB] bg-white p-5 transition-colors hover:border-[#0F2B34]"
      >
        <div class="min-w-0">
          <p class="font-serif text-base font-bold text-[#0F2B34]">
            {at("dashboard.quick.content")}
          </p>
          <p class="mt-1 text-xs text-[#5A636D]">
            {at("dashboard.quick.contentHint", {
              keys: totalKeys,
              links: totalLinks,
            })}
          </p>
        </div>
        <ArrowRight
          size={18}
          class="shrink-0 text-[#A31D1D] transition-transform group-hover:translate-x-1"
        />
      </a>
      <a
        href="#/"
        class="group flex items-center justify-between gap-4 border border-[#DED8CB] bg-white p-5 transition-colors hover:border-[#0F2B34]"
      >
        <div class="min-w-0">
          <p class="font-serif text-base font-bold text-[#0F2B34]">
            {at("dashboard.quick.site")}
          </p>
          <p class="mt-1 text-xs text-[#5A636D]">
            {at("dashboard.quick.siteHint")}
          </p>
        </div>
        <ExternalLink size={18} class="shrink-0 text-[#A31D1D]" />
      </a>
    </div>
  </section>

  <section class="border-l-4 border-[#FDD835] bg-[#FBF9F5] p-5 sm:p-6">
    <h2 class="font-serif text-base font-bold text-[#0F2B34]">
      {at("dashboard.notice.title")}
    </h2>
    <p class="mt-2 max-w-3xl text-sm leading-relaxed text-[#5A636D]">
      {at("dashboard.notice.body")}
    </p>
  </section>
</div>
