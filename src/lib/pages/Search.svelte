<script>
  import { articles } from '../data/articles.js';
  import { publications } from '../data/publications.js';
  import { router, navigate } from '../stores/router.svelte.js';
  import {
    matchesFields,
    ARTICLE_SEARCH_FIELDS,
    PUBLICATION_SEARCH_FIELDS,
  } from '../translate/search.js';

  let searchQuery = $state('');
  let activeTab = $state('all'); // 'all' | 'articles' | 'publications'

  $effect(() => {
    const q = router.current.query?.q;
    if (q && !searchQuery) {
      searchQuery = q;
    }
  });

  let matchedArticles = $derived(searchQuery.trim()
    ? articles.filter(a => matchesFields(a, searchQuery, ARTICLE_SEARCH_FIELDS))
    : []);

  let matchedPublications = $derived(searchQuery.trim()
    ? publications.filter(p => matchesFields(p, searchQuery, PUBLICATION_SEARCH_FIELDS))
    : []);

  let totalMatches = $derived(matchedArticles.length + matchedPublications.length);
</script>

<div class="w-full bg-[#F4F1EA] min-h-screen text-[#1E2328]">

  <!-- Header Banner with Search Bar -->
  <section class="bg-[#0F2B34] text-white py-14 sm:py-20 border-b border-[#1B4856]">
    <div class="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

      <div class="space-y-2">
        <div class="inline-flex items-center space-x-2 text-xs font-semibold text-[#FDD835]">
          <span>■</span>
          <span>আর্কাইভ ও প্রকাশনা সূচি</span>
        </div>
        <h1 class="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white">
          অনুসন্ধান
        </h1>
      </div>

      <!-- Large Search Input Box -->
      <div class="relative max-w-2xl">
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="স্থান, নিবন্ধ, লেখক বা সংখ্যার নাম লিখুন..."
          class="w-full bg-white text-[#1E2328] px-5 py-3.5 pr-12 text-sm sm:text-base border-2 border-[#FDD835] focus:outline-none shadow-lg"
          autofocus
        />
        {#if searchQuery}
          <button
            onclick={() => (searchQuery = '')}
            class="absolute right-4 top-3.5 text-gray-400 hover:text-black text-lg"
            title="মুছে ফেলুন"
          >
            ✕
          </button>
        {/if}
      </div>

      <!-- Quick suggestions -->
      <div class="flex flex-wrap items-center gap-2 text-xs text-[#8BA3AC]">
        <span>জনপ্রিয় অনুসন্ধান:</span>
        <button onclick={() => (searchQuery = 'বরেন্দ্র')} class="hover:text-[#FDD835] underline">বরেন্দ্র</button>
        <span>•</span>
        <button onclick={() => (searchQuery = 'সুন্দরবন')} class="hover:text-[#FDD835] underline">সুন্দরবন</button>
        <span>•</span>
        <button onclick={() => (searchQuery = 'নদী')} class="hover:text-[#FDD835] underline">নদী</button>
        <span>•</span>
        <button onclick={() => (searchQuery = 'কান্তজিউ')} class="hover:text-[#FDD835] underline">কান্তজিউ</button>
        <span>•</span>
        <button onclick={() => (searchQuery = 'হাওর')} class="hover:text-[#FDD835] underline">হাওর</button>
      </div>

    </div>
  </section>

  <!-- Filter & Result Stats Bar -->
  <section class="border-b border-[#D8D2C4] bg-[#EDE9DE]">
    <div class="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">

      <div class="flex items-center space-x-2 text-xs sm:text-sm font-medium">
        <button
          onclick={() => (activeTab = 'all')}
          class="px-3.5 py-1.5 {activeTab === 'all' ? 'bg-[#0F2B34] text-white' : 'bg-white/70 hover:bg-white text-gray-700'}"
        >
          সব ফলাফল ({totalMatches})
        </button>
        <button
          onclick={() => (activeTab = 'articles')}
          class="px-3.5 py-1.5 {activeTab === 'articles' ? 'bg-[#0F2B34] text-white' : 'bg-white/70 hover:bg-white text-gray-700'}"
        >
          প্রতিবেদন ({matchedArticles.length})
        </button>
        <button
          onclick={() => (activeTab = 'publications')}
          class="px-3.5 py-1.5 {activeTab === 'publications' ? 'bg-[#0F2B34] text-white' : 'bg-white/70 hover:bg-white text-gray-700'}"
        >
          সংখ্যা ও প্রকাশনা ({matchedPublications.length})
        </button>
      </div>

      {#if searchQuery.trim()}
        <div class="text-xs text-[#5A636D]">
          ‘<strong class="text-black">{searchQuery}</strong>’ এর জন্য {totalMatches}টি ফলাফল পাওয়া গেছে
        </div>
      {/if}

    </div>
  </section>

  <!-- Results Content -->
  <section class="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-14">

    {#if !searchQuery.trim()}
      <div class="bg-white border border-[#D8D2C4] p-12 text-center max-w-md mx-auto space-y-3">
        <div class="text-3xl text-[#0F2B34]">🔍</div>
        <h3 class="font-serif text-lg font-bold text-[#0F2B34]">অনুসন্ধান শুরু করতে টাইপ করুন</h3>
        <p class="text-xs text-gray-500">
          উপরে সার্চ বক্সে যেকোনো শব্দ লিখে খুঁজুন। পর্যটকের শত শত প্রতিবেদন ও সাময়িকী সংরক্ষিত রয়েছে।
        </p>
      </div>

    {:else if totalMatches === 0}
      <div class="bg-white border border-[#D8D2C4] p-12 text-center max-w-md mx-auto space-y-3">
        <div class="text-3xl">⚠️</div>
        <h3 class="font-serif text-lg font-bold text-[#0F2B34]">কোনো ফলাফল পাওয়া যায়নি</h3>
        <p class="text-xs text-gray-500">
          ‘{searchQuery}’ দিয়ে কোনো নিবন্ধ বা সংখ্যা খুঁজে পাওয়া যায়নি। বানান পরীক্ষা করে আবার চেষ্টা করুন।
        </p>
      </div>

    {:else}
      <div class="space-y-12">

        <!-- Matched Articles Section -->
        {#if (activeTab === 'all' || activeTab === 'articles') && matchedArticles.length > 0}
          <div class="space-y-6">
            <h2 class="font-serif text-xl font-bold text-[#0F2B34] pb-2 border-b border-[#D8D2C4]">
              প্রতিবেদনসমূহ ({matchedArticles.length})
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              {#each matchedArticles as art}
                <div
                  class="bg-white border border-[#D8D2C4] p-4 flex space-x-4 cursor-pointer group hover:shadow-lg transition-all"
                  role="button"
                  tabindex="0"
                  onclick={() => navigate(`/article/${art.id}`)}
                  onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate(`/article/${art.id}`); }}
                >
                  <div class="w-28 yellow-framed-image shrink-0 self-start">
                    <img src={art.coverImage} alt={art.title} class="aspect-[4/3] object-cover" />
                  </div>
                  <div class="flex-1 flex flex-col justify-between">
                    <div>
                      <span class="text-[10px] text-[#A31D1D] font-bold">{art.categoryBadge}</span>
                      <h3 class="font-serif text-base font-bold text-[#0F2B34] group-hover:text-[#A31D1D] transition-colors leading-snug mt-0.5 mb-1.5">
                        {art.title}
                      </h3>
                      <p class="text-xs text-gray-500 line-clamp-2 leading-relaxed">{art.excerpt}</p>
                    </div>
                    <div class="pt-2 border-t border-gray-100 flex justify-between text-[11px] text-gray-400 mt-2">
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
        {#if (activeTab === 'all' || activeTab === 'publications') && matchedPublications.length > 0}
          <div class="space-y-6">
            <h2 class="font-serif text-xl font-bold text-[#0F2B34] pb-2 border-b border-[#D8D2C4]">
              সংখ্যা ও প্রকাশনা ({matchedPublications.length})
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              {#each matchedPublications as pub}
                <div
                  class="bg-white border border-[#D8D2C4] p-4 flex space-x-4 cursor-pointer group hover:shadow-lg transition-all"
                  role="button"
                  tabindex="0"
                  onclick={() => navigate(`/publication/${pub.id}`)}
                  onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate(`/publication/${pub.id}`); }}
                >
                  <div class="w-20 yellow-framed-image shrink-0 self-start">
                    <img src={pub.coverImage} alt={pub.title} class="aspect-[3/4] object-cover" />
                  </div>
                  <div class="flex-1 flex flex-col justify-between">
                    <div>
                      <span class="text-[10px] text-[#A31D1D] font-bold">{pub.banglaTitle}</span>
                      <h3 class="font-serif text-base font-bold text-[#0F2B34] group-hover:text-[#A31D1D] transition-colors leading-snug mt-0.5 mb-1">
                        {pub.title}
                      </h3>
                      <p class="text-xs text-gray-600 line-clamp-2 leading-relaxed">{pub.summary}</p>
                    </div>
                    <div class="pt-2 border-t border-gray-100 flex justify-between items-center text-xs mt-2">
                      <span class="font-bold text-[#0F2B34]">৳ {pub.price}</span>
                      <span class="text-[#A31D1D] font-medium group-hover:underline">বিস্তারিত দেখুন →</span>
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
