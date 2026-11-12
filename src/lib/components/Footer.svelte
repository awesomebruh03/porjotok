<script>
  import { toast } from "../stores/ui.svelte.js";
  import { t, link } from "../stores/content.svelte.js";

  let email = $state("");
  let isSubmitting = $state(false);

  function handleNewsletterSubmit(e) {
    e.preventDefault();
    if (!email || !email.includes("@") || !email.includes(".")) {
      toast.show(t("footer.toast.invalidEmail"), "error");
      return;
    }

    isSubmitting = true;
    setTimeout(() => {
      isSubmitting = false;
      toast.show(t("footer.toast.success"), "success");
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
          data-content-key="footer.brand"
          class="mb-4 font-serif text-3xl font-bold tracking-wide text-[#FDD835] sm:text-4xl md:text-5xl"
        >
          {t("footer.brand")}
        </h2>
        <p
          data-content-key="footer.tagline"
          class="max-w-2xl text-sm font-light leading-relaxed text-[#8BA3AC] sm:text-base"
        >
          {t("footer.tagline")}
        </p>
      </div>

      <!-- Right Column: Newsletter Subscription Box -->
      <div class="flex flex-col justify-end lg:col-span-5">
        <label
          for="newsletter-email"
          data-content-key="footer.newsletter.label"
          class="mb-2 block text-sm font-medium text-white"
        >
          {t("footer.newsletter.label")}
        </label>
        <form onsubmit={handleNewsletterSubmit} class="flex w-full">
          <input
            id="newsletter-email"
            type="email"
            bind:value={email}
            placeholder={t("footer.newsletter.placeholder")}
            data-content-key-placeholder="footer.newsletter.placeholder"
            required
            class="flex-1 bg-white px-4 py-3 text-sm text-[#1E2328] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FDD835]"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            data-content-key={isSubmitting
              ? "footer.newsletter.submitting"
              : "footer.newsletter.submit"}
            class="whitespace-nowrap bg-[#C41E24] px-6 py-3 text-sm font-medium tracking-wide text-white transition-colors hover:bg-[#A31D1D] active:scale-95 disabled:opacity-75"
          >
            {isSubmitting
              ? t("footer.newsletter.submitting")
              : t("footer.newsletter.submit")}
          </button>
        </form>
        <p
          data-content-key="footer.newsletter.privacy"
          class="mt-2 text-xs text-[#6D8B96]"
        >
          {t("footer.newsletter.privacy")}
        </p>
      </div>
    </div>

    <!-- Bottom Row: Navigation Links & Copyright -->
    <div
      class="flex flex-col items-center justify-between gap-4 pt-8 text-xs text-[#8BA3AC] sm:flex-row sm:text-sm"
    >
      <!-- Links -->
      <div class="flex flex-wrap items-center gap-3 sm:gap-4">
        <a
          {...link("footer.link.contribute")}
          class="transition-colors hover:text-[#FDD835]"
          >{t("footer.link.contribute")}</a
        >
        <span class="text-[#2B5462]">•</span>
        <a
          {...link("footer.link.advertise")}
          class="transition-colors hover:text-[#FDD835]"
          >{t("footer.link.advertise")}</a
        >
        <span class="text-[#2B5462]">•</span>
        <a
          {...link("footer.link.facebook")}
          class="transition-colors hover:text-[#FDD835]"
          >{t("footer.link.facebook")}</a
        >
        <span class="text-[#2B5462]">•</span>
        <a
          {...link("footer.link.about")}
          class="transition-colors hover:text-[#FDD835]"
          >{t("footer.link.about")}</a
        >
      </div>

      <!-- Copyright Notice -->
      <div>
        <p data-content-key="footer.copyright">{t("footer.copyright")}</p>
      </div>
    </div>
  </div>
</footer>
