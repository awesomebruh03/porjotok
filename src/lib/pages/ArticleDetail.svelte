<script>
  import { articles } from "../data/articles.js";
  import { router, navigate } from "../stores/router.svelte.js";
  import { bookmarks, toggleBookmark, toast } from "../stores/ui.svelte.js";
  import { t, link } from "../stores/content.svelte.js";

  let { params = {} } = $props();

  let fontSize = $state("medium"); // 'small' | 'medium' | 'large'

  let articleId = $derived(
    params.id || router.current.params?.id || "mustard-banyan-tree",
  );
  let article = $derived(
    articles.find((a) => a.id === articleId) || articles[0],
  );
  let isBookmarked = $derived(bookmarks.includes(article.id));
  let relatedArticles = $derived(
    articles
      .filter(
        (a) =>
          a.id !== article.id &&
          (a.category === article.category || a.issueId === article.issueId),
      )
      .slice(0, 3),
  );

  async function handleShare() {
    const shareData = {
      title: article.title,
      text: article.subtitle,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.show(t("articleDetail.toast.shared"), "success");
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      // Clipboard fallback
      navigator.clipboard.writeText(window.location.href);
      toast.show(t("articleDetail.toast.copied"), "success");
    }
  }

  function printArticle() {
    window.print();
  }
</script>

