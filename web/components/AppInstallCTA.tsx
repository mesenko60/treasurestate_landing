import { useState, useEffect, useCallback } from 'react';
import {
  trackPWAInstallPromptShown,
  trackPWAInstallAccepted,
  trackPWAInstallDismissed,
} from '../lib/gtag';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const SESSION_DISMISS_KEY = 'app-install-cta-dismissed';
const DISMISS_KEY = 'pwa-prompt-dismissed';
const DISMISS_COOLDOWN_MS = 30 * 24 * 60 * 60 * 1000;

function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as any).standalone === true
  );
}

function isIOSSafari(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|OPiOS|EdgiOS|Chrome/.test(ua);
  return isIOS && isSafari;
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

type Variant = 'card' | 'inline' | 'footer';

type Props = {
  variant?: Variant;
  headline?: string;
  body?: string;
  townName?: string;
  forceShow?: boolean;
  buttonLabel?: string;
};

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
  const [showIOSSteps, setShowIOSSteps] = useState(false);
  const [dismissed, setDismissed] = useState(true);
  const [mounted, setMounted] = useState(false);

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
      setShowIOSSteps(true);
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

  const canShow = mounted && (forceShow || (!dismissed && (deferredPrompt || iosMode)));
  if (!canShow) return null;

  const defaultHeadline = townName
    ? `Take ${townName} with you`
    : variant === 'footer'
    ? 'Add to Home Screen'
    : 'Explore on the go';

  const defaultBody = townName
    ? "Get notified when you're near historic sites and attractions."
    : variant === 'inline'
    ? "Install the app and we'll alert you when points of interest are just ahead."
    : 'Get notified when you pass historic markers, hot springs, and trails.';

  const h = headline ?? defaultHeadline;
  const b = body ?? defaultBody;

  if (variant === 'footer') {
    return (
      <>
        <button
          type="button"
          onClick={iosMode ? () => setShowIOSSteps(true) : handleInstall}
          className="app-install-footer-btn"
        >
          <span aria-hidden="true">📍</span> {h} — {b}
        </button>
        {iosMode && showIOSSteps && (
          <div className="app-install-footer-ios">
            <p>
              Tap <strong>Share</strong> → <strong>Add to Home Screen</strong> → <strong>Add</strong>
            </p>
            <button type="button" onClick={() => { setShowIOSSteps(false); if (!forceShow) handleDismiss(); }}>Got it</button>
          </div>
        )}
        <style jsx>{`
          .app-install-footer-btn {
            background: none;
            border: none;
            color: #ddd;
            font-size: 0.85rem;
            cursor: pointer;
            padding: 0;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 0.35rem;
          }
          .app-install-footer-btn:hover {
            color: #f5c97a;
          }
          .app-install-footer-ios {
            margin-top: 0.5rem;
            font-size: 0.8rem;
            color: #bbb;
          }
          .app-install-footer-ios p {
            margin: 0 0 0.35rem;
          }
          .app-install-footer-ios button {
            background: #3b6978;
            color: #fff;
            border: none;
            padding: 0.25rem 0.6rem;
            border-radius: 4px;
            font-size: 0.75rem;
            cursor: pointer;
          }
        `}</style>
      </>
    );
  }

  if (variant === 'inline') {
    return (
      <div className="app-install-inline">
        <div className="app-install-inline-icon" aria-hidden="true">📍</div>
        <div className="app-install-inline-body">
          <strong>{h}</strong>
          <span>{b}</span>
        </div>
        {iosMode ? (
          showIOSSteps ? (
            <div className="app-install-inline-ios">
              <span>{iosMode ? <>Tap <strong>Share</strong> → <strong>Add to Home Screen</strong></> : <>Use your browser menu to install Treasure State as an app.</>}</span>
              <button type="button" onClick={() => { setShowIOSSteps(false); if (!forceShow) handleDismiss(); }}>Got it</button>
            </div>
          ) : (
            <button type="button" className="app-install-inline-btn" onClick={() => setShowIOSSteps(true)}>
              {buttonLabel || 'How to install'}
            </button>
          )
        ) : (
          <button type="button" className="app-install-inline-btn" onClick={handleInstall}>
            {buttonLabel || 'Add to Home Screen'}
          </button>
        )}
        <style jsx>{`
          .app-install-inline {
            display: flex;
            align-items: flex-start;
            gap: 0.65rem;
            background: linear-gradient(135deg, #e8f4f8 0%, #d4e8ed 100%);
            border-left: 4px solid var(--primary, #3b6978);
            padding: 0.85rem 1rem;
            border-radius: 8px;
            margin: 1rem 0;
            font-size: 0.88rem;
            color: var(--dark, #204051);
          }
          .app-install-inline-icon {
            font-size: 1.35rem;
            flex-shrink: 0;
          }
          .app-install-inline-body {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 0.2rem;
            line-height: 1.4;
          }
          .app-install-inline-btn {
            align-self: flex-start;
            background: var(--primary, #3b6978);
            color: #fff;
            border: none;
            padding: 0.4rem 0.75rem;
            border-radius: 6px;
            font-weight: 600;
            font-size: 0.8rem;
            cursor: pointer;
            white-space: nowrap;
            margin-top: 0.35rem;
          }
          .app-install-inline-btn:hover {
            background: #2d5563;
          }
          .app-install-inline-ios {
            display: flex;
            flex-direction: column;
            gap: 0.35rem;
            font-size: 0.8rem;
            margin-top: 0.35rem;
          }
          .app-install-inline-ios button {
            align-self: flex-start;
            background: var(--primary, #3b6978);
            color: #fff;
            border: none;
            padding: 0.3rem 0.6rem;
            border-radius: 5px;
            font-size: 0.75rem;
            cursor: pointer;
          }
        `}</style>
      </div>
    );
  }

  return (
    <section className="app-install-card">
      <button type="button" className="app-install-card-dismiss" onClick={handleDismiss} aria-label="Dismiss">
        &times;
      </button>
      <div className="app-install-card-icon" aria-hidden="true">📍</div>
      <h3 className="app-install-card-title">{h}</h3>
      <p className="app-install-card-body">{b}</p>
      {iosMode ? (
        showIOSSteps ? (
          <div className="app-install-card-ios">
            <p>Tap <strong>Share</strong> → <strong>Add to Home Screen</strong> → <strong>Add</strong></p>
            <button type="button" onClick={() => { setShowIOSSteps(false); if (!forceShow) handleDismiss(); }}>Got it</button>
          </div>
        ) : (
          <button type="button" className="app-install-card-btn" onClick={() => setShowIOSSteps(true)}>
            {buttonLabel || 'How to install'}
          </button>
        )
      ) : (
        <button type="button" className="app-install-card-btn" onClick={handleInstall}>
          {buttonLabel || 'Add to Home Screen'}
        </button>
      )}
      <style jsx>{`
        .app-install-card {
          position: relative;
          background: linear-gradient(135deg, #1a3544 0%, #0d1f2d 100%);
          border-radius: 12px;
          padding: 1.5rem 1.25rem;
          margin-bottom: 2rem;
          color: #fff;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
          text-align: center;
        }
        .app-install-card-dismiss {
          position: absolute;
          top: 8px;
          right: 10px;
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.5);
          font-size: 1.25rem;
          cursor: pointer;
          padding: 2px 6px;
          line-height: 1;
        }
        .app-install-card-dismiss:hover {
          color: rgba(255, 255, 255, 0.85);
        }
        .app-install-card-icon {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }
        .app-install-card-title {
          font-size: 1.15rem;
          margin: 0 0 0.35rem;
          color: #fff;
          border-bottom: none;
          padding: 0;
          font-family: var(--font-primary, 'Montserrat', sans-serif);
        }
        .app-install-card-body {
          font-size: 0.88rem;
          margin: 0 0 1rem;
          opacity: 0.85;
          line-height: 1.45;
        }
        .app-install-card-btn {
          background: #fff;
          color: var(--dark, #204051);
          border: none;
          padding: 0.55rem 1.25rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          font-family: var(--font-primary, 'Montserrat', sans-serif);
        }
        .app-install-card-btn:hover {
          background: #f5f5f5;
        }
        .app-install-card-ios {
          font-size: 0.85rem;
          opacity: 0.9;
        }
        .app-install-card-ios p {
          margin: 0 0 0.5rem;
        }
        .app-install-card-ios button {
          background: rgba(255, 255, 255, 0.15);
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.3);
          padding: 0.35rem 0.85rem;
          border-radius: 6px;
          font-size: 0.8rem;
          cursor: pointer;
        }
        .app-install-card-ios button:hover {
          background: rgba(255, 255, 255, 0.25);
        }
      `}</style>
    </section>
  );
}
