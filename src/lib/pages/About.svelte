<script>
  import { navigate } from "../stores/router.svelte.js";
  import { t } from "../stores/content.svelte.js";
</script>

<div class="min-h-screen w-full bg-[#F4F1EA] text-[#1E2328]">
  <!-- Header Banner -->
  <section
    class="border-b border-[#1B4856] bg-[#0F2B34] py-16 text-white sm:py-24"
  >
    <div class="mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-8">
      <div class="max-w-3xl space-y-4">
        <div
          class="inline-flex items-center space-x-2 text-xs font-semibold text-[#FDD835]"
        >
          <span>■</span>
          <span data-content-key="about.hero.eyebrow"
            >{t("about.hero.eyebrow")}</span
          >
        </div>
        <h1
          data-content-key="about.hero.title"
          class="font-serif text-3xl font-bold leading-tight tracking-tight text-white sm:text-6xl"
        >
          {t("about.hero.title")}
        </h1>
        <div class="my-4 h-1 w-20 bg-[#FDD835]"></div>
        <p
          data-content-key="about.hero.lead"
          class="text-base font-light leading-relaxed text-[#ADC5CE] sm:text-xl"
        >
          {t("about.hero.lead")}
        </p>
      </div>
    </div>
  </section>

  <!-- Editorial Mission & Story -->
  <section class="mx-auto max-w-[1380px] px-4 py-20 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
      <!-- Left Column: Story -->
      <div class="space-y-6 lg:col-span-7">
        <div
          class="inline-flex items-center space-x-2 text-xs font-semibold text-[#A31D1D]"
        >
          <span>◎</span>
          <span data-content-key="about.story.eyebrow"
            >{t("about.story.eyebrow")}</span
          >
        </div>
        <h2
          data-content-key="about.story.title"
          class="font-serif text-3xl font-bold leading-tight text-[#0F2B34] sm:text-4xl"
        >
          {t("about.story.title")}
        </h2>
        <div class="h-1 w-14 bg-[#A31D1D]"></div>

        <div
          class="space-y-4 text-sm font-light leading-relaxed text-[#374151] sm:text-base"
        >
          <p data-content-key="about.story.problem">
            {t("about.story.problem")}
          </p>
          <p data-content-key="about.story.origin">
            {t("about.story.origin")}
          </p>
        </div>

        <div
          data-content-key="about.story.quote"
          class="border-l-4 border-[#FDD835] bg-[#EDE9DE] p-5 font-serif text-base italic text-[#0F2B34]"
        >
          {t("about.story.quote")}
        </div>
      </div>

      <!-- Right Column: Framed Historical Photo -->
      <div class="lg:col-span-5">
        <div class="yellow-framed-image">
          <div class="aspect-[4/3] overflow-hidden bg-black">
            <img
              src="assets/hero-banyan.png"
              alt={t("about.story.imageAlt")}
              data-content-key-alt="about.story.imageAlt"
              class="h-full w-full object-cover"
            />
          </div>
        </div>
        <p
          data-content-key="about.story.caption"
          class="mt-3 text-center text-xs text-[#6B7280]"
        >
          {t("about.story.caption")}
        </p>
      </div>
    </div>
  </section>

  <!-- Core Principles Grid (Deep Teal Background) -->
  <section
    class="border-b border-t border-[#1B4856] bg-[#0F2B34] py-16 text-white sm:py-20"
  >
    <div class="mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-8">
      <div class="mx-auto mb-14 max-w-2xl space-y-3 text-center">
        <div
          data-content-key="about.principles.eyebrow"
          class="text-xs font-semibold text-[#FDD835]"
        >
          {t("about.principles.eyebrow")}
        </div>
        <h2
          data-content-key="about.principles.title"
          class="font-serif text-3xl font-bold sm:text-4xl"
        >
          {t("about.principles.title")}
        </h2>
        <div class="mx-auto h-1 w-16 bg-[#FDD835]"></div>
      </div>

      <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        <div class="space-y-3 border border-[#1B4856] bg-[#143844] p-6">
          <div
            data-content-key="about.principles.0.number"
            class="font-serif text-2xl font-bold text-[#FDD835]"
          >
            {t("about.principles.0.number")}
          </div>
          <h3
            data-content-key="about.principles.0.title"
            class="font-serif text-lg font-bold text-white"
          >
            {t("about.principles.0.title")}
          </h3>
          <p
            data-content-key="about.principles.0.description"
            class="text-xs leading-relaxed text-[#8BA3AC]"
          >
            {t("about.principles.0.description")}
          </p>
        </div>

        <div class="space-y-3 border border-[#1B4856] bg-[#143844] p-6">
          <div
            data-content-key="about.principles.1.number"
            class="font-serif text-2xl font-bold text-[#FDD835]"
          >
            {t("about.principles.1.number")}
          </div>
          <h3
            data-content-key="about.principles.1.title"
            class="font-serif text-lg font-bold text-white"
          >
            {t("about.principles.1.title")}
          </h3>
          <p
            data-content-key="about.principles.1.description"
            class="text-xs leading-relaxed text-[#8BA3AC]"
          >
            {t("about.principles.1.description")}
          </p>
        </div>

        <div class="space-y-3 border border-[#1B4856] bg-[#143844] p-6">
          <div
            data-content-key="about.principles.2.number"
            class="font-serif text-2xl font-bold text-[#FDD835]"
          >
            {t("about.principles.2.number")}
          </div>
          <h3
            data-content-key="about.principles.2.title"
            class="font-serif text-lg font-bold text-white"
          >
            {t("about.principles.2.title")}
          </h3>
          <p
            data-content-key="about.principles.2.description"
            class="text-xs leading-relaxed text-[#8BA3AC]"
          >
            {t("about.principles.2.description")}
          </p>
        </div>

        <div class="space-y-3 border border-[#1B4856] bg-[#143844] p-6">
          <div
            data-content-key="about.principles.3.number"
            class="font-serif text-2xl font-bold text-[#FDD835]"
          >
            {t("about.principles.3.number")}
          </div>
          <h3
            data-content-key="about.principles.3.title"
            class="font-serif text-lg font-bold text-white"
          >
            {t("about.principles.3.title")}
          </h3>
          <p
            data-content-key="about.principles.3.description"
            class="text-xs leading-relaxed text-[#8BA3AC]"
          >
            {t("about.principles.3.description")}
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- Editorial Board / Team -->
  <section class="mx-auto max-w-[1380px] px-4 py-20 sm:px-6 lg:px-8">
    <div class="mb-12">
      <div
        data-content-key="about.board.eyebrow"
        class="mb-1 text-xs font-bold uppercase text-[#A31D1D]"
      >
        {t("about.board.eyebrow")}
      </div>
      <h2
        data-content-key="about.board.title"
        class="font-serif text-3xl font-bold text-[#0F2B34]"
      >
        {t("about.board.title")}
      </h2>
      <div class="mt-2 h-1 w-14 bg-[#A31D1D]"></div>
    </div>

    <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
      <div
        class="group space-y-3 border border-[#D8D2C4] bg-white p-5 text-center transition-all hover:shadow-lg"
      >
        <div
          data-content-key="about.board.0.initial"
          class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#0F2B34] font-serif text-3xl font-bold text-[#FDD835]"
        >
          {t("about.board.0.initial")}
        </div>
        <h3
          data-content-key="about.board.0.name"
          class="font-serif text-lg font-bold text-[#0F2B34]"
        >
          {t("about.board.0.name")}
        </h3>
        <p
          data-content-key="about.board.0.role"
          class="text-xs font-semibold text-[#A31D1D]"
        >
          {t("about.board.0.role")}
        </p>
        <!-- <p class="text-xs leading-relaxed text-gray-500">
          লোকসংস্কৃতি ও নৃবিজ্ঞান বিষয়ে দীর্ঘ গবেষণার অভিজ্ঞতা।
        </p> -->
      </div>

      <div
        class="group space-y-3 border border-[#D8D2C4] bg-white p-5 text-center transition-all hover:shadow-lg"
      >
        <div
          data-content-key="about.board.1.initial"
          class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#0F2B34] font-serif text-3xl font-bold text-[#FDD835]"
        >
          {t("about.board.1.initial")}
        </div>
        <h3
          data-content-key="about.board.1.name"
          class="font-serif text-lg font-bold text-[#0F2B34]"
        >
          {t("about.board.1.name")}
        </h3>
        <p
          data-content-key="about.board.1.role"
          class="text-xs font-semibold text-[#A31D1D]"
        >
          {t("about.board.1.role")}
        </p>
        <!-- <p class="text-xs leading-relaxed text-gray-500">
          প্রামাণ্য ডকুমেন্টারি ফটোগ্রাফার, জাতীয় ও আন্তর্জাতিক
          পুরস্কারপ্রাপ্ত।
        </p> -->
      </div>

      <div
        class="group space-y-3 border border-[#D8D2C4] bg-white p-5 text-center transition-all hover:shadow-lg"
      >
        <div
          data-content-key="about.board.2.initial"
          class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#0F2B34] font-serif text-3xl font-bold text-[#FDD835]"
        >
          {t("about.board.2.initial")}
        </div>
        <h3
          data-content-key="about.board.2.name"
          class="font-serif text-lg font-bold text-[#0F2B34]"
        >
          {t("about.board.2.name")}
        </h3>
        <p
          data-content-key="about.board.2.role"
          class="text-xs font-semibold text-[#A31D1D]"
        >
          {t("about.board.2.role")}
        </p>
        <!-- <p class="text-xs leading-relaxed text-gray-500">
          পরিবেশ ও বন্যপ্রাণী বিষয়ক অনুসন্ধানী লেখক।
        </p> -->
      </div>

      <div
        class="group space-y-3 border border-[#D8D2C4] bg-white p-5 text-center transition-all hover:shadow-lg"
      >
        <div
          data-content-key="about.board.3.initial"
          class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#0F2B34] font-serif text-3xl font-bold text-[#FDD835]"
        >
          {t("about.board.3.initial")}
        </div>
        <h3
          data-content-key="about.board.3.name"
          class="font-serif text-lg font-bold text-[#0F2B34]"
        >
          {t("about.board.3.name")}
        </h3>
        <p
          data-content-key="about.board.3.role"
          class="text-xs font-semibold text-[#A31D1D]"
        >
          {t("about.board.3.role")}
        </p>
        <!-- <p class="text-xs leading-relaxed text-gray-500">
          প্রাচীন স্থাপত্য ও প্রত্নতাত্ত্বিক ঐতিহ্যের ইতিহাসবিদ।
        </p> -->
      </div>
    </div>
  </section>
</div>
