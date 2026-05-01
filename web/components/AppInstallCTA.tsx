import { useState, useEffect, useCallback } from 'react';
import {
  trackPWAInstallPromptShown,
  trackPWAInstallAccepted,
  trackPWAInstallDismissed,
  trackPWAInstallInstructionsShown,
  trackPWAQRInstallModalOpen,
} from '../lib/gtag';
import QRInstallModal from './QRInstallModal';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const SESSION_DISMISS_KEY = 'app-install-cta-dismissed';
const DISMISS_KEY = 'pwa-prompt-dismissed';
const DISMISS_COOLDOWN_MS = 30 * 24 * 60 * 60 * 1000;

export const MOBILE_POI_INSTALL_BODY =
  'Install this on your mobile device to be notified when approaching points of interest.';

function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as any).standalone === true
  );
}

function isIOSDevice(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent;
  return /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

function isIOSSafari(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent;
  const isIOS = isIOSDevice();
  const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|OPiOS|EdgiOS|Chrome/.test(ua);
  return isIOS && isSafari;
}

function isIOSNonSafari(): boolean {
  return isIOSDevice() && !isIOSSafari();
}

function isDismissedRecently(): boolean {
  try {
    if (sessionStorage.getItem(SESSION_DISMISS_KEY)) return true;
    const stored = localStorage.getItem(DISMISS_KEY);
    if (!stored) return false;
    const dismissedAt = parseInt(stored, 10);
    if (Number.isNaN(dismissedAt)) return false;
    return Date.now() - dismissedAt < DISMISS_COOLDOWN_MS;
  } catch {
    return false;
  }
}

function persistSessionDismiss() {
  try {
    sessionStorage.setItem(SESSION_DISMISS_KEY, '1');
  } catch {
    /* ignore */
  }
}

type Variant = 'card' | 'inline' | 'banner' | 'footer';

type Props = {
  variant?: Variant;
  headline?: string;
  body?: string;
  townName?: string;
  forceShow?: boolean;
  buttonLabel?: string;
};

function InstallFallbackMessage({ iosMode }: { iosMode: boolean }) {
  if (iosMode) {
    return (
      <>
        Tap <strong>Share</strong> → <strong>Add to Home Screen</strong> → <strong>Add</strong>
      </>
    );
  }
  if (isIOSNonSafari()) {
    return (
      <>
        To install, open this site in <strong>Safari</strong>, then tap <strong>Share</strong> →{' '}
        <strong>Add to Home Screen</strong>.
      </>
    );
  }
  return (
    <>
      On your phone: open <strong>Chrome</strong> or <strong>Edge</strong> menu (⋮) →{' '}
      <strong>Install app</strong> or <strong>Add to Home Screen</strong>.
    </>
  );
}

export default function AppInstallCTA({
  variant = 'card',
  headline,
  body,
  townName,
  forceShow = false,
  buttonLabel,
}: Props) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [iosMode, setIosMode] = useState(false);
  const [showInstallHelp, setShowInstallHelp] = useState(false);
  const [dismissed, setDismissed] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);

  useEffect(() => {
    const updateDesktop = () => {
      setIsDesktop(!window.matchMedia('(pointer: coarse)').matches);
    };
    updateDesktop();
    const mq = window.matchMedia('(pointer: coarse)');
    mq.addEventListener('change', updateDesktop);
    return () => mq.removeEventListener('change', updateDesktop);
  }, []);

  useEffect(() => {
    setMounted(true);
    if (isStandalone() || isDismissedRecently()) {
      setDismissed(true);
      return;
    }
    setDismissed(false);

    if (isIOSSafari()) {
      setIosMode(true);
      trackPWAInstallPromptShown();
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      trackPWAInstallPromptShown();
    };
    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) {
      setShowInstallHelp(true);
      trackPWAInstallInstructionsShown();
      return;
    }
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      trackPWAInstallAccepted();
      setDeferredPrompt(null);
    } else {
      trackPWAInstallDismissed();
    }
    setDismissed(true);
    persistSessionDismiss();
  }, [deferredPrompt]);

  const handleDismiss = useCallback(() => {
    trackPWAInstallDismissed();
    setDismissed(true);
    persistSessionDismiss();
  }, []);

  const handleShowManualInstallSteps = useCallback(() => {
    setShowInstallHelp(true);
    trackPWAInstallInstructionsShown();
  }, []);

  const closeHelp = useCallback(() => {
    setShowInstallHelp(false);
    if (!forceShow) handleDismiss();
  }, [forceShow, handleDismiss]);

  const onPrimaryClick = iosMode ? handleShowManualInstallSteps : handleInstall;

  const handleCtaPrimaryClick = useCallback(() => {
    if (isDesktop) {
      setQrModalOpen(true);
      trackPWAQRInstallModalOpen();
      return;
    }
    onPrimaryClick();
  }, [isDesktop, onPrimaryClick]);

  const canShow = mounted && (forceShow || !dismissed);
  if (!canShow) return null;

  const defaultHeadline = townName ? `Take ${townName} with you` : 'Get the Free App';
  const defaultBody = townName
    ? "On your phone or tablet, get notified when you're near historic sites and points of interest."
    : MOBILE_POI_INSTALL_BODY;

  const h = headline ?? defaultHeadline;
  const b = body ?? defaultBody;
  const primaryLabel = buttonLabel ?? (iosMode ? 'How to install' : deferredPrompt ? 'Install Free' : 'How to install');

  /* ═══ FOOTER VARIANT ═══ */
  if (variant === 'footer') {
    return (
      <>
        <button
          type="button"
          onClick={handleCtaPrimaryClick}
          className="app-install-footer-btn"
        >
          <span className="app-install-footer-phone" aria-hidden="true">📱</span>
          <span className="app-install-footer-text">{h}</span>
        </button>
        {showInstallHelp && (
          <div className="app-install-footer-help">
            <p><InstallFallbackMessage iosMode={iosMode} /></p>
            <button type="button" onClick={closeHelp}>Got it</button>
          </div>
        )}
        <style jsx>{`
          .app-install-footer-btn {
            background: linear-gradient(135deg, rgba(216,151,60,0.2) 0%, rgba(59,105,120,0.2) 100%);
            border: 1px solid rgba(255,255,255,0.15);
            color: #f5c97a;
            font-size: 0.85rem;
            font-weight: 600;
            cursor: pointer;
            padding: 0.5rem 1rem;
            border-radius: 8px;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            transition: all 0.2s;
          }
          .app-install-footer-btn:hover {
            background: linear-gradient(135deg, rgba(216,151,60,0.35) 0%, rgba(59,105,120,0.35) 100%);
            color: #fff;
          }
          .app-install-footer-phone { font-size: 1.1rem; }
          .app-install-footer-text { letter-spacing: 0.01em; }
          .app-install-footer-help {
            margin-top: 0.5rem;
            font-size: 0.8rem;
            color: #bbb;
          }
          .app-install-footer-help p { margin: 0 0 0.35rem; }
          .app-install-footer-help button {
            background: #3b6978;
            color: #fff;
            border: none;
            padding: 0.25rem 0.6rem;
            border-radius: 4px;
            font-size: 0.75rem;
            cursor: pointer;
          }
        `}</style>
        <QRInstallModal open={qrModalOpen} onClose={() => setQrModalOpen(false)} />
      </>
    );
  }

  /* ═══ BANNER VARIANT (full-width accent bar) ═══ */
  if (variant === 'banner') {
    return (
      <>
      <div className="app-install-banner">
        <div className="app-install-banner-inner">
          <span className="app-install-banner-icon" aria-hidden="true">📱</span>
          <div className="app-install-banner-text">
            <strong>{h}</strong>
            <span>{b}</span>
          </div>
          {showInstallHelp ? (
            <div className="app-install-banner-help">
              <span><InstallFallbackMessage iosMode={iosMode} /></span>
              <button type="button" onClick={closeHelp}>Got it</button>
            </div>
          ) : (
            <button type="button" className="app-install-banner-btn" onClick={handleCtaPrimaryClick}>
              {primaryLabel}
            </button>
          )}
        </div>
        <style jsx>{`
          .app-install-banner {
            background: linear-gradient(135deg, #1a3544 0%, #204051 50%, #2a5a6b 100%);
            border-top: 3px solid var(--gold-display, #d8973c);
            border-bottom: 3px solid var(--gold-display, #d8973c);
            padding: 1rem 1.25rem;
            margin: 2rem 0;
          }
          .app-install-banner-inner {
            max-width: 960px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            gap: 1rem;
          }
          .app-install-banner-icon {
            font-size: 2.2rem;
            flex-shrink: 0;
          }
          .app-install-banner-text {
            flex: 1;
            color: #fff;
            display: flex;
            flex-direction: column;
            gap: 0.2rem;
          }
          .app-install-banner-text strong {
            font-family: var(--font-primary, 'Montserrat', sans-serif);
            font-size: 1.05rem;
            letter-spacing: -0.01em;
          }
          .app-install-banner-text span {
            font-size: 0.85rem;
            opacity: 0.88;
            line-height: 1.4;
          }
          .app-install-banner-btn {
            flex-shrink: 0;
            background: var(--gold-display, #d8973c);
            color: #1a1e2e;
            border: none;
            padding: 0.65rem 1.5rem;
            border-radius: 8px;
            font-weight: 700;
            font-size: 0.9rem;
            cursor: pointer;
            font-family: var(--font-primary, 'Montserrat', sans-serif);
            letter-spacing: 0.02em;
            white-space: nowrap;
            transition: background 0.2s, transform 0.15s;
          }
          .app-install-banner-btn:hover {
            background: #e5a94e;
            transform: translateY(-1px);
          }
          .app-install-banner-help {
            flex-shrink: 0;
            display: flex;
            flex-direction: column;
            gap: 0.35rem;
            font-size: 0.82rem;
            color: #d6dce8;
            max-width: 260px;
          }
          .app-install-banner-help button {
            align-self: flex-start;
            background: var(--gold-display, #d8973c);
            color: #1a1e2e;
            border: none;
            padding: 0.3rem 0.7rem;
            border-radius: 5px;
            font-size: 0.75rem;
            font-weight: 600;
            cursor: pointer;
          }
          @media (max-width: 600px) {
            .app-install-banner-inner {
              flex-wrap: wrap;
            }
            .app-install-banner-btn,
            .app-install-banner-help {
              width: 100%;
              text-align: center;
            }
            .app-install-banner-btn {
              margin-top: 0.25rem;
            }
          }
        `}</style>
      </div>
      <QRInstallModal open={qrModalOpen} onClose={() => setQrModalOpen(false)} />
      </>
    );
  }

  /* ═══ INLINE VARIANT ═══ */
  if (variant === 'inline') {
    return (
      <>
      <div className="app-cta-inline">
        <div className="app-cta-inline-left">
          <span className="app-cta-inline-icon" aria-hidden="true">📱</span>
          <div className="app-cta-inline-text">
            <strong>{h}</strong>
            <span>{b}</span>
          </div>
        </div>
        {showInstallHelp ? (
          <div className="app-cta-inline-help">
            <span><InstallFallbackMessage iosMode={iosMode} /></span>
            <button type="button" onClick={closeHelp}>Got it</button>
          </div>
        ) : (
          <button type="button" className="app-cta-inline-btn" onClick={handleCtaPrimaryClick}>
            {primaryLabel}
          </button>
        )}
        <style jsx>{`
          .app-cta-inline {
            display: flex;
            align-items: center;
            gap: 1rem;
            background: linear-gradient(135deg, #1a3544 0%, #204051 100%);
            border-left: 4px solid var(--gold-display, #d8973c);
            padding: 1rem 1.25rem;
            border-radius: 10px;
            margin: 1.5rem 0;
            color: #fff;
          }
          .app-cta-inline-left {
            flex: 1;
            display: flex;
            align-items: center;
            gap: 0.75rem;
          }
          .app-cta-inline-icon {
            font-size: 1.8rem;
            flex-shrink: 0;
          }
          .app-cta-inline-text {
            display: flex;
            flex-direction: column;
            gap: 0.15rem;
          }
          .app-cta-inline-text strong {
            font-family: var(--font-primary, 'Montserrat', sans-serif);
            font-size: 0.95rem;
            color: var(--gold-footer, #f5c97a);
          }
          .app-cta-inline-text span {
            font-size: 0.82rem;
            opacity: 0.88;
            line-height: 1.35;
          }
          .app-cta-inline-btn {
            flex-shrink: 0;
            background: var(--gold-display, #d8973c);
            color: #1a1e2e;
            border: none;
            padding: 0.55rem 1.1rem;
            border-radius: 8px;
            font-weight: 700;
            font-size: 0.82rem;
            cursor: pointer;
            font-family: var(--font-primary, 'Montserrat', sans-serif);
            white-space: nowrap;
            transition: background 0.2s, transform 0.15s;
          }
          .app-cta-inline-btn:hover {
            background: #e5a94e;
            transform: translateY(-1px);
          }
          .app-cta-inline-help {
            flex-shrink: 0;
            display: flex;
            flex-direction: column;
            gap: 0.35rem;
            font-size: 0.78rem;
            max-width: 240px;
          }
          .app-cta-inline-help button {
            align-self: flex-start;
            background: var(--gold-display, #d8973c);
            color: #1a1e2e;
            border: none;
            padding: 0.3rem 0.6rem;
            border-radius: 5px;
            font-size: 0.72rem;
            font-weight: 600;
            cursor: pointer;
          }
          @media (max-width: 600px) {
            .app-cta-inline {
              flex-direction: column;
              align-items: stretch;
              gap: 0.75rem;
            }
            .app-cta-inline-btn {
              width: 100%;
              text-align: center;
            }
          }
        `}</style>
      </div>
      <QRInstallModal open={qrModalOpen} onClose={() => setQrModalOpen(false)} />
      </>
    );
  }

  /* ═══ CARD VARIANT (default) ═══ */
  return (
    <>
    <section className="app-cta-card">
      <button type="button" className="app-cta-card-dismiss" onClick={handleDismiss} aria-label="Dismiss">&times;</button>
      <div className="app-cta-card-content">
        <div className="app-cta-card-icon" aria-hidden="true">📱</div>
        <div className="app-cta-card-body">
          <h3 className="app-cta-card-title">{h}</h3>
          <p className="app-cta-card-desc">{b}</p>
        </div>
      </div>
      {showInstallHelp ? (
        <div className="app-cta-card-help">
          <p><InstallFallbackMessage iosMode={iosMode} /></p>
          <button type="button" onClick={closeHelp}>Got it</button>
        </div>
      ) : (
        <button type="button" className="app-cta-card-btn" onClick={handleCtaPrimaryClick}>
          {primaryLabel}
        </button>
      )}
      <style jsx>{`
        .app-cta-card {
          position: relative;
          background: linear-gradient(135deg, #1a3544 0%, #0d1f2d 60%, #1a3544 100%);
          border-radius: 14px;
          padding: 1.75rem 1.5rem;
          margin-bottom: 2rem;
          color: #fff;
          box-shadow: 0 6px 24px rgba(0, 0, 0, 0.18);
          border: 1px solid rgba(216, 151, 60, 0.25);
          overflow: hidden;
        }
        .app-cta-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, var(--gold-display, #d8973c) 0%, #e5a94e 50%, var(--gold-display, #d8973c) 100%);
        }
        .app-cta-card-dismiss {
          position: absolute;
          top: 10px;
          right: 12px;
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.45);
          font-size: 1.3rem;
          cursor: pointer;
          padding: 2px 6px;
          line-height: 1;
          z-index: 1;
        }
        .app-cta-card-dismiss:hover { color: rgba(255, 255, 255, 0.85); }
        .app-cta-card-content {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.25rem;
        }
        .app-cta-card-icon {
          font-size: 2.8rem;
          flex-shrink: 0;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
        }
        .app-cta-card-body { flex: 1; }
        .app-cta-card-title {
          font-size: 1.25rem;
          margin: 0 0 0.3rem;
          color: var(--gold-footer, #f5c97a);
          border-bottom: none;
          padding: 0;
          font-family: var(--font-primary, 'Montserrat', sans-serif);
          font-weight: 700;
        }
        .app-cta-card-desc {
          font-size: 0.88rem;
          margin: 0;
          opacity: 0.88;
          line-height: 1.5;
        }
        .app-cta-card-btn {
          display: block;
          width: 100%;
          background: linear-gradient(135deg, var(--gold-display, #d8973c) 0%, #e5a94e 100%);
          color: #1a1e2e;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 10px;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          font-family: var(--font-primary, 'Montserrat', sans-serif);
          letter-spacing: 0.03em;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 3px 12px rgba(216, 151, 60, 0.3);
        }
        .app-cta-card-btn:hover {
          background: linear-gradient(135deg, #e5a94e 0%, #d8973c 100%);
          transform: translateY(-2px);
          box-shadow: 0 5px 16px rgba(216, 151, 60, 0.4);
        }
        .app-cta-card-help {
          font-size: 0.85rem;
          opacity: 0.9;
          text-align: center;
        }
        .app-cta-card-help p { margin: 0 0 0.5rem; }
        .app-cta-card-help button {
          background: rgba(255, 255, 255, 0.15);
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.3);
          padding: 0.4rem 1rem;
          border-radius: 6px;
          font-size: 0.8rem;
          cursor: pointer;
        }
        .app-cta-card-help button:hover { background: rgba(255, 255, 255, 0.25); }
      `}</style>
    </section>
    <QRInstallModal open={qrModalOpen} onClose={() => setQrModalOpen(false)} />
    </>
  );
}
