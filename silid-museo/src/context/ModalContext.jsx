import React, { createContext, useContext, useState } from 'react';

const ModalContext = createContext(null);

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}

export function ModalProvider({ children }) {
  const [modal, setModal] = useState({
    isOpen: false,
    type: 'alert', // 'alert' | 'confirm'
    title: '',
    message: '',
    onConfirm: null,
    onCancel: null,
  });

  const showAlert = (message, title = 'Notification') => {
    return new Promise((resolve) => {
      setModal({
        isOpen: true,
        type: 'alert',
        title,
        message,
        onConfirm: () => {
          setModal((prev) => ({ ...prev, isOpen: false }));
          resolve(true);
        },
        onCancel: null,
      });
    });
  };

  const showConfirm = (message, title = 'Confirmation Required') => {
    return new Promise((resolve) => {
      setModal({
        isOpen: true,
        type: 'confirm',
        title,
        message,
        onConfirm: () => {
          setModal((prev) => ({ ...prev, isOpen: false }));
          resolve(true);
        },
        onCancel: () => {
          setModal((prev) => ({ ...prev, isOpen: false }));
          resolve(false);
        },
      });
    });
  };

  return (
    <ModalContext.Provider value={{ showAlert, showConfirm }}>
      {children}
      {modal.isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Glassmorphic backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={modal.type === 'alert' ? modal.onConfirm : modal.onCancel}
          />

          {/* Modal Container */}
          <div
            className="relative w-full max-w-md transform rounded-2xl border p-6 shadow-2xl scale-100"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-brown)',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px var(--accent-gold-glow)',
            }}
          >
            {/* Medieval Style Title */}
            <h3
              className="text-lg font-bold font-heading mb-3 border-b pb-2 tracking-wide text-center"
              style={{ color: 'var(--text-primary)', borderColor: 'var(--border-subtle)' }}
            >
              {modal.title}
            </h3>

            {/* Message Body */}
            <p
              className="text-sm font-sans leading-relaxed text-center mb-6"
              style={{ color: 'var(--text-secondary)' }}
            >
              {modal.message}
            </p>

            {/* Action Buttons */}
            <div className="flex justify-center gap-3">
              {modal.type === 'confirm' && (
                <button
                  type="button"
                  onClick={modal.onCancel}
                  className="px-4 py-2 text-xs font-semibold rounded-lg border transition-all duration-200 cursor-pointer"
                  style={{
                    borderColor: 'var(--border-brown)',
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    color: 'var(--text-secondary)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.borderColor = 'var(--text-muted)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)';
                    e.currentTarget.style.borderColor = 'var(--border-brown)';
                  }}
                >
                  Cancel
                </button>
              )}
              <button
                type="button"
                onClick={modal.onConfirm}
                className="px-5 py-2 text-xs font-semibold rounded-lg transition-all duration-200 shadow-md cursor-pointer"
                style={{
                  background: 'var(--gradient-accent)',
                  color: '#ffffff',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.filter = 'brightness(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.filter = 'none';
                }}
              >
                {modal.type === 'confirm' ? 'Confirm' : 'OK'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
}
