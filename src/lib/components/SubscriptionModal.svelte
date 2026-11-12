<script>
  import {
    subscriptionModal,
    closeSubscriptionModal,
    toast,
  } from "../stores/ui.svelte.js";
  import { t } from "../stores/content.svelte.js";

  let selectedPlan = $state("annual"); // 'annual' | 'single' | 'digital'
  let fullName = $state("");
  let phone = $state("");
  let address = $state("");
  let paymentMethod = $state("bkash");
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
      toast.show(t("modal.subscribe.toast.invalid"), "error");
      return;
    }

    isSubmitting = true;
    setTimeout(() => {
      isSubmitting = false;
      closeModal();
      toast.show(
        t("modal.subscribe.toast.success", { name: fullName }),
        "success",
        5000,
      );
      fullName = "";
      phone = "";
      address = "";
    }, 700);
  }
</script>

{#if subscriptionModal.open}
  <div
    class="backdrop-blur-xs fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4"
  >
    <!-- Modal Card -->
    <div
      class="animate-in fade-in zoom-in-95 relative w-full max-w-lg border-4 border-[#0F2B34] bg-[#F4F1EA] text-[#1E2328] shadow-2xl duration-200"
      role="dialog"
      aria-modal="true"
    >
      <!-- Top Bar with Accent -->
      <div
        class="flex items-center justify-between border-b-2 border-[#FDD835] bg-[#0F2B34] px-6 py-4 text-white"
      >
        <div class="flex items-center space-x-2">
          <span class="inline-block h-3 w-3 bg-[#FDD835]"></span>
          <h3
            data-content-key="modal.subscribe.title"
            class="font-serif text-lg font-bold tracking-wide sm:text-xl"
          >
            {t("modal.subscribe.title")}
          </h3>
        </div>
        <button
          onclick={closeModal}
          class="p-1 text-xl leading-none text-gray-300 hover:text-white"
          aria-label={t("modal.subscribe.close")}
          data-content-key-aria-label="modal.subscribe.close"
        >
          ✕
        </button>
      </div>

      <div class="p-6">
        <p
          data-content-key={subscriptionModal.issueTitle
            ? undefined
            : "modal.subscribe.intro"}
          class="mb-4 text-sm text-[#5A636D]"
        >
          {subscriptionModal.issueTitle || t("modal.subscribe.intro")}
        </p>

        <!-- Plan Selection Tabs -->
        <div class="mb-6 grid grid-cols-3 gap-2">
          <button
            type="button"
            onclick={() => (selectedPlan = "annual")}
            class="border-2 p-2.5 text-center transition-all {selectedPlan ===
            'annual'
              ? 'border-[#0F2B34] bg-white font-semibold shadow-sm'
              : 'border-gray-300 bg-gray-50 text-gray-600'}"
          >
            <div
              data-content-key="modal.subscribe.plan.annual.name"
              class="text-xs font-bold uppercase text-[#A31D1D]"
            >
              {t("modal.subscribe.plan.annual.name")}
            </div>
            <div
              data-content-key="modal.subscribe.plan.annual.price"
              class="mt-0.5 text-base font-bold text-[#0F2B34]"
            >
              {t("modal.subscribe.plan.annual.price")}
            </div>
            <div
              data-content-key="modal.subscribe.plan.annual.desc"
              class="text-[11px] text-gray-500"
            >
              {t("modal.subscribe.plan.annual.desc")}
            </div>
          </button>

          <button
            type="button"
            onclick={() => (selectedPlan = "single")}
            class="border-2 p-2.5 text-center transition-all {selectedPlan ===
            'single'
              ? 'border-[#0F2B34] bg-white font-semibold shadow-sm'
              : 'border-gray-300 bg-gray-50 text-gray-600'}"
          >
            <div
              data-content-key="modal.subscribe.plan.single.name"
              class="text-xs font-bold uppercase text-[#0F2B34]"
            >
              {t("modal.subscribe.plan.single.name")}
            </div>
            <div
              data-content-key="modal.subscribe.plan.single.price"
              class="mt-0.5 text-base font-bold text-[#0F2B34]"
            >
              {t("modal.subscribe.plan.single.price")}
            </div>
            <div
              data-content-key="modal.subscribe.plan.single.desc"
              class="text-[11px] text-gray-500"
            >
              {t("modal.subscribe.plan.single.desc")}
            </div>
          </button>

          <button
            type="button"
            onclick={() => (selectedPlan = "digital")}
            class="border-2 p-2.5 text-center transition-all {selectedPlan ===
            'digital'
              ? 'border-[#0F2B34] bg-white font-semibold shadow-sm'
              : 'border-gray-300 bg-gray-50 text-gray-600'}"
          >
            <div
              data-content-key="modal.subscribe.plan.digital.name"
              class="text-xs font-bold uppercase text-[#0F2B34]"
            >
              {t("modal.subscribe.plan.digital.name")}
            </div>
            <div
              data-content-key="modal.subscribe.plan.digital.price"
              class="mt-0.5 text-base font-bold text-[#0F2B34]"
            >
              {t("modal.subscribe.plan.digital.price")}
            </div>
            <div
              data-content-key="modal.subscribe.plan.digital.desc"
              class="text-[11px] text-gray-500"
            >
              {t("modal.subscribe.plan.digital.desc")}
            </div>
          </button>
        </div>

        <!-- Form -->
        <form onsubmit={handleOrderSubmit} class="space-y-4">
          <div>
            <label
              for="sub-fullname"
              data-content-key="modal.subscribe.form.fullName.label"
              class="mb-1 block text-xs font-semibold text-[#1E2328]"
            >
              {t("modal.subscribe.form.fullName.label")}
              <span class="text-[#A31D1D]">*</span>
            </label>
            <input
              id="sub-fullname"
              type="text"
              bind:value={fullName}
              required
              placeholder={t("modal.subscribe.form.fullName.placeholder")}
              data-content-key-placeholder="modal.subscribe.form.fullName.placeholder"
              class="w-full border border-gray-300 bg-white px-3 py-2 text-sm focus:border-[#0F2B34] focus:outline-none"
            />
          </div>

          <div>
            <label
              for="sub-phone"
              data-content-key="modal.subscribe.form.phone.label"
              class="mb-1 block text-xs font-semibold text-[#1E2328]"
            >
              {t("modal.subscribe.form.phone.label")}
              <span class="text-[#A31D1D]">*</span>
            </label>
            <input
              id="sub-phone"
              type="tel"
              bind:value={phone}
              required
              placeholder={t("modal.subscribe.form.phone.placeholder")}
              data-content-key-placeholder="modal.subscribe.form.phone.placeholder"
              class="w-full border border-gray-300 bg-white px-3 py-2 text-sm focus:border-[#0F2B34] focus:outline-none"
            />
          </div>

          {#if selectedPlan !== "digital"}
            <div>
              <label
                for="sub-address"
                data-content-key="modal.subscribe.form.address.label"
                class="mb-1 block text-xs font-semibold text-[#1E2328]"
              >
                {t("modal.subscribe.form.address.label")}
                <span class="text-[#A31D1D]">*</span>
              </label>
              <textarea
                id="sub-address"
                bind:value={address}
                required
                rows="2"
                placeholder={t("modal.subscribe.form.address.placeholder")}
                data-content-key-placeholder="modal.subscribe.form.address.placeholder"
                class="w-full border border-gray-300 bg-white px-3 py-2 text-sm focus:border-[#0F2B34] focus:outline-none"
              ></textarea>
            </div>
          {:else}
            <div>
              <label
                for="sub-email"
                data-content-key="modal.subscribe.form.email.label"
                class="mb-1 block text-xs font-semibold text-[#1E2328]"
              >
                {t("modal.subscribe.form.email.label")}
                <span class="text-[#A31D1D]">*</span>
              </label>
              <input
                id="sub-email"
                type="email"
                bind:value={address}
                required
                placeholder={t("modal.subscribe.form.email.placeholder")}
                data-content-key-placeholder="modal.subscribe.form.email.placeholder"
                class="w-full border border-gray-300 bg-white px-3 py-2 text-sm focus:border-[#0F2B34] focus:outline-none"
              />
            </div>
          {/if}

          <div>
            <span
              data-content-key="modal.subscribe.payment.label"
              class="mb-1 block text-xs font-semibold text-[#1E2328]"
            >
              {t("modal.subscribe.payment.label")}
            </span>
            <div class="grid grid-cols-3 gap-2 text-xs">
              <label
                class="flex cursor-pointer items-center space-x-1.5 border border-gray-300 bg-white p-2"
              >
                <input
                  type="radio"
                  bind:group={paymentMethod}
                  value="bkash"
                  name="pm"
                />
                <span data-content-key="modal.subscribe.payment.bkash"
                  >{t("modal.subscribe.payment.bkash")}</span
                >
              </label>
              <label
                class="flex cursor-pointer items-center space-x-1.5 border border-gray-300 bg-white p-2"
              >
                <input
                  type="radio"
                  bind:group={paymentMethod}
                  value="nagad"
                  name="pm"
                />
                <span data-content-key="modal.subscribe.payment.nagad"
                  >{t("modal.subscribe.payment.nagad")}</span
                >
              </label>
              <label
                class="flex cursor-pointer items-center space-x-1.5 border border-gray-300 bg-white p-2"
              >
                <input
                  type="radio"
                  bind:group={paymentMethod}
                  value="cod"
                  name="pm"
                />
                <span data-content-key="modal.subscribe.payment.cod"
                  >{t("modal.subscribe.payment.cod")}</span
                >
              </label>
            </div>
          </div>

          <div
            class="mt-6 flex items-center justify-between border-t border-[#E6E1D5] pt-2"
          >
            <button
              type="button"
              onclick={closeModal}
              data-content-key="modal.subscribe.cancel"
              class="px-4 py-2 text-xs font-medium text-gray-600 hover:text-black"
            >
              {t("modal.subscribe.cancel")}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              data-content-key={isSubmitting
                ? "modal.subscribe.submitting"
                : "modal.subscribe.submit"}
              class="bg-[#A31D1D] px-6 py-2.5 text-sm font-semibold tracking-wide text-white shadow-md transition-all hover:bg-[#851414] active:scale-95 disabled:opacity-75"
            >
              {isSubmitting
                ? t("modal.subscribe.submitting")
                : t("modal.subscribe.submit")}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
{/if}
