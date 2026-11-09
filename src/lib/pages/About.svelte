<script>
  import { navigate } from "../stores/router.svelte.js";
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
          <span>আমাদের দর্শন ও অভিযাত্রা</span>
        </div>
        <h1
          class="font-serif text-3xl font-bold leading-tight tracking-tight text-white sm:text-6xl"
        >
          দেশকে দেখি নতুন জানালায়
        </h1>
        <div class="my-4 h-1 w-20 bg-[#FDD835]"></div>
        <p
          class="text-base font-light leading-relaxed text-[#ADC5CE] sm:text-xl"
        >
          পর্যটক কেবল একটি সাময়িকী নয়; এটি বাংলাদেশ ও এর সংলগ্ন অঞ্চলের
          ভূ-প্রকৃতি, প্রাচীন সংস্কৃতি ও প্রান্তিক মানুষের জীবনধারাকে গভীর
          শ্রদ্ধা ও নিবিড় ভালোবাসায় নথিভুক্ত করার এক নিরবচ্ছিন্ন বৌদ্ধিক
          আন্দোলন।
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
          <span>আমাদের শুরু ও উদ্দেশ্য</span>
        </div>
        <h2
          class="font-serif text-3xl font-bold leading-tight text-[#0F2B34] sm:text-4xl"
        >
          বাণিজ্যিক পর্যটনের বাইরে মাটির গভীরের অনুসন্ধান
        </h2>
        <div class="h-1 w-14 bg-[#A31D1D]"></div>

        <div
          class="space-y-4 text-sm font-light leading-relaxed text-[#374151] sm:text-base"
        >
          <p>
            হোটেল বুকিং, সেলফি তোলার স্পট আর কৃত্রিম বিজ্ঞাপনী আকর্ষণের ভিড়ে
            হারিয়ে যায় প্রকৃত বাংলাদেশ। নদীর বুকে জেগে ওঠা নতুন চরের মাঝিদের
            দীর্ঘশ্বাস, পাহাড়ি ট্রেইলের নিস্তব্ধতা, কিংবা বরেন্দ্রভূমির হলুদ
            সরিষা ক্ষেতে দেড়শত বছর ধরে একা দাঁড়িয়ে থাকা প্রাচীন বটগাছের মৌন
            ইতিহাস—এসব গল্প সাধারণ প্রচারমাধ্যমে স্থান পায় না।
          </p>
          <p>
            সেই অভাববোধ থেকেই ‘পর্যটক’ পত্রিকার জন্ম। আমরা বিশ্বাস করি, ভ্রমণ
            হলো নিজেকে জানার এবং নিজ মাটির প্রতি দায়বদ্ধ হওয়ার অন্যতম শ্রেষ্ঠ
            মাধ্যম। আমাদের প্রতিটি সংখ্যায় থাকে মাসের পর মাস ধরে পরিচালিত
            মাঠপর্যায়ের গবেষণা, আঞ্চলিক প্রবীণদের স্মৃতি ও উচ্চমানের প্রামাণ্য
            আলোকচিত্র।
          </p>
        </div>

        <div
          class="border-l-4 border-[#FDD835] bg-[#EDE9DE] p-5 font-serif text-base italic text-[#0F2B34]"
        >
          "আমরা দূরবর্তী পদরেখা ও প্রান্তিক মানুষের কণ্ঠস্বরকে কেবল দেখি না,
          শ্রদ্ধার সাথে ধারণ করি।"
        </div>
      </div>

      <!-- Right Column: Framed Historical Photo -->
      <div class="lg:col-span-5">
        <div class="yellow-framed-image">
          <div class="aspect-[4/3] overflow-hidden bg-black">
            <img
              src="/assets/hero-banyan.png"
              alt="পর্যটক ক্ষেত্রসমীক্ষা"
              class="h-full w-full object-cover"
            />
          </div>
        </div>
        <p class="mt-3 text-center text-xs text-[#6B7280]">
          বরেন্দ্র অঞ্চলে প্রথম ক্ষেত্রসমীক্ষার সময়কার ফ্রেম | চাঁপাইনবাবগঞ্জ
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
        <div class="text-xs font-semibold text-[#FDD835]">
          আমাদের চারটি মূল স্তম্ভ
        </div>
        <h2 class="font-serif text-3xl font-bold sm:text-4xl">
          সম্পাদনা নীতি ও দায়বদ্ধতা
        </h2>
        <div class="mx-auto h-1 w-16 bg-[#FDD835]"></div>
      </div>

      <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        <div class="space-y-3 border border-[#1B4856] bg-[#143844] p-6">
          <div class="font-serif text-2xl font-bold text-[#FDD835]">০১.</div>
          <h3 class="font-serif text-lg font-bold text-white">
            মাঠপর্যায়ের সমীক্ষা
          </h3>
          <p class="text-xs leading-relaxed text-[#8BA3AC]">
            কোনো ধার করা গল্প নয়; লেখকের নিজের পায়ে হাঁটা মেঠোপথ এবং সরেজমিনে
            সাক্ষাৎকারের ভিত্তিতে প্রতিটি নিবন্ধ রচিত।
          </p>
        </div>

        <div class="space-y-3 border border-[#1B4856] bg-[#143844] p-6">
          <div class="font-serif text-2xl font-bold text-[#FDD835]">০২.</div>
          <h3 class="font-serif text-lg font-bold text-white">
            বাস্তুতন্ত্রের সুরক্ষা
          </h3>
          <p class="text-xs leading-relaxed text-[#8BA3AC]">
            সুন্দরবনের ম্যানগ্রোভ থেকে শুরু করে হাওর ও চিরসবুজ বনাঞ্চলের
            সংকটাপন্ন জীববৈচিত্র্য সংরক্ষণে সংবেদনশীল প্রতিবেদন।
          </p>
        </div>

        <div class="space-y-3 border border-[#1B4856] bg-[#143844] p-6">
          <div class="font-serif text-2xl font-bold text-[#FDD835]">০৩.</div>
          <h3 class="font-serif text-lg font-bold text-white">
            লোকসংস্কৃতির মর্যাদা
          </h3>
          <p class="text-xs leading-relaxed text-[#8BA3AC]">
            মৌয়াল, চরবাসী, চা-শ্রমিক এবং বিভিন্ন ক্ষুদ্র নৃগোষ্ঠীর লোকগাথা,
            উৎসব ও বাচনিক ঐতিহ্যকে যথাযথ মর্যাদায় তুলে ধরা।
          </p>
        </div>

        <div class="space-y-3 border border-[#1B4856] bg-[#143844] p-6">
          <div class="font-serif text-2xl font-bold text-[#FDD835]">০৪.</div>
          <h3 class="font-serif text-lg font-bold text-white">
            দায়িত্বশীল ভ্রমণ
          </h3>
          <p class="text-xs leading-relaxed text-[#8BA3AC]">
            স্থানীয় পরিবেশ ও সংস্কৃতির কোনো ক্ষতি না করে টেকসই পর্যটনের
            পথপ্রদর্শন এবং ভ্রমণকারীদের সচেতন করা।
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- Editorial Board / Team -->
  <section class="mx-auto max-w-[1380px] px-4 py-20 sm:px-6 lg:px-8">
    <div class="mb-12">
      <div class="mb-1 text-xs font-bold uppercase text-[#A31D1D]">
        সম্পাদকীয় পর্ষদ
      </div>
      <h2 class="font-serif text-3xl font-bold text-[#0F2B34]">
        আমাদের পেছনের মানুষজন
      </h2>
      <div class="mt-2 h-1 w-14 bg-[#A31D1D]"></div>
    </div>

    <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
      <div
        class="group space-y-3 border border-[#D8D2C4] bg-white p-5 text-center transition-all hover:shadow-lg"
      >
        <div
          class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#0F2B34] font-serif text-3xl font-bold text-[#FDD835]"
        >
          তা
        </div>
        <h3 class="font-serif text-lg font-bold text-[#0F2B34]">আহমদ ফারুক</h3>
        <p class="text-xs font-semibold text-[#A31D1D]">
          প্রধান সম্পাদক ও গবেষক
        </p>
        <!-- <p class="text-xs leading-relaxed text-gray-500">
          লোকসংস্কৃতি ও নৃবিজ্ঞান বিষয়ে দীর্ঘ গবেষণার অভিজ্ঞতা।
        </p> -->
      </div>

      <div
        class="group space-y-3 border border-[#D8D2C4] bg-white p-5 text-center transition-all hover:shadow-lg"
      >
        <div
          class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#0F2B34] font-serif text-3xl font-bold text-[#FDD835]"
        >
          শা
        </div>
        <h3 class="font-serif text-lg font-bold text-[#0F2B34]">রহিম রানা</h3>
        <p class="text-xs font-semibold text-[#A31D1D]">নির্বাহী সম্পাদক</p>
        <!-- <p class="text-xs leading-relaxed text-gray-500">
          প্রামাণ্য ডকুমেন্টারি ফটোগ্রাফার, জাতীয় ও আন্তর্জাতিক
          পুরস্কারপ্রাপ্ত।
        </p> -->
      </div>

      <div
        class="group space-y-3 border border-[#D8D2C4] bg-white p-5 text-center transition-all hover:shadow-lg"
      >
        <div
          class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#0F2B34] font-serif text-3xl font-bold text-[#FDD835]"
        >
          সা
        </div>
        <h3 class="font-serif text-lg font-bold text-[#0F2B34]">
          ড. রফিকুল ইসলাম
        </h3>
        <p class="text-xs font-semibold text-[#A31D1D]">
          ভাষা ও অনুবাদ সম্পাদক
        </p>
        <!-- <p class="text-xs leading-relaxed text-gray-500">
          পরিবেশ ও বন্যপ্রাণী বিষয়ক অনুসন্ধানী লেখক।
        </p> -->
      </div>

      <div
        class="group space-y-3 border border-[#D8D2C4] bg-white p-5 text-center transition-all hover:shadow-lg"
      >
        <div
          class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#0F2B34] font-serif text-3xl font-bold text-[#FDD835]"
        >
          কা
        </div>
        <h3 class="font-serif text-lg font-bold text-[#0F2B34]">
          কাইয়ুম হালদার
        </h3>
        <p class="text-xs font-semibold text-[#A31D1D]">ব্যবস্থাপনা সম্পাদক</p>
        <!-- <p class="text-xs leading-relaxed text-gray-500">
          প্রাচীন স্থাপত্য ও প্রত্নতাত্ত্বিক ঐতিহ্যের ইতিহাসবিদ।
        </p> -->
      </div>
    </div>
  </section>
</div>
