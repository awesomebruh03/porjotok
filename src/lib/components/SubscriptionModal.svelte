<script>
  import { subscriptionModal, closeSubscriptionModal, toast } from '../stores/ui.svelte.js';

  let selectedPlan = $state('annual'); // 'annual' | 'single' | 'digital'
  let fullName = $state('');
  let phone = $state('');
  let address = $state('');
  let paymentMethod = $state('bkash');
  let isSubmitting = $state(false);

  // Re-sync the selected plan every time the modal is (re)opened or its type changes
  $effect(() => {
    if (subscriptionModal.open && subscriptionModal.type) {
      selectedPlan = subscriptionModal.type;
    }
  });

  function closeModal() {
    closeSubscriptionModal();
  }

  function handleOrderSubmit(e) {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !address.trim()) {
      toast.show('অনুগ্রহ করে নাম, মোবাইল নম্বর এবং সম্পূর্ণ ঠিকানা প্রদান করুন।', 'error');
      return;
    }

    isSubmitting = true;
    setTimeout(() => {
      isSubmitting = false;
      closeModal();
      toast.show(`ধন্যবাদ ${fullName}! আপনার অর্ডারটি সফলভাবে গৃহীত হয়েছে। শীঘ্রই আমাদের প্রতিনিধি যোগাযোগ করবেন।`, 'success', 5000);
      fullName = '';
      phone = '';
      address = '';
    }, 700);
  }
</script>

