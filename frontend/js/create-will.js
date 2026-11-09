/**
 * THE LAST WILL - Create Will Interactions, Document Upload/Preview & Draft Persistence
 */

(function () {
  function initCreateWill() {
    if (!window.TLWConfig) return;

    const willTitleInput = document.getElementById('will-title');
    const grantorNameInput = document.getElementById('grantor-name');
    const beneficiaryNameInput = document.getElementById('beneficiary-name');
    const beneficiaryEmailInput = document.getElementById('beneficiary-email');
    const beneficiaryRelationSelect = document.getElementById('beneficiary-relation');
    const messageTitleInput = document.getElementById('message-title');
    const personalMessageInput = document.getElementById('personal-message');
    const additionalInstructionsInput = document.getElementById('additional-instructions');
    const legalCheck = document.getElementById('legal-check');

    const charCounter = document.getElementById('char-counter');
    const cryptoBannerHeirName = document.getElementById('crypto-banner-heir-name');
    const attachedDocsBadge = document.getElementById('attached-docs-badge');
    const filesReadyHeading = document.getElementById('files-ready-heading');
    const uploadedFilesList = document.getElementById('uploaded-files-list');
    const fileUploader = document.getElementById('file-uploader');
    const dropZone = document.getElementById('drop-zone');

    const draftBtn = document.getElementById('btn-draft');
    const submitBtn = document.getElementById('btn-submit');
    const statusText = document.getElementById('save-status-text');

    // Preview Modal Elements
    const previewModal = document.getElementById('doc-preview-modal');
    const previewBackdrop = document.getElementById('doc-preview-backdrop');
    const previewContent = document.getElementById('doc-preview-content');
    const previewTitle = document.getElementById('preview-doc-title');
    const previewMeta = document.getElementById('preview-doc-meta');
    const previewBody = document.getElementById('preview-doc-body');
    const closePreviewBtn = document.getElementById('close-preview-btn');

    const MAX_CHARS = 10000;
    let editingWillId = 'wst-1';

    // Default initial documents matching Stitch design
    let attachedDocuments = [
      {
        id: 'doc-1',
        name: 'Family_Land_Title_Deed.pdf',
        size: '3.4 MB',
        ext: 'pdf',
        type: 'application/pdf',
        previewUrl: ''
      },
      {
        id: 'doc-2',
        name: 'Investment_Trust_Declaration.docx',
        size: '840 KB',
        ext: 'docx',
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        previewUrl: ''
      },
      {
        id: 'doc-3',
        name: 'Family_Archive_Portrait_1998.jpg',
        size: '4.1 MB',
        ext: 'jpg',
        type: 'image/jpeg',
        previewUrl: 'assets/images/carrier-orchard-1994.png'
      }
    ];

    // Periksa apakah ada parameter ?will=<id> atau draft tersimpan
    const params = new URLSearchParams(window.location.search);
    const paramWillId = params.get('will');

    if (paramWillId) {
      const targetWill = window.TLWConfig.getWillById(paramWillId);
      if (targetWill) {
        editingWillId = targetWill.id;
        populateFormFromWill(targetWill);
      }
    } else {
      const savedDraft = window.TLWConfig.loadDraft();
      if (savedDraft) {
        editingWillId = savedDraft.id || 'wst-1';
        populateFormFromWill(savedDraft);
        if (savedDraft.savedTimeText && statusText) {
          statusText.textContent = savedDraft.savedTimeText;
        }
      }
    }

    function populateFormFromWill(will) {
      if (willTitleInput && will.title !== undefined) willTitleInput.value = will.title;
      if (grantorNameInput && will.testatorName !== undefined) grantorNameInput.value = will.testatorName;
      if (beneficiaryNameInput && will.heirName !== undefined) beneficiaryNameInput.value = will.heirName;
      if (beneficiaryEmailInput && will.heirEmail !== undefined) beneficiaryEmailInput.value = will.heirEmail;
      if (beneficiaryRelationSelect && will.relationship) beneficiaryRelationSelect.value = will.relationship;
      if (messageTitleInput && will.messageSubject !== undefined) messageTitleInput.value = will.messageSubject;
      if (personalMessageInput && will.messageContent !== undefined) personalMessageInput.value = will.messageContent;
      if (additionalInstructionsInput && will.additionalInstructions !== undefined) {
        additionalInstructionsInput.value = will.additionalInstructions;
      }
      if (Array.isArray(will.documents)) {
        attachedDocuments = will.documents.map((d) => Object.assign({}, d));
      }
    }

    // 1. Penghitung karakter & sinkronisasi nama ahli waris
    function updateCharCounter() {
      if (!personalMessageInput || !charCounter) return;
      const len = personalMessageInput.value.length;
      const formattedLen = len.toLocaleString('en-US');
      const formattedMax = MAX_CHARS.toLocaleString('en-US');
      charCounter.textContent = `${formattedLen} / ${formattedMax} characters`;
      if (len >= MAX_CHARS) {
        charCounter.classList.add('text-error');
      } else {
        charCounter.classList.remove('text-error');
      }
    }

    function updateHeirBanner() {
      if (cryptoBannerHeirName && beneficiaryNameInput) {
        cryptoBannerHeirName.textContent = beneficiaryNameInput.value.trim() || 'Designated Heir';
      }
    }

    if (personalMessageInput) {
      personalMessageInput.addEventListener('input', updateCharCounter);
    }
    if (beneficiaryNameInput) {
      beneficiaryNameInput.addEventListener('input', updateHeirBanner);
    }

    // Toolbar formatting untuk pesan pribadi
    document.querySelectorAll('button[data-format]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (!personalMessageInput) return;
        const format = btn.getAttribute('data-format');
        const start = personalMessageInput.selectionStart || 0;
        const end = personalMessageInput.selectionEnd || 0;
        const selected = personalMessageInput.value.substring(start, end) || 'text';
        let replacement = selected;

        if (format === 'bold') replacement = `**${selected}**`;
        else if (format === 'italic') replacement = `*${selected}*`;
        else if (format === 'quote') replacement = `\n“${selected}”\n`;
        else if (format === 'bullet') replacement = `\n• ${selected}`;
        else if (format === 'number') replacement = `\n1. ${selected}`;

        personalMessageInput.setRangeText(replacement, start, end, 'end');
        personalMessageInput.focus();
        updateCharCounter();
      });
    });

    // 2. Render Daftar Dokumen, Preview, dan Hapus Dokumen
    function getFileVisualConfig(ext) {
      const cleanExt = (ext || '').toLowerCase();
      if (cleanExt === 'pdf') {
        return {
          boxClass: 'bg-secondary-fixed/50 text-secondary',
          icon: 'picture_as_pdf'
        };
      }
      if (cleanExt === 'jpg' || cleanExt === 'jpeg' || cleanExt === 'png') {
        return {
          boxClass: 'bg-surface-container-highest text-on-surface',
          icon: 'image'
        };
      }
      return {
        boxClass: 'bg-primary-fixed/60 text-primary',
        icon: 'description'
      };
    }

    function renderDocuments() {
      const count = attachedDocuments.length;
      if (attachedDocsBadge) {
        attachedDocsBadge.textContent = `${count} Document${count === 1 ? '' : 's'} Attached`;
      }
      if (filesReadyHeading) {
        filesReadyHeading.textContent = `Files Ready to Seal (${count})`;
      }

      if (!uploadedFilesList) return;

      if (count === 0) {
        uploadedFilesList.innerHTML = `
          <div class="p-4 rounded-xl bg-surface-container-low text-center font-body-sm text-body-sm text-on-surface-variant">
            No supporting documents attached yet. Use the upload area above to add PDF, DOCX, JPG, or PNG files.
          </div>
        `;
        return;
      }

      uploadedFilesList.innerHTML = attachedDocuments
        .map((doc) => {
          const cfg = getFileVisualConfig(doc.ext);
          return `
            <div class="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors gap-3">
              <div class="flex items-center gap-3.5 min-w-0">
                <div class="w-10 h-10 rounded-lg ${cfg.boxClass} flex items-center justify-center shrink-0">
                  <span class="material-symbols-outlined text-[22px]">${cfg.icon}</span>
                </div>
                <div class="flex flex-col min-w-0">
                  <span class="font-title-md text-title-md text-primary truncate">${doc.name}</span>
                  <div class="flex items-center gap-2 font-label-sm text-label-sm text-on-surface-variant">
                    <span>${doc.size}</span>
                    <span>•</span>
                    <span class="inline-flex items-center gap-1 text-tertiary-container font-medium">
                      <span class="material-symbols-outlined text-[13px]">verified</span> Ready for Vault Seal
                    </span>
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button data-doc-preview="${doc.id}" class="w-8 h-8 rounded-full hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition-colors cursor-pointer" title="Preview document" type="button">
                  <span class="material-symbols-outlined text-[18px]">visibility</span>
                </button>
                <button data-doc-remove="${doc.id}" class="w-8 h-8 rounded-full hover:bg-secondary-fixed/60 flex items-center justify-center text-secondary transition-colors cursor-pointer" title="Remove file" type="button">
                  <span class="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
            </div>
          `;
        })
        .join('');

      uploadedFilesList.querySelectorAll('button[data-doc-preview]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const docId = btn.getAttribute('data-doc-preview');
          const doc = attachedDocuments.find((d) => d.id === docId);
          if (doc) openDocumentPreview(doc);
        });
      });

      uploadedFilesList.querySelectorAll('button[data-doc-remove]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const docId = btn.getAttribute('data-doc-remove');
          const removed = attachedDocuments.find((d) => d.id === docId);
          attachedDocuments = attachedDocuments.filter((d) => d.id !== docId);
          renderDocuments();
          if (window.TLWNav && removed) {
            window.TLWNav.showToast(`Dokumen "${removed.name}" dihapus dari daftar.`, 'secondary');
          }
        });
      });
    }

    function formatFileSize(bytes) {
      if (bytes < 1024) return `${bytes} B`;
      const kb = bytes / 1024;
      if (kb < 1024) return `${Math.round(kb)} KB`;
      const mb = kb / 1024;
      return `${mb.toFixed(1)} MB`;
    }

    function handleFilesSelected(fileList) {
      if (!fileList || fileList.length === 0) return;
      const allowedExts = ['pdf', 'docx', 'doc', 'jpg', 'jpeg', 'png'];
      const maxBytes = 25 * 1024 * 1024;

      Array.from(fileList).forEach((file) => {
        const parts = file.name.split('.');
        const ext = parts.length > 1 ? parts.pop().toLowerCase() : '';

        if (!allowedExts.includes(ext)) {
          if (window.TLWNav) {
            window.TLWNav.showToast(
              `Format file "${file.name}" tidak didukung. Gunakan PDF, DOCX, JPG, atau PNG.`,
              'error'
            );
          }
          return;
        }

        if (file.size > maxBytes) {
          if (window.TLWNav) {
            window.TLWNav.showToast(`Ukuran file "${file.name}" melebihi batas 25 MB.`, 'error');
          }
          return;
        }

        const docObj = {
          id: 'doc-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
          name: file.name,
          size: formatFileSize(file.size),
          ext,
          type: file.type || '',
          previewUrl: ''
        };

        if (ext === 'jpg' || ext === 'jpeg' || ext === 'png' || ext === 'pdf') {
          docObj.previewUrl = URL.createObjectURL(file);
        }

        attachedDocuments.push(docObj);
      });

      renderDocuments();
      if (window.TLWNav) {
        window.TLWNav.showToast('Dokumen berhasil ditambahkan ke daftar.', 'primary');
      }
    }

    if (fileUploader) {
      fileUploader.addEventListener('change', (e) => {
        handleFilesSelected(e.target.files);
        fileUploader.value = '';
      });
    }

    if (dropZone) {
      dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('ring-2', 'ring-primary');
      });
      dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('ring-2', 'ring-primary');
      });
      dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('ring-2', 'ring-primary');
        if (e.dataTransfer && e.dataTransfer.files) {
          handleFilesSelected(e.dataTransfer.files);
        }
      });
    }

    // 3. Modal Preview Dokumen
    function openDocumentPreview(doc) {
      if (!previewModal || !previewBody) return;
      if (previewTitle) previewTitle.textContent = doc.name;
      if (previewMeta) previewMeta.textContent = `${doc.size} • Format: ${(doc.ext || 'FILE').toUpperCase()}`;

      const ext = (doc.ext || '').toLowerCase();
      if ((ext === 'jpg' || ext === 'jpeg' || ext === 'png') && doc.previewUrl) {
        previewBody.innerHTML = `
          <img src="${doc.previewUrl}" alt="${doc.name}" class="max-h-[60vh] w-auto object-contain rounded-xl shadow-md"/>
        `;
      } else if (ext === 'pdf' && doc.previewUrl) {
        previewBody.innerHTML = `
          <iframe src="${doc.previewUrl}" class="w-full h-[60vh] rounded-xl border border-surface-container-high" title="${doc.name}"></iframe>
        `;
      } else {
        previewBody.innerHTML = `
          <div class="p-8 rounded-2xl bg-surface-container-low text-center max-w-md mx-auto flex flex-col items-center gap-3">
            <div class="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <span class="material-symbols-outlined text-[30px]">description</span>
            </div>
            <h4 class="font-title-md text-title-md text-primary">${doc.name}</h4>
            <p class="font-body-sm text-body-sm text-on-surface-variant">
              File size: <strong>${doc.size}</strong>. Format <strong>${ext.toUpperCase()}</strong> siap dilampirkan pada surat wasiat digital.
            </p>
          </div>
        `;
      }

      previewModal.classList.remove('invisible', 'opacity-0');
      previewModal.classList.add('opacity-100');
      previewModal.setAttribute('aria-hidden', 'false');
      previewContent.classList.remove('scale-95');
      previewContent.classList.add('scale-100');
    }

    function closeDocumentPreview() {
      if (!previewModal) return;
      previewContent.classList.remove('scale-100');
      previewContent.classList.add('scale-95');
      previewModal.classList.remove('opacity-100');
      previewModal.classList.add('opacity-0');
      previewModal.setAttribute('aria-hidden', 'true');
      setTimeout(() => {
        previewModal.classList.add('invisible');
      }, 200);
    }

    if (closePreviewBtn) closePreviewBtn.addEventListener('click', closeDocumentPreview);
    if (previewBackdrop) previewBackdrop.addEventListener('click', closeDocumentPreview);

    // 4. Kumpulkan Data Form & Simpan sebagai Draft / Final
    function getRelationLabel(val) {
      const map = {
        anak: 'Child',
        pasangan: 'Spouse',
        saudara: 'Sibling',
        kerabat: 'Relative',
        sahabat: 'Confidant',
        wali: 'Trustee'
      };
      return map[val] || 'Beneficiary';
    }

    function collectFormWillObject(statusType) {
      const title = (willTitleInput.value || '').trim() || 'Untitled Digital Testament';
      const testatorName = (grantorNameInput.value || '').trim() || 'Eleanor Vance';
      const heirName = (beneficiaryNameInput.value || '').trim() || 'Clara Vance';
      const heirEmail = (beneficiaryEmailInput.value || '').trim() || 'clara.vance@heritagemail.org';
      const relationship = beneficiaryRelationSelect ? beneficiaryRelationSelect.value : 'anak';
      const relShort = getRelationLabel(relationship);
      const existing = window.TLWConfig.getWillById(editingWillId);

      return {
        id: editingWillId,
        code: existing && existing.code ? existing.code : '#WST-8829-JKT',
        title,
        testatorName,
        heirName,
        heirRoleLabel: `${heirName} (${relShort})`,
        heirEmail,
        relationship,
        relationshipLabel: `${relShort} (Primary Beneficiary)`,
        executor: 'Adiwijaya & Partners Notary Chamber',
        status: statusType, // 'draft' or 'incomplete'
        statusBadge: statusType === 'draft' ? 'Initial Draft' : 'Incomplete',
        dashboardBadge: statusType === 'draft' ? 'Draft In Progress' : 'Access Key Pending',
        stegoBadge:
          existing && existing.accessKeyGenerated ? 'Steganography Active' : 'Access Key Pending',
        accessKeyGenerated: existing ? Boolean(existing.accessKeyGenerated) : false,
        carrierImageName: existing ? existing.carrierImageName : '',
        carrierImageResolution: existing ? existing.carrierImageResolution : '—',
        carrierImageSize: existing ? existing.carrierImageSize : '—',
        carrierImageUrl: existing ? existing.carrierImageUrl : '',
        createdAt: existing && existing.createdAt ? existing.createdAt : window.TLWConfig.formatDateToday(),
        updatedAt: window.TLWConfig.formatDateToday(),
        timestamp: Date.now(),
        notaryValidation: statusType === 'draft' ? 'Draft Stage' : 'Pending Access Key',
        contactIdMasked: existing && existing.contactIdMasked ? existing.contactIdMasked : 'ID: 3174**********29',
        messageSubject: (messageTitleInput.value || '').trim(),
        messageContent: personalMessageInput.value || '',
        additionalInstructions: additionalInstructionsInput.value || '',
        documents: attachedDocuments.map((d) => ({
          id: d.id,
          name: d.name,
          size: d.size,
          ext: d.ext,
          type: d.type,
          previewUrl: d.previewUrl && d.previewUrl.startsWith('assets/') ? d.previewUrl : ''
        }))
      };
    }

    // Save as Draft
    if (draftBtn && statusText) {
      draftBtn.addEventListener('click', () => {
        const now = new Date();
        let hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        const timeStr = `Saved manually at ${hours}:${minutes} ${ampm}`;

        draftBtn.disabled = true;
        draftBtn.innerHTML =
          '<span class="material-symbols-outlined text-[18px] animate-spin">refresh</span><span>Saving...</span>';

        const draftData = collectFormWillObject('draft');
        draftData.savedTimeText = timeStr;
        window.TLWConfig.saveDraft(draftData);
        window.TLWConfig.upsertWill(draftData);
        window.TLWConfig.setActiveWillId(draftData.id);

        setTimeout(() => {
          draftBtn.disabled = false;
          draftBtn.innerHTML =
            '<span class="material-symbols-outlined text-[18px]">check</span><span>Saved</span>';
          statusText.textContent = timeStr;

          if (window.TLWNav) {
            window.TLWNav.showToast('Draft surat wasiat berhasil disimpan secara lokal.', 'primary');
          }

          setTimeout(() => {
            draftBtn.innerHTML =
              '<span class="material-symbols-outlined text-[18px]">save</span><span>Save as Draft</span>';
          }, 1800);
        }, 500);
      });
    }

    // Save & Continue -> Validasi & Redirect ke Access Key
    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        const title = (willTitleInput.value || '').trim();
        const heirName = (beneficiaryNameInput.value || '').trim();
        const heirEmail = (beneficiaryEmailInput.value || '').trim();
        const msgSubject = (messageTitleInput.value || '').trim();
        const msgContent = (personalMessageInput.value || '').trim();

        if (!title || !heirName || !heirEmail || !msgSubject || !msgContent) {
          if (window.TLWNav) {
            window.TLWNav.showToast(
              'Mohon lengkapi seluruh kolom bertanda bintang (*) sebelum melanjutkan.',
              'error'
            );
          }
          return;
        }

        if (legalCheck && !legalCheck.checked) {
          if (window.TLWNav) {
            window.TLWNav.showToast(
              'Mohon centang pernyataan deklarasi hukum (Solemn Declaration) terlebih dahulu.',
              'error'
            );
          }
          legalCheck.focus();
          return;
        }

        submitBtn.disabled = true;
        submitBtn.innerHTML =
          '<span class="material-symbols-outlined text-[18px] animate-spin">sync</span><span>Saving Will...</span>';

        const existing = window.TLWConfig.getWillById(editingWillId);
        const nextStatus = existing && existing.accessKeyGenerated ? 'ready' : 'incomplete';
        const willObj = collectFormWillObject(nextStatus);
        if (nextStatus === 'ready') {
          willObj.statusBadge = 'Ready for Handover';
          willObj.dashboardBadge = 'Secured & Sealed';
        }

        window.TLWConfig.upsertWill(willObj);
        window.TLWConfig.saveDraft(willObj);
        window.TLWConfig.setActiveWillId(willObj.id);

        setTimeout(() => {
          window.location.href = 'access-key.html';
        }, 650);
      });
    }

    // Inisialisasi tampilan awal
    updateCharCounter();
    updateHeirBanner();
    renderDocuments();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCreateWill);
  } else {
    initCreateWill();
  }
})();
