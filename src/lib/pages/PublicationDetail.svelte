<script>
  import { publications } from "../data/publications.js";
  import { articles } from "../data/articles.js";
  import { router, navigate } from "../stores/router.svelte.js";
  import { openSubscriptionModal } from "../stores/ui.svelte.js";
  import { t, link } from "../stores/content.svelte.js";
  import RichText from "../components/RichText.svelte";

  let { params = {} } = $props();

  let issueId = $derived(params.id || router.current.params?.id || "issue-38");
  let issue = $derived(
    publications.find((p) => p.id === issueId) || publications[0],
  );
  let otherIssues = $derived(publications.filter((p) => p.id !== issue.id));

  function openOrder(type = "single") {
    openSubscriptionModal({
      type: type,
      issueTitle: `${issue.title} — ${issue.subtitle}`,
      price: type === "single" ? issue.price : issue.digitalPrice,
    });
  }

  // Find if an article exists in the articles database for this TOC entry
  function findMatchingArticle(tocTitle) {
    return articles.find(
      (a) =>
        tocTitle.includes(a.title.slice(0, 15)) ||
        a.title.includes(tocTitle.slice(0, 15)),
    );
  }
</script>

<div class="min-h-screen w-full bg-[#F4F1EA] text-[#1E2328]">
  <!-- Breadcrumb & Back Link -->
  <div class="border-b border-[#D8D2C4] bg-[#EDE9DE]">
    <div
      class="mx-auto flex max-w-[1380px] items-center space-x-2 px-4 py-3 text-xs text-[#5A636D] sm:px-6 lg:px-8"
    >
      <a {...link("publicationDetail.breadcrumb.home")} class="hover:text-black"
        >{t("publicationDetail.breadcrumb.home")}</a
      >
      <span>/</span>
      <a
        {...link("publicationDetail.breadcrumb.publications")}
        class="hover:text-black"
        >{t("publicationDetail.breadcrumb.publications")}</a
      >
      <span>/</span>
      <span class="font-medium text-[#A31D1D]">{issue.title}</span>
    </div>
  </div>

  <!-- Hero Section of Issue -->
  <section
    class="border-b border-[#1B4856] bg-[#0F2B34] py-14 text-white sm:py-20"
  >
    <div class="mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-8">
      <div
        class="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14"
      >
        <!-- Left: Framed Cover with Reflection -->
        <div class="flex justify-center lg:col-span-5">
          <div class="w-full max-w-[320px]">
            <div class="yellow-framed-image relative shadow-2xl">
              <div class="relative aspect-[3/4] overflow-hidden bg-black">
                <img
                  src={issue.coverImage}
                  alt={issue.title}
                  class="h-full w-full object-cover"
                />
                {#if issue.badge}
                  <span
                    class="absolute left-2 top-2 bg-[#A31D1D] px-2 py-0.5 text-[11px] font-bold text-white shadow-md"
                  >
                    {issue.badge}
                  </span>
                {/if}
                <div
                  class="absolute inset-x-0 bottom-0 border-t border-white/10 bg-black/85 p-3 text-center"
                >
                  <span class="text-xs font-semibold text-[#FDD835]"
                    >{issue.banglaTitle}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Information & Action -->
        <div class="space-y-6 lg:col-span-7">
          <div
            class="inline-flex items-center space-x-2 text-xs font-semibold text-[#FDD835]"
          >
            <span>■</span>
            <span data-content-key="publicationDetail.hero.periodIssue"
              >{t("publicationDetail.hero.periodIssue", {
                period: issue.period,
                number: issue.issueNumber,
              })}</span
            >
          </div>

          <h1
            class="font-serif text-3xl font-bold leading-tight tracking-tight text-white sm:text-5xl"
          >
            {issue.title}
          </h1>

          <p class="text-base font-medium text-[#FDD835] sm:text-lg">
            {issue.subtitle}
          </p>

          <p
            class="max-w-xl text-sm font-light leading-relaxed text-[#8BA3AC] sm:text-base"
          >
            {issue.summary}
          </p>

          <!-- Specifications Tags -->
          <div class="flex flex-wrap gap-2 pt-2 text-xs text-[#ADC5CE]">
            <span
              data-content-key="publicationDetail.hero.pageCount"
              class="border border-[#1B4856] bg-[#143844] px-3 py-1"
              >{t("publicationDetail.hero.pageCount", {
                pages: issue.pageCount,
              })}</span
            >
            <span class="border border-[#1B4856] bg-[#143844] px-3 py-1"
              >{issue.specifications.paper}</span
            >
            <span class="border border-[#1B4856] bg-[#143844] px-3 py-1"
              >{issue.specifications.format}</span
            >
          </div>

          <!-- Purchase Action Buttons -->
          <div class="flex flex-wrap items-center gap-4 pt-4">
            <button
              onclick={() => openOrder("single")}
              class="flex items-center space-x-2 bg-[#FDD835] px-6 py-3 text-sm font-bold tracking-wide text-[#0F2B34] shadow-md transition-all hover:bg-[#FFDE00] active:scale-95"
            >
              <span data-content-key="publicationDetail.hero.orderPrint"
                >{t("publicationDetail.hero.orderPrint", {
                  price: issue.price,
                })}</span
              >
              <span>→</span>
            </button>

            <button
              onclick={() => openOrder("digital")}
              data-content-key="publicationDetail.hero.orderDigital"
              class="border border-white px-5 py-3 text-sm font-medium text-white transition-all hover:bg-white hover:text-[#0F2B34] active:scale-95"
            >
              {t("publicationDetail.hero.orderDigital", {
                price: issue.digitalPrice,
              })}
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Table of Contents (সূচিপত্র) -->
  <section class="mx-auto max-w-[1380px] px-4 py-16 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 gap-12 lg:grid-cols-12">
      <!-- Left Column: Table of Contents -->
      <div class="border border-[#D8D2C4] bg-white p-8 shadow-sm lg:col-span-8">
        <div
          class="mb-8 flex items-end justify-between border-b-2 border-[#0F2B34] pb-4"
        >
          <div>
            <span
              data-content-key="publicationDetail.toc.eyebrow"
              class="mb-1 block text-xs font-bold uppercase tracking-wider text-[#A31D1D]"
            >
              {t("publicationDetail.toc.eyebrow")}
            </span>
            <h2
              data-content-key="publicationDetail.toc.title"
              class="font-serif text-2xl font-bold text-[#0F2B34] sm:text-3xl"
            >
              {t("publicationDetail.toc.title")}
            </h2>
          </div>
          <span
            data-content-key="publicationDetail.toc.total"
            class="text-xs text-[#6B7280]"
          >
            {t("publicationDetail.toc.total", {
              count: issue.tableOfContents.length,
            })}
          </span>
        </div>

        <div class="divide-y divide-[#E6E1D5]">
          {#each issue.tableOfContents as item}
            {@const matched = findMatchingArticle(item.title)}
            <div class="py-4.5 group flex items-start justify-between gap-4">
              <div class="space-y-1">
                <div class="flex items-center space-x-2">
                  <span
                    class="text-[11px] font-semibold tracking-wide text-[#A31D1D]"
                  >
                    {item.category}
                  </span>
                  {#if matched}
                    <span
                      data-content-key="publicationDetail.toc.readableOnline"
                      class="py-0.2 bg-[#EDE8DC] px-1.5 text-[10px] font-medium text-[#0F2B34]"
                    >
                      {t("publicationDetail.toc.readableOnline")}
                    </span>
                  {/if}
                </div>

                {#if matched}
                  <a
                    href="#/article/{matched.id}"
                    class="block font-serif text-base font-bold leading-snug text-[#0F2B34] transition-colors group-hover:text-[#A31D1D] sm:text-lg"
                  >
                    {item.title} →
                  </a>
                {:else}
                  <h3
                    class="font-serif text-base font-bold leading-snug text-[#0F2B34] sm:text-lg"
                  >
                    {item.title}
                  </h3>
                {/if}

                <p
                  data-content-key="publicationDetail.toc.author"
                  class="text-xs text-[#6B7280]"
                >
                  <RichText
                    key="publicationDetail.toc.author"
                    vars={{ author: item.author }}
                    highlightClass="font-medium text-[#1E2328]"
                  />
                </p>
              </div>

              <!-- Page Number Badge -->
              <div class="shrink-0 text-right">
                <span
                  data-content-key="publicationDetail.toc.page"
                  class="bg-[#EDE8DC] px-2.5 py-1 font-mono text-xs font-semibold text-[#0F2B34] sm:text-sm"
                >
                  {t("publicationDetail.toc.page", { page: item.page })}
                </span>
              </div>
            </div>
          {/each}
        </div>
      </div>

      <!-- Right Column: Highlights & Print Specifications -->
      <div class="space-y-8 lg:col-span-4">
        <!-- Highlights Box -->
        <div class="border border-[#D8D2C4] bg-white p-6 shadow-sm">
          <h3
            data-content-key="publicationDetail.highlights.title"
            class="mb-4 border-b border-[#E6E1D5] pb-2 font-serif text-lg font-bold text-[#0F2B34]"
          >
            {t("publicationDetail.highlights.title")}
          </h3>
          <ul class="space-y-3 text-xs text-[#374151] sm:text-sm">
            {#each issue.highlights as hl}
              <li class="flex items-start space-x-2">
                <span class="text-sm font-bold leading-none text-[#A31D1D]"
                  >•</span
                >
                <span class="leading-relaxed">{hl}</span>
              </li>
            {/each}
          </ul>
        </div>

        <!-- Print Specs Box -->
        <div class="border border-[#D8D2C4] bg-[#EDE9DE] p-6">
          <h3
            data-content-key="publicationDetail.specs.title"
            class="mb-4 border-b border-[#D8D2C4] pb-2 font-serif text-lg font-bold text-[#0F2B34]"
          >
            {t("publicationDetail.specs.title")}
          </h3>
          <dl class="space-y-2 text-xs text-[#374151]">
            <div class="flex justify-between border-b border-[#E0DBCF] py-1">
              <dt
                data-content-key="publicationDetail.specs.size"
                class="text-[#6B7280]"
              >
                {t("publicationDetail.specs.size")}
              </dt>
              <dd class="font-medium">{issue.specifications.format}</dd>
            </div>
            <div class="flex justify-between border-b border-[#E0DBCF] py-1">
              <dt
                data-content-key="publicationDetail.specs.paper"
                class="text-[#6B7280]"
              >
                {t("publicationDetail.specs.paper")}
              </dt>
              <dd class="font-medium">{issue.specifications.paper}</dd>
            </div>
            <div class="flex justify-between border-b border-[#E0DBCF] py-1">
              <dt
                data-content-key="publicationDetail.specs.cover"
                class="text-[#6B7280]"
              >
                {t("publicationDetail.specs.cover")}
              </dt>
              <dd class="font-medium">{issue.specifications.cover}</dd>
            </div>
            <div class="flex justify-between border-b border-[#E0DBCF] py-1">
              <dt
                data-content-key="publicationDetail.specs.binding"
                class="text-[#6B7280]"
              >
                {t("publicationDetail.specs.binding")}
              </dt>
              <dd class="font-medium">{issue.specifications.binding}</dd>
            </div>
            <div class="flex justify-between py-1">
              <dt
                data-content-key="publicationDetail.specs.issn"
                class="text-[#6B7280]"
              >
                {t("publicationDetail.specs.issn")}
              </dt>
              <dd class="font-mono">{issue.specifications.issn}</dd>
            </div>
          </dl>
        </div>

        <!-- Annual Subscription Promo -->
        <div class="border-l-4 border-[#FDD835] bg-[#0F2B34] p-6 text-white">
          <h4
            data-content-key="publicationDetail.promo.title"
            class="mb-2 font-serif text-base font-bold text-[#FDD835]"
          >
            {t("publicationDetail.promo.title")}
          </h4>
          <p
            data-content-key="publicationDetail.promo.description"
            class="mb-4 text-xs leading-relaxed text-[#8BA3AC]"
          >
            {t("publicationDetail.promo.description")}
          </p>
          <button
            onclick={() => openOrder("annual")}
            data-content-key="publicationDetail.promo.button"
            class="w-full bg-[#A31D1D] py-2 text-xs font-semibold tracking-wide text-white transition-colors hover:bg-[#851414]"
          >
            {t("publicationDetail.promo.button")}
          </button>
        </div>
      </div>
    </div>
  </section>

  <!-- Related Other Issues -->
  <section class="mx-auto max-w-[1380px] px-4 pb-20 sm:px-6 lg:px-8">
    <div class="border-t border-[#D8D2C4] pt-12">
      <h3
        data-content-key="publicationDetail.related.title"
        class="mb-6 font-serif text-2xl font-bold text-[#0F2B34]"
      >
        {t("publicationDetail.related.title")}
      </h3>

      <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {#each otherIssues as other}
          <div
            class="group flex cursor-pointer items-center space-x-4 border border-[#D8D2C4] bg-white p-4 transition-all hover:shadow-md"
            onclick={() => navigate(`/publication/${other.id}`)}
          >
            <div class="yellow-framed-image w-16 shrink-0">
              <img
                src={other.coverImage}
                alt={other.title}
                class="aspect-[3/4] object-cover"
              />
            </div>
            <div>
              <span class="text-[11px] font-semibold text-[#A31D1D]"
                >{other.banglaTitle}</span
              >
              <h4
                class="font-serif text-sm font-bold leading-snug text-[#0F2B34] transition-colors group-hover:text-[#A31D1D]"
              >
                {other.title}
              </h4>
              <p
                data-content-key="publicationDetail.related.price"
                class="mt-1 text-xs text-gray-500"
              >
                {t("publicationDetail.related.price", { price: other.price })}
              </p>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>
</div>
