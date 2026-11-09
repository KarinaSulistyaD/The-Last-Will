/**
 * THE LAST WILL - Generate Access Key Page Interactions (Upload, Validation & Preview)
 * Catatan: Pada tahap frontend ini, interaksi difokuskan pada pemilihan gambar (PNG/BMP),
 * validasi format lossless, dan tampilan preview gambar serta metrik teknisnya.
 * Algoritma steganografi LSB sesungguhnya belum diimplementasikan di frontend ini.
 */

(function () {
  function initAccessKey() {
    if (!window.TLWConfig) return;

    const fileInput = document.getElementById('carrier-image-input');
    const dropZone = document.getElementById('carrier-drop-zone');
    const triggerUploadBtn = document.getElementById('btn-trigger-upload');
    const changePhotoBtn = document.getElementById('btn-change-photo');
    const removePhotoBtn = document.getElementById('btn-remove-photo');

    const errorBanner = document.getElementById('carrier-error-banner');
    const errorTitle = document.getElementById('carrier-error-title');
    const errorDesc = document.getElementById('carrier-error-desc');

    const carrierPreviewImg = document.getElementById('carrier-preview-img');
    const sealedPreviewImg = document.getElementById('sealed-preview-img');
    const selectedFilenameEl = document.getElementById('selected-carrier-filename');

    const metricFilename = document.getElementById('metric-filename');
    const metricResolution = document.getElementById('metric-resolution');
    const metricFilesize = document.getElementById('metric-filesize');
    const metricFormat = document.getElementById('metric-format');
    const metricCapacity = document.getElementById('metric-capacity');

    const simLogFilename = document.getElementById('sim-log-filename');
    const simLogResolution = document.getElementById('sim-log-resolution');

    const proceedEmbeddingBtn = document.getElementById('btn-proceed-embedding');
    const completeSimBtn = document.getElementById('btn-complete-simulation');
    const sealKeyMainBtn = document.getElementById('btn-seal-key-main');
    const downloadCarrierBtn = document.getElementById('btn-download-carrier');
    const saveVaultBackupBtn = document.getElementById('btn-save-vault-backup');

    let currentCarrierState = {
      fileName: 'Family_Orchard_Gathering_1994.png',
      resolution: '2400 × 1600 pixels',
      fileSize: '4.8 MB',
      formatLabel: 'PNG 24-bit (Lossless)',
      capacityLabel: '120 KB (Sufficient)',
      previewUrl: 'assets/images/carrier-orchard-1994.png',
      hasUserUploaded: false
    };

    // 1. Sinkronisasi Linked Document dengan wasiat aktif dari TLWConfig
    const activeWillId = window.TLWConfig.getActiveWillId();
    const activeWill = window.TLWConfig.getWillById(activeWillId);
    if (activeWill) {
      const titleEl = document.getElementById('linked-will-title');
      const codeEl = document.getElementById('linked-will-code');
      const testatorEl = document.getElementById('linked-will-testator');
      const heirEl = document.getElementById('linked-will-heir');
      const heirInlineEl = document.getElementById('linked-will-heir-inline');
      const statusEl = document.getElementById('linked-will-status');

      if (titleEl) titleEl.textContent = activeWill.title;
      if (codeEl) codeEl.textContent = `Document ID: ${activeWill.code || '#WST-8829-JKT'}`;
      if (testatorEl) testatorEl.textContent = activeWill.testatorName || 'Eleanor Vance';
      if (heirEl) heirEl.textContent = activeWill.heirRoleLabel || activeWill.heirName;
      if (heirInlineEl) heirInlineEl.textContent = activeWill.heirName || 'Clara Vance';
      if (statusEl) {
        statusEl.textContent =
          activeWill.status === 'ready' ? 'Status: Sealed & Ready' : 'Status: Draft Finalized';
      }
    }

    // 2. Pengaturan Tahap Tampilan (setVaultState)
    function setVaultState(stateIndex) {
      const states = ['state-upload', 'state-selected', 'state-processing', 'state-success'];
      states.forEach((id, idx) => {
        const el = document.getElementById(id);
        const tabBtn = document.getElementById('tab-btn-' + (idx + 1));
        if (el) {
          if (idx === stateIndex) {
            el.classList.remove('hidden');
            el.classList.add('flex');
          } else {
            el.classList.add('hidden');
            el.classList.remove('flex');
          }
        }
        if (tabBtn) {
          if (idx === stateIndex) {
            tabBtn.className =
              'px-space-md py-2 rounded-full font-label-md text-label-md bg-primary text-on-primary shadow-sm transition-all cursor-pointer';
          } else {
            tabBtn.className =
              'px-space-md py-2 rounded-full font-label-md text-label-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all cursor-pointer';
          }
        }
      });

      const step1 = document.getElementById('step-indicator-1');
      const step2 = document.getElementById('step-indicator-2');
      const step3 = document.getElementById('step-indicator-3');

      if (step1 && step2 && step3) {
        if (stateIndex === 0) {
          step1.className =
            'flex items-center gap-space-xs font-label-md text-label-md text-primary font-semibold';
          step2.className =
            'flex items-center gap-space-xs font-label-md text-label-md text-on-surface-variant opacity-60';
          step3.className =
            'flex items-center gap-space-xs font-label-md text-label-md text-on-surface-variant opacity-60';
        } else if (stateIndex === 1 || stateIndex === 2) {
          step1.className =
            'flex items-center gap-space-xs font-label-md text-label-md text-tertiary-container';
          step2.className =
            'flex items-center gap-space-xs font-label-md text-label-md text-primary font-semibold';
          step3.className =
            'flex items-center gap-space-xs font-label-md text-label-md text-on-surface-variant opacity-60';
        } else if (stateIndex === 3) {
          step1.className =
            'flex items-center gap-space-xs font-label-md text-label-md text-tertiary-container';
          step2.className =
            'flex items-center gap-space-xs font-label-md text-label-md text-tertiary-container';
          step3.className =
            'flex items-center gap-space-xs font-label-md text-label-md text-secondary font-semibold';
        }
      }
    }

    window.setVaultState = setVaultState;

    document.querySelectorAll('button[data-stage-btn]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-stage-btn'), 10);
        if (!isNaN(idx)) {
          setVaultState(idx);
        }
      });
    });

    // 3. Validasi & Pembacaan File Gambar (PNG / BMP)
    function showUploadError(title, message) {
      if (errorBanner && errorTitle && errorDesc) {
        errorTitle.textContent = title;
        errorDesc.textContent = message;
        errorBanner.classList.remove('hidden');
        errorBanner.classList.add('flex');
      }
      if (window.TLWNav) {
        window.TLWNav.showToast(message, 'error');
      }
    }

    function clearUploadError() {
      if (errorBanner) {
        errorBanner.classList.add('hidden');
        errorBanner.classList.remove('flex');
      }
    }

    function formatSize(bytes) {
      if (bytes < 1024) return `${bytes} B`;
      const kb = bytes / 1024;
      if (kb < 1024) return `${kb.toFixed(1)} KB`;
      return `${(kb / 1024).toFixed(2)} MB`;
    }

    function updateCarrierUI() {
      if (selectedFilenameEl) selectedFilenameEl.textContent = currentCarrierState.fileName;
      if (metricFilename) metricFilename.textContent = currentCarrierState.fileName;
      if (metricResolution) metricResolution.textContent = currentCarrierState.resolution;
      if (metricFilesize) metricFilesize.textContent = currentCarrierState.fileSize;
      if (metricFormat) metricFormat.textContent = currentCarrierState.formatLabel;
      if (metricCapacity) metricCapacity.textContent = currentCarrierState.capacityLabel;
      if (simLogFilename) simLogFilename.textContent = currentCarrierState.fileName;
      if (simLogResolution) simLogResolution.textContent = currentCarrierState.resolution;

      if (carrierPreviewImg && currentCarrierState.previewUrl) {
        carrierPreviewImg.src = currentCarrierState.previewUrl;
      }
      if (sealedPreviewImg && currentCarrierState.previewUrl) {
        sealedPreviewImg.src = currentCarrierState.previewUrl;
      }
    }

    function handleImageFile(file) {
      if (!file) return;
      clearUploadError();

      const fileName = file.name || '';
      const ext = fileName.includes('.') ? fileName.split('.').pop().toLowerCase() : '';
      const validMime =
        file.type === 'image/png' ||
        file.type === 'image/bmp' ||
        file.type === 'image/x-ms-bmp';
      const validExt = ext === 'png' || ext === 'bmp';

      if (!validMime && !validExt) {
        showUploadError(
          'Unsupported Image Format',
          `File "${fileName}" ditolak. Hanya format lossless PNG (.png) atau BMP (.bmp) yang diizinkan untuk gambar Access Key.`
        );
        return;
      }

      const maxBytes = 25 * 1024 * 1024;
      if (file.size > maxBytes) {
        showUploadError(
          'File Size Exceeds Limit',
          `Ukuran file "${fileName}" melebihi batas maksimal 25 MB.`
        );
        return;
      }

      const objectUrl = URL.createObjectURL(file);
      const img = new Image();
      img.onload = function () {
        const w = img.naturalWidth || 1200;
        const h = img.naturalHeight || 800;
        const estimatedCapacityKb = Math.max(12, Math.round((w * h * 3) / 8 / 1024));

        currentCarrierState = {
          fileName: file.name,
          resolution: `${w} × ${h} pixels`,
          fileSize: formatSize(file.size),
          formatLabel: ext === 'bmp' ? 'BMP 24-bit (Lossless)' : 'PNG 24-bit (Lossless)',
          capacityLabel: `${estimatedCapacityKb} KB (Sufficient)`,
          previewUrl: objectUrl,
          hasUserUploaded: true
        };

        updateCarrierUI();
        setVaultState(1);

        if (window.TLWNav) {
          window.TLWNav.showToast(
            `Gambar "${file.name}" (${w}×${h} px) berhasil dimuat untuk preview.`,
            'primary'
          );
        }
      };
      img.onerror = function () {
        showUploadError(
          'Corrupted Image File',
          'File gambar tidak dapat dibaca. Pastikan file PNG atau BMP valid.'
        );
      };
      img.src = objectUrl;
    }

    // Trigger pemilihan file
    if (triggerUploadBtn && fileInput) {
      triggerUploadBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        fileInput.click();
      });
    }

    if (dropZone && fileInput) {
      dropZone.addEventListener('click', () => {
        fileInput.click();
      });

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
        if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
          handleImageFile(e.dataTransfer.files[0]);
        }
      });
    }

    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          handleImageFile(e.target.files[0]);
        }
        fileInput.value = '';
      });
    }

    if (changePhotoBtn && fileInput) {
      changePhotoBtn.addEventListener('click', () => {
        fileInput.click();
      });
    }

    if (removePhotoBtn) {
      removePhotoBtn.addEventListener('click', () => {
        currentCarrierState = {
          fileName: 'No image selected',
          resolution: '—',
          fileSize: '—',
          formatLabel: 'PNG / BMP (Lossless)',
          capacityLabel: '—',
          previewUrl: 'assets/images/carrier-orchard-1994.png',
          hasUserUploaded: false
        };
        updateCarrierUI();
        setVaultState(0);
        if (window.TLWNav) {
          window.TLWNav.showToast('Gambar pembawa dihapus. Silakan pilih gambar baru.', 'secondary');
        }
      });
    }

    // 4. Tombol Simulasi Tahap Embedding & Penyimpanan Metadata Gambar ke Wasiat Aktif
    function runStagePreviewSimulation() {
      setVaultState(2);
      if (window.TLWNav) {
        window.TLWNav.showToast(
          'Simulasi UI: Menampilkan pratinjau tahap penyisipan. Steganografi LSB sesungguhnya akan dijalankan di backend.',
          'secondary'
        );
      }
    }

    if (proceedEmbeddingBtn) {
      proceedEmbeddingBtn.addEventListener('click', runStagePreviewSimulation);
    }

    if (sealKeyMainBtn) {
      sealKeyMainBtn.addEventListener('click', () => {
        runStagePreviewSimulation();
        setTimeout(() => {
          setVaultState(3);
        }, 1600);
      });
    }

    if (completeSimBtn) {
      completeSimBtn.addEventListener('click', () => {
        setVaultState(3);
      });
    }

    if (downloadCarrierBtn) {
      downloadCarrierBtn.addEventListener('click', () => {
        const a = document.createElement('a');
        a.href = currentCarrierState.previewUrl || 'assets/images/carrier-sealed-valley.png';
        a.download = currentCarrierState.fileName || 'Access_Key_Carrier_Preview.png';
        document.body.appendChild(a);
        a.click();
        a.remove();
        if (window.TLWNav) {
          window.TLWNav.showToast(
            'Mengunduh gambar pembawa (masih berupa gambar asli, belum disisipi payload steganografi).',
            'primary'
          );
        }
      });
    }

    if (saveVaultBackupBtn) {
      saveVaultBackupBtn.addEventListener('click', () => {
        if (activeWill) {
          window.TLWConfig.upsertWill({
            id: activeWill.id,
            status: 'ready',
            statusBadge: 'Ready for Handover',
            dashboardBadge: 'Secured & Sealed',
            stegoBadge: 'Steganography Active',
            accessKeyGenerated: true,
            carrierImageName: currentCarrierState.fileName || 'Family_Orchard_Gathering_1994.png',
            carrierImageResolution: currentCarrierState.resolution,
            carrierImageSize: currentCarrierState.fileSize,
            updatedAt: window.TLWConfig.formatDateToday()
          });
        }
        if (window.TLWNav) {
          window.TLWNav.showToast(
            'Gambar pembawa ditautkan ke wasiat. Mengarahkan ke halaman My Wills...',
            'primary'
          );
        }
        setTimeout(() => {
          window.location.href = 'my-wills.html';
        }, 700);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAccessKey);
  } else {
    initAccessKey();
  }
})();
