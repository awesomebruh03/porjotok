<script>
  import { articles } from "../data/articles.js";
  import { publications } from "../data/publications.js";
  import { router, navigate } from "../stores/router.svelte.js";
  import { t } from "../stores/content.svelte.js";
  import {
    matchesFields,
    ARTICLE_SEARCH_FIELDS,
    PUBLICATION_SEARCH_FIELDS,
  } from "../translate/search.js";

  let searchQuery = $state("");
  let activeTab = $state("all"); // 'all' | 'articles' | 'publications'

  $effect(() => {
    const q = router.current.query?.q;
    if (q && !searchQuery) {
      searchQuery = q;
    }
  });

  let matchedArticles = $derived(
    searchQuery.trim()
      ? articles.filter((a) =>
          matchesFields(a, searchQuery, ARTICLE_SEARCH_FIELDS),
        )
      : [],
  );

  let matchedPublications = $derived(
    searchQuery.trim()
      ? publications.filter((p) =>
          matchesFields(p, searchQuery, PUBLICATION_SEARCH_FIELDS),
        )
      : [],
  );

  let totalMatches = $derived(
    matchedArticles.length + matchedPublications.length,
  );
</script>

<div class="min-h-screen w-full bg-[#F4F1EA] text-[#1E2328]">
  <!-- Header Banner with Search Bar -->
  <section
    class="border-b border-[#1B4856] bg-[#0F2B34] py-14 text-white sm:py-20"
  >
    <div class="mx-auto max-w-[1100px] space-y-6 px-4 sm:px-6 lg:px-8">
      <div class="space-y-2">
        <div
          class="inline-flex items-center space-x-2 text-xs font-semibold text-[#FDD835]"
        >
          <span>■</span>
          <span data-content-key="search.hero.eyebrow"
            >{t("search.hero.eyebrow")}</span
          >
        </div>
        <h1
          data-content-key="search.hero.headline"
          class="font-serif text-3xl font-bold tracking-tight text-white sm:text-5xl"
        >
          {t("search.hero.headline")}
        </h1>
      </div>

      <!-- Large Search Input Box -->
      <div class="relative max-w-2xl">
        <input
          type="text"
          bind:value={searchQuery}
          placeholder={t("search.input.placeholder")}
          data-content-key-placeholder="search.input.placeholder"
          class="w-full border-2 border-[#FDD835] bg-white px-5 py-3.5 pr-12 text-sm text-[#1E2328] shadow-lg focus:outline-none sm:text-base"
          autofocus
        />
        {#if searchQuery}
          <button
            onclick={() => (searchQuery = "")}
            class="absolute right-4 top-3.5 text-lg text-gray-400 hover:text-black"
            title={t("search.input.clear")}
            data-content-key-title="search.input.clear"
          >
            ✕
          </button>
        {/if}
      </div>

      <!-- Quick suggestions -->
      <div class="flex flex-wrap items-center gap-2 text-xs text-[#8BA3AC]">
        <span data-content-key="search.suggestions.label"
          >{t("search.suggestions.label")}</span
        >
        <button
          onclick={() => (searchQuery = t("search.suggestions.barind"))}
          data-content-key="search.suggestions.barind"
          class="underline hover:text-[#FDD835]"
          >{t("search.suggestions.barind")}</button
        >
        <span>•</span>
        <button
          onclick={() => (searchQuery = t("search.suggestions.sundarbans"))}
          data-content-key="search.suggestions.sundarbans"
          class="underline hover:text-[#FDD835]"
          >{t("search.suggestions.sundarbans")}</button
        >
        <span>•</span>
        <button
          onclick={() => (searchQuery = t("search.suggestions.river"))}
          data-content-key="search.suggestions.river"
          class="underline hover:text-[#FDD835]"
          >{t("search.suggestions.river")}</button
        >
        <span>•</span>
        <button
          onclick={() => (searchQuery = t("search.suggestions.kantajiu"))}
          data-content-key="search.suggestions.kantajiu"
          class="underline hover:text-[#FDD835]"
          >{t("search.suggestions.kantajiu")}</button
        >
        <span>•</span>
        <button
          onclick={() => (searchQuery = t("search.suggestions.haor"))}
          data-content-key="search.suggestions.haor"
          class="underline hover:text-[#FDD835]"
          >{t("search.suggestions.haor")}</button
        >
      </div>
    </div>
  </section>

  <!-- Filter & Result Stats Bar -->
  <section class="border-b border-[#D8D2C4] bg-[#EDE9DE]">
    <div
      class="mx-auto flex max-w-[1100px] flex-wrap items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8"
    >
      <div class="flex items-center space-x-2 text-xs font-medium sm:text-sm">
        <button
          onclick={() => (activeTab = "all")}
          data-content-key="search.tab.all"
          class="px-3.5 py-1.5 {activeTab === 'all'
            ? 'bg-[#0F2B34] text-white'
            : 'bg-white/70 text-gray-700 hover:bg-white'}"
        >
          {t("search.tab.all", { count: totalMatches })}
        </button>
        <button
          onclick={() => (activeTab = "articles")}
          data-content-key="search.tab.articles"
          class="px-3.5 py-1.5 {activeTab === 'articles'
            ? 'bg-[#0F2B34] text-white'
            : 'bg-white/70 text-gray-700 hover:bg-white'}"
        >
          {t("search.tab.articles", { count: matchedArticles.length })}
        </button>
        <button
          onclick={() => (activeTab = "publications")}
          data-content-key="search.tab.publications"
          class="px-3.5 py-1.5 {activeTab === 'publications'
            ? 'bg-[#0F2B34] text-white'
            : 'bg-white/70 text-gray-700 hover:bg-white'}"
        >
          {t("search.tab.publications", { count: matchedPublications.length })}
        </button>
      </div>

      {#if searchQuery.trim()}
        <div
          class="text-xs text-[#5A636D]"
          data-content-key="search.stats.suffix"
        >
          ‘<strong class="text-black">{searchQuery}</strong>{t(
            "search.stats.suffix",
            { count: totalMatches },
          )}
        </div>
      {/if}
    </div>
  </section>

  <!-- Results Content -->
  <section class="mx-auto max-w-[1100px] px-4 py-14 sm:px-6 lg:px-8">
    {#if !searchQuery.trim()}
      <div
        class="mx-auto max-w-md space-y-3 border border-[#D8D2C4] bg-white p-12 text-center"
      >
        <div class="text-3xl text-[#0F2B34]">🔍</div>
        <h3
          data-content-key="search.prompt.title"
          class="font-serif text-lg font-bold text-[#0F2B34]"
        >
          {t("search.prompt.title")}
        </h3>
        <p
          data-content-key="search.prompt.message"
          class="text-xs text-gray-500"
        >
          {t("search.prompt.message")}
        </p>
      </div>
    {:else if totalMatches === 0}
      <div
        class="mx-auto max-w-md space-y-3 border border-[#D8D2C4] bg-white p-12 text-center"
      >
        <div class="text-3xl">⚠️</div>
        <h3
          data-content-key="search.empty.title"
          class="font-serif text-lg font-bold text-[#0F2B34]"
        >
          {t("search.empty.title")}
        </h3>
        <p
          data-content-key="search.empty.message"
          class="text-xs text-gray-500"
        >
          {t("search.empty.message", { query: searchQuery })}
        </p>
      </div>
    {:else}
      <div class="space-y-12">
        <!-- Matched Articles Section -->
        {#if (activeTab === "all" || activeTab === "articles") && matchedArticles.length > 0}
          <div class="space-y-6">
            <h2
              data-content-key="search.results.articlesHeading"
              class="border-b border-[#D8D2C4] pb-2 font-serif text-xl font-bold text-[#0F2B34]"
            >
              {t("search.results.articlesHeading", {
                count: matchedArticles.length,
              })}
            </h2>

            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
              {#each matchedArticles as art}
                <div
                  class="group flex cursor-pointer space-x-4 border border-[#D8D2C4] bg-white p-4 transition-all hover:shadow-lg"
                  role="button"
                  tabindex="0"
                  onclick={() => navigate(`/article/${art.id}`)}
                  onkeydown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      navigate(`/article/${art.id}`);
                  }}
                >
                  <div class="yellow-framed-image w-28 shrink-0 self-start">
                    <img
                      src={art.coverImage}
                      alt={art.title}
                      class="aspect-[4/3] object-cover"
                    />
                  </div>
                  <div class="flex flex-1 flex-col justify-between">
                    <div>
                      <span class="text-[10px] font-bold text-[#A31D1D]"
                        >{art.categoryBadge}</span
                      >
                      <h3
                        class="mb-1.5 mt-0.5 font-serif text-base font-bold leading-snug text-[#0F2B34] transition-colors group-hover:text-[#A31D1D]"
                      >
                        {art.title}
                      </h3>
                      <p
                        class="line-clamp-2 text-xs leading-relaxed text-gray-500"
                      >
                        {art.excerpt}
                      </p>
                    </div>
                    <div
                      class="mt-2 flex justify-between border-t border-gray-100 pt-2 text-[11px] text-gray-400"
                    >
                      <span>{art.author}</span>
                      <span>{art.readingTime}</span>
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        {/if}

        <!-- Matched Publications Section -->
        {#if (activeTab === "all" || activeTab === "publications") && matchedPublications.length > 0}
          <div class="space-y-6">
            <h2
              data-content-key="search.results.publicationsHeading"
              class="border-b border-[#D8D2C4] pb-2 font-serif text-xl font-bold text-[#0F2B34]"
            >
              {t("search.results.publicationsHeading", {
                count: matchedPublications.length,
              })}
            </h2>

            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
              {#each matchedPublications as pub}
                <div
                  class="group flex cursor-pointer space-x-4 border border-[#D8D2C4] bg-white p-4 transition-all hover:shadow-lg"
                  role="button"
                  tabindex="0"
                  onclick={() => navigate(`/publication/${pub.id}`)}
                  onkeydown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      navigate(`/publication/${pub.id}`);
                  }}
                >
                  <div class="yellow-framed-image w-20 shrink-0 self-start">
                    <img
                      src={pub.coverImage}
                      alt={pub.title}
                      class="aspect-[3/4] object-cover"
                    />
                  </div>
                  <div class="flex flex-1 flex-col justify-between">
                    <div>
                      <span class="text-[10px] font-bold text-[#A31D1D]"
                        >{pub.banglaTitle}</span
                      >
                      <h3
                        class="mb-1 mt-0.5 font-serif text-base font-bold leading-snug text-[#0F2B34] transition-colors group-hover:text-[#A31D1D]"
                      >
                        {pub.title}
                      </h3>
                      <p
                        class="line-clamp-2 text-xs leading-relaxed text-gray-600"
                      >
                        {pub.summary}
                      </p>
                    </div>
                    <div
                      class="mt-2 flex items-center justify-between border-t border-gray-100 pt-2 text-xs"
                    >
                      <span
                        data-content-key="search.results.price"
                        class="font-bold text-[#0F2B34]"
                        >{t("search.results.price", {
                          price: pub.price ?? "",
                        })}</span
                      >
                      <span
                        data-content-key="search.results.viewDetails"
                        class="font-medium text-[#A31D1D] group-hover:underline"
                        >{t("search.results.viewDetails")}</span
                      >
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        {/if}
      </div>
    {/if}
  </section>
</div>
