<script>
  import { onMount } from "svelte";
  import { at } from "./adminI18n.svelte.js";
  import { adminNavItem } from "./nav.js";
  import { auth, initAuth, signOut } from "./auth.svelte.js";
  import { resetDrafts } from "./drafts.svelte.js";
  import AdminSidebar from "./AdminSidebar.svelte";
  import AdminTopbar from "./AdminTopbar.svelte";
  import Login from "./sections/Login.svelte";
  import Dashboard from "./sections/Dashboard.svelte";
  import Content from "./sections/Content.svelte";
  import Placeholder from "./sections/Placeholder.svelte";

  let { section = null } = $props();

  let drawerOpen = $state(false);
  let editorDirty = $state(false);
  let signingOut = $state(false);
  const current = $derived(adminNavItem(section));

  onMount(initAuth);

  $effect(() => {
    if (auth.user && section === "login") {
      window.location.replace("#/admin");
    }
  });

  $effect(() => {
    const title = auth.user ? at(current.labelKey) : at("login.title");
    document.title = `${title} — ${at("common.brand")}`;
  });

  $effect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  });

  function closeDrawer() {
    drawerOpen = false;
  }

  function canLeave() {
    if (!editorDirty) return true;
    return window.confirm(at("editor.unsavedLeave"));
  }

  async function handleSignOut() {
    if (!canLeave()) return;
    signingOut = true;
    try {
      await signOut();
      resetDrafts();
      editorDirty = false;
      drawerOpen = false;
    } finally {
      signingOut = false;
    }
  }
</script>

<svelte:window
  onkeydown={(event) => {
    if (event.key === "Escape") closeDrawer();
  }}
/>

{#if !auth.ready}
  <div
    class="flex min-h-screen items-center justify-center bg-[#F4F1EA]"
    data-no-translate
  >
    <div class="flex items-center gap-3 text-sm text-[#5A636D]">
      <div
        class="h-6 w-6 animate-spin rounded-full border-2 border-[#0F2B34]/20 border-t-[#0F2B34]"
        role="status"
        aria-label={at("auth.loading")}
      ></div>
      {at("auth.loading")}
    </div>
  </div>
{:else if !auth.user}
  <Login />
{:else}
  <div class="flex min-h-screen bg-[#F4F1EA] text-[#1E2328]" data-no-translate>
    <AdminSidebar
      {current}
      bind:drawerOpen
      user={auth.user}
      onSignOut={handleSignOut}
      {signingOut}
      onNavigate={canLeave}
    />

    <div class="flex min-w-0 flex-1 flex-col">
      <AdminTopbar {current} onMenu={() => (drawerOpen = true)} />

      <main class="flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
        {#if current.id === "dashboard"}
          <Dashboard />
        {:else if current.id === "content"}
          <Content onDirtyChange={(dirty) => (editorDirty = dirty)} />
        {:else}
          <Placeholder item={current} />
        {/if}
      </main>
    </div>
  </div>
{/if}
