<script>
  // Renders a content string that may contain two bits of markup:
  //   a real newline  -> <br />
  //   *highlighted*   -> <span class={highlightClass}>highlighted</span>
  // It renders no wrapper element, so put data-content-key on the parent.
  import { t } from '../stores/content.svelte.js';

  let { key, vars = undefined, highlightClass = '' } = $props();

  function parse(source) {
    const parts = [];
    const lines = source.split('\n');
    lines.forEach((line, index) => {
      if (index > 0) parts.push({ type: 'br' });
      line.split(/(\*[^*]+\*)/).forEach((chunk) => {
        if (!chunk) return;
        if (chunk.length > 2 && chunk.startsWith('*') && chunk.endsWith('*')) {
          parts.push({ type: 'mark', text: chunk.slice(1, -1) });
        } else {
          parts.push({ type: 'text', text: chunk });
        }
      });
    });
    return parts;
  }

  const parts = $derived(parse(t(key, vars)));
</script>

{#each parts as part}{#if part.type === 'br'}<br />{:else if part.type === 'mark'}<span class={highlightClass}>{part.text}</span>{:else}{part.text}{/if}{/each}
