import React, { useEffect, useState, useCallback } from 'react';
import { getCategoryInfo, formatDistance } from '../../lib/nearbyApi';
import type { NearbyPOI } from '../../lib/nearbyApi';
import { trackNearbyPOINavigate } from '../../lib/gtag';

export interface ProximityAlert {
  poi: NearbyPOI;
  triggeredAt: number;
}

export default function ProximityToast({
  alerts,
  onDismiss,
  onSelect,
  onNavigate,
}: {
  alerts: ProximityAlert[];
  onDismiss: (poiId: number) => void;
  onSelect: (poi: NearbyPOI) => void;
  onNavigate: (poi: NearbyPOI) => void;
}) {
  if (alerts.length === 0) return null;

  return (
    <div className="proximity-toast-container">
      {alerts.map((alert) => {
        const info = getCategoryInfo(alert.poi.category);
        return (
          <div key={alert.poi.id} className="proximity-toast" role="alert">
            <button
              className="proximity-toast-close"
              onClick={(e) => { e.stopPropagation(); onDismiss(alert.poi.id); }}
              aria-label="Dismiss"
            >
              ×
            </button>
            <div className="proximity-toast-body" onClick={() => onSelect(alert.poi)}>
              <div className="proximity-toast-icon" style={{ background: info.color }}>
                {info.icon}
              </div>
              <div className="proximity-toast-content">
                <div className="proximity-toast-label">Nearby {info.label}</div>
                <div className="proximity-toast-name">{alert.poi.name}</div>
                <div className="proximity-toast-dist">{formatDistance(alert.poi.distance_meters)} away</div>
              </div>
            </div>
            <div className="proximity-toast-actions">
              <button
                className="proximity-toast-nav"
                onClick={(e) => { e.stopPropagation(); trackNearbyPOINavigate(alert.poi.name, alert.poi.category); onNavigate(alert.poi); }}
              >
                Navigate
              </button>
              {alert.poi.content_url && (
                <a
                  href={alert.poi.content_url}
                  className="proximity-toast-detail"
                  onClick={(e) => e.stopPropagation()}
                >
                  Details
                </a>
              )}
            </div>
          </div>
        );
      })}

      <style jsx>{`
        .proximity-toast-container {
          position: fixed;
          top: 70px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 9999;
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: 90%;
          max-width: 420px;
          pointer-events: none;
        }

        .proximity-toast {
          pointer-events: auto;
          background: white;
          border-radius: 14px;
          box-shadow: 0 6px 30px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.04);
          padding: 0.85rem;
          cursor: pointer;
          animation: toast-slide-in 0.35s cubic-bezier(0.21, 1.02, 0.73, 1);
          position: relative;
          overflow: hidden;
        }

        .proximity-toast::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--primary, #3b6978), var(--secondary, #d8973c));
        }

        @keyframes toast-slide-in {
          from { transform: translateY(-30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .proximity-toast-close {
          position: absolute;
          top: 6px;
          right: 8px;
          background: none;
          border: none;
          font-size: 1.2rem;
          color: #bbb;
          cursor: pointer;
          padding: 2px 6px;
          line-height: 1;
          z-index: 2;
        }

        .proximity-toast-close:hover {
          color: #666;
        }

        .proximity-toast-body {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .proximity-toast-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.4rem;
          flex-shrink: 0;
        }

        .proximity-toast-content {
          flex: 1;
          min-width: 0;
        }

        .proximity-toast-label {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #999;
          font-weight: 600;
          font-family: var(--font-primary, 'Montserrat', sans-serif);
        }

        .proximity-toast-name {
          font-size: 1rem;
          font-weight: 700;
          color: var(--dark, #204051);
          font-family: var(--font-primary, 'Montserrat', sans-serif);
          line-height: 1.2;
          margin: 1px 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .proximity-toast-dist {
          font-size: 0.8rem;
          color: var(--primary, #3b6978);
          font-weight: 600;
        }

        .proximity-toast-actions {
          display: flex;
          gap: 6px;
          margin-top: 0.6rem;
        }

        .proximity-toast-nav {
          flex: 1;
          background: var(--primary, #3b6978);
          color: white;
          border: none;
          padding: 0.45rem 0;
          border-radius: 7px;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          font-family: var(--font-primary, 'Montserrat', sans-serif);
        }

        .proximity-toast-detail {
          flex: 1;
          background: #f0f0f0;
          color: var(--dark, #204051);
          text-align: center;
          padding: 0.45rem 0;
          border-radius: 7px;
          font-size: 0.8rem;
          font-weight: 600;
          text-decoration: none;
          font-family: var(--font-primary, 'Montserrat', sans-serif);
        }

        @media (max-width: 768px) {
          .proximity-toast-container {
            top: auto;
            bottom: calc(var(--bottom-nav-height, 65px) + 8px);
            width: 94%;
          }
        }
      `}</style>
    </div>
  );
}
