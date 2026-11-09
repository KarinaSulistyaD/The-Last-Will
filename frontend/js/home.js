/**
 * THE LAST WILL - Home / Landing Page Interactions
 */

(function () {
  function initHome() {
    // 1. Smooth scroll untuk seluruh anchor internal (#cara-kerja, #keamanan, #tentang, #mulai)
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }

        const infoType = this.getAttribute('data-footer-info');
        if (infoType === 'privacy' && window.TLWNav) {
          window.TLWNav.showToast('Zero-Knowledge Privacy: Data hanya dapat diakses oleh Pewaris dan Ahli Waris terverifikasi.', 'secondary');
        } else if (infoType === 'terms' && window.TLWNav) {
          window.TLWNav.showToast('Terms of Trust: Pengelolaan warisan digital mengikuti protokol verifikasi berlapis.', 'secondary');
        }
      });
    });

    // 2. Tombol "View Security Protocol"
    const viewSecurityBtn = document.getElementById('btn-view-security');
    if (viewSecurityBtn) {
      viewSecurityBtn.addEventListener('click', () => {
        const secEl = document.getElementById('keamanan');
        if (secEl) {
          secEl.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHome);
  } else {
    initHome();
  }
})();
