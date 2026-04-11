import { useEffect, useState, useCallback } from 'react';

export default function PWAUpdateBanner() {
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [show, setShow] = useState(false);

  const handleUpdate = useCallback(() => {
    if (waitingWorker) {
      waitingWorker.postMessage('skip-waiting');
    }
    setShow(false);
  }, [waitingWorker]);

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    const onControllerChange = () => window.location.reload();

    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);

    navigator.serviceWorker.getRegistration().then((reg) => {
      if (!reg) return;

      if (reg.waiting) {
        setWaitingWorker(reg.waiting);
        setShow(true);
        return;
      }

      const awaitStateChange = (worker: ServiceWorker) => {
        worker.addEventListener('statechange', () => {
          if (worker.state === 'installed') {
            setWaitingWorker(worker);
            setShow(true);
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
  }, []);

  if (!show) return null;

  return (
    <>
      <div className="pwa-update-banner" role="alert">
        <div className="pwa-update-content">
          <span className="pwa-update-icon">&#x1f504;</span>
          <p>A new version of Treasure State is available.</p>
          <button onClick={handleUpdate} className="pwa-update-btn">
            Update Now
          </button>
          <button onClick={() => setShow(false)} className="pwa-update-dismiss" aria-label="Dismiss">
            &times;
          </button>
        </div>
      </div>
      <style jsx>{`
        .pwa-update-banner {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100000;
          background: linear-gradient(135deg, #1a5276, #2980b9);
          color: #fff;
          padding: 0.75rem 1rem;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
          animation: slideDown 0.3s ease-out;
        }
        @keyframes slideDown {
          from { transform: translateY(-100%); }
          to { transform: translateY(0); }
        }
        .pwa-update-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          max-width: 800px;
          margin: 0 auto;
          flex-wrap: wrap;
        }
        .pwa-update-icon {
          font-size: 1.3rem;
        }
        .pwa-update-content p {
          margin: 0;
          font-size: 0.95rem;
          font-weight: 500;
        }
        .pwa-update-btn {
          background: #fff;
          color: #1a5276;
          border: none;
          padding: 0.4rem 1rem;
          border-radius: 4px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          white-space: nowrap;
        }
        .pwa-update-btn:hover {
          background: #eaf2f8;
        }
        .pwa-update-dismiss {
          background: transparent;
          color: #fff;
          border: none;
          font-size: 1.4rem;
          cursor: pointer;
          padding: 0 0.25rem;
          line-height: 1;
          opacity: 0.8;
        }
        .pwa-update-dismiss:hover {
          opacity: 1;
        }
        @media (max-width: 480px) {
          .pwa-update-content p {
            font-size: 0.85rem;
          }
        }
      `}</style>
    </>
  );
}
