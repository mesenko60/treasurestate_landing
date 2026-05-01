import { useState, useEffect, useCallback } from 'react';
import {
  trackPWAInstallPromptShown,
  trackPWAInstallAccepted,
  trackPWAInstallDismissed,
  trackPWAInstallInstructionsShown,
} from '../lib/gtag';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

type PromptMode = 'android' | 'ios' | null;

const DISMISS_KEY = 'pwa-prompt-dismissed';
const DISMISS_COOLDOWN_MS = 30 * 24 * 60 * 60 * 1000;

function isIOSDevice(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent;
  return /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

function isIOSNonSafari(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent;
  const isIOS = isIOSDevice();
  const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|OPiOS|EdgiOS|Chrome/.test(ua);
  return isIOS && !isSafari;
}

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
  return null;
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

/**
 * Persistent install bar — sits above MobileBottomNav on mobile, bottom-left on desktop.
 * Always visible (unless dismissed or already installed), on every page.
 */
export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [iosMode, setIosMode] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }

    if (readDismissedWithinCooldown()) {
      setDismissed(true);
    }

    const mode = detectPromptMode();
    if (mode === 'ios') {
      setIosMode(true);
    }

    trackPWAInstallPromptShown();

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleDismiss = useCallback(() => {
    trackPWAInstallDismissed();
    setDismissed(true);
    setShowHelp(false);
    persistDismiss();
  }, []);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) {
      setShowHelp(true);
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
    persistDismiss();
  }, [deferredPrompt]);

  const isAlreadyInstalled = typeof window !== 'undefined' && (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as any).standalone === true
  );
  if (dismissed || isAlreadyInstalled) return null;

  const helpMessage = iosMode ? (
    <>Tap <strong>Share</strong> → <strong>Add to Home Screen</strong> → <strong>Add</strong></>
  ) : isIOSNonSafari() ? (
    <>Open this site in <strong>Safari</strong>, then tap <strong>Share</strong> → <strong>Add to Home Screen</strong>.</>
  ) : (
    <>Open <strong>Chrome</strong> menu (⋮) → <strong>Install app</strong> or <strong>Add to Home Screen</strong>.</>
  );

  return (
    <div className="pwa-bar">
      <button type="button" className="pwa-bar-close" onClick={handleDismiss} aria-label="Dismiss">&times;</button>
      <div className="pwa-bar-content">
        <span className="pwa-bar-icon" aria-hidden="true">📱</span>
        <div className="pwa-bar-text">
          <strong>Get the Free App</strong>
          <span>POI alerts on your phone</span>
        </div>
        {showHelp ? (
          <div className="pwa-bar-help">
            <span>{helpMessage}</span>
            <button type="button" onClick={() => { setShowHelp(false); handleDismiss(); }}>OK</button>
          </div>
        ) : (
          <button type="button" className="pwa-bar-install" onClick={iosMode ? () => { setShowHelp(true); trackPWAInstallInstructionsShown(); } : handleInstall}>
            {iosMode ? 'Install' : deferredPrompt ? 'Install' : 'Install'}
          </button>
        )}
      </div>
      <style jsx>{`
        .pwa-bar {
          position: fixed;
          bottom: calc(var(--bottom-nav-height, 65px) + 4px);
          left: 0.5rem;
          right: 0.5rem;
          z-index: 10050;
          max-width: min(440px, calc(100vw - 1rem));
          margin: 0 auto;
          background: linear-gradient(135deg, #1a3544 0%, #0d1f2d 100%);
          border: 1px solid rgba(216, 151, 60, 0.35);
          border-radius: 12px;
          box-shadow: 0 6px 24px rgba(0, 0, 0, 0.35);
          padding: 0.6rem 0.75rem;
          animation: pwa-bar-in 0.4s cubic-bezier(0.21, 1.02, 0.73, 1);
        }
        @keyframes pwa-bar-in {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .pwa-bar-close {
          position: absolute;
          top: 4px;
          right: 8px;
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.4);
          font-size: 1.2rem;
          cursor: pointer;
          padding: 2px 5px;
          line-height: 1;
        }
        .pwa-bar-close:hover { color: rgba(255, 255, 255, 0.8); }
        .pwa-bar-content {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          color: #fff;
        }
        .pwa-bar-icon {
          font-size: 1.6rem;
          flex-shrink: 0;
        }
        .pwa-bar-text {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 0.05rem;
        }
        .pwa-bar-text strong {
          font-family: var(--font-primary, 'Montserrat', sans-serif);
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--gold-footer, #f5c97a);
        }
        .pwa-bar-text span {
          font-size: 0.72rem;
          opacity: 0.8;
        }
        .pwa-bar-install {
          flex-shrink: 0;
          background: linear-gradient(135deg, var(--gold-display, #d8973c) 0%, #e5a94e 100%);
          color: #1a1e2e;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.82rem;
          cursor: pointer;
          font-family: var(--font-primary, 'Montserrat', sans-serif);
          white-space: nowrap;
          box-shadow: 0 2px 8px rgba(216, 151, 60, 0.3);
          transition: background 0.2s, transform 0.15s;
        }
        .pwa-bar-install:hover {
          background: linear-gradient(135deg, #e5a94e 0%, #d8973c 100%);
          transform: translateY(-1px);
        }
        .pwa-bar-help {
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          font-size: 0.72rem;
          color: #d6dce8;
          max-width: 180px;
        }
        .pwa-bar-help button {
          align-self: flex-start;
          background: var(--gold-display, #d8973c);
          color: #1a1e2e;
          border: none;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.68rem;
          font-weight: 700;
          cursor: pointer;
        }
        @media (min-width: 769px) {
          .pwa-bar {
            left: 1rem;
            right: auto;
            bottom: 1rem;
            margin: 0;
            max-width: 360px;
          }
        }
      `}</style>
    </div>
  );
}
