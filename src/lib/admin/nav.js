import {
  BookOpen,
  FileText,
  FolderTree,
  Images,
  LayoutDashboard,
  Mail,
  Newspaper,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-svelte";

// Single source of truth for the admin sidebar and topbar. `labelKey` and
// `descriptionKey` are read by scripts/check-content.mjs as content keys.
export const ADMIN_NAV = [
  {
    id: "dashboard",
    path: "/admin",
    labelKey: "nav.dashboard",
    descriptionKey: "dashboard.subtitle",
    icon: LayoutDashboard,
  },
  {
    id: "content",
    path: "/admin/content",
    labelKey: "nav.content",
    descriptionKey: "content.subtitle",
    icon: FileText,
  },
  {
    id: "articles",
    path: "/admin/articles",
    labelKey: "nav.articles",
    descriptionKey: "placeholder.body",
    icon: Newspaper,
  },
  {
    id: "publications",
    path: "/admin/publications",
    labelKey: "nav.publications",
    descriptionKey: "placeholder.body",
    icon: BookOpen,
  },
  {
    id: "categories",
    path: "/admin/categories",
    labelKey: "nav.categories",
    descriptionKey: "placeholder.body",
    icon: FolderTree,
  },
  {
    id: "media",
    path: "/admin/media",
    labelKey: "nav.media",
    descriptionKey: "placeholder.body",
    icon: Images,
  },
  {
    id: "subscribers",
    path: "/admin/subscribers",
    labelKey: "nav.subscribers",
    descriptionKey: "placeholder.body",
    icon: Users,
  },
  {
    id: "messages",
    path: "/admin/messages",
    labelKey: "nav.messages",
    descriptionKey: "placeholder.body",
    icon: Mail,
  },
  {
    id: "users",
    path: "/admin/users",
    labelKey: "nav.users",
    descriptionKey: "placeholder.body",
    icon: ShieldCheck,
  },
  {
    id: "settings",
    path: "/admin/settings",
    labelKey: "nav.settings",
    descriptionKey: "placeholder.body",
    icon: Settings,
  },
];

export function adminNavItem(section) {
  return ADMIN_NAV.find((item) => item.id === section) ?? ADMIN_NAV[0];
}
