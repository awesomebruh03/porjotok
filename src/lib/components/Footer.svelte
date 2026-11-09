<script>
  import { toast } from "../stores/ui.svelte.js";

  let email = $state("");
  let isSubmitting = $state(false);

  function handleNewsletterSubmit(e) {
    e.preventDefault();
    if (!email || !email.includes("@") || !email.includes(".")) {
      toast.show("অনুগ্রহ করে একটি সঠিক ইমেইল ঠিকানা প্রদান করুন।", "error");
      return;
    }

    isSubmitting = true;
    setTimeout(() => {
      isSubmitting = false;
      toast.show(
        "ধন্যবাদ! পর্যটক পত্রিকার নিউজলেটারে আপনি সফলভাবে যুক্ত হয়েছেন।",
        "success",
      );
      email = "";
    }, 600);
  }
</script>

<footer
  class="w-full border-t border-[#1B4856] bg-[#0F2B34] pb-10 pt-14 text-[#ADC5CE]"
>
  <div class="mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-8">
    <!-- Top Grid: Big Editorial Motto & Newsletter Form -->
    <div
      class="grid grid-cols-1 items-start gap-8 border-b border-[#1A4553] pb-12 lg:grid-cols-12 lg:gap-12"
    >
      <!-- Left Column: Big Yellow Slogan & Mission Statement -->
      <div class="lg:col-span-7">
        <h2
          data-no-translate
          class="mb-4 font-serif text-3xl font-bold tracking-wide text-[#FDD835] sm:text-4xl md:text-5xl"
        >
          পর্যটক
        </h2>
        <p
          class="max-w-2xl text-sm font-light leading-relaxed text-[#8BA3AC] sm:text-base"
        >
          পর্যটন ভাবনা ও বিকাশের পত্রিকা
        </p>
      </div>

      <!-- Right Column: Newsletter Subscription Box -->
      <div class="flex flex-col justify-end lg:col-span-5">
        <label
          for="newsletter-email"
          class="mb-2 block text-sm font-medium text-white"
        >
          নতুন সংখ্যার খবর ইমেইলে পান
        </label>
        <form onsubmit={handleNewsletterSubmit} class="flex w-full">
          <input
            id="newsletter-email"
            type="email"
            bind:value={email}
            placeholder="আপনার ইমেইল ঠিকানা..."
            required
            class="flex-1 bg-white px-4 py-3 text-sm text-[#1E2328] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FDD835]"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            class="whitespace-nowrap bg-[#C41E24] px-6 py-3 text-sm font-medium tracking-wide text-white transition-colors hover:bg-[#A31D1D] active:scale-95 disabled:opacity-75"
          >
            {isSubmitting ? "অপেক্ষা করুন..." : "জমা দিন"}
          </button>
        </form>
        <p class="mt-2 text-xs text-[#6D8B96]">
          স্প্যামমুক্ত গ্রাহকসেবা। আপনি যেকোনো সময় সদস্যপদ প্রত্যাহার করতে
          পারবেন।
        </p>
      </div>
    </div>

    <!-- Bottom Row: Navigation Links & Copyright -->
    <div
      class="flex flex-col items-center justify-between gap-4 pt-8 text-xs text-[#8BA3AC] sm:flex-row sm:text-sm"
    >
      <!-- Links -->
      <div class="flex flex-wrap items-center gap-3 sm:gap-4">
        <a href="#/contact" class="transition-colors hover:text-[#FDD835]"
          >লেখা পাঠান</a
        >
        <span class="text-[#2B5462]">•</span>
        <a href="#/contact" class="transition-colors hover:text-[#FDD835]"
          >বিজ্ঞাপন</a
        >
        <span class="text-[#2B5462]">•</span>
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          class="transition-colors hover:text-[#FDD835]">ফেসবুক পেজ</a
        >
        <span class="text-[#2B5462]">•</span>
        <a href="#/about" class="transition-colors hover:text-[#FDD835]"
          >আমাদের সম্পর্কে</a
        >
      </div>

      <!-- Copyright Notice -->
      <div>
        <p>© ২০২৬ পর্যটক ● সর্বস্বত্ব সংরক্ষিত</p>
      </div>
    </div>
  </div>
</footer>
