<script>
  import { router, navigate } from "../stores/router.svelte.js";
  import { openSubscriptionModal } from "../stores/ui.svelte.js";

  let mobileMenuOpen = $state(false);
  let searchInputOpen = $state(false);
  let searchQuery = $state("");

  const route = $derived(router.current);

  function openSubscribeModal() {
    openSubscriptionModal({
      type: "annual",
      issueTitle: "বার্ষিক সাবস্ক্রিপশন (৬টি সংখ্যা)",
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
        href="#/"
        class="font-serif text-3xl font-bold tracking-tight text-[#0F2B34] transition-colors hover:text-[#A31D1D] sm:text-4xl"
      >
        পর্যটক
      </a>
      <span class="select-none text-xl font-light text-[#8C4A42]">|</span>
      <span
        class="hidden text-xs font-normal tracking-wide text-[#6B3A33] sm:inline-block sm:text-sm"
      >
        পর্যটন ভাবনা ও বিকাশের পত্রিকা
      </span>
    </div>

    <!-- Center Navigation Links (Desktop) -->
    <nav
      class="hidden items-center space-x-8 text-[15px] font-medium text-[#1E2328] md:flex lg:space-x-10"
    >
      <a
        href="#/publications"
        class="py-1 transition-colors hover:text-[#A31D1D] {route.name ===
          'publications' || route.name === 'publication-detail'
          ? 'border-b-2 border-[#A31D1D] text-[#A31D1D]'
          : ''}"
      >
        প্রকাশিত সংখ্যা
      </a>
      <a
        href="#/categories/travel"
        class="py-1 transition-colors hover:text-[#A31D1D] {route.params
          ?.category === 'travel'
          ? 'border-b-2 border-[#A31D1D] text-[#A31D1D]'
          : ''}"
      >
        যাত্রাবিরতি
      </a>
      <a
        href="#/categories/heritage"
        class="py-1 transition-colors hover:text-[#A31D1D] {route.params
          ?.category === 'heritage'
          ? 'border-b-2 border-[#A31D1D] text-[#A31D1D]'
          : ''}"
      >
        প্রবন্ধ
      </a>
      <a
        href="#/articles"
        class="py-1 transition-colors hover:text-[#A31D1D] {route.name ===
          'articles' || route.name === 'article-detail'
          ? 'border-b-2 border-[#A31D1D] text-[#A31D1D]'
          : ''}"
      >
        ধারাবাহিক
      </a>
      <a
        href="#/categories"
        class="py-1 transition-colors hover:text-[#A31D1D] {route.name ===
        'categories'
          ? 'border-b-2 border-[#A31D1D] text-[#A31D1D]'
          : ''}"
      >
        সকল বিভাগ
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
              placeholder="অনুসন্ধান করুন..."
              class="w-28 border-none bg-transparent px-1 text-xs text-[#1E2328] outline-none sm:w-44 sm:text-sm"
              autofocus
            />
            <button
              onclick={triggerSearch}
              class="px-1 text-xs font-semibold text-[#A31D1D] hover:underline"
            >
              খুঁজুন
            </button>
            <button
              onclick={() => (searchInputOpen = false)}
              class="ml-1 text-sm leading-none text-gray-400 hover:text-black"
              title="বন্ধ করুন"
            >
              ✕
            </button>
          </div>
        {:else}
          <button
            onclick={() => (searchInputOpen = true)}
            class="rounded p-1.5 text-[#1E2328] transition-colors hover:text-[#A31D1D]"
            title="অনুসন্ধান"
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

      <!-- Subscribe Button (Exact match from Header reference) -->
      <button
        onclick={openSubscribeModal}
        class="hidden items-center justify-center border border-[#1E2328] bg-transparent px-5 py-1.5 text-sm font-medium text-[#1E2328] transition-all duration-150 hover:bg-[#1E2328] hover:text-[#F4F1EA] active:scale-95 sm:inline-flex"
      >
        গ্রাহক হোন
      </button>

      <!-- Mobile Hamburger Button -->
      <button
        onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
        class="p-1.5 text-[#1E2328] hover:text-[#A31D1D] md:hidden"
        aria-label="মেনু খুলুন"
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
      <div class="border-b border-[#E6E1D5] pb-2 text-xs text-[#8C4A42]">
        পর্যটন ভাবনা ও বিকাশের পত্রিকা
      </div>
      <div class="flex flex-col space-y-2 text-base font-medium text-[#1E2328]">
        <a
          href="#/"
          onclick={() => (mobileMenuOpen = false)}
          class="py-1.5 transition-colors hover:text-[#A31D1D]"
        >
          হোম
        </a>
        <a
          href="#/publications"
          onclick={() => (mobileMenuOpen = false)}
          class="py-1.5 transition-colors hover:text-[#A31D1D]"
        >
          সংখ্যা সংগ্রহ (ম্যাগাজিন)
        </a>
        <a
          href="#/categories/travel"
          onclick={() => (mobileMenuOpen = false)}
          class="py-1.5 transition-colors hover:text-[#A31D1D]"
        >
          গন্তব্য ও ভ্রমণ
        </a>
        <a
          href="#/categories/heritage"
          onclick={() => (mobileMenuOpen = false)}
          class="py-1.5 transition-colors hover:text-[#A31D1D]"
        >
          ঐতিহ্য ও স্থাপত্য
        </a>
        <a
          href="#/articles"
          onclick={() => (mobileMenuOpen = false)}
          class="py-1.5 transition-colors hover:text-[#A31D1D]"
        >
          সকল প্রতিবেদন
        </a>
        <a
          href="#/categories"
          onclick={() => (mobileMenuOpen = false)}
          class="py-1.5 transition-colors hover:text-[#A31D1D]"
        >
          সকল বিষয়ভিত্তিক বিভাগ
        </a>
        <a
          href="#/about"
          onclick={() => (mobileMenuOpen = false)}
          class="py-1.5 transition-colors hover:text-[#A31D1D]"
        >
          আমাদের সম্পর্কে
        </a>
        <a
          href="#/contact"
          onclick={() => (mobileMenuOpen = false)}
          class="py-1.5 transition-colors hover:text-[#A31D1D]"
        >
          যোগাযোগ ও কার্যালয়
        </a>
      </div>
      <div class="border-t border-[#E6E1D5] pt-3">
        <button
          onclick={() => {
            mobileMenuOpen = false;
            openSubscribeModal();
          }}
          class="w-full bg-[#A31D1D] py-2 text-center font-medium text-white shadow-sm hover:bg-[#B72424]"
        >
          সাবস্ক্রাইব করুন
        </button>
      </div>
    </div>
  {/if}
</header>
