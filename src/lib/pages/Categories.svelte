<script>
  import { categories } from "../data/categories.js";
  import { articles } from "../data/articles.js";
  import { router, navigate } from "../stores/router.svelte.js";
  import { t, hrefOf } from "../stores/content.svelte.js";

  let { params = {} } = $props();

  let activeCategorySlug = $derived(
    params.category || router.current.params?.category || null,
  );
  let activeCategory = $derived(
    activeCategorySlug
      ? categories.find(
          (c) => c.slug === activeCategorySlug || c.id === activeCategorySlug,
        )
      : null,
  );

  let categoryArticles = $derived(
    activeCategory
      ? articles.filter((a) => a.category === activeCategory.id)
      : [],
  );

  function selectCategory(slug, fallbackKey = "categories.filter.all") {
    if (slug) {
      navigate(`/categories/${slug}`);
    } else {
      navigate(hrefOf(fallbackKey));
    }
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
          <span data-content-key="categories.banner.eyebrow"
            >{t("categories.banner.eyebrow")}</span
          >
        </div>

        {#if activeCategory}
          <h1
            data-content-key="categories.detail.title"
            class="font-serif text-3xl font-bold tracking-tight text-white sm:text-5xl"
          >
            {t("categories.detail.title", { name: activeCategory.name })}
          </h1>
          <p class="font-mono text-xs tracking-wider text-[#FDD835]">
            {activeCategory.englishName}
          </p>
          <div class="my-3 h-1 w-20 bg-[#FDD835]"></div>
          <p
            class="text-sm font-light leading-relaxed text-[#8BA3AC] sm:text-base"
          >
            {activeCategory.description}
          </p>
        {:else}
          <h1
            data-content-key="categories.overview.title"
            class="font-serif text-3xl font-bold tracking-tight text-white sm:text-5xl"
          >
            {t("categories.overview.title")}
          </h1>
          <div class="my-3 h-1 w-20 bg-[#FDD835]"></div>
          <p
            data-content-key="categories.overview.description"
            class="text-sm font-light leading-relaxed text-[#8BA3AC] sm:text-base"
          >
            {t("categories.overview.description")}
          </p>
        {/if}
      </div>
    </div>
  </section>

  <!-- Category Filter Pills Bar -->
  <section
    class="shadow-xs sticky top-[74px] z-30 border-b border-[#D8D2C4] bg-[#EDE9DE]"
  >
    <div
      class="scrollbar-none mx-auto flex max-w-[1380px] items-center space-x-2 overflow-x-auto px-4 py-3.5 text-xs font-medium sm:px-6 sm:text-sm lg:px-8"
    >
      <button
        onclick={() => selectCategory(null, "categories.filter.all")}
        data-content-key="categories.filter.all"
        class="whitespace-nowrap px-4 py-1.5 transition-colors {!activeCategory
          ? 'bg-[#0F2B34] text-white'
          : 'bg-white/70 text-[#374151] hover:bg-white'}"
      >
        {t("categories.filter.all")}
      </button>
      {#each categories as cat}
        <button
          onclick={() => selectCategory(cat.slug)}
          class="whitespace-nowrap px-4 py-1.5 transition-colors {activeCategory?.id ===
          cat.id
            ? 'bg-[#0F2B34] text-white'
            : 'bg-white/70 text-[#374151] hover:bg-white'}"
        >
          {cat.name}
        </button>
      {/each}
    </div>
  </section>

  <!-- Main Content -->
  <section class="mx-auto max-w-[1380px] px-4 py-16 sm:px-6 lg:px-8">
    {#if activeCategory}
      <!-- Specific Category View: Articles in this category -->
      <div class="space-y-10">
        <div
          class="flex items-center justify-between border-b border-[#D8D2C4] pb-4"
        >
          <h2
            data-content-key="categories.detail.heading"
            class="font-serif text-2xl font-bold text-[#0F2B34]"
          >
            {t("categories.detail.heading", {
              name: activeCategory.name,
              count: categoryArticles.length,
            })}
          </h2>
          <button
            onclick={() => selectCategory(null, "categories.detail.back")}
            data-content-key="categories.detail.back"
            class="text-xs font-semibold text-[#A31D1D] hover:underline"
          >
            {t("categories.detail.back")}
          </button>
        </div>

        {#if categoryArticles.length === 0}
          <div
            data-content-key="categories.detail.empty"
            class="border border-[#D8D2C4] bg-white p-10 text-center text-gray-500"
          >
            {t("categories.detail.empty")}
          </div>
        {:else}
          <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {#each categoryArticles as article}
              <div
                class="group flex cursor-pointer flex-col border border-[#D8D2C4] bg-white shadow-sm transition-all duration-300 hover:shadow-xl"
                onclick={() => navigate(`/article/${article.id}`)}
              >
                <div class="bg-white p-3">
                  <div class="yellow-framed-image">
                    <div class="aspect-[16/10] overflow-hidden bg-black">
                      <img
                        src={article.coverImage}
                        alt={article.title}
                        class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  </div>
                </div>
                <div class="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <span class="text-[11px] font-semibold text-[#A31D1D]"
                      >{article.categoryBadge}</span
                    >
                    <h3
                      class="mb-2 mt-1 font-serif text-lg font-bold leading-snug text-[#0F2B34] transition-colors group-hover:text-[#A31D1D]"
                    >
                      {article.title}
                    </h3>
                    <p
                      class="line-clamp-3 text-xs leading-relaxed text-gray-600"
                    >
                      {article.excerpt}
                    </p>
                  </div>
                  <div
                    class="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-500"
                  >
                    <span>{article.author}</span>
                    <span>{article.readingTime}</span>
                  </div>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    {:else}
      <!-- All Categories Overview Grid -->
      <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {#each categories as cat}
          {@const catArticles = articles.filter((a) => a.category === cat.id)}
          <div
            class="group flex cursor-pointer flex-col border border-[#D8D2C4] bg-white shadow-sm transition-all duration-300 hover:shadow-2xl"
            onclick={() => selectCategory(cat.slug)}
          >
            <!-- Yellow framed photo -->
            <div class="bg-[#EDE8DC] p-4">
              <div class="yellow-framed-image">
                <div class="relative aspect-[16/10] overflow-hidden bg-black">
                  <img
                    src={cat.heroImage}
                    alt={cat.name}
                    class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div
                    class="absolute left-2 top-2 bg-[#0F2B34]/90 px-2 py-0.5 text-xs font-bold text-[#FDD835]"
                  >
                    {cat.name}
                  </div>
                </div>
              </div>
            </div>

            <!-- Content -->
            <div class="flex flex-1 flex-col justify-between space-y-4 p-6">
              <div>
                <div
                  class="mb-1 font-mono text-[11px] uppercase tracking-wider text-[#A31D1D]"
                >
                  {cat.englishName}
                </div>
                <h3
                  class="mb-2 font-serif text-2xl font-bold text-[#0F2B34] transition-colors group-hover:text-[#A31D1D]"
                >
                  {cat.name}
                </h3>
                <p
                  class="mb-4 text-xs font-light leading-relaxed text-[#4B5563] sm:text-sm"
                >
                  {cat.description}
                </p>

                <!-- Tags -->
                <div class="mb-2 flex flex-wrap gap-1.5">
                  {#each cat.tags as tag}
                    <span
                      class="bg-[#F0ECE1] px-2 py-0.5 text-[10px] text-[#374151]"
                    >
                      #{tag}
                    </span>
                  {/each}
                </div>
              </div>

              <!-- Footer with Action -->
              <div
                class="flex items-center justify-between border-t border-[#F0ECE1] pt-4 text-xs"
              >
                <span
                  data-content-key="categories.card.count"
                  class="font-medium text-[#7B8794]"
                  >{t("categories.card.count", {
                    count: catArticles.length,
                  })}</span
                >
                <span
                  class="flex items-center space-x-1 font-bold text-[#0F2B34] transition-colors group-hover:text-[#A31D1D]"
                >
                  <span data-content-key="categories.card.view"
                    >{t("categories.card.view")}</span
                  >
                  <span>→</span>
                </span>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </section>
</div>
