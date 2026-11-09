/**
 * THE LAST WILL - Dashboard Interactions & Consistent State Rendering
 */

(function () {
  function initDashboard() {
    if (!window.TLWConfig) return;

    const welcomeHeading = document.getElementById('dashboard-welcome-heading');
    const accountFullname = document.getElementById('account-fullname');
    const accountUsername = document.getElementById('account-username');
    const accountEmail = document.getElementById('account-email');
    const accountEstablished = document.getElementById('account-established');
    const accountTrust = document.getElementById('account-trust');

    const metricTotalWills = document.getElementById('metric-total-wills');
    const metricFinalizedWills = document.getElementById('metric-finalized-wills');
    const metricDraftWills = document.getElementById('metric-draft-wills');
    const metricTotalDocs = document.getElementById('metric-total-docs');
    const metricKeyStatus = document.getElementById('metric-key-status');

    const recentWillsContainer = document.getElementById('recent-wills-container');

    function renderAccountAndMetrics() {
      const account = window.TLWConfig.getAccount();
      const firstName = (account.fullName || 'Eleanor').split(' ')[0];

      if (welcomeHeading) welcomeHeading.textContent = `Welcome Back, ${firstName}`;
      if (accountFullname) accountFullname.textContent = account.fullName;
      if (accountUsername) accountUsername.textContent = account.username;
      if (accountEmail) accountEmail.textContent = account.email;
      if (accountEstablished) accountEstablished.textContent = account.vaultEstablished;
      if (accountTrust) accountTrust.textContent = account.custodianTrust;

      document.querySelectorAll('[data-account-name]').forEach((el) => {
        el.textContent = account.fullName;
      });

      const metrics = window.TLWConfig.getMetrics();
      if (metricTotalWills) metricTotalWills.textContent = String(metrics.totalWills);
      if (metricFinalizedWills) metricFinalizedWills.textContent = `${metrics.sealedCount} Sealed`;
      if (metricDraftWills) metricDraftWills.textContent = `${metrics.inPreparationCount} In Prep`;
      if (metricTotalDocs) metricTotalDocs.textContent = String(metrics.totalDocuments);
      if (metricKeyStatus) {
        metricKeyStatus.textContent = metrics.anyStegoActive ? 'Armed & Secured' : 'Pending Key';
      }
    }

    function renderRecentWills() {
      if (!recentWillsContainer) return;
      const wills = window.TLWConfig.getWills().slice(0, 3);

      if (wills.length === 0) {
        recentWillsContainer.innerHTML = `
          <div class="rounded-xl bg-surface-container-lowest p-space-lg text-center text-on-surface-variant">
            <p class="font-body-md text-body-md mb-3">No wills registered in your vault yet.</p>
            <a href="create-will.html" class="inline-flex items-center gap-2 px-space-lg py-2 rounded-full bg-secondary text-on-secondary font-label-md text-label-md">
              <span class="material-symbols-outlined text-base">add</span>
              <span>Create Your First Will</span>
            </a>
          </div>
        `;
        return;
      }

      const icons = ['hevc', 'auto_stories', 'nature_people'];
      const heirIcons = ['family_restroom', 'person', 'park'];

      recentWillsContainer.innerHTML = wills
        .map((will, idx) => {
          const isDraftOrIncomplete = will.status === 'draft' || will.status === 'incomplete';
          const iconName = icons[idx % icons.length];
          const heirIcon = heirIcons[idx % heirIcons.length];
          const iconColorClass = will.status === 'draft' ? 'text-secondary' : 'text-primary';

          const badgeHtml =
            will.status === 'ready'
              ? `<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-tertiary-container/15 text-tertiary-container font-label-sm text-label-sm">
                  <span class="w-1.5 h-1.5 rounded-full bg-tertiary-container"></span>
                  Secured &amp; Sealed
                </span>`
              : `<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm text-label-sm">
                  <span class="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  ${will.status === 'incomplete' ? 'Incomplete • Key Pending' : 'Draft In Progress'}
                </span>`;

          const actionButtonHtml =
            will.status === 'draft'
              ? `<button data-action="continue" data-will-id="${will.id}" class="px-space-md py-2 rounded-full bg-secondary text-on-secondary font-label-md text-label-md inline-flex items-center gap-1 hover:bg-secondary/90 transition-all cursor-pointer" type="button">
                  <span>Continue Draft</span>
                  <span class="material-symbols-outlined text-base">edit_note</span>
                </button>`
              : `<button data-action="details" data-will-id="${will.id}" class="px-space-md py-2 rounded-full bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md inline-flex items-center gap-1 transition-all cursor-pointer" type="button">
                  <span>View Details</span>
                  <span class="material-symbols-outlined text-base">arrow_outward</span>
                </button>`;

          return `
            <div class="rounded-xl bg-surface-container-lowest p-space-md shadow-sm hover:shadow-md transition-shadow">
              <div class="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
                <div class="flex items-start gap-space-md min-w-0">
                  <div class="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center ${iconColorClass} flex-shrink-0">
                    <span class="material-symbols-outlined text-2xl">${iconName}</span>
                  </div>
                  <div class="min-w-0">
                    <div class="flex items-center gap-2 flex-wrap mb-1">
                      <h3 class="font-title-md text-title-md text-primary truncate">
                        ${will.title}
                      </h3>
                      ${badgeHtml}
                    </div>
                    <div class="flex items-center gap-space-md text-on-surface-variant font-body-sm text-body-sm flex-wrap">
                      <span class="flex items-center gap-1">
                        <span class="material-symbols-outlined text-[16px] text-secondary">${heirIcon}</span>
                        Primary Heir: <strong class="text-on-surface font-medium">${will.heirRoleLabel || will.heirName}</strong>
                      </span>
                      <span>•</span>
                      <span class="flex items-center gap-1">
                        <span class="material-symbols-outlined text-[16px]">calendar_today</span>
                        Created ${will.createdAt}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="flex items-center gap-space-sm flex-shrink-0 self-end md:self-center">
                  ${actionButtonHtml}
                </div>
              </div>
            </div>
          `;
        })
        .join('');

      recentWillsContainer.querySelectorAll('button[data-will-id]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const willId = btn.getAttribute('data-will-id');
          const action = btn.getAttribute('data-action');
          window.TLWConfig.setActiveWillId(willId);
          if (action === 'continue') {
            window.location.href = `create-will.html?will=${encodeURIComponent(willId)}`;
          } else {
            window.location.href = `my-wills.html?will=${encodeURIComponent(willId)}`;
          }
        });
      });
    }

    renderAccountAndMetrics();
    renderRecentWills();

    // Tombol CTA Utama
    const btnBeginNewWill = document.getElementById('btn-begin-new-will');
    if (btnBeginNewWill) {
      btnBeginNewWill.addEventListener('click', () => {
        window.location.href = 'create-will.html';
      });
    }

    const btnConfigureToken = document.getElementById('btn-configure-access-token');
    if (btnConfigureToken) {
      btnConfigureToken.addEventListener('click', () => {
        window.location.href = 'access-key.html';
      });
    }

    const btnRequestGuidance = document.getElementById('btn-request-guidance');
    if (btnRequestGuidance) {
      btnRequestGuidance.addEventListener('click', () => {
        if (window.TLWNav) {
          window.TLWNav.showToast(
            'Permintaan pendampingan kustodian tercatat untuk Adiwijaya & Partners Notary Chamber.',
            'primary'
          );
        }
      });
    }

    // Modal Edit Profile
    const editProfileBtn = document.getElementById('btn-edit-profile');
    const profileModal = document.getElementById('edit-profile-modal');
    const profileContent = document.getElementById('edit-profile-content');
    const closeProfileBtn = document.getElementById('close-profile-modal-btn');
    const cancelProfileBtn = document.getElementById('cancel-profile-btn');
    const profileBackdrop = document.getElementById('edit-profile-backdrop');
    const editProfileForm = document.getElementById('edit-profile-form');
    const inputFullname = document.getElementById('edit-fullname');
    const inputUsername = document.getElementById('edit-username');
    const inputEmail = document.getElementById('edit-email');

    function openProfileModal() {
      const account = window.TLWConfig.getAccount();
      if (inputFullname) inputFullname.value = account.fullName || '';
      if (inputUsername) inputUsername.value = account.username || '';
      if (inputEmail) inputEmail.value = account.email || '';

      profileModal.classList.remove('invisible', 'opacity-0');
      profileModal.classList.add('opacity-100');
      profileModal.setAttribute('aria-hidden', 'false');
      profileContent.classList.remove('scale-95');
      profileContent.classList.add('scale-100');
    }

    function closeProfileModal() {
      profileContent.classList.remove('scale-100');
      profileContent.classList.add('scale-95');
      profileModal.classList.remove('opacity-100');
      profileModal.classList.add('opacity-0');
      profileModal.setAttribute('aria-hidden', 'true');
      setTimeout(() => {
        profileModal.classList.add('invisible');
      }, 200);
    }

    if (editProfileBtn) editProfileBtn.addEventListener('click', openProfileModal);
    if (closeProfileBtn) closeProfileBtn.addEventListener('click', closeProfileModal);
    if (cancelProfileBtn) cancelProfileBtn.addEventListener('click', closeProfileModal);
    if (profileBackdrop) profileBackdrop.addEventListener('click', closeProfileModal);

    if (editProfileForm) {
      editProfileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const fullName = (inputFullname.value || '').trim();
        const username = (inputUsername.value || '').trim();
        const email = (inputEmail.value || '').trim();
        if (!fullName || !email) return;

        window.TLWConfig.updateAccount({
          fullName,
          username: username.startsWith('@') ? username : `@${username}`,
          email
        });
        renderAccountAndMetrics();
        closeProfileModal();
        if (window.TLWNav) {
          window.TLWNav.showToast('Profil akun berhasil diperbarui.', 'primary');
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDashboard);
  } else {
    initDashboard();
  }
})();
