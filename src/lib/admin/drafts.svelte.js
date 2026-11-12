// Draft layer for the content editor. Drafts live in Supabase
// (`public.content_drafts`) and are layered over the bundled
// content/site.json baseline. The public site does not read these yet;
// publishing is the next step.
import { supabase, supabaseConfigured } from "../supabaseClient.js";

let rows = $state({});
let loading = $state(false);
let loadError = $state("");
let loaded = $state(false);

export const drafts = {
  get value() {
    return rows;
  },
  get loading() {
    return loading;
  },
  get error() {
    return loadError;
  },
  get loaded() {
    return loaded;
  },
  get configured() {
    return supabaseConfigured;
  },
};

function rowToDraft(row) {
  return {
    bn: row.bn ?? "",
    en: row.en ?? "",
    href: row.href ?? "",
    newTab: Boolean(row.new_tab),
    updatedAt: row.updated_at ?? "",
  };
}

export async function loadDrafts({ force = false } = {}) {
  if (!supabase) {
    loadError = "Supabase is not configured.";
    loaded = true;
    return;
  }
  if (loaded && !force) return;

  loading = true;
  loadError = "";
  try {
    const { data, error } = await supabase
      .from("content_drafts")
      .select("key,bn,en,href,new_tab,updated_at")
      .order("key");

    if (error) {
      loadError = error.message;
      return;
    }

    const next = {};
    for (const row of data ?? []) next[row.key] = rowToDraft(row);
    rows = next;
    loaded = true;
  } catch (cause) {
    loadError = cause?.message ?? String(cause);
  } finally {
    loading = false;
  }
}

export async function saveDrafts(entries) {
  if (!supabase) throw new Error("Supabase is not configured.");

  const payload = entries.map((entry) => ({
    key: entry.key,
    bn: entry.bn ?? "",
    en: entry.en ?? "",
    href: entry.href ? entry.href : null,
    new_tab: Boolean(entry.newTab),
  }));

  const { data, error } = await supabase
    .from("content_drafts")
    .upsert(payload, { onConflict: "key" })
    .select("key,bn,en,href,new_tab,updated_at");

  if (error) throw error;

  const next = { ...rows };
  for (const row of data ?? []) next[row.key] = rowToDraft(row);
  rows = next;
  return data ?? [];
}

export async function deleteDrafts(keys) {
  if (!supabase) throw new Error("Supabase is not configured.");
  if (!keys.length) return;

  const { error } = await supabase
    .from("content_drafts")
    .delete()
    .in("key", keys);

  if (error) throw error;

  const next = { ...rows };
  for (const key of keys) delete next[key];
  rows = next;
}

// Used when the admin signs out so another editor starts from fresh drafts.
export function resetDrafts() {
  rows = {};
  loading = false;
  loadError = "";
  loaded = false;
}
