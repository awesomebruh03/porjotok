<script>
  import { at } from "./adminI18n.svelte.js";
  import { adminNavItem } from "./nav.js";
  import AdminSidebar from "./AdminSidebar.svelte";
  import AdminTopbar from "./AdminTopbar.svelte";
  import Dashboard from "./sections/Dashboard.svelte";
  import Content from "./sections/Content.svelte";
  import Placeholder from "./sections/Placeholder.svelte";

  let { section = null } = $props();

  let drawerOpen = $state(false);
  const current = $derived(adminNavItem(section));

  $effect(() => {
    document.title = `${at(current.labelKey)} — ${at("common.brand")}`;
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
</script>

<svelte:window
  onkeydown={(event) => {
    if (event.key === "Escape") closeDrawer();
  }}
/>

<div class="flex min-h-screen bg-[#F4F1EA] text-[#1E2328]" data-no-translate>
  <AdminSidebar {current} bind:drawerOpen />

  <div class="flex min-w-0 flex-1 flex-col">
    <AdminTopbar {current} onMenu={() => (drawerOpen = true)} />

    <main class="flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
      {#if current.id === "dashboard"}
        <Dashboard />
      {:else if current.id === "content"}
        <Content />
      {:else}
        <Placeholder item={current} />
      {/if}
    </main>
  </div>
</div>
