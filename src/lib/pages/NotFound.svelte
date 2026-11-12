<script>
  import { navigate } from "../stores/router.svelte.js";
  import { t, hrefOf } from "../stores/content.svelte.js";
</script>

<div
  class="flex min-h-[70vh] w-full items-center justify-center bg-[#F4F1EA] px-4 py-20"
>
  <div
    class="w-full max-w-md space-y-4 border-2 border-[#0F2B34] bg-white p-8 text-center shadow-xl"
  >
    <div
      data-content-key="notfound.code"
      class="font-serif text-4xl font-bold text-[#A31D1D]"
    >
      {t("notfound.code")}
    </div>
    <div class="mx-auto h-1 w-12 bg-[#FDD835]"></div>
    <h1
      data-content-key="notfound.title"
      class="font-serif text-2xl font-bold text-[#0F2B34]"
    >
      {t("notfound.title")}
    </h1>
    <p
      data-content-key="notfound.description"
      class="text-xs leading-relaxed text-gray-600 sm:text-sm"
    >
      {t("notfound.description")}
    </p>
    <div class="flex justify-center space-x-3 pt-4">
      <button
        onclick={() => navigate(hrefOf("notfound.home"))}
        data-content-key="notfound.home"
        class="bg-[#0F2B34] px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#1A4553]"
      >
        {t("notfound.home")}
      </button>
      <button
        onclick={() => navigate(hrefOf("notfound.articles"))}
        data-content-key="notfound.articles"
        class="border border-[#0F2B34] px-5 py-2.5 text-xs font-semibold text-[#0F2B34] transition-colors hover:bg-gray-50"
      >
        {t("notfound.articles")}
      </button>
    </div>
  </div>
</div>