<div class="min-h-screen w-full bg-[#F4F1EA] text-[#1E2328]">
  <!-- Breadcrumb & Reader Toolbar Bar -->
  <div
    class="shadow-xs sticky top-[74px] z-30 border-b border-[#D8D2C4] bg-[#EDE9DE]"
  >
    <div
      class="mx-auto flex max-w-[1100px] items-center justify-between px-4 py-2.5 text-xs text-[#5A636D] sm:px-6"
    >
      <!-- Breadcrumb -->
      <div class="flex items-center space-x-2 truncate">
        <a {...link("articleDetail.breadcrumb.home")} class="hover:text-black"
          >{t("articleDetail.breadcrumb.home")}</a
        >
        <span>/</span>
        <a
          {...link("articleDetail.breadcrumb.articles")}
          class="hover:text-black">{t("articleDetail.breadcrumb.articles")}</a
        >
        <span>/</span>
        <span
          class="max-w-[200px] truncate font-medium text-[#A31D1D] sm:max-w-none"
          >{article.title}</span
        >
      </div>

      <!-- Reading Controls: Font Size, Bookmark, Share -->
      <div class="flex shrink-0 items-center space-x-3">
        <!-- Font Size Adjuster -->
        <div
          class="rounded-xs flex items-center space-x-1 border border-gray-300 bg-white px-1.5 py-0.5"
        >
          <button
            onclick={() => (fontSize = "small")}
            class="px-1 text-[11px] font-bold {fontSize === 'small'
              ? 'text-[#A31D1D]'
              : 'text-gray-500'}"
            title={t("articleDetail.fontSize.smallTitle")}
            data-content-key-title="articleDetail.fontSize.smallTitle"
            data-content-key="articleDetail.fontSize.small"
          >
            {t("articleDetail.fontSize.small")}
          </button>
          <span class="text-gray-300">|</span>
          <button
            onclick={() => (fontSize = "medium")}
            class="px-1 text-xs font-bold {fontSize === 'medium'
              ? 'text-[#A31D1D]'
              : 'text-gray-500'}"
            title={t("articleDetail.fontSize.mediumTitle")}
            data-content-key-title="articleDetail.fontSize.mediumTitle"
            data-content-key="articleDetail.fontSize.medium"
          >
            {t("articleDetail.fontSize.medium")}
          </button>
          <span class="text-gray-300">|</span>
          <button
            onclick={() => (fontSize = "large")}
            class="px-1 text-sm font-bold {fontSize === 'large'
              ? 'text-[#A31D1D]'
              : 'text-gray-500'}"
            title={t("articleDetail.fontSize.largeTitle")}
            data-content-key-title="articleDetail.fontSize.largeTitle"
            data-content-key="articleDetail.fontSize.large"
          >
            {t("articleDetail.fontSize.large")}
          </button>
        </div>

        <!-- Bookmark Toggle Button -->
        <button
          onclick={() => toggleBookmark(article.id)}
          class="flex items-center space-x-1 border border-gray-300 bg-white px-2.5 py-1 text-xs transition-colors hover:border-[#0F2B34]"
          title={isBookmarked
            ? t("articleDetail.bookmark.removeTitle")
            : t("articleDetail.bookmark.saveTitle")}
          data-content-key-title={isBookmarked
            ? "articleDetail.bookmark.removeTitle"
            : "articleDetail.bookmark.saveTitle"}
        >
          <span class={isBookmarked ? "text-[#A31D1D]" : "text-gray-400"}
            >★</span
          >
          <span
            class="hidden sm:inline"
            data-content-key={isBookmarked
              ? "articleDetail.bookmark.saved"
              : "articleDetail.bookmark.save"}
            >{isBookmarked
              ? t("articleDetail.bookmark.saved")
              : t("articleDetail.bookmark.save")}</span
          >
        </button>

        <!-- Share Button -->
        <button
          onclick={handleShare}
          class="flex items-center space-x-1 bg-[#0F2B34] px-2.5 py-1 text-xs text-white transition-colors hover:bg-[#1A4553]"
          title={t("articleDetail.share.title")}
          data-content-key-title="articleDetail.share.title"
        >
          <span>↗</span>
          <span data-content-key="articleDetail.share.label"
            >{t("articleDetail.share.label")}</span
          >
        </button>
      </div>
    </div>
  </div>

  <!-- Article Header & Meta -->
  <article class="mx-auto max-w-[1000px] px-4 py-12 sm:px-6 lg:px-8">
    <!-- Archival Meta Header -->
    <div
      class="mb-8 flex flex-wrap items-center justify-between gap-2 border-b border-[#D8D2C4] pb-4 text-xs text-[#6B7280]"
    >
      <div class="flex items-center space-x-3">
        <span
          class="bg-[#A31D1D] px-2.5 py-0.5 text-[11px] font-semibold text-white"
          data-content-key={article.categoryBadge
            ? undefined
            : "articleDetail.meta.defaultBadge"}
        >
          {article.categoryBadge || t("articleDetail.meta.defaultBadge")}
        </span>
        <!-- {#if article.docNumber}
          <span class="font-mono text-[#4B5563]">নথি: {article.docNumber}</span>
        {/if} -->
        <span>{article.readingTime}</span>
      </div>
      <div class="flex items-center space-x-3">
        <span>{article.banglaDate}</span>
        <span>•</span>
        <a
          href="#/publication/{article.issueId}"
          class="font-medium underline hover:text-[#A31D1D]"
        >
          {article.issueLabel}
        </a>
      </div>
    </div>

    <!-- Main Title & Subtitle -->
    <header class="mb-10 space-y-4">
      <h1
        class="font-serif text-3xl font-extrabold leading-[1.25] tracking-tight text-[#0F2B34] sm:text-5xl"
      >
        {article.title}
      </h1>

      {#if article.subtitle}
        <p
          class="font-serif text-lg font-light leading-relaxed text-[#5A636D] sm:text-2xl"
        >
          {article.subtitle}
        </p>
      {/if}

      <!-- Author and Contributor Info Box -->
      <div
        class="flex flex-wrap items-center gap-6 border-t border-[#E6E1D5] pt-4 text-xs text-[#4B5563] sm:text-sm"
      >
        <div>
          <span
            class="text-gray-500"
            data-content-key="articleDetail.byline.author"
            >{t("articleDetail.byline.author")}</span
          >
          <span class="ml-1 font-bold text-[#0F2B34]">{article.author}</span>
        </div>
        <div>
          <span
            class="text-gray-500"
            data-content-key="articleDetail.byline.photographer"
            >{t("articleDetail.byline.photographer")}</span
          >
          <span class="ml-1 font-bold text-[#0F2B34]"
            >{article.photographer}</span
          >
        </div>
        {#if article.location}
          <div>
            <span
              class="text-gray-500"
              data-content-key="articleDetail.byline.location"
              >{t("articleDetail.byline.location")}</span
            >
            <span class="ml-1 font-medium text-[#1E2328]"
              >{article.location}</span
            >
          </div>
        {/if}
      </div>
    </header>

    <!-- Main Hero Framed Photograph -->
    <div class="mb-12">
      <div class="yellow-framed-image">
        <div class="relative aspect-[16/10] overflow-hidden bg-black">
          <img
            src={article.heroImage || article.coverImage}
            alt={article.title}
            class="h-full w-full object-cover"
          />
          {#if article.viewfinderTag}
            <div
              class="backdrop-blur-xs absolute bottom-3 right-3 bg-black/80 px-2.5 py-1 font-mono text-xs text-white"
            >
              {article.viewfinderTag}
            </div>
          {/if}
        </div>
      </div>
      <!-- Caption -->
      <div
        class="mt-3 text-center text-xs italic text-[#5A636D]"
        data-content-key="articleDetail.caption"
      >
        {t("articleDetail.caption", {
          photographer: article.photographer ?? "",
          location: article.location ?? "",
        })}
      </div>
    </div>

    <!-- Article Long-Form Body -->
    <div class="mx-auto max-w-[820px]">
      <!-- Lead / First Paragraph with Drop Cap -->
      <div
        class="article-content {fontSize === 'small'
          ? 'text-base leading-relaxed'
          : fontSize === 'large'
            ? 'text-xl leading-loose'
            : 'text-lg leading-[2rem]'}"
      >
        <p
          class="first-letter-drop mb-6 font-normal leading-relaxed text-[#1E2328]"
        >
          {article.excerpt}
        </p>

        <!-- Markdown formatted body -->
        {#each article.content.split("\n\n") as paragraph}
          {#if paragraph.startsWith("## ")}
            <h2
              class="mb-4 mt-10 border-b border-[#D8D2C4] pb-2 font-serif text-2xl font-bold text-[#0F2B34] sm:text-3xl"
            >
              {paragraph.replace("## ", "")}
            </h2>
          {:else if paragraph.startsWith("> ")}
            <blockquote
              class="my-6 border-l-4 border-[#FDD835] bg-[#EDE9DE] p-5 font-serif text-base italic leading-relaxed text-[#0F2B34] sm:text-lg"
            >
              {paragraph.replace("> ", "")}
            </blockquote>
          {:else if paragraph.trim() && !paragraph.includes(article.excerpt)}
            <p class="mb-6 text-[#2D3748]">
              {paragraph.trim()}
            </p>
          {/if}
        {/each}
      </div>

      <!-- Author Bio Box -->
      <div
        class="mt-14 flex items-start space-x-4 border border-[#D8D2C4] bg-[#EDE9DE] p-6"
      >
        <div
          class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#0F2B34] font-serif text-xl font-bold text-[#FDD835]"
        >
          {article.author.charAt(0)}
        </div>
        <div>
          <h4 class="font-serif text-base font-bold text-[#0F2B34]">
            {article.author}
          </h4>
          <p class="mt-1 text-xs leading-relaxed text-[#4B5563]">
            {article.authorBio}
          </p>
        </div>
      </div>

      <!-- Reader Actions: Share, Save, Print -->
      <div
        class="mt-10 flex items-center justify-between border-b border-t border-[#D8D2C4] py-4"
      >
        <div class="flex items-center space-x-3">
          <button
            onclick={handleShare}
            class="flex items-center space-x-1.5 bg-[#0F2B34] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#1A4553]"
          >
            <span>↗</span>
            <span data-content-key="articleDetail.actions.share"
              >{t("articleDetail.actions.share")}</span
            >
          </button>
          <button
            onclick={() => toggleBookmark(article.id)}
            class="border border-[#0F2B34] px-4 py-2 text-xs font-medium text-[#0F2B34] transition-colors hover:bg-[#0F2B34] hover:text-white"
            data-content-key={isBookmarked
              ? "articleDetail.actions.saved"
              : "articleDetail.actions.readLater"}
          >
            {isBookmarked
              ? t("articleDetail.actions.saved")
              : t("articleDetail.actions.readLater")}
          </button>
        </div>

        <button
          onclick={printArticle}
          class="hidden text-xs text-[#5A636D] hover:text-black sm:inline-block"
          data-content-key="articleDetail.actions.print"
        >
          {t("articleDetail.actions.print")}
        </button>
      </div>
    </div>
  </article>

  <!-- Related Articles Section -->
  <section
    class="mx-auto max-w-[1380px] border-t border-[#D8D2C4] px-4 py-16 sm:px-6 lg:px-8"
  >
    <div class="mb-8">
      <div
        class="mb-1 text-xs font-bold uppercase text-[#A31D1D]"
        data-content-key="articleDetail.related.eyebrow"
      >
        {t("articleDetail.related.eyebrow")}
      </div>
      <h3
        class="font-serif text-2xl font-bold text-[#0F2B34]"
        data-content-key="articleDetail.related.heading"
      >
        {t("articleDetail.related.heading")}
      </h3>
    </div>

    <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
      {#each relatedArticles as rel}
        <div
          class="group flex cursor-pointer flex-col border border-[#D8D2C4] bg-white shadow-sm transition-all hover:shadow-xl"
          onclick={() => navigate(`/article/${rel.id}`)}
        >
          <div class="bg-white p-3">
            <div class="yellow-framed-image">
              <div class="aspect-[16/10] overflow-hidden bg-black">
                <img
                  src={rel.coverImage}
                  alt={rel.title}
                  class="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
            </div>
          </div>
          <div class="flex flex-1 flex-col justify-between p-4">
            <div>
              <span class="text-[11px] font-medium text-[#A31D1D]"
                >{rel.categoryLabel}</span
              >
              <h4
                class="mb-2 mt-1 font-serif text-base font-bold text-[#0F2B34] transition-colors group-hover:text-[#A31D1D]"
              >
                {rel.title}
              </h4>
              <p class="line-clamp-2 text-xs text-gray-500">{rel.excerpt}</p>
            </div>
            <div
              class="mt-3 flex justify-between border-t border-gray-100 pt-3 text-[11px] text-gray-400"
            >
              <span>{rel.author}</span>
              <span>{rel.readingTime}</span>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </section>
</div>