{#if subscriptionModal.open}
  <div class="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">

    <!-- Modal Card -->
    <div
      class="bg-[#F4F1EA] text-[#1E2328] w-full max-w-lg border-4 border-[#0F2B34] shadow-2xl relative animate-in fade-in zoom-in-95 duration-200"
      role="dialog"
      aria-modal="true"
    >
      <!-- Top Bar with Accent -->
      <div class="bg-[#0F2B34] text-white px-6 py-4 flex items-center justify-between border-b-2 border-[#FDD835]">
        <div class="flex items-center space-x-2">
          <span class="w-3 h-3 bg-[#FDD835] inline-block"></span>
          <h3 class="font-serif text-lg sm:text-xl font-bold tracking-wide">
            পর্যটক গ্রাহক সেবা ও অর্ডার
          </h3>
        </div>
        <button
          onclick={closeModal}
          class="text-gray-300 hover:text-white text-xl leading-none p-1"
          aria-label="বন্ধ করুন"
        >
          ✕
        </button>
      </div>

      <div class="p-6">
        <p class="text-sm text-[#5A636D] mb-4">
          {subscriptionModal.issueTitle || 'পর্যটক সাময়িকী নিয়মিত ডাকযোগে পেতে সদস্যপদ গ্রহণ করুন।'}
        </p>

        <!-- Plan Selection Tabs -->
        <div class="grid grid-cols-3 gap-2 mb-6">
          <button
            type="button"
            onclick={() => (selectedPlan = 'annual')}
            class="p-2.5 text-center border-2 transition-all {selectedPlan === 'annual' ? 'border-[#0F2B34] bg-white shadow-sm font-semibold' : 'border-gray-300 bg-gray-50 text-gray-600'}"
          >
            <div class="text-xs uppercase text-[#A31D1D] font-bold">বার্ষিক সদস্যপদ</div>
            <div class="text-base font-bold text-[#0F2B34] mt-0.5">৳ ১২০০</div>
            <div class="text-[11px] text-gray-500">৬টি মুদ্রিত সংখ্যা</div>
          </button>

          <button
            type="button"
            onclick={() => (selectedPlan = 'single')}
            class="p-2.5 text-center border-2 transition-all {selectedPlan === 'single' ? 'border-[#0F2B34] bg-white shadow-sm font-semibold' : 'border-gray-300 bg-gray-50 text-gray-600'}"
          >
            <div class="text-xs uppercase text-[#0F2B34] font-bold">মুদ্রিত একক কপি</div>
            <div class="text-base font-bold text-[#0F2B34] mt-0.5">৳ ২২০</div>
            <div class="text-[11px] text-gray-500">চলতি সংখ্যা ৩৮</div>
          </button>

          <button
            type="button"
            onclick={() => (selectedPlan = 'digital')}
            class="p-2.5 text-center border-2 transition-all {selectedPlan === 'digital' ? 'border-[#0F2B34] bg-white shadow-sm font-semibold' : 'border-gray-300 bg-gray-50 text-gray-600'}"
          >
            <div class="text-xs uppercase text-[#0F2B34] font-bold">ডিজিটাল ই-বুক</div>
            <div class="text-base font-bold text-[#0F2B34] mt-0.5">৳ ১০০</div>
            <div class="text-[11px] text-gray-500">উচ্চমানের পিডিএফ</div>
          </button>
        </div>

        <!-- Form -->
        <form onsubmit={handleOrderSubmit} class="space-y-4">
          <div>
            <label for="sub-fullname" class="block text-xs font-semibold text-[#1E2328] mb-1">
              আপনার পুরো নাম <span class="text-[#A31D1D]">*</span>
            </label>
            <input
              id="sub-fullname"
              type="text"
              bind:value={fullName}
              required
              placeholder="যেমন: তানভীর আহমেদ"
              class="w-full bg-white border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#0F2B34]"
            />
          </div>

          <div>
            <label for="sub-phone" class="block text-xs font-semibold text-[#1E2328] mb-1">
              মোবাইল নম্বর <span class="text-[#A31D1D]">*</span>
            </label>
            <input
              id="sub-phone"
              type="tel"
              bind:value={phone}
              required
              placeholder="০১৭xxxxxxxx"
              class="w-full bg-white border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#0F2B34]"
            />
          </div>

          {#if selectedPlan !== 'digital'}
            <div>
              <label for="sub-address" class="block text-xs font-semibold text-[#1E2328] mb-1">
                ডেলিভারি ঠিকানা (ডাকঘর ও জেলাসহ) <span class="text-[#A31D1D]">*</span>
              </label>
              <textarea
                id="sub-address"
                bind:value={address}
                required
                rows="2"
                placeholder="বাসা/গ্রাম, থানা, ডাকঘর, জেলা..."
                class="w-full bg-white border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#0F2B34]"
              ></textarea>
            </div>
          {:else}
            <div>
              <label for="sub-email" class="block text-xs font-semibold text-[#1E2328] mb-1">
                ইমেইল ঠিকানা (যেখানে পিডিএফ পাঠানো হবে) <span class="text-[#A31D1D]">*</span>
              </label>
              <input
                id="sub-email"
                type="email"
                bind:value={address}
                required
                placeholder="reader@example.com"
                class="w-full bg-white border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#0F2B34]"
              />
            </div>
          {/if}

          <div>
            <span class="block text-xs font-semibold text-[#1E2328] mb-1">
              মূল্য পরিশোধের পদ্ধতি
            </span>
            <div class="grid grid-cols-3 gap-2 text-xs">
              <label class="flex items-center space-x-1.5 p-2 bg-white border border-gray-300 cursor-pointer">
                <input type="radio" bind:group={paymentMethod} value="bkash" name="pm" />
                <span>বিকাশ</span>
              </label>
              <label class="flex items-center space-x-1.5 p-2 bg-white border border-gray-300 cursor-pointer">
                <input type="radio" bind:group={paymentMethod} value="nagad" name="pm" />
                <span>নগদ</span>
              </label>
              <label class="flex items-center space-x-1.5 p-2 bg-white border border-gray-300 cursor-pointer">
                <input type="radio" bind:group={paymentMethod} value="cod" name="pm" />
                <span>ক্যাশ অন ডেলিভারি</span>
              </label>
            </div>
          </div>

          <div class="pt-2 flex items-center justify-between border-t border-[#E6E1D5] mt-6">
            <button
              type="button"
              onclick={closeModal}
              class="px-4 py-2 text-xs font-medium text-gray-600 hover:text-black"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              class="px-6 py-2.5 bg-[#A31D1D] hover:bg-[#851414] text-white text-sm font-semibold tracking-wide transition-all shadow-md active:scale-95 disabled:opacity-75"
            >
              {isSubmitting ? 'প্রসেসিং হচ্ছে...' : 'অর্ডার নিশ্চিত করুন'}
            </button>
          </div>
        </form>
      </div>

    </div>

  </div>
{/if}
