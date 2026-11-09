<script>
  import { onDestroy } from 'svelte';
  import { locale, toggleLocale, cancelTranslation } from '../translate/locale.svelte.js';
  import { translator, isSupported } from '../translate/client.svelte.js';
  import { engine } from '../translate/engine.svelte.js';
  import { warm } from '../translate/prewarm.svelte.js';

  const supported = isSupported();

  let notice = $state('');
  let noticeTimer = null;

  const isEnglish = $derived(locale.value === 'en');
  const busy = $derived(locale.busy);
  const downloading = $derived(
    busy && (translator.status === 'checking' || translator.status === 'downloading')
  );
  const translating = $derived(busy && !downloading);
  const hasCounts = $derived(engine.total > 0);

  const percent = $derived(
    translating && hasCounts ? Math.min(100, Math.round((engine.done / engine.total) * 100)) : 0
  );

  const label = $derived(isEnglish && !locale.needsActivation ? 'বাংলা' : 'English');
  const pulsing = $derived(supported && !isEnglish && locale.pendingEnglish);

  const buttonTitle = $derived(
    !supported
      ? 'Automatic translation needs Chrome or Edge on desktop — click for details'
      : isEnglish && !locale.needsActivation
        ? 'বাংলায় দেখুন'
        : locale.needsActivation
          ? 'Some content is still in Bangla — click to finish translating'
          : 'Translate to English'
  );

  function showNotice(message) {
    notice = message;
    if (noticeTimer) clearTimeout(noticeTimer);
    noticeTimer = setTimeout(() => {
      notice = '';
      noticeTimer = null;
    }, 10000);
  }

  function dismissNotice() {
    if (noticeTimer) clearTimeout(noticeTimer);
    noticeTimer = null;
    notice = '';
  }

  function handleClick() {
    if (locale.busy) return;
    if (!supported) {
      showNotice(
        'Automatic translation needs Chrome or Edge on desktop. In Brave, use the translate icon in the address bar to translate this page.'
      );
      return;
    }
    toggleLocale();
  }

  onDestroy(() => {
    if (noticeTimer) clearTimeout(noticeTimer);
  });
</script>

<div class="relative" data-no-translate>
  <button
    type="button"
    onclick={handleClick}
    disabled={locale.busy}
    aria-pressed={isEnglish}
    aria-label={!supported
      ? 'Automatic translation is not available in this browser'
      : isEnglish
        ? 'Show this site in Bangla'
        : 'Translate this site to English'}
    title={buttonTitle}
    class="group inline-flex items-center justify-center gap-2 border px-2.5 py-1.5 text-sm font-medium transition-all duration-150 active:scale-95 disabled:cursor-progress sm:px-3 {isEnglish
      ? 'border-[#0F2B34] bg-[#0F2B34] text-[#FDD835]'
      : 'border-[#1E2328] bg-transparent text-[#1E2328] hover:bg-[#1E2328] hover:text-[#F4F1EA]'} {pulsing || (supported && locale.needsActivation)
      ? 'animate-pulse'
      : ''}"
  >
    {#if busy}
      <span
        class="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent"
        aria-hidden="true"
      ></span>
      <span class="tabular-nums">
        {#if downloading}
          {translator.download > 0 ? `${translator.download}%` : '…'}
        {:else if hasCounts}
          {percent}%
        {:else}
          …
        {/if}
      </span>
    {:else}
      <span class="translate-glyph h-4 w-4 shrink-0" aria-hidden="true"></span>
      <span class="hidden xl:inline">{label}</span>
    {/if}
  </button>

  {#if isEnglish && warm.running && !busy}
    <span
      class="absolute -right-0.5 -top-0.5 h-2 w-2 animate-pulse rounded-full bg-[#FDD835] ring-1 ring-[#0F2B34]"
      title="Preparing English for the rest of the site"
      aria-hidden="true"
    ></span>
  {/if}
</div>

{#if notice}
  <div
    class="fixed bottom-5 right-4 z-[70] w-[min(20rem,calc(100vw-2rem))] border border-[#1E2328] bg-[#F4F1EA] p-4 text-xs leading-relaxed text-[#1E2328] shadow-[0_18px_50px_rgba(15,43,52,0.28)] sm:right-6"
    role="status"
    aria-live="polite"
    data-no-translate
  >
    <div class="flex items-start justify-between gap-3">
      <p>{notice}</p>
      <button
        type="button"
        onclick={dismissNotice}
        class="shrink-0 font-medium text-[#A31D1D] underline underline-offset-2 hover:text-[#7f1616]"
      >
        Dismiss
      </button>
    </div>
  </div>
{/if}

{#if busy}
  <div
    class="fixed bottom-5 right-4 z-[70] w-[min(20rem,calc(100vw-2rem))] border border-[#1E2328] bg-[#F4F1EA] p-4 shadow-[0_18px_50px_rgba(15,43,52,0.28)] sm:right-6"
    role="status"
    aria-live="polite"
    data-no-translate
  >
    <div class="flex items-start justify-between gap-3">
      <div>
        <p class="text-sm font-semibold text-[#0F2B34]">
          {#if downloading}
            Preparing English
          {:else}
            Translating this page
          {/if}
        </p>
        <p class="mt-1 text-xs leading-relaxed text-[#4B5563]">
          {#if translator.status === 'checking'}
            Checking on-device support…
          {:else if downloading}
            Downloading the Bangla → English model
            {translator.download > 0 ? `(${translator.download}%)` : ''}. This happens once
            per browser.
          {:else if hasCounts}
            {engine.done} of {engine.total} passages · {percent}%
          {:else}
            Starting the on-device translator…
          {/if}
        </p>
      </div>
      <button
        type="button"
        onclick={cancelTranslation}
        class="text-xs font-medium text-[#A31D1D] underline underline-offset-2 hover:text-[#7f1616]"
      >
        Cancel
      </button>
    </div>

    <div class="mt-3 h-1.5 w-full overflow-hidden bg-[#D8D2C4]">
      {#if downloading}
        <div
          class="h-full bg-[#A31D1D] transition-[width] duration-300"
          style="width: {translator.download > 0 ? translator.download : 8}%"
        ></div>
      {:else}
        <div
          class="h-full bg-[#A31D1D] transition-[width] duration-300"
          style="width: {hasCounts ? percent : 8}%"
        ></div>
      {/if}
    </div>

    <p class="mt-2 text-[11px] leading-snug text-[#6B7280]">
      Runs on your device. Results are cached, so the next visit is instant.
    </p>
  </div>
{/if}

{#if translator.error && !busy}
  <div
    class="fixed bottom-5 right-4 z-[70] w-[min(20rem,calc(100vw-2rem))] border border-[#A31D1D] bg-[#F4F1EA] p-4 text-xs text-[#7f1616] shadow-lg sm:right-6"
    role="alert"
    data-no-translate
  >
    <div class="flex items-start justify-between gap-3">
      <p>{translator.error}</p>
      <button
        type="button"
        onclick={cancelTranslation}
        class="shrink-0 font-medium underline underline-offset-2"
      >
        Dismiss
      </button>
    </div>
  </div>
{/if}

<style>
  .translate-glyph {
    display: inline-block;
    background-color: currentColor;
    -webkit-mask: url('/assets/translation.png') center / contain no-repeat;
    mask: url('/assets/translation.png') center / contain no-repeat;
  }
</style>
