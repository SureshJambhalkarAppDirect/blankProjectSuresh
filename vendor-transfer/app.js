/**
 * Vendor Transfer - Company Settings
 * Handles vendor selection, Google iframe flow, and transfer-complete state.
 */

const GOOGLE_ADMIN_URL = 'https://admin.google.com';

function byId(id) {
    return document.getElementById(id);
}

function init() {
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const panelDefault = byId('panel-default');
    const panelGoogle = byId('panel-google');
    const emptyMicrosoft = byId('empty-state-microsoft');
    const emptyAdobe = byId('empty-state-adobe');
    const btnStartTransfer = byId('btn-start-transfer');
    const googleIntro = byId('google-transfer-intro');
    const iframeContainer = byId('google-iframe-container');
    const googleIframe = byId('google-admin-iframe');
    const btnCompleteTransfer = byId('btn-complete-transfer');
    const transferComplete = byId('transfer-complete');
    const btnClosePage = byId('btn-close-page');
    const loadingOverlay = byId('iframe-loading-overlay');
    const fallbackBanner = byId('iframe-fallback-banner');

    const LOADING_TIMEOUT_MS = 3500;

    function setActiveSidebarLink(activeEl) {
        sidebarLinks.forEach((link) => link.classList.remove('active'));
        if (activeEl) activeEl.classList.add('active');
    }

    function showPanel(panelId) {
        document.querySelectorAll('.content-panel').forEach((p) => {
            p.classList.remove('content-panel-visible');
            p.style.display = 'none';
        });
        const panel = byId(panelId);
        if (panel) {
            panel.style.display = 'block';
            panel.classList.add('content-panel-visible');
        }
    }

    function showDefaultPanel(vendor) {
        showPanel('panel-default');
        emptyMicrosoft.style.display = vendor === 'microsoft' ? 'flex' : 'none';
        emptyAdobe.style.display = vendor === 'adobe' ? 'flex' : 'none';
        if (vendor !== 'microsoft' && vendor !== 'adobe') {
            emptyMicrosoft.style.display = 'flex';
            emptyMicrosoft.querySelector('.empty-state-text').textContent = 'Select a vendor from the list';
        }
    }

    function showGooglePanel(resetState) {
        showPanel('panel-google');
        if (resetState) {
            googleIntro.style.display = 'block';
            iframeContainer.style.display = 'none';
            transferComplete.style.display = 'none';
            googleIframe.src = 'about:blank';
            if (loadingOverlay) loadingOverlay.classList.remove('hidden');
            if (fallbackBanner) fallbackBanner.style.display = 'none';
        }
    }

    function hideLoadingShowFallback() {
        if (loadingOverlay) loadingOverlay.classList.add('hidden');
        if (fallbackBanner) fallbackBanner.style.display = 'flex';
    }

    // Sidebar: company settings and vendor links
    sidebarLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            setActiveSidebarLink(link);

            const panel = link.getAttribute('data-panel');
            const vendor = link.getAttribute('data-vendor');

            if (panel) {
                showDefaultPanel(null);
                return;
            }
            if (vendor === 'google') {
                showGooglePanel(true);
                return;
            }
            if (vendor === 'adobe' || vendor === 'microsoft') {
                showDefaultPanel(vendor);
            }
        });
    });

    // Transfer button: show iframe, loading overlay, then load Google Admin
    btnStartTransfer.addEventListener('click', () => {
        googleIntro.style.display = 'none';
        iframeContainer.style.display = 'flex';
        if (loadingOverlay) loadingOverlay.classList.remove('hidden');
        if (fallbackBanner) fallbackBanner.style.display = 'none';

        let loadingDone = false;
        function finishLoading() {
            if (loadingDone) return;
            loadingDone = true;
            hideLoadingShowFallback();
        }

        const loadingTimeout = setTimeout(finishLoading, LOADING_TIMEOUT_MS);
        googleIframe.onload = () => {
            clearTimeout(loadingTimeout);
            finishLoading();
        };

        googleIframe.src = GOOGLE_ADMIN_URL;
    });

    // Open Google Admin in new tab (fallback when iframe is blocked)
    byId('link-open-new-tab').addEventListener('click', (e) => {
        e.preventDefault();
        window.open(GOOGLE_ADMIN_URL, '_blank', 'noopener,noreferrer');
    });

    // User confirms transfer is complete
    btnCompleteTransfer.addEventListener('click', () => {
        iframeContainer.style.display = 'none';
        transferComplete.style.display = 'block';
        googleIframe.src = 'about:blank';
    });

    // Close this page (works when opened via window.open; may not close if not)
    btnClosePage.addEventListener('click', () => {
        if (window.opener) {
            window.close();
        } else {
            window.close();
            // If still open (e.g. not opened by script), show message
            setTimeout(() => {
                alert('You can safely close this browser tab.');
            }, 100);
        }
    });

    // Initial state: Microsoft selected (matching screenshot)
    const microsoftLink = document.querySelector('.sidebar-link[data-vendor="microsoft"]');
    if (microsoftLink) {
        setActiveSidebarLink(microsoftLink);
        showDefaultPanel('microsoft');
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
