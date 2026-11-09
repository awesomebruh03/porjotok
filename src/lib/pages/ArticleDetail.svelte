<script>
  import { articles } from '../data/articles.js';
  import { router, navigate } from '../stores/router.svelte.js';
  import { bookmarks, toggleBookmark, toast } from '../stores/ui.svelte.js';

  let { params = {} } = $props();

  let fontSize = $state('medium'); // 'small' | 'medium' | 'large'

  let articleId = $derived(params.id || router.current.params?.id || 'mustard-banyan-tree');
  let article = $derived(articles.find(a => a.id === articleId) || articles[0]);
  let isBookmarked = $derived(bookmarks.includes(article.id));
  let relatedArticles = $derived(articles.filter(a => a.id !== article.id && (a.category === article.category || a.issueId === article.issueId)).slice(0, 3));

  async function handleShare() {
    const shareData = {
      title: article.title,
      text: article.subtitle,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.show('নিবন্ধের লিংক সফলভাবে শেয়ার করা হয়েছে!', 'success');
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      // Clipboard fallback
      navigator.clipboard.writeText(window.location.href);
      toast.show('লিংকটি ক্লিপবোর্ডে কপি করা হয়েছে!', 'success');
    }
  }

  function printArticle() {
    window.print();
  }
</script>

