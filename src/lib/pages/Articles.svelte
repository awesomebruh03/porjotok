<script>
  import { articles } from "../data/articles.js";
  import { categories } from "../data/categories.js";
  import { router, navigate } from "../stores/router.svelte.js";
  import { t } from "../stores/content.svelte.js";

  let selectedCategory = $state(router.current.query?.category || "all");
  let searchQuery = $state("");
  let visibleCount = $state(6);

  // React to query param in URL if present
  $effect(() => {
    const queryCategory = router.current.query?.category;
    if (queryCategory) {
      selectedCategory = queryCategory;
    }
  });

  let filteredArticles = $derived(
    articles.filter((a) => {
      const matchesCat =
        selectedCategory === "all" || a.category === selectedCategory;
      const matchesSearch =
        !searchQuery.trim() ||
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    }),
  );

  let paginatedArticles = $derived(filteredArticles.slice(0, visibleCount));
  let hasMore = $derived(visibleCount < filteredArticles.length);

  function loadMore() {
    visibleCount += 3;
  }

  function setCategory(catId) {
    selectedCategory = catId;
    visibleCount = 6;
  }
</script>

<div class="min-h-screen w-full bg-[#F4F1EA] text-[#1E2328]">
  <!-- Header Banner -->
  <section
    class="sm:py-18 border-b border-[#1B4856] bg-[#0F2B34] py-14 text-white"
  >
    <div class="mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-8">
      <div class="max-w-3xl space-y-3">
        <div
          class="inline-flex items-center space-x-2 text-xs font-semibold text-[#FDD835]"
        >
          <span>■</span>
          <span data-content-key="articles.hero.eyebrow"
            >{t("articles.hero.eyebrow")}</span
          >
        </div>
        <h1
          data-content-key="articles.hero.headline"
          class="font-serif text-3xl font-bold tracking-tight text-white sm:text-5xl"
        >
          {t("articles.hero.headline")}
        </h1>
        <div class="my-3 h-1 w-20 bg-[#FDD835]"></div>
        <p
          data-content-key="articles.hero.intro"
          class="text-sm font-light leading-relaxed text-[#8BA3AC] sm:text-base"
        >
          {t("articles.hero.intro")}
        </p>
      </div>
    </div>
  </section>

  <!-- Filter & Search Controls Bar -->
  <section
    class="shadow-xs sticky top-[74px] z-30 border-b border-[#D8D2C4] bg-[#EDE9DE]"
  >
    <div
      class="mx-auto flex max-w-[1380px] flex-col items-center justify-between gap-4 px-4 py-3.5 sm:px-6 md:flex-row lg:px-8"
    >
      <!-- Category Filter Pills -->
      <div
        class="scrollbar-none flex w-full items-center space-x-1.5 overflow-x-auto pb-1 text-xs font-medium sm:text-sm md:w-auto md:pb-0"
      >
        <button
          onclick={() => setCategory("all")}
          data-content-key="articles.filter.all"
          class="whitespace-nowrap rounded-none px-3.5 py-1.5 transition-colors {selectedCategory ===
          'all'
            ? 'bg-[#0F2B34] text-white'
            : 'bg-white/70 text-[#374151] hover:bg-white'}"
        >
          {t("articles.filter.all", { count: articles.length })}
        </button>
        {#each categories as cat}
          <button
            onclick={() => setCategory(cat.id)}
            class="whitespace-nowrap rounded-none px-3.5 py-1.5 transition-colors {selectedCategory ===
            cat.id
              ? 'bg-[#0F2B34] text-white'
              : 'bg-white/70 text-[#374151] hover:bg-white'}"
          >
            {cat.name}
          </button>
        {/each}
      </div>

      <!-- Search Input in Filter Bar -->
      <div class="w-full shrink-0 md:w-72">
        <div class="relative">
          <input
            type="text"
            bind:value={searchQuery}
            placeholder={t("articles.search.placeholder")}
            data-content-key-placeholder="articles.search.placeholder"
            class="w-full border border-[#C5BFB0] bg-white px-3 py-1.5 pl-8 text-xs focus:border-[#0F2B34] focus:outline-none sm:text-sm"
          />
          <svg
            class="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {#if searchQuery}
            <button
              onclick={() => (searchQuery = "")}
              class="absolute right-2 top-2 text-xs text-gray-400 hover:text-black"
            >
              ✕
            </button>
          {/if}
        </div>
      </div>
    </div>
  </section>

  <!-- Main Articles Content -->
  <section class="mx-auto max-w-[1380px] px-4 py-14 sm:px-6 lg:px-8">
    {#if filteredArticles.length === 0}
      <!-- Empty State -->
      <div
        class="mx-auto max-w-lg space-y-4 border border-[#D8D2C4] bg-white p-12 text-center"
      >
        <div class="text-4xl">🔍</div>
        <h3
          data-content-key="articles.empty.title"
          class="font-serif text-xl font-bold text-[#0F2B34]"
        >
          {t("articles.empty.title")}
        </h3>
        <p
          data-content-key="articles.empty.message"
          class="text-xs text-gray-500 sm:text-sm"
        >
          {t("articles.empty.message", { query: searchQuery })}
        </p>
        <button
          onclick={() => {
            searchQuery = "";
            selectedCategory = "all";
          }}
          data-content-key="articles.empty.reset"
          class="bg-[#0F2B34] px-4 py-2 text-xs font-semibold text-white"
        >
          {t("articles.empty.reset")}
        </button>
      </div>
    {:else}
      <!-- Top Lead Featured Article (if on all and no active search) -->
      {#if selectedCategory === "all" && !searchQuery}
        {@const featured = filteredArticles[0]}
        <div
          class="group mb-12 grid cursor-pointer grid-cols-1 items-center gap-8 border border-[#D8D2C4] bg-white p-6 shadow-sm transition-all hover:shadow-xl sm:p-8 lg:grid-cols-12"
          onclick={() => navigate(`/article/${featured.id}`)}
        >
          <div class="lg:col-span-7">
            <div class="yellow-framed-image">
              <div class="aspect-[16/9] overflow-hidden bg-black">
                <img
                  src={featured.coverImage}
                  alt={featured.title}
                  class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>
          </div>
          <div class="space-y-3 lg:col-span-5">
            <div
              class="inline-flex items-center space-x-2 text-xs font-semibold text-[#A31D1D]"
            >
              <span>◎</span>
              <span>{featured.categoryBadge}</span>
            </div>
            <h2
              class="font-serif text-2xl font-bold leading-tight text-[#0F2B34] transition-colors group-hover:text-[#A31D1D] sm:text-3xl"
            >
              {featured.title}
            </h2>
            <div class="h-1 w-12 bg-[#A31D1D]"></div>
            <p
              class="line-clamp-3 text-xs font-light leading-relaxed text-[#4B5563] sm:text-sm"
            >
              {featured.excerpt}
            </p>
            <div
              class="flex items-center justify-between border-t border-[#F0ECE1] pt-3 text-xs text-[#6B7280]"
            >
              <span>{featured.author}</span>
              <span data-content-key="articles.featured.readTime"
                >{t("articles.featured.readTime", {
                  readingTime: featured.readingTime ?? "",
                })}</span
              >
            </div>
          </div>
        </div>
      {/if}

      <!-- Grid of Articles -->
      <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {#each paginatedArticles as article}
          <div
            class="group flex cursor-pointer flex-col border border-[#D8D2C4] bg-white shadow-sm transition-all duration-300 hover:shadow-xl"
            onclick={() => navigate(`/article/${article.id}`)}
          >
            <!-- Yellow framed photo -->
            <div class="bg-white p-3">
              <div class="yellow-framed-image">
                <div class="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div
                    class="backdrop-blur-xs absolute left-2 top-2 bg-black/80 px-2 py-0.5 text-[10px] text-white"
                  >
                    {article.categoryLabel}
                  </div>
                </div>
              </div>
            </div>

            <!-- Content -->
            <div class="flex flex-1 flex-col justify-between space-y-3 p-5">
              <div>
                <span
                  class="mb-1 block text-[11px] font-semibold text-[#A31D1D]"
                >
                  {article.categoryBadge}
                </span>
                <h3
                  class="mb-2 font-serif text-lg font-bold leading-snug text-[#0F2B34] transition-colors group-hover:text-[#A31D1D]"
                >
                  {article.title}
                </h3>
                <p
                  class="line-clamp-3 text-xs font-light leading-relaxed text-[#4B5563] sm:text-sm"
                >
                  {article.excerpt}
                </p>
              </div>

              <!-- Footer -->
              <div
                class="flex items-center justify-between border-t border-[#F0ECE1] pt-3 text-xs text-[#6B7280]"
              >
                <span>{article.author}</span>
                <span>{article.readingTime}</span>
              </div>
            </div>
          </div>
        {/each}
      </div>

      <!-- Load More Button -->
      {#if hasMore}
        <div class="mt-14 text-center">
          <button
            onclick={loadMore}
            data-content-key="articles.loadMore"
            class="bg-[#0F2B34] px-8 py-3 text-xs font-semibold tracking-wide text-white shadow-sm transition-all hover:bg-[#1A4553] active:scale-95 sm:text-sm"
          >
            {t("articles.loadMore", {
              remaining: filteredArticles.length - visibleCount,
            })}
          </button>
        </div>
      {/if}
    {/if}
  </section>
</div>
