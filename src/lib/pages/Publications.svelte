<script>
  import { publications } from '../data/publications.js';
  import { navigate } from '../stores/router.svelte.js';
  import { openSubscriptionModal } from '../stores/ui.svelte.js';

  let selectedFilter = $state('all'); // 'all' | '2026' | '2025' | 'special'

  let filteredIssues = $derived(publications.filter(p => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === '2026') return p.publishedYear === 2026;
    if (selectedFilter === '2025') return p.publishedYear === 2025;
    if (selectedFilter === 'special') return !!p.badge;
    return true;
  }));

  function openSubscribeModal(issue) {
    openSubscriptionModal({
      type: 'single',
      issueTitle: `${issue.title} (${issue.period})`,
      price: issue.price
    });
  }
</script>

<div class="w-full bg-[#F4F1EA] min-h-screen text-[#1E2328]">

  <!-- Header Banner -->
  <section class="bg-[#0F2B34] text-white py-14 sm:py-20 border-b border-[#1B4856]">
    <div class="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
      <div class="max-w-3xl space-y-3">
        <div class="inline-flex items-center space-x-2 text-xs font-semibold text-[#FDD835]">
          <span>■</span>
          <span>মুদ্রিত ও ডিজিটাল সংগ্রহশালা</span>
        </div>
        <h1 class="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white">
          সংখ্যা সংগ্রহ ও প্রকাশনা
        </h1>
        <div class="h-1 w-20 bg-[#FDD835] my-3"></div>
        <p class="text-sm sm:text-base text-[#8BA3AC] font-light leading-relaxed">
          পর্যটক পত্রিকার প্রতিটি সংখ্যা মাঠপর্যায়ের প্রামাণ্য অনুসন্ধান, দুর্লভ রঙিন আলোকচিত্র ও বাংলা লোকসংস্কৃতির স্থায়ী দলিল। একক সংখ্যা সংগ্রহ করুন অথবা বার্ষিক গ্রাহক হিসেবে ডাকযোগে নিয়মিত সংগ্রহ পান।
        </p>
      </div>
    </div>
  </section>

  <!-- Filter Controls -->
  <section class="border-b border-[#D8D2C4] bg-[#EDE9DE]">
    <div class="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">

      <!-- Filter Tabs -->
      <div class="flex items-center space-x-2 sm:space-x-4 text-xs sm:text-sm font-medium">
        <button
          onclick={() => (selectedFilter = 'all')}
          class="px-4 py-1.5 transition-all {selectedFilter === 'all' ? 'bg-[#0F2B34] text-white shadow-xs' : 'text-[#374151] hover:text-black bg-white/60'}"
        >
          সব সংখ্যা ({publications.length})
        </button>
        <button
          onclick={() => (selectedFilter = '2026')}
          class="px-4 py-1.5 transition-all {selectedFilter === '2026' ? 'bg-[#0F2B34] text-white shadow-xs' : 'text-[#374151] hover:text-black bg-white/60'}"
        >
          বর্ষ ১২ (২০২৬)
        </button>
        <button
          onclick={() => (selectedFilter = '2025')}
          class="px-4 py-1.5 transition-all {selectedFilter === '2025' ? 'bg-[#0F2B34] text-white shadow-xs' : 'text-[#374151] hover:text-black bg-white/60'}"
        >
          বর্ষ ১১ (২০২৫)
        </button>
        <button
          onclick={() => (selectedFilter = 'special')}
          class="px-4 py-1.5 transition-all {selectedFilter === 'special' ? 'bg-[#0F2B34] text-white shadow-xs' : 'text-[#374151] hover:text-black bg-white/60'}"
        >
          বিশেষ সংকলন
        </button>
      </div>

      <div class="text-xs text-[#5A636D]">
        মুদ্রিত কপি ডাকযোগে সারা দেশে পাঠানো হয়
      </div>

    </div>
  </section>

  <!-- Publications Grid -->
  <section class="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
      {#each filteredIssues as issue}
        <div class="bg-white border border-[#D8D2C4] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row overflow-hidden group">

          <!-- Cover Column with Yellow Border -->
          <div class="sm:w-52 p-4 bg-[#EDE8DC] flex items-center justify-center shrink-0">
            <div class="w-full max-w-[200px] yellow-framed-image cursor-pointer" onclick={() => navigate(`/publication/${issue.id}`)}>
              <div class="relative aspect-[3/4] overflow-hidden bg-black">
                <img
                  src={issue.coverImage}
                  alt={issue.title}
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {#if issue.badge}
                  <span class="absolute top-1 left-1 bg-[#A31D1D] text-white text-[9px] font-bold px-1.5 py-0.5">
                    {issue.badge}
                  </span>
                {/if}

                <div class="absolute bottom-0 inset-x-0 bg-black/85 p-1.5 text-center text-[10px] text-[#FDD835]">
                  সংখ্যা {issue.issueNumber}
                </div>
              </div>
            </div>
          </div>

          <!-- Information Column -->
          <div class="p-6 flex-1 flex flex-col justify-between space-y-4">
            <div>
              <div class="flex items-center justify-between text-xs text-[#6B7280] mb-1">
                <span class="font-medium text-[#A31D1D]">{issue.banglaTitle}</span>
                <span>{issue.period}</span>
              </div>

              <h2
                class="font-serif text-xl sm:text-2xl font-bold text-[#0F2B34] group-hover:text-[#A31D1D] transition-colors cursor-pointer leading-snug mb-2"
                onclick={() => navigate(`/publication/${issue.id}`)}
              >
                {issue.title}
              </h2>

              <p class="text-xs text-[#7D5A29] font-medium mb-3">
                {issue.subtitle}
              </p>

              <p class="text-xs sm:text-sm text-[#4B5563] font-light leading-relaxed line-clamp-3 mb-4">
                {issue.summary}
              </p>

              <!-- Highlights list -->
              <div class="text-xs text-[#55606E] space-y-1 mb-4 hidden sm:block">
                {#each issue.highlights.slice(0, 2) as hl}
                  <div class="flex items-start space-x-1.5">
                    <span class="text-[#FDD835] text-xs">◆</span>
                    <span class="line-clamp-1">{hl}</span>
                  </div>
                {/each}
              </div>
            </div>

            <!-- Price and Action Buttons -->
            <div class="pt-4 border-t border-[#F0ECE1] flex items-center justify-between gap-3">
              <div>
                <span class="text-base sm:text-lg font-bold text-[#0F2B34]">৳ {issue.price}</span>
                <span class="text-xs text-[#7B8794] block">মুদ্রিত সংখ্যা • {issue.pageCount} পৃষ্ঠা</span>
              </div>

              <div class="flex items-center space-x-2">
                <button
                  onclick={() => navigate(`/publication/${issue.id}`)}
                  class="px-3.5 py-2 border border-[#0F2B34] text-xs font-medium text-[#0F2B34] hover:bg-[#0F2B34] hover:text-white transition-colors"
                >
                  সূচিপত্র
                </button>
                <button
                  onclick={() => openSubscribeModal(issue)}
                  class="px-4 py-2 bg-[#A31D1D] hover:bg-[#851414] text-white text-xs font-semibold tracking-wide transition-all active:scale-95 shadow-xs"
                >
                  কপি কিনুন
                </button>
              </div>
            </div>

          </div>

        </div>
      {/each}
    </div>
  </section>

</div>
