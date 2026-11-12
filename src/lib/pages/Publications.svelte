<script>
  import { publications } from "../data/publications.js";
  import { navigate } from "../stores/router.svelte.js";
  import { openSubscriptionModal } from "../stores/ui.svelte.js";
  import { t } from "../stores/content.svelte.js";

  let selectedFilter = $state("all"); // 'all' | '2026' | '2025' | 'special'

  let filteredIssues = $derived(
    publications.filter((p) => {
      if (selectedFilter === "all") return true;
      if (selectedFilter === "2026") return p.publishedYear === 2026;
      if (selectedFilter === "2025") return p.publishedYear === 2025;
      if (selectedFilter === "special") return !!p.badge;
      return true;
    }),
  );

  function openSubscribeModal(issue) {
    openSubscriptionModal({
      type: "single",
      issueTitle: `${issue.title} (${issue.period})`,
      price: issue.price,
    });
  }
</script>

<div class="min-h-screen w-full bg-[#F4F1EA] text-[#1E2328]">
  <!-- Header Banner -->
  <section
    class="border-b border-[#1B4856] bg-[#0F2B34] py-14 text-white sm:py-20"
  >
    <div class="mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-8">
      <div class="max-w-3xl space-y-3">
        <div
          class="inline-flex items-center space-x-2 text-xs font-semibold text-[#FDD835]"
        >
          <span>■</span>
          <span data-content-key="publications.hero.eyebrow"
            >{t("publications.hero.eyebrow")}</span
          >
        </div>
        <h1
          data-content-key="publications.hero.title"
          class="font-serif text-3xl font-bold tracking-tight text-white sm:text-5xl"
        >
          {t("publications.hero.title")}
        </h1>
        <div class="my-3 h-1 w-20 bg-[#FDD835]"></div>
        <p
          data-content-key="publications.hero.description"
          class="text-sm font-light leading-relaxed text-[#8BA3AC] sm:text-base"
        >
          {t("publications.hero.description")}
        </p>
      </div>
    </div>
  </section>

  <!-- Filter Controls -->
  <section class="border-b border-[#D8D2C4] bg-[#EDE9DE]">
    <div
      class="mx-auto flex max-w-[1380px] flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8"
    >
      <!-- Filter Tabs -->
      <div
        class="flex items-center space-x-2 text-xs font-medium sm:space-x-4 sm:text-sm"
      >
        <button
          onclick={() => (selectedFilter = "all")}
          data-content-key="publications.filter.all"
          class="px-4 py-1.5 transition-all {selectedFilter === 'all'
            ? 'shadow-xs bg-[#0F2B34] text-white'
            : 'bg-white/60 text-[#374151] hover:text-black'}"
        >
          {t("publications.filter.all", { count: publications.length })}
        </button>
        <button
          onclick={() => (selectedFilter = "2026")}
          data-content-key="publications.filter.year2026"
          class="px-4 py-1.5 transition-all {selectedFilter === '2026'
            ? 'shadow-xs bg-[#0F2B34] text-white'
            : 'bg-white/60 text-[#374151] hover:text-black'}"
        >
          {t("publications.filter.year2026")}
        </button>
        <button
          onclick={() => (selectedFilter = "2025")}
          data-content-key="publications.filter.year2025"
          class="px-4 py-1.5 transition-all {selectedFilter === '2025'
            ? 'shadow-xs bg-[#0F2B34] text-white'
            : 'bg-white/60 text-[#374151] hover:text-black'}"
        >
          {t("publications.filter.year2025")}
        </button>
        <button
          onclick={() => (selectedFilter = "special")}
          data-content-key="publications.filter.special"
          class="px-4 py-1.5 transition-all {selectedFilter === 'special'
            ? 'shadow-xs bg-[#0F2B34] text-white'
            : 'bg-white/60 text-[#374151] hover:text-black'}"
        >
          {t("publications.filter.special")}
        </button>
      </div>

      <div
        data-content-key="publications.filter.shippingNote"
        class="text-xs text-[#5A636D]"
      >
        {t("publications.filter.shippingNote")}
      </div>
    </div>
  </section>

  <!-- Publications Grid -->
  <section class="mx-auto max-w-[1380px] px-4 py-16 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-2">
      {#each filteredIssues as issue}
        <div
          class="group flex flex-col overflow-hidden border border-[#D8D2C4] bg-white shadow-sm transition-all duration-300 hover:shadow-xl sm:flex-row"
        >
          <!-- Cover Column with Yellow Border -->
          <div
            class="flex shrink-0 items-center justify-center bg-[#EDE8DC] p-4 sm:w-52"
          >
            <div
              class="yellow-framed-image w-full max-w-[200px] cursor-pointer"
              onclick={() => navigate(`/publication/${issue.id}`)}
            >
              <div class="relative aspect-[3/4] overflow-hidden bg-black">
                <img
                  src={issue.coverImage}
                  alt={issue.title}
                  class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {#if issue.badge}
                  <span
                    class="absolute left-1 top-1 bg-[#A31D1D] px-1.5 py-0.5 text-[9px] font-bold text-white"
                  >
                    {issue.badge}
                  </span>
                {/if}

                <div
                  data-content-key="publications.card.issueNumber"
                  class="absolute inset-x-0 bottom-0 bg-black/85 p-1.5 text-center text-[10px] text-[#FDD835]"
                >
                  {t("publications.card.issueNumber", {
                    number: issue.issueNumber,
                  })}
                </div>
              </div>
            </div>
          </div>

          <!-- Information Column -->
          <div class="flex flex-1 flex-col justify-between space-y-4 p-6">
            <div>
              <div
                class="mb-1 flex items-center justify-between text-xs text-[#6B7280]"
              >
                <span class="font-medium text-[#A31D1D]"
                  >{issue.banglaTitle}</span
                >
                <span>{issue.period}</span>
              </div>

              <h2
                class="mb-2 cursor-pointer font-serif text-xl font-bold leading-snug text-[#0F2B34] transition-colors group-hover:text-[#A31D1D] sm:text-2xl"
                onclick={() => navigate(`/publication/${issue.id}`)}
              >
                {issue.title}
              </h2>

              <p class="mb-3 text-xs font-medium text-[#7D5A29]">
                {issue.subtitle}
              </p>

              <p
                class="mb-4 line-clamp-3 text-xs font-light leading-relaxed text-[#4B5563] sm:text-sm"
              >
                {issue.summary}
              </p>

              <!-- Highlights list -->
              <div
                class="mb-4 hidden space-y-1 text-xs text-[#55606E] sm:block"
              >
                {#each issue.highlights.slice(0, 2) as hl}
                  <div class="flex items-start space-x-1.5">
                    <span class="text-xs text-[#FDD835]">◆</span>
                    <span class="line-clamp-1">{hl}</span>
                  </div>
                {/each}
              </div>
            </div>

            <!-- Price and Action Buttons -->
            <div
              class="flex items-center justify-between gap-3 border-t border-[#F0ECE1] pt-4"
            >
              <div>
                <span
                  data-content-key="publications.card.price"
                  class="text-base font-bold text-[#0F2B34] sm:text-lg"
                  >{t("publications.card.price", { price: issue.price })}</span
                >
                <span
                  data-content-key="publications.card.printInfo"
                  class="block text-xs text-[#7B8794]"
                  >{t("publications.card.printInfo", {
                    pages: issue.pageCount,
                  })}</span
                >
              </div>

              <div class="flex items-center space-x-2">
                <button
                  onclick={() => navigate(`/publication/${issue.id}`)}
                  data-content-key="publications.card.toc"
                  class="border border-[#0F2B34] px-3.5 py-2 text-xs font-medium text-[#0F2B34] transition-colors hover:bg-[#0F2B34] hover:text-white"
                >
                  {t("publications.card.toc")}
                </button>
                <button
                  onclick={() => openSubscribeModal(issue)}
                  data-content-key="publications.card.buy"
                  class="shadow-xs bg-[#A31D1D] px-4 py-2 text-xs font-semibold tracking-wide text-white transition-all hover:bg-[#851414] active:scale-95"
                >
                  {t("publications.card.buy")}
                </button>
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </section>
</div>
