// Admin UI copy lives in content/admin.json, separate from the public site
// copy in content/site.json. Both languages are filled in here because this
// is interface chrome, not public editorial content.
//
//   { "<key>": { "bn": "...", "en": "..." } }
//
// Use at("nav.dashboard") in admin components. The chosen language is stored
// in localStorage and is independent of the public site's translator.
import adminContent from "../../../content/admin.json";

const STORAGE_KEY = "porjotok.admin.lang";

function storedLang() {
  if (typeof window === "undefined") return "bn";
  return window.localStorage.getItem(STORAGE_KEY) === "en" ? "en" : "bn";
}

let lang = $state(storedLang());

export const adminLang = {
  get value() {
    return lang;
  },
};

export function setAdminLang(next) {
  lang = next === "en" ? "en" : "bn";
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, lang);
  }
}

export function toggleAdminLang() {
  setAdminLang(lang === "bn" ? "en" : "bn");
}

export function at(key, vars) {
  const entry = adminContent[key];
  if (!entry) {
    if (import.meta.env.DEV) console.warn(`[admin] missing key "${key}"`);
    return "";
  }
  const text = entry[lang] || entry.bn || "";
  if (!vars) return text;
  return text.replace(/\{(\w+)\}/g, (match, name) =>
    name in vars ? String(vars[name]) : match,
  );
}

// Friendly label for a content group id (home, contact, ...). The literal
// at() calls also tell scripts/check-content.mjs that these keys are used.
export function groupLabel(group) {
  const labels = {
    about: at("groups.about"),
    articleDetail: at("groups.articleDetail"),
    articles: at("groups.articles"),
    categories: at("groups.categories"),
    contact: at("groups.contact"),
    footer: at("groups.footer"),
    header: at("groups.header"),
    home: at("groups.home"),
    meta: at("groups.meta"),
    modal: at("groups.modal"),
    notfound: at("groups.notfound"),
    publicationDetail: at("groups.publicationDetail"),
    publications: at("groups.publications"),
    search: at("groups.search"),
    toast: at("groups.toast"),
  };
  return labels[group] ?? group;
}
