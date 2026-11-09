/**
 * THE LAST WILL - Sign In Page Interactions & Simulated Authentication
 * Catatan: Autentikasi pada tahap ini adalah simulasi frontend.
 * Opsi biometrik/WebAuthn masih berupa UI placeholder sampai backend diimplementasikan.
 */

(function () {
  let isPasswordVisible = false;

  function initSignIn() {
    const errorBanner = document.getElementById('error-banner');
    const errorTitle = document.getElementById('error-banner-title');
    const errorDesc = document.getElementById('error-banner-desc');
    const successBanner = document.getElementById('success-banner');
    const successTitle = document.getElementById('success-banner-title');
    const successDesc = document.getElementById('success-banner-desc');

    const userInput = document.getElementById('identifier-input');
    const pwdInput = document.getElementById('password-input');
    const rememberCheckbox = document.getElementById('remember-checkbox');
    const eyeIcon = document.getElementById('password-eye-icon');
    const togglePasswordBtn = document.getElementById('toggle-password-btn');

    const submitBtn = document.getElementById('submit-btn');
    const submitBtnText = document.getElementById('submit-btn-text');
    const submitBtnIcon = document.getElementById('submit-btn-icon');
    const submitBtnSpinner = document.getElementById('submit-btn-spinner');

    const idContainer = document.getElementById('identifier-container');
    const pwdContainer = document.getElementById('password-container');

    const authForm = document.getElementById('auth-form');
    const biometricBtn = document.getElementById('biometric-login-btn');
    const forgotLink = document.getElementById('forgot-password-link');
    const registerLink = document.getElementById('register-now-link');

    function togglePasswordVisibility() {
      isPasswordVisible = !isPasswordVisible;
      if (isPasswordVisible) {
        pwdInput.type = 'text';
        eyeIcon.textContent = 'visibility_off';
      } else {
        pwdInput.type = 'password';
        eyeIcon.textContent = 'visibility';
      }
    }

    function resetPills() {
      document.querySelectorAll('.state-pill').forEach((pill) => {
        pill.className =
          'state-pill px-3 py-1 rounded-full font-label-sm text-label-sm transition-all duration-200 text-on-surface-variant hover:text-on-surface cursor-pointer';
      });
    }

    function setActivePill(id) {
      resetPills();
      const active = document.getElementById(id);
      if (active) {
        active.className =
          'state-pill px-3 py-1 rounded-full font-label-sm text-label-sm transition-all duration-200 bg-primary text-on-primary shadow-sm cursor-pointer';
      }
    }

    function clearValidationStyles() {
      idContainer.classList.remove('border-error', 'ring-1', 'ring-error');
      pwdContainer.classList.remove('border-error', 'ring-1', 'ring-error');
      idContainer.classList.add('border-transparent');
      pwdContainer.classList.add('border-transparent');
    }

    function setState(state, options) {
      const opts = options || {};
      errorBanner.classList.add('hidden');
      successBanner.classList.add('hidden');
      clearValidationStyles();
      userInput.disabled = false;
      pwdInput.disabled = false;
      submitBtn.disabled = false;
      submitBtnText.textContent = 'Enter Vault';
      submitBtnIcon.classList.remove('hidden');
      submitBtnSpinner.classList.add('hidden');

      if (state === 'empty') {
        setActivePill('pill-empty');
        userInput.value = '';
        pwdInput.value = '';
        pwdInput.type = 'password';
        eyeIcon.textContent = 'visibility';
        isPasswordVisible = false;
      } else if (state === 'peek') {
        setActivePill('pill-peek');
        userInput.value = 'eleanor.vance@heritagevault.org';
        pwdInput.value = 'EverlastingTrust2025*!';
        pwdInput.type = 'text';
        eyeIcon.textContent = 'visibility_off';
        isPasswordVisible = true;
      } else if (state === 'error') {
        setActivePill('pill-error');
        if (!opts.preserveValues) {
          userInput.value = 'eleanor.vance@heritagevault.org';
          pwdInput.value = 'IncorrectSecretKey123';
        }
        pwdInput.type = 'password';
        eyeIcon.textContent = 'visibility';
        isPasswordVisible = false;
        errorTitle.textContent = opts.title || 'Access Denied';
        errorDesc.textContent =
          opts.message || 'Invalid credentials. Please verify your username and password.';
        errorBanner.classList.remove('hidden');

        if (opts.invalidField !== 'password') {
          idContainer.classList.remove('border-transparent');
          idContainer.classList.add('border-error', 'ring-1', 'ring-error');
        }
        if (opts.invalidField !== 'identifier') {
          pwdContainer.classList.remove('border-transparent');
          pwdContainer.classList.add('border-error', 'ring-1', 'ring-error');
        }
      } else if (state === 'loading') {
        setActivePill('pill-loading');
        if (!opts.preserveValues && !userInput.value) {
          userInput.value = 'eleanor.vance@heritagevault.org';
          pwdInput.value = '••••••••••••';
        }
        pwdInput.type = 'password';
        userInput.disabled = true;
        pwdInput.disabled = true;
        submitBtn.disabled = true;
        submitBtnText.textContent = opts.loadingText || 'Authenticating...';
        submitBtnIcon.classList.add('hidden');
        submitBtnSpinner.classList.remove('hidden');
      } else if (state === 'success') {
        setActivePill('pill-success');
        if (!opts.preserveValues && !userInput.value) {
          userInput.value = 'eleanor.vance@heritagevault.org';
          pwdInput.value = 'EverlastingTrust2025*!';
        }
        pwdInput.type = 'password';
        eyeIcon.textContent = 'visibility';
        isPasswordVisible = false;
        successTitle.textContent = opts.title || 'Authentication Successful';
        successDesc.textContent =
          opts.message || 'Authentication Successful! Redirecting to Vault...';
        successBanner.classList.remove('hidden');
      }
    }

    // Ekspos setState secara global untuk kompatibilitas penuh
    window.setState = setState;
    window.togglePasswordVisibility = togglePasswordVisibility;

    if (togglePasswordBtn) {
      togglePasswordBtn.addEventListener('click', togglePasswordVisibility);
    }

    document.querySelectorAll('.state-pill').forEach((pill) => {
      pill.addEventListener('click', () => {
        const targetState = pill.getAttribute('data-state');
        if (targetState) {
          setState(targetState);
        }
      });
    });

    // Validasi form dasar & simulasi login -> redirect ke Dashboard
    if (authForm) {
      authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const identifierVal = (userInput.value || '').trim();
        const passwordVal = pwdInput.value || '';

        if (!identifierVal && !passwordVal) {
          setState('error', {
            preserveValues: true,
            title: 'Required Credentials Missing',
            message: 'Please enter your username/email and password to enter the vault.'
          });
          userInput.focus();
          return;
        }

        if (!identifierVal) {
          setState('error', {
            preserveValues: true,
            invalidField: 'identifier',
            title: 'Username or Email Required',
            message: 'Please enter a valid username or registered email address.'
          });
          userInput.focus();
          return;
        }

        if (!passwordVal || passwordVal.length < 4) {
          setState('error', {
            preserveValues: true,
            invalidField: 'password',
            title: 'Password Required',
            message: 'Please enter your vault password (minimum 4 characters for simulation).'
          });
          pwdInput.focus();
          return;
        }

        setState('loading', { preserveValues: true });

        setTimeout(() => {
          if (window.TLWConfig) {
            window.TLWConfig.setSession(
              identifierVal,
              rememberCheckbox ? rememberCheckbox.checked : true
            );
          }
          setState('success', {
            preserveValues: true,
            title: 'Authentication Successful (Simulated)',
            message: 'Simulated login complete. Redirecting to Dashboard...'
          });
          setTimeout(() => {
            window.location.href = 'dashboard.html';
          }, 800);
        }, 900);
      });
    }

    // Opsi Biometrik: tetap berupa UI placeholder sampai WebAuthn diimplementasikan
    if (biometricBtn) {
      biometricBtn.addEventListener('click', () => {
        if (window.TLWNav) {
          window.TLWNav.showToast(
            'Placeholder UI: Autentikasi perangkat/biometrik (WebAuthn & FIDO2) akan diaktifkan pada tahap integrasi backend. Gunakan form login untuk simulasi.',
            'secondary'
          );
        }
        if (!userInput.value) {
          userInput.value = 'eleanor.vance@heritagevault.org';
          pwdInput.value = 'EverlastingTrust2025*!';
        }
        userInput.focus();
      });
    }

    if (forgotLink) {
      forgotLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (window.TLWNav) {
          window.TLWNav.showToast(
            'Simulasi: Gunakan akun demo eleanor.vance@heritagevault.org atau klik tombol "Show Password" di kanan atas.',
            'secondary'
          );
        }
        setState('peek');
      });
    }

    if (registerLink) {
      registerLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (window.TLWNav) {
          window.TLWNav.showToast(
            'Simulasi: Akun contoh Eleanor Vance telah disiapkan. Klik "Show Password" lalu "Enter Vault" untuk masuk.',
            'secondary'
          );
        }
        setState('peek');
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSignIn);
  } else {
    initSignIn();
  }
})();