<div class="w-full bg-[#F4F1EA] min-h-screen text-[#1E2328]">

  <!-- Breadcrumb & Reader Toolbar Bar -->
  <div class="border-b border-[#D8D2C4] bg-[#EDE9DE] sticky top-[74px] z-30 shadow-xs">
    <div class="max-w-[1100px] mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs text-[#5A636D]">

      <!-- Breadcrumb -->
      <div class="flex items-center space-x-2 truncate">
        <a href="#/" class="hover:text-black">হোম</a>
        <span>/</span>
        <a href="#/articles" class="hover:text-black">প্রতিবেদন</a>
        <span>/</span>
        <span class="text-[#A31D1D] font-medium truncate max-w-[200px] sm:max-w-none">{article.title}</span>
      </div>

      <!-- Reading Controls: Font Size, Bookmark, Share -->
      <div class="flex items-center space-x-3 shrink-0">

        <!-- Font Size Adjuster -->
        <div class="flex items-center space-x-1 border border-gray-300 bg-white px-1.5 py-0.5 rounded-xs">
          <button
            onclick={() => (fontSize = 'small')}
            class="px-1 text-[11px] font-bold {fontSize === 'small' ? 'text-[#A31D1D]' : 'text-gray-500'}"
            title="ছোট হরফ"
          >
            অ-
          </button>
          <span class="text-gray-300">|</span>
          <button
            onclick={() => (fontSize = 'medium')}
            class="px-1 text-xs font-bold {fontSize === 'medium' ? 'text-[#A31D1D]' : 'text-gray-500'}"
            title="স্বাভাবিক হরফ"
          >
            অ
          </button>
          <span class="text-gray-300">|</span>
          <button
            onclick={() => (fontSize = 'large')}
            class="px-1 text-sm font-bold {fontSize === 'large' ? 'text-[#A31D1D]' : 'text-gray-500'}"
            title="বড় হরফ"
          >
            অ+
          </button>
        </div>

        <!-- Bookmark Toggle Button -->
        <button
          onclick={() => toggleBookmark(article.id)}
          class="flex items-center space-x-1 px-2.5 py-1 border border-gray-300 bg-white hover:border-[#0F2B34] text-xs transition-colors"
          title={isBookmarked ? 'সংরক্ষণ তালিকা থেকে সরান' : 'পরে পড়ার জন্য সংরক্ষণ করুন'}
        >
          <span class="{isBookmarked ? 'text-[#A31D1D]' : 'text-gray-400'}">★</span>
          <span class="hidden sm:inline">{isBookmarked ? 'সংরক্ষিত' : 'সংরক্ষণ'}</span>
        </button>

        <!-- Share Button -->
        <button
          onclick={handleShare}
          class="flex items-center space-x-1 px-2.5 py-1 bg-[#0F2B34] text-white hover:bg-[#1A4553] text-xs transition-colors"
          title="শেয়ার করুন"
        >
          <span>↗</span>
          <span>শেয়ার</span>
        </button>

      </div>

    </div>
  </div>

  <!-- Article Header & Meta -->
  <article class="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-12">

    <!-- Archival Meta Header -->
    <div class="border-b border-[#D8D2C4] pb-4 mb-8 flex flex-wrap items-center justify-between text-xs text-[#6B7280] gap-2">
      <div class="flex items-center space-x-3">
        <span class="bg-[#A31D1D] text-white text-[11px] font-semibold px-2.5 py-0.5">
          {article.categoryBadge || 'মাঠপর্যায়ের সমীক্ষা'}
        </span>
        {#if article.docNumber}
          <span class="font-mono text-[#4B5563]">নথি: {article.docNumber}</span>
        {/if}
        <span>{article.readingTime}</span>
      </div>
      <div class="flex items-center space-x-3">
        <span>{article.banglaDate}</span>
        <span>•</span>
        <a href="#/publication/{article.issueId}" class="hover:text-[#A31D1D] font-medium underline">
          {article.issueLabel}
        </a>
      </div>
    </div>

    <!-- Main Title & Subtitle -->
    <header class="space-y-4 mb-10">
      <h1 class="font-serif text-3xl sm:text-5xl font-extrabold text-[#0F2B34] leading-[1.25] tracking-tight">
        {article.title}
      </h1>

      {#if article.subtitle}
        <p class="font-serif text-lg sm:text-2xl text-[#5A636D] font-light leading-relaxed">
          {article.subtitle}
        </p>
      {/if}

      <!-- Author and Contributor Info Box -->
      <div class="pt-4 flex flex-wrap items-center gap-6 text-xs sm:text-sm text-[#4B5563] border-t border-[#E6E1D5]">
        <div>
          <span class="text-gray-500">প্রতিবেদন ও গবেষণা:</span>
          <span class="font-bold text-[#0F2B34] ml-1">{article.author}</span>
        </div>
        <div>
          <span class="text-gray-500">আলোকচিত্র:</span>
          <span class="font-bold text-[#0F2B34] ml-1">{article.photographer}</span>
        </div>
        {#if article.location}
          <div>
            <span class="text-gray-500">সমীক্ষা অঞ্চল:</span>
            <span class="font-medium text-[#1E2328] ml-1">{article.location}</span>
          </div>
        {/if}
      </div>
    </header>

    <!-- Main Hero Framed Photograph -->
    <div class="mb-12">
      <div class="yellow-framed-image">
        <div class="aspect-[16/10] overflow-hidden bg-black relative">
          <img
            src={article.heroImage || article.coverImage}
            alt={article.title}
            class="w-full h-full object-cover"
          />
          {#if article.viewfinderTag}
            <div class="absolute bottom-3 right-3 bg-black/80 backdrop-blur-xs text-white text-xs px-2.5 py-1 font-mono">
              {article.viewfinderTag}
            </div>
          {/if}
        </div>
      </div>
      <!-- Caption -->
      <div class="text-center text-xs text-[#5A636D] mt-3 italic">
        আলোকচিত্র: {article.photographer} | স্থান: {article.location} | পর্যটক সংগ্রহশালা
      </div>
    </div>

    <!-- Article Long-Form Body -->
    <div class="max-w-[820px] mx-auto">

      <!-- Lead / First Paragraph with Drop Cap -->
      <div class="article-content {fontSize === 'small' ? 'text-base leading-relaxed' : fontSize === 'large' ? 'text-xl leading-loose' : 'text-lg leading-[2rem]'}">
        <p class="first-letter-drop text-[#1E2328] font-normal leading-relaxed mb-6">
          {article.excerpt}
        </p>

        <!-- Markdown formatted body -->
        {#each article.content.split('\n\n') as paragraph}
          {#if paragraph.startsWith('## ')}
            <h2 class="font-serif text-2xl sm:text-3xl font-bold text-[#0F2B34] mt-10 mb-4 pb-2 border-b border-[#D8D2C4]">
              {paragraph.replace('## ', '')}
            </h2>
          {:else if paragraph.startsWith('> ')}
            <blockquote class="my-6 border-l-4 border-[#FDD835] bg-[#EDE9DE] p-5 font-serif italic text-base sm:text-lg text-[#0F2B34] leading-relaxed">
              {paragraph.replace('> ', '')}
            </blockquote>
          {:else if paragraph.trim() && !paragraph.includes(article.excerpt)}
            <p class="mb-6 text-[#2D3748]">
              {paragraph.trim()}
            </p>
          {/if}
        {/each}
      </div>

      <!-- Author Bio Box -->
      <div class="mt-14 p-6 bg-[#EDE9DE] border border-[#D8D2C4] flex items-start space-x-4">
        <div class="w-12 h-12 bg-[#0F2B34] text-[#FDD835] font-serif font-bold text-xl rounded-full flex items-center justify-center shrink-0">
          {article.author.charAt(0)}
        </div>
        <div>
          <h4 class="font-serif text-base font-bold text-[#0F2B34]">{article.author}</h4>
          <p class="text-xs text-[#4B5563] mt-1 leading-relaxed">{article.authorBio}</p>
        </div>
      </div>

      <!-- Reader Actions: Share, Save, Print -->
      <div class="mt-10 py-4 border-t border-b border-[#D8D2C4] flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <button
            onclick={handleShare}
            class="px-4 py-2 bg-[#0F2B34] hover:bg-[#1A4553] text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors"
          >
            <span>↗</span>
            <span>সামাজিক মাধ্যমে শেয়ার</span>
          </button>
          <button
            onclick={() => toggleBookmark(article.id)}
            class="px-4 py-2 border border-[#0F2B34] text-[#0F2B34] hover:bg-[#0F2B34] hover:text-white text-xs font-medium transition-colors"
          >
            {isBookmarked ? '★ সংরক্ষিত তালিকায় রয়েছে' : '☆ পরে পড়ুন'}
          </button>
        </div>

        <button
          onclick={printArticle}
          class="text-xs text-[#5A636D] hover:text-black hidden sm:inline-block"
        >
          🖨️ প্রিন্ট করুন
        </button>
      </div>

    </div>

  </article>

  <!-- Related Articles Section -->
  <section class="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-[#D8D2C4]">
    <div class="mb-8">
      <div class="text-xs text-[#A31D1D] font-bold uppercase mb-1">আরও পড়ুন</div>
      <h3 class="font-serif text-2xl font-bold text-[#0F2B34]">সম্পর্কিত অন্যান্য প্রতিবেদন</h3>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      {#each relatedArticles as rel}
        <div
          class="bg-white border border-[#D8D2C4] flex flex-col group cursor-pointer shadow-sm hover:shadow-xl transition-all"
          onclick={() => navigate(`/article/${rel.id}`)}
        >
          <div class="p-3 bg-white">
            <div class="yellow-framed-image">
              <div class="aspect-[16/10] overflow-hidden bg-black">
                <img src={rel.coverImage} alt={rel.title} class="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </div>
            </div>
          </div>
          <div class="p-4 flex-1 flex flex-col justify-between">
            <div>
              <span class="text-[11px] text-[#A31D1D] font-medium">{rel.categoryLabel}</span>
              <h4 class="font-serif text-base font-bold text-[#0F2B34] group-hover:text-[#A31D1D] transition-colors mt-1 mb-2">
                {rel.title}
              </h4>
              <p class="text-xs text-gray-500 line-clamp-2">{rel.excerpt}</p>
            </div>
            <div class="pt-3 border-t border-gray-100 flex justify-between text-[11px] text-gray-400 mt-3">
              <span>{rel.author}</span>
              <span>{rel.readingTime}</span>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </section>

</div>
