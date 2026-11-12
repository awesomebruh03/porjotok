import { t } from "./content.svelte.js";

// ---------------------------------------------------------------------------
// Toast
// ---------------------------------------------------------------------------
let toastState = $state(null);
let toastTimeoutId = null;

// Read `toast.current` (null | { message, type }) in components.
export const toast = {
  get current() {
    return toastState;
  },
  show(message, type = "success", duration = 3500) {
    if (toastTimeoutId) clearTimeout(toastTimeoutId);
    toastState = { message, type };
    toastTimeoutId = setTimeout(() => {
      toastState = null;
    }, duration);
  },
  dismiss() {
    if (toastTimeoutId) clearTimeout(toastTimeoutId);
    toastState = null;
  },
};

// ---------------------------------------------------------------------------
// Subscription modal
// ---------------------------------------------------------------------------
// Deeply reactive object: read/write its properties directly.
export const subscriptionModal = $state({
  open: false,
  type: "annual", // 'annual' | 'single' | 'digital'
  issueTitle: "",
  price: 1200,
});

export function openSubscriptionModal({
  type = "annual",
  issueTitle = "",
  price = 1200,
} = {}) {
  subscriptionModal.open = true;
  subscriptionModal.type = type;
  subscriptionModal.issueTitle = issueTitle;
  subscriptionModal.price = price;
}

export function closeSubscriptionModal() {
  subscriptionModal.open = false;
}

// ---------------------------------------------------------------------------
// Bookmarks / saved articles
// ---------------------------------------------------------------------------
const STORAGE_KEY = "porjotok_bookmarks";

const savedInStorage =
  typeof localStorage !== "undefined"
    ? JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
    : [];

// Deeply reactive array of article ids, e.g. `bookmarks.includes(id)`.
export const bookmarks = $state(savedInStorage);

function persistBookmarks() {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify($state.snapshot(bookmarks)),
    );
  }
}

export function toggleBookmark(articleId) {
  const index = bookmarks.indexOf(articleId);
  if (index !== -1) {
    bookmarks.splice(index, 1);
    toast.show(t("toast.bookmark.removed"), "info");
  } else {
    bookmarks.push(articleId);
    toast.show(t("toast.bookmark.added"), "success");
  }
  persistBookmarks();
}
