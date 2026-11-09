<script>
  import { navigate } from '../stores/router.svelte.js';
</script>

<div class="w-full bg-[#F4F1EA] min-h-[70vh] flex items-center justify-center py-20 px-4">
  <div class="max-w-md w-full bg-white border-2 border-[#0F2B34] p-8 text-center space-y-4 shadow-xl">
    <div class="text-4xl text-[#A31D1D] font-serif font-bold">৪০৪</div>
    <div class="h-1 w-12 bg-[#FDD835] mx-auto"></div>
    <h1 class="font-serif text-2xl font-bold text-[#0F2B34]">পাতাটি খুঁজে পাওয়া যায়নি</h1>
    <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">
      আপনি যে পাতার অনুসন্ধান করছেন তা হয়তো সরানো হয়েছে বা ঠিকানাটি ভুল ছিল।
    </p>
    <div class="pt-4 flex justify-center space-x-3">
      <button
        onclick={() => navigate('/')}
        class="px-5 py-2.5 bg-[#0F2B34] text-white text-xs font-semibold hover:bg-[#1A4553] transition-colors"
      >
        মূল পাতায় ফিরুন
      </button>
      <button
        onclick={() => navigate('/articles')}
        class="px-5 py-2.5 border border-[#0F2B34] text-[#0F2B34] text-xs font-semibold hover:bg-gray-50 transition-colors"
      >
        প্রতিবেদন দেখুন
      </button>
    </div>
  </div>
</div>
