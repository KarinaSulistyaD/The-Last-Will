/**
 * THE LAST WILL - Frontend Configuration & Unified Local State Store
 * Catatan: Penyimpanan ini hanya untuk simulasi frontend lokal tahap awal.
 * Bukan mekanisme keamanan atau enkripsi kriptografi yang sebenarnya.
 */

(function () {
  const STORAGE_KEYS = {
    STATE: 'tlw_vault_state_v1',
    SESSION: 'tlw_auth_session_v1',
    ACTIVE_WILL_ID: 'tlw_active_will_id_v1',
    DRAFT_WILL: 'tlw_create_will_draft_v1'
  };

  const ROUTES = {
    'home': 'index.html',
    'beranda': 'index.html',
    'sign-in': 'sign-in.html',
    'login': 'sign-in.html',
    'masuk': 'sign-in.html',
    'dashboard': 'dashboard.html',
    'create-will': 'create-will.html',
    'buat-surat-wasiat': 'create-will.html',
    'access-key': 'access-key.html',
    'my-wills': 'my-wills.html',
    'surat-wasiat-saya': 'my-wills.html'
  };

  const DEFAULT_ACCOUNT = {
    fullName: 'Eleanor Vance',
    username: '@eleanor.vance',
    email: 'eleanor.vance@heritagevault.org',
    roleLabel: 'Legacy Holder',
    vaultEstablished: 'Oct 14, 2024',
    custodianTrust: 'Verified Identity',
    avatarUrl: 'assets/images/eleanor-portrait.jpg'
  };

  const DEFAULT_WILLS = [
    {
      id: 'wst-1',
      code: '#WST-8829-JKT',
      title: 'Family Heritage Testament & 2025 Investment Portfolio',
      testatorName: 'Eleanor Vance',
      heirName: 'Clara Vance',
      heirRoleLabel: 'Clara Vance (Daughter)',
      heirEmail: 'clara.vance@heritagemail.org',
      relationship: 'anak',
      relationshipLabel: 'Daughter (Primary Beneficiary)',
      executor: 'Adiwijaya & Partners Notary Chamber',
      status: 'ready', // 'ready' | 'incomplete' | 'draft'
      statusBadge: 'Ready for Handover',
      dashboardBadge: 'Secured & Sealed',
      stegoBadge: 'Steganography Active',
      accessKeyGenerated: true,
      carrierImageName: 'Family_Orchard_Gathering_1994.png',
      carrierImageResolution: '2400 × 1600 pixels',
      carrierImageSize: '4.8 MB',
      carrierImageUrl: 'assets/images/carrier-orchard-1994.png',
      createdAt: 'Oct 14, 2024',
      updatedAt: 'Oct 28, 2024',
      timestamp: 1730073600000,
      notaryValidation: 'Complete',
      contactIdMasked: 'ID: 3174**********29',
      messageSubject: 'Letter to Clara: Memories, Hopes, and Family Stewardship',
      messageContent:
        'Dearest Clara, when you read this letter, know that my prayers and love have walked beside you in every single step you take in this world. Everything arranged neatly in this digital vault is a reflection of my care and foresight, so that your path ahead may be peaceful and secure. Cherish the quiet simplicity of life, tend to the old roses in our garden terrace, and always remember that true home is found in the kindness you share with others.',
      additionalInstructions:
        'Special instructions for notary supervisor or family safe deposit box: The backup physical key is stored inside the family study desk drawer, and safe deposit box #418 access is granted under Clara Vance’s name at Horizon Trust Bank.',
      documents: [
        {
          id: 'doc-1',
          name: 'Family_Land_Title_Deed.pdf',
          description: 'Certified Title Deed',
          size: '3.4 MB',
          type: 'application/pdf',
          ext: 'pdf'
        },
        {
          id: 'doc-2',
          name: 'Investment_Trust_Declaration.docx',
          description: 'Portfolio Directive',
          size: '840 KB',
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          ext: 'docx'
        },
        {
          id: 'doc-3',
          name: 'Family_Archive_Portrait_1998.jpg',
          description: 'Historical Family Photo',
          size: '4.1 MB',
          type: 'image/jpeg',
          ext: 'jpg',
          previewUrl: 'assets/images/carrier-orchard-1994.png'
        }
      ]
    },
    {
      id: 'wst-2',
      code: '#WST-4412-BDG',
      title: 'Digital Archive, Personal Letters for Arthur & Heirloom Assets',
      testatorName: 'Eleanor Vance',
      heirName: 'Arthur Vance',
      heirRoleLabel: 'Arthur Vance (Son)',
      heirEmail: 'arthur.vance@heritagemail.org',
      relationship: 'anak',
      relationshipLabel: 'Son (Primary Beneficiary)',
      executor: 'Adiwijaya & Partners Notary Chamber',
      status: 'incomplete',
      statusBadge: 'Incomplete',
      dashboardBadge: 'Access Key Pending',
      stegoBadge: 'Access Key Pending',
      accessKeyGenerated: false,
      carrierImageName: '',
      carrierImageResolution: '—',
      carrierImageSize: '—',
      carrierImageUrl: '',
      createdAt: 'Nov 12, 2024',
      updatedAt: 'Nov 12, 2024',
      timestamp: 1731369600000,
      notaryValidation: 'Pending Access Key',
      contactIdMasked: 'ID: 3273**********18',
      messageSubject: 'To Arthur: Stewardship of the Family Library & Keepsakes',
      messageContent:
        'Dear Arthur, within these digital archives are the manuscripts, family correspondence, and heirloom records we often spoke about. May they guide you and remind you of the strength of our family roots.',
      additionalInstructions:
        'Original copyright certificates and physical heirloom watches are stored in Vault Locker #104 at Heritage Custody Chamber.',
      documents: [
        {
          id: 'doc-4',
          name: 'Vance_Digital_Manuscript_Archive.pdf',
          description: 'Digital Archive Compilation',
          size: '5.2 MB',
          type: 'application/pdf',
          ext: 'pdf'
        },
        {
          id: 'doc-5',
          name: 'Heirloom_Copyright_Memorandum.pdf',
          description: 'Copyright Memo',
          size: '1.1 MB',
          type: 'application/pdf',
          ext: 'pdf'
        }
      ]
    },
    {
      id: 'wst-3',
      code: '#WST-0921-SBY',
      title: 'Horizon Wildlife Sanctuary Endowment & Trust',
      testatorName: 'Eleanor Vance',
      heirName: 'Horizon Wildlife Sanctuary Foundation',
      heirRoleLabel: 'Horizon Wildlife Sanctuary Foundation',
      heirEmail: 'trustees@horizonwildlife.org',
      relationship: 'wali',
      relationshipLabel: 'Charitable Foundation / Trustee',
      executor: 'Adiwijaya & Partners Notary Chamber',
      status: 'draft',
      statusBadge: 'Initial Draft',
      dashboardBadge: 'Draft In Progress',
      stegoBadge: 'Access Key Pending',
      accessKeyGenerated: false,
      carrierImageName: '',
      carrierImageResolution: '—',
      carrierImageSize: '—',
      carrierImageUrl: '',
      createdAt: 'Jan 05, 2025',
      updatedAt: 'Jan 08, 2025',
      timestamp: 1736294400000,
      notaryValidation: 'Draft Stage',
      contactIdMasked: 'REG: YYS-2019-9981',
      messageSubject: 'Endowment Directive for Horizon Conservation Lands',
      messageContent:
        'To the Board of Trustees at Horizon Wildlife Sanctuary, this endowment is dedicated to the long-term preservation of the northern valley forest and its native habitats.',
      additionalInstructions:
        'Coordinate execution with Adiwijaya & Partners Notary Chamber upon formal review.',
      documents: []
    }
  ];

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.STATE);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.account && Array.isArray(parsed.wills)) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Gagal memuat state dari localStorage, menggunakan state awal.', err);
    }
    const initial = {
      account: JSON.parse(JSON.stringify(DEFAULT_ACCOUNT)),
      wills: JSON.parse(JSON.stringify(DEFAULT_WILLS))
    };
    saveState(initial);
    return initial;
  }

  function saveState(state) {
    try {
      localStorage.setItem(STORAGE_KEYS.STATE, JSON.stringify(state));
    } catch (err) {
      console.warn('Gagal menyimpan state ke localStorage:', err);
    }
  }

  function resetStateToDefault() {
    const initial = {
      account: JSON.parse(JSON.stringify(DEFAULT_ACCOUNT)),
      wills: JSON.parse(JSON.stringify(DEFAULT_WILLS))
    };
    saveState(initial);
    return initial;
  }

  function getWills() {
    return loadState().wills;
  }

  function getWillById(willId) {
    const wills = getWills();
    return wills.find((w) => w.id === willId) || wills[0] || null;
  }

  function getActiveWillId() {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_WILL_ID) || 'wst-1';
  }

  function setActiveWillId(willId) {
    if (willId) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_WILL_ID, willId);
    }
  }

  function upsertWill(willData) {
    const state = loadState();
    const index = state.wills.findIndex((w) => w.id === willData.id);
    if (index >= 0) {
      state.wills[index] = Object.assign({}, state.wills[index], willData);
    } else {
      state.wills.unshift(willData);
    }
    saveState(state);
    return willData;
  }

  function deleteWillById(willId) {
    const state = loadState();
    state.wills = state.wills.filter((w) => w.id !== willId);
    saveState(state);
    return state.wills;
  }

  function getAccount() {
    return loadState().account;
  }

  function updateAccount(partialAccount) {
    const state = loadState();
    state.account = Object.assign({}, state.account, partialAccount);
    saveState(state);
    return state.account;
  }

  function getSession() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SESSION);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function setSession(identifier, remember) {
    const state = loadState();
    const session = {
      authenticated: true,
      identifier: identifier || state.account.email,
      remember: Boolean(remember),
      loginAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
    return session;
  }

  function clearSession() {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  }

  function saveDraft(draftObj) {
    try {
      localStorage.setItem(STORAGE_KEYS.DRAFT_WILL, JSON.stringify(draftObj));
    } catch (e) {
      console.warn('Gagal menyimpan draft:', e);
    }
  }

  function loadDraft() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.DRAFT_WILL);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function clearDraft() {
    localStorage.removeItem(STORAGE_KEYS.DRAFT_WILL);
  }

  function getMetrics() {
    const wills = getWills();
    const totalWills = wills.length;
    const sealedCount = wills.filter((w) => w.status === 'ready').length;
    const incompleteCount = wills.filter((w) => w.status === 'incomplete').length;
    const draftCount = wills.filter((w) => w.status === 'draft').length;
    const inPreparationCount = incompleteCount + draftCount;
    const totalDocuments = wills.reduce((acc, w) => acc + (Array.isArray(w.documents) ? w.documents.length : 0), 0);
    const uniqueHeirs = new Set(wills.map((w) => (w.heirName || '').trim()).filter(Boolean)).size;
    const anyStegoActive = wills.some((w) => w.accessKeyGenerated || w.status === 'ready');

    return {
      totalWills,
      sealedCount,
      incompleteCount,
      draftCount,
      inPreparationCount,
      totalDocuments,
      uniqueHeirs,
      anyStegoActive
    };
  }

  function formatDateToday() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const m = months[now.getMonth()];
    const d = String(now.getDate()).padStart(2, '0');
    const y = now.getFullYear();
    return `${m} ${d}, ${y}`;
  }

  window.TLWConfig = {
    STORAGE_KEYS,
    ROUTES,
    loadState,
    saveState,
    resetStateToDefault,
    getWills,
    getWillById,
    getActiveWillId,
    setActiveWillId,
    upsertWill,
    deleteWillById,
    getAccount,
    updateAccount,
    getSession,
    setSession,
    clearSession,
    saveDraft,
    loadDraft,
    clearDraft,
    getMetrics,
    formatDateToday
  };
})();
