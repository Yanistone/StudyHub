import { useEffect, useRef, useState } from "react";

export default function Toast({
  title = "",
  message = "",
  duration = 5000,
  onClose = () => {},
  position = "top-right",
  showIcon = true,
  persistent = false, // si true ou duration=0 => pas d'autoclose ni de barre
}) {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0); // 0 -> 1
  const [paused, setPaused] = useState(false);

  // refs pour l'animation
  const rafRef = useRef(null);
  const lastTimeRef = useRef(null);
  const elapsedRef = useRef(0); // en ms

  // Fermeture avec petite anim
  function handleClose() {
    setVisible(false);
    // laisse la transition se jouer
    setTimeout(() => onClose && onClose(), 220);
  }

  // Boucle d'animation de la barre + autoclose
  useEffect(() => {
    if (persistent || duration === 0 || !visible) return;

    // (Ré)initialise le frame si non en pause
    const loop = (now) => {
      if (!lastTimeRef.current) lastTimeRef.current = now;

      if (!paused) {
        const delta = now - lastTimeRef.current;
        elapsedRef.current += delta;

        const p = Math.min(elapsedRef.current / duration, 1);
        setProgress(p);

        if (p >= 1) {
          handleClose();
          lastTimeRef.current = null;
          return;
        }
      }

      lastTimeRef.current = now;
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTimeRef.current = null;
    };
  }, [duration, persistent, paused, visible]);

  // Survol : pause + reset progression à 0
  function handleMouseEnter() {
    if (persistent || duration === 0) return;
    setPaused(true);
    elapsedRef.current = 0;
    setProgress(0);
  }

  // Fin de survol : reprise depuis 0
  function handleMouseLeave() {
    if (persistent || duration === 0) return;
    setPaused(false);
  }

  const posClassMap = {
    "top-right": "toast-top-right",
    "top-left": "toast-top-left",
    "bottom-right": "toast-bottom-right",
    "bottom-left": "toast-bottom-left",
  };

  return (
    <>
      <style>{`
        .toast-container {
          position: fixed;
          z-index: 9999;
          max-width: 350px;
        }
        .toast-top-right { top: 1.5rem; right: 1.5rem; }
        .toast-top-left { top: 1.5rem; left: 1.5rem; }
        .toast-bottom-right { bottom: 1.5rem; right: 1.5rem; }
        .toast-bottom-left { bottom: 1.5rem; left: 1.5rem; }

        .toast {
          transform-origin: bottom right;
          transition: all 0.2s ease-out;
        }
        .toast-show { opacity: 1; transform: translateY(0) scale(1); }
        .toast-hide { opacity: 0; transform: translateY(8px) scale(0.95); }

        .toast-content {
          display: flex;
          align-items: center;
          gap: 12px;
          background-color: #111827;
          color: #ffffff;
          border-radius: 10px;
          padding: 12px 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          position: relative;
          overflow: hidden; /* pour le progress bar */
        }

        .toast-icon { flex-shrink: 0; margin-top: 2px; }
        .toast-dot {
          display: inline-block;
          width: 12px; height: 12px;
          border-radius: 50%;
          background-color: #ffffff;
        }

        .toast-text { flex: 1; min-width: 0; text-align: left; }
        .toast-title {
          font-size: 14px; font-weight: 600; line-height: 1.2;
          margin-bottom: 4px; color: #ffffff;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .toast-message { font-size: 13px; line-height: 1.4; color: #e6edf3; }

        .toast-close {
          background: none; border: none; font-size: 18px;
          font-weight: bold; color: #ffffff; cursor: pointer;
          padding: 0; line-height: 1;
        }
        .toast-close:focus { outline: none; }

        /* Barre de progression (en bas du toast) */
        .toast-progress {
          position: absolute;
          left: 0; right: 0; bottom: 0;
          height: 3px;
          background: rgba(255, 255, 255, 0.15);
        }
        .toast-progress-fill {
          height: 100%;
          width: 100%;
          background: #4ade80;
          transition: width 80ms linear;
          transform-origin: right;
        }
      `}</style>

      <div
        aria-live="polite"
        aria-atomic="true"
        className={`toast-container ${
          posClassMap[position] || "toast-bottom-right"
        }`}
      >
        <div
          role="status"
          className={`toast ${visible ? "toast-show" : "toast-hide"}`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className={`toast-content ${paused ? "paused" : ""}`}>
            {showIcon && (
              <div className="toast-icon" aria-hidden>
                <span className="toast-dot" />
              </div>
            )}

            <div className="toast-text">
              {title && <div className="toast-title">{title}</div>}
              {message && <div className="toast-message">{message}</div>}
            </div>

            <button
              onClick={handleClose}
              aria-label="Fermer la notification"
              className="toast-close"
            >
              ×
            </button>

            {!(persistent || duration === 0) && (
              <div className="toast-progress" aria-hidden>
                <div
                  className="toast-progress-fill"
                  style={{ width: `${Math.round((1 - progress) * 100)}%` }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
