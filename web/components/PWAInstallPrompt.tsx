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

    const stored = localStorage.getItem('pwa-prompt-dismissed');
    if (stored) {
      const dismissedAt = parseInt(stored, 10);
      // Re-show after 7 days
      if (Date.now() - dismissedAt < 7 * 24 * 60 * 60 * 1000) {
        setDismissed(true);
        return;
      }
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
    localStorage.setItem('pwa-prompt-dismissed', String(Date.now()));
  }, [deferredPrompt]);

  const handleDismiss = useCallback(() => {
    trackPWAInstallDismissed();
    setDismissed(true);
    localStorage.setItem('pwa-prompt-dismissed', String(Date.now()));
  }, []);

  const showBanner = !dismissed && (deferredPrompt || iosMode);
  if (!showBanner) return null;

  return (
    <div className="pwa-banner">
      <div className="pwa-banner-icon">📍</div>
      <div className="pwa-banner-body">
        <span className="pwa-banner-title">Explore Montana Nearby</span>
        <span className="pwa-banner-text">
          {iosMode
            ? 'Install this app to discover points of interest near you.'
            : 'Add to your home screen for quick access to nearby attractions.'}
        </span>
        {iosMode && showIOSSteps && (
          <div className="pwa-ios-steps">
            <div className="pwa-ios-step">
              <span className="pwa-ios-step-num">1</span>
              <span>Tap the <strong>Share</strong> button <span className="pwa-ios-share-icon">⬆</span> at the bottom of Safari</span>
            </div>
            <div className="pwa-ios-step">
              <span className="pwa-ios-step-num">2</span>
              <span>Scroll down and tap <strong>&ldquo;Add to Home Screen&rdquo;</strong></span>
            </div>
            <div className="pwa-ios-step">
              <span className="pwa-ios-step-num">3</span>
              <span>Tap <strong>&ldquo;Add&rdquo;</strong> in the top right</span>
            </div>
          </div>
        )}
      </div>
      <div className="pwa-banner-actions">
        {iosMode ? (
          <button
            className="pwa-banner-install"
            onClick={() => {
              setShowIOSSteps(!showIOSSteps);
              if (!showIOSSteps) trackPWAInstallAccepted();
            }}
          >
            {showIOSSteps ? 'Got it' : 'How to Install'}
          </button>
        ) : (
          <button className="pwa-banner-install" onClick={handleInstall}>Install</button>
        )}
        <button className="pwa-banner-dismiss" onClick={handleDismiss} aria-label="Dismiss">&times;</button>
      </div>
      <style jsx>{`
        .pwa-banner {
          position: fixed;
          bottom: 70px;
          left: 0.5rem;
          right: 0.5rem;
          background: var(--dark, #204051);
          color: white;
          padding: 0.75rem 1rem;
          border-radius: 12px;
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          z-index: 9999;
          box-shadow: 0 4px 20px rgba(0,0,0,0.25);
          font-family: var(--font-secondary, 'Open Sans', sans-serif);
          font-size: 0.85rem;
          animation: pwa-slide-up 0.3s ease-out;
        }

        @keyframes pwa-slide-up {
          from { transform: translateY(100px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .pwa-banner-icon {
          font-size: 1.6rem;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .pwa-banner-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .pwa-banner-title {
          font-family: var(--font-primary, 'Montserrat', sans-serif);
          font-weight: 700;
          font-size: 0.9rem;
        }

        .pwa-banner-text {
          line-height: 1.4;
          opacity: 0.9;
          font-size: 0.8rem;
        }

        .pwa-ios-steps {
          margin-top: 0.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .pwa-ios-step {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
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
          font-size: 0.7rem;
          line-height: 1.1;
          vertical-align: middle;
        }

        .pwa-banner-actions {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          flex-shrink: 0;
        }

        .pwa-banner-install {
          background: white;
          color: var(--dark, #204051);
          border: none;
          padding: 0.4rem 0.85rem;
          border-radius: 6px;
          font-weight: 600;
          font-size: 0.8rem;
          cursor: pointer;
          font-family: var(--font-primary, 'Montserrat', sans-serif);
          white-space: nowrap;
        }

        .pwa-banner-dismiss {
          background: none;
          border: none;
          color: rgba(255,255,255,0.6);
          font-size: 1.3rem;
          cursor: pointer;
          padding: 0 0.25rem;
          line-height: 1;
        }

        @media (min-width: 769px) {
          .pwa-banner {
            bottom: 1rem;
            left: auto;
            right: 1rem;
            max-width: 440px;
          }
        }
      `}</style>
    </div>
  );
}
