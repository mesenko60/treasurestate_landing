import React from 'react';
import { getCategoryInfo, POI_CATEGORIES } from '../../lib/nearbyApi';

const ALERT_DISTANCE_OPTIONS = [
  { label: '¼ mi', value: 402 },
  { label: '½ mi', value: 805 },
  { label: '1 mi', value: 1609 },
  { label: '2 mi', value: 3219 },
  { label: '5 mi', value: 8047 },
];

export interface AlertSettings {
  enabled: boolean;
  triggerDistance: number;
  alertCategories: Set<string>;
  soundEnabled: boolean;
}

export const DEFAULT_ALERT_SETTINGS: AlertSettings = {
  enabled: false,
  triggerDistance: 1609,
  alertCategories: new Set(['historic_marker', 'hot_spring', 'state_park', 'waterfall', 'ski_area', 'wildlife_viewing']),
  soundEnabled: true,
};

export function loadAlertSettings(): AlertSettings {
  if (typeof window === 'undefined') return { ...DEFAULT_ALERT_SETTINGS };
  try {
    const raw = localStorage.getItem('nearby-alert-settings');
    if (!raw) return { ...DEFAULT_ALERT_SETTINGS };
    const parsed = JSON.parse(raw);
    return {
      enabled: !!parsed.enabled,
      triggerDistance: parsed.triggerDistance || DEFAULT_ALERT_SETTINGS.triggerDistance,
      alertCategories: new Set(parsed.alertCategories || Array.from(DEFAULT_ALERT_SETTINGS.alertCategories)),
      soundEnabled: parsed.soundEnabled !== false,
    };
  } catch {
    return { ...DEFAULT_ALERT_SETTINGS };
  }
}

export function saveAlertSettings(settings: AlertSettings) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('nearby-alert-settings', JSON.stringify({
    enabled: settings.enabled,
    triggerDistance: settings.triggerDistance,
    alertCategories: Array.from(settings.alertCategories),
    soundEnabled: settings.soundEnabled,
  }));
}

