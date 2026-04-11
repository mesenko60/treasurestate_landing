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

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }

    const stored = sessionStorage.getItem('pwa-prompt-dismissed');
    if (stored) {
      setDismissed(true);
      return;
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
    sessionStorage.setItem('pwa-prompt-dismissed', '1');
  }, [deferredPrompt]);

  const handleDismiss = useCallback(() => {
    trackPWAInstallDismissed();
    setDismissed(true);
    sessionStorage.setItem('pwa-prompt-dismissed', '1');
  }, []);

  if (!deferredPrompt || dismissed) return null;

  return (
    <div className="pwa-banner">
      <span className="pwa-banner-text">
        Add Treasure State to your home screen for quick access to nearby points of interest.
      </span>
      <div className="pwa-banner-actions">
        <button className="pwa-banner-install" onClick={handleInstall}>Install</button>
        <button className="pwa-banner-dismiss" onClick={handleDismiss} aria-label="Dismiss">×</button>
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
          align-items: center;
          justify-content: space-between;
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

        .pwa-banner-text {
          flex: 1;
          line-height: 1.4;
        }

        .pwa-banner-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-shrink: 0;
        }

        .pwa-banner-install {
          background: white;
          color: var(--dark, #204051);
          border: none;
          padding: 0.4rem 1rem;
          border-radius: 6px;
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          font-family: var(--font-primary, 'Montserrat', sans-serif);
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
            max-width: 420px;
          }
        }
      `}</style>
    </div>
  );
}
