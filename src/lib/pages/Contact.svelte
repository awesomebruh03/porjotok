<script>
  import { toast } from "../stores/ui.svelte.js";
  import { t } from "../stores/content.svelte.js";

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
    if (!fullName.trim()) errors.fullName = t("contact.error.fullName");
    if (!email.trim() || !email.includes("@") || !email.includes(".")) {
      errors.email = t("contact.error.email");
    }
    if (!subject.trim()) errors.subject = t("contact.error.subject");
    if (!message.trim() || message.trim().length < 10) {
      errors.message = t("contact.error.message");
    }
    return Object.keys(errors).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) {
      toast.show(t("contact.toast.invalid"), "error");
      return;
    }

    isSubmitting = true;
    setTimeout(() => {
      isSubmitting = false;
      submittedSuccess = true;
      toast.show(t("contact.toast.success"), "success");
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
          <span data-content-key="contact.hero.eyebrow"
            >{t("contact.hero.eyebrow")}</span
          >
        </div>
        <h1
          data-content-key="contact.hero.title"
          class="font-serif text-3xl font-bold tracking-tight text-white sm:text-5xl"
        >
          {t("contact.hero.title")}
        </h1>
        <div class="my-3 h-1 w-20 bg-[#FDD835]"></div>
        <p
          data-content-key="contact.hero.lead"
          class="text-sm font-light leading-relaxed text-[#8BA3AC] sm:text-base"
        >
          {t("contact.hero.lead")}
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
            <h2
              data-content-key="contact.success.title"
              class="font-serif text-2xl font-bold text-[#0F2B34]"
            >
              {t("contact.success.title")}
            </h2>
            <p
              data-content-key="contact.success.thanks"
              class="mx-auto max-w-md text-sm leading-relaxed text-[#4B5563]"
            >
              {t("contact.success.thanks")} <strong>{fullName}</strong><span
                data-content-key="contact.success.body"
                >{t("contact.success.body")}</span
              >
            </p>
            <div class="pt-4">
              <button
                onclick={resetForm}
                data-content-key="contact.success.again"
                class="bg-[#0F2B34] px-6 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#1A4553]"
              >
                {t("contact.success.again")}
              </button>
            </div>
          </div>
        {:else}
          <div class="mb-6 border-b border-[#E6E1D5] pb-4">
            <h2
              data-content-key="contact.form.title"
              class="font-serif text-2xl font-bold text-[#0F2B34]"
            >
              {t("contact.form.title")}
            </h2>
            <p
              data-content-key="contact.form.hint"
              class="mt-1 text-xs text-gray-500"
            >
              {t("contact.form.hint")}
            </p>
          </div>

          <form onsubmit={handleSubmit} class="space-y-5">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <!-- Full Name -->
              <div>
                <label
                  for="contact-fullname"
                  data-content-key="contact.form.fullName.label"
                  class="mb-1 block text-xs font-semibold text-[#1E2328]"
                >
                  {t("contact.form.fullName.label")}
                  <span class="text-[#A31D1D]">*</span>
                </label>
                <input
                  id="contact-fullname"
                  type="text"
                  bind:value={fullName}
                  placeholder={t("contact.form.fullName.placeholder")}
                  data-content-key-placeholder="contact.form.fullName.placeholder"
                  class="w-full border bg-[#FAF8F5] {errors.fullName
                    ? 'border-red-500'
                    : 'border-gray-300'} px-3 py-2 text-sm focus:border-[#0F2B34] focus:outline-none"
                />
                {#if errors.fullName}
                  <span
                    data-content-key="contact.error.fullName"
                    class="mt-1 block text-[11px] text-red-600"
                    >{errors.fullName}</span
                  >
                {/if}
              </div>

              <!-- Email -->
              <div>
                <label
                  for="contact-email"
                  data-content-key="contact.form.email.label"
                  class="mb-1 block text-xs font-semibold text-[#1E2328]"
                >
                  {t("contact.form.email.label")}
                  <span class="text-[#A31D1D]">*</span>
                </label>
                <input
                  id="contact-email"
                  type="email"
                  bind:value={email}
                  placeholder={t("contact.form.email.placeholder")}
                  data-content-key-placeholder="contact.form.email.placeholder"
                  class="w-full border bg-[#FAF8F5] {errors.email
                    ? 'border-red-500'
                    : 'border-gray-300'} px-3 py-2 text-sm focus:border-[#0F2B34] focus:outline-none"
                />
                {#if errors.email}
                  <span
                    data-content-key="contact.error.email"
                    class="mt-1 block text-[11px] text-red-600"
                    >{errors.email}</span
                  >
                {/if}
              </div>
            </div>

            <!-- Category -->
            <div>
              <label
                for="contact-category"
                data-content-key="contact.form.category.label"
                class="mb-1 block text-xs font-semibold text-[#1E2328]"
              >
                {t("contact.form.category.label")}
              </label>
              <select
                id="contact-category"
                bind:value={category}
                class="w-full border border-gray-300 bg-[#FAF8F5] px-3 py-2 text-sm focus:border-[#0F2B34] focus:outline-none"
              >
                <option
                  value="article-pitch"
                  data-content-key="contact.form.category.articlePitch"
                  >{t("contact.form.category.articlePitch")}</option
                >
                <option
                  value="photo-submission"
                  data-content-key="contact.form.category.photoSubmission"
                  >{t("contact.form.category.photoSubmission")}</option
                >
                <option
                  value="subscription-help"
                  data-content-key="contact.form.category.subscriptionHelp"
                  >{t("contact.form.category.subscriptionHelp")}</option
                >
                <option
                  value="advertising"
                  data-content-key="contact.form.category.advertising"
                  >{t("contact.form.category.advertising")}</option
                >
                <option
                  value="general-feedback"
                  data-content-key="contact.form.category.generalFeedback"
                  >{t("contact.form.category.generalFeedback")}</option
                >
              </select>
            </div>

            <!-- Subject -->
            <div>
              <label
                for="contact-subject"
                data-content-key="contact.form.subject.label"
                class="mb-1 block text-xs font-semibold text-[#1E2328]"
              >
                {t("contact.form.subject.label")}
                <span class="text-[#A31D1D]">*</span>
              </label>
              <input
                id="contact-subject"
                type="text"
                bind:value={subject}
                placeholder={t("contact.form.subject.placeholder")}
                data-content-key-placeholder="contact.form.subject.placeholder"
                class="w-full border bg-[#FAF8F5] {errors.subject
                  ? 'border-red-500'
                  : 'border-gray-300'} px-3 py-2 text-sm focus:border-[#0F2B34] focus:outline-none"
              />
              {#if errors.subject}
                <span
                  data-content-key="contact.error.subject"
                  class="mt-1 block text-[11px] text-red-600"
                  >{errors.subject}</span
                >
              {/if}
            </div>

            <!-- Message -->
            <div>
              <label
                for="contact-message"
                data-content-key="contact.form.message.label"
                class="mb-1 block text-xs font-semibold text-[#1E2328]"
              >
                {t("contact.form.message.label")}
                <span class="text-[#A31D1D]">*</span>
              </label>
              <textarea
                id="contact-message"
                bind:value={message}
                rows="5"
                placeholder={t("contact.form.message.placeholder")}
                data-content-key-placeholder="contact.form.message.placeholder"
                class="w-full border bg-[#FAF8F5] {errors.message
                  ? 'border-red-500'
                  : 'border-gray-300'} px-3 py-2 text-sm focus:border-[#0F2B34] focus:outline-none"
              ></textarea>
              {#if errors.message}
                <span
                  data-content-key="contact.error.message"
                  class="mt-1 block text-[11px] text-red-600"
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
                  data-content-key={isSubmitting
                    ? "contact.form.submitting"
                    : "contact.form.submit"}
                  >{isSubmitting
                    ? t("contact.form.submitting")
                    : t("contact.form.submit")}</span
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
              <strong
                data-content-key="contact.office.name"
                class="block text-[#0F2B34]">{t("contact.office.name")}</strong
              >
              <p
                data-content-key="contact.office.address"
                class="text-gray-600"
              >
                {t("contact.office.address")}
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
                <span
                  data-content-key="contact.office.emailLabel"
                  class="text-gray-500">{t("contact.office.emailLabel")}</span
                >
                <span
                  data-content-key="contact.office.email"
                  class="ml-1 font-medium text-[#0F2B34]"
                  >{t("contact.office.email")}</span
                >
              </div>
              <!-- <div>
                <span class="text-gray-500">গ্রাহক সেবা ও সাবস্ক্রিপশন:</span>
                <span class="ml-1 font-medium text-[#0F2B34]"
                  >support@porjotok.com</span
                >
              </div> -->
              <div>
                <span
                  data-content-key="contact.office.phoneLabel"
                  class="text-gray-500">{t("contact.office.phoneLabel")}</span
                >
                <span
                  data-content-key="contact.office.phone"
                  class="ml-1 font-medium text-[#0F2B34]"
                  >{t("contact.office.phone")}</span
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Submission Guidelines Box -->
        <div class="space-y-3 border border-[#D8D2C4] bg-[#EDE9DE] p-6">
          <h4
            data-content-key="contact.guidelines.title"
            class="border-b border-[#D8D2C4] pb-2 font-serif text-base font-bold text-[#0F2B34]"
          >
            {t("contact.guidelines.title")}
          </h4>
          <ul
            class="list-disc space-y-2 pl-4 text-xs leading-relaxed text-[#4B5563]"
          >
            <li data-content-key="contact.guidelines.fieldwork">
              {t("contact.guidelines.fieldwork")}
            </li>
            <li data-content-key="contact.guidelines.length">
              {t("contact.guidelines.length")}
            </li>
            <li data-content-key="contact.guidelines.photos">
              {t("contact.guidelines.photos")}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</div>