export default function AlertPreferences({
  settings,
  onUpdate,
  open,
  onClose,
}: {
  settings: AlertSettings;
  onUpdate: (settings: AlertSettings) => void;
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  const update = (partial: Partial<AlertSettings>) => {
    const next = { ...settings, ...partial };
    onUpdate(next);
    saveAlertSettings(next);
  };

  const toggleAlertCategory = (cat: string) => {
    const next = new Set(settings.alertCategories);
    if (next.has(cat)) next.delete(cat);
    else next.add(cat);
    update({ alertCategories: next });
  };

  const allCategories = Object.keys(POI_CATEGORIES);

  return (
    <div className="alert-prefs-overlay" onClick={onClose}>
      <div className="alert-prefs-panel" onClick={(e) => e.stopPropagation()}>
        <div className="alert-prefs-header">
          <h3>Pop-up Alerts</h3>
          <button className="alert-prefs-close" onClick={onClose}>×</button>
        </div>

        <div className="alert-prefs-row">
          <div className="alert-prefs-row-text">
            <strong>Enable proximity alerts</strong>
            <span>Get pop-up notifications when you approach a point of interest</span>
          </div>
          <label className="alert-toggle">
            <input
              type="checkbox"
              checked={settings.enabled}
              onChange={(e) => update({ enabled: e.target.checked })}
            />
            <span className="alert-toggle-slider" />
          </label>
        </div>

        <div className="alert-prefs-row">
          <div className="alert-prefs-row-text">
            <strong>Sound</strong>
            <span>Play a chime when an alert fires</span>
          </div>
          <label className="alert-toggle">
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={(e) => update({ soundEnabled: e.target.checked })}
            />
            <span className="alert-toggle-slider" />
          </label>
        </div>

        <div className="alert-prefs-section">
          <strong>Alert me within</strong>
          <div className="alert-prefs-distance-row">
            {ALERT_DISTANCE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                className={`alert-prefs-dist-btn${settings.triggerDistance === opt.value ? ' active' : ''}`}
                onClick={() => update({ triggerDistance: opt.value })}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="alert-prefs-section">
          <strong>Alert me about</strong>
          <div className="alert-prefs-cats">
            {allCategories.map((cat) => {
              const info = getCategoryInfo(cat);
              const checked = settings.alertCategories.has(cat);
              return (
                <label key={cat} className="alert-prefs-cat-row">
                  <span className="alert-prefs-cat-icon">{info.icon}</span>
                  <span className="alert-prefs-cat-label">{info.label}</span>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleAlertCategory(cat)}
                    className="alert-prefs-cat-check"
                  />
                </label>
              );
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        .alert-prefs-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.35);
          z-index: 10000;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          animation: fade-in 0.2s;
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .alert-prefs-panel {
          background: white;
          border-radius: 20px 20px 0 0;
          width: 100%;
          max-width: 500px;
          max-height: 80vh;
          overflow-y: auto;
          padding: 1.25rem;
          animation: slide-up 0.3s cubic-bezier(0.21, 1.02, 0.73, 1);
        }

        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }

        .alert-prefs-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .alert-prefs-header h3 {
          margin: 0;
          font-family: var(--font-primary, 'Montserrat', sans-serif);
          font-size: 1.15rem;
          color: var(--dark, #204051);
        }

        .alert-prefs-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          color: #999;
          cursor: pointer;
          padding: 0.2rem 0.4rem;
          line-height: 1;
        }

        .alert-prefs-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 0;
          border-bottom: 1px solid #f0f0f0;
        }

        .alert-prefs-row-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .alert-prefs-row-text strong {
          font-size: 0.9rem;
          color: #333;
        }

        .alert-prefs-row-text span {
          font-size: 0.75rem;
          color: #999;
        }

        .alert-toggle {
          position: relative;
          width: 46px;
          height: 26px;
          flex-shrink: 0;
        }

        .alert-toggle input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .alert-toggle-slider {
          position: absolute;
          inset: 0;
          background: #ccc;
          border-radius: 13px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .alert-toggle-slider::before {
          content: '';
          position: absolute;
          width: 20px;
          height: 20px;
          left: 3px;
          top: 3px;
          background: white;
          border-radius: 50%;
          transition: transform 0.2s;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }

        .alert-toggle input:checked + .alert-toggle-slider {
          background: var(--primary, #3b6978);
        }

        .alert-toggle input:checked + .alert-toggle-slider::before {
          transform: translateX(20px);
        }

        .alert-prefs-section {
          padding: 0.75rem 0;
          border-bottom: 1px solid #f0f0f0;
        }

        .alert-prefs-section strong {
          font-size: 0.9rem;
          color: #333;
          display: block;
          margin-bottom: 0.5rem;
        }

        .alert-prefs-distance-row {
          display: flex;
          gap: 6px;
        }

        .alert-prefs-dist-btn {
          flex: 1;
          background: #f5f5f5;
          border: 1px solid #ddd;
          padding: 0.45rem 0;
          border-radius: 8px;
          font-size: 0.8rem;
          cursor: pointer;
          font-family: var(--font-primary, 'Montserrat', sans-serif);
          font-weight: 500;
          transition: all 0.15s;
          color: #555;
        }

        .alert-prefs-dist-btn.active {
          background: var(--primary, #3b6978);
          color: white;
          border-color: var(--primary, #3b6978);
        }

        .alert-prefs-cats {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .alert-prefs-cat-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0.4rem 0.5rem;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.1s;
        }

        .alert-prefs-cat-row:hover {
          background: #f8f8f8;
        }

        .alert-prefs-cat-icon {
          font-size: 1.15rem;
          width: 28px;
          text-align: center;
        }

        .alert-prefs-cat-label {
          flex: 1;
          font-size: 0.85rem;
          color: #444;
        }

        .alert-prefs-cat-check {
          width: 18px;
          height: 18px;
          accent-color: var(--primary, #3b6978);
          cursor: pointer;
        }

        @media (min-width: 769px) {
          .alert-prefs-panel {
            border-radius: 20px;
            margin-bottom: 2rem;
          }

          .alert-prefs-overlay {
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
}
