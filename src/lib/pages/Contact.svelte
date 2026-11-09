<script>
  import { toast } from "../stores/ui.svelte.js";

  let fullName = $state("");
  let email = $state("");
  let subject = $state("");
  let category = $state("article-pitch");
  let message = $state("");
  let isSubmitting = $state(false);
  let submittedSuccess = $state(false);

  let errors = $state({});

  function validate() {
    errors = {};
    if (!fullName.trim()) errors.fullName = "আপনার পূর্ণ নাম লিখুন";
    if (!email.trim() || !email.includes("@") || !email.includes(".")) {
      errors.email = "সঠিক ইমেইল ঠিকানা প্রদান করুন";
    }
    if (!subject.trim()) errors.subject = "বিষয় উল্লেখ করুন";
    if (!message.trim() || message.trim().length < 10) {
      errors.message = "বার্তাটি কমপক্ষে ১০ অক্ষরের হতে হবে";
    }
    return Object.keys(errors).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) {
      toast.show("অনুগ্রহ করে ফরমের ভুলগুলো সংশোধন করুন।", "error");
      return;
    }

    isSubmitting = true;
    setTimeout(() => {
      isSubmitting = false;
      submittedSuccess = true;
      toast.show(
        "ধন্যবাদ! আপনার বার্তাটি সম্পাদকীয় দপ্তরে পৌঁছেছে।",
        "success",
      );
    }, 700);
  }

  function resetForm() {
    fullName = "";
    email = "";
    subject = "";
    message = "";
    category = "article-pitch";
    submittedSuccess = false;
    errors = {};
  }
</script>

