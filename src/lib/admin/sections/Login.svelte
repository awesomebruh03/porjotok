<script>
  import { ArrowLeft, LogIn, ShieldAlert } from "lucide-svelte";
  import { at } from "../adminI18n.svelte.js";
  import { auth, signIn } from "../auth.svelte.js";

  let email = $state("");
  let password = $state("");
  let localError = $state("");

  function friendly(message) {
    if (!message) return at("login.failed");
    if (/invalid login credentials/i.test(message)) return at("login.invalid");
    if (/email not confirmed/i.test(message)) return at("login.unconfirmed");
    return message;
  }

  async function submit(event) {
    event.preventDefault();
    localError = "";
    if (!email.trim() || !password) {
      localError = at("login.missing");
      return;
    }
    const ok = await signIn(email.trim(), password);
    if (!ok) localError = friendly(auth.error);
  }
</script>

<div
  class="flex min-h-screen flex-col bg-[#F4F1EA] text-[#1E2328]"
  data-no-translate
>
  <div class="flex flex-1 items-center justify-center px-4 py-10">
    <div
      class="w-full max-w-md border border-[#DED8CB] bg-white shadow-[0_24px_60px_-40px_rgba(15,43,52,0.6)]"
    >
      <div class="border-b border-[#DED8CB] bg-[#0F2B34] px-6 py-6 text-white">
        <div class="flex items-center gap-3">
          <div
            class="flex h-11 w-11 shrink-0 items-center justify-center border-2 border-[#FDD835] font-serif text-xl font-bold text-[#FDD835]"
          >
            {at("common.monogram")}
          </div>
          <div class="min-w-0">
            <p class="truncate font-serif text-xl font-bold leading-tight">
              {at("common.brand")}
            </p>
            <p
              class="mt-0.5 text-[10px] uppercase tracking-[0.22em] text-[#7B98A2]"
            >
              {at("common.admin")}
            </p>
          </div>
        </div>
      </div>

      <div class="px-6 py-6">
        <h1 class="font-serif text-2xl font-bold text-[#0F2B34]">
          {at("login.title")}
        </h1>
        <p class="mt-1 text-sm text-[#5A636D]">{at("login.subtitle")}</p>

        {#if !auth.configured}
          <div class="mt-6 border-l-4 border-[#FDD835] bg-[#FBF9F5] p-4">
            <p
              class="flex items-center gap-2 font-serif text-sm font-bold text-[#0F2B34]"
            >
              <ShieldAlert size={16} class="text-[#A31D1D]" />
              {at("login.setup.title")}
            </p>
            <p class="mt-2 text-xs leading-relaxed text-[#5A636D]">
              {at("login.setup.body")}
            </p>
            <p class="mt-2 text-xs leading-relaxed text-[#5A636D]">
              {at("login.setup.env")}
            </p>
            <p class="mt-2 text-xs leading-relaxed text-[#5A636D]">
              {at("login.setup.sql")}
            </p>
          </div>
        {:else}
          <form class="mt-6 space-y-4" onsubmit={submit}>
            <label class="block">
              <span
                class="mb-1 block text-[11px] font-semibold uppercase tracking-widest text-[#5A636D]"
              >
                {at("login.email")}
              </span>
              <input
                type="email"
                autocomplete="username"
                bind:value={email}
                required
                class="w-full border border-[#DED8CB] bg-white px-3 py-2.5 text-sm text-[#1E2328] outline-none transition-colors focus:border-[#0F2B34]"
              />
            </label>

            <label class="block">
              <span
                class="mb-1 block text-[11px] font-semibold uppercase tracking-widest text-[#5A636D]"
              >
                {at("login.password")}
              </span>
              <input
                type="password"
                autocomplete="current-password"
                bind:value={password}
                required
                class="w-full border border-[#DED8CB] bg-white px-3 py-2.5 text-sm text-[#1E2328] outline-none transition-colors focus:border-[#0F2B34]"
              />
            </label>

            {#if localError}
              <p
                role="alert"
                class="border-l-4 border-[#A31D1D] bg-[#FBF9F5] px-3 py-2 text-xs leading-relaxed text-[#7D1212]"
              >
                {localError}
              </p>
            {/if}

            <button
              type="submit"
              disabled={auth.busy}
              class="flex w-full items-center justify-center gap-2 border border-[#0F2B34] bg-[#0F2B34] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1A4553] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LogIn size={16} />
              {auth.busy ? at("login.submitting") : at("login.submit")}
            </button>
          </form>
        {/if}
      </div>
    </div>
  </div>

  <div class="pb-6 text-center">
    <a
      href="#/"
      class="inline-flex items-center gap-2 text-xs text-[#5A636D] transition-colors hover:text-[#0F2B34]"
    >
      <ArrowLeft size={14} />
      {at("login.backToSite")}
    </a>
  </div>
</div>
