import { useEffect, useState, useCallback } from 'react';

const UPDATE_SNOOZE_KEY = 'pwa-update-snoozed-at';
/** Hide the update toast after dismiss; re-show after this window if a worker is still waiting. */
const UPDATE_SNOOZE_MS = 3 * 24 * 60 * 60 * 1000;

function isUpdateSnoozed(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const raw = localStorage.getItem(UPDATE_SNOOZE_KEY);
    if (!raw) return false;
    const at = parseInt(raw, 10);
    if (Number.isNaN(at)) return false;
    return Date.now() - at < UPDATE_SNOOZE_MS;
  } catch {
    return false;
  }
}

export default function PWAUpdateBanner() {
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [show, setShow] = useState(false);

  const tryShow = useCallback((worker: ServiceWorker | null) => {
    if (!worker) return;
    if (isUpdateSnoozed()) return;
    setWaitingWorker(worker);
    setShow(true);
  }, []);

  const handleUpdate = useCallback(() => {
    if (waitingWorker) {
      waitingWorker.postMessage('skip-waiting');
    }
    try {
      localStorage.removeItem(UPDATE_SNOOZE_KEY);
    } catch {
      /* ignore */
    }
    setShow(false);
  }, [waitingWorker]);

  const handleDismiss = useCallback(() => {
    try {
      localStorage.setItem(UPDATE_SNOOZE_KEY, String(Date.now()));
    } catch {
      /* ignore */
    }
    setShow(false);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    const onControllerChange = () => window.location.reload();

    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);

    navigator.serviceWorker.getRegistration().then((reg) => {
      if (!reg) return;

      if (reg.waiting) {
        tryShow(reg.waiting);
        return;
      }

      const awaitStateChange = (worker: ServiceWorker) => {
        worker.addEventListener('statechange', () => {
          if (worker.state === 'installed') {
            tryShow(worker);
          }
        });
      };

      if (reg.installing) {
        awaitStateChange(reg.installing);
      }

      reg.addEventListener('updatefound', () => {
        if (reg.installing) {
          awaitStateChange(reg.installing);
        }
      });

      // Check for updates every 30 minutes while the page is open
      const interval = setInterval(() => reg.update(), 30 * 60 * 1000);
      return () => clearInterval(interval);
    });

    return () => {
      navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
    };
  }, [tryShow]);

  if (!show) return null;

  return (
    <>
      <div className="pwa-update-toast" role="alert">
        <button type="button" onClick={handleDismiss} className="pwa-update-dismiss" aria-label="Dismiss">
          &times;
        </button>
        <div className="pwa-update-head">
          <span className="pwa-update-icon" aria-hidden="true">
            &#x1f504;
          </span>
          <div className="pwa-update-text">
            <span className="pwa-update-title">New version ready</span>
            <p className="pwa-update-desc">Refresh for the latest Treasure State experience.</p>
          </div>
        </div>
        <button type="button" onClick={handleUpdate} className="pwa-update-btn">
          Refresh
        </button>
      </div>
      <style jsx>{`
        .pwa-update-toast {
          position: fixed;
          bottom: 1rem;
          right: 1rem;
          z-index: 10050;
          max-width: min(380px, calc(100vw - 2rem));
          background: linear-gradient(135deg, #1a5276, #2980b9);
          color: #fff;
          padding: 0.75rem 0.85rem;
          border-radius: 12px;
          box-shadow: 0 8px 28px rgba(0, 0, 0, 0.28);
          box-sizing: border-box;
          animation: toastIn 0.35s cubic-bezier(0.21, 1.02, 0.73, 1);
          font-family: var(--font-secondary, 'Open Sans', sans-serif);
        }
        @keyframes toastIn {
          from {
            transform: translateY(12px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .pwa-update-head {
          display: flex;
          align-items: flex-start;
          gap: 0.6rem;
          padding-right: 1.5rem;
        }
        .pwa-update-icon {
          font-size: 1.25rem;
          flex-shrink: 0;
          line-height: 1.2;
        }
        .pwa-update-text {
          flex: 1;
          min-width: 0;
        }
        .pwa-update-title {
          display: block;
          font-family: var(--font-primary, 'Montserrat', sans-serif);
          font-weight: 700;
          font-size: 0.9rem;
          margin-bottom: 0.2rem;
        }
        .pwa-update-desc {
          margin: 0;
          font-size: 0.8rem;
          font-weight: 500;
          line-height: 1.35;
          opacity: 0.95;
        }
        .pwa-update-btn {
          margin-top: 0.65rem;
          width: 100%;
          background: #fff;
          color: #1a5276;
          border: none;
          padding: 0.45rem 0.75rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          font-family: var(--font-primary, 'Montserrat', sans-serif);
        }
        .pwa-update-btn:hover {
          background: #eaf2f8;
        }
        .pwa-update-dismiss {
          position: absolute;
          top: 6px;
          right: 8px;
          background: transparent;
          color: rgba(255, 255, 255, 0.75);
          border: none;
          font-size: 1.35rem;
          cursor: pointer;
          padding: 2px 6px;
          line-height: 1;
        }
        .pwa-update-dismiss:hover {
          color: #fff;
        }
        @media (max-width: 768px) {
          .pwa-update-toast {
            left: 0.75rem;
            right: 0.75rem;
            bottom: calc(var(--bottom-nav-height, 65px) + 10px);
            max-width: none;
          }
        }
      `}</style>
    </>
  );
}
