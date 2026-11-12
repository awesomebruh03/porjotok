<script>
  import { onMount } from "svelte";
  import {
    ChevronLeft,
    ChevronRight,
    Pencil,
    Save,
    Search,
    X,
  } from "lucide-svelte";
  import { at, groupLabel } from "../adminI18n.svelte.js";
  import {
    deleteDrafts,
    drafts,
    loadDrafts,
    saveDrafts,
  } from "../drafts.svelte.js";
  import { getBaseContent } from "../../stores/content.svelte.js";

  let { onDirtyChange } = $props();

  const baseContent = getBaseContent();
  const baseEntries = Object.entries(baseContent);
  const groupIds = [
    ...new Set(baseEntries.map(([key]) => key.split(".")[0])),
  ].sort();
  const PAGE_SIZE = 40;

  let query = $state("");
  let group = $state("all");
  let page = $state(1);
  let editingKey = $state(null);
  let edits = $state({});
  let saving = $state(false);
  let status = $state(null);

  function norm(entry) {
    return {
      bn: String(entry?.bn ?? ""),
      en: String(entry?.en ?? ""),
      href: String(entry?.href ?? ""),
      newTab: Boolean(entry?.newTab),
    };
  }

  function sameEntry(a, b) {
    const left = norm(a);
    const right = norm(b);
    return (
      left.bn === right.bn &&
      left.en === right.en &&
      left.href === right.href &&
      left.newTab === right.newTab
    );
  }

  function savedFor(key) {
    return norm({ ...(baseContent[key] ?? {}), ...(drafts.value[key] ?? {}) });
  }

  function mergedFor(key) {
    return norm({
      ...(baseContent[key] ?? {}),
      ...(drafts.value[key] ?? {}),
      ...(edits[key] ?? {}),
    });
  }

  function hasDraft(key) {
    return Boolean(drafts.value[key]);
  }

  function isDirty(key) {
    return Boolean(edits[key]);
  }

  function validate(key, value) {
    if (!value.bn.trim()) return at("editor.validation.bn");

    const href = value.href.trim();
    if (href && !/^(#\/|https?:\/\/|mailto:|tel:)/.test(href)) {
      return at("editor.validation.href");
    }

    const base = baseContent[key] ?? {};
    for (const field of ["bn", "en"]) {
      const source = String(base[field] ?? "");
      for (const match of source.matchAll(/\{(\w+)\}/g)) {
        const token = `{${match[1]}}`;
        if (!String(value[field] ?? "").includes(token)) {
          return at("editor.validation.placeholder", { name: token });
        }
      }
    }

    return "";
  }

  function setEdit(key, next) {
    const copy = { ...edits };
    if (next) copy[key] = next;
    else delete copy[key];
    edits = copy;
  }

  function updateField(key, field, raw) {
    const next = { ...mergedFor(key), [field]: raw };
    if (field === "href" && !String(raw).trim()) next.newTab = false;
    if (field === "newTab" && !next.href.trim()) next.newTab = false;
    if (sameEntry(next, savedFor(key))) setEdit(key, null);
    else setEdit(key, next);
  }

  function revertAll() {
    edits = {};
    status = null;
  }

  async function discardDraft(key) {
    if (!window.confirm(at("editor.resetConfirm"))) return;
    try {
      await deleteDrafts([key]);
      setEdit(key, null);
      status = { type: "ok", text: at("editor.draftDiscarded") };
    } catch (cause) {
      status = {
        type: "error",
        text: `${at("editor.saveFailed")} ${cause?.message ?? cause}`,
      };
    }
  }

  async function save() {
    const keys = Object.keys(edits);
    if (!keys.length) {
      status = { type: "info", text: at("editor.noChanges") };
      return;
    }

    for (const key of keys) {
      const problem = validate(key, mergedFor(key));
      if (problem) {
        editingKey = key;
        status = { type: "error", text: `${key}: ${problem}` };
        return;
      }
    }

    saving = true;
    status = null;
    try {
      await saveDrafts(keys.map((key) => ({ key, ...mergedFor(key) })));
      edits = {};
      status = { type: "ok", text: at("editor.saved") };
    } catch (cause) {
      status = {
        type: "error",
        text: `${at("editor.saveFailed")} ${cause?.message ?? cause}`,
      };
    } finally {
      saving = false;
    }
  }

  const dirtyCount = $derived(Object.keys(edits).length);
  const editValues = $derived(editingKey ? mergedFor(editingKey) : null);
  const validationError = $derived(
    editingKey ? validate(editingKey, mergedFor(editingKey)) : "",
  );

  const filtered = $derived.by(() => {
    const needle = query.trim().toLowerCase();
    return baseEntries.filter(([key]) => {
      if (group !== "all" && !key.startsWith(`${group}.`)) return false;
      if (!needle) return true;
      const value = mergedFor(key);
      return (
        key.toLowerCase().includes(needle) ||
        value.bn.toLowerCase().includes(needle) ||
        value.en.toLowerCase().includes(needle) ||
        value.href.toLowerCase().includes(needle)
      );
    });
  });

  const pages = $derived(Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)));
  const currentPage = $derived(Math.min(page, pages));
  const pageItems = $derived(
    filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
  );

  $effect(() => {
    onDirtyChange?.(dirtyCount > 0);
  });

  $effect(() => {
    if (dirtyCount === 0) return;
    const handler = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  });

  onMount(() => {
    loadDrafts();
  });