<div class="min-h-screen w-full bg-[#F4F1EA] text-[#1E2328]">
  <!-- Header Banner -->
  <section
    class="border-b border-[#1B4856] bg-[#0F2B34] py-14 text-white sm:py-20"
  >
    <div class="mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-8">
      <div class="max-w-3xl space-y-3">
        <div
          class="inline-flex items-center space-x-2 text-xs font-semibold text-[#FDD835]"
        >
          <span>■</span>
          <span>সম্পাদকীয় কার্যালয় ও চিঠিপত্র</span>
        </div>
        <h1
          class="font-serif text-3xl font-bold tracking-tight text-white sm:text-5xl"
        >
          যোগাযোগ ও বার্তা পাঠান
        </h1>
        <div class="my-3 h-1 w-20 bg-[#FDD835]"></div>
        <p
          class="text-sm font-light leading-relaxed text-[#8BA3AC] sm:text-base"
        >
          আপনার কোনো ক্ষেত্রসমীক্ষার প্রস্তাবনা, আলোকচিত্র সিরিজ, গ্রাহকসেবা
          প্রশ্ন বা প্রতিক্রিয়া থাকলে আমাদের সম্পাদকীয় দপ্তরে সরাসরি লিখুন।
        </p>
      </div>
    </div>
  </section>

  <!-- Content Section -->
  <section class="mx-auto max-w-[1380px] px-4 py-16 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 gap-12 lg:grid-cols-12">
      <!-- Left Column: Form -->
      <div
        class="border border-[#D8D2C4] bg-white p-8 shadow-sm sm:p-10 lg:col-span-7"
      >
        {#if submittedSuccess}
          <!-- Success Confirmation State -->
          <div class="space-y-4 py-12 text-center">
            <div
              class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#0F2B34] text-3xl text-[#FDD835] shadow-md"
            >
              ✓
            </div>
            <h2 class="font-serif text-2xl font-bold text-[#0F2B34]">
              বার্তাটি সফলভাবে পাঠানো হয়েছে!
            </h2>
            <p class="mx-auto max-w-md text-sm leading-relaxed text-[#4B5563]">
              ধন্যবাদ <strong>{fullName}</strong>। পর্যটক পত্রিকার সম্পাদকীয়
              বোর্ড আপনার বার্তাটি খতিয়ে দেখবে এবং প্রয়োজনীয় ক্ষেত্রে আগামী ৩
              কার্যদিবসের মধ্যে যোগাযোগ করবে।
            </p>
            <div class="pt-4">
              <button
                onclick={resetForm}
                class="bg-[#0F2B34] px-6 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#1A4553]"
              >
                আরেকটি বার্তা লিখুন
              </button>
            </div>
          </div>
        {:else}
          <div class="mb-6 border-b border-[#E6E1D5] pb-4">
            <h2 class="font-serif text-2xl font-bold text-[#0F2B34]">
              সরাসরি বার্তা পাঠান
            </h2>
            <p class="mt-1 text-xs text-gray-500">
              সবগুলো তথ্য নির্ভুলভাবে পূরণ করুন।
            </p>
          </div>

          <form onsubmit={handleSubmit} class="space-y-5">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <!-- Full Name -->
              <div>
                <label
                  for="contact-fullname"
                  class="mb-1 block text-xs font-semibold text-[#1E2328]"
                >
                  আপনার নাম <span class="text-[#A31D1D]">*</span>
                </label>
                <input
                  id="contact-fullname"
                  type="text"
                  bind:value={fullName}
                  placeholder="যেমন: তানভীর আহমেদ"
                  class="w-full border bg-[#FAF8F5] {errors.fullName
                    ? 'border-red-500'
                    : 'border-gray-300'} px-3 py-2 text-sm focus:border-[#0F2B34] focus:outline-none"
                />
                {#if errors.fullName}
                  <span class="mt-1 block text-[11px] text-red-600"
                    >{errors.fullName}</span
                  >
                {/if}
              </div>

              <!-- Email -->
              <div>
                <label
                  for="contact-email"
                  class="mb-1 block text-xs font-semibold text-[#1E2328]"
                >
                  ইমেইল ঠিকানা <span class="text-[#A31D1D]">*</span>
                </label>
                <input
                  id="contact-email"
                  type="email"
                  bind:value={email}
                  placeholder="name@example.com"
                  class="w-full border bg-[#FAF8F5] {errors.email
                    ? 'border-red-500'
                    : 'border-gray-300'} px-3 py-2 text-sm focus:border-[#0F2B34] focus:outline-none"
                />
                {#if errors.email}
                  <span class="mt-1 block text-[11px] text-red-600"
                    >{errors.email}</span
                  >
                {/if}
              </div>
            </div>

            <!-- Category -->
            <div>
              <label
                for="contact-category"
                class="mb-1 block text-xs font-semibold text-[#1E2328]"
              >
                বার্তার ধরন / বিভাগ
              </label>
              <select
                id="contact-category"
                bind:value={category}
                class="w-full border border-gray-300 bg-[#FAF8F5] px-3 py-2 text-sm focus:border-[#0F2B34] focus:outline-none"
              >
                <option value="article-pitch"
                  >নিবন্ধ বা ক্ষেত্রসমীক্ষার প্রস্তাবনা</option
                >
                <option value="photo-submission"
                  >প্রামাণ্য আলোকচিত্র সিরিজ সাবমিশন</option
                >
                <option value="subscription-help"
                  >বার্ষিক সদস্যপদ বা ডাকযোগে ডেলিভারি সহায়তা</option
                >
                <option value="advertising"
                  >বিজ্ঞাপন ও প্রাতিষ্ঠানিক অংশীদারিত্ব</option
                >
                <option value="general-feedback"
                  >সাধারণ মতামত ও প্রতিক্রিয়া</option
                >
              </select>
            </div>

            <!-- Subject -->
            <div>
              <label
                for="contact-subject"
                class="mb-1 block text-xs font-semibold text-[#1E2328]"
              >
                বিষয় <span class="text-[#A31D1D]">*</span>
              </label>
              <input
                id="contact-subject"
                type="text"
                bind:value={subject}
                placeholder="বার্তার মূল বিষয় লিখুন"
                class="w-full border bg-[#FAF8F5] {errors.subject
                  ? 'border-red-500'
                  : 'border-gray-300'} px-3 py-2 text-sm focus:border-[#0F2B34] focus:outline-none"
              />
              {#if errors.subject}
                <span class="mt-1 block text-[11px] text-red-600"
                  >{errors.subject}</span
                >
              {/if}
            </div>

            <!-- Message -->
            <div>
              <label
                for="contact-message"
                class="mb-1 block text-xs font-semibold text-[#1E2328]"
              >
                বিস্তারিত বার্তা <span class="text-[#A31D1D]">*</span>
              </label>
              <textarea
                id="contact-message"
                bind:value={message}
                rows="5"
                placeholder="আপনার প্রস্তাবনা, প্রশ্ন বা মতামত এখানে বিস্তারিত লিখুন..."
                class="w-full border bg-[#FAF8F5] {errors.message
                  ? 'border-red-500'
                  : 'border-gray-300'} px-3 py-2 text-sm focus:border-[#0F2B34] focus:outline-none"
              ></textarea>
              {#if errors.message}
                <span class="mt-1 block text-[11px] text-red-600"
                  >{errors.message}</span
                >
              {/if}
            </div>

            <!-- Submit -->
            <div class="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                class="flex items-center space-x-2 bg-[#A31D1D] px-8 py-3 text-sm font-semibold tracking-wide text-white shadow-md transition-all hover:bg-[#851414] active:scale-95 disabled:opacity-75"
              >
                <span
                  >{isSubmitting
                    ? "বার্তা পাঠানো হচ্ছে..."
                    : "বার্তা জমা দিন"}</span
                >
                <span>→</span>
              </button>
            </div>
          </form>
        {/if}
      </div>

      <!-- Right Column: Editorial Contact Details & Office Addresses -->
      <div class="space-y-8 lg:col-span-5">
        <!-- Office Location Info -->
        <div class="space-y-4 border border-[#D8D2C4] bg-white p-6 shadow-sm">
          <div class="border-b border-[#E6E1D5] pb-3">
            <!-- <span class="text-[11px] font-bold uppercase text-[#A31D1D]"
              >কার্যালয়</span
            > -->
            <!-- <h3 class="font-serif text-lg font-bold text-[#0F2B34]">
              সম্পাদকীয় ও ব্যবস্থাপনা দপ্তর
            </h3> -->
          </div>

          <div class="space-y-4 text-xs text-[#374151] sm:text-sm">
            <div>
              <strong class="block text-[#0F2B34]">পর্যটক কার্যালয়:</strong>
              <p class="text-gray-600">
                ১০৬, কনকর্ড এম্পোরিয়াম, কাটাবন,এলিফ্যান্ট রোড, ঢাকা ১২০৫
              </p>
            </div>

            <!-- <div>
              <strong class="block text-[#0F2B34]"
                >বরেন্দ্র গবেষণা ব্যুরো:</strong
              >
              <p class="text-gray-600">
                নাচোল রোড, চাঁপাইনবাবগঞ্জ সদর, চাঁপাইনবাবগঞ্জ
              </p>
            </div> -->

            <div class="space-y-1 border-t border-[#F0ECE1] pt-2">
              <div>
                <span class="text-gray-500">সম্পাদকীয় ইমেইল:</span>
                <span class="ml-1 font-medium text-[#0F2B34]"
                  >porjotokbdt@gmail.com</span
                >
              </div>
              <!-- <div>
                <span class="text-gray-500">গ্রাহক সেবা ও সাবস্ক্রিপশন:</span>
                <span class="ml-1 font-medium text-[#0F2B34]"
                  >support@porjotok.com</span
                >
              </div> -->
              <div>
                <span class="text-gray-500">মুঠোফোন:</span>
                <span class="ml-1 font-medium text-[#0F2B34]">০১৮০৪-৭৬৮০০৮</span
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Submission Guidelines Box -->
        <div class="space-y-3 border border-[#D8D2C4] bg-[#EDE9DE] p-6">
          <h4
            class="border-b border-[#D8D2C4] pb-2 font-serif text-base font-bold text-[#0F2B34]"
          >
            লেখা ও ছবি পাঠানোর নিয়মাবলী
          </h4>
          <ul
            class="list-disc space-y-2 pl-4 text-xs leading-relaxed text-[#4B5563]"
          >
            <li>
              নিবন্ধ অবশ্যই সরেজমিন পরিদর্শনের ওপর ভিত্তি করে লেখা হতে হবে। কোনো
              অনলাইন অনুকরণ গ্রহণযোগ্য নয়।
            </li>
            <li>
              লেখা ১৫০০ থেকে ৩০০০ শব্দের মধ্যে হতে হবে। ইউনিকোড বাংলা ফন্টে
              পাঠাতে হবে।
            </li>
            <li>
              আলোকচিত্র উচ্চ রেজোলিউশনের (কমপক্ষে ৩০০ ডিপিআই) এবং র’ বা
              আনকমপ্রেসড জেপেগ ফরম্যাটে পাঠাতে হবে।
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</div>
