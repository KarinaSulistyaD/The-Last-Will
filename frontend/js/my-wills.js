/**
 * THE LAST WILL - My Wills Page Interactions (Search, Filter, Sort, Dynamic Detail Drawer & Delete Confirmation)
 */

(function () {
  function initMyWills() {
    if (!window.TLWConfig) return;

    const searchInput = document.getElementById('searchInput');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const totalCountText = document.getElementById('totalCountText');
    const willsContainer = document.getElementById('willsListContainer');
    const emptyState = document.getElementById('emptyStateView');
    const viewActiveBtn = document.getElementById('viewActiveBtn');
    const viewEmptyBtn = document.getElementById('viewEmptyBtn');
    const sortSelect = document.getElementById('sortSelect');

    const btnCreateWill = document.getElementById('btnCreateWill');
    const btnCreateFirstWill = document.getElementById('btnCreateFirstWill');
    const btnLearnProtocol = document.getElementById('btnLearnProtocol');

    // Metrics
    const metricSealedCount = document.getElementById('metric-sealed-count');
    const metricPrepCount = document.getElementById('metric-prep-count');
    const metricPrepSub = document.getElementById('metric-prep-sub');
    const metricHeirsCount = document.getElementById('metric-heirs-count');

    // Detail Drawer
    const detailDrawerModal = document.getElementById('detailDrawerModal');
    const drawerPanel = document.getElementById('drawerPanel');
    const closeDrawerBtn = document.getElementById('closeDrawerBtn');
    const modalBackdrop = document.getElementById('modalBackdrop');

    const drawerStatusBadge = document.getElementById('drawerStatusBadge');
    const drawerTitle = document.getElementById('drawerTitle');
    const drawerCode = document.getElementById('drawerCode');
    const drawerCreated = document.getElementById('drawerCreated');
    const drawerUpdated = document.getElementById('drawerUpdated');
    const drawerNotary = document.getElementById('drawerNotary');
    const drawerHeirName = document.getElementById('drawerHeirName');
    const drawerHeirRelation = document.getElementById('drawerHeirRelation');
    const drawerContactId = document.getElementById('drawerContactId');
    const drawerMessageInfo = document.getElementById('drawerMessageInfo');
    const drawerDocsHeading = document.getElementById('drawerDocsHeading');
    const drawerDocsList = document.getElementById('drawerDocsList');
    const drawerAccessKeyTitle = document.getElementById('drawerAccessKeyTitle');
    const drawerAccessKeyDesc = document.getElementById('drawerAccessKeyDesc');

    const btnDeleteWill = document.getElementById('btnDeleteWill');
    const btnDrawerEditWill = document.getElementById('btnDrawerEditWill');
    const btnDrawerContinueWill = document.getElementById('btnDrawerContinueWill');

    // Delete Modal
    const deleteModal = document.getElementById('deleteModal');
    const deleteModalBackdrop = document.getElementById('deleteModalBackdrop');
    const deleteModalContent = document.getElementById('deleteModalContent');
    const deleteModalDesc = document.getElementById('deleteModalDesc');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

    let currentFilter = 'all';
    let isForceEmptyPreview = false;
    let selectedWillId = null;
    let pendingDeleteWillId = null;

    function updateMetricsStrip() {
      const m = window.TLWConfig.getMetrics();
      if (metricSealedCount) {
        metricSealedCount.textContent = `${m.sealedCount} Document${m.sealedCount === 1 ? '' : 's'}`;
      }
      if (metricPrepCount) {
        metricPrepCount.textContent = `${m.inPreparationCount} Document${m.inPreparationCount === 1 ? '' : 's'}`;
      }
      if (metricPrepSub) {
        metricPrepSub.textContent = `${m.incompleteCount} Awaiting Key, ${m.draftCount} Draft`;
      }
      if (metricHeirsCount) {
        metricHeirsCount.textContent = `${m.uniqueHeirs} Entit${m.uniqueHeirs === 1 ? 'y' : 'ies'}`;
      }
    }

    function buildWillCardHtml(will) {
      let iconWrapClass = 'bg-tertiary-fixed/40 text-tertiary-container';
      let iconName = 'history_edu';
      let statusBadgeHtml = '';
      let stegoBadgeHtml = '';
      let primaryBtnClass =
        'bg-primary text-on-primary hover:bg-primary-container shadow-sm';
      let primaryBtnText = 'View Details';
      let heirIcon = 'face_3';

      if (will.status === 'ready') {
        iconWrapClass = 'bg-tertiary-fixed/40 text-tertiary-container';
        iconName = 'history_edu';
        statusBadgeHtml = `
          <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-tertiary-container/10 text-tertiary-container font-label-sm text-label-sm">
            <span class="w-1.5 h-1.5 rounded-full bg-tertiary-container"></span>
            Ready for Handover
          </span>
        `;
        stegoBadgeHtml = `
          <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">
            <span class="material-symbols-outlined text-[13px] text-tertiary-container">enhanced_encryption</span>
            Steganography Active
          </span>
        `;
      } else if (will.status === 'incomplete') {
        iconWrapClass = 'bg-secondary-fixed/50 text-secondary';
        iconName = 'folder_special';
        heirIcon = 'face_6';
        statusBadgeHtml = `
          <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-container/30 text-on-secondary-container font-label-sm text-label-sm">
            <span class="w-1.5 h-1.5 rounded-full bg-secondary"></span>
            Incomplete
          </span>
        `;
        stegoBadgeHtml = `
          <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
            <span class="material-symbols-outlined text-[13px] text-secondary">vpn_key_off</span>
            Access Key Pending
          </span>
        `;
        primaryBtnClass =
          'bg-secondary-container/40 text-on-secondary-container hover:bg-secondary-container/60 shadow-sm';
        primaryBtnText = 'Continue Preparation';
      } else {
        iconWrapClass = 'bg-surface-container-high text-on-surface-variant';
        iconName = 'draft';
        heirIcon = 'corporate_fare';
        statusBadgeHtml = `
          <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">
            <span class="w-1.5 h-1.5 rounded-full bg-outline"></span>
            Initial Draft
          </span>
        `;
        stegoBadgeHtml = `
          <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
            <span class="material-symbols-outlined text-[13px] text-outline">vpn_key_off</span>
            Access Key Pending
          </span>
        `;
        primaryBtnClass =
          'bg-surface-container text-on-surface hover:bg-surface-container-high';
        primaryBtnText = 'Continue Preparation';
      }

      const docs = Array.isArray(will.documents) ? will.documents : [];
      const docsCount = docs.length;
      const docsSummary =
        docsCount > 0
          ? docs
              .slice(0, 3)
              .map((d) => d.name.split('_')[0])
              .join(', ')
          : 'No attachments yet';

      return `
        <article class="will-card group relative p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all duration-300" data-status="${will.status}" data-will-id="${will.id}">
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
            <div class="flex items-start gap-space-md flex-1 min-w-0">
              <div class="w-12 h-12 rounded-xl ${iconWrapClass} flex items-center justify-center shrink-0 shadow-inner">
                <span class="material-symbols-outlined text-[26px]">${iconName}</span>
              </div>
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-space-xs mb-1">
                  ${statusBadgeHtml}
                  ${stegoBadgeHtml}
                  <span class="font-label-sm text-label-sm text-on-surface-variant/80">${will.code || '#WST-8829-JKT'}</span>
                </div>
                <h2 class="font-headline-sm text-headline-sm text-primary font-serif group-hover:text-secondary transition-colors truncate">
                  ${will.title}
                </h2>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-y-1 gap-x-4 mt-space-sm text-on-surface-variant font-body-sm text-body-sm">
                  <div class="flex items-center gap-1.5 truncate">
                    <span class="material-symbols-outlined text-[16px] text-on-surface-variant/70">${heirIcon}</span>
                    <span class="truncate"><strong class="text-on-surface">${will.relationship === 'wali' ? 'Beneficiary' : 'Heir'}:</strong> ${will.heirRoleLabel || will.heirName}</span>
                  </div>
                  <div class="flex items-center gap-1.5 truncate">
                    <span class="material-symbols-outlined text-[16px] text-on-surface-variant/70">attach_file</span>
                    <span class="truncate"><strong class="text-on-surface">${docsCount} Document${docsCount === 1 ? '' : 's'}:</strong> ${docsSummary}</span>
                  </div>
                  <div class="flex items-center gap-1.5 truncate">
                    <span class="material-symbols-outlined text-[16px] text-on-surface-variant/70">update</span>
                    <span>Updated: ${will.updatedAt || will.createdAt}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-space-sm shrink-0 self-end lg:self-center pt-2 lg:pt-0">
              <button class="btn-detail px-space-md py-2 rounded-full ${primaryBtnClass} font-label-md text-label-md transition-all cursor-pointer" data-will-id="${will.id}" type="button">
                ${primaryBtnText}
              </button>
              <div class="relative group/menu">
                <button class="p-2 rounded-full hover:bg-surface-container text-on-surface-variant transition-colors cursor-pointer" title="More Options" type="button">
                  <span class="material-symbols-outlined text-[20px]">more_vert</span>
                </button>
                <div class="absolute right-0 top-full mt-1 w-44 p-1 rounded-xl bg-surface-container-lowest shadow-lg opacity-0 pointer-events-none group-hover/menu:opacity-100 group-hover/menu:pointer-events-auto transition-all z-20">
                  <button data-menu-action="details" data-will-id="${will.id}" class="w-full text-left px-3 py-1.5 rounded-lg font-body-sm text-body-sm text-on-surface hover:bg-surface-container-low flex items-center gap-2 cursor-pointer" type="button">
                    <span class="material-symbols-outlined text-[16px]">visibility</span> View Details
                  </button>
                  <button data-menu-action="edit" data-will-id="${will.id}" class="w-full text-left px-3 py-1.5 rounded-lg font-body-sm text-body-sm text-on-surface hover:bg-surface-container-low flex items-center gap-2 cursor-pointer" type="button">
                    <span class="material-symbols-outlined text-[16px]">edit</span> Edit Will
                  </button>
                  <button data-menu-action="delete" data-will-id="${will.id}" class="w-full text-left px-3 py-1.5 rounded-lg font-body-sm text-body-sm text-error hover:bg-error-container/40 flex items-center gap-2 cursor-pointer" type="button">
                    <span class="material-symbols-outlined text-[16px]">delete</span> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </article>
      `;
    }

    function renderWillsList() {
      if (!willsContainer) return;
      updateMetricsStrip();

      if (isForceEmptyPreview) {
        willsContainer.style.display = 'none';
        emptyState.classList.remove('hidden');
        totalCountText.textContent = 'SHOWING 0 SECURED WILLS';
        return;
      }

      willsContainer.style.display = 'flex';
      const query = ((searchInput && searchInput.value) || '').toLowerCase().trim();
      const sortOrder = sortSelect ? sortSelect.value : 'newest';

      let wills = window.TLWConfig.getWills().slice();

      // Sort
      wills.sort((a, b) => {
        const ta = a.timestamp || 0;
        const tb = b.timestamp || 0;
        return sortOrder === 'oldest' ? ta - tb : tb - ta;
      });

      // Filter
      const filtered = wills.filter((w) => {
        const matchesStatus = currentFilter === 'all' || w.status === currentFilter;
        const searchable = `${w.title} ${w.heirName} ${w.heirRoleLabel} ${w.code}`.toLowerCase();
        const matchesQuery = !query || searchable.includes(query);
        return matchesStatus && matchesQuery;
      });

      totalCountText.textContent = `SHOWING ${filtered.length} SECURED WILL${filtered.length === 1 ? '' : 'S'}`;

      if (filtered.length === 0) {
        willsContainer.innerHTML = '';
        emptyState.classList.remove('hidden');
      } else {
        emptyState.classList.add('hidden');
        willsContainer.innerHTML = filtered.map(buildWillCardHtml).join('');
      }

      // Bind card events
      willsContainer.querySelectorAll('.btn-detail').forEach((btn) => {
        btn.addEventListener('click', () => {
          const willId = btn.getAttribute('data-will-id');
          openDrawerForWill(willId);
        });
      });

      willsContainer.querySelectorAll('button[data-menu-action]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const action = btn.getAttribute('data-menu-action');
          const willId = btn.getAttribute('data-will-id');
          if (action === 'details') {
            openDrawerForWill(willId);
          } else if (action === 'edit') {
            window.TLWConfig.setActiveWillId(willId);
            window.location.href = `create-will.html?will=${encodeURIComponent(willId)}`;
          } else if (action === 'delete') {
            openDeleteModal(willId);
          }
        });
      });
    }

    // 4. Detail Drawer Dinamis sesuai Wasiat yang Dipilih
    function openDrawerForWill(willId) {
      const will = window.TLWConfig.getWillById(willId);
      if (!will) return;

      selectedWillId = will.id;
      window.TLWConfig.setActiveWillId(will.id);

      if (drawerTitle) drawerTitle.textContent = will.title;
      if (drawerCode) drawerCode.textContent = `Document ID: ${will.code || '#WST-8829-JKT'}`;
      if (drawerCreated) drawerCreated.textContent = will.createdAt || 'Oct 14, 2024';
      if (drawerUpdated) drawerUpdated.textContent = will.updatedAt || will.createdAt || 'Oct 28, 2024';

      if (drawerStatusBadge) {
        if (will.status === 'ready') {
          drawerStatusBadge.className =
            'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-tertiary-container/10 text-tertiary-container font-label-sm text-label-sm mb-1.5';
          drawerStatusBadge.innerHTML =
            '<span class="material-symbols-outlined text-[14px]">lock</span><span>Status: Verified &amp; Sealed</span>';
        } else if (will.status === 'incomplete') {
          drawerStatusBadge.className =
            'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary-container/30 text-on-secondary-container font-label-sm text-label-sm mb-1.5';
          drawerStatusBadge.innerHTML =
            '<span class="material-symbols-outlined text-[14px]">vpn_key_off</span><span>Status: Incomplete • Key Pending</span>';
        } else {
          drawerStatusBadge.className =
            'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm mb-1.5';
          drawerStatusBadge.innerHTML =
            '<span class="material-symbols-outlined text-[14px]">draft</span><span>Status: Initial Draft</span>';
        }
      }

      if (drawerNotary) {
        drawerNotary.innerHTML = `<span class="material-symbols-outlined text-[16px]">verified</span> ${will.notaryValidation || 'Complete'}`;
      }

      if (drawerHeirName) drawerHeirName.textContent = will.heirName;
      if (drawerHeirRelation) drawerHeirRelation.textContent = will.relationshipLabel || will.heirRoleLabel;
      if (drawerContactId) drawerContactId.textContent = will.contactIdMasked || 'ID: 3174**********29';

      const msgLen = (will.messageContent || '').length;
      if (drawerMessageInfo) {
        drawerMessageInfo.textContent = `Subject: "${will.messageSubject || 'Personal Message'}" (${msgLen.toLocaleString('en-US')} characters stored). This message can only be decrypted when the beneficiary presents the corresponding Access Key.`;
      }

      const docs = Array.isArray(will.documents) ? will.documents : [];
      if (drawerDocsHeading) {
        drawerDocsHeading.innerHTML = `
          <span class="material-symbols-outlined text-secondary text-[20px]">inventory_2</span>
          Secured Attachment Files (${docs.length} File${docs.length === 1 ? '' : 's'})
        `;
      }

      if (drawerDocsList) {
        if (docs.length === 0) {
          drawerDocsList.innerHTML = `
            <div class="p-3 rounded-xl bg-surface-container-low text-on-surface-variant font-body-sm text-body-sm">
              No attachment files uploaded for this testament yet.
            </div>
          `;
        } else {
          drawerDocsList.innerHTML = docs
            .map((d) => {
              const isImg = d.ext === 'jpg' || d.ext === 'png';
              const icon = isImg ? 'image' : 'description';
              return `
                <div class="p-3 rounded-xl bg-surface-container-low flex items-center justify-between">
                  <div class="flex items-center gap-3 min-w-0">
                    <span class="material-symbols-outlined text-primary text-[24px] shrink-0">${icon}</span>
                    <div class="min-w-0">
                      <span class="font-body-md text-body-md font-medium text-on-surface block leading-snug truncate">${d.name}</span>
                      <span class="font-body-sm text-body-sm text-on-surface-variant">${d.description || 'Secured Attachment'} • ${d.size}</span>
                    </div>
                  </div>
                  <span class="p-2 rounded-full text-tertiary-container" title="Verified">
                    <span class="material-symbols-outlined text-[18px]">verified</span>
                  </span>
                </div>
              `;
            })
            .join('');
        }
      }

      if (drawerAccessKeyTitle && drawerAccessKeyDesc) {
        if (will.accessKeyGenerated || will.status === 'ready') {
          drawerAccessKeyTitle.textContent = 'Active & Digitally Embedded';
          drawerAccessKeyDesc.innerHTML = `Embedded within carrier image <em>${will.carrierImageName || 'Family_Orchard_Gathering_1994.png'}</em>. No plain-text keys are stored on the server.`;
        } else {
          drawerAccessKeyTitle.textContent = 'Access Key Not Generated Yet';
          drawerAccessKeyDesc.textContent =
            'Select a lossless PNG or BMP photograph on the Generate Access Key page to complete steganographic carrier preparation.';
        }
      }

      detailDrawerModal.classList.remove('invisible', 'opacity-0');
      detailDrawerModal.classList.add('opacity-100');
      drawerPanel.classList.remove('translate-x-full');
    }

    function closeDrawer() {
      drawerPanel.classList.add('translate-x-full');
      detailDrawerModal.classList.remove('opacity-100');
      detailDrawerModal.classList.add('opacity-0');
      setTimeout(() => {
        detailDrawerModal.classList.add('invisible');
      }, 300);
    }

    if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeDrawer);

    if (btnDrawerEditWill) {
      btnDrawerEditWill.addEventListener('click', () => {
        const targetId = selectedWillId || 'wst-1';
        window.TLWConfig.setActiveWillId(targetId);
        window.location.href = `create-will.html?will=${encodeURIComponent(targetId)}`;
      });
    }

    if (btnDrawerContinueWill) {
      btnDrawerContinueWill.addEventListener('click', () => {
        const targetId = selectedWillId || 'wst-1';
        window.TLWConfig.setActiveWillId(targetId);
        window.location.href = 'access-key.html';
      });
    }

    // 5. Modal Konfirmasi Hapus Wasiat
    function openDeleteModal(willId) {
      pendingDeleteWillId = willId || selectedWillId;
      const will = window.TLWConfig.getWillById(pendingDeleteWillId);
      if (deleteModalDesc && will) {
        deleteModalDesc.textContent = `Are you sure you want to permanently delete "${will.title}" (${will.code})? Encrypted files, confidential messages, and heir designations will be removed from your vault.`;
      }
      deleteModal.classList.remove('invisible', 'opacity-0');
      deleteModal.classList.add('opacity-100');
      deleteModalContent.classList.remove('scale-95');
      deleteModalContent.classList.add('scale-100');
    }

    function closeDeleteModal() {
      deleteModalContent.classList.remove('scale-100');
      deleteModalContent.classList.add('scale-95');
      deleteModal.classList.remove('opacity-100');
      deleteModal.classList.add('opacity-0');
      setTimeout(() => {
        deleteModal.classList.add('invisible');
      }, 200);
    }

    if (btnDeleteWill) {
      btnDeleteWill.addEventListener('click', () => {
        openDeleteModal(selectedWillId);
      });
    }
    if (cancelDeleteBtn) cancelDeleteBtn.addEventListener('click', closeDeleteModal);
    if (deleteModalBackdrop) deleteModalBackdrop.addEventListener('click', closeDeleteModal);

    if (confirmDeleteBtn) {
      confirmDeleteBtn.addEventListener('click', () => {
        if (pendingDeleteWillId) {
          window.TLWConfig.deleteWillById(pendingDeleteWillId);
        }
        closeDeleteModal();
        closeDrawer();
        renderWillsList();
        if (window.TLWNav) {
          window.TLWNav.showToast('Surat wasiat berhasil dihapus dari vault.', 'secondary');
        }
      });
    }

    // Filter, Search, Sort & View Toggle Listeners
    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterButtons.forEach((b) => {
          b.classList.remove('bg-primary', 'text-on-primary', 'shadow-sm');
          b.classList.add('text-on-surface-variant');
        });
        btn.classList.add('bg-primary', 'text-on-primary', 'shadow-sm');
        btn.classList.remove('text-on-surface-variant');

        currentFilter = btn.getAttribute('data-filter') || 'all';
        renderWillsList();
      });
    });

    if (searchInput) {
      searchInput.addEventListener('input', renderWillsList);
    }

    if (sortSelect) {
      sortSelect.addEventListener('change', renderWillsList);
    }

    if (viewActiveBtn && viewEmptyBtn) {
      viewActiveBtn.addEventListener('click', () => {
        isForceEmptyPreview = false;
        viewActiveBtn.classList.add('bg-primary-container', 'text-on-primary');
        viewEmptyBtn.classList.remove('bg-primary-container', 'text-on-primary');
        renderWillsList();
      });

      viewEmptyBtn.addEventListener('click', () => {
        isForceEmptyPreview = true;
        viewEmptyBtn.classList.add('bg-primary-container', 'text-on-primary');
        viewActiveBtn.classList.remove('bg-primary-container', 'text-on-primary');
        renderWillsList();
      });
    }

    // Navigasi Create New Will
    if (btnCreateWill) {
      btnCreateWill.addEventListener('click', () => {
        window.location.href = 'create-will.html';
      });
    }
    if (btnCreateFirstWill) {
      btnCreateFirstWill.addEventListener('click', () => {
        window.location.href = 'create-will.html';
      });
    }
    if (btnLearnProtocol) {
      btnLearnProtocol.addEventListener('click', () => {
        window.location.href = 'index.html#keamanan';
      });
    }

    // Render awal
    renderWillsList();

    // Buka drawer otomatis jika ada query param ?will=<id>
    const params = new URLSearchParams(window.location.search);
    const paramWillId = params.get('will');
    if (paramWillId) {
      setTimeout(() => {
        openDrawerForWill(paramWillId);
      }, 150);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMyWills);
  } else {
    initMyWills();
  }
})();