</script>

<svelte:window
  onkeydown={(event) => {
    if (event.key === "Escape" && editingKey) editingKey = null;
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
      event.preventDefault();
      save();
    }
  }}
/>

<div class="space-y-4">
  <div class="flex flex-wrap items-end justify-between gap-3">
    <div>
      <h2 class="font-serif text-xl font-bold text-[#0F2B34]">
        {at("content.groups.title")}
      </h2>
      <p class="mt-1 text-sm text-[#5A636D]">{at("content.groups.hint")}</p>
    </div>
    <p class="text-[11px] text-[#5A636D]">{at("editor.previewHint")}</p>
  </div>

  {#if drafts.error}
    <div
      class="flex flex-wrap items-center justify-between gap-3 border-l-4 border-[#A31D1D] bg-[#FBF9F5] px-4 py-3"
    >
      <p class="text-xs leading-relaxed text-[#7D1212]">
        {at("editor.loadFailed")}
        <span class="ml-1 font-mono text-[10px]">{drafts.error}</span>
      </p>
      <button
        type="button"
        onclick={() => loadDrafts({ force: true })}
        class="border border-[#A31D1D] px-3 py-1.5 text-xs font-semibold text-[#A31D1D] transition-colors hover:bg-[#A31D1D] hover:text-white"
      >
        {at("editor.retry")}
      </button>
    </div>
  {/if}

  <div
    class="flex flex-col gap-3 border border-[#DED8CB] bg-white p-4 lg:flex-row lg:items-center"
  >
    <div class="relative min-w-0 flex-1">
      <Search
        size={16}
        class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#7B98A2]"
      />
      <input
        type="search"
        value={query}
        oninput={(event) => {
          query = event.currentTarget.value;
          page = 1;
        }}
        placeholder={at("editor.search")}
        class="w-full border border-[#DED8CB] bg-white py-2.5 pl-9 pr-3 text-sm text-[#1E2328] outline-none transition-colors focus:border-[#0F2B34]"
      />
    </div>

    <label class="flex items-center gap-2 text-xs text-[#5A636D]">
      <span class="shrink-0 font-semibold uppercase tracking-widest">
        {at("editor.group")}
      </span>
      <select
        value={group}
        onchange={(event) => {
          group = event.currentTarget.value;
          page = 1;
        }}
        class="border border-[#DED8CB] bg-white px-2 py-2 text-xs text-[#1E2328] outline-none focus:border-[#0F2B34]"
      >
        <option value="all">{at("editor.allGroups")}</option>
        {#each groupIds as id}
          <option value={id}>{groupLabel(id)}</option>
        {/each}
      </select>
    </label>

    <p class="text-xs text-[#5A636D]">
      {at("editor.count", {
        shown: filtered.length,
        total: baseEntries.length,
      })}
    </p>
  </div>

  {#if dirtyCount > 0}
    <div
      class="flex flex-wrap items-center justify-between gap-3 border-l-4 border-[#FDD835] bg-[#FBF9F5] px-4 py-3"
    >
      <p class="text-xs font-semibold text-[#0F2B34]">
        {at("editor.dirty", { count: dirtyCount })}
      </p>
      <div class="flex items-center gap-2">
        <button
          type="button"
          onclick={revertAll}
          class="border border-[#DED8CB] bg-white px-3 py-1.5 text-xs font-semibold text-[#5A636D] transition-colors hover:border-[#0F2B34] hover:text-[#0F2B34]"
        >
          {at("editor.revert")}
        </button>
        <button
          type="button"
          onclick={save}
          disabled={saving}
          class="inline-flex items-center gap-2 border border-[#0F2B34] bg-[#0F2B34] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#1A4553] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save size={14} />
          {saving ? at("editor.saving") : at("editor.save")}
        </button>
      </div>
    </div>
  {/if}

  {#if status}
    <div
      role="status"
      class="flex items-center justify-between gap-3 border-l-4 px-4 py-3 text-xs {status.type ===
      'error'
        ? 'border-[#A31D1D] bg-[#FBF9F5] text-[#7D1212]'
        : 'border-[#0F2B34] bg-[#FBF9F5] text-[#0F2B34]'}"
    >
      <span class="leading-relaxed">{status.text}</span>
      <button
        type="button"
        onclick={() => (status = null)}
        class="shrink-0 text-[#5A636D] hover:text-[#0F2B34]"
        aria-label={at("editor.close")}
      >
        <X size={14} />
      </button>
    </div>
  {/if}

  <div class="overflow-x-auto border border-[#DED8CB] bg-white">
    <table class="w-full min-w-[900px] border-collapse text-left text-sm">
      <thead
        class="bg-[#FBF9F5] text-[10px] uppercase tracking-widest text-[#5A636D]"
      >
        <tr>
          <th class="px-4 py-3 font-semibold">{at("editor.key")}</th>
          <th class="px-4 py-3 font-semibold">{at("editor.bn")}</th>
          <th class="px-4 py-3 font-semibold">{at("editor.en")}</th>
          <th class="px-4 py-3 font-semibold">{at("editor.href")}</th>
          <th class="px-4 py-3 text-right font-semibold">
            {at("editor.edit")}
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-[#EDE9DE]">
        {#each pageItems as [key]}
          {@const value = mergedFor(key)}
          <tr class="align-top hover:bg-[#FBF9F5]">
            <td
              class="max-w-[260px] px-4 py-3 font-mono text-[11px] leading-relaxed text-[#0F2B34]"
            >
              <span class="line-clamp-2 break-all">{key}</span>
            </td>
            <td class="px-4 py-3 text-[#1E2328]">
              <div class="flex max-w-[360px] flex-col gap-1">
                <span class="line-clamp-2 leading-relaxed">{value.bn}</span>
                <div class="flex flex-wrap gap-1">
                  {#if hasDraft(key)}
                    <span
                      class="w-fit border border-[#DED8CB] bg-[#FBF9F5] px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-widest text-[#A31D1D]"
                    >
                      {at("editor.draft")}
                    </span>
                  {/if}
                  {#if isDirty(key)}
                    <span
                      class="w-fit border border-[#FDD835] bg-[#FDD835]/20 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-widest text-[#0F2B34]"
                    >
                      {at("editor.modified")}
                    </span>
                  {/if}
                </div>
              </div>
            </td>
            <td class="px-4 py-3 text-[#5A636D]">
              <span class="line-clamp-2 max-w-[280px] leading-relaxed">
                {value.en || "—"}
              </span>
            </td>
            <td class="px-4 py-3 font-mono text-[11px] text-[#A31D1D]">
              <span class="line-clamp-2 max-w-[220px] break-all">
                {value.href || "—"}
              </span>
            </td>
            <td class="px-4 py-3 text-right">
              <button
                type="button"
                onclick={() => (editingKey = key)}
                class="inline-flex items-center gap-1.5 border border-[#DED8CB] bg-white px-2.5 py-1.5 text-[11px] font-semibold text-[#0F2B34] transition-colors hover:border-[#0F2B34]"
              >
                <Pencil size={12} />
                {at("editor.edit")}
              </button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  {#if filtered.length === 0}
    <div class="border border-[#DED8CB] bg-white px-5 py-8 text-center">
      <p class="text-sm text-[#5A636D]">{at("editor.empty")}</p>
      <button
        type="button"
        onclick={() => {
          query = "";
          group = "all";
          page = 1;
        }}
        class="mt-3 border border-[#0F2B34] px-3 py-1.5 text-xs font-semibold text-[#0F2B34] transition-colors hover:bg-[#0F2B34] hover:text-white"
      >
        {at("editor.clearFilters")}
      </button>
    </div>
  {/if}

  {#if pages > 1}
    <div class="flex flex-wrap items-center justify-between gap-3">
      <button
        type="button"
        onclick={() => (page = currentPage - 1)}
        disabled={currentPage <= 1}
        class="inline-flex items-center gap-1 border border-[#DED8CB] bg-white px-3 py-1.5 text-xs font-semibold text-[#0F2B34] transition-colors hover:border-[#0F2B34] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft size={14} />
        {at("editor.pagination.prev")}
      </button>
      <p class="text-xs text-[#5A636D]">
        {at("editor.pagination.page", {
          page: currentPage,
          pages,
        })}
      </p>
      <button
        type="button"
        onclick={() => (page = currentPage + 1)}
        disabled={currentPage >= pages}
        class="inline-flex items-center gap-1 border border-[#DED8CB] bg-white px-3 py-1.5 text-xs font-semibold text-[#0F2B34] transition-colors hover:border-[#0F2B34] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {at("editor.pagination.next")}
        <ChevronRight size={14} />
      </button>
    </div>
  {/if}
</div>

{#if editingKey && editValues}
  <div class="fixed inset-0 z-[60]">
    <button
      type="button"
      class="absolute inset-0 bg-black/45 backdrop-blur-[1px]"
      onclick={() => (editingKey = null)}
      aria-label={at("editor.close")}
    ></button>

    <aside
      class="absolute inset-y-0 right-0 flex w-full max-w-lg flex-col bg-white shadow-2xl"
    >
      <div
        class="flex items-center justify-between gap-3 border-b border-[#DED8CB] px-5 py-4"
      >
        <div class="min-w-0">
          <p class="text-[10px] uppercase tracking-widest text-[#5A636D]">
            {at("editor.key")}
          </p>
          <p class="truncate font-mono text-xs text-[#0F2B34]">
            {editingKey}
          </p>
        </div>
        <button
          type="button"
          onclick={() => (editingKey = null)}
          class="flex h-8 w-8 shrink-0 items-center justify-center border border-[#DED8CB] text-[#5A636D] transition-colors hover:border-[#0F2B34] hover:text-[#0F2B34]"
          aria-label={at("editor.close")}
        >
          <X size={16} />
        </button>
      </div>

      <div class="flex-1 space-y-5 overflow-y-auto px-5 py-5">
        <label class="block">
          <span
            class="mb-1 block text-[11px] font-semibold uppercase tracking-widest text-[#5A636D]"
          >
            {at("editor.bn")}
          </span>
          <textarea
            rows="4"
            value={editValues.bn}
            oninput={(event) =>
              updateField(editingKey, "bn", event.currentTarget.value)}
            class="w-full border border-[#DED8CB] bg-white px-3 py-2 text-sm leading-relaxed text-[#1E2328] outline-none transition-colors focus:border-[#0F2B34]"
          ></textarea>
          <span class="mt-1 block text-[11px] text-[#5A636D]">
            {at("editor.placeholderHint")}
          </span>
        </label>

        <label class="block">
          <span
            class="mb-1 block text-[11px] font-semibold uppercase tracking-widest text-[#5A636D]"
          >
            {at("editor.en")}
          </span>
          <textarea
            rows="3"
            value={editValues.en}
            oninput={(event) =>
              updateField(editingKey, "en", event.currentTarget.value)}
            class="w-full border border-[#DED8CB] bg-white px-3 py-2 text-sm leading-relaxed text-[#1E2328] outline-none transition-colors focus:border-[#0F2B34]"
          ></textarea>
        </label>

        <label class="block">
          <span
            class="mb-1 block text-[11px] font-semibold uppercase tracking-widest text-[#5A636D]"
          >
            {at("editor.href")}
          </span>
          <input
            type="text"
            value={editValues.href}
            oninput={(event) =>
              updateField(editingKey, "href", event.currentTarget.value)}
            class="w-full border border-[#DED8CB] bg-white px-3 py-2 font-mono text-xs text-[#1E2328] outline-none transition-colors focus:border-[#0F2B34]"
          />
          <span class="mt-1 block text-[11px] text-[#5A636D]">
            {at("editor.hrefHint")}
          </span>
        </label>

        <label class="flex items-center gap-2 text-xs text-[#1E2328]">
          <input
            type="checkbox"
            checked={editValues.newTab}
            disabled={!editValues.href.trim()}
            onchange={(event) =>
              updateField(editingKey, "newTab", event.currentTarget.checked)}
            class="h-4 w-4 accent-[#0F2B34] disabled:opacity-40"
          />
          <span>{at("editor.newTab")}</span>
        </label>

        {#if validationError}
          <p
            class="border-l-4 border-[#A31D1D] bg-[#FBF9F5] px-3 py-2 text-xs leading-relaxed text-[#7D1212]"
          >
            {validationError}
          </p>
        {/if}

        <div class="border-t border-[#EDE9DE] pt-4">
          <p class="text-[10px] uppercase tracking-widest text-[#5A636D]">
            {at("editor.baseline")}
          </p>
          <p
            class="mt-1 whitespace-pre-wrap text-xs leading-relaxed text-[#5A636D]"
          >
            {baseContent[editingKey]?.bn ?? ""}
          </p>
          {#if hasDraft(editingKey)}
            <p
              class="mt-2 w-fit border border-[#DED8CB] bg-[#FBF9F5] px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-widest text-[#A31D1D]"
            >
              {at("editor.draft")}
            </p>
          {/if}
        </div>
      </div>

      <div
        class="flex flex-wrap items-center gap-2 border-t border-[#DED8CB] px-5 py-4"
      >
        <button
          type="button"
          onclick={save}
          disabled={saving || dirtyCount === 0}
          class="inline-flex items-center gap-2 border border-[#0F2B34] bg-[#0F2B34] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#1A4553] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save size={14} />
          {saving ? at("editor.saving") : at("editor.save")}
        </button>
        {#if isDirty(editingKey)}
          <button
            type="button"
            onclick={() => setEdit(editingKey, null)}
            class="border border-[#DED8CB] bg-white px-3 py-1.5 text-xs font-semibold text-[#5A636D] transition-colors hover:border-[#0F2B34] hover:text-[#0F2B34]"
          >
            {at("editor.revert")}
          </button>
        {/if}
        {#if hasDraft(editingKey)}
          <button
            type="button"
            onclick={() => discardDraft(editingKey)}
            class="ml-auto border border-[#A31D1D] px-3 py-1.5 text-xs font-semibold text-[#A31D1D] transition-colors hover:bg-[#A31D1D] hover:text-white"
          >
            {at("editor.reset")}
          </button>
        {/if}
      </div>
    </aside>
  </div>
{/if}
