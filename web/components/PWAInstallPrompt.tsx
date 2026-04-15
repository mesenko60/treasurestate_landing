import { useState, useEffect, useCallback } from 'react';
import {
  trackPWAInstallPromptShown,
  trackPWAInstallAccepted,
  trackPWAInstallDismissed,
  trackPWAInstalled,
} from '../lib/gtag';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

type PromptMode = 'android' | 'ios' | null;

const DISMISS_KEY = 'pwa-prompt-dismissed';
/** After dismiss, hide the prompt until this elapses (re-offer later). */
const DISMISS_COOLDOWN_MS = 30 * 24 * 60 * 60 * 1000;

function detectPromptMode(): PromptMode {
  if (typeof window === 'undefined') return null;

  const isStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as any).standalone === true;
  if (isStandalone) return null;

  const ua = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|OPiOS|EdgiOS|Chrome/.test(ua);

  if (isIOS && isSafari) return 'ios';
  return null; // Android handled via beforeinstallprompt event
}

function readDismissedWithinCooldown(): boolean {
  try {
    const stored = localStorage.getItem(DISMISS_KEY);
    if (!stored) return false;
    const dismissedAt = parseInt(stored, 10);
    if (Number.isNaN(dismissedAt)) return false;
    return Date.now() - dismissedAt < DISMISS_COOLDOWN_MS;
  } catch {
    return false;
  }
}

function persistDismiss() {
  try {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
  } catch {
    /* ignore */
  }
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [iosMode, setIosMode] = useState(false);
  const [showIOSSteps, setShowIOSSteps] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }

    if (readDismissedWithinCooldown()) {
      setDismissed(true);
      return;
    }

    const mode = detectPromptMode();
    if (mode === 'ios') {
      setIosMode(true);
      trackPWAInstallPromptShown();
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      trackPWAInstallPromptShown();
    };
    window.addEventListener('beforeinstallprompt', handler);

    const installedHandler = () => {
      trackPWAInstalled();
    };
    window.addEventListener('appinstalled', installedHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installedHandler);
    };
  }, []);

  const handleDismiss = useCallback(() => {
    trackPWAInstallDismissed();
    setDismissed(true);
    setShowIOSSteps(false);
    persistDismiss();
  }, []);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      trackPWAInstallAccepted();
      setDeferredPrompt(null);
    } else {
      trackPWAInstallDismissed();
    }
    setDismissed(true);
    persistDismiss();
  }, [deferredPrompt]);

  const showBanner = !dismissed && (deferredPrompt || iosMode);
  if (!showBanner) return null;

  return (
    <div className="pwa-install-toast">
      <button type="button" className="pwa-install-dismiss" onClick={handleDismiss} aria-label="Dismiss">
        &times;
      </button>
      <div className="pwa-install-head">
        <span className="pwa-install-icon" aria-hidden="true">
          📍
        </span>
        <div className="pwa-install-body">
          <span className="pwa-install-title">Treasure State on your home screen</span>
          <ul className="pwa-install-benefits">
            <li>Open Montana guides in one tap—no hunting for the tab</li>
            <li>Faster return visits; key pages work even when the network is spotty</li>
            <li>Nearby map and POIs stay easier to reach on the go</li>
          </ul>
          {iosMode && showIOSSteps && (
            <div className="pwa-ios-steps">
              <div className="pwa-ios-step">
                <span className="pwa-ios-step-num">1</span>
                <span>
                  Tap the <strong>Share</strong> button <span className="pwa-ios-share-icon">⬆</span> at the bottom of Safari
                </span>
              </div>
              <div className="pwa-ios-step">
                <span className="pwa-ios-step-num">2</span>
                <span>
                  Scroll down and tap <strong>&ldquo;Add to Home Screen&rdquo;</strong>
                </span>
              </div>
              <div className="pwa-ios-step">
                <span className="pwa-ios-step-num">3</span>
                <span>
                  Tap <strong>&ldquo;Add&rdquo;</strong> in the top right
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="pwa-install-actions">
        {iosMode ? (
          <button
            type="button"
            className="pwa-install-primary"
            onClick={() => {
              if (showIOSSteps) {
                handleDismiss();
              } else {
                setShowIOSSteps(true);
                trackPWAInstallAccepted();
              }
            }}
          >
            {showIOSSteps ? 'Got it' : 'How to install'}
          </button>
        ) : (
          <button type="button" className="pwa-install-primary" onClick={handleInstall}>
            Install
          </button>
        )}
      </div>
      <style jsx>{`
        .pwa-install-toast {
          position: fixed;
          bottom: calc(var(--bottom-nav-height, 65px) + 10px);
          left: 0.75rem;
          right: 0.75rem;
          z-index: 10052;
          max-width: min(440px, calc(100vw - 1.5rem));
          margin: 0 auto;
          background: var(--dark, #204051);
          color: white;
          padding: 0.75rem 0.85rem 0.65rem;
          border-radius: 12px;
          box-shadow: 0 8px 28px rgba(0, 0, 0, 0.28);
          font-family: var(--font-secondary, 'Open Sans', sans-serif);
          font-size: 0.8rem;
          animation: pwa-toast-in 0.35s cubic-bezier(0.21, 1.02, 0.73, 1);
        }
        @keyframes pwa-toast-in {
          from {
            transform: translateY(16px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .pwa-install-head {
          display: flex;
          align-items: flex-start;
          gap: 0.6rem;
          padding-right: 1.35rem;
        }
        .pwa-install-icon {
          font-size: 1.45rem;
          flex-shrink: 0;
          line-height: 1.1;
        }
        .pwa-install-body {
          flex: 1;
          min-width: 0;
        }
        .pwa-install-title {
          display: block;
          font-family: var(--font-primary, 'Montserrat', sans-serif);
          font-weight: 700;
          font-size: 0.92rem;
          margin-bottom: 0.45rem;
          line-height: 1.25;
        }
        .pwa-install-benefits {
          margin: 0;
          padding-left: 1.1rem;
          line-height: 1.45;
          opacity: 0.92;
        }
        .pwa-install-benefits li {
          margin-bottom: 0.25rem;
        }
        .pwa-install-benefits li:last-child {
          margin-bottom: 0;
        }
        .pwa-ios-steps {
          margin-top: 0.55rem;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .pwa-ios-step {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.78rem;
          line-height: 1.3;
        }
        .pwa-ios-step-num {
          background: var(--secondary, #d8973c);
          color: white;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.7rem;
          flex-shrink: 0;
        }
        .pwa-ios-share-icon {
          display: inline-block;
          border: 1.5px solid white;
          border-radius: 3px;
          padding: 0 2px;
          font-size: 0.65rem;
          line-height: 1.1;
          vertical-align: middle;
        }
        .pwa-install-actions {
          margin-top: 0.65rem;
        }
        .pwa-install-primary {
          width: 100%;
          background: white;
          color: var(--dark, #204051);
          border: none;
          padding: 0.45rem 0.75rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          font-family: var(--font-primary, 'Montserrat', sans-serif);
        }
        .pwa-install-primary:hover {
          background: #f5f5f5;
        }
        .pwa-install-dismiss {
          position: absolute;
          top: 6px;
          right: 8px;
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.65);
          font-size: 1.3rem;
          cursor: pointer;
          padding: 2px 6px;
          line-height: 1;
        }
        .pwa-install-dismiss:hover {
          color: rgba(255, 255, 255, 0.95);
        }
        @media (min-width: 769px) {
          .pwa-install-toast {
            left: 1rem;
            right: auto;
            bottom: 1rem;
            margin: 0;
            max-width: 380px;
          }
        }
      `}</style>
    </div>
  );
}
