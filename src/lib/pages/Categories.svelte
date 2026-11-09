<script>
  import { categories } from '../data/categories.js';
  import { articles } from '../data/articles.js';
  import { router, navigate } from '../stores/router.svelte.js';

  let { params = {} } = $props();

  let activeCategorySlug = $derived(params.category || router.current.params?.category || null);
  let activeCategory = $derived(activeCategorySlug
    ? categories.find(c => c.slug === activeCategorySlug || c.id === activeCategorySlug)
    : null);

  let categoryArticles = $derived(activeCategory
    ? articles.filter(a => a.category === activeCategory.id)
    : []);

  function selectCategory(slug) {
    if (slug) {
      navigate(`/categories/${slug}`);
    } else {
      navigate('/categories');
    }
  }
</script>

<div class="w-full bg-[#F4F1EA] min-h-screen text-[#1E2328]">

  <!-- Header Banner -->
  <section class="bg-[#0F2B34] text-white py-14 sm:py-20 border-b border-[#1B4856]">
    <div class="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
      <div class="max-w-3xl space-y-3">
        <div class="inline-flex items-center space-x-2 text-xs font-semibold text-[#FDD835]">
          <span>■</span>
          <span>বিষয়ভিত্তিক সূচিপত্র</span>
        </div>

        {#if activeCategory}
          <h1 class="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white">
            {activeCategory.name} বিভাগ
          </h1>
          <p class="text-xs text-[#FDD835] font-mono tracking-wider">
            {activeCategory.englishName}
          </p>
          <div class="h-1 w-20 bg-[#FDD835] my-3"></div>
          <p class="text-sm sm:text-base text-[#8BA3AC] font-light leading-relaxed">
            {activeCategory.description}
          </p>
        {:else}
          <h1 class="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white">
            বিষয়ভিত্তিক অনুসন্ধান
          </h1>
          <div class="h-1 w-20 bg-[#FDD835] my-3"></div>
          <p class="text-sm sm:text-base text-[#8BA3AC] font-light leading-relaxed">
            ভ্রমণ, প্রকৃতি, সংস্কৃতি, ঐতিহ্য, ইতিহাস ও লোকজীবনের বিশেষায়িত শাখাসমূহ। নিজের পছন্দের ক্ষেত্রে প্রবেশ করুন।
          </p>
        {/if}
      </div>
    </div>
  </section>

  <!-- Category Filter Pills Bar -->
  <section class="border-b border-[#D8D2C4] bg-[#EDE9DE] sticky top-[74px] z-30 shadow-xs">
    <div class="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center space-x-2 overflow-x-auto scrollbar-none text-xs sm:text-sm font-medium">
      <button
        onclick={() => selectCategory(null)}
        class="px-4 py-1.5 whitespace-nowrap transition-colors {!activeCategory ? 'bg-[#0F2B34] text-white' : 'bg-white/70 hover:bg-white text-[#374151]'}"
      >
        সকল বিভাগ
      </button>
      {#each categories as cat}
        <button
          onclick={() => selectCategory(cat.slug)}
          class="px-4 py-1.5 whitespace-nowrap transition-colors {activeCategory?.id === cat.id ? 'bg-[#0F2B34] text-white' : 'bg-white/70 hover:bg-white text-[#374151]'}"
        >
          {cat.name}
        </button>
      {/each}
    </div>
  </section>

  <!-- Main Content -->
  <section class="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 py-16">

    {#if activeCategory}
      <!-- Specific Category View: Articles in this category -->
      <div class="space-y-10">
        <div class="flex items-center justify-between pb-4 border-b border-[#D8D2C4]">
          <h2 class="font-serif text-2xl font-bold text-[#0F2B34]">
            {activeCategory.name} বিষয়ক প্রতিবেদন ({categoryArticles.length}টি)
          </h2>
          <button
            onclick={() => selectCategory(null)}
            class="text-xs text-[#A31D1D] hover:underline font-semibold"
          >
            ← সকল বিভাগে ফিরে যান
          </button>
        </div>

        {#if categoryArticles.length === 0}
          <div class="bg-white border border-[#D8D2C4] p-10 text-center text-gray-500">
            এই বিভাগে বর্তমানে কোনো নতুন অনলাইন প্রতিবেদন সংরক্ষিত নেই। পরবর্তী মুদ্রিত সংখ্যায় প্রকাশিত হবে।
          </div>
        {:else}
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {#each categoryArticles as article}
              <div
                class="bg-white border border-[#D8D2C4] flex flex-col group cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
                onclick={() => navigate(`/article/${article.id}`)}
              >
                <div class="p-3 bg-white">
                  <div class="yellow-framed-image">
                    <div class="aspect-[16/10] overflow-hidden bg-black">
                      <img src={article.coverImage} alt={article.title} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  </div>
                </div>
                <div class="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span class="text-[11px] text-[#A31D1D] font-semibold">{article.categoryBadge}</span>
                    <h3 class="font-serif text-lg font-bold text-[#0F2B34] group-hover:text-[#A31D1D] transition-colors leading-snug mt-1 mb-2">
                      {article.title}
                    </h3>
                    <p class="text-xs text-gray-600 line-clamp-3 leading-relaxed">{article.excerpt}</p>
                  </div>
                  <div class="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 mt-4">
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
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {#each categories as cat}
          {@const catArticles = articles.filter(a => a.category === cat.id)}
          <div
            class="bg-white border border-[#D8D2C4] shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col group cursor-pointer"
            onclick={() => selectCategory(cat.slug)}
          >
            <!-- Yellow framed photo -->
            <div class="p-4 bg-[#EDE8DC]">
              <div class="yellow-framed-image">
                <div class="aspect-[16/10] overflow-hidden bg-black relative">
                  <img src={cat.heroImage} alt={cat.name} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div class="absolute top-2 left-2 bg-[#0F2B34]/90 text-[#FDD835] text-xs font-bold px-2 py-0.5">
                    {cat.name}
                  </div>
                </div>
              </div>
            </div>

            <!-- Content -->
            <div class="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div class="text-[11px] text-[#A31D1D] font-mono tracking-wider uppercase mb-1">
                  {cat.englishName}
                </div>
                <h3 class="font-serif text-2xl font-bold text-[#0F2B34] group-hover:text-[#A31D1D] transition-colors mb-2">
                  {cat.name}
                </h3>
                <p class="text-xs sm:text-sm text-[#4B5563] font-light leading-relaxed mb-4">
                  {cat.description}
                </p>

                <!-- Tags -->
                <div class="flex flex-wrap gap-1.5 mb-2">
                  {#each cat.tags as tag}
                    <span class="bg-[#F0ECE1] text-[#374151] text-[10px] px-2 py-0.5">
                      #{tag}
                    </span>
                  {/each}
                </div>
              </div>

              <!-- Footer with Action -->
              <div class="pt-4 border-t border-[#F0ECE1] flex items-center justify-between text-xs">
                <span class="text-[#7B8794] font-medium">{catArticles.length}টি অনলাইন নিবন্ধ</span>
                <span class="text-[#0F2B34] font-bold group-hover:text-[#A31D1D] transition-colors flex items-center space-x-1">
                  <span>বিভাগ দেখুন</span>
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
