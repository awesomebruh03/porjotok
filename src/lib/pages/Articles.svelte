<script>
  import { articles } from '../data/articles.js';
  import { categories } from '../data/categories.js';
  import { router, navigate } from '../stores/router.svelte.js';

  let selectedCategory = $state(router.current.query?.category || 'all');
  let searchQuery = $state('');
  let visibleCount = $state(6);

  // React to query param in URL if present
  $effect(() => {
    const queryCategory = router.current.query?.category;
    if (queryCategory) {
      selectedCategory = queryCategory;
    }
  });

  let filteredArticles = $derived(articles.filter(a => {
    const matchesCat = selectedCategory === 'all' || a.category === selectedCategory;
    const matchesSearch = !searchQuery.trim() ||
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  }));

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

<div class="w-full bg-[#F4F1EA] min-h-screen text-[#1E2328]">

  <!-- Header Banner -->
  <section class="bg-[#0F2B34] text-white py-14 sm:py-18 border-b border-[#1B4856]">
    <div class="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
      <div class="max-w-3xl space-y-3">
        <div class="inline-flex items-center space-x-2 text-xs font-semibold text-[#FDD835]">
          <span>■</span>
          <span>সম্পাদনা ও প্রামাণ্য নিবন্ধশালা</span>
        </div>
        <h1 class="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white">
          সকল প্রতিবেদন ও আখ্যান
        </h1>
        <div class="h-1 w-20 bg-[#FDD835] my-3"></div>
        <p class="text-sm sm:text-base text-[#8BA3AC] font-light leading-relaxed">
          বাংলার মাটি, নদী, পাহাড়, বিলুপ্তপ্রায় ঐতিহ্য ও মানুষের প্রাত্যহিক সংগ্রাম নিয়ে রচিত গভীর গবেষণাধর্মী ও সংবেদনশীল প্রতিবেদন।
        </p>
      </div>
    </div>
  </section>

  <!-- Filter & Search Controls Bar -->
  <section class="border-b border-[#D8D2C4] bg-[#EDE9DE] sticky top-[74px] z-30 shadow-xs">
    <div class="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">

      <!-- Category Filter Pills -->
      <div class="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none text-xs sm:text-sm font-medium">
        <button
          onclick={() => setCategory('all')}
          class="px-3.5 py-1.5 rounded-none whitespace-nowrap transition-colors {selectedCategory === 'all' ? 'bg-[#0F2B34] text-white' : 'bg-white/70 hover:bg-white text-[#374151]'}"
        >
          সব ({articles.length})
        </button>
        {#each categories as cat}
          <button
            onclick={() => setCategory(cat.id)}
            class="px-3.5 py-1.5 rounded-none whitespace-nowrap transition-colors {selectedCategory === cat.id ? 'bg-[#0F2B34] text-white' : 'bg-white/70 hover:bg-white text-[#374151]'}"
          >
            {cat.name}
          </button>
        {/each}
      </div>

      <!-- Search Input in Filter Bar -->
      <div class="w-full md:w-72 shrink-0">
        <div class="relative">
          <input
            type="text"
            bind:value={searchQuery}
            placeholder="প্রতিবেদন খুঁজুন..."
            class="w-full bg-white border border-[#C5BFB0] px-3 py-1.5 pl-8 text-xs sm:text-sm focus:outline-none focus:border-[#0F2B34]"
          />
          <svg class="w-4 h-4 text-gray-500 absolute left-2.5 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {#if searchQuery}
            <button
              onclick={() => (searchQuery = '')}
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
  <section class="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 py-14">

    {#if filteredArticles.length === 0}
      <!-- Empty State -->
      <div class="bg-white border border-[#D8D2C4] p-12 text-center max-w-lg mx-auto space-y-4">
        <div class="text-4xl">🔍</div>
        <h3 class="font-serif text-xl font-bold text-[#0F2B34]">কোনো প্রতিবেদন পাওয়া যায়নি</h3>
        <p class="text-xs sm:text-sm text-gray-500">
          "{searchQuery}" এর সাথে সম্পর্কিত কোনো লেখা খুঁজে পাওয়া যায়নি। অনুগ্রহ করে অন্য কোনো কি-ওয়ার্ড দিয়ে চেষ্টা করুন।
        </p>
        <button
          onclick={() => { searchQuery = ''; selectedCategory = 'all'; }}
          class="px-4 py-2 bg-[#0F2B34] text-white text-xs font-semibold"
        >
          সব ফিল্টার মুছুন
        </button>
      </div>
    {:else}

      <!-- Top Lead Featured Article (if on all and no active search) -->
      {#if selectedCategory === 'all' && !searchQuery}
        {@const featured = filteredArticles[0]}
        <div
          class="bg-white border border-[#D8D2C4] shadow-sm mb-12 p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center cursor-pointer group hover:shadow-xl transition-all"
          onclick={() => navigate(`/article/${featured.id}`)}
        >
          <div class="lg:col-span-7">
            <div class="yellow-framed-image">
              <div class="aspect-[16/9] overflow-hidden bg-black">
                <img
                  src={featured.coverImage}
                  alt={featured.title}
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
          <div class="lg:col-span-5 space-y-3">
            <div class="inline-flex items-center space-x-2 text-xs font-semibold text-[#A31D1D]">
              <span>◎</span>
              <span>{featured.categoryBadge}</span>
            </div>
            <h2 class="font-serif text-2xl sm:text-3xl font-bold text-[#0F2B34] group-hover:text-[#A31D1D] transition-colors leading-tight">
              {featured.title}
            </h2>
            <div class="h-1 w-12 bg-[#A31D1D]"></div>
            <p class="text-xs sm:text-sm text-[#4B5563] font-light leading-relaxed line-clamp-3">
              {featured.excerpt}
            </p>
            <div class="pt-3 border-t border-[#F0ECE1] flex items-center justify-between text-xs text-[#6B7280]">
              <span>{featured.author}</span>
              <span>{featured.readingTime} পাঠ</span>
            </div>
          </div>
        </div>
      {/if}

      <!-- Grid of Articles -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {#each paginatedArticles as article}
          <div
            class="bg-white border border-[#D8D2C4] flex flex-col group cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
            onclick={() => navigate(`/article/${article.id}`)}
          >
            <!-- Yellow framed photo -->
            <div class="p-3 bg-white">
              <div class="yellow-framed-image">
                <div class="relative overflow-hidden aspect-[16/10]">
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div class="absolute top-2 left-2 bg-black/80 backdrop-blur-xs text-white text-[10px] px-2 py-0.5">
                    {article.categoryLabel}
                  </div>
                </div>
              </div>
            </div>

            <!-- Content -->
            <div class="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <span class="text-[11px] text-[#A31D1D] font-semibold block mb-1">
                  {article.categoryBadge}
                </span>
                <h3 class="font-serif text-lg font-bold text-[#0F2B34] group-hover:text-[#A31D1D] transition-colors leading-snug mb-2">
                  {article.title}
                </h3>
                <p class="text-xs sm:text-sm text-[#4B5563] font-light leading-relaxed line-clamp-3">
                  {article.excerpt}
                </p>
              </div>

              <!-- Footer -->
              <div class="pt-3 border-t border-[#F0ECE1] flex items-center justify-between text-xs text-[#6B7280]">
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
            class="px-8 py-3 bg-[#0F2B34] hover:bg-[#1A4553] text-white text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-sm active:scale-95"
          >
            আরও প্রতিবেদন লোড করুন ({filteredArticles.length - visibleCount}টি বাকি)
          </button>
        </div>
      {/if}

    {/if}

  </section>

</div>
