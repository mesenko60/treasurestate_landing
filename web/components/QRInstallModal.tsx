import { useEffect, useCallback } from 'react';
import { QRCodeSVG } from 'qrcode.react';

/** PWA start URL from site.webmanifest */
const DEFAULT_INSTALL_URL = 'https://treasurestate.com/nearby/';

type Props = {
  open: boolean;
  onClose: () => void;
  /** Override for non-prod or testing */
  targetUrl?: string;
};

export default function QRInstallModal({ open, onClose, targetUrl = DEFAULT_INSTALL_URL }: Props) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener('keydown', handleKeyDown);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prev;
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <div
      className="qr-install-overlay"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="qr-install-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="qr-install-title"
      >
        <button type="button" className="qr-install-close" onClick={onClose} aria-label="Close">
          &times;
        </button>
        <div className="qr-install-accent" aria-hidden="true" />
        <h2 id="qr-install-title" className="qr-install-title">
          Get the Free App
        </h2>
        <p className="qr-install-sub">Scan with your phone to install the Treasure State app</p>
        <div className="qr-install-qr-wrap">
          <QRCodeSVG
            value={targetUrl}
            size={220}
            level="H"
            bgColor="#ffffff"
            fgColor="#1a3544"
            includeMargin
            imageSettings={{
              src: '/favicon-192x192.png',
              height: 44,
              width: 44,
              excavate: true,
            }}
          />
        </div>
        <p className="qr-install-hint">Scan with your phone camera to install</p>
        <p className="qr-install-fine">Point your camera at the code &mdash; no app needed to scan</p>
        <button type="button" className="qr-install-done" onClick={onClose}>
          Close
        </button>
      </div>
      <style jsx>{`
        .qr-install-overlay {
          position: fixed;
          inset: 0;
          z-index: 100100;
          background: rgba(13, 31, 45, 0.72);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }
        .qr-install-dialog {
          position: relative;
          max-width: 340px;
          width: 100%;
          background: linear-gradient(165deg, #1a3544 0%, #0d1f2d 55%, #1a3544 100%);
          border-radius: 14px;
          border: 1px solid rgba(216, 151, 60, 0.35);
          box-shadow: 0 20px 48px rgba(0, 0, 0, 0.45);
          padding: 1.35rem 1.5rem 1.5rem;
          color: #fff;
          text-align: center;
        }
        .qr-install-accent {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          border-radius: 14px 14px 0 0;
          background: linear-gradient(
            90deg,
            var(--gold-display, #d8973c) 0%,
            #e5a94e 50%,
            var(--gold-display, #d8973c) 100%
          );
        }
        .qr-install-close {
          position: absolute;
          top: 8px;
          right: 10px;
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.5);
          font-size: 1.45rem;
          cursor: pointer;
          line-height: 1;
          padding: 4px 8px;
        }
        .qr-install-close:hover {
          color: rgba(255, 255, 255, 0.95);
        }
        .qr-install-title {
          font-family: var(--font-primary, 'Montserrat', sans-serif);
          font-size: 1.2rem;
          font-weight: 700;
          margin: 0.35rem 0 0.4rem;
          color: var(--gold-footer, #f5c97a);
          border: none;
          padding: 0;
        }
        .qr-install-sub {
          font-size: 0.88rem;
          margin: 0 0 1rem;
          opacity: 0.9;
          line-height: 1.45;
        }
        .qr-install-qr-wrap {
          display: inline-block;
          padding: 12px;
          background: #fff;
          border-radius: 12px;
          margin-bottom: 0.85rem;
          line-height: 0;
        }
        .qr-install-hint {
          font-size: 0.85rem;
          font-weight: 600;
          margin: 0 0 0.35rem;
          color: #e8eef2;
        }
        .qr-install-fine {
          font-size: 0.78rem;
          margin: 0 0 1rem;
          opacity: 0.75;
          line-height: 1.35;
        }
        .qr-install-done {
          width: 100%;
          background: linear-gradient(135deg, var(--gold-display, #d8973c) 0%, #e5a94e 100%);
          color: #1a1e2e;
          border: none;
          padding: 0.65rem 1rem;
          border-radius: 9px;
          font-weight: 700;
          font-size: 0.92rem;
          cursor: pointer;
          font-family: var(--font-primary, 'Montserrat', sans-serif);
        }
        .qr-install-done:hover {
          background: linear-gradient(135deg, #e5a94e 0%, #d8973c 100%);
        }
      `}</style>
    </div>
  );
}
