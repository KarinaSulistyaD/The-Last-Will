/**
 * THE LAST WILL - Unified Navigation, Mobile Menu & Header Sync
 */

(function () {
  function initNavigation() {
    if (!window.TLWConfig) return;

    const routes = window.TLWConfig.ROUTES;

    // 1. Sinkronisasi seluruh tautan dengan atribut data-path
    document.querySelectorAll('a[data-path]').forEach((link) => {
      const pathKey = (link.getAttribute('data-path') || '').trim();
      const currentHref = link.getAttribute('href') || '';

      // Biarkan tautan anchor internal di halaman yang sama (mis. #cara-kerja, #keamanan, #tentang)
      if (currentHref.startsWith('#') && currentHref.length > 1) {
        return;
      }

      if (routes[pathKey]) {
        link.setAttribute('href', routes[pathKey]);
      }

      // Tangani aksi logout simulasi
      if (pathKey === 'login' && link.textContent.toLowerCase().includes('out')) {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          window.TLWConfig.clearSession();
          window.location.href = 'sign-in.html';
        });
      }
    });

    // 2. Sinkronisasi nama akun pada header di halaman internal
    const account = window.TLWConfig.getAccount();
    if (account) {
      document.querySelectorAll('[data-account-name]').forEach((el) => {
        el.textContent = account.fullName;
      });
    }

    // 3. Inisialisasi Mobile Navigation Toggle
    const mobileBtn = document.getElementById('tlw-mobile-menu-btn');
    const mobileMenu = document.getElementById('tlw-mobile-menu');
    const mobileIcon = document.getElementById('tlw-mobile-menu-icon');

    if (mobileBtn && mobileMenu) {
      mobileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isHidden = mobileMenu.getAttribute('aria-hidden') !== 'false';
        mobileMenu.setAttribute('aria-hidden', isHidden ? 'false' : 'true');
        mobileBtn.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
        if (mobileIcon) {
          mobileIcon.textContent = isHidden ? 'close' : 'menu';
        }
      });

      document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !mobileBtn.contains(e.target)) {
          mobileMenu.setAttribute('aria-hidden', 'true');
          mobileBtn.setAttribute('aria-expanded', 'false');
          if (mobileIcon) {
            mobileIcon.textContent = 'menu';
          }
        }
      });

      mobileMenu.querySelectorAll('a').forEach((a) => {
        a.addEventListener('click', () => {
          mobileMenu.setAttribute('aria-hidden', 'true');
          mobileBtn.setAttribute('aria-expanded', 'false');
          if (mobileIcon) {
            mobileIcon.textContent = 'menu';
          }
        });
      });
    }
  }

  function showToast(message, variant) {
    let container = document.getElementById('tlw-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'tlw-toast-container';
      container.className = 'fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const isError = variant === 'error';
    const isSecondary = variant === 'secondary';

    const bgClass = isError
      ? 'bg-error-container text-on-error-container border-error/20'
      : isSecondary
      ? 'bg-secondary text-on-secondary border-secondary/20'
      : 'bg-primary text-on-primary border-primary-container';

    const iconName = isError ? 'error' : isSecondary ? 'info' : 'check_circle';

    toast.className = `pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-[0_12px_32px_-8px_rgba(22,59,61,0.18)] border ${bgClass} transition-all duration-300 opacity-0 translate-y-2`;
    toast.innerHTML = `
      <span class="material-symbols-outlined text-[20px] shrink-0 mt-0.5">${iconName}</span>
      <div class="flex-1 font-body-sm text-body-sm leading-snug">${message}</div>
    `;

    container.appendChild(toast);
    requestAnimationFrame(() => {
      toast.classList.remove('opacity-0', 'translate-y-2');
      toast.classList.add('opacity-100', 'translate-y-0');
    });

    setTimeout(() => {
      toast.classList.remove('opacity-100', 'translate-y-0');
      toast.classList.add('opacity-0', 'translate-y-2');
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  window.TLWNav = {
    initNavigation,
    showToast
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavigation);
  } else {
    initNavigation();
  }
})();
