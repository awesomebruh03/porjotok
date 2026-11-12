<script>
  import { router, navigate } from "../stores/router.svelte.js";
  import { openSubscriptionModal } from "../stores/ui.svelte.js";
  import { t, link } from "../stores/content.svelte.js";
  import TranslateButton from "./TranslateButton.svelte";

  let mobileMenuOpen = $state(false);
  let searchInputOpen = $state(false);
  let searchQuery = $state("");

  const route = $derived(router.current);

  function openSubscribeModal() {
    openSubscriptionModal({
      type: "annual",
      issueTitle: t("header.subscribe.planTitle"),
      price: 1200,
    });
  }

  function handleSearch(e) {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate("/search", { q: searchQuery.trim() });
      searchQuery = "";
      searchInputOpen = false;
      mobileMenuOpen = false;
    }
  }

  function triggerSearch() {
    if (searchQuery.trim()) {
      navigate("/search", { q: searchQuery.trim() });
      searchQuery = "";
      searchInputOpen = false;
      mobileMenuOpen = false;
    }
  }
</script>

<header
  class="sticky top-0 z-40 w-full border-b border-[#1E2328]/80 bg-[#F4F1EA] transition-shadow duration-200"
>
  <div
    class="mx-auto flex h-[74px] max-w-[1380px] items-center justify-between px-4 sm:px-6 lg:px-8"
  >
    <!-- Left: Brand Logo & Editorial Subtitle -->
    <div class="flex items-center space-x-3 sm:space-x-4">
      <a
        {...link("header.brand")}
        data-no-translate
        class="font-serif text-3xl font-bold tracking-tight text-[#0F2B34] transition-colors hover:text-[#A31D1D] sm:text-4xl"
      >
        {t("header.brand")}
      </a>
      <span class="select-none text-xl font-light text-[#8C4A42]">|</span>
      <span
        data-content-key="header.tagline"
        class="hidden text-xs font-normal tracking-wide text-[#6B3A33] sm:inline-block sm:text-sm"
      >
        {t("header.tagline")}
      </span>
    </div>

    <!-- Center Navigation Links (Desktop) -->
    <nav
      class="hidden items-center space-x-8 text-[15px] font-medium text-[#1E2328] md:flex lg:space-x-10"
    >
      <a
        {...link("header.nav.publications")}
        class="py-1 transition-colors hover:text-[#A31D1D] {route.name ===
          'publications' || route.name === 'publication-detail'
          ? 'border-b-2 border-[#A31D1D] text-[#A31D1D]'
          : ''}"
      >
        {t("header.nav.publications")}
      </a>
      <a
        {...link("header.nav.travel")}
        class="py-1 transition-colors hover:text-[#A31D1D] {route.params
          ?.category === 'travel'
          ? 'border-b-2 border-[#A31D1D] text-[#A31D1D]'
          : ''}"
      >
        {t("header.nav.travel")}
      </a>
      <a
        {...link("header.nav.heritage")}
        class="py-1 transition-colors hover:text-[#A31D1D] {route.params
          ?.category === 'heritage'
          ? 'border-b-2 border-[#A31D1D] text-[#A31D1D]'
          : ''}"
      >
        {t("header.nav.heritage")}
      </a>
      <a
        {...link("header.nav.articles")}
        class="py-1 transition-colors hover:text-[#A31D1D] {route.name ===
          'articles' || route.name === 'article-detail'
          ? 'border-b-2 border-[#A31D1D] text-[#A31D1D]'
          : ''}"
      >
        {t("header.nav.articles")}
      </a>
      <a
        {...link("header.nav.categories")}
        class="py-1 transition-colors hover:text-[#A31D1D] {route.name ===
        'categories'
          ? 'border-b-2 border-[#A31D1D] text-[#A31D1D]'
          : ''}"
      >
        {t("header.nav.categories")}
      </a>
    </nav>

    <!-- Right Controls: Search, Subscribe Button & Mobile Hamburger -->
    <div class="flex items-center space-x-3 sm:space-x-4">
      <!-- Quick Search Bar / Toggle -->
      <div class="relative">
        {#if searchInputOpen}
          <div
            class="flex items-center rounded-none border border-[#1E2328] bg-white px-2 py-1 shadow-sm"
          >
            <input
              type="text"
              bind:value={searchQuery}
              onkeydown={handleSearch}
              placeholder={t("header.search.placeholder")}
              data-content-key-placeholder="header.search.placeholder"
              class="w-28 border-none bg-transparent px-1 text-xs text-[#1E2328] outline-none sm:w-44 sm:text-sm"
              autofocus
            />
            <button
              onclick={triggerSearch}
              data-content-key="header.search.submit"
              class="px-1 text-xs font-semibold text-[#A31D1D] hover:underline"
            >
              {t("header.search.submit")}
            </button>
            <button
              onclick={() => (searchInputOpen = false)}
              class="ml-1 text-sm leading-none text-gray-400 hover:text-black"
              title={t("header.search.close")}
              data-content-key-title="header.search.close"
            >
              ✕
            </button>
          </div>
        {:else}
          <button
            onclick={() => (searchInputOpen = true)}
            class="rounded p-1.5 text-[#1E2328] transition-colors hover:text-[#A31D1D]"
            title={t("header.search.open")}
            data-content-key-title="header.search.open"
          >
            <svg
              class="h-5 w-5"
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
          </button>
        {/if}
      </div>

      <!-- On-device translation toggle -->
      <TranslateButton />

      <!-- Subscribe Button (Exact match from Header reference) -->
      <button
        onclick={openSubscribeModal}
        data-content-key="header.subscribe"
        class="hidden items-center justify-center border border-[#1E2328] bg-transparent px-5 py-1.5 text-sm font-medium text-[#1E2328] transition-all duration-150 hover:bg-[#1E2328] hover:text-[#F4F1EA] active:scale-95 sm:inline-flex"
      >
        {t("header.subscribe")}
      </button>

      <!-- Mobile Hamburger Button -->
      <button
        onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
        class="p-1.5 text-[#1E2328] hover:text-[#A31D1D] md:hidden"
        aria-label={t("header.menu.toggle")}
        data-content-key-aria-label="header.menu.toggle"
      >
        {#if mobileMenuOpen}
          <svg
            class="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        {:else}
          <svg
            class="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        {/if}
      </button>
    </div>
  </div>

  <!-- Mobile Drawer Menu -->
  {#if mobileMenuOpen}
    <div
      class="space-y-3 border-b border-[#1E2328] bg-[#F4F1EA] px-6 py-5 shadow-lg md:hidden"
    >
      <div
        data-content-key="header.mobile.tagline"
        class="border-b border-[#E6E1D5] pb-2 text-xs text-[#8C4A42]"
      >
        {t("header.mobile.tagline")}
      </div>
      <div class="flex flex-col space-y-2 text-base font-medium text-[#1E2328]">
        <a
          {...link("header.mobile.home")}
          onclick={() => (mobileMenuOpen = false)}
          class="py-1.5 transition-colors hover:text-[#A31D1D]"
        >
          {t("header.mobile.home")}
        </a>
        <a
          {...link("header.mobile.publications")}
          onclick={() => (mobileMenuOpen = false)}
          class="py-1.5 transition-colors hover:text-[#A31D1D]"
        >
          {t("header.mobile.publications")}
        </a>
        <a
          {...link("header.mobile.travel")}
          onclick={() => (mobileMenuOpen = false)}
          class="py-1.5 transition-colors hover:text-[#A31D1D]"
        >
          {t("header.mobile.travel")}
        </a>
        <a
          {...link("header.mobile.heritage")}
          onclick={() => (mobileMenuOpen = false)}
          class="py-1.5 transition-colors hover:text-[#A31D1D]"
        >
          {t("header.mobile.heritage")}
        </a>
        <a
          {...link("header.mobile.articles")}
          onclick={() => (mobileMenuOpen = false)}
          class="py-1.5 transition-colors hover:text-[#A31D1D]"
        >
          {t("header.mobile.articles")}
        </a>
        <a
          {...link("header.mobile.categories")}
          onclick={() => (mobileMenuOpen = false)}
          class="py-1.5 transition-colors hover:text-[#A31D1D]"
        >
          {t("header.mobile.categories")}
        </a>
        <a
          {...link("header.mobile.about")}
          onclick={() => (mobileMenuOpen = false)}
          class="py-1.5 transition-colors hover:text-[#A31D1D]"
        >
          {t("header.mobile.about")}
        </a>
        <a
          {...link("header.mobile.contact")}
          onclick={() => (mobileMenuOpen = false)}
          class="py-1.5 transition-colors hover:text-[#A31D1D]"
        >
          {t("header.mobile.contact")}
        </a>
      </div>
      <div class="border-t border-[#E6E1D5] pt-3">
        <button
          onclick={() => {
            mobileMenuOpen = false;
            openSubscribeModal();
          }}
          data-content-key="header.mobile.subscribe"
          class="w-full bg-[#A31D1D] py-2 text-center font-medium text-white shadow-sm hover:bg-[#B72424]"
        >
          {t("header.mobile.subscribe")}
        </button>
      </div>
    </div>
  {/if}
</header>
