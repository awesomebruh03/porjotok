<script>
  import { Link2 } from "lucide-svelte";
  import { at, groupLabel } from "../adminI18n.svelte.js";
  import { getBaseContent } from "../../stores/content.svelte.js";

  const entries = Object.entries(getBaseContent());

  const groupMap = new Map();
  for (const [key, entry] of entries) {
    const group = key.split(".")[0];
    const row = groupMap.get(group) ?? { group, keys: 0, links: 0 };
    row.keys += 1;
    if (entry.href) row.links += 1;
    groupMap.set(group, row);
  }
  const groups = [...groupMap.values()].sort((a, b) => b.keys - a.keys);

  const links = entries
    .filter(([, entry]) => entry.href)
    .sort(([a], [b]) => a.localeCompare(b));
</script>

<div class="space-y-8">
  <section class="space-y-3">
    <div>
      <h2 class="font-serif text-xl font-bold text-[#0F2B34]">
        {at("content.groups.title")}
      </h2>
      <p class="mt-1 text-sm text-[#5A636D]">{at("content.groups.hint")}</p>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {#each groups as group}
        <div class="border border-[#DED8CB] bg-white p-5">
          <p class="font-serif text-base font-bold text-[#0F2B34]">
            {groupLabel(group.group)}
          </p>
          <div
            class="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-[#5A636D]"
          >
            <span class="border border-[#DED8CB] bg-[#FBF9F5] px-2 py-0.5">
              {at("content.count.keys", { count: group.keys })}
            </span>
            {#if group.links > 0}
              <span
                class="inline-flex items-center gap-1 border border-[#DED8CB] bg-[#FBF9F5] px-2 py-0.5"
              >
                <Link2 size={11} />
                {at("content.count.links", { count: group.links })}
              </span>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  </section>

  <section class="space-y-3">
    <div>
      <h2 class="font-serif text-xl font-bold text-[#0F2B34]">
        {at("content.links.title")}
      </h2>
      <p class="mt-1 text-sm text-[#5A636D]">{at("content.links.hint")}</p>
    </div>

    {#if links.length === 0}
      <p class="border border-[#DED8CB] bg-white p-5 text-sm text-[#5A636D]">
        {at("content.empty")}
      </p>
    {:else}
      <div class="overflow-x-auto border border-[#DED8CB] bg-white">
        <table class="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead
            class="bg-[#FBF9F5] text-[10px] uppercase tracking-widest text-[#5A636D]"
          >
            <tr>
              <th class="px-4 py-3 font-semibold">
                {at("content.table.key")}
              </th>
              <th class="px-4 py-3 font-semibold">
                {at("content.table.text")}
              </th>
              <th class="px-4 py-3 font-semibold">
                {at("content.table.href")}
              </th>
              <th class="px-4 py-3 font-semibold">
                {at("content.table.newTab")}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#EDE9DE]">
            {#each links as [key, entry]}
              <tr class="align-top hover:bg-[#FBF9F5]">
                <td
                  class="whitespace-nowrap px-4 py-3 font-mono text-[11px] text-[#0F2B34]"
                >
                  {key}
                </td>
                <td class="px-4 py-3 text-[#1E2328]">{entry.bn}</td>
                <td
                  class="whitespace-nowrap px-4 py-3 font-mono text-[11px] text-[#A31D1D]"
                >
                  {entry.href}
                </td>
                <td class="px-4 py-3 text-xs text-[#5A636D]">
                  {#if entry.newTab}
                    <span class="border border-[#DED8CB] px-2 py-0.5">
                      {at("content.table.newTab")}
                    </span>
                  {:else}
                    <span aria-hidden="true">—</span>
                  {/if}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </section>
</div>
