<script>
  import { onMount } from 'svelte';
  import { router } from './lib/stores/router.svelte.js';
  import { initLocale } from './lib/translate/locale.svelte.js';
  import Header from './lib/components/Header.svelte';
  import Footer from './lib/components/Footer.svelte';
  import SubscriptionModal from './lib/components/SubscriptionModal.svelte';
  import Toast from './lib/components/Toast.svelte';

  // Pages
  import Home from './lib/pages/Home.svelte';
  import Publications from './lib/pages/Publications.svelte';
  import PublicationDetail from './lib/pages/PublicationDetail.svelte';
  import Articles from './lib/pages/Articles.svelte';
  import ArticleDetail from './lib/pages/ArticleDetail.svelte';
  import Categories from './lib/pages/Categories.svelte';
  import About from './lib/pages/About.svelte';
  import Contact from './lib/pages/Contact.svelte';
  import Search from './lib/pages/Search.svelte';
  import NotFound from './lib/pages/NotFound.svelte';

  const route = $derived(router.current);

  onMount(() => {
    initLocale();
  });
</script>

<div class="min-h-screen flex flex-col bg-[#F4F1EA] text-[#1E2328]">
  <!-- Global Editorial Header -->
  <Header />

  <!-- Main Routing Area -->
  <main class="flex-1">
    {#if route.name === 'home'}
      <Home />
    {:else if route.name === 'publications'}
      <Publications />
    {:else if route.name === 'publication-detail'}
      <PublicationDetail params={route.params} />
    {:else if route.name === 'articles'}
      <Articles />
    {:else if route.name === 'article-detail'}
      <ArticleDetail params={route.params} />
    {:else if route.name === 'categories' || route.name === 'category-detail'}
      <Categories params={route.params} />
    {:else if route.name === 'about'}
      <About />
    {:else if route.name === 'contact'}
      <Contact />
    {:else if route.name === 'search'}
      <Search />
    {:else}
      <NotFound />
    {/if}
  </main>

  <!-- Global Editorial Footer -->
  <Footer />

  <!-- Global Modals & Notifications -->
  <SubscriptionModal />
  <Toast />
</div>
