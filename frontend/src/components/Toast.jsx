import React, { useEffect, useState } from 'react';

export default function Toast({
  title = '',
  message = '',
  duration = 5000,
  onClose = () => {},
  position = 'top-right',
  showIcon = true,
  persistent = false,
}) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (persistent || duration === 0) return;
    const t = setTimeout(() => handleClose(), duration);
    return () => clearTimeout(t);
  }, []);

  function handleClose() {
    setVisible(false);
    setTimeout(() => onClose && onClose(), 220);
  }

  const posClassMap = {
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6',
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
  };

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className={`fixed z-50 ${posClassMap[position] || posClassMap['bottom-right']} max-w-sm`}
    >
      <div
        role="status"
        className={`transform transition-all duration-200 ease-out origin-bottom-right ${
          visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95'
        }`}
      >
        <div
          className="flex flex-col items-center gap-3 shadow-lg relative"
          style={{
            backgroundColor: '#111827',
            color: '#ffffff',
            borderRadius: '10px',
            padding: '10px',
          }}
        >
          {showIcon && (
            <div className="flex-shrink-0 mt-0.5" aria-hidden>
              <span
                className="inline-block w-3 h-3 rounded-full"
                style={{ backgroundColor: '#ffffff' }}
              />
            </div>
          )}

          <div className="flex-1 min-w-0 text-center">
            {title && (
              <div className="text-sm font-semibold tracking-tight truncate" style={{ color: '#ffffff' }}>
                {title}
              </div>
            )}

            {message && (
              <div className="mt-0.5 text-sm leading-snug text-slate-200" style={{ color: '#e6edf3' }}>
                {message}
              </div>
            )}
          </div>

          <button
            onClick={handleClose}
            aria-label="Fermer la notification"
            className="text-lg font-bold focus:outline-none"
            style={{ color: '#ffffff' }}
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
