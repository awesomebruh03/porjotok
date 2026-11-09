<script>
  import { navigate } from "../stores/router.svelte.js";
  import { openSubscriptionModal } from "../stores/ui.svelte.js";
  import { articles } from "../data/articles.js";
  import { publications } from "../data/publications.js";

  // Specific items from mock data
  const coverStory = articles.find((a) => a.id === "mustard-banyan-tree");
  const reflectionStories = articles.filter((a) => a.isReflectedBand);
  const latestStories = articles.filter((a) => a.isLatestGrid);
  const issues = publications.slice(0, 4);

  function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }

  function openSubscribeModal(plan = "annual", issueTitle = "") {
    openSubscriptionModal({
      type: plan,
      issueTitle: issueTitle || "বার্ষিক সাবস্ক্রিপশন (৬টি মুদ্রিত সংখ্যা)",
      price: plan === "annual" ? 1200 : 220,
    });
  }
</script>

<div class="w-full">
  <!-- ========================================================================= -->
  <!-- SECTION 1: HERO SECTION (~900px tall)                                    -->
  <!-- ========================================================================= -->
  <section
    class="relative flex min-h-[840px] w-full flex-col justify-between overflow-hidden bg-[#0F2B34] lg:min-h-[920px]"
  >
    <!-- Background Hero Image -->
    <div
      class="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
      style="background-image: url('/assets/hero-banyan.png');"
    >
      <!-- Gradient Overlays for Cinematic Atmosphere and Text Readability -->
      <div
        class="absolute inset-0 bg-gradient-to-t from-[#0B2027]/95 via-[#0B2027]/40 to-black/30"
      ></div>
      <div
        class="absolute inset-0 bg-gradient-to-r from-[#0B2027]/85 via-transparent to-[#0B2027]/40"
      ></div>
    </div>

    <!-- Framing L-Brackets in Corners (Visual Reference Match) -->
    <div class="hero-corner-tl"></div>
    <div class="hero-corner-tr"></div>
    <div class="hero-corner-bl"></div>
    <div class="hero-corner-br"></div>

    <!-- Top Sub-Header Bar (Inside Hero) -->
    <div
      class="relative z-10 mx-auto w-full max-w-[1380px] px-6 pt-8 sm:px-10 lg:px-12"
    >
      <div
        class="flex items-center justify-between border-b border-white/20 pb-3"
      >
        <span
          class="text-xs font-light tracking-wider text-gray-200 sm:text-sm"
        >
          দ্বিমাসিক প্রামাণ্য ভ্রমণ ও ভৌগোলিক সাময়িকী
        </span>
        <span
          class="hidden text-xs tracking-widest text-[#FDD835] sm:inline-block"
        >
          মুদ্রিত ও ডিজিটাল প্রকাশনা
        </span>
      </div>
    </div>

    <!-- Center / Bottom Content: Headline, Excerpt, CTA -->
    <div
      class="relative z-10 mx-auto mt-auto w-full max-w-[1380px] px-6 pb-14 sm:px-10 lg:px-12"
    >
      <div class="grid grid-cols-1 items-end gap-8 lg:grid-cols-12">
        <!-- Left Hero Typography & Actions -->
        <div class="space-y-5 lg:col-span-8">
          <!-- Yellow Badge -->
          <div
            class="inline-flex items-center bg-[#FDD835] px-3 py-1 text-xs font-semibold tracking-wide text-[#0F2B34] shadow-sm sm:text-sm"
          >
            <span class="mr-2 text-xs text-[#A31D1D]">■</span>
            সেপ্টেম্বর-অক্টোবর ২০২৬ সংখ্যা
          </div>

          <!-- Main Headline -->
          <h1
            class="font-serif text-4xl font-extrabold leading-[1.15] tracking-tight text-white sm:text-6xl lg:text-7xl"
          >
            দেশকে দেখি<br />
            <span class="text-white">নতুন জানালায়</span>
          </h1>

          <!-- Editorial Lead Paragraph -->
          <p
            class="max-w-2xl text-base font-light leading-relaxed text-gray-200/90 sm:text-lg"
          >
            বরেন্দ্র অঞ্চলের বিস্তীর্ণ হলদে দিগন্তে কুয়াশার চাদর আর একাকিত্বে
            সগৌরব বটছায়া প্রান্তিক জনপদের মাটির সুর ও লোকজীবনের অনুসন্ধান
          </p>

          <!-- CTA Buttons & Issue Meta -->
          <div class="flex flex-wrap items-center gap-5 pt-2">
            <!-- Red CTA Button with Yellow Accent Bracket -->
            <button
              onclick={() => navigate("/publication/issue-38")}
              class="btn-red-accent group inline-flex items-center space-x-2 px-6 py-3 text-sm shadow-lg active:scale-95 sm:text-base"
            >
              <span>সংখ্যাটি পড়ুন</span>
              <span class="transition-transform group-hover:translate-x-1"
                >→</span
              >
              <div class="btn-red-accent-bracket"></div>
            </button>

            <!-- Issue Volume Text -->
            <span class="text-sm font-light tracking-wide text-gray-300">
              সংখ্যা ৩৮ | বর্ষ ১২
            </span>
          </div>
        </div>

        <!-- Right Hero Metadata Box & Scroll Indicator -->
        <div
          class="flex flex-col items-start justify-between space-y-8 lg:col-span-4 lg:items-end"
        >
          <!-- Photo Documentation Box (Yellow left border) -->
          <div
            class="backdrop-blur-xs border-l-3 max-w-[240px] space-y-1 border-[#FDD835] bg-[#0B2027]/75 p-3.5 text-xs text-gray-300"
          >
            <p
              class="text-[11px] font-semibold uppercase tracking-wider text-[#FDD835]"
            >
              আলোকচিত্র
            </p>
            <p class="font-medium text-white">ছবি: শাহরিয়ার বায়েজিদ</p>
            <p class="text-gray-400">স্থান: নাচোল, চাঁপাইনবাবগঞ্জ</p>
          </div>

          <!-- Scroll Down Anchor -->
          <button
            onclick={() => scrollToSection("issue-archive")}
            class="group flex cursor-pointer items-center space-x-2 text-xs text-gray-300 transition-colors hover:text-[#FDD835] sm:text-sm"
          >
            <span>নিচে নামুন</span>
            <div
              class="rounded-xs flex h-6 w-6 items-center justify-center border border-gray-400/60 transition-colors group-hover:border-[#FDD835]"
            >
              <span
                class="text-xs transition-transform group-hover:translate-y-0.5"
                >↓</span
              >
            </div>
          </button>
        </div>
      </div>
    </div>
  </section>

  <!-- ========================================================================= -->
  <!-- SECTION 2: ISSUE ARCHIVE (সংখ্যা সংগ্রহ)                                  -->
  <!-- Deep Teal #0F2B34 Background with 4 Framed Magazine Covers               -->
  <!-- ========================================================================= -->
  <section
    id="issue-archive"
    class="w-full bg-[#0F2B34] pb-12 pt-16 text-white"
  >
    <div class="mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-8">
      <!-- Section Title & Lead -->
      <div
        class="flex flex-col justify-between gap-4 border-b border-white/10 pb-6 md:flex-row md:items-end"
      >
        <div>
          <!-- <span
            class="mb-1 block text-xs font-medium uppercase tracking-wider text-[#FDD835]"
          >
            মুদ্রিত ত্রৈমাসিক সংকলন
          </span> -->
          <h2
            class="mb-2 font-serif text-3xl font-bold tracking-tight text-white sm:text-4xl"
          >
            বিশেষ প্রবন্ধ
          </h2>
          <div class="h-1 w-16 bg-[#FDD835]"></div>
        </div>

        <!-- <p
          class="max-w-md text-xs font-light leading-relaxed text-[#8BA3AC] sm:text-sm"
        >
          প্রত্যেকটি সংখ্যা একটি স্বতন্ত্র সংগ্রাহক সংস্করণ। ক্ষেত্রসমীক্ষা,
          রঙিন প্রামাণ্য আলোকচিত্র ও হারিয়ে যাওয়া ইতিহাসের দলিল।
        </p> -->
      </div>

      <!-- 4 Magazine Issues Grid -->
      <div
        class="grid grid-cols-1 gap-6 pt-10 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4"
      >
        {#each issues as issue}
          <div
            class="group flex cursor-pointer flex-col"
            role="button"
            tabindex="0"
            onclick={() => navigate(`/publication/${issue.id}`)}
            onkeydown={(e) => {
              if (e.key === "Enter" || e.key === " ")
                navigate(`/publication/${issue.id}`);
            }}
          >
            <!-- Issue Container with Reflection -->
            <div class="cover-reflection-wrapper relative">
              <!-- Red Pill Badge if Present -->
              {#if issue.badge}
                <div class="absolute -top-3.5 left-2 z-20">
                  <span
                    class="bg-[#A31D1D] px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-white shadow-sm"
                  >
                    {issue.badge}
                  </span>
                </div>
              {/if}

              <!-- Magazine Cover Card in Yellow Border Frame -->
              <div
                class="relative aspect-[3/4] overflow-hidden border-4 border-[#FDD835] bg-black shadow-2xl transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
              >
                <!-- Cover Image -->
                <img
                  src={issue.coverImage}
                  alt={issue.title}
                  class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <!-- Top Magazine Title Header on Cover -->
                <div
                  class="absolute inset-x-0 top-0 bg-gradient-to-b from-black/80 via-black/40 to-transparent p-3 text-center"
                >
                  <div
                    class="font-serif text-lg font-bold tracking-wide text-white"
                  >
                    পর্যটক
                  </div>
                  <div
                    class="text-[9px] font-light tracking-widest text-[#FDD835]"
                  >
                    ত্রৈমাসিক পত্রিকা
                  </div>
                </div>

                <!-- Bottom Story Caption Overlay on Cover -->
                <div
                  class="backdrop-blur-xs absolute inset-x-0 bottom-0 border-t border-white/10 bg-black/85 p-3 text-left"
                >
                  <div
                    class="line-clamp-1 text-[11px] font-semibold text-[#FDD835]"
                  >
                    {issue.subtitle.split("/")[0]}
                  </div>
                  {#if issue.subtitle.split("/")[1]}
                    <div
                      class="line-clamp-1 text-[10px] font-light text-gray-300"
                    >
                      {issue.subtitle.split("/")[1]}
                    </div>
                  {/if}
                </div>
              </div>

              <!-- Floor Mirror Reflection Simulation -->
              <div
                class="cover-reflection mt-1 hidden h-14 overflow-hidden sm:block"
              >
                <img
                  src={issue.coverImage}
                  alt=""
                  class="w-full object-cover blur-[2px] brightness-75 filter"
                />
              </div>
            </div>

            <!-- Issue Caption Below Cover -->
            <div class="mt-3 text-center sm:text-left">
              <h3
                class="font-serif text-base font-semibold text-white transition-colors group-hover:text-[#FDD835] sm:text-lg"
              >
                {issue.title}
              </h3>
              <p class="mt-0.5 text-xs text-[#8BA3AC]">
                সংখ্যা {issue.issueNumber} • পৃষ্ঠা {issue.pageCount}
              </p>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- ========================================================================= -->
  <!-- SECTION 2.5: REFLECTION BAND (~270px tall, Table of Contents)              -->
  <!-- ========================================================================= -->
  <section
    class="relative w-full overflow-hidden border-b border-t border-[#1B4856] bg-[#0F2B34] py-8 text-white"
  >
    <!-- Subtle Water Reflection Texture in Background -->
    <div
      class="pointer-events-none absolute inset-0 bg-cover bg-center opacity-15"
      style="background-image: url('/assets/water-reflection.png');"
    ></div>

    <div class="relative z-10 mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-8">
      <!-- Sub-header Row -->
      <div
        class="mb-6 flex items-center justify-between border-b border-white/10 pb-4"
      >
        <div
          class="flex items-center space-x-2 text-xs font-semibold tracking-wide text-[#FDD835] sm:text-sm"
        >
          <span class="text-xs">■</span>
          <span>চলতি সংখ্যার প্রধান নিবন্ধসমূহ</span>
        </div>
        <div
          class="text-xs text-[#7B98A2] transition-all duration-300 ease-in-out hover:text-base hover:text-[#C41E24]"
        >
          <a href="http://localhost:5173/#/publication/issue-38"
            >সূচিপত্র একনজরে</a
          >
        </div>
      </div>

      <!-- 3 Columns Articles Grid -->
      <div class="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3">
        {#each reflectionStories as story}
          <div
            class="group cursor-pointer border-l-2 border-[#1B4856] pl-4 transition-all duration-200 hover:border-[#FDD835]"
            role="button"
            tabindex="0"
            onclick={() => navigate(`/article/${story.id}`)}
            onkeydown={(e) => {
              if (e.key === "Enter" || e.key === " ")
                navigate(`/article/${story.id}`);
            }}
          >
            <!-- Category and Page Number -->
            <div class="mb-1.5 flex items-center justify-between text-xs">
              <span class="font-medium tracking-wide text-[#FDD835]">
                {story.categoryLabel}
              </span>
              <span class="text-[11px] text-[#7B98A2]">
                {story.page}
              </span>
            </div>

            <!-- Headline -->
            <h4
              class="mb-2 font-serif text-base font-semibold leading-snug text-white transition-colors group-hover:text-[#FDD835] sm:text-lg"
            >
              {story.title}
            </h4>

            <!-- Short Excerpt -->
            <p
              class="line-clamp-2 text-xs font-light leading-relaxed text-[#8BA3AC]"
            >
              {story.excerpt}
            </p>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- ========================================================================= -->
  <!-- SECTION 3: COVER STORY (Warm Ivory #F4F1EA Background)                    -->
  <!-- ========================================================================= -->
  {#if coverStory}
    <section
      class="w-full border-b border-[#E6E1D5] bg-[#F4F1EA] py-16 text-[#1E2328] sm:py-20"
    >
      <div class="mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-8">
        <!-- Top Archival Meta Bar -->
        <div
          class="mb-10 flex flex-wrap items-center justify-between gap-2 border-b border-[#D8D2C4] pb-4 text-xs text-[#6B7280]"
        >
          <div class="flex items-center space-x-3">
            <span
              class="bg-[#A31D1D] px-2.5 py-0.5 text-[11px] font-medium text-white"
            >
              প্রচ্ছদ প্রতিবেদন
            </span>
            <span class="font-mono text-[#4B5563]">
              নথি নং: {coverStory.docNumber}
            </span>
          </div>
          <div class="font-medium text-[#4B5563]">
            {coverStory.banglaDate}
          </div>
        </div>

        <!-- 2 Column Editorial Layout -->
        <div
          class="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-14"
        >
          <!-- Left Column: Big Framed Photograph with Yellow Border -->
          <div class="lg:col-span-6">
            <div
              class="group relative cursor-pointer"
              role="button"
              tabindex="0"
              onclick={() => navigate(`/article/${coverStory.id}`)}
              onkeydown={(e) => {
                if (e.key === "Enter" || e.key === " ")
                  navigate(`/article/${coverStory.id}`);
              }}
            >
              <!-- Yellow Framed Image Container -->
              <div class="yellow-framed-image">
                <div class="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={coverStory.coverImage}
                    alt={coverStory.title}
                    class="group-hover:scale-102 h-full w-full object-cover transition-transform duration-500"
                  />

                  <!-- Viewfinder Tag Badge -->
                  <div
                    class="backdrop-blur-xs absolute bottom-2.5 right-2.5 bg-black/80 px-2 py-0.5 font-mono text-[10px] tracking-wider text-white"
                  >
                    {coverStory.viewfinderTag}
                  </div>
                </div>
              </div>

              <!-- Reflection Effect Below Yellow Frame -->
              <div
                class="cover-reflection mt-1 hidden h-12 overflow-hidden sm:block"
              >
                <img
                  src={coverStory.coverImage}
                  alt=""
                  class="w-full object-cover opacity-40 blur-[2px] filter"
                />
              </div>
            </div>
          </div>

          <!-- Right Column: Editorial Text & Story Breakdown -->
          <div class="space-y-6 lg:col-span-6">
            <!-- Category Tag with Compass Icon -->
            <div
              class="inline-flex items-center space-x-1.5 text-xs font-semibold tracking-wide text-[#A31D1D]"
            >
              <span>◎</span>
              <span>{coverStory.categoryBadge}</span>
            </div>

            <!-- Headline -->
            <h2
              class="cursor-pointer font-serif text-3xl font-bold leading-[1.25] tracking-tight text-[#0F2B34] transition-colors hover:text-[#A31D1D] sm:text-4xl md:text-[42px]"
              onclick={() => navigate(`/article/${coverStory.id}`)}
            >
              {coverStory.title}
            </h2>

            <!-- Red Underline Rule -->
            <div class="h-1 w-14 bg-[#A31D1D]"></div>

            <!-- Two Editorial Paragraphs -->
            <div
              class="space-y-4 text-sm font-light leading-relaxed text-[#374151] sm:text-base"
            >
              <p>
                সূর্যোদয়ের প্রথম প্রহরে যখন ঘন কুয়াশা বরেন্দ্রভূমির দিগন্তকে
                ঢেকে দেয়, তখন দূর থেকে কেবল এই শতবর্ষী ছায়াদায়ী মহীরুহের
                অবয়ব ভেসে ওঠে। হাজারো মানুষের পদরেখা মিলিয়ে গেছে এই বৃক্ষতলে।
                হলুদ সরিষার সুবাস আর মেঠোপথের বাঁকে লুকিয়ে থাকা মৌন ঐতিহ্যের
                মাঝে আজও কীভাবে বেঁচে থাকে কৃষকের সরল গল্প?
              </p>
              <p>
                লোকসংস্কৃতির অবিচ্ছেদ্য উপাদান বটগাছ কেবল একটি প্রাকৃতিক বৃক্ষ
                নয়; এটি বাংলা জনপদের সামাজিক আড্ডা, মেলা ও দীর্ঘ যাত্রাপথের
                জিরো পয়েন্ট।
              </p>
            </div>

            <!-- Footer Meta & Read Button -->
            <div
              class="flex flex-wrap items-center justify-between gap-4 border-t border-[#E6E1D5] pt-4"
            >
              <div class="text-xs text-[#4B5563] sm:text-sm">
                লেখা: <span class="font-medium text-[#1E2328]"
                  >{coverStory.author}</span
                >
                | ছবি:
                <span class="font-medium text-[#1E2328]"
                  >{coverStory.photographer}</span
                >
              </div>

              <!-- Button: সম্পূর্ণ পড়ুন → -->
              <button
                onclick={() => navigate(`/article/${coverStory.id}`)}
                class="inline-flex items-center space-x-2 bg-[#1F2937] px-5 py-2.5 text-xs font-medium tracking-wide text-white shadow-sm transition-all hover:bg-black active:scale-95 sm:text-sm"
              >
                <span>সম্পূর্ণ পড়ুন</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  {/if}

  <!-- ========================================================================= -->
  <!-- SECTION 4: LATEST STORIES (সর্বশেষ প্রতিবেদন, Ivory #F4F1EA Ground)          -->
  <!-- ========================================================================= -->
  <section
    class="w-full border-b border-[#E6E1D5] bg-[#F4F1EA] py-16 text-[#1E2328] sm:py-20"
  >
    <div class="mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-8">
      <!-- Section Title -->
      <div class="mb-10">
        <div
          class="mb-1 flex items-center space-x-2 text-xs font-semibold text-[#A31D1D]"
        >
          <span>■</span>
          <span>ধারাবাহিক</span>
        </div>
        <h2
          class="mb-2 font-serif text-3xl font-bold tracking-tight text-[#0F2B34] sm:text-4xl"
        >
          বিশেষ প্রবন্ধ
        </h2>
        <div class="h-1 w-16 bg-[#A31D1D]"></div>
      </div>

      <!-- 3 Card Grid -->
      <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
        {#each latestStories as story}
          <div
            class="group flex cursor-pointer flex-col border border-[#E6E1D5] bg-white shadow-sm transition-all duration-300 hover:shadow-xl"
            role="button"
            tabindex="0"
            onclick={() => navigate(`/article/${story.id}`)}
            onkeydown={(e) => {
              if (e.key === "Enter" || e.key === " ")
                navigate(`/article/${story.id}`);
            }}
          >
            <!-- Card Image with Yellow Frame Framing -->
            <div class="bg-white p-3">
              <div class="yellow-framed-image">
                <div class="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={story.coverImage}
                    alt={story.title}
                    class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  <!-- Tag overlay on photo -->
                  <div
                    class="backdrop-blur-xs absolute left-2 top-2 bg-black/80 px-2 py-0.5 text-[11px] text-white"
                  >
                    {story.categoryLabel}
                  </div>
                </div>
              </div>
            </div>

            <!-- Card Body -->
            <div class="flex flex-1 flex-col justify-between p-5">
              <div>
                <!-- Subcategory Tag -->
                <div class="mb-1.5 text-xs font-medium text-[#A31D1D]">
                  {story.categoryBadge}
                </div>

                <!-- Headline -->
                <h3
                  class="mb-3 font-serif text-lg font-bold leading-snug text-[#0F2B34] transition-colors group-hover:text-[#A31D1D] sm:text-xl"
                >
                  {story.title}
                </h3>

                <!-- Excerpt -->
                <p
                  class="mb-4 text-xs font-light leading-relaxed text-[#4B5563] sm:text-sm"
                >
                  {story.excerpt}
                </p>
              </div>

              <!-- Card Footer -->
              <div
                class="flex items-center justify-between border-t border-[#F0ECE1] pt-3 text-xs text-[#6B7280]"
              >
                <span class="font-medium text-[#1E2328]">{story.author}</span>
                <span>{story.banglaDate}</span>
              </div>
            </div>
          </div>
        {/each}
      </div>

      <!-- Center Bottom Button: সকল আর্কাইভ প্রতিবেদন দেখুন -->
      <div class="mt-12 text-center">
        <button
          onclick={() => navigate("/articles")}
          class="shadow-xs border border-[#1E2328] px-8 py-3 text-sm font-semibold text-[#1E2328] transition-all duration-200 hover:bg-[#1E2328] hover:text-white active:scale-95"
        >
          সকল আর্কাইভ প্রতিবেদন দেখুন
        </button>
      </div>
    </div>
  </section>

  <!-- ========================================================================= -->
  <!-- SECTION 5: SUBSCRIPTION CALLOUT & DOSSIER PANEL                           -->
  <!-- Deep Teal #0F2B34 Background with Inset Panel                             -->
  <!-- ========================================================================= -->
  <section class="w-full bg-[#0F2B34] py-14 text-white sm:py-20">
    <div class="mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-8">
      <!-- Inset Bordered Panel -->
      <div
        class="border border-[#1B4856] bg-[#0F2B34] p-8 shadow-2xl sm:p-12 lg:p-14"
      >
        <div
          class="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12"
        >
          <!-- Left Text Content -->
          <div class="space-y-4 lg:col-span-8">
            <div
              class="flex items-center space-x-2 text-xs font-semibold tracking-wide text-[#FDD835]"
            >
              <span>✉</span>
              <span>ডাকযোগে বার্ষিক গ্রাহক সেবা</span>
            </div>

            <h2
              class="font-serif text-2xl font-bold leading-tight text-white sm:text-4xl lg:text-[40px]"
            >
              প্রত্যেক সংখ্যার মুদ্রিত কপি পৌঁছে যাবে<br />
              <span class="text-white">আপনার ঠিকানায়</span>
            </h2>

            <p
              class="max-w-2xl text-xs font-light leading-relaxed text-[#8BA3AC] sm:text-sm"
            >
              বছরে ৬টি পূর্ণাঙ্গ সংখ্যা, বিশেষ উপহার মানচিত্র এবং সংরক্ষিত
              আর্কাইভাল আর্ট-কার্ড। আপনার ডাকঘরে বা হোম ডেলিভারিতে নিয়মিত
              পর্যটক পেতে এখনই যুক্ত হোন।
            </p>
          </div>

          <!-- Right Action Buttons -->
          <div class="flex flex-col space-y-3.5 lg:col-span-4">
            <!-- Yellow Button -->
            <button
              onclick={() => openSubscribeModal("annual")}
              class="w-full bg-[#FDD835] px-6 py-3.5 text-center text-sm font-bold tracking-wide text-[#0F2B34] shadow-md transition-all duration-150 hover:bg-[#FFDE00] active:scale-95"
            >
              বার্ষিক সাবস্ক্রিপশন (৳ ১২০০)
            </button>

            <!-- White Outline Button -->
            <button
              onclick={() =>
                openSubscribeModal(
                  "single",
                  "সংখ্যা ৩৮ — সেপ্টেম্বর-অক্টোবর ২০২৬",
                )}
              class="w-full border border-white px-6 py-3.5 text-center text-sm font-medium tracking-wide text-white transition-all duration-150 hover:bg-white hover:text-[#0F2B34] active:scale-95"
            >
              একক সংখ্যা কিনুন (৳ ২২০)
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</div>
